/***** Lisp Tools Devel *****/

/* require tools >= 3.1 */
/* require prec-math */

(function (win, udf){
  ////// Type //////
  
  function typ(a){
    if ($.arrp(a)){
      if (a.length == 0)return "nil";
      if (a[0] === "&")return a[1];
      return "lis";
    }
    if ($.strp(a)){
      if ($.has(/^-?[0-9]+(\.[0-9]+)?$/, a))return "num";
      return "sym";
    }
    if ($.objp(a))return "obj";
    if ($.rgxp(a))return "rgx";
    if ($.fnp(a))return "jn";
    err(typ, "Unknown type of a = $1", a);
  }
  
  function tg(x, a){
    var as = arguments;
    if ($.len(as) == 2){
      if (isa(x, a))return a;
      return ["&", x, a];
    }
    return $.app(["&", x], $.sli(as, 1));
  }
  
  function rp(a, n){
    if (udfp(n))n = "0";
    if (tgp(a))return chku(a[add(n, "2")]);
    return a;
  }
  
  function r(a){
    return tg("arr", a);
  }
  
  function s(a){
    return tg("str", a);
  }
  
  //// Predicates ////
  
  function nilp(a){
    return $.arrp(a) && a.length == 0;
  }
  
  function no(a){
    return a.length === 0;
  }
  
  function lisp(a){
    return $.arrp(a) && a[0] !== "&";
  }
  
  function atmp(a){
    return !lisp(a) || a.length == 0;
  }
  
  function nump(a){
    return $.strp(a) && $.has(/^-?[0-9]+(\.[0-9]+)?$/, a);
  }
  
  function symp(a){
    return $.strp(a) && !$.has(/^-?[0-9]+(\.[0-9]+)?$/, a);
  }
  
  var objp = $.objp;
  var rgxp = $.rgxp;
  var udfp = $.udfp;
  
  function tgp(a){
    return $.arrp(a) && a[0] === "&";
  }
  
  function strp(a){
    return tgp(a) && a[1] === "str";
  }
  
  function arrp(a){
    return tgp(a) && a[1] === "arr";
  }
  
  var jnp = $.fnp;
  
  function fnp(a){
    return jnp(a) || tgp(a) && $.inp(a[1], "fn", "nfn", "jn2");
  }
  
  function macp(a){
    return tgp(a) && a[1] === "mac";
  }
  
  function spcp(a){
    return tgp(a) && $.inp(a[1], "mac", "spc");
  }
  
  function prcp(a){
    return fnp(a) || spcp(a);
  }
  
  ////// Comparison //////
  
  function is(a, b){
    if (a === b || nilp(a) && nilp(b))return true;
    if (strp(a) && strp(b))return rp(a) === rp(b);
    if (rgxp(a) && rgxp(b))return $.iso(a, b);
    return false;
  }
  
  function isa(x, a){
    var t = typ(a);
    if (is(x, t))return true;
    if (inp(x, "num", "sym") && inp(t, "num", "sym"))return true;
    if (is(x, "sym") && is(t, "nil"))return true;
    if (is(x, "fn") && inp(t, "jn", "jn2"))return true;
    if (is(x, "spc") && is(t, "mac"))return true;
    return false;
  }
  
  function inp(x){
    var a = arguments;
    for (var i = 1; i < $.len(a); i++){
      if (is(a[i], x))return true;
    }
    return false;
  }
  
  ////// Dynamic vars //////
  
  var dyn = $.dyn;
  
  ////// Display //////
  
  /*
  var a = L.lis("1", "3", "5");
  var b = L.arr(a, L.lis(a, "5"));
  L.set(b, "1", "1", b);
  var c = {a: a, b: b, c: "5"};
  L.set(c, "c", c);
  L.set(b, "1", "1", L.lis(a, b, c));
  L.dsp(c);
  */
  
  function dsp(a){
    return s(dsj(a));
  }
  
  var dsps = [];
  function dsj(a){
    return dyn(dsps, a, function (){
      return dsj2(a);
    });
  }
  
  function dsj2(a){
    if (nilp(a))return "()";
    if (lisp(a))return dlis(a);
    if (nump(a) || symp(a))return a;
    if (objp(a)){
      if (has(a, cdr(dsps)))return "{...}";
      return "{" + rdc(function (s, x, i){
        if (s == "")return dsj(i) + " " + dsj(x);
        return s + " " + dsj(i) + " " + dsj(x);
      }, "", a) + "}";
    }
    if (rgxp(a))return "#\"" + $.rpl("\"", "\\\"", a.source) + "\"";
    if (strp(a))return $.dsp(rp(a));
    if (arrp(a)){
      if (has(a, cdr(dsps)))return "[...]";
      return "[" + rdc(function (s, x){
        if (s == "")return dsj(x);
        return s + " " + dsj(x);
      }, "", a) + "]";
    }
    if (fnp(a)){
      switch (typ(a)){
        case "fn": return "<fn " + dsj(rp(a, "0")) + " "
                                 + dsj(rp(a, "1")) + ">";
        case "nfn": return "<nfn " + dsj(rp(a, "0")) + ">";
      }
    }
    if (tgp(a))return "<" + $.joi($.map(dsj, $.sli(a, 1)), " ") + ">";
    return $.dsp(a);
  }
  
  var dlists = [];
  var i = -1;
  function dlis(a){
    if (has(a, cdr(dsps)))return "(...)";
    switch (car(a)){
      case "qt": return "'" + dsj(cadr(a));
      case "qq": return "`" + dsj(cadr(a));
      case "uq": return "," + dsj(cadr(a));
      case "uqs": return ",@" + dsj(cadr(a));
      case "not": return "!" + dsj(cadr(a));
    }
    return "(" + dyn(dlists, a, function (){
      return dlis2(a);
    }) + ")";
  }
  
  // dlis2( '(1 2 3 4 . 5) ) -> "1 2 3 4 . 5"
  function dlis2(a){
    if (nilp(cdr(a)))return dsj(car(a));
    if (atmp(cdr(a)))return dsj(car(a)) + " . " + dsj(cdr(a));
    if (has(a, cdr(dlists)))return dsj(car(a)) + " . (...)";
    return dsj(car(a)) + " " + dlis2(cdr(a));
  }
  
  ////// Output //////
  
  var of = function (a){return [];}
  
  function ofn(f){
    if (udfp(f))return of;
    return of = f;
  }
  
  function ou(a){
    return of(a);
  }
  
  function out(a){
    return of(app(a, s("\n")));
  }
  
  function pr(a){
    if (udfp(a))return ou(s(""));
    return ou(dsp(a));
  }
  
  function prn(a){
    if (udfp(a))return out(s(""));
    return out(dsp(a));
  }
  
  ////// Converters //////
  
  function sym(a){
    if (symp(a) || nump(a))return a;
    if (strp(a))return rp(a);
    return dsj(a);
  }
  
  function str(){
    return joi(r(arguments));
  }
  
  function str1(a){
    if (strp(a))return a;
    if (nilp(a))return s("");
    if (symp(a) || nump(a))return s(a);
    return dsp(a);
  }
  
  function num(a){
    if (nump(a))return a;
    if (symp(a) && !nilp(a)){
      var s = $.mtc(/^-?[0-9]+(\.[0-9]+)?/, a);
      return (s == -1)?"0":s;
    }
    if (strp(a))return num(rp(a));
    return "0";
  }
  
  function tarr(a){
    if (arrp(a))return a;
    if (lisp(a))return r(jarr(a));
    if (symp(a))return r($.tarr(a));
    if (strp(a))return map(s, tarr(rp(a)));
    err(tarr, "Can't coerce a = $1 to arr", a);
  }
  
  function tlis(a){
    if (lisp(a))return a;
    if (arrp(a))return $.apl(lis, rp(a));
    if (symp(a) || strp(a))return tlis(tarr(a));
    if (objp(a))return $.rdc(function (l, x, i){
      return cons(cons(i, x), l);
    }, [], a);
    err(tlis, "Can't coerce a = $1 to lis", a);
  }
  
  function tobj(a, o){
    if (udfp(o))o = {};
    if (objp(a))return app(a, o);
    if (lisp(a))return rdc(function (o, x){
      if (atmp(x))err(tobj, "Can't coerce a = $1 to obj", a);
      o[prop(car(x))] = cdr(x);
      return o;
    }, o, a);
    if (arrp(a))return $.tobj($.map(function (x){
      if (!$.arrp(x))err(tobj, "Can't coerce a = $1 to obj", a);
      return [jstr(x[0]), x[1]];
    }, $.map(jarr, rp(a))), tobj(o));
    if (symp(a) || nump(a))return $.tobj(a, tobj(o));
    if (strp(a))return map(s, tobj(rp(a), o));
    err(tobj, "Can't coerce a = $1 to obj", a);
  }
  
  function prop(a){
    if (nilp(a))return "";
    if (symp(a) || nump(a))return a;
    if (strp(a))return rp(a);
    err(prop, "Invalid obj prop name a = $1", a);
  }
  
  function jstr(a){
    if (nilp(a))return "";
    if (symp(a) || nump(a))return a;
    if (strp(a))return rp(a);
    err(jstr, "Can't coerce a = $1 to jstr", a);
  }
  
  function jarr(a){
    if (arrp(a))return rp(a);
    if (lisp(a))return rdc(function (r, x){
      return $.psh(x, r);
    }, [], a);
    err(jarr, "Can't coerce a = $1 to jarr", a);
  }
  
  function jmat(a){
    if (nilp(a))return "";
    if (symp(a) || nump(a) || rgxp(a) || fnp(a))return a;
    if (strp(a))return rp(a);
    if (lisp(a) || arrp(a))return jarr(map(jmat, a));
    err(jmat, "Can't coerce a = $1 to jmat", a);
  }
  
  ////// Add //////
  
  ////// Sequence //////
  
  //// Items ////
  
  function ref(a){
    return $.rdc(ref1, a, $.sli(arguments, 1));
  }
  
  function ref1(a, n){
    if (lisp(a))return nth(n, a);
    if (symp(a) || nump(a))return chku($.ref(a, $.num(n)));
    if (strp(a))return s(ref1(rp(a), n));
    if (arrp(a))return chku($.ref(rp(a), $.num(n)));
    if (objp(a))return chku($.ref(a, n));
    err(ref, "Can't get item n = $1 of a = $2", n, a);
  }
  
  function set(a, n, x){
    if (udfp(x))x = [];
    if (lisp(a))return (function set(a, n, x){
      if (nilp(a))psh([], a);
      if (le(n, "0"))return a[0] = x;
      return set(cdr(a), sub(n, "1"), x);
    })(a, n, x);
    if (arrp(a))return $.set(rp(a), $.num(n), x);
    if (objp(a))return $.set(a, n, x);
    err(set, "Can't set item n = $1 of a = $2 to x = $3", n, a, x);
  }
  
  function fst(a){
    return ref(a, "0");
  }
  
  function las(a){
    return ref(a, sub(len(a), "1"));
  }
  
  //// Apply ////
  
  function map(f, a){
    if (lisp(a))return (function map(f, a){
      if (nilp(a))return [];
      return cons(cal(f, car(a)), map(f, cdr(a)));
    })(f, a);
    if (arrp(a))return r($.map(f, rp(a)));
    if (objp(a))return $.map(f, a);
    err(map, "Can't map f = $1 over a = $2", f, a);
  }
  
  function pos(x, a, n){
    if (udfp(n))n = "0";
    if (lisp(a))return (function pos(x, a, n){
      if (udfp(n))n = "0";
      if (nilp(a))return "-1";
      if (is(car(a), x))return n;
      return pos(x, cdr(a), add(n, "1"));
    })(x, ncdr(n, a));
    if (arrp(a))return $.str($.pos(x, rp(a), $.num(n)));
    if (objp(a))return $.str($.pos(x, a, $.num(n)));
    if (symp(a) || nump(a))return $.str($.pos(jmat(x), a, $.num(n)));
    if (strp(a))return pos(x, rp(a), n);
    err(pos, "Can't get pos of x = $1 in a = $2 from n = $3", x, a, n);
  }
  
  function has(x, a){
    if (lisp(a))return (function has(x, a){
      if (nilp(a))return false;
      if (is(car(a), x))return true;
      return has(x, cdr(a));
    })(x, a);
    if (arrp(a))return $.has(x, rp(a));
    if (objp(a))return $.has(x, a);
    if (symp(a) || nump(a))return $.has(jmat(x), a);
    if (strp(a))return has(x, rp(a));
    err(has, "Can't find if a = $1 has x = $2", a, x);
  }
  
  //// Whole ////
  
  function len(a){
    if (lisp(a))return (function len(a){
      if (nilp(a))return "0";
      return add(len(cdr(a)), "1");
    })(a);
    if (symp(a) || nump(a) || objp(a))return $.str($.len(a));
    if (arrp(a))return $.str($.len(rp(a)));
    if (strp(a))return len(rp(a));
    err(len, "Can't get len of a = $1", a);
  }
  
  function emp(a){
    if (lisp(a))return nilp(a);
    if (arrp(a) || symp(a) || nump(a) || strp(a) ||
        fnp(a) || objp(a))return is(len(a), "0");
    if (udfp(a))return true;
    err(emp, "Can't find if a = $1 is empty", a);
  }
  
  function cpy(a){
    if (lisp(a))return map($.self, a);
    if (strp(a))return s(rp(a));
    if (arrp(a))return r($.cpy(rp(a)));
    if (objp(a))return $.cpy(a);
    return a;
  }
  
  function cln(a){
    if (lisp(a) || arrp(a) || objp(a))return map(cln, a);
    if (strp(a))return cpy(a);
    return a;
  }
  
  //// Parts ////
  
  function sli(a, n, m){
    if (lisp(a))return ncdr(n, udfp(m)?a:fstn(m, a));
    if (udfp(m))m = len(a);
    if (symp(a) || nump(a))return $.sli(a, $.num(n), $.num(m));
    if (strp(a))return s(sli(rp(a), n, m));
    if (arrp(a))return r($.sli(rp(a), $.num(n), $.num(m)));
    err(sli, "Can't slice a = $1 from n = $2 to m = $3", a, n, m);
  }
  
  function fstn(n, a){
    if (lisp(a))return (function fstn(n, a){
      if (le(n, "0") || nilp(a))return [];
      return cons(car(a), fstn(sub(n, "1"), cdr(a)));
    })(n, a);
    return sli(a, "0", n);
    err(fstn, "Can't get fst n = $1 of a = $2", n, a);
  }
  
  function nrst(n, a){
    return sli(a, n);
  }
  
  function rst(a){
    return sli(a, "1");
  }
  
  function mid(a){
    return sli(a, "1", sub(len(a), "1"));
  }
  
  //// Group ////
  
  function spl(a, x){
    if (symp(a) || nump(a))return $.spl(a, jmat(x));
    if (strp(a))return map(s, spl(rp(a), x));
    if (lisp(a))return (function spl(a, x, c){
      if (udfp(c))c = [];
      if (is(car(a), x))return cons(nrev(c), spl(cdr(a), x));
      return spl(cdr(a), x, cons(car(a), c));
    })(a, x);
    if (arrp(a))return r($.spl(rp(a), x));
    err(spl, "Can't split a = $1 by x = $2", a, x);
  }
  
  function grp(a, n){
    if (!is(n, "0")){
      if (lisp(a))return (function grp(a, n){
        if (nilp(a))return [];
        return cons(fstn(n, a), grp(ncdr(n, a), n));
      })(a, n);
      if (symp(a) || nump(a) || strp(a))return (function grp(a, n){
        if (emp(a))return [];
        return cons(fstn(n, a), grp(nrst(n, a), n));
      })(a, n);
      if (arrp(a))return r($.map(r, $.grp(rp(a), $.num(n))));
    }
    err(grp, "Can't grp a = $1 into grps of n = $2", a, n);
  }
  
  //// Join ////
  
  function joi(a, x){
    if (udfp(x))x = s("");
    if (lisp(a) || arrp(a)){
      return rdc(function (r, i){
        if (is(r, s("")))return str1(i);
        return app(r, x, str1(i));
      }, s(""), a);
    }
    err(joi, "Can't join a = $1 with x = $2", a, x);
  }
  
  function app(){
    var a = arguments;
    if ($.len(a) == 0)return "0";
    return $.rdc1(app2, $.rem(nilp, a));
  }
  
  function app2(a, b){
    if (lisp(a)){
      if (lisp(b) || arrp(b))return (function app(a, b){
        if (nilp(a))return b;
        if (nilp(b))return a;
        if (atmp(a))err(app, "a = $1 must be a list", a);
        return cons(car(a), app(cdr(a), b));
      })(a, tlis(b));
      return tai(a, b);
    }
    if (symp(a) || nump(a))return $.app(a, sym(b));
    if (strp(a))return s(app2(rp(a), b));
    if (objp(a))return $.app(a, tobj(b));
    if (arrp(a)){
      if (arrp(b) || lisp(b))return r($.app(jarr(a), jarr(b)));
      return tai(a, b);
    }
    err(app2, "Can't app a = $1 to b = $2", a, b);
  }
  
  //// Reduce ////
  
  function rdc(f, x, a){
    if (lisp(a))return (function rdc(f, x, a){
      if (no(a))return x;
      return rdc(f, f(x, car(a)), cdr(a));
    })(chkf(f), x, a);
    if (arrp(a))return $.rdc(chkf(f), x, rp(a));
    if (objp(a))return $.rdc(chkf(f), x, a);
    err(rdc, "Can't rdc a = $1 with f = $2 and x = $3", a, f, x);
  }
  
  function rdc1(f, a){
    if (lisp(a)){
      if (nilp(a))return [];
      return rdc(f, car(a), cdr(a));
    }
    if (arrp(a))return $.rdc1(chkf(f), rp(a));
    err(rdc1, "Can't rdc1 a = $1 with f = $2", a, f);
  }
  
  //// Array ////
  
  function hea(a, x){
    if (lisp(a))return cons(x, a);
    if (arrp(a))return ush(x, cpy(a));
    err(hea, "Can't hea a = $1 with x = $2", a, x);
  }
  
  function tai(a, x){
    if (lisp(a))return (function tai(a, x){
      if (nilp(a))return lis(x);
      return cons(car(a), tai(cdr(a), x));
    })(a, x);
    if (arrp(a))return psh(x, cpy(a));
    err(tai, "Can't tai a = $1 with x = $2", a, x);
  }
  
  //// Other ////
  
  function beg(a){
    var x = $.sli(arguments, 1);
    if (symp(a) || nump(a) || strp(a))return is(pos(r(x), a), "0");
    if (lisp(a) || arrp(a))return $.has(fst(a), x);
    err(beg, "Can't find if a = $1 begs with x = $2", a, $.dsp(x));
  }
  
  function end(a){
    var x = $.sli(arguments, 1);
    if (strp(a)){
      var c;
      for (var i = 0; i < $.len(x); i++){
        c = pol(x[i], a);
        if (c != -1 && c == len(a)-len(x[i]))return true;
      }
      return false;
    }
    if (lisp(a) || arrp(a))return $.has(las(a), x);
    err(end, "Can't find if a = $1 ends with x = $2", a, x);
  }
  
  function bnd(a, x, y){
    return beg(a, x) && end(a, y);
  }
  
  ////// Imperative //////
  
  //// Array ////
  
  function psh(x, a){
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
      $.psh(x, js(a));
      return a;
    }
    err(psh, "Can't psh x = $1 onto a = $2", x, a);
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
    if (arrp(a))return chku($.pop(rp(a)));
    err(pop, "Can't pop from a = $1", a);
  }
  
  function ush(x, a){
    if (lisp(a)){
      (function ush(x, a){
        if (nilp(a)){
          psh(x, a);
          return;
        }
        ush(x, cdr(a));
      })(x, a);
      return a;
    }
    if (arrp(a)){
      $.ush(x, rp(a));
      return a;
    }
    err(ush, "Can't ush x = $1 onto a = $2", x, a);
  }
  
  function shf(a){
    if (lisp(a))return (function shf(a){
      if (nilp(a))return [];
      if (nilp(cdr(a)))return pop(a);
      return shf(cdr(a));
    })(a);
    if (arrp(a))return chku($.shf(rp(a)));
    err(shf, "Can't shf from a = $1", a);
  }
  
  ////// List //////
  
  function car(a){
    if (udfp(a)){
      alert("here");
    }
    return !udfp(a[0])?a[0]:[];
  }
  
  function cdr(a){
    return !udfp(a[0])?a[1]:[];
  }
  
  function cons(a, b){
    return [a, b];
  }
  
  //// cxr ////
  
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
  
  function cxr(x, a){
    if (udfp(a))return function (a){
      return cxr(x, a);
    };
    if ($.emp(x))return a;
    if ($.beg(x, "a"))return car(cxr($.rst(x), a));
    if ($.beg(x, "d"))return cdr(cxr($.rst(x), a));
    err(cxr, "x = $1 must only contain a's and d's", x);
  }
  
  //// General ////
  
  // can't use rdc because it's backwards
  function lis(){
    var a = arguments;
    var r = [];
    for (var i = $.len(a)-1; i >= 0; i--){
      r = cons(a[i], r);
    }
    return r;
  }
  
  function nth(n, a){
    if (le(n, "0"))return car(a);
    return nth(sub(n, "1"), cdr(a));
  }
  
  function ncdr(n, a){
    if (le(n, "0"))return a;
    return ncdr(sub(n, "1"), cdr(a));
  }
  
  function nrev(a, l){
    if (nilp(a))return l;
    var n = a[1];
    a[1] = l;
    return nrev(n, a);
  }
  
  ////// Array //////
  
  function arr(){
    return r($.cpy(arguments));
  }
  
  ////// Number //////
  
  function add(){
    var a = arguments;
    if (a.length == 0)return "0";
    return $.rdn1(R.add, a);
  }
  
  function sub(){
    var a = arguments;
    if (a.length == 0)return "0";
    if (a.length == 1)return R.neg(a[0]);
    return $.rdn1(R.sub, a);
  }
  
  function mul(){
    var a = arguments;
    if (a.length == 0)return "1";
    return $.rdn1(R.mul, a);
  }
  
  function div(){
    var a = arguments;
    if (a.length == 0)return "1";
    if (a.length == 1)return R.div("1", a[0]);
    return $.rdn1(R.div, a);
  }
  
  function lt(){
    var a = arguments;
    for (var i = 1; i < a.length; i++){
      if (!R.lt(a[i-1], a[i]))return false;
    }
    return true;
  }
  
  function gt(){
    var a = arguments;
    for (var i = 1; i < a.length; i++){
      if (!R.gt(a[i-1], a[i]))return false;
    }
    return true;
  }
  
  function le(){
    var a = arguments;
    for (var i = 1; i < a.length; i++){
      if (!R.le(a[i-1], a[i]))return false;
    }
    return true;
  }
  
  function ge(){
    var a = arguments;
    for (var i = 1; i < a.length; i++){
      if (!R.ge(a[i-1], a[i]))return false;
    }
    return true;
  }
  
  ////// Function //////
  
  function cal(a){
    return $.apl(a, $.sli(arguments, 1));
  }
  
  function scal(f){
    cal = f;
  }
  
  ////// Checkers //////
  
  function chku(a){
    return udfp(a)?[]:a;
  }
  
  function chkb(a){
    if (a === false)return [];
    if (a === true)return "t";
    return a;
  }
  
  function chkf(a){
    if (fnp(a) && !jnp(a))return function (){
      return $.apl(cal, $.hea(arguments, a));
    }
    return a;
  }
  
  function chrb(f){
    return $.cmps(chkb, f);
  }
  
  function chrf(f){
    return $.cmps(chkf, f);
  }
  
  ////// Error //////
  
  // special handler that uses dsp(a)
  function err(f, a){
    $.err(f, $.rdc1(function (s, a, i){
      return $.rpl("$" + i, dsj(a), s);
    }, $.sli(arguments, 1)));
  }
  
  ////// Other //////
  
  function dol(){
    return chku($.las(arguments));
  }
  
  gs.n = 0;
  function gs(){
    return "gs" + gs.n++;
  }
  
  ////// Object exposure //////
  
  win.L = {
    typ: typ,
    tg: tg,
    rp: rp,
    r: r,
    s: s,
    
    nilp: nilp,
    lisp: lisp,
    atmp: atmp,
    nump: nump,
    symp: symp,
    objp: objp,
    rgxp: rgxp,
    udfp: udfp,
    tgp: tgp,
    strp: strp,
    arrp: arrp,
    fnp: fnp,
    macp: macp,
    spcp: spcp,
    prcp: prcp,
    
    is: is,
    isa: isa,
    inp: inp,
    
    dyn: dyn,
    
    dsp: dsp,
    dsj: dsj,
    
    ofn: ofn,
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
    jstr: jstr,
    jarr: jarr,
    jmat: jmat,
    
    ref: ref,
    set: set,
    fst: fst,
    las: las,
    
    map: map,
    pos: pos,
    has: has,
    
    len: len,
    emp: emp,
    cpy: cpy,
    cln: cln,
    
    sli: sli,
    fstn: fstn,
    nrst: nrst,
    rst: rst,
    mid: mid,
    
    spl: spl,
    grp: grp,
    
    joi: joi,
    app: app,
    app2: app2,
    
    rdc: rdc,
    rdc1: rdc1,
    
    hea: hea,
    tai: tai,
    
    beg: beg,
    end: end,
    bnd: bnd,
    
    psh: psh,
    pop: pop,
    ush: ush,
    shf: shf,
    
    car: car,
    cdr: cdr,
    cons: cons,
    
    caar: caar,
    cadr: cadr,
    cdar: cdar,
    cddr: cddr,
    cxr: cxr,
    
    lis: lis,
    nth: nth,
    ncdr: ncdr,
    nrev: nrev,
    
    arr: arr,
    
    add: add,
    sub: sub,
    mul: mul,
    div: div,
    
    lt: lt,
    gt: gt,
    le: le,
    ge: ge,
    
    cal: cal,
    scal: scal,
    
    chku: chku,
    chkb: chkb,
    chrb: chrb,
    
    err: err,
    
    dol: dol,
    gs: gs
  };
  
  ////// Testing //////
  
  
  
})(window);
