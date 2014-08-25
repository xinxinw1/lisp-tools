/***** Lisp Tools Devel *****/

/* require tools >= 3.0 */

(function (win, udef){
  ////// Lisp functions //////
  
  //// Type ////
  
  function type(a){
    if (a === udef)return "udef";
    if ($.fnp(a))return "jfn";
    if ($.arrp(a)){
      if (a.length == 0)return "nil";
      if ($.strp(a[0]) && a[0][0] == "&"){
        if (a[0] === "&jfn")return "jfn2";
        return $.slc(a[0], 1);
      }
      return "lis";
    }
    if ($.objp(a))return "obj";
    if (nump(a))return "num";
    if ($.rgxp(a))return "rgx";
    if ($.strp(a))return "sym";
    err(type, "Unknown type of a = $1", a);
  }
  
  //// Predicates ////
  
  function lisp(a){
    return $.arrp(a) && !($.strp(a[0]) && a[0][0] == "&");
  }
  
  function atomp(a){
    return !lisp(a) || a.length == 0;
  }
  
  function nilp(a){
    return $.arrp(a) && a.length == 0;
  }
  
  function nump(a){
    return $.strp(a) && $.has(/^-?[0-9]+(\.[0-9]+)?$/, a);
  }
  
  function strp(a){
    return $.arrp(a) && a[0] === "&str";
  }
  
  function objp(a){
    return $.objp(a);
  }
  
  function arrp(a){
    return $.arrp(a) && a[0] === "&arr";
  }
  
  function rgxp(a){
    return $.rgxp(a);
  }
  
  function fnp(a){
    return $.fnp(a) || $.arrp(a) && $.inp(a[0], "&fn", "&jfn", "&jfn2");
  }
  
  function specp(a){
    return $.arrp(a) && $.inp(a[0], "&mac", "&spec");
  }
  
  function procp(a){
    return fnp(a) || specp(a);
  }
  
  function symp(a){
    return $.strp(a) && !nump(a);
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
  
  function mkcxr(a){
    a = rembds(a);
    return mkcxr2($.self, a, $.len(a)-1);
  }
  
  function mkcxr2(f, a, pos){
    if (pos == -1)return f;
    if (a[pos] == "a")return mkcxr2(mkcar(f), a, pos-1);
    if (a[pos] == "d")return mkcxr2(mkcdr(f), a, pos-1);
    err(mkcxr2, "a = $1 must only contain a's and d's", a);
  }
  
  function mkcar(f){
    return function (a){
      return car(f(a));
    };
  }
  
  function mkcdr(f){
    return function (a){
      return cdr(f(a));
    };
  }
  
  //// Comparison ////
  
  function is(a, b){
    if (a === b || nilp(a) && nilp(b))return true;
    if (strp(a) && strp(b))return a[1] === b[1];
    if (rgxp(a) && rgxp(b))return $.iso(a, b);
    return false;
  }
  
  function iso(a, b){
    if (is(a, b))return true;
    if (lisp(a) && lisp(b))return isocons(a, b);
    if (arrp(a) && arrp(b))return $.iso(a[1], b[1]);
    return false;
  }
  
  function isocons(a, b){
    return iso(car(a), car(b)) && iso(cdr(a), cdr(b));
  }
  
  //// Display ////
  
  var disps = [];
  function disp(a){
    return $.dyn(disps, a, function (){
      return disp1(a);
    });
  }
  
  function disp1(a){
    var tp = type(a);
    switch (tp){
      case "jfn": return $.disp(a);
      case "jfn2": return "<jfn2 " + disp(a[1]) + " " + disp(a[2]) + ">";
      case "fn": return "<fn " + disp(a[1]) + " " + disp(a[2]) + ">";
      case "mac": return "<mac " + disp(cdr(a)) + ">";
      case "spec": return "<spec " + disp(cdr(a)) + ">";
      case "str": return $.disp(a[1]);
      case "rgx": return disprgx(a);
      case "obj": return dispobj(a);
      case "arr": return disparr(a);
      case "nil": return "()";
      case "lis": return displis(a);
      case "num":
      case "sym": return a;
      case "udef": return "udef";
    }
    err(disp1, "Cannot display a = $1 with type tp = $2", a, tp);
  }
  
  function disprgx(a){
    return "#\"" + $.rpl("\"", "\\\"", a.source) + "\"";
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
  
  //// Converters ////
  
  function tsym(a){
    if (symp(a))return a;
    if (strp(a))return a[1];
    return [];
  }
  
  function tstr(a){
    if (strp(a))return a;
    if (symp(a) || nump(a))return ["&str", a];
    return ["&str", disp(a)];
  }
  
  function tnum(a){
    if (nump(a))return a;
    if (symp(a))return sym2num(a);
    if (strp(a))return sym2num(a[1]);
    return "0";
  }
  
  function sym2num(a){
    var s = $.mtch(/^-?[0-9]+(\.[0-9]+)?/, a);
    return (s == -1)?"0":s;
  }
  
  //// Polymorphic ////
  
  function len(a){
    if (lisp(a))return lenlis(a);
    if (arrp(a) || strp(a))return $.len(a[1]);
    if (objp(a) || symp(a))return $.len(a);
    err(len, "Can't get len of a = $1", a);
  }
  
  function lenlis(a){
    if (nilp(a))return 0;
    return lenlis(cdr(a))+1;
  }
  
  function pos(x, a, n){
    if (lisp(a))return poslis(x, nthcdr(n, a));
    err(pos, "Can't get pos of x = $1 in a = $2 from n = $3", x, a, n);
  }
  
  function poslis(x, a, n){
    if (n === udef)n = 0;
    if (nilp(a))return [];
    if (is(car(a), x))return n;
    return poslis(x, cdr(a), n+1);
  }
  
  //// List ////
  
  function list(){
    var a = arguments;
    var r = [];
    for (var i = $.len(a)-1; i >= 0; i--){
      r = cons(a[i], r);
    }
    return r;
  }
  
  function apd(a, b){
    if (nilp(a))return b;
    if (nilp(b))return a;
    if (atomp(a))err(apd, "a = $1 must be a list", a);
    return cons(car(a), apd(cdr(a), b));
  }
  
  function pair(a, b){
    if (nilp(a))return [];
    if (atomp(a))return list(cons(a, b));
    if (car(a) == "o")return list(cons(cadr(a), nilp(b)?nth(2, a):b));
    return apd(pair(car(a), car(b)), pair(cdr(a), cdr(b)));
  }
  
  function map(f, a){
    if (nilp(a))return [];
    return cons(f(car(a)), map(f, cdr(a)));
  }
  
  function join(a, x){
    if (x === udef)x = "";
    if (nilp(a))return "";
    return car(a) + join2(cdr(a), x);
  }
  
  function join2(a, x){
    if (nilp(a))return "";
    return x + car(a) + join2(cdr(a), x);
  }
  
  function nth(n, a){
    if (n == 0)return car(a);
    return nth(n-1, cdr(a));
  }
  
  function nthcdr(n, a){
    if (n == 0)return a;
    return nthcdr(n-1, cdr(a));
  }
  
  function has(x, a){
    if (nilp(a))return false;
    if (is(car(a), x))return true;
    return has(x, cdr(a));
  }
  
  //// Boolean converters ////
  
  function bool(a){
    return (a === false)?[]:"t";
  }
  
  function booler(f){
    return function (){
      return bool($.apply(f, arguments));
    };
  }
  
  //// Error ////
  
  // special handler that uses disp(a)
  function err(f, a){
    var args = arguments;
    for (var i = 2; i < args.length; i++){
      a = $.rpl("$" + (i-1), disp(args[i]), a);
    }
    throw "Error: " + $.head(f) + ": " + a;
  }
  
  //// Other ////
  
  function doLisp(){
    return $.last(arguments);
  }
  
  ////// Object exposure //////
  
  win.Lisp = {
    type: type,
    
    lisp: lisp,
    atomp: atomp,
    nilp: nilp,
    nump: nump,
    strp: strp,
    objp: objp,
    arrp: arrp,
    rgxp: rgxp,
    fnp: fnp,
    specp: specp,
    procp: procp,
    symp: symp,
    
    car: car,
    cdr: cdr,
    cons: cons,
    
    caar: caar,
    cadr: cadr,
    cdar: cdar,
    cddr: cddr,
    mkcxr: mkcxr,
    
    is: is,
    iso: iso,
    
    disp: disp,
    
    tsym: tsym,
    tstr: tstr,
    tnum: tnum,
    
    len: len,
    pos: pos,
    
    list: list,
    apd: apd,
    pair: pair,
    map: map,
    join: join,
    nth: nth,
    nthcdr: nthcdr,
    has: has,
    bool: bool,
    booler: booler,
    
    err: err,
    
    do: doLisp
  };
  
  ////// Testing //////
  
  
  
})(window);
