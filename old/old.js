function cmpif(a){
  var ret = retp(rets);
  if (inblock(rets)){
    var ifpt = cmp(car(a), "iftest");
    var yespt = cmpall(cdr(a), "if");
    var s = "if (" + ifpt + ")";
    if (oneptp(yespt)){
      if (ret)s += "return ";
      s += yespt + ";\n";
    } else s += "{\n" + yespt + "}\n";
    if (nopt != ""){
      if (ret){
        if (oneptp(nopt)){
          s += "return " + nopt + ";\n";
        } else s += nopt;
      } else {
        s += "else ";
        if (oneptp(nopt))s += nopt + ";\n";
        else s += "{\n" + nopt + "}\n";
      }
    }
    return s;
  }
  var ifpt = cmp(car(a), "iflntest");
  var yespt = cmp(cadr(a), "iflnans");
  var nopt = cmp(nth(2, a), "iflnans");
  if (nopt == "")nopt = "false";
  return brac(ifpt + "?" + yespt + ":" + nopt, rets, "ifln");
}

function prsarr(a, r, pos){
  if (udefp(r))r = [];
  if (udefp(pos))pos = 0;
  var o = next(a, pos);
  if (o[1] == "")return r;
  push(prs1(o[1]), r);
  return prsarr(a, r, o[0]+len(o[1]));
}

function prsobj(a, r, pos){
  if (udefp(r))r = {};
  if (udefp(pos))pos = 0;
  var o = next(a, pos);
  if (o[1] == "")return r;
  var o2 = next(a, o[0]+len(o[1]));
  if (o2[1] == "")r[o[1]] = "undefined";
  r[o[1]] = prs1(o2[1]);
  return prsobj(a, r, o2[0]+len(o2[1]));
}

if (beg(a, "/") && !isSpace(a[1])){
  for (var i = 1; i < len(a); i++){
    if (a[i] == "/" && a[i-1] != "\\"){
      for (i += 1; i < len(a); i++){
        if (!has(/^[a-z]$/, a[i]))return slc(a, 0, i);
      }
      return a;
    }
  }
  err(obj, "Forward slashes not matched in a = $1", a);
}

//if (isSBrac(a))return ["&arr", prsarr(slc(a, 2, len(a)-1))];
//if (isSBrac(a))return prs1("(assoc " + slc(a, 2, len(a)-1) + ")");
//if (isCurl(a))return prsobj(rembds(a));
//if (isNum(a))return Number(a);

function isRgx(a){
  if (!beg(a, "#\""))return false;
  for (var i = len(a)-1; i >= 0; i--){
    if (a[i] == "\"")return true;
    if (!has(/[a-z]/, a[i]))return false;
  }
  return false;
}

function listp(a){
  if (nilp(a))return true;
  return listp(a) && listp(cdr(a));
}

function pairp(a){
  return listp(a) && !listp(cdr(a));
}

function add2(a, b){
  if (nump(a))return R.add(a, nump(b)?b:tnum(b));
  if (strp(a) || objp(a) || arrp(a)){
    return taglike(a,
                   $.add(js(a),
                         js(isa(b, type(a))?b
                             :coerce(b, type(a)))));
  }
  err(add2, "Can't add a = $1 to b = $2", a, b);
}

function disparr(a){
  if (has(a, cdr(disps)))return "#[...]";
  return "#[" + $.reduc(function (a, b){
    if (udefp(a))return "";
    if (udefp(b))return a;
    return a + " " + b;
  }, $.map(disp, rep(a))) + "]";
}

function disparr(a){
  if (has(a, cdr(disps)))return "#[...]";
  var r = rep(a);
  var s = "#[";
  if ($.len(r) > 0){
    s += disp(r[0]);
    for (var i = 1; i < $.len(r); i++){
      s += " " + disp(r[i]);
    }
  }
  s += "]";
  return s;
}


function err(f, a){
  var args = arguments;
  for (var i = 2; i < args.length; i++){
    a = $.rpl("$" + (i-1), disp(args[i]), a);
  }
  throw "Error: " + $.head(f) + ": " + a;
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

// when unknown a, caused inf loop dispjs -> type -> err -> disp -> dispjs
function dispjs(a){
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
    case "fn": return "<fn " + dispjs(rep(a, "0")) + " "
                             + dispjs(rep(a, "1")) + ">";
    case "jfn": return $.disp(a);
  }
  if (tagp(a))return "<" + $.join($.map(dispjs, $.slc(a, 1)), " ") + ">";
  err(dispjs, "Cannot display a = $1 with type tp = $2", a, tp);
}

function lis2obj(a, o){
  if (udefp(o))o = {};
  if (nilp(a))return o;
  if (atomp(car(a)))err(lis2obj, "Can't coerce a = $1 to obj", a);
  o[prop(caar(a))] = cdar(a);
  return lis2obj(cdr(a), o);
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

function set(a, n){
  var x = arguments;
  if ($.len(x) < 2)err(set, "Can't set a = $1 without n", a);
  if ($.len(x) == 2)return set1(a, n);
  return set1($.apl(ref, $.blas(2, x)), $.nlas(1, x), $.las(x));
}

function jarr(a){
  if (lisp(a))return (function jarr(a, r){
    if (udfp(r))r = [];
    if (nilp(a))return r;
    $.psh(car(a), r);
    return jarr(cdr(a), r);
  })(a);
}

function par(a, b){
  if (nilp(a))return [];
  if (atmp(a))return lis(lis(a, b));
  return add(par(car(a), car(b)), par(cdr(a), cdr(b)));
}

function dsj2(a){
  if (objp(a)){
    if (has(a, cdr(dsps)))return "{...}";
    var r = [];
    for (var i in a){
      $.psh(dsj(i) + " " + dsj(a[i]), r);
    }
    return "{" + $.join(r, " ") + "}";
  }
}

function gtrp(a){
  return $.strp(a) || strp(a);
}

function lis2arr(a, r){
  if (udfp(r))r = [];
  if (nilp(a))return r;
  r.push(car(a));
  return lis2arr(cdr(a), r);
}

function lis2obj(a, o){
  if (udfp(o))o = {};
  if (nilp(a))return o;
  o[evlprop(caar(a))] = cdar(a);
  return lis2obj(cdr(a), o);
}

// from cmpiler
function onep(a){
  var b = 0;
  for (var i = 0; i < $.len(a); i++){
    switch (a[i]){
      case "{": b++; break;
      case "}": b--; break;
      case ";": if (b == 0)return i == $.len(a)-2; // there is \n after
    }
  }
  err(onep, "What? a = $1", a);
}


function cpa(a, ret){
  if (nilp(a))return [];
  if (atmp(a))err(cpa, "Can't cmp improper list a = $1", a);
  var c = cmp(car(a), ret);
  if (lisp(c))return app(c, cpa(cdr(a), ret));
  return cons(c, cpa(cdr(a), ret));
}

function cpalas(a, ret){
  if (nilp(a))return [];
  if (atmp(a))err(cpalas, "Can't cmp improper list a = $1", a);
  if (nilp(cdr(a))){
    var c = cmp(car(a), ret+"las");
    if (lisp(c))return c;
    return lis(c);
  }
  var c = cmp(car(a), ret);
  if (lisp(c))return app(c, cpalas(cdr(a), ret));
  return cons(c, cpalas(cdr(a), ret));
}

function cpaltr(a, ret){
  if (nilp(a))return [];
  if (atmp(a))err(cpaltr, "Can't cmp improper list a = $1", a);
  if (nilp(cdr(a))){
    var c = cmp(car(a), ret+"end");
    if (lisp(c))return c;
    return lis(c);
  }
  var c = cmp(car(a), ret);
  if (lisp(c))return app(c, cpaltr(cdr(a), ret));
  return cons(c, cpaltr(cdr(a), ret));
}

function cpartl(a, ret){
  if (nilp(a))return [];
  var c = cmp(car(a), ret+"end");
  if (lisp(c))return app(c, cpa(cdr(a), ret));
  return cons(c, cpa(cdr(a), ret));
}

function chkf(a){
  if (fnp(a) && !jnp(a))return function (){
    return $.apl(cal, $.hea(arguments, a));
  }
  return a;
}

function chrf(f){
  return $.cmps(chkf, f);
}

var brks = ["brk"];
function brkp(a){
  if ($.has(a, brks))return true;
  if (!$.has(a, ends))return false;
  return brp;
}

var brp = false;
function cmp(a, ret){
  var lbrp = brp; brp = brkp(rt);
  var r = cmp1(a);
  brp = lbrp;
  return r;
}

function cif(a){
  if (!blk)return cifln(a);
  if (nilp(cdr(a)))return cmp1(car(a));
  return lis(cifbl(a));
}

function cifbl(a){
  var ifpt = cmp(car(a), "bot");
  var yes = cmp(cadr(a), "if");
  var s = "if (" + ifpt + ")";
  if (onep(yes)){
    s += yes;
    if (nilp(cddr(a)))return s;
    if (exip(yes))return s + cifbl2(cddr(a));
    return s + celifbl(cddr(a));
  }
  s += "{\n" + jjoi(yes) + "}";
  if (nilp(cddr(a)))return s + "\n";
  if (exip(yes))return s + "\n" + cifbl2(cddr(a));
  return s + " " + celifbl(cddr(a));
}

function cifbl2(a){
  if (nilp(cdr(a))){
    var no = cmp(car(a), "if");
    if (onep(no))return no;
    return jjoi(no);
  }
  return cifbl(a);
}

function celifbl(a){
  if (nilp(cdr(a))){
    var no = cmp(car(a), "if");
    return "else " + chkpar(no);
  }
  return "else " + cifbl2(a);
}

/*
`(,(+ 2 3)) -> (5)
`,(+ 2 3) -> 5
``,(+ 2 3) -> `,(+ 2 3)
``,,(+ 2 3) -> `5
`(,@(lis 1 2 3)) -> (1 2 3)
```(,,@(lis 1 2 3)) -> ``(,,@(lis 1 2 3))
*/
/*
  a = a
  a = (qq a)
  a = (uq a)
  a = (uq (uq a))
  a = (a b c d e)
  a = (qgs a)
  a = (a b (uqs (1 2 3)) c)
  a = (a b (uq (uqs (1 2 3))) c)
  */
  

/*function eqq(a, env, lvl){
  if (udfp(lvl))lvl = 1;
  if (atmp(a))return a;
  
  if (car(a) == "qq")
    return lis("qq", eqq(cadr(a), env, lvl+1));*/
    
  
/*function euq2(a, env, lvl){
  if (lvl == 0)return {f: cons, evp: true, d: evl(a, env)};
  if (atmp(a))return {f: cons, evp: false, d: lis("uq", a)};
  if (car(a) == "uq"){
    var r = euq2(cadr(a), env, lvl-1);
    if (r.evp)return r;
    return {f: r.f, evp: r.evp, d: lis("uq", r.d)};
  }
  if (car(a) == "uqs"){
    
    var r = euq2(cadr(a), env, lvl-1);
    if (r.evp)return r;
    return {f: r.f, evp: r.evp, d: lis("uq", r.d)};
  return {evp: false, d: lis("uq", eqq(a, env, lvl))};
}*/

var qgs = {};
function eqq(a, env, lvl){
  if (udfp(lvl)){
    lvl = 1;
    qgs = {};
  }
  if (atmp(a))return a;
  switch (car(a)){
    case "uq":
      if (lvl == 1)return evl(cadr(a), env);
      return lis(car(a), eqq(cadr(a), env, lvl-1));
    case "qq":
      return lis(car(a), eqq(cadr(a), env, lvl+1));
    case "qgs":
      var t = cadr(a);
      if (!udfp(qgs[t]))return qgs[t];
      return qgs[t] = gs();
  }
  var r = eqq2(car(a), env, lvl);
  return r[0](r[1], eqq(cdr(a), env, lvl));
}

function eqq2(a, env, lvl){
  if (atmp(a))return cons(cons, a);
  switch (car(a)){
    case "uq":
      if (lvl == 1)return [cons, evl(cadr(a), env)];
      var ret = eqq2(cadr(a), env, lvl-1);
      if (car(ret) == cons)return [car(ret), lis("uq", cdr(ret))];
      return ret;
    case "uqs":
      if (lvl == 1)return [app, evl(cadr(a), env)];
  }
  return [cons, eqq(a, env, lvl)];
}


function drpl(x, y, a){
  var f = jn(x);
  if (f(a))return y;
  if (symp(a) || strp(a))return a;
  if (lisp(a))return cons(drpl(f, y, car(a)), drpl(f, y, cdr(a)));
  if (arrp(a) || objp(a))return map(function (i){
    return drpl(f, y, i);
  }, a);
  err(drpl, "Can't drpl x = $1 with y = $2 in a = $3", x, y, a);
}

function cvar(a){
  if (rt == "forbeg")return cvar2(a);
  if (!blk)err(cvar, "var a = $1 must be in block", a);
  return {t: cvar2(a) + ";\n"};
}

function cvar2(a){
  if (nilp(cdr(a)))return "var " + cmp(car(a), "setab");
  return "var " + cmp(car(a), "setab") + " = " + cmp(cadr(a), "set")
         + cvar3(cddr(a));
}

function cvar3(a){
  if (nilp(a))return "";
  if (nilp(cdr(a)))return ", " + cmp(car(a), "setab");
  return ", " + cmp(car(a), "setab") + " = " + cmp(cadr(a), "set")
         + cvar3(cddr(a));
}

function cdec(a){
  if (!blk)err(cdec, "dec a = $1 must be in block", a);
  return {t: cdec2(a) + ";\n"};
}

function cdec2(a){
  return "var " + cmp(car(a), "setab") + cdec3(cdr(a));
}

function cdec3(a){
  if (nilp(a))return "";
  if (nilp(cdr(a)))return ", " + cmp(car(a), "setab");
  return ", " + cmp(car(a), "setab") + cdec3(cdr(a));
}

/*
function cadd(a){
  return chkrt(cadd2(a), "add");
}

function cadd2(a){
  if (nilp(a))return "0";
  if (nilp(cdr(a)))return "+" + cmp(car(a), "additm");
  return cmp(car(a), "add") + cadd3(cdr(a));
}

function cadd3(a){
  if (nilp(a))return "";
  return "+" + cmp(car(a), "add") + cadd3(cdr(a));
}

function csub(a){
  return chkrt(csub2(a), "sub");
}

function csub2(a){
  if (nilp(a))return "0";
  if (nilp(cdr(a)))return "-" + cmp(car(a), "subitm");
  return cmp(car(a), "sub") + csub3(cdr(a));
}

function csub3(a){
  if (nilp(a))return "";
  return "-" + cmp(car(a), "subend") + csub3(cdr(a));
}

function cset(a){
  return chkrt(cset2(a), "set");
}

function cset2(a){
  if (nilp(a))return [];
  if (nilp(cdr(a)))return [];
  return cmp(car(a), "setab") + " = " + cset3(cdr(a));
}

function cset3(a){
  if (nilp(cdr(a)))return cmp(car(a), "set");
  return cmp(car(a), "setab") + " = " + cset3(cdr(a));
}

function cdo(a){
  return chkrt(cdo2(a), "doln");
}

function cdo2(a){
  if (nilp(a))return [];
  if (nilp(cdr(a)))return cmp1(car(a));
  return (function (c){
    if (redunp(c))return "";
    return c + ", ";
  })(cmp(car(a), "doln")) + cdo3(cdr(a));
}

function cdo3(a){
  if (nilp(a))return "";
  if (nilp(cdr(a)))return cmp(car(a), "doln");
  return (function (c){
    if (redunp(c))return "";
    return c + ", ";
  })(cmp(car(a), "doln")) + cdo3(cdr(a));
}


cbin(function (s, x){
  if (arguments.length == 0)return cmp1("0");
  if (s == "")return cmp(x, "sub");
  return s + "-" + cmp(x, "subend");
}, a);

cbin(function (s, x){
  if (arguments.length == 0)return cmp1([]);
  if (s == "")return cmp(x, "set");
  return cmp(x, "setend") + " = " + s;
}, a);



function cbin(f, a, n){
  return chkrt(rdc(f, "", a), n);
}

function mkbin(o, n, asc, emp){
  var fst = n, lst = n;
  switch (asc){
    case "ltr": lst += "end"; break;
    case "rtl": fst += "end"; break;
    case "asc": break;
    default: err(mkbin, "Unknown asc = $1", asc);
  }
  return function (s, x){
    if (arguments.length == 0)return cmp1(emp);
    if (s == "")return cmp(x, fst);
    return s + o + cmp(x, lst);
  }
}

*/

/*function cbin(a, o, n){
  if (nilp(a))err(cbin, "Can't cmp binary o = $1, n = $2 with no args", o, n);
  if (nilp(cdr(a)))return cmp(car(a), rt);
  var f;
  if (ascp(n))f = cpa;
  else if (ltrp(n))f = cpaltr;
  else if (rtlp(n))f = cpartl;
  else err(cbin, "What? a = $1 | o = $2 | n = $3", a, o, n);
  return chkrt(jjoi(f(a, n), o), n);
}*/

function mblk(a, ret, l){
  if (udfp(l))l = [];
  if (nilp(a))return [];
  if (atmp(a))err(mblk, "Can't cmp improper list a = $1", a);
  if (nilp(cdr(a))){
    var c = cmp(car(a), ret+"las");
    if (nilp(l))return c;
    return {t: jjoi(ts(nrev(cons(c, l)))), r: c.r, k: c.k, b: true};
  }
  var c = cmp(car(a), ret);
  if (c.t == "[];\n")return mblk(cdr(a), ret, l);
  return mblk(cdr(a), ret, cons(c, l));
}

function ts(a){
  return map(function (x){
    return x.t;
  }, a);
}

function cpaltr(a, ret){
  if (nilp(a))return [];
  if (atmp(a))err(cpaltr, "Can't cmp improper list a = $1", a);
  if (nilp(cdr(a)))return lis(cmp(car(a), ret+"end"));
  return cons(cmp(car(a), ret), cpaltr(cdr(a), ret));
}

function cpartl(a, ret){
  if (nilp(a))return [];
  return cons(cmp(car(a), ret+"end"), cpa(cdr(a), ret));
}

// can't use fold because it's backwards
function lis(){
  var a = arguments;
  var r = [];
  for (var i = $.len(a)-1; i >= 0; i--){
    r = cons(a[i], r);
  }
  return r;
}

function lisd(){
  var a = arguments;
  if ($.len(a) == 0)return [];
  var r = a[$.len(a)-1];
  for (var i = $.len(a)-2; i >= 0; i--){
    r = cons(a[i], r);
  }
  return r;
}


