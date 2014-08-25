/***** Lisp to JS Compiler Devel *****/

/* require tools >= 3.1 */
/* require lisp-tools */
/* require lisp-parse */ // cmps uses this
/* require lisp-exec */

(function (win, udf){
  ////// Import //////
  
  var rp = L.rp;
  
  var nilp = L.nilp;
  var lisp = L.lisp;
  var atmp = L.atmp;
  var nump = L.nump;
  var symp = L.symp;
  var objp = L.objp;
  var rgxp = L.rgxp;
  var udfp = L.udfp;
  var strp = L.strp;
  var arrp = L.arrp;
  
  var iso = L.iso;
  var inp = L.inp;
  
  var dsj = L.dsj;
  
  var dyn = L.dyn;
  
  var al = L.al;
  
  var las = L.las;
  
  var map = L.map;
  var rem = L.rem;
  var reme = L.reme;
  var rpl = L.rpl;
  
  var len = L.len;
  
  var sli = L.sli;
  
  var joi = L.joi;
  var app = L.app;
  
  var beg = L.beg;
  
  var car = L.car;
  var cdr = L.cdr;
  var cons = L.cons;
  
  var caar = L.caar;
  var cadr = L.cadr;
  var cdar = L.cdar;
  var cddr = L.cddr;
  
  var lis = L.lis;
  var lisd = L.lisd;
  var nth = L.nth;
  var ncdr = L.ncdr;
  var nrev = L.nrev;
  
  var prs = L.prs;
  var evl = L.evl;
  var apl = L.apl;
  
  var jn = L.jn;
  var bol = L.bol;
  
  var do1 = L.do1;
  var err = L.err;
  
  var nulp = $.nulp;
  var oref = $.oref;
  var oput = $.oput;
  var oset = $.oset;
  var osetp = $.osetp;
  var odel = $.odel;
  var oren = $.oren;
  
  ////// Macroexpand //////
  
  function mcx(a){
    if (atmp(a)){
      if (symp(a) && smsetp(a))return mcx(xsmac(a));
      return a;
    }
    return mcxl(car(a), cdr(a));
  }
  
  function mcxl(o, a){
    if (atmp(o)){
      if (symp(o)){
        if (smsetp(o))return mcx(cons(xsmac(o), a));
        if (msetp(o))return mcx(xmac(o, a));
        if (ssetp(o))return xspc(o, a);
        return cons(o, map(mcx, a));
      }
      return cons(o, map(mcx, a));
    }
    return mcxll(car(o), cdr(o), a);
  }
  
  function mcxll(o, a, b){
    if (atmp(o)){
      if (symp(o)){
        if (smsetp(o))return mcx(cons(cons(xsmac(o), a), b));
        if (msetp(o))return mcx(cons(xmac(o, a), b));
        if (ssetp(o))return cons(xspc(o, a), b);
        if (mmsetp(o))return mcx(xmmac(o, a, b));
        return cons(cons(o, map(mcx, a)), b);
      }
      return cons(cons(o, map(mcx, a)), b);
    }
    return cons(cons(o, map(mcx, a)), b);
  }
  
  function xsmac(a){
    return smref(a);
  }
  
  function xmac(o, a){
    return apl(mref(o), a);
  }
  
  function xspc(o, a){
    return apl(sref(o), a);
  }
  
  function xmmac(o, a, b){
    return apl(mmref(o), lis(a, b));
  }
  
  var spec = {};
  
  function sref(a){return oref(spec, a);}
  function sput(a, x){return oput(spec, a, x);}
  function sset(a, x){return oset(spec, a, x);}
  function ssetp(a){return osetp(spec, a);}
  function sdel(a){return odel(spec, a);}
  function sren(a, b){return oren(spec, a, b);}
  function slay(){return spec = {0: spec};}
  function sulay(){return spec = spec[0];}
  
  var macs = {};
  
  function mref(a){return oref(macs, a);}
  function mput(a, x){return oput(macs, a, x);}
  function mset(a, x){return oset(macs, a, x);}
  function msetp(a){return osetp(macs, a);}
  function mdel(a){return odel(macs, a);}
  function mren(a, b){return oren(macs, a, b);}
  function mlay(){return macs = {0: macs};}
  function mulay(){return macs = macs[0];}
  
  var smacs = {};
  
  function smref(a){return oref(smacs, a);}
  function smput(a, x){return oput(smacs, a, x);}
  function smset(a, x){return oset(smacs, a, x);}
  function smsetp(a){return osetp(smacs, a);}
  function smdel(a){return odel(smacs, a);}
  function smren(a, b){return oren(smacs, a, b);}
  function smlay(){return smacs = {0: smacs};}
  function smulay(){return smacs = smacs[0];}
  
  var mmacs = {};
  
  function mmref(a){return oref(mmacs, a);}
  function mmput(a, x){return oput(mmacs, a, x);}
  function mmset(a, x){return oset(mmacs, a, x);}
  function mmsetp(a){return osetp(mmacs, a);}
  function mmdel(a){return odel(mmacs, a);}
  function mmren(a, b){return oren(mmacs, a, b);}
  function mmlay(){return mmacs = {0: mmacs};}
  function mmulay(){return mmacs = mmacs[0];}
  
  ////// Processing //////
  
  function jvarp(a){
    return $.strp(a) && $.has(/^[a-zA-Z$_][a-zA-Z0-9$_]*$/, a);
  }
  
  function varp(a){
    return $.strp(a) && $.has(/^[a-zA-Z$_][a-zA-Z0-9$_?-]*$/, a);
  }
  
  function jvar(a){
    if (jvarp(a))return a;
    if (varp(a)){
      var s = "";
      for (var i = 0; i < $.len(a); i++){
        if (a[i] == "-"){
          if (i+1 == $.len(a))break;
          s += $.upp(a[i+1]);
          i++;
        } else if (a[i] == "?"){
          s += "p";
        } else {
          s += a[i];
        }
      }
      return s;
    }
    err(jvar, "Can't coerce a = $1 to jvar", a);
  }
  
  function onep(a){
    return udfp(a.b) || !a.b;
  }
  
  function exip(a){
    return !udfp(a.r) && a.r;
  }
  
  function brkp(a){
    return exip(a) || !udfp(a.k) && a.k;
  }
  
  /*
  if the current type does not have precedence over the location it
  is going into, add brackets
  
  if the current type has lower precedence than the location it
  is going into, add brackets
  
  if the location the current object is going into has greater or equal
  precedence than the current type, add brackets
  */
  
  // precedence
  var precs = [
    ["bot", "forbeg"],
    "doln",
    "setab",
    "iflnyes",
    "inln",
    "set", "setend",
    ["iflntest", "iflnno"],
    "ifln",
    "or",
    "and",
    "is", "isend",
    "cpar", "cparend",
    "add",
    "sub", "subend",
    "mul",
    "div", "divend",
    "mod", "modend",
    ["unaitm", "addunaitm", "subunaitm"],
    ["una", "adduna", "subuna"],
    ["inc", "dec"],
    ["incitm", "decitm"],
    ["fn", "obj"],
    "refee",
    // fn less than refee cause this doesn't work in global: function (){}()
    "atm"
  ];
  
  function hasprec(a, b){
    if ($.beg(a, "inc", "addun") && $.beg(b, "inc", "addun"))return false;
    if ($.beg(a, "dec", "subun") && $.beg(b, "dec", "subun"))return false;
    return prec(a) >= prec(b);
  }
  
  function prec(a){
    var n = posm(a, precs);
    if (n == -1)err(prec, "Can't get prec of a = $1", a);
    return n;
  }
  
  function posm(x, a){
    for (var i = 0; i < a.length; i++){
      if ($.arrp(a[i])){
        for (var j = 0; j < a[i].length; j++){
          if (a[i][j] === x)return i;
        }
      } else {
        if (a[i] === x)return i;
      }
    }
    return -1;
  }
  
  function has(x, a){
    for (var i = 0; i < a.length; i++){
      if (a[i] === x)return true;
    }
    return false;
  }
  
  var blks = [
    "do", "dolas",
    "lop", "loplas",
    "fnc", "fnclas",
    "if",
    "swt", "swtlas",
    "cas",
    "try", "catch", "fin",
    "ret", "thr", "nrt"
  ];
  function isblk(a){
    if (nilp(a))return true;
    return has(a, blks);
  }
  
  var rets = ["fnclas", "ret"];
  var ends = ["dolas", "fnclas", "if", "swtlas", "cas", "try", "catch"];
  function isret(a){
    if (has(a, rets))return true;
    if (!has(a, ends))return false;
    return rtp;
  }
  
  function isthr(a){
    if (a === "thr")return true;
    if (!has(a, ends))return false;
    return thp;
  }
  
  function blkp(){
    return blk;
  }
  
  function retp(){
    return ret;
  }
  
  function thrp(){
    return thr;
  }
  
  // associative http://en.wikipedia.org/wiki/Associative_property
  var asc = ["doln", "or", "and", "add", "mul"];
  function ascp(a){
    return has(a, asc);
  }
  
  // left-associative
  var ltr = [
    "is",
    "cpar",
    "sub",
    "div", "mod"
  ];
  function ltrp(a){
    return has(a, ltr);
  }
  
  // right-associative
  var rtl = ["set"];
  function rtlp(a){
    return has(a, rtl);
  }
  
  function jjoi(a, x){
    return rp(joi(a, x));
  }
  
  function chkpar(a){
    if (nilp(a))return ";\n";
    if (onep(a))return a.t;
    return "{\n" + a.t + "}\n";
  }
  
  ////// Lisp compiler //////
  
  function cmp(a, ret){
    return tra(mcx(a), ret);
  }
  
  function cmp1(a){
    return tra1(mcx(a));
  }
  
  var rts, rt, blk, rtp, thp;
  function tra(a, ret){
    if (udfp(ret)){
      rts = [];
      rt = [];
      blk = true;
      rtp = false;
      thp = false;
      var c = tra1(a);
      if (nilp(c))return "";
      return c.t;
    }
    $.L.psh(ret, rts);
    var lrt = rt; rt = ret;
    var lblk = blk; blk = isblk(rt);
    var lrtp = rtp; rtp = isret(rt);
    var lthp = thp; thp = isthr(rt);
    var r = tra1(a);
    rtp = lrtp;
    blk = lblk;
    rt = lrt;
    thp = lthp;
    $.L.pop(rts);
    return r;
  }
  
  function tra1(a){
    if (atmp(a)){
      if (nilp(a))return chkrt("[]", "atm");
      if (nump(a))return chkrt(a, "atm");
      if (symp(a))return chkrt(jvar(a), "atm");
      if (strp(a))return chkrt($.dsp(rp(a)), "atm");
      if (rgxp(a))return chkrt($.str(a), "atm");
      return cmp1("nil");
    }
    var o = car(a);
    if (atmp(o)){
      if (symp(o))return tprc(o, cdr(a));
      return cmp1(cons("#", a));
    }
    return cmp1(cons("cal", a));
  }
  
  function tprc(o, a){
    if (beg(o, "js-")){
      switch (sli(o, 3)){
        case "+": return tubin(a, "+", "add");
        case "-": return tubin(a, "-", "sub");
        case "*": return tbin(a, "*", "mul");
        case "/": return tbin(a, "/", "div");
        case "%": return tbin(a, " % ", "mod");
        case "++": return tuna(a, "++", "inc");
        case "--": return tuna(a, "--", "dec");
        case "and": return tbin(a, " && ", "and");
        case "or": return tbin(a, " || ", "or");
        case "not": return tuna(a, "!", "una");
        case "del": return tuna(a, "delete ", "una");
        case "=": return tset(a, " = ", "set");
        case "+=": return tset(a, " += ", "set");
        case "-=": return tset(a, " -= ", "set");
        case "*=": return tset(a, " *= ", "set");
        case "/=": return tset(a, " /= ", "set");
        case "%=": return tset(a, " %= ", "set");
        case "<": return tbin(a, " < ", "cpar");
        case ">": return tbin(a, " > ", "cpar");
        case "<=": return tbin(a, " <= ", "cpar");
        case ">=": return tbin(a, " >= ", "cpar");
        case "inst": return tbin(a, " instanceof ", "cpar");
        case "is": return tbin(a, " === ", "is");
        case "isn": return tbin(a, " !== ", "is");
        case "doln": return tdoln(a, ", ", "doln");
        case "arr": return tarr(a);
        case "obj": return tobj(a);
        case ".": return tmths(a);
        case "#": return tref(a);
        case "cal": return tcal(a);
        case "var": return tvar(a);
        case "fn": return tfn(a);
        case "rfn": return trfn(a);
        case "def": return tdef(a);
        case "new": return tnew(a);
        case "if": return tif(a);
        case "do": return tdo(a);
        case "loop": return tlop(a);
        case "while": return twhi(a);
        case "forin": return tfoi(a);
        case "swit": return tswt(a);
        case "case": return tcas(a);
        case "brk": return tbrk(a);
        case "cont": return tcont(a);
        case "ret": return tret(a);
        case "thr": return tthr(a);
        case "nret": return tnrt(a);
        case "try": return ttry(a);
        case "qt": return tqt(a);
        default: err(tprc, "Unknown o = $1", o);
      }
    }
    return cmp1(lisd("cal", o, a));
  }
  
  //// Procedures ////
  
  function tubin(a, o, n){
    if (nilp(cdr(a)))return tuna(a, o, n+"una");
    return tbin(a, o, n);
  }
  
  function tuna(a, o, n){
    return chkrt(o + tra(car(a), n+"itm"), n);
  }
  
  function tbin(a, o, n){
    if (ascp(n))return tasc(a, o, n);
    if (ltrp(n))return tltr(a, o, n);
    if (rtlp(n))return trtl(a, o, n);
    err(tbin, "Unknown associativity of n = $1", n);
  }
  
  function tasc(a, o, n){
    return chkrt(tra(car(a), n) + o + tra(cadr(a), n), n);
  }
  
  function tltr(a, o, n){
    return chkrt(tra(car(a), n) + o + tra(cadr(a), n+"end"), n);
  }
  
  function trtl(a, o, n){
    return chkrt(tra(car(a), n+"end") + o + tra(cadr(a), n), n);
  }
  
  function tset(a, o, n){
    return chkrt(tra(car(a), n+"end") + o + tra(cadr(a), n), n);
  }
  
  function tdoln(a, o, n){
    var c = tra(car(a), n);
    if (redunp(c))return tra1(cadr(a));
    return chkrt(c + o + tra(cadr(a), n), n);
  }
  
  function carr(a){
    return chkrt("[" + jjoi(cpa(a, "inln"), ", ") + "]", "atm");
  }
  
  function cobj(a){
    return chkrt("{" + cobj2(a) + "}", "obj");
  }
  
  function cobj2(a){
    if (nilp(a))return "";
    return cprop(car(a)) + ": " + tra(cadr(a), "inln")
           + cobj3(cddr(a));
  }
  
  function cobj3(a){
    if (nilp(a))return "";
    return ", " + cprop(car(a)) + ": " + tra(cadr(a), "inln")
           + cobj3(cddr(a));
  }
  
  function cprop(a){
    if (symp(a)){
      if (!varp(a))return $.dsp(a);
      return jvar(a);
    }
    if (strp(a))return cprop(rp(a));
    err(cprop, "Invalid obj property name a = $1", a);
  }
  
  function clis(a){
    return chkrt(clis2(a), "atm");
  }
  
  function clis2(a){
    if (atmp(a))return tra(a, "inln");
    return "[" + tra(car(a), "inln") + ", " + clis2(cdr(a)) + "]";
  }
  
  function cmths(a){
    return chkrt(tra(car(a), "refee") + "." 
                 + jjoi(map(cprop, cdr(a)), "."), "atm");
  }
  
  function cref(a){
    return chkrt(tra(car(a), "refee")
                 + "[" + jjoi(cpa(cdr(a), "bot"), "][") + "]", "atm");
  }
  
  function cvar(a){
    if (rt == "forbeg")return cvar2(a);
    if (!blk)err(cvar, "var a = $1 must be in block", a);
    return {t: out(cvar2(a) + ";") + nlin()};
  }
  
  function cvar2(a){
    if (nilp(a))return tra1("nil");
    return "var " + tra(car(a), "setab") + " = "
           + tra(cadr(a), "set") + cvar3(cddr(a));
  }
  
  function cvar3(a){
    if (nilp(a))return "";
    return ", " + tra(car(a), "setab") + " = "
           + tra(cadr(a), "set") + cvar3(cddr(a));
  }
  
  function cfn(a){
    var s = "function " + mpar(car(a)) + "{";
    ind();
    var bd = mblk(cdr(a), "fnc");
    uind();
    if (nilp(bd))return chkrt(s + "}", "fn");
    return chkrt(s + "\n" + bd.t + "}", "fn");
  }
  
  function crfn(a){
    if (!lisp(cadr(a)))err(crfn, "cadr(a) = $1 must be a list", cadr(a));
    var s = "function " + jvar(car(a)) + mpar(cadr(a)) + "{";
    ind();
    var bd = mblk(cddr(a), "fnc");
    uind();
    if (nilp(bd))return chkrt(s + "}", "fn");
    return chkrt(s + "\n" + bd.t + "}", "fn");
  }
  
  function cdef(a){
    if (!blk)err(cdef, "def a = $1 must be in block", a);
    if (!lisp(cadr(a)))err(cdef, "cadr(a) = $1 must be a list", cadr(a));
    var s = out("function " + jvar(car(a)) + mpar(cadr(a)) + "{");
    ind();
    var bd = mblk(cddr(a), "fnc");
    uind();
    if (nilp(bd))return {t: s + out("}") + nlin(), b: true};
    return {t: s + nlin() + bd.t + out("}") + nlin(), b: true};
  }
  
  function cnew(a){
    return chkrt("new " + tra(car(a), "refee") + mpar(cdr(a)), "atm");
  }
  
  function cif(a){
    if (!blk)return cifln(a);
    return cifbl(a);
  }
  
  /*
  (ret (if a b c d e)) -> {t: "if (a)return b;\nif (c)return d;\nreturn e;\n", r: true, b: true}
  (ret (if a b c)) -> {t: "if (a)return b;\nreturn c;\n", r: true, b: true}
  (if a b c) -> {t: "if (a)b;\nelse c;\n", r: false, b: true}
  (if) -> {t: "", r: false, b: false
  */
  
  function cifbl(a){
    if (nilp(a))return tra([], "if");
    if (nilp(cdr(a)))return tra(car(a), "if");
    var ifpt = tra(car(a), "bot");
    var yes = tra(cadr(a), "if");
    var s = out("if (" + ifpt + ")");
    if (nilp(yes))return {t: s + out(";") + nlin() + celifbl(cddr(a)), b: true};
    if (onep(yes)){
      s += yes.t;
      if (brkp(yes)){
        var n = cifbl(cddr(a));
        if (nilp(n))return {t: s, b: true};
        return {t: s + n.t, r: n.r, b: true};
      }
      return {t: s + celifbl(cddr(a)), b: true};
    }
    s += out("{") + nlin() + yes.t + "}";
    if (brkp(yes)){
      s += "\n";
      var n = cifbl(cddr(a));
      if (nilp(n))return {t: s, b: true};
      return {t: s + n.t, r: n.r, b: true};
    }
    if (nilp(cddr(a)))return {t: s + "\n", b: true};
    return {t: s + " " + celifbl(cddr(a)), b: true};
  }
  
  function celifbl(a){
    if (nilp(a))return "";
    if (nilp(cdr(a)))return "else " + chkpar(tra(car(a), "if"));
    var ifpt = tra(car(a), "bot");
    var yes = tra(cadr(a), "if");
    var s = "else if (" + ifpt + ")";
    if (nilp(yes))return s + ";\n" + celifbl(cddr(a));
    if (onep(yes))return s + yes.t + celifbl(cddr(a));
    s += "{\n" + yes.t + "}";
    if (nilp(cddr(a)))return s + "\n";
    return s + " " + celifbl(cddr(a));
  }
  
  function cifln(a){
    if (nilp(cdr(a)))return tra1(car(a));
    return cifln2(a);
  }
  
  function cifln2(a){
    var ifpt = tra(car(a), "iflntest");
    var yes = tra(cadr(a), "iflnyes");
    var s = ifpt + "?" + yes + ":";
    return chkrt(s + celifln(cddr(a)), "ifln");
  }
  
  function celifln(a){
    if (nilp(cdr(a)))return tra(car(a), "iflnno");
    return cifln2(a);
  }
  
  function cdo(a){
    if (blk){
      var bd = mblk(a, "do");
      if (nilp(bd))return tra1(bd);
      return bd;
    }
    return cdoln(a, ", ", "doln");
  }
  
  function clop(a){
    var s = "for (";
    s += tra(car(a), "forbeg") + "; ";
    s += tra(cadr(a), "bot") + "; ";
    s += tra(nth("2", a), "bot") + ")";
    return {t: s + chkpar(mblk(ncdr("3", a), "lop")), b: true};
  }
  
  function cwhi(a){
    var s = "while (" + tra(car(a), "bot") + ")";
    return {t: s + chkpar(mblk(cdr(a), "lop")), b: true};
  }
  
  function cfoi(a){
    var s = "for (";
    s += tra(car(a), "forbeg");
    s += " in ";
    s += tra(cadr(a), "bot") + ")";
    return {t: s + chkpar(mblk(cddr(a), "lop")), b: true};
  }
  
  function cswt(a){
    var s = "switch (" + tra(car(a), "bot") + "){";
    var n = cswt2(cdr(a));
    return {t: s + "\n" + n[0] + "}\n", r: n[1], b: true};
  }
  
  function cswt2(a){
    if (nilp(a))return ["", false];
    var c = car(a);
    if (car(c) == "def"){
      var s = "default: ";
      var bd = mblk(cdr(c), "swt");
      if (nilp(bd))return ["", false];
      if (onep(bd))return [s + bd.t, exip(bd)];
      return [s + "\n" + bd.t, exip(bd)];
    }
    var s = "case " + tra(car(c), "bot") + ": ";
    var bd = mblk(cdr(c), "swt");
    var n = cswt2(cdr(a));
    if (nilp(bd))return [s + "\n" + n[0], n[1]];
    if (onep(bd)){
      s += bd.t;
      if (exip(bd))return [s + n[0], n[1]];
      return [s + n[0], false];
    }
    s += "\n" + bd.t;
    if (exip(bd))return [s + n[0], n[1]];
    return [s + n[0], false];
  }
  
  function ccas(a){
    var s = "switch (" + tra(car(a), "bot") + "){";
    var n = ccas2(cdr(a));
    return {t: s + "\n" + n[0] + "}\n", r: n[1], b: true};
  }
  
  function ccas2(a){
    if (nilp(a))return ccas2(lis([]));
    if (nilp(cdr(a))){
      var s = "default: ";
      var bd = tra(car(a), "cas");
      if (nilp(bd))return [s + "break;\n", false];
      if (onep(bd)){
        if (exip(bd))return [s + bd.t, true];
        if (brkp(bd))return [s + bd.t, false];
        return [s + $.but(bd.t) + " break;\n", false]; // cut off \n
      }
      s += "\n" + bd.t;
      if (exip(bd))return [s, true];
      return [s + "break;\n", false];
    }
    var s = "case " + tra(car(a), "bot") + ": ";
    var bd = tra(cadr(a), "cas");
    var n = ccas2(cddr(a));
    if (nilp(bd))return [s + "break;\n" + n[0], false];
    if (onep(bd)){
      if (exip(bd))return [s + bd.t + n[0], n[1]];
      if (brkp(bd))return [s + bd.t + n[0], false];
      return [s + $.but(bd.t) + " break;\n" + n[0], false];
    }
    s += "\n" + bd.t;
    if (exip(bd))return [s + n[0], n[1]];
    if (brkp(bd))return [s + n[0], false];
    return [s + "break;\n" + n[0], false];
  }
  
  function cbrk(a){
    if (!blk)err(cbrk, "brk a = $1 must be in block", a);
    return {t: "break;\n", k: true};
  }
  
  function ccont(a){
    if (!blk)err(ccont, "cont a = $1 must be in block", a);
    return {t: "continue;\n", k: true};
  }
  
  function cret(a){
    if (!blk)err(cret, "ret a = $1 must be in block", a);
    return tra(car(a), "ret");
  }
  
  function cthr(a){
    if (!blk)err(cthr, "thr a = $1 must be in block", a);
    return tra(car(a), "thr");
  }
  
  function cnrt(a){
    if (!blk)err(cnrt, "nrt a = $1 must be in block", a);
    return tra(car(a), "nrt");
  }
  
  function ctry(a){
    if (!blk)err(ctry, "try a = $1 must be in block", a);
    var t = tra(car(a), "try");
    var e = tra(cadr(a), "bot");
    var c = tra(nth("2", a), "catch");
    var s = "try {\n" + t.t + "}";
    s += " catch (" + e + ")";
    s += "{\n" + c.t + "}";
    if (!nilp(ncdr("3", a))){
      var f = tra(nth("3", a), "fin");
      s += " finally {\n" + f.t + "}";
    }
    s += "\n";
    return {t: s, r: t.r && c.r, b: true};
  }
  
  ////// Testing //////
  
  
  
})(window);
