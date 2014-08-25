/***** Lisp Macroexpander Devel *****/

/* require tools >= 3.1 */
/* require lisp-tools */
/* require lisp-parse */ // cmps uses this
/* require lisp-exec */

(function (win, udf){
  ////// Import //////
  
  var tg = L.tg;
  
  var atmp = L.atmp;
  var symp = L.symp;
  
  var apl = L.apl;
  var map = L.map;
  
  var car = L.car;
  var cdr = L.cdr;
  var cons = L.cons;
  
  var lisd = L.lisd;
  
  var prs = L.prs;
  var lisp = L.lisp;
  
  var cmb = $.cmb;
  
  var oref = $.oref;
  var oput = $.oput;
  var oset = $.oset;
  var osetp = $.osetp;
  var odel = $.odel;
  var oren = $.oren;
  
  ////// Processing //////
  
  function jn(ag, f){
    return tg("jn2", prs(ag), cmb(function (a){return [];}, f));
  }
  
  ////// Macroexpander //////
  
  /*
  (mac test a
    `(test2 ,@a))
    
  (mmac test2 a (x y)
    `(run ,@a ,x ,y))
  
  (mmac run a (x y)
    `(hey ,@a ,x ,y))
    
  (((test 1 2 3) "a" "b") 'a 'b)
  
  (((test2 1 2 3) "a" "b") 'a 'b)
  
  ((run 1 2 3 "a" "b") 'a 'b)
  
  (hey 1 2 3 "a" "b" 'a 'b)
  
  */
  
  function mkmcx(lisp){
    if (udfp(lisp))lisp = L.lisp();
    
    function mcx(a){
      if (atmp(a)){
        if (symp(a) && smsetp(a))return mcx(smref(a));
        return a;
      }
      var o = car(a);
      if (atmp(o)){
        if (symp(o)){
          if (smsetp(o))return mcx(cons(mcx(smref(o)), cdr(a)));
          if (msetp(o))return mcx(apl(mref(o), cdr(a)));
          if (ssetp(o))return apl(sref(o), cdr(a));
          return map(mcx, a);
        }
        return map(mcx, a);
      }
      var b = car(o); // caar(a)
      if (atmp(b)){
        if (symp(b)){
          if (smsetp(b))return mcx(cons(cons(mcx(smref(b)), cdr(o)), cdr(a)));
          if (msetp(b))return mcx(cons(mcx(apl(mref(b), cdr(o))), cdr(a)));
          if (mmsetp(b))return mcx(apl(apl(mmref(b), cdr(o)), cdr(a)));
          return map(mcx, a);
        }
        return map(mcx, a);
      }
      return map(mcx, a);
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
    
    sput("mac", jn("(nm . bd)", function (nm, bd){
                                  mput(nm, evl(cons("fn", bd)));
                                }));
    sput("dmac", mdel);
    sput("rmac", mren);
    sput("mblk", jn("a", function (a){
      mlay();
      var r = mcx(cons("do", a));
      mulay();
      return r;
    }));
    
    sput("mac", jn("(nm . bd)", function (nm, bd){
                                  mput(nm, evl(cons("fn", bd)));
                                }));
    sput("dmac", mdel);
    sput("rmac", mren);
    sput("mblk", jn("a", function (a){
      mlay();
      var r = mcx(cons("do", a));
      mulay();
      return r;
    }));
    
    return {
      mcx: mcx,
      
      sref: sref,
      sput: sput,
      sset: sset,
      ssetp: ssetp,
      sdel: sdel,
      sren: sren,
      slay: slay,
      sulay: sulay,
      
      mref: mref,
      mput: mput,
      mset: mset,
      msetp: msetp,
      mdel: mdel,
      mren: mren,
      mlay: mlay,
      mulay: mulay,
      
      smref: smref,
      smput: smput,
      smset: smset,
      smsetp: smsetp,
      smdel: smdel,
      smren: smren,
      smlay: smlay,
      smulay: smulay,
      
      mmref: mmref,
      mmput: mmput,
      mmset: mmset,
      mmsetp: mmsetp,
      mmdel: mmdel,
      mmren: mmren,
      mmlay: mmlay,
      mmulay: mmulay
    };
  }
  
  ////// Object exposure //////
  
  $.att({
    mkmcx: mkmcx
  }, L);
  
})(window);
