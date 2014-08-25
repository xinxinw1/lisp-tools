/***** Lisp Tools Devel *****/

/* require tools >= 3.1 */
/* require prec-math */

(function (win, udef){
  ////// Lisp functions //////
  
  //// Type ////
  
  function type(a){
    if ($.arrp(a)){
      if ($.len(a) == 0)return "nil";
      if (a[0] === "&")return a[1];
      return "lis";
    }
    if ($.strp(a)){
      if ($.has(/^-?[0-9]+(\.[0-9]+)?$/, a))return "num";
      return "sym";
    }
    if ($.objp(a))return "obj";
    if ($.rgxp(a))return "rgx";
    if ($.udefp(a))return "udef";
    if ($.fnp(a))return "jfn";
    err(type, "Unknown type of a = $1", a);
  }
  
  function tag(x){
    var a = arguments;
    if ($.len(a) == 2 && is(type(a[1]), x))return a[1];
    return $.add(["&", x], $.slc(a, 1));
  }
  
  function rep(a, n){
    if (udefp(n))n = "0";
    if (tagp(a))return a[R.add(n, "2")];
    return a;
  }
  
  function tagarr(a){
    return tag("arr", a);
  }
  
  function tagstr(a){
    return tag("str", a);
  }
  
  function taglike(x, a){
    return tag(type(x), a);
  }
  
  function tagfn(x){
    return function (a){
      return taglike(x, a);
    };
  }
  
  //// Predicates ////
  
  function nilp(a){
    return $.arrp(a) && $.len(a) == 0;
  }
  
  function lisp(a){
    return $.arrp(a) && a[0] !== "&";
  }
  
  function atomp(a){
    return !lisp(a) || $.len(a) == 0;
  }
  
  function nump(a){
    return $.strp(a) && $.has(/^-?[0-9]+(\.[0-9]+)?$/, a);
  }
  
  function symp(a){
    return $.strp(a) && !$.has(/^-?[0-9]+(\.[0-9]+)?$/, a);
  }
  
  function objp(a){
    return $.objp(a);
  }
  
  function rgxp(a){
    return $.rgxp(a);
  }
  
  function udefp(a){
    return $.udefp(a);
  }
  
  function tagp(a){
    return $.arrp(a) && a[0] === "&";
  }
  
  function strp(a){
    return tagp(a) && a[1] === "str";
  }
  
  function arrp(a){
    return tagp(a) && a[1] === "arr";
  }
  
  function jfnp(a){
    return $.fnp(a);
  }
  
  function jfn2p(a){
    return tagp(a) && a[1] === "jfn2";
  }
  
  function lfnp(a){
    return tagp(a) && a[1] === "fn";
  }
  
  function fnp(a){
    return jfnp(a) || tagp(a) && $.inp(a[1], "fn", "jfn2");
  }
  
  function specp(a){
    return tagp(a) && $.inp(a[1], "mac", "spec");
  }
  
  function procp(a){
    return fnp(a) || specp(a);
  }
  
  function gstrp(a){
    return $.strp(a) || strp(a);
  }
  
  //// Comparison ////
  
  function is(a, b){
    if (a === b || nilp(a) && nilp(b))return true;
    if (strp(a) && strp(b))return rep(a) === rep(b);
    if (rgxp(a) && rgxp(b))return $.iso(a, b);
    return false;
  }
  
  function iso(a, b){
    if (is(a, b))return true;
    if (lisp(a) && lisp(b))return isolis(a, b);
    if (arrp(a) && arrp(b))return $.iso(rep(a), rep(b));
    return false;
  }
  
  function isolis(a, b){
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
      case "nil": return "()";
      case "lis": return displis(a);
      case "num":
      case "sym": return a;
      case "obj": return dispobj(a);
      case "rgx": return disprgx(a);
      case "udef": return "udef";
      case "str": return $.disp(rep(a));
      case "arr": return disparr(a);
      case "fn": return "<fn " + disp(rep(a, "0")) + " "
                               + disp(rep(a, "1")) + ">";
      case "jfn": return $.disp(a);
    }
    if (tagp(a))return "<" + $.join($.map(disp, $.slc(a, 1)), " ") + ">";
    err(disp1, "Cannot display a = $1 with type tp = $2", a, tp);
  }
  
  function disprgx(a){
    return "#\"" + $.rpl("\"", "\\\"", a.source) + "\"";
  }
  
  function dispobj(a){
    if (has(a, cdr(disps)))return "{...}";
    var r = [];
    for (var i in a){
      $.push(disp(i) + " " + disp(a[i]), r);
    }
    return "{" + $.join(r, " ") + "}";
  }
  
  function disparr(a){
    if (has(a, cdr(disps)))return "#[...]";
    return "#[" + $.reduc(function (s, x){
      if (s == "")return disp(x);
      return s + " " + disp(x);
    }, "", rep(a)) + "]";
  }
  
  var dlists = [];
  function displis(a){
    if (has(a, cdr(disps)))return "(...)";
    switch (car(a)){
      case "qt": return "'" + disp(cadr(a));
      case "qq": return "`" + disp(cadr(a));
      case "uq": return "," + disp(cadr(a));
      case "uqs": return ",@" + disp(cadr(a));
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
  
  //// Output ////
  
  var outfunc = function (a){return [];}
  
  function outfn(f){
    if (udefp(f))return outfunc;
    return outfunc = f;
  }
  
  function ou(a){
    return outfunc(a);
  }
  
  function out(a){
    return outfunc(a + "\n");
  }
  
  function pr(a){
    if (udefp(a))return ou("");
	  return ou(disp(a));
	}
	
	function prn(a){
	  if (udefp(a))return out("");
	  return out(disp(a));
	}
  
  //// Converters ////
  
  function sym(a){
    if (symp(a))return a;
    if (strp(a))return rep(a);
    return [];
  }
  
  function str(){
    return join(arguments);
  }
  
  function str1(a){
    if (strp(a))return a;
    if (symp(a) || nump(a))return tagstr(a);
    return tagstr(disp(a));
  }
  
  function num(a){
    if (nump(a))return a;
    if (symp(a))return sym2num(a);
    if (strp(a))return sym2num(rep(a));
    return "0";
  }
  
  function sym2num(a){
    var s = $.mtch(/^-?[0-9]+(\.[0-9]+)?/, a);
    return (s == -1)?"0":s;
  }
  
  function tarr(a){
    if (arrp(a))return a;
    if (lisp(a))return tagarr(lis2arr(a));
    if (symp(a))return tagarr($.tarr(a));
    if (strp(a))return tagarr(map(tagstr, $.tarr(rep(a))));
    err(tarr, "Can't coerce a = $1 to arr", a);
  }
  
  function lis2arr(a, r){
    if (udefp(r))r = [];
    if (nilp(a))return r;
    r.push(car(a));
    return lis2arr(cdr(a), r);
  }
  
  function tlis(a){
    if (lisp(a))return a;
    if (arrp(a))return arr2lis(rep(a));
    if (symp(a) || strp(a))return arr2lis(rep(tarr(a)));
    if (objp(a)){
      var l = [];
      for (var i in a){
        push(cons(i, a[i]), l);
      }
      return l;
    }
    err(tlis, "Can't coerce a = $1 to lis", a);
  }
  
  function arr2lis(a){
    return $.apply(lis, a);
  }
  
  function tobj(a){
    if (objp(a))return a;
    if (lisp(a))return lis2obj(a);
    if (arrp(a))return tobj(tlis(a));
    if (symp(a))return $.tobj(a);
    if (strp(a))return $.map(tagstr, $.tobj(rep(a)));
    err(tobj, "Can't coerce a = $1 to obj", a);
  }
  
  function lis2obj(a, o){
    if (udefp(o))o = {};
    if (nilp(a))return o;
    o[prop(caar(a))] = cdar(a);
    return lis2obj(cdr(a), o);
  }
  
  function prop(a){
    if (symp(a) || nump(a))return a;
    if (strp(a))return rep(a);
    err(prop, "Invalid obj prop name a = $1", a);
  }
  
  function jstrarr(a){
    if (symp(a) || nump(a) || rgxp(a))return a;
    if (strp(a))return rep(a);
    if (arrp(a))return $.map(rep, rep(a));
    if (lisp(a))return $.map(rep, lis2arr(a));
    err(jstrarr, "Can't coerce a = $1 to jstrarr", a);
  }
  
  function js(a){
    if (objp(a) || symp(a) || nump(a) || rgxp(a))return a;
    if (strp(a) || arrp(a))return rep(a);
    if (lisp(a))return lis2arr(a);
    err(js, "Can't coerce a = $1 to js", a);
  }
  
  function lnumlis(a){
    if ($.arrp(a))return arr2lis($.map($.str, a));
    err(lnumlis, "Can't coerce a = $1 to lnumlis", a);
  }
  
  //// Polymorphic ////
  
  function len(a){
    if (lisp(a))return lenlis(a);
    if (gstrp(a) || arrp(a) || objp(a))return $.str($.len(js(a)));
    err(len, "Can't get len of a = $1", a);
  }
  
  function lenlis(a){
    if (nilp(a))return "0";
    return R.add(lenlis(cdr(a)), "1");
  }
  
  function ref(a, n){
    if (lisp(a))return nth(n, a);
    if (arrp(a) || gstrp(a))return $.ref(js(a), $.num(n));
    if (objp(a))return $.ref(a, n);
    err(ref, "Can't get item n = $1 of a = $2", n, a);
  }
  
  function pos(x, a, n){
    if (udefp(n))n = "0";
    if (lisp(a))return poslis(x, ncdr(n, a));
    if (arrp(a) || objp(a))return $.str($.pos(x, js(a), $.num(n)));
    if (gstrp(a))return $.str($.pos(jstrarr(x), js(a), $.num(n)));
    err(pos, "Can't get pos of x = $1 in a = $2 from n = $3", x, a, n);
  }
  
  function poslis(x, a, n){
    if (udefp(n))n = "0";
    if (nilp(a))return [];
    if (is(car(a), x))return n;
    return poslis(x, cdr(a), R.add(n, "1"));
  }
  
  function posl(x, a, n){
    if (udefp(n))n = len(a);
    if (lisp(a))return posllis(x, fstn(R.add(n, "1"), a));
    if (arrp(a) || objp(a))return $.str($.posl(x, js(a), $.num(n)));
    if (gstrp(a))return $.str($.posl(jstrarr(x), js(a), $.num(n)));
    err(posl, "Can't get last pos of x = $1 in a = $2 from n = $3", x, a, n);
  }
  
  function posllis(x, a, n, l){
    if (udefp(n))n = "0";
    if (udefp(last))l = "-1";
    if (nilp(a))return l;
    return posllis(x, cdr(a), R.add(n, "1"), is(car(a), x)?n:l);
  }
  
  function rpl(x, y, a){
    if (lisp(a))return rplis(x, y, a);
    if (gstrp(a))return taglike(a, $.rpl(jstrarr(x), jstrarr(y), js(a)));
    if (arrp(a) || objp(a))return taglike(a, $.rpl(x, y, js(a)));
    err(rpl, "Can't rpl x = $1 with y = $2 in a = $3", x, y, a);
  }
  
  function rplis(x, y, a){
    if (nilp(a))return [];
    return cons(is(car(a), x)?y:car(a), rplis(x, y, cdr(a)));
  }
  
  function slc(a, n, m){
    if (lisp(a))return ncdr(n, udefp(m)?a:fstn(m, a));
    if (gstrp(a) || arrp(a) || objp(a)){
      return taglike(a, $.slc(js(a), $.num(n), $.num(m)));
    }
    err(slc, "Can't slice a = $1 from n = $2 to m = $3", a, n, m);
  }
  
  function poss(x, a){
    if (lisp(a))return posslis(x, a);
    if (arrp(a) || objp(a))return lnumlis($.poss(x, js(a)));
    if (gstrp(a))return lnumlis($.poss(jstrarr(x), js(a)));
    err(poss, "Can't get poses of x = $1 in a = $2", x, a);
  }
  
  function posslis(x, a, n, l){
    if (udefp(n))n = "0";
    if (udefp(l))l = [];
    if (nilp(a))return l;
    return posslis(x, a, R.add(n, "1"), is(car(a), x)?cons(n, l):l);
  }
  
  function add(){
    var a = arguments;
    if ($.len(a) == 0)return "0";
    return $.reduc1(add2, a);
  }
  
  function add2(a, b){
    if (nump(a))return R.add(a, tnum(b));
    if (lisp(a))return addlis(a, b);
    if (strp(a))return tagstr($.add(js(a), js(str(b))));
    if (symp(a))return $.add(a, sym(b));
    if (objp(a))return $.add(a, tobj(b));
    if (arrp(a))return tagarr($.add(js(a), js(tarr(b))));
    if ($.fnp(a) && $.fnp(b))return $.add(a, b);
    err(add2, "Can't add a = $1 to b = $2", a, b);
  }
  
  function addlis(a, b){
    if (nilp(a))return b;
    if (nilp(b))return a;
    if (atomp(a))err(addlis, "a = $1 must be a list", a);
    return cons(car(a), addlis(cdr(a), b));
  }
  
  function rev(a){
    if (lisp(a))return revadd(a);
    if (gstrp(a) || objp(a) || arrp(a))return taglike(a, $.rev(js(a)));
    err(rev, "Can't rev a = $1", a);
  }
  
  function revadd(a, b){
    if (udefp(b))b = [];
    if (nilp(a))return b;
    return revadd(cdr(a), cons(car(a), b));
  }
  
  function grp(a, n){
    if (n !== "0"){
      if (lisp(a))return grplis(a, n);
      if (gstrp(a))return arr2lis($.map(tagfn(a), $.grp(js(a), $.num(n))));
      if (arrp(a))return tagarr($.map(tagarr, $.grp(js(a), $.num(n))));
    }
    err(grp, "Can't grp a = $1 into grps of n = $2", a, n);
  }
  
  function grplis(a, n){
    if (nilp(a))return [];
    return cons(fstn(n, a), grplis(ncdr(n, a), n));
  }
  
  function rem(x, a){
    if (lisp(a))return remlis(x, a);
    if (gstrp(a))return taglike(a, $.rem(jstrarr(x), js(a)));
    if (objp(a) || arrp(a))return taglike(a, $.rem(x, js(a)));
    err(rem, "Can't rem x = $1 from a = $2", x, a);
  }
  
  function remlis(x, a){
    if (nilp(a))return [];
    if (is(car(a), x))return remlis(x, cdr(a));
    return cons(car(a), remlis(x, cdr(a)));
  }
  
  function copy(a){
    if (lisp(a))return map($.self, a);
    if (strp(a))return tagstr(rep(a));
    if (arrp(a) || objp(a))return taglike(a, $.copy(js(a)));
    return a;
  }
  
  function split(a, x){
    if (lisp(a))return splitlis(a, x);
    if (gstrp(a))return arr2lis($.map(tagfn(a), $.split(js(a), jstrarr(x))));
    if (arrp(a))return tagarr($.split(js(a), x));
    err(split, "Can't split a = $1 by x = $2", a, x);
  }
  
  function splitlis(a, x){
    if (nilp(a))return [];
    return cons(til(x, a), splitlis(aft(x, a), x));
  }
  
  function til(x, a){
    if (nilp(a))return [];
    if (is(car(a), x))return [];
    return cons(car(a), tilx(x, cdr(a)));
  }
  
  function aft(x, a){
    if (nilp(a))return a;
    if (is(car(a), x))return cdr(a);
    return aft(x, cdr(a));
  }
  
  function apd(x, a){
    if (lisp(a))return apdlis(x, a);
    if (arrp(a)){
      if (arrp(x)){
        $.apd(js(x), js(a));
        return a;
      }
      return push(x, a);
    }
    if (objp(a))return $.apd(js(x), a);
    err(apd, "Can't append x = $1 to a = $2", x, a);
  }
  
  function map(f, a){
    if (lisp(a))return maplis(f, a);
    if (arrp(a))return tagarr($.map(f, js(a)));
    if (objp(a))return $.map(f, a);
    err(map, "Can't map f = $1 over a = $2", f, a);
  }
  
  function maplis(f, a){
    if (nilp(a))return [];
    return cons(f(car(a)), maplis(f, cdr(a)));
  }
  
  function clone(a){
    if (lisp(a) || arrp(a) || objp(a))return map(clone, a);
    return a;
  }
  
  function nof(n, a){
    if (lisp(a))return noflis(n, a);
    if (gstrp(a) || arrp(a))return taglike(a, $.nof($.num(n), js(a)));
    err(nof, "Can't make n = $1 of a = $2", n, a);
  }
  
  function noflis(n, a, l){
    if (udefp(l))l = a;
    if (n == "0")return [];
    if (nilp(a))return noflis(R.sub(n, "1"), l, l);
    return cons(car(a), noflis(n, cdr(a), l));
  }
  
  function has(x, a){
    if (lisp(a))return haslis(x, a);
    if (arrp(a) || objp(a))return $.has(x, js(a));
    if (gstrp(a))return $.has(js(x), js(a));
    err(has, "Can't find if a = $1 has x = $2", a, x);
  }
  
  function haslis(x, a){
    if (nilp(a))return false;
    if (is(car(a), x))return true;
    return haslis(x, cdr(a));
  }
  
  function ins(a, n, x){
    if (lisp(a)){
      inslis(a, n, x);
      return a;
    }
    if (arrp(a)){
      $.ins(js(a), $.num(n), x);
      return a;
    }
    if (objp(a))return $.ins(a, n, x);
    err(ins, "Can't insert x = $1 into a = $2 at n = $3", x, a, n);
  }
  
  function inslis(a, n, x){
    if (n == "0")push(x, a);
    if (nilp(a))push([], a);
    inslis(cdr(a), R.sub(n, "1"), x);
  }
  
  function del(a, n){
    if (lisp(a))return delis(a, n);
    if (arrp(a))return $.del(js(a), $.num(n));
    if (objp(a))return $.del(a, n);
    err(del, "Can't delete item n = $1 from a = $2", n, a);
  }
  
  function delis(a, n){
    if (n == "0")return pop(a);
    return delis(cdr(a), R.sub(n, "1"));
  }
  
  //// Array and List ////
  
  function push(x, a){
    if (lisp(a)){
      if (nilp(a)){
        a[1] = [];
        a[0] = x;
        return a;
      }
      a[1] = cons(a[0], a[1]);
      a[0] = x;
      return a;
    }
    if (arrp(a)){
      $.push(x, js(a));
      return a;
    }
    err(push, "Can't push x = $1 onto a = $2", x, a);
  }
  
  function pop(a){
    if (lisp(a)){
      var x = car(a);
      if (nilp(cdr(a))){
        a.pop();
        a.pop();
      } else {
        a[0] = cadr(a);
        a[1] = cddr(a);
      }
      return x;
    }
    if (arrp(a))return $.pop(js(a));
    err(pop, "Can't pop from a = $1", a);
  }
  
  function ushf(x, a){
    if (lisp(a))return ushflis(x, a);
    if (arrp(a)){
      $.ushf(x, js(a));
      return a;
    }
    err(ushf, "Can't ushf x = $1 onto a = $2", x, a);
  }
  
  function ushflis(x, a){
    if (nilp(a))return push(x, a);
    return ushflis(x, cdr(a));
  }
  
  function shf(a){
    if (lisp(a))return shflis(a);
    if (arrp(a))return $.shf(js(a));
    err(shf, "Can't shf from a = $1", a);
  }
  
  function shflis(a){
    if (nilp(a))return [];
    if (nilp(cdr(a)))return pop(a);
    return shflis(cdr(a));
  }
  
  function join(a, x){
    if (udefp(x))x = tagstr("");
    if (lisp(a))return joinlis(a, x);
    if (arrp(a))return tagstr($.join(map(add(js, str1), js(x)));
    err(join, "Can't join a = $1 with x = $2", a, x);
  }
  
  function joinlis(a, x){
    if (nilp(a))return tagstr("");
    return add(str1(car(a)), joinlis2(cdr(a), x));
  }
  
  function joinlis2(a, x){
    if (nilp(a))return tagstr("");
    return add(x, str1(car(a)), joinlis2(cdr(a), x));
  }
  
  function head(a, x){
    if (lisp(a))return cons(x, a);
    if (arrp(a))return ushf(x, copy(a));
    err(head, "Can't head a = $1 with x = $2", a, x);
  }
  
  function tail(a, x){
    if (lisp(a))return tailis(a, x);
    if (arrp(a))return push(x, copy(a));
    err(tail, "Can't tail a = $1 with x = $2", a, x);
  }
  
  function tailis(a, x){
    if (nilp(a))return list(x);
    return cons(car(a), tailis(cdr(a), x));
  }
  
  //// List ////
  
  function car(a){
    return !udefp(a[0])?a[0]:[];
  }
  
  function cdr(a){
    return !udefp(a[0])?a[1]:[];
  }
  
  function cons(a, b){
    return [a, b];
  }
  
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
  
  function lis(){
    var a = arguments;
    var r = [];
    for (var i = $.len(a)-1; i >= 0; i--){
      r = cons(a[i], r);
    }
    return r;
  }
  
  function pair(a, b){
    if (nilp(a))return [];
    if (atomp(a))return lis(cons(a, b));
    if (car(a) == "o")return lis(cons(cadr(a), nilp(b)?nth("2", a):b));
    return add(pair(car(a), car(b)), pair(cdr(a), cdr(b)));
  }
  
  function nth(n, a){
    if (n == "0")return car(a);
    return nth(R.sub(n, "1"), cdr(a));
  }
  
  function ncdr(n, a){
    if (n == "0")return a;
    return ncdr(R.sub(n, "1"), cdr(a));
  }
  
  function fstn(n, a){
    if (n == "0")return [];
    return cons(car(a), fstn(R.sub(n, "1"), a));
  }
  
  //// Checkers ////
  
  function chk(a){
    if ($.inp(a, false, udef, null))return [];
    if (a === true)return "t";
    return a;
  }
  
  function chkr(f){
    return function (){
      return chk($.apply(f, arguments));
    };
  }
  
  //// Error ////
  
  // special handler that uses disp(a)
  function err(f, a){
    var s = $.reduc1(function (s, a, i){
      return $.rpl("$" + i, disp(a), s);
    }, $.slc(arguments, 1));
    throw "Error: " + $.head(f) + ": " + s;
  }
  
  //// Other ////
  
  function doLisp(){
    return $.last(arguments);
  }
  
  uniq.n = 0;
  function uniq(){
    return "gs" + uniq.n++;
  }
  
  ////// Object exposure //////
  
  win.Lisp = {
    type: type,
    tag: tag,
    rep: rep,
    
    lisp: lisp,
    atomp: atomp,
    nilp: nilp,
    nump: nump,
    objp: objp,
    rgxp: rgxp,
    tagp: tagp,
    strp: strp,
    arrp: arrp,
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
    
    outfn: outfn,
    ou: ou,
    out: out,
    pr: pr,
    prn: prn,
    
    sym: sym,
    str: str,
    num: num,
    
    len: len,
    pos: pos,
    
    list: list,
    apd: apd,
    pair: pair,
    map: map,
    join: join,
    nth: nth,
    ncdr: ncdr,
    has: has,
    
    chk: chk,
    chkr: chkr,
    
    err: err,
    
    do: doLisp,
    uniq: uniq
  };
  
  ////// Testing //////
  
  
  
})(window);
