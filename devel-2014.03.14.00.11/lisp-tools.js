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
    if ($.fnp(a))return "jfn";
    err(type, "Unknown type of a = $1", a);
  }
  
  function tag(x, a){
    var as = arguments;
    if ($.len(as) == 2){
      if (isa(x, a))return a;
      if (cantag(x, a))return ["&", x, a];
      err(tag, "Can't tag a = $1 as x = $2", a, x);
    }
    return $.add(["&", x], $.slc(as, 1));
  }
  
  function cantag(x, a){
    var tp = type(a);
    if (inp(x, "nil", "sym", "num", "lis", "obj", "rgx", "jfn"))return false;
    if (is(x, "str") && !inp(tp, "sym", "num"))return false;
    if (is(x, "arr") && !$.arrp(a))return false;
    return true;
  }
  
  function rep(a, n){
    if (udefp(n))n = "0";
    if (tagp(a))return chkudef(a[add(n, "2")]);
    return a;
  }
  
  function tagarr(a){
    return tag("arr", a);
  }
  
  function tagstr(a){
    return tag("str", a);
  }
  
  function tagas(x, a){
    if (nilp(a) && !arrp(x))return a;
    return tag(type(x), a);
  }
  
  function tagfn(x){
    return function (a){
      return tagas(x, a);
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
  
  function gstrp(a){
    return $.strp(a) || strp(a);
  }
  
  function arrp(a){
    return tagp(a) && a[1] === "arr";
  }
  
  function fnp(a){
    return $.fnp(a) || tagp(a) && $.inp(a[1], "fn", "jfn2");
  }
  
  function specp(a){
    return tagp(a) && $.inp(a[1], "mac", "spec");
  }
  
  function procp(a){
    return fnp(a) || specp(a);
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
  
  function isa(x, a){
    var tp = type(a);
    if (is(x, tp))return true;
    if (inp(x, "num", "sym") && inp(tp, "num", "sym"))return true;
    if (is(x, "sym") && is(tp, "nil"))return true;
    if (is(x, "fn") && inp(tp, "jfn", "jfn2"))return true;
    if (is(x, "spec") && is(tp, "mac"))return true;
    return false;
  }
  
  function inp(a){
    var x = arguments;
    for (var i = 1; i < $.len(x); i++){
      if (is(x[i], a))return true;
    }
    return false;
  }
  
  //// Display ////
  
  /*
  var a = L.lis("1", "3", "5");
  var b = L.arr(a, L.lis(a, "5"));
  L.set(b, "1", "1", b);
  var c = {a: a, b: b, c: "5"};
  L.set(c, "c", c);
  L.set(b, "1", "1", L.lis(a, b, c));
  L.disp(c);
  */
  
  function disp(a){
    return tagstr(dispjs(a));
  }
  
  var disps = [];
  function dispjs(a){
    return $.dyn(disps, a, function (){
      return dispjs2(a);
    });
  }
  
  function dispjs2(a){
    if (nilp(a))return "()";
    if (lisp(a))return displis(a);
    if (nump(a) || symp(a))return a;
    if (objp(a)){
      if (has(a, cdr(disps)))return "{...}";
      var r = [];
      for (var i in a){
        $.push(dispjs(i) + " " + dispjs(a[i]), r);
      }
      return "{" + $.join(r, " ") + "}";
    }
    if (rgxp(a)){
      return "#\"" + $.rpl("\"", "\\\"", a.source) + "\"";
    }
    if (strp(a))return $.disp(js(a));
    if (arrp(a)){
      if (has(a, cdr(disps)))return "[...]";
      return "[" + $.reduc(function (s, x){
        if (s == "")return dispjs(x);
        return s + " " + dispjs(x);
      }, "", js(a)) + "]";
    }
    if (fnp(a) && type(a) == "fn"){
      return "<fn " + dispjs(rep(a, "0")) + " "
                    + dispjs(rep(a, "1")) + ">";
    }
    if (tagp(a))return "<" + $.join($.map(dispjs, $.slc(a, 1)), " ") + ">";
    return $.disp(a);
  }
  
  var dlists = [];
  var i = -1;
  function displis(a){
    if (has(a, cdr(disps)))return "(...)";
    switch (car(a)){
      case "qt": return "'" + dispjs(cadr(a));
      case "qq": return "`" + dispjs(cadr(a));
      case "uq": return "," + dispjs(cadr(a));
      case "uqs": return ",@" + dispjs(cadr(a));
      case "not": return "!" + dispjs(cadr(a));
    }
    i++;
    dlists[i] = [];
    var r = $.dyn(dlists[i], a, function (){
      return displis2(a);
    });
    i--;
    return "(" + r + ")";
  }
  
  // displis2( '(1 2 3 4 . 5) ) -> "1 2 3 4 . 5"
  function displis2(a){
    if (nilp(cdr(a)))return dispjs(car(a));
    if (atomp(cdr(a)))return dispjs(car(a)) + " . " + dispjs(cdr(a));
    if (has(a, cdr(dlists[i])))return dispjs(car(a)) + " . (...)";
    return dispjs(car(a)) + " " + displis2(cdr(a));
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
    return join(tagarr(arguments));
  }
  
  function str1(a){
    if (strp(a))return a;
    if (symp(a) || nump(a))return tagstr(a);
    return disp(a);
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
  
  function tobj(a){
    if (objp(a))return a;
    if (lisp(a)){
      return reduc(function (o, x){
        if (atomp(x))err(tobj, "Can't coerce a = $1 to obj", a);
        o[prop(car(x))] = cdr(x);
        return o;
      }, {}, a);
    }
    if (arrp(a))return $.tobj($.map(js, js(a)));
    if (gstrp(a))return $.map(tagfn(a), $.tobj(js(a)));
    err(tobj, "Can't coerce a = $1 to obj", a);
  }
  
  function prop(a){
    if (symp(a) || nump(a))return a;
    if (strp(a))return rep(a);
    err(prop, "Invalid obj prop name a = $1", a);
  }
  
  //// Javascript <-> Lisp converters ////
  
  function lis2arr(a, r){
    if (udefp(r))r = [];
    if (nilp(a))return r;
    r.push(car(a));
    return lis2arr(cdr(a), r);
  }
  
  function arr2lis(a){
    return $.apply(lis, a);
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
  
  function lstrlis(a){
    if ($.arrp(a))return arr2lis($.map(tagstr, a));
    err(lstrlis, "Can't coerce a = $1 to lstrlis", a);
  }
  
  //// Polymorphic ////
  
  function len(a){
    if (lisp(a))return lenlis(a);
    if (gstrp(a) || arrp(a) || objp(a))return $.str($.len(js(a)));
    err(len, "Can't get len of a = $1", a);
  }
  
  function lenlis(a){
    if (nilp(a))return "0";
    return add(lenlis(cdr(a)), "1");
  }
  
  function ref(a){
    return $.reduc(ref1, a, $.slc(arguments, 1));
  }
  
  function ref1(a, n){
    if (lisp(a))return nth(n, a);
    if (gstrp(a))return tagas(a, chkudef($.ref(js(a), $.num(n))));
    if (arrp(a))return chkudef($.ref(js(a), $.num(n)));
    if (objp(a))return chkudef($.ref(a, n));
    err(ref, "Can't get item n = $1 of a = $2", n, a);
  }
  
  function set(a, n){
    var x = arguments;
    if ($.len(x) < 2)err(set, "Can't set a = $1 without n", a);
    if ($.len(x) == 2)return set1(a, n);
    return set1($.apply(ref, $.blas(2, x)), $.nlas(1, x), $.las(x));
  }
  
  function set1(a, n, x){
    if (udefp(x))x = [];
    if (lisp(a))return setnth(n, a, x);
    if (arrp(a))return $.set(js(a), $.num(n), x);
    if (objp(a))return $.set(a, n, x);
    err(set1, "Can't set item n = $1 of a = $2 to x = $3", n, a, x);
  }
  
  function setnth(n, a, x){
    if (nilp(a))push([], a);
    if (le(n, "0"))return a[0] = x;
    return setnth(sub(n, "1"), cdr(a), x);
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
    if (nilp(a))return "-1";
    if (is(car(a), x))return n;
    return poslis(x, cdr(a), add(n, "1"));
  }
  
  function posl(x, a, n){
    if (udefp(n))n = len(a);
    if (lisp(a))return posllis(x, fstn(add(n, "1"), a));
    if (arrp(a) || objp(a))return $.str($.posl(x, js(a), $.num(n)));
    if (gstrp(a))return $.str($.posl(jstrarr(x), js(a), $.num(n)));
    err(posl, "Can't get last pos of x = $1 in a = $2 from n = $3", x, a, n);
  }
  
  function posllis(x, a, n, l){
    if (udefp(n))n = "0";
    if (udefp(l))l = "-1";
    if (nilp(a))return l;
    return posllis(x, cdr(a), add(n, "1"), is(car(a), x)?n:l);
  }
  
  function rpl(x, y, a){
    if (lisp(a))return rplis(x, y, a);
    if (gstrp(a))return tagas(a, $.rpl(jstrarr(x), jstrarr(y), js(a)));
    if (arrp(a) || objp(a))return tagas(a, $.rpl(x, y, js(a)));
    err(rpl, "Can't rpl x = $1 with y = $2 in a = $3", x, y, a);
  }
  
  function rplis(x, y, a){
    if (nilp(a))return [];
    return cons(is(car(a), x)?y:car(a), rplis(x, y, cdr(a)));
  }
  
  function slc(a, n, m){
    if (lisp(a))return ncdr(n, udefp(m)?a:fstn(m, a));
    if (gstrp(a) || arrp(a) || objp(a)){
      return tagas(a, $.slc(js(a), $.num(n), $.num(m)));
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
    if (nilp(a))return rev(l);
    return posslis(x, cdr(a), add(n, "1"), is(car(a), x)?cons(n, l):l);
  }
  
  function add(){
    var a = arguments;
    if ($.len(a) == 0)return "0";
    return $.reduc1(add2, $.rem(nilp, a));
  }
  
  function add2(a, b){
    if (nump(a))return R.add(a, num(b));
    if (lisp(a)){
      if (lisp(b) || arrp(b))return addlis(a, tlis(b));
      return tail(a, b);
    }
    if (strp(a))return tagstr($.add(js(a), js(str1(b))));
    if (symp(a)){
      var x = sym(b);
      return nilp(x)?a:$.add(a, x);
    }
    if (objp(a))return $.add(a, tobj(b));
    if (arrp(a)){
      if (arrp(b) || lisp(b))return tagarr($.add(js(a), js(tarr(b))));
      return tail(a, b);
    }
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
    if (gstrp(a) || objp(a) || arrp(a))return tagas(a, $.rev(js(a)));
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
    if (gstrp(a))return tagas(a, $.rem(jstrarr(x), js(a)));
    if (objp(a) || arrp(a))return tagas(a, $.rem(x, js(a)));
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
    if (arrp(a) || objp(a))return tagas(a, $.copy(js(a)));
    return a;
  }
  
  function splt(a, x){
    if (lisp(a))return spltlis(a, x);
    if (gstrp(a))return arr2lis($.map(tagfn(a), $.splt(js(a), jstrarr(x))));
    if (arrp(a))return tagarr($.splt(js(a), x));
    err(splt, "Can't split a = $1 by x = $2", a, x);
  }
  
  function spltlis(a, x){
    if (nilp(a))return [];
    return cons(til(x, a), spltlis(aft(x, a), x));
  }
  
  function til(x, a){
    if (nilp(a))return [];
    if (is(car(a), x))return [];
    return cons(car(a), til(x, cdr(a)));
  }
  
  function aft(x, a){
    if (nilp(a))return a;
    if (is(car(a), x))return cdr(a);
    return aft(x, cdr(a));
  }
  
  function apd(x, a){
    if (lisp(a)){
      if (lisp(x) || arrp(x)){
        apdlis(tlis(x), a);
        return a;
      }
      return ushf(x, a);
    }
    if (arrp(a)){
      if (arrp(x) || lisp(x)){
        $.apd(js(tarr(x)), js(a));
        return a;
      }
      return push(x, a);
    }
    if (objp(a))return $.apd(tobj(x), a);
    err(apd, "Can't append x = $1 to a = $2", x, a);
  }
  
  function apdlis(x, a){
    if (nilp(a)){
      if (nilp(x))return;
      push(car(x), a);
      a[1] = cdr(x);
      return;
    }
    if (nilp(cdr(a))){
      a[1] = x;
      return;
    }
    apdlis(x, cdr(a));
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
  
  function clon(a){
    if (lisp(a) || arrp(a) || objp(a))return map(clon, a);
    return a;
  }
  
  function nof(n, a){
    if (lisp(a))return noflis(n, a);
    if (gstrp(a) || arrp(a))return tagas(a, $.nof($.num(n), js(a)));
    err(nof, "Can't make n = $1 of a = $2", n, a);
  }
  
  function noflis(n, a, l){
    if (udefp(l))l = a;
    if (le(n, "0"))return [];
    if (nilp(a))return noflis(sub(n, "1"), l, l);
    return cons(car(a), noflis(n, cdr(a), l));
  }
  
  function has(x, a){
    if (lisp(a))return haslis(x, a);
    if (arrp(a) || objp(a))return $.has(x, js(a));
    if (gstrp(a))return $.has(jstrarr(x), js(a));
    err(has, "Can't find if a = $1 has x = $2", a, x);
  }
  
  function haslis(x, a){
    if (nilp(a))return false;
    if (is(car(a), x))return true;
    return haslis(x, cdr(a));
  }
  
  function ins(a, n, x){
    if (udefp(x))x = [];
    if (ge(n, "0")){
      if (lisp(a)){
        inslis(a, n, x);
        return a;
      }
      if (arrp(a)){
        $.ins(js(a), $.num(n), x);
        return a;
      }
      if (objp(a))return $.ins(a, n, x);
    }
    err(ins, "Can't insert x = $1 into a = $2 at n = $3", x, a, n);
  }
  
  function inslis(a, n, x){
    if (le(n, "0")){
      push(x, a);
      return;
    }
    if (nilp(a))push([], a);
    inslis(cdr(a), sub(n, "1"), x);
  }
  
  function del(a, n){
    if (lisp(a))return delis(a, n);
    if (arrp(a))return chkudef($.del(js(a), $.num(n)));
    if (objp(a))return chkudef($.del(a, n));
    err(del, "Can't delete item n = $1 from a = $2", n, a);
  }
  
  function delis(a, n){
    if (nilp(a))return [];
    if (le(n, "0"))return pop(a);
    return delis(cdr(a), sub(n, "1"));
  }
  
  function frst(a){
    if (lisp(a))return car(a);
    if (gstrp(a))return tagas(a, chkudef($.frst(js(a))));
    if (arrp(a))return chkudef($.frst(js(a)));
    err(frst, "Can't get frst of a = $1", a);
  }
  
  function last(a){
    if (lisp(a))return lastlis(a);
    if (gstrp(a))return tagas(a, chkudef($.last(js(a))));
    if (arrp(a))return chkudef($.last(js(a)));
    err(last, "Can't get last of a = $1", a);
  }
  
  function lastlis(a){
    if (nilp(a))return [];
    if (nilp(cdr(a)))return car(a);
    return lastlis(cdr(a));
  }
  
  //// Array and List ////
  
  function arr(){
    return tagarr($.copy(arguments));
  }
  
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
    if (arrp(a))return chkudef($.pop(js(a)));
    err(pop, "Can't pop from a = $1", a);
  }
  
  function ushf(x, a){
    if (lisp(a)){
      ushflis(x, a);
      return a;
    }
    if (arrp(a)){
      $.ushf(x, js(a));
      return a;
    }
    err(ushf, "Can't ushf x = $1 onto a = $2", x, a);
  }
  
  function ushflis(x, a){
    if (nilp(a)){
      push(x, a);
      return;
    }
    ushflis(x, cdr(a));
  }
  
  function shf(a){
    if (lisp(a))return shflis(a);
    if (arrp(a))return chkudef($.shf(js(a)));
    err(shf, "Can't shf from a = $1", a);
  }
  
  function shflis(a){
    if (nilp(a))return [];
    if (nilp(cdr(a)))return pop(a);
    return shflis(cdr(a));
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
    if (nilp(a))return lis(x);
    return cons(car(a), tailis(cdr(a), x));
  }
  
  function join(a, x){
    if (udefp(x))x = tagstr("");
    if (lisp(a) || arrp(a)){
      return reduc(function (s, i){
        if (is(s, tagstr("")))return str1(i);
        return add(s, x, str1(i));
      }, tagstr(""), a);
    }
    err(join, "Can't join a = $1 with x = $2", a, x);
  }
  
  function reduc(f, x, a){
    if (lisp(a))return reduclis(f, x, a);
    if (arrp(a))return $.reduc(f, x, js(a));
    err(reduc, "Can't reduc a = $1 with f = $2 and x = $3", a, f, x);
  }
  
  function reduclis(f, x, a){
    if (nilp(a))return x;
    return reduclis(f, f(x, car(a)), cdr(a));
  }
  
  function reduc1(f, a){
    if (lisp(a))return reduc1lis(f, a);
    if (arrp(a))return $.reduc1(f, js(a));
    err(reduc1, "Can't reduc1 a = $1 with f = $2", a, f);
  }
  
  function reduc1lis(f, a){
    if (nilp(a))return [];
    return reduclis(f, car(a), cdr(a));
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
  
  // car and cdr extensions //
  
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
  
  // General //
  
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
    if (le(n, "0"))return car(a);
    return nth(sub(n, "1"), cdr(a));
  }
  
  function ncdr(n, a){
    if (le(n, "0"))return a;
    return ncdr(sub(n, "1"), cdr(a));
  }
  
  function fstn(n, a){
    if (le(n, "0") || nilp(a))return [];
    return cons(car(a), fstn(sub(n, "1"), cdr(a)));
  }
  
  //// Object and Alist ////
  
  function keys(a){
    if (lisp(a))return map(car, a);
    if (arrp(a))return map(function (x){
      if (!arrp(x))err(keys, "Can't get keys of a = $1", a);
      return ref(x, "0");
    }, a);
    if (objp(a))return arr2lis($.keys(a));
    err(keys, "Can't get keys of a = $1", a);
  }
  
  function vals(a){
    if (lisp(a))return map(cdr, a);
    if (arrp(a))return map(function (x){
      if (!arrp(x))err(vals, "Can't get vals of a = $1", a);
      return ref(x, "1");
    }, a);
    if (objp(a))return arr2lis($.vals(a));
    err(vals, "Can't get vals of a = $1", a);
  }
  
  function alref(a, x){
    if (lisp(a))return alreflis(a, x);
    if (arrp(a)){
      var b = js(a);
      for (var i = 0; i < $.len(b); i++){
        if (!arrp(b[i]))err(alref, "Can't alref x = $1 in a = $2", x, a);
        if (is(ref(b[i], "0"), x))return ref(b[i], "1");
      }
      return [];
    }
    err(alref, "Can't alref x = $1 in a = $2", x, a);
  }
  
  function alreflis(a, x){
    if (nilp(a))return [];
    if (is(caar(a), x))return cdar(a);
    return alreflis(cdr(a), x);
  }
  
  function alset(a, x, y){
    if (udefp(y))y = [];
    if (lisp(a))return alsetlis(a, x, y);
    if (arrp(a)){
      var b = js(a);
      for (var i = 0; i < $.len(b); i++){
        if (!arrp(b[i]))err(alset, "Can't alset x = $1 in a = $2 to y = $3", x, a, y);
        if (is(ref(b[i], "0"), x))return set(b[i], "1", y);
      }
      $.push(arr(x, y), b);
      return y;
    }
    err(alset, "Can't alset x = $1 in a = $2 to y = $3", x, a, y);
  }
  
  function alsetlis(a, x, y){
    if (nilp(a)){
      push(cons(x, y), a);
      return y;
    }
    if (is(caar(a), x))return car(a)[1] = y;
    return alsetlis(cdr(a), x, y);
  }
  
  function aldel(a, x){
    if (lisp(a))return aldelis(a, x);
    if (arrp(a)){
      var b = js(a);
      for (var i = 0; i < $.len(b); i++){
        if (!arrp(b[i]))err(aldel, "Can't aldel x = $1 in a = $2", x, a);
        if (is(ref(b[i], "0"), x)){
          var y = ref(b[i], "1");
          $.del(b, i);
          return y;
        }
      }
      return [];
    }
    err(aldel, "Can't aldel x = $1 in a = $2", x, a);
  }
  
  function aldelis(a, x){
    if (nilp(a))return [];
    if (is(caar(a), x))return cdr(pop(a));
    return aldelis(cdr(a), x);
  }
  
  //// Number ////
  
  var sub = R.sub;
  var mul = R.mul;
  var div = R.div;
  
  var lt = R.lt;
  var gt = R.gt;
  var le = R.le;
  var ge = R.ge;
  
  //// String ////
  
  function strf(a){
    if (strp(a) || symp(a)){
      return $.reduc1(function (a, s, i){
        return rpl("$" + i, disp(s), a);
      }, arguments);
    }
    return disp(a);
  }
  
  //// Function ////
  
  function apply(f, a){
    if (lisp(a) || arrp(a))return $.apply(f, js(a));
    err(apply, "Can't apply f = $1 to a = $2", f, a);
  }
  
  function call(f){
    return $.apply($.call, arguments);
  }
  
  var self = $.self;
  
  //// Regex ////
  
  function mtch(x, a){
    return tagstr($.mtch(x, js(a)));
  }
  
  function mtchs(x, a){
    return lstrlis($.mtchs(x, js(a)));
  }
  
  //// Checkers ////
  
  function chkudef(a){
    return udefp(a)?[]:a;
  }
  
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
  
  //// Speed tests ////
  
  function speed(a, b, n){
    $.speed(a, b, $.num(n));
  }
  
  //// Error ////
  
  // special handler that uses disp(a)
  function err(f, a){
    var s = $.reduc1(function (s, a, i){
      return $.rpl("$" + i, dispjs(a), s);
    }, $.slc(arguments, 1));
    throw "Error: " + $.sig(f) + ": " + s;
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
  
  win.L = {
    type: type,
    tag: tag,
    rep: rep,
    tagarr: tagarr,
    tagstr: tagstr,
    tagas: tagas,
    tagfn: tagfn,
    
    nilp: nilp,
    lisp: lisp,
    atomp: atomp,
    nump: nump,
    symp: symp,
    objp: objp,
    rgxp: rgxp,
    udefp: udefp,
    tagp: tagp,
    strp: strp,
    gstrp: gstrp,
    arrp: arrp,
    fnp: fnp,
    specp: specp,
    procp: procp,
    
    is: is,
    iso: iso,
    
    disp: disp,
    dispjs: dispjs,
    
    outfn: outfn,
    ou: ou,
    out: out,
    pr: pr,
    prn: prn,
    
    sym: sym,
    str: str,
    str1: str1,
    num: num,
    tarr: tarr,
    tlis: tlis,
    tobj: tobj,
    
    lis2arr: lis2arr,
    arr2lis: arr2lis,
    jstrarr: jstrarr,
    js: js,
    lnumlis: lnumlis,
    lstrlis: lstrlis,
    
    len: len,
    ref: ref,
    set: set,
    pos: pos,
    posl: posl,
    rpl: rpl,
    slc: slc,
    poss: poss,
    add: add,
    add2: add2,
    rev: rev,
    grp: grp,
    rem: rem,
    copy: copy,
    splt: splt,
    apd: apd,
    map: map,
    clon: clon,
    nof: nof,
    has: has,
    ins: ins,
    del: del,
    frst: frst,
    last: last,
    
    arr: arr,
    push: push,
    pop: pop,
    ushf: ushf,
    shf: shf,
    head: head,
    tail: tail,
    join: join,
    reduc: reduc,
    reduc1: reduc1,
    
    car: car,
    cdr: cdr,
    cons: cons,
    
    caar: caar,
    cadr: cadr,
    cdar: cdar,
    cddr: cddr,
    mkcxr: mkcxr,
    
    lis: lis,
    pair: pair,
    nth: nth,
    ncdr: ncdr,
    fstn: fstn,
    
    keys: keys,
    vals: vals,
    alref: alref,
    alset: alset,
    aldel: aldel,
    
    sub: sub,
    mul: mul,
    div: div,
    
    strf: strf,
    
    apply: apply,
    call: call,
    self: self,
    
    mtch: mtch,
    mtchs: mtchs,
    
    chkudef: chkudef,
    chk: chk,
    chkr: chkr,
    
    speed: speed,
    
    err: err,
    
    do: doLisp,
    uniq: uniq
  };
  
  ////// Testing //////
  
  
  
})(window);
