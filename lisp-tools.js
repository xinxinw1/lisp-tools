/***** Lisp Tools 0.1 *****/

/* require tools >= 4.4.1 */
/* require prec-math */

//var calls = {smacp: []};
(function (udf){
  var nodep = $.nodep;
  
  ////// Type //////
  
  function typ(a){
    return a.type;
  }
  
  function tag(a, x, y){
    return a[x] = y;
  }
  
  // n is probably never going to be greater than js int size
  function rep(a, x){
    return a[x];
  }
  
  // detach
  function det(a, x){
    var r = a[x];
    delete a[x];
    return r;
  }
  
  function dat(a){
    return a.data;
  }
  
  function sdat(a, x){
    return a.data = x;
  }
  
  //// Builders ////
  
  function mk(t, o){
    if (udfp(o))return {type: t};
    return $.app(o, {type: t});
  }
  
  function mkdat(t, d, o){
    if (udfp(o))return {type: t, data: d};
    return $.app(o, {type: t, data: d});
  }
  
  function mkbui(t){
    return function (a){
      return mkdat(t, a);
    };
  }
  
  var sy = mkbui("sym");
  
  function nu(a){
    var n = R.real(a);
    if (n === false)err(nu, "Invalid number $1", a);
    return mkdat("num", n);
  }
  
  var st = mkbui("str");
  var ar = mkbui("arr");
  var ob = mkbui("obj");
  var rx = mkbui("rgx");
  var jn = mkbui("jn");
  var ma = mkbui("mac");
  var sm = mkbui("smac");
  
  function car(a){
    return (a.car === udf)?nil():a.car;
  }
  
  function cdr(a){
    return (a.cdr === udf)?nil():a.cdr;
  }
  
  function gcar(a){
    return a.car;
  }
  
  function gcdr(a){
    return a.cdr;
  }
  
  function cons(a, b){
    return {type: "lis", car: a, cdr: b};
  }
  
  function nil(){
    return {type: "nil"};
  }
  
  function scar(a, x){
    return a.car = x;
  }
  
  function scdr(a, x){
    return a.cdr = x;
  }
  
  function lis(){
    var a = arguments;
    var r = nil();
    for (var i = a.length-1; i >= 0; i--){
      r = cons(a[i], r);
    }
    return r;
  }
  
  // can't use fold because it's backwards
  /*function lis2(){
    return $.foldr(cons, [], arguments);
  }*/
  
  function lisd(){
    var a = arguments;
    if (a.length === 0)return nil();
    var r = a[a.length-1];
    for (var i = a.length-2; i >= 0; i--){
      r = cons(a[i], r);
    }
    return r;
  }
  
  // can't use foldr because default for lisd() is [] instead of nil()
  /*function lisd(){
    return $.foldr(cons, arguments);
  }*/
  
  function arr(){
    return ar($.cpy(arguments));
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
  
  //// Predicates ////
  
  function isa(t, a){
    return a.type === t;
  }
  
  function isany(t){
    var a = arguments;
    for (var i = 1; i < a.length; i++){
      if (isa(t, a[i]))return true;
    }
    return false;
  }
  
  function typin(a){
    var tp = typ(a);
    var t = arguments;
    for (var i = 1; i < t.length; i++){
      if (tp === t[i])return true;
    }
    return false;
  }
  
  // return isa(t, a);
  function mkpre(t){
    return function (a){
      return a.type === t;
    };
  }
  
  var udfp = $.udfp;
  
  // !!a to deal with null and undefined inputs
  function tagp(a){
    return !!a && a.type !== udf;
  }
  
  var nilp = mkpre("nil");
  var symp = mkpre("sym");
  var nump = mkpre("num");
  var strp = mkpre("str");
  var lisp = mkpre("lis");
  var arrp = mkpre("arr");
  var objp = mkpre("obj");
  var rgxp = mkpre("rgx");
  var jnp = mkpre("jn");
  var macp = mkpre("mac");
  var smacp = mkpre("smac");
  
  /*
  (mac defpre (nm s)
    `(def ,nm (a) (isa ,s a)))
  
  (mac mkpre (s)
    `(defpre ,(app s 'p) ',s))
  
  (byone mkpres mkpre)
  
  (mkpres sym num cons arr obj rgx jn mac smac)
  */
  
  /*function symp(a){
    return a.type === "sym";
  }
  
  function nump(a){
    return a.type === "num";
  }
  
  function strp(a){
    return a.type === "str";
  }
  
  function lisp(a){
    return a.type === "lis";
  }
  
  function arrp(a){
    return a.type === "arr";
  }
  
  function objp(a){
    return a.type === "obj";
  }
  
  function rgxp(a){
    return a.type === "rgx";
  }
  
  function jnp(a){
    return a.type === "jn";
  }
  
  function macp(a){
    return a.type === "mac";
  }
  
  function smacp(a){
    return a.type === "smac";
  }*/
  
  /*function nilp(a){
    return symp(a) && dat(a) === "nil";
  }*/
  
  function listp(a){
    return lisp(a) || nilp(a);
  }
  
  function atmp(a){
    return !lisp(a);
  }
  
  function synp(a){
    return typin(a, "sym", "str");
  }
  
  function fnp(a){
    return typin(a, "fn", "jn", "jn2");
  }
  
  function specp(a){
    return typin(a, "mac", "smac", "spec");
  }
  
  function procp(a){
    return fnp(a) || specp(a);
  }
  
  ////// Comparison //////
  
  function is(a, b){
    if (typ(a) !== typ(b))return false;
    switch (typ(a)){
      case "nil": return true; // typ(a) already === typ(b)
      case "num": return R.is(dat(a), dat(b));
      case "sym":
      case "str": return dat(a) === dat(b);
      case "rgx": return $.iso(dat(a), dat(b));
    }
    return a === b;
  }
  
  function isn(a, b){
    return !is(a, b);
  }
  
  function iso(a, b){
    if (typ(a) !== typ(b))return false;
    switch (typ(a)){
      case "lis": return ilis(a, b);
      case "arr": return iarr(a, b);
      case "obj": return iobj(a, b);
    }
    return is(a, b);
  }
  
  function ilis(a, b){
    if (is(a, b))return true;
    if (atmp(a) || atmp(b))return false;
    return iso(car(a), car(b)) && iso(cdr(a), cdr(b));
  }
  
  function iarr(a, b){
    a = dat(a); b = dat(b);
    if (a.length !== b.length)return false;
    for (var i = 0; i < a.length; i++){
      if (!iso(a[i], b[i]))return false;
    }
    return true;
  }
  
  function iobj(a, b){
    a = dat(a); b = dat(b);
    for (var i in a){
      if (!$.ohas(b, i))return false;
      if (!iso(a[i], b[i]))return false;
    }
    for (var i in b){
      if (!$.ohas(a, i))return false;
      if (!iso(a[i], b[i]))return false;
    }
    return true;
  }
  
  function inp(x){
    var a = arguments;
    for (var i = 1; i < a.length; i++){
      if (is(a[i], x))return true;
    }
    return false;
  }
  
  ////// Dynamic vars //////
  
  function sta(a, x, f){
    psh(x, a);
    try {
      return f();
    } finally {
      pop(a);
    }
  }
  
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
    return st(dsj(a));
  }
  
  var dsps = nil();
  function dsj(a){
    return sta(dsps, a, function (){
      return dsj2(a);
    });
  }
  
  function dsj2(a){
    if (!tagp(a))return $.stf("<js $1>", a);
    switch (typ(a)){
      case "nil": return "nil";
      case "num": return R.tostr(dat(a));
      case "sym": return dsym(a);
      case "str": return $.dsp(dat(a));
      case "lis": return dlis(a);
      case "arr": return darr(a);
      case "obj": return dobj(a);
      case "rgx": return "#\"" + $.rpl("\"", "\\\"", dat(a).source) + "\"";
      case "jn": return "<jn " + $.dsp(dat(a)) + ">";
      case "jn2": return "<jn2 " + dsj(rep(a, "ag")) + " "
                                 + $.dsp(rep(a, "fn")) + ">";
      case "fn": return dfn(a);
      case "mac": return dmac(a);
      case "smac": return dsmac(a);
      case "spec": return "<spec " + dat(a) + ">";
    }
    var o = cpy(a);
    det(o, "type");
    return "<" + typ(a) + " " + dobj(ob(o)) + ">";
  }
  
  function dsym(a){
    var fr = ["\\", "\n", "\r", "\t", "\b", "\f"];
    var to = ["\\\\", "\\n", "\\r", "\\t", "\\b", "\\f"];
    return $.rpl(fr, to, dat(a));
  }
  
  var dlists = nil();
  var i = -1;
  function dlis(a){
    if (has(a, cdr(dsps))){
      $.al(dsps);
      return "(...)";
    }
    if (is(car(a), sy("qt")))return "'" + dsj(cadr(a));
    if (is(car(a), sy("qq")))return "`" + dsj(cadr(a));
    if (is(car(a), sy("uq")))return "," + dsj(cadr(a));
    if (is(car(a), sy("uqs")))return ",@" + dsj(cadr(a));
    if (is(car(a), sy("qgs")))return "#" + dsj(cadr(a));
    if (is(car(a), sy("splice")))return "@" + dsj(cadr(a));
    if (is(car(a), sy("fn1")))return "(fn (_) " + dsj(cadr(a)) + ")";
    return "(" + sta(dlists, a, function (){
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
  
  function dobj(a){
    if (has(a, cdr(dsps)))return "{...}";
    return "{" + $.foldi(function (s, x, i){
      if (s == "")return i + " " + dsj(x);
      return s + " " + i + " " + dsj(x);
    }, "", dat(a)) + "}";
  }
  
  function darr(a){
    if (has(a, cdr(dsps)))return "#[...]";
    return "#[" + $.fold(function (s, x){
      if (s == "")return dsj(x);
      return s + " " + dsj(x);
    }, "", dat(a)) + "]";
  }
  
  function dfn(a){
    var nm = rep(a, "nm");
    if (!nilp(nm))return "<fn " + nm + " " + dsj(rep(a, "ag")) + ">";
    return "<fn " + dsj(rep(a, "ag")) + ">";
  }
  
  function dmac(a){
    var nm = rep(a, "nm");
    if (!nilp(nm))return "<mac " + nm + " " + dsj(rep(dat(a), "ag")) + ">";
    return "<mac " + dsj(rep(dat(a), "ag")) + ">";
  }
  
  function dsmac(a){
    var nm = rep(a, "nm");
    if (!nilp(nm))return "<smac " + nm + " " + dsj(rep(dat(a), "bd")) + ">";
    return "<smac " + dsj(rep(dat(a), "bd")) + ">";
  }
  
  ////// Output //////
  
  var of = function (a){return nil();}
  
  function ofn(f){
    return of = f;
  }
  
  function gofn(){
    return of;
  }
  
  function ou(a){
    return of(a);
  }
  
  function out(a){
    return of(app(a, st("\n")));
  }
  
  function alr(a){
    $.alr(dat(a));
    return nil();
  }
  
  function pr(){
    return ou(apl(jn(stf), ar(arguments)));
  }
  
  function prn(a){
    return out(apl(jn(stf), ar(arguments)));
  }
  
  function al(a){
    return alr(apl(jn(stf), ar(arguments)));
  }
  
  function logobj(a){
    console.log(a);
    return nil();
  }
  
  function log(){
    console.log(dat(apl(jn(stf), ar(arguments))));
    return nil();
  }
  
  ////// Converters //////
  
  function sym(a){
    switch (typ(a)){
      case "nil": return sy("");
      case "sym": return a;
      case "str": return sy(dat(a));
    }
    return sy(dsj(a));
  }
  
  function str(){
    return joi(ar(arguments));
  }
  
  function str1(a){
    switch (typ(a)){
      case "nil": return st("");
      case "str": return a;
      case "sym": return st(dat(a));
    }
    return dsp(a);
  }
  
  function num(a){
    switch (typ(a)){
      case "num": return a;
      case "str":
      case "sym": 
        var s = $.mat(/^-?[0-9]+(\.[0-9]+)?/, dat(a));
        return (s === -1)?nu("0"):nu(s);
    }
    return nu("0");
  }
  
  // input: a lisp object
  // output: a lisp fn that returns lisp objects
  function tfn(a){
    switch (typ(a)){
      case "fn": 
      case "jn": 
      case "jn2": return a;
    }
    return jn(function (x){
      return chkb(is(x, a));
    });
  }
  
  function tarr(a){
    var t = typ(a);
    switch (t){
      case "arr": return a;
      case "lis": return ar(jarr(a));
      case "nil": return ar([]);
      case "sym":
      // case "num":
      case "str": return ar($.map(mkbui(t), $.tarr(dat(a))));
    }
    err(tarr, "Can't coerce a = $1 to arr", a);
  }
  
  function tlis(a){
    switch (typ(a)){
      case "nil":
      case "lis": return a;
      case "arr": return $.apl(lis, dat(a));
      case "sym":
      case "str":
      case "num": return tlis(tarr(a));
      case "obj": return $.foldi(function (l, x, i){
        return cons(cons(i, x), l);
      }, nil(), a);
    }
    err(tlis, "Can't coerce a = $1 to lis", a);
  }
  
  /*function tobj(a, o){
    if (udfp(o))o = {};
    if (objp(a))return app(a, o);
    if (listp(a))return foldlis(function (o, x){
      if (atmp(x))err(tobj, "Can't coerce a = $1 to obj", a);
      o[prop(car(x))] = cdr(x);
      return o;
    }, o, a);
    if (arrp(a))return $.tobj($.map(function (x){
      if (!$.arrp(x))err(tobj, "Can't coerce a = $1 to obj", a);
      return [jstr(x[0]), x[1]];
    }, $.map(jarr, rp(a))), tobj(o));
    if (synp(a))return $.tobj(a, tobj(o));
    if (strp(a))return map(s, tobj(rp(a), o));
    err(tobj, "Can't coerce a = $1 to obj", a);
  }*/
  
  function tobj(a){
    var t = typ(a);
    switch (t){
      case "obj": return a;
      case "nil": return ob({});
      case "lis": return foldlis(function (o, x){
        if (atmp(x))err(tobj, "Can't coerce a = $1 to obj", a);
        o[prop(car(x))] = cdr(x);
        return o;
      }, ob({}), a);
      case "arr": return ob($.tobj($.map(function (x){
        if (!$.arrp(x))err(tobj, "Can't coerce a = $1 to obj", a);
        return [jstr(x[0]), x[1]];
      }, $.map(jarr, dat(a))), ob({})));
      case "sym":
      case "str":
      case "num": return ob($.map(mkbui(t), $.tobj(dat(a))));
    }
    err(tobj, "Can't coerce a = $1 to obj", a);
  }
  
  function prop(a){
    if (synp(a))return dat(a);
    if (nump(a))return dsj(a);
    err(prop, "Invalid obj prop name a = $1", a);
  }
  
  function jstr(a){
    if (synp(a))return dat(a);
    if (nump(a))return dsj(a);
    err(jstr, "Can't coerce a = $1 to jstr", a);
  }
  
  function jarr(a){
    switch (typ(a)){
      case "arr": return dat(a);
      case "lis":
        var o = a;
        var r = [];
        while (lisp(o)){
          r.push(car(o));
          o = cdr(o);
        }
        return r;
      case "nil": return [];
    }
    err(jarr, "Can't coerce a = $1 to jarr", a);
  }
  
  /*function jarr(a){
    if (arrp(a))return rp(a);
    if (listp(a))return foldlis(function (r, x){
      r.push(x);
      return r;
    }, [], a);
    err(jarr, "Can't coerce a = $1 to jarr", a);
  }*/
  
  // input: lisp obj
  // output: js num
  function jnum(a){
    return R.tonum(dat(num(a)));
  }
  
  // input: js obj
  // output: lisp num
  function lnum(a){
    return num(st($.str(a)));
  }
  
  function jmat(a){
    switch (typ(a)){
      case "nil": return "";
      case "sym": 
      case "str":
      case "rgx": return dat(a);
      case "num": return dsj(a);
      case "fn": 
      case "jn":
      case "jn2": return jbn(a);
      case "lis": 
      case "arr": return jarr(map(jn(jmat), a));
    }
    err(jmat, "Can't coerce a = $1 to jmat", a);
  }
  
  // input: a js fn that returns js bools
  // output: a lisp fn that returns lisp bools
  function lbn(a){
    return jn(chrb(a));
  }
  
  // input: a lisp fn that returns lisp objs
  // output: a js fn that returns lisp objs
  function tjn(a){
    switch (typ(a)){
      case "jn": return dat(a);
      case "fn":
      case "jn2": return function (){
        return apl(a, tlis(ar(arguments)));
      };
    }
    return function (x){
      return chkb(is(x, a));
    };
  }
  
  // input: a lisp fn that returns lisp bools
  // output: a js fn that returns js bools
  // jbn(lbn(f)) == f, if f returns js bools
  // lbn(jbn(f)) == f, if f returns lisp bools
  function jbn(a){
    switch (typ(a)){
      case "jn": return bchr(dat(a));
      case "fn":
      case "jn2": return function (){
        return bchk(apl(a, tlis(ar(arguments))));
      };
    }
    return function (x){
      return is(x, a);
    };
  }
  
  ////// Sequence //////
  
  //// Items ////
  
  function ref(a){
    return $.fold(ref1, a, $.sli(arguments, 1));
  }
  
  function ref1(a, n){
    var t = typ(a);
    switch (t){
      case "lis": return nth(n, a);
      case "nil": return nil();
      case "sym": 
      //case "num": 
      case "str":
        var r = chku($.ref(dat(a), jnum(n)));
        return nilp(r)?r:mkdat(t, r);
      case "arr": return chku($.ref(dat(a), jnum(n)));
      case "obj": return chku($.ref(dat(a), prop(n)));
    }
    err(ref, "Can't get item n = $1 of a = $2", n, a);
  }
  
  function set(a, n, x){
    if (udfp(x))x = nil();
    switch (typ(a)){
      case "nil":
      case "lis": return (function set(a, n, x){
        if (nilp(a))psh(nil(), a);
        if (le(n, nu("0")))return scar(a, x);
        return set(cdr(a), sub1(n), x);
      })(a, n, x);
      case "arr": return $.set(dat(a), jnum(n), x);
      case "obj": return $.set(dat(a), prop(n), x);
    }
    err(set, "Can't set item n = $1 of a = $2 to x = $3", n, a, x);
  }
  
  function fst(a){
    return ref(a, nu("0"));
  }
  
  function las(a){
    return ref(a, sub1(len(a)));
  }
  
  //// Apply ////
  
  // input: f = lisp fn, a = a lisp obj
  // default aplfn only supports jns
  var aplfn = function apl(f, a){
    if (jnp(f))return $.apl(dat(f), jarr(a));
    err(apl, "Can't apl f = $1 to a = $2", f, a);
  };
  
  function apl(f, a){
    return aplfn(f, a);
  }
  
  // no calling restrictions!
  // all instances of apl are set with this
  function sapl(f){
    return aplfn = f;
  }
  
  // input: f = lisp fn
  // args are converted into a list
  // $.apl(lis, $.sli(arguments, 1))
  // when this is updated, update lisp-exec jcal as will
  function cal(f){
    return apl(f, tlis(ar($.sli(arguments, 1))));
  }
  
  function map(f, a){
    switch (typ(a)){
      case "nil":
      case "lis": return maplis(tjn(f), a);
      case "arr": return ar($.map(tjn(f), dat(a)));
      case "obj": return ob($.map(tjn(f), dat(a)));
    }
    err(map, "Can't map f = $1 over a = $2", f, a);
  }
  
  function mapn(f, a){
    switch (typ(a)){
      case "nil":
      case "lis": return maplis(f, a);
      case "arr": return ar($.map(f, dat(a)));
      case "obj": return ob($.map(f, dat(a)));
    }
    err(mapn, "Can't mapn f = $1 over a = $2", f, a);
  }
  
  function maplis(f, a){
    var r = nil();
    while (lisp(a)){
      r = cons(f(car(a)), r);
      a = cdr(a);
    }
    return nrev(r);
  }
  
  /*function maplis(f, a){
    if (nilp(a))return [];
    return cons(f(car(a)), maplis(f, cdr(a)));
  }*/
  
  /*function dmap(f, a){
    x = jn(f);
    if (synp(a) || strp(a))return x(a);
    if (listp(a))return cons(dmap(x, car(a)), dmap(x, cdr(a)));
    if (arrp(a) || objp(a))return map(function (i){
      return dmap(x, i);
    }, a);
    err(dmap, "Can't dmap f = $1 over a = $2", f, a);
  }*/
  
  // the following fns that take boolean fns
  //   take lisp fns returning lisp bools only!
  
  function pos(x, a, n){
    if (udfp(n))n = nu("0");
    var t = typ(a);
    switch (t){
      case "nil": return nu("-1");
      case "lis": return (function pos(x, a, n){
        if (nilp(a))return nu("-1");
        if (x(car(a)))return n;
        return pos(x, cdr(a), add1(n));
      })(jbn(x), ncdr(n, a), n);
      case "arr":
      case "obj": return lnum($.pos(jbn(x), dat(a), jnum(n)));
      case "sym": 
      //case "num": 
      case "str": return lnum($.pos(jmat(x), dat(a), jnum(n)));
    }
    err(pos, "Can't get pos of x = $1 in a = $2 from n = $3", x, a, n);
  }
  
  function has(x, a){
    switch (typ(a)){
      case "nil": return false;
      case "lis": return haslis(jbn(x), a);
      case "arr":
      case "obj": return $.has(jbn(x), dat(a));
      case "sym": 
      //case "num":
      case "str": return $.has(jmat(x), dat(a));
    }
    err(has, "Can't find if a = $1 has x = $2", a, x);
  }
  
  function haslis(x, a){
    if (nilp(a))return false;
    if (x(car(a)))return a;
    return haslis(x, cdr(a));
  }
  
  /*function all(x, a){
    if (listp(a))return (function all(x, a){
      if (nilp(a))return true;
      if (!x(car(a)))return false;
      return all(x, cdr(a));
    })(jbn(x), a);
    if (arrp(a))return $.all(jbn(x), rp(a));
    if (objp(a))return $.all(jbn(x), a);
    if (synp(a))return $.all(jmat(x), a);
    if (strp(a))return all(x, rp(a));
    err(all, "Can't find if all a = $1 is x = $2", a, x);
  }
  
  function keep(x, a){
    if (listp(a))return (function keep(x, a){
      if (nilp(a))return [];
      if (!x(car(a)))return keep(x, cdr(a));
      return cons(car(a), keep(x, cdr(a)));
    })(jbn(x), a);
    if (synp(a))return $.keep(jmat(x), a);
    if (strp(a))return s(keep(x, rp(a)));
    if (objp(a))return $.keep(jbn(x), a);
    if (arrp(a))return r($.keep(jbn(x), rp(a)));
    err(keep, "Can't keep x = $1 in a = $2", x, a);
  }*/
  
  function rem(x, a){
    var t = typ(a);
    switch (t){
      case "nil": return nil();
      case "lis": return (function rem(x, a){
        if (nilp(a))return nil();
        if (x(car(a)))return rem(x, cdr(a));
        return cons(car(a), rem(x, cdr(a)));
      })(jbn(x), a);
      case "sym": 
      //case "num":
      case "str": return mkdat(t, $.rem(jmat(x), dat(a)));
      case "obj":
      case "arr": return mkdat(t, $.rem(jbn(x), dat(a)));
    }
    err(rem, "Can't rem x = $1 from a = $2", x, a);
  }
  
  /*// remove from the beginning
  function remb(x, a){
    if (listp(a))return (function remb(x, a){
      if (nilp(a))return [];
      if (x(car(a)))return remb(x, cdr(a));
      return a;
    })(jbn(x), a);
    if (synp(a))return $.remb(jmat(x), a);
    if (strp(a))return s(remb(x, rp(a)));
    if (arrp(a))return r($.remb(jbn(x), rp(a)));
    err(remb, "Can't remb x = $1 from a = $2", x, a);
  }
  
  // remove from the end
  function reme(x, a){
    if (listp(a))return nrev(remb(x, nrev(a)));
    err(reme, "Can't reme x = $1 from a = $2", x, a);
  }*/
  
  function rpl(x, y, a){
    var t = typ(a);
    switch (t){
      case "nil": return nil();
      case "lis": return (function rpl(x, y, a){
        if (nilp(a))return nil();
        return cons(x(car(a))?y:car(a), rpl(x, y, cdr(a)));
      })(jbn(x), y, a);
      case "sym": 
      //case "num":
      case "str": return mkdat(t, $.rpl(jmat(x), jmat(y), dat(a)));
      case "obj":
      case "arr": return mkdat(t, $.rpl(jbn(x), y, dat(a)));
    }
    err(rpl, "Can't rpl x = $1 with y = $2 in a = $3", x, y, a);
  }
  
  /*function mat(x, a){
    if (listp(a))return (function mat(x, a){
      if (nilp(a))return [];
      if (x(car(a)))return car(a);
      return mat(x, cdr(a));
    })(jbn(x), a);
    if (synp(a))return $.mat(jmat(x), a);
    if (strp(a))return s(mat(x, rp(a)));
    if (objp(a))return $.mat(jbn(x), a);
    if (arrp(a))return r($.mat(jbn(x), rp(a)));
    err(mat, "Can't match x = $1 a = $2", x, a);
  }
  
  function mats(x, a){
    if (listp(a))return keep(x, a);
    if (synp(a))return $.mats(jmat(x), a);
    if (strp(a))return s(mats(x, rp(a)));
    if (objp(a)){
      var f = jbn(x);
      var l = [];
      for (var i in a){
        if (f(a[i]))l = cons(a[i], l);
      }
      return nrev(l);
    }
    if (arrp(a))return r($.mats(jbn(x), rp(a)));
    err(mats, "Can't get matches of x = $1 a = $2", x, a);
  }*/
  
  //// Whole ////
  
  function len(a){
    switch (typ(a)){
      case "lis": return lenlis(a);
      case "nil": return nu("0");
      case "sym": 
      //case "num":
      case "str":
      case "obj": 
      case "arr": return nu($.str($.len(dat(a))));
    }
    err(len, "Can't get len of a = $1", a);
  }
  
  // apparently the largest len ever seen when running compile-basic is 2
  // probably shouldn't worry about this getting too big
  function lenlis(a){
    var r = 0;
    while (lisp(a)){
      r += 1;
      a = cdr(a);
    }
    return nu($.str(r));
  }
  
  /*function lenlis2(a){
    if (nilp(a))return "0";
    return add(lenlis2(cdr(a)), "1");
  }*/
  
  function emp(a){
    switch (typ(a)){
      case "lis": return false;
      case "nil": return true;
      case "sym": 
      case "str":
      //case "num":
      case "arr":
      case "obj": return is(len(a), nu("0"));
    }
    err(emp, "Can't find if a = $1 is empty", a);
  }
  
  function cpy(a){
    var t = typ(a);
    switch (t){
      case "lis": return map(jn($.self), a);
      case "nil": return nil();
      case "str":
      //case "num":
      case "sym":
      case "obj":
      case "arr": return mkdat(t, $.cpy(dat(a)));
    }
    return $.cpy(a);
  }
  
  /*function cln(a){
    if (listp(a) || arrp(a) || objp(a))return map(cln, a);
    if (strp(a))return cpy(a);
    return a;
  }*/
  
  function rev(a){
    var t = typ(a);
    switch (t){
      case "lis": return revlis(a);
      case "nil": return nil();
      case "sym": 
      case "str":
      //case "num": 
      case "arr": return mkdat(t, $.rev(dat(a)));
    }
    err(rev, "Can't reverse a = $1", a);
  }
  
  function revlis(a, b){
    if (udfp(b))b = nil();
    while (lisp(a)){
      b = cons(car(a), b);
      a = cdr(a);
    }
    return b;
  }
  
  /*function revlis(a, b){
    if (nilp(a))return b;
    return revlis(cdr(a), cons(car(a), b));
  }*/
  
  //// Parts ////
  
  function sli(a, n, m){
    var t = typ(a);
    if (t === "lis")return ncdr(n, udfp(m)?a:fstnlis(m, a));
    if (udfp(m))m = len(a);
    switch (t){
      case "nil": return nil();
      case "sym": 
      case "str":
      //case "num":
      case "arr": return mkdat(t, $.sli(dat(a), jnum(n), jnum(m)));
    }
    err(sli, "Can't slice a = $1 from n = $2 to m = $3", a, n, m);
  }
  
  function fstn(n, a){
    return sli(a, nu("0"), n);
  }
  
  function fstnlis(n, a){
    if (le(n, nu("0")) || nilp(a))return nil();
    return cons(car(a), fstnlis(sub1(n), cdr(a)));
  }
  
  function rstn(n, a){
    return sli(a, n);
  }
  
  function rst(a){
    return sli(a, nu("1"));
  }
  
  function mid(a){
    return sli(a, nu("1"), sub1(len(a)));
  }
  
  //// Group ////
  
  function spl(a, x){
    var t = typ(a);
    switch (t){
      case "sym":
      case "str": 
      //case "num":
        if (udfp(x))x = L.st("");
        return tlis(ar($.map(mkbui(t), $.spl(dat(a), jmat(x)))));
      case "nil": return lis(nil());
      case "lis":
        if (udfp(x))return grp(a, L.nu("1"));
        return (function spl(a, x, c){
          if (udfp(c))c = nil();
          if (nilp(a))return cons(nrev(c), nil());
          if (x(car(a)))return cons(nrev(c), spl(cdr(a), x));
          return spl(cdr(a), x, cons(car(a), c));
        })(a, jbn(x));
      case "arr":
        if (udfp(x))return grp(a, L.nu("1"));
        return ar($.map(ar, $.spl(dat(a), jbn(x))));
    }
    err(spl, "Can't split a = $1 by x = $2", a, x);
  }
  
  function grp(a, n){
    if (isn(n, nu("0"))){
      switch (typ(a)){
        case "lis": return grplis(a, n);
        case "nil": return nil();
        case "sym": 
        //case "num":
        case "str": return grpstr(a, n);
        case "arr": return ar($.map(ar, $.grp(dat(a), jnum(n))));
      }
    }
    err(grp, "Can't grp a = $1 into grps of n = $2", a, n);
  }
  
  /*function grplis(a, n){
    if (nilp(a))return nil();
    return cons(fstn(n, a), grplis(ncdr(n, a), n));
  }*/
  
  function grplis(a, n){
    var r = nil();
    while (!nilp(a)){
      psh(fstn(n, a), r);
      a = ncdr(n, a);
    }
    return nrev(r);
  }
  
  function grpstr(a, n){
    if (emp(a))return nil();
    return cons(fstn(n, a), grpstr(rstn(n, a), n));
  }
  
  /*function par(a, b){
    if (nilp(a))return [];
    if (atmp(a))return lis(lis(a, b));
    return app(par(car(a), car(b)), par(cdr(a), cdr(b)));
  }
  
  function tup(){
    return (function tup(a){
      if (all([], a))return [];
      return cons(map(car, a), tup(map(cdr, a)));
    })(tlis(r(arguments)));
  }*/
  
  //// Join ////
  
  function joi(a, x){
    if (udfp(x))x = st("");
    switch (typ(a)){
      case "nil":
      case "lis":
      case "arr": return fold(jn(function (r, i){
        if (is(r, st("")))return str1(i);
        return app(r, x, str1(i));
      }), st(""), a);
    }
    err(joi, "Can't join a = $1 with x = $2", a, x);
  }
  
  function fla(a, x){
    if (udfp(x)){
      switch (typ(a)){
        case "lis": return fold(jn(app2), nil(), a);
        case "arr": return fold(jn(app2), ar([]), a);
        case "nil": return nil();
      }
      err(fla, "Can't flat a = $1", a);
    }
    switch (typ(a)){
      case "lis": return fold(jn(function (r, a){
        if (emp(r))return app(r, a);
        return app(r, x, a);
      }), nil(), a);
      case "arr": return fold(jn(function (r, a){
        if (emp(r))return app(r, a);
        return app(r, x, a);
      }), ar([]), a);
      case "nil": return nil();
    }
    err(fla, "Can't flat a = $1 with x = $2", a, x);
  }
  
  function app(){
    var a = arguments;
    if ($.len(a) == 0)return nil();
    return $.fold(app2, a);
  }
  
  function app2(a, b){
    switch (typ(a)){
      case "nil":
      case "lis": 
        if (typin(b, "arr", "lis"))return (function app(a, b){
          if (nilp(a))return b;
          if (nilp(b))return a;
          if (atmp(a))err(app, "a = $1 must be a list", a);
          return cons(car(a), app(cdr(a), b));
        })(a, tlis(b));
        if (nilp(b))return a;
        return tail(a, b);
      case "sym": return sy($.app(dat(a), dat(sym(b))));
      case "str": return st($.app(dat(a), dat(str1(b))));
      //case "num": return nu($.app(dat(a), dat(num(b))));
      case "obj": return ob($.app(dat(a), dat(tobj(b))));
      case "arr": 
        if (typin(b, "arr", "lis"))return ar($.app(jarr(a), jarr(b)));
        if (nilp(b))return a;
        return tail(a, b);
    }
    err(app2, "Can't app a = $1 to b = $2", a, b);
  }
  
  function afta(a, x){
    if (nilp(a))return nil();
    return lisd(car(a), x, afta(cdr(a), x));
  }
  
  /*function afta(a, x){
    var r = nil();
    while (!nilp(a)){
      psh(car(a), r);
      psh(x, r);
      a = cdr(a);
    }
    return nrev(r);
  }*/
  
  //// ??? ////
  
  /*function evry(a, n, m){
    if (udfp(m))m = "0";
    if (listp(a))return (function evry(a, n, m){
      if (nilp(a))return [];
      if (is(m, "0"))return cons(car(a), evry(cdr(a), n, sub(n, "1")));
      return evry(cdr(a), n, sub(m, "1"));
    })(a, n, m);
    if (synp(a))return $.evry(a, $.num(n), $.num(m));
    if (strp(a))return s(evry(rp(a), n, m));
    if (arrp(a))return r($.evry(rp(a), $.num(n), $.num(m)));
    err(evry, "Can't get every n = $1 of a = $2 starting at m = $3", n, a, m);
  }*/
  
  //// Reduce ////
  
  // notice! fold functions take lisp fns!
  
  function fold(f, x, a){
    if (arguments.length >= 3){
      var t = typ(a);
      switch (t){
        case "nil": return nil();
        case "lis": return foldlis(tjn(f), x, a);
        case "arr": 
        case "obj": return $.fold(tjn(f), x, dat(a));
      }
      err(fold, "Can't fold a = $1 with f = $2 and x = $3", a, f, x);
    }
    a = x;
    var t = typ(a);
    switch (t){
      case "nil": return nil();
      case "lis": return fold(f, car(a), cdr(a));
      case "arr":
      case "obj": return $.fold(tjn(f), dat(a));
    }
    err(fold, "Can't fold a = $1 with f = $2", a, f);
  }
  
  function foldlis(f, x, a){
    while (lisp(a)){
      x = f(x, car(a));
      a = cdr(a);
    }
    return x;
  }
  
  /*function foldlis2(f, x, a){
    if (nilp(a))return x;
    return foldlis2(f, f(x, car(a)), cdr(a));
  }*/
  
  function foldi(f, x, a){
    if (arguments.length >= 3){
      var t = typ(a);
      switch (t){
        case "nil": return nil();
        case "lis": return (function fold(f, x, a, i){
          if (nilp(a))return x;
          return fold(f, f(x, car(a), i), cdr(a), add1(i));
        })(tjn(f), x, a, nu("0"));
        case "arr":
          var g = tjn(f);
          return $.foldi(function (l, a, i){
            return g(l, a, lnum(i));
          }, x, dat(a));
        case "obj": return $.foldi(tjn(f), x, dat(a));
      }
      err(foldi, "Can't foldi a = $1 with f = $2 and x = $3", a, f, x);
    }
    a = x;
    var t = typ(a);
    switch (t){
      case "nil": return nil();
      case "lis": return (function fold(f, x, a, i){
        if (nilp(a))return x;
        return fold(f, f(x, car(a), i), cdr(a), add1(i));
      })(tjn(f), car(a), cdr(a), nu("1"));
      case "arr":
        var g = tjn(f);
        return $.foldi(function (l, a, i){
          return g(l, a, lnum(i));
        }, dat(a));
      case "obj": return $.foldi(tjn(f), dat(a));
    }
    err(foldi, "Can't foldi a = $1 with f = $2", a, f);
  }
  
  function foldr(f, x, a){
    if (arguments.length >= 3){
      var t = typ(a);
      switch (t){
        case "nil": return nil();
        case "lis": return (function fold(f, x, a){
          if (nilp(a))return x;
          return fold(f, f(car(a), x), cdr(a));
        })(tjn(f), x, rev(a));
        case "arr": 
        case "obj": return $.foldr(tjn(f), x, dat(a));
      }
      err(foldr, "Can't foldr a = $1 with f = $2 and x = $3", a, f, x);
    }
    a = x;
    var t = typ(a);
    switch (t){
      case "nil": return nil();
      case "lis":
        var b = rev(a);
        return (function fold(f, x, a){
          if (nilp(a))return x;
          return fold(f, f(car(a), x), cdr(a));
        })(tjn(f), car(b), cdr(b));
      case "arr":
      case "obj": return $.foldr(tjn(f), dat(a));
    }
    err(foldr, "Can't foldr a = $1 with f = $2", a, f);
  }
  
  function foldri(f, x, a){
    if (arguments.length >= 3){
      var t = typ(a);
      switch (t){
        case "nil": return nil();
        case "lis": return (function fold(f, x, a, i){
          if (nilp(a))return x;
          return fold(f, f(car(a), x, i), cdr(a), sub1(i));
        })(tjn(f), x, rev(a), sub1(len(a)));
        case "arr":
          var g = tjn(f);
          return $.foldri(function (a, l, i){
            return g(a, l, lnum(i));
          }, x, dat(a));
        case "obj": return $.foldri(tjn(f), x, dat(a));
      }
      err(foldri, "Can't foldri a = $1 with f = $2 and x = $3", a, f, x);
    }
    a = x;
    var t = typ(a);
    switch (t){
      case "nil": return nil();
      case "lis":
        var b = rev(a);
        return (function fold(f, x, a, i){
          if (nilp(a))return x;
          return fold(f, f(car(a), x, i), cdr(a), sub1(i));
        })(tjn(f), car(b), cdr(b), sub(len(a), nu("2")));
      case "arr":
        var g = tjn(f);
        return $.foldri(function (a, l, i){
          return g(a, l, lnum(i));
        }, dat(a));
      case "obj": return $.foldri(tjn(f), dat(a));
    }
    err(foldri, "Can't foldri a = $1 with f = $2", a, f);
  }
  
  //// Array ////
  
  function head(a, x){
    switch (typ(a)){
      case "nil": 
      case "lis": return cons(x, a);
      case "arr": return ush(x, cpy(a));
    }
    err(head, "Can't head a = $1 with x = $2", a, x);
  }
  
  function tail(a, x){
    switch (typ(a)){
      case "nil": return lis(x);
      case "lis": return (function tail(a, x){
        if (nilp(a))return lis(x);
        return cons(car(a), tail(cdr(a), x));
      })(a, x);
      case "arr": return psh(x, cpy(a));
    }
    err(tail, "Can't tail a = $1 with x = $2", a, x);
  }
  
  //// Other ////
  
  function beg(a){
    var x = $.sli(arguments, 1);
    switch (typ(a)){
      case "sym":
      //case "num":
      case "str": return is(pos(ar(x), a), nu("0"));
      case "lis":
      case "arr": return has(fst(a), ar(x));
      case "nil": return false;
    }
    err(beg, "Can't find if a = $1 begs with x = $2", a, ar(x));
  }
  
  /*function end(a){
    var x = $.sli(arguments, 1);
    if (synp(a) || strp(a)){
      var c;
      for (var i = 0; i < $.len(x); i++){
        c = pol(x[i], a);
        if (c != -1 && c == len(a)-len(x[i]))return true;
      }
      return false;
    }
    if (listp(a) || arrp(a))return $.has(las(a), x);
    err(end, "Can't find if a = $1 ends with x = $2", a, x);
  }
  
  function bnd(a, x, y){
    return beg(a, x) && end(a, y);
  }*/
  
  ////// Imperative //////
  
  //// Each ////
  
  function each(a, f){
    switch (typ(a)){
      case "nil": return nil();
      case "lis": return eachlis(a, tjn(f));
      case "arr":
      case "obj":
        $.each(dat(a), tjn(f));
        return nil();
    }
    err(each, "Can't loop through each in a = $1 with f = $2", a, f);
  }
  
  /*function eachlis(a, f){
    if (nilp(a))return nil();
    f(car(a));
    return eachlis(cdr(a), f);
  }*/
  
  function eachlis(a, f){
    while (!nilp(a)){
      f(car(a));
      a = cdr(a);
    }
    return nil();
  }
  
  /*function oeach(a, f){
    var x = jn(f);
    for (var i in a)x(i, a[i]);
    return [];
  }*/
  
  //// Array ////
  
  function psh(x, a){
    switch (typ(a)){
      case "nil":
        tag(a, "type", "lis");
        tag(a, "car", x);
        tag(a, "cdr", nil());
        return a;
      case "lis":
        scdr(a, cons(car(a), cdr(a)));
        scar(a, x);
        return a;
      case "arr":
        $.push(x, dat(a));
        return a;
    }
    err(psh, "Can't psh x = $1 onto a = $2", x, a);
  }
  
  function pop(a){
    switch (typ(a)){
      case "nil": return nil();
      case "lis":
        var x = car(a);
        if (nilp(cdr(a))){
          tag(a, "type", "nil");
          det(a, "car");
          det(a, "cdr");
        } else {
          scar(a, cadr(a));
          scdr(a, cddr(a));
        }
        return x;
      case "arr": return chku($.pop(dat(a)));
    }
    err(pop, "Can't pop from a = $1", a);
  }
  
  function ush(x, a){
    switch (typ(a)){
      case "nil": return psh(x, a);
      case "lis":
        do {
          a = cdr(a);
        } while (lisp(a));
        psh(x, a);
        return a;
      case "arr":
        $.ushf(x, dat(a));
        return a;
    }
    err(ush, "Can't ush x = $1 onto a = $2", x, a);
  }
  
  function shf(a){
    switch (typ(a)){
      case "nil": return nil();
      case "lis":
        do {
          a = cdr(a);
        } while (lisp(a));
        return pop(a);
      case "arr": return chku($.shf(dat(a)));
    }
    err(shf, "Can't shf from a = $1", a);
  }
  
  ////// List //////
  
  //// cxr ////
  
  // if called cxr(x):
  //   input: x = a js str that only has "a" and "d" (ex "ada")
  //   output: creates a function that calls car and cdr in the order of x
  //             (ex. cxr("ada") === cadar )
  // if called cxr(x, a):
  //   the same as cxr(x)(a)
  //   input: x = a js str that only has "a" and "d" (ex "ada")
  //   output: calls car and cdr in the order of x on a
  //             (ex. exr("ada", a) === cadar(a) )
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
  
  function nth(n, a){
    if (!nump(n))err(nth, "Can't get item n = $1 from a = $2", n, a);
    if (nilp(a) || lt(n, nu("0")))return nil();
    if (is(n, nu("0")))return car(a);
    return nth(sub1(n), cdr(a));
  }
  
  function ncdr(n, a){
    if (!nump(n))err(nth, "Can't get ncdr n = $1 of a = $2", n, a);
    if (nilp(a))return nil();
    if (le(n, nu("0")))return a;
    return ncdr(sub1(n), cdr(a));
  }
  
  function nrev(a, l){
    if (udfp(l))l = nil();
    var n; // n = next
    // orig: !nilp(a)
    while (lisp(a)){
      n = cdr(a);
      scdr(a, l);
      l = a;
      a = n;
    }
    return l;
  }
  
  /*function napp(a, b, o){
    if (udfp(o))o = a;
    if (nilp(a))return o;
    // orig: !nilp(a[1])
    while (lisp(a[1]))a = a[1];
    a[1] = b;
    return o;
  }*/
  
  /*function app2(a, b){
    if (nilp(a))return b;
    if (nilp(b))return a;
    return cons(car(a), app2(cdr(a), b));
  }*/
  
  ////// String //////
  
  function low(a){
    var t = typ(a);
    switch (t){
      case "sym":
      case "str": return mkdat(t, $.low(dat(a)));
    }
    err(low, "Can't lowercase a = $1", a);
  }
  
  function upp(a){
    var t = typ(a);
    switch (t){
      case "sym":
      case "str": return mkdat(t, $.upp(dat(a)));
    }
    err(upp, "Can't uppercase a = $1", a);
  }
  
  function stf(a){
    if (arguments.length == 0)return st("");
    switch (typ(a)){
      case "str":
      case "sym": return foldi(jn(function (s, x, i){
        return rpl(app(st("$"), add1(i)), dsp(x), s);
      }), str1(a), ar($.sli(arguments, 1)));
    }
    return dsp(a);
  }
  
  ////// Number //////
  
  function odd(a){
    return R.oddp(dat(a));
  }
  
  function evn(a){
    return R.evnp(dat(a));
  }
  
  function foldnum(f, a){
    var s = dat(a[0]);
    for (var i = 1; i < a.length; i++){
      s = f(s, dat(a[i]));
    }
    return nu(s);
  }
  
  function add(){
    //calls.add.push(arguments.callee.caller);
    var a = arguments;
    if (a.length == 0)return nu("0");
    return foldnum(R.add, a);
  }
  
  function add1(a){
    return add(a, nu("1"));
  }
  
  function sub(){
    var a = arguments;
    if (a.length == 0)return nu("0");
    if (a.length == 1)return nu(R.neg(dat(a[0])));
    return foldnum(R.sub, a);
  }
  
  function sub1(a){
    return sub(a, nu("1"));
  }
  
  function mul(){
    var a = arguments;
    if (a.length == 0)return nu("1");
    return foldnum(R.mul, a);
  }
  
  function div(){
    var a = arguments;
    if (a.length == 0)return nu("1");
    if (a.length == 1)return nu(R.div(R.one(), dat(a[0])));
    return foldnum(R.div, a);
  }
  
  function lt(){
    var a = arguments;
    for (var i = 1; i < a.length; i++){
      if (!R.lt(dat(a[i-1]), dat(a[i])))return false;
    }
    return true;
  }
  
  function gt(){
    var a = arguments;
    for (var i = 1; i < a.length; i++){
      if (!R.gt(dat(a[i-1]), dat(a[i])))return false;
    }
    return true;
  }
  
  function le(){
    var a = arguments;
    for (var i = 1; i < a.length; i++){
      if (!R.le(dat(a[i-1]), dat(a[i])))return false;
    }
    return true;
  }
  
  function ge(){
    var a = arguments;
    for (var i = 1; i < a.length; i++){
      if (!R.ge(dat(a[i-1]), dat(a[i])))return false;
    }
    return true;
  }
  
  function rnd(a, p){
    return nu(R.rnd(dat(a), jnum(p)));
  }
  
  ////// Object //////
  
  // for all these functions:
  // input: a = a js obj, x = a lisp obj, y = a lisp obj
  // output: a js bool
  
  function ohas(a, x){
    return $.ohas(a, prop(x));
  }
  
  function oput(a, x, y){
    return $.oput(a, prop(x), y);
  }
  
  function orem(a, x){
    return $.orem(a, prop(x));
  }
  
  function oref(a, x){
    return $.oref(a, prop(x));
  }
  
  function oset(a, x, y){
    return $.oset(a, prop(x), y);
  }
  
  function osetp(a, x){
    return $.osetp(a, prop(x));
  }
  
  function odel(a, x){
    return $.odel(a, prop(x));
  }
  
  function oren(a, x, y){
    return $.oren(a, prop(x), prop(y));
  }
  
  function owith(o, x, y){
    var o2 = cpy(o);
    oput(o2, x, y);
    return o2;
  }
  
  ////// Time //////
  
  function currtim(){
    return lnum($.currtim());
  }
  
  ////// Checkers //////
  
  // input: a lisp obj that might be udf
  // output: a lisp obj with udf replaced with nil
  function chku(a){
    return (a === udf)?nil():a;
  }
  
  // input: a js bool
  // output: a lisp bool
  function chkb(a){
    if (a === false)return nil();
    if (a === true)return sy("t");
    return a;
  }
  
  // input: js fn that returns js bools
  // output: js fn that returns lisp bools
  function chrb(f){
    return $.cmb(chkb, f);
  }
  
  // input: a lisp bool
  // output: a js bool
  function bchk(a){
    return !nilp(a);
  }
  
  // input: js fn that returns lisp bools
  // output: js fn that returns js bools
  function bchr(f){
    return $.cmb(bchk, f);
  }
  
  ////// Error //////
  
  // special handler that uses dsp(a)
  // input: f = a js fn, a = a js str, rest = lisp objs
  function err(f, a){
    var r = $.sli(arguments, 1);
    r[0] = st(r[0]);
    $.err(f, dat($.apl(stf, r)));
  }
  
  ////// Other //////
  
  function dol(){
    return chku($.las(arguments));
  }
  
  function do1(){
    return chku(arguments[0]);
  }
  
  gs.n = 0;
  function gs(){
    return sy("gs" + gs.n++);
  }
  
  // output: a js int
  function gsn(){
    return gs.n;
  }
  
  ////// Object exposure //////
  
  var L = {
    typ: typ,
    tag: tag,
    rep: rep,
    det: det,
    dat: dat,
    sdat: sdat,
    
    mk: mk,
    mkdat: mkdat,
    mkbui: mkbui,
    sy: sy,
    nu: nu,
    st: st,
    ar: ar,
    ob: ob,
    rx: rx,
    jn: jn,
    ma: ma,
    sm: sm,
    
    car: car,
    cdr: cdr,
    gcar: gcar,
    gcdr: gcdr,
    cons: cons,
    nil: nil,
    scar: scar,
    scdr: scdr,
    lis: lis,
    lisd: lisd,
    arr: arr,
    
    caar: caar,
    cadr: cadr,
    cdar: cdar,
    cddr: cddr,
    
    udfp: udfp,
    tagp: tagp,
    isa: isa,
    isany: isany,
    typin: typin,
    
    mkpre: mkpre,
    symp: symp,
    nump: nump,
    strp: strp,
    lisp: lisp,
    arrp: arrp,
    objp: objp,
    rgxp: rgxp,
    jnp: jnp,
    macp: macp,
    smacp: smacp,
    
    nilp: nilp,
    listp: listp,
    atmp: atmp,
    synp: synp,
    fnp: fnp,
    specp: specp,
    procp: procp,
    
    is: is,
    isn: isn,
    iso: iso,
    inp: inp,
    
    sta: sta,
    
    dsp: dsp,
    dsj: dsj,
    
    ofn: ofn,
    gofn: gofn,
    ou: ou,
    out: out,
    pr: pr,
    prn: prn,
    al: al,
    logobj: logobj,
    log: log,
    
    sym: sym,
    str: str,
    str1: str1,
    num: num,
    tfn: tfn,
    tarr: tarr,
    tlis: tlis,
    tobj: tobj,
    prop: prop,
    jstr: jstr,
    jarr: jarr,
    jnum: jnum,
    lnum: lnum,
    jmat: jmat,
    lbn: lbn,
    tjn: tjn,
    jbn: jbn,
    
    ref: ref,
    ref1: ref1,
    set: set,
    fst: fst,
    las: las,
    
    apl: apl,
    sapl: sapl,
    cal: cal,
    map: map,
    mapn: mapn,
    pos: pos,
    has: has,
    rem: rem,
    rpl: rpl,
    
    len: len,
    emp: emp,
    cpy: cpy,
    rev: rev,
    revlis: revlis,
    
    sli: sli,
    fstn: fstn,
    rstn: rstn,
    rst: rst,
    mid: mid,
    
    spl: spl,
    grp: grp,
    
    joi: joi,
    fla: fla,
    app: app,
    app2: app2,
    afta: afta,
    
    fold: fold,
    foldi: foldi,
    foldr: foldr,
    foldri: foldri,
    
    head: head,
    tail: tail,
    
    beg: beg,
    
    each: each,
    
    psh: psh,
    pop: pop,
    ush: ush,
    shf: shf,
    
    cxr: cxr,
    
    nth: nth,
    ncdr: ncdr,
    nrev: nrev,
    
    odd: odd,
    evn: evn,
    
    add: add,
    add1: add1,
    sub: sub,
    sub1: sub1,
    mul: mul,
    div: div,
    
    lt: lt,
    gt: gt,
    le: le,
    ge: ge,
    
    rnd: rnd,
    
    low: low,
    upp: upp,
    stf: stf,
    
    ohas: ohas,
    oput: oput,
    orem: orem,
    oref: oref,
    oset: oset,
    osetp: osetp,
    odel: odel,
    oren: oren,
    owith: owith,
    
    currtim: currtim,
    
    chku: chku,
    chkb: chkb,
    chrb: chrb,
    bchk: bchk,
    bchr: bchr,
    
    err: err,
    
    dol: dol,
    do1: do1,
    gs: gs,
    gsn: gsn
  };
  
  
  
  /*var L = {
    
    
    
    
    dmap: dmap,
    all: all,
    keep: keep,
    remb: remb,
    reme: reme,
    mat: mat,
    mats: mats,
    
    cln: cln,
    
    par: par,
    tup: tup,
    
    
    evry: evry,
    
    end: end,
    bnd: bnd,
    
    oeach: oeach,
    
    napp: napp,
    
    
    
  };*/
  
  if (nodep)module.exports = L;
  else window.L = L;
  
  ////// Speed tests //////
  
  var o = lis(1, 2, 3, 4, 5);
  var f = jn(function (a){return a > 3;});
  
  function a(){
    return pos(f, o);
  }
  
  function b(){
    
  }
  
  //$.al("");
  //$.spd(a, b, 100000);
  
  ////// Testing //////
  
  
  
})();
