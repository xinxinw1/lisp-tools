/***** Lisp Display Devel *****/

/* require tools >= 3.0 */
/* require lisp-parse */

(function (win, udef){
  ////// Lisp functions //////
  
  //// Predicates ////
  
  function consp(a){
    return $.arrp(a) && !($.strp(a[0]) && a[0][0] == "&");
  }
  
  function atomp(a){
    return !consp(a) || a.length == 0;
  }
  
  function nilp(a){
    return $.arrp(a) && a.length == 0;
  }
  
  function nump(a){
    return $.strp(a) && $.has(/^-?[0-9]+(\.[0-9]+)?$/, a);
  }
  
  //// Basic ////
  
  function car(a){
    return (a[0] !== udef)?a[0]:[];
  }
  
  function cdr(a){
    return (a[1] !== udef)?a[1]:[];
  }
  
  function cons(a, b){
    return [a, b];
  }
  
  //// car and cdr extensions ////
  
  function caar(a){
    return car(car(a));
  }
  
  function cadr(a){
    return car(cdr(a));
  }
  
  function cdar(a){
    return cdr(car(a));
  }
  
  function cddr(a){
    return cdr(cdr(a));
  }
  
  //// General ////
  
  function type(a){
    if ($.fnp(a))return "jfn";
    if ($.arrp(a)){
      if (a.length == 0)return "nil";
      if ($.strp(a[0]) && a[0][0] == "&"){
        if (a[0] === "&jfn")return "jfn2";
        return $.slc(a[0], 1);
      }
      if (!consp(cdr(a)))return "pair";
      return "cons";
    }
    if ($.objp(a))return "obj";
    if (nump(a))return "num";
    if ($.strp(a))return "sym";
    if ($.udefp(a))return "udef";
    err(type, "Unknown type of a = $1", a);
  }
  
  function has(x, a){
    if (nilp(a))return false;
    if (is(car(a), x))return true;
    return has(x, cdr(a));
  }
  
  function is(a, b){
    return a === b || nilp(a) && nilp(b);
  }
  
  ////// Lisp display //////
  
  var disps = [];
  function disp(a){
    return $.dyn(disps, a, function (){
      return disp1(a);
    });
  }
  
  function disp1(a){
    var tp = type(a);
    switch (tp){
      case "str": return $.disp(a[1]);
      case "jfn": return $.disp(a);
      case "jfn2": return "<jfn2 " + disp(a[1]) + " " + disp(a[2]) + ">";
      case "fn": return "<fn " + disp(a[1]) + " " + disp(a[2]) + ">";
      case "mac": return "<mac " + disp(cdr(a)) + ">";
      case "spec": return "<spec " + disp(cdr(a)) + ">";
      case "obj": return dispobj(a);
      case "arr": return disparr(a);
      case "nil": return "()";
      case "cons":
      case "pair": return displis(a);
      case "num":
      case "sym": return a;
      case "udef": return "udef";
    }
    err(disp1, "Cannot display a = $1 with type tp = $2", a, tp);
  }
  
  function dispobj(a){
    if (has(a, cdr(disps)))return "{...}";
    var r = [];
    for (var i in a){
      r.push(disp(i) + " " + disp(a[i]));
    }
    return "{" + r.join(" ") + "}";
  }
  
  function disparr(a){
    if (has(a, cdr(disps)))return "#[...]";
    var s = "#[";
    if (a[1].length > 0){
      s += disp(a[1][0]);
      for (var i = 1; i < a[1].length; i++){
        s += " " + disp(a[1][i]);
      }
    }
    s += "]";
    return s;
  }
  
  var dlists = [];
  function displis(a){
    if (has(a, cdr(disps)))return "(...)";
    switch (car(a)){
      case "qt": return "'" + disp(cadr(a));
      case "qq": return "`" + disp(cadr(a));
      case "uq": return "~" + disp(cadr(a));
      case "uqs": return "~@" + disp(cadr(a));
      case "not": return "!" + disp(cadr(a));
    }
    return "(" + $.dyn(dlists, a, function (){
      return displis2(a);
    }) + ")";
  }
  
  // displis2( '(1 2 3 4 . 5) ) -> "1 2 3 4 . 5"
  function displis2(a){
    if (nilp(cdr(a)))return disp(car(a));
    if (atomp(cdr(a)))return disp(car(a)) + " . " + disp(cdr(a));
    if (has(a, cdr(dlists)))return disp(car(a)) + " . (...)";
    return disp(car(a)) + " " + displis2(cdr(a));
  }
  
  ////// Error handling //////
  
  // special handler that uses disp(a)
  function err(f, a){
    var args = arguments;
    for (var i = 2; i < args.length; i++){
      a = $.rpl("$" + (i-1), disp(args[i]), a);
    }
    throw "Error: " + $.head(f) + ": " + a;
  }
  
  ////// Object exposure //////
  
  $.apd({
    disp: disp,
    err: err
  }, Lisp);
  
  ////// Testing //////
  
  
  
})(window);
