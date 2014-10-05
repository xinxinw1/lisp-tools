/***** Test Suite Devel *****/

/* require tools >= 3.0 */
/* require ajax */

(function (udf){
  var win = window;
  
  var $ = win.$;
  win.$ = udf;
  
  var udfp = $.udfp;
  
  var al = $.al;
  var dmp = $.dmp;
  
  var rpl = $.rpl;
  
  var psh = $.psh;
  
  var tfn = $.tfn;
  var tfna = $.tfna;
  
  var typ = $.typ2;
  
  var apl = $.apl;
  var sli = $.sli;
  
  var stf = $.stf;
  
  var evl = $.evl;
  
  var aload = $.aload;
  var load = $.load;
  
  ////// Types //////
  
  // cfn = comparison fn
  function tseq(run, res, cfn){
    return {type: "testeq", run: run, res: res, cfn: cfn};
  }
  
  function grun(a){
    return a.run;
  }
  
  function gres(a){
    return a.res;
  }
  
  function gcfn(a){
    return a.cfn;
  }
  
  function rs(pass){
    return {type: "res", pass: pass, mess: apl(stf, sli(arguments, 1))};
  }
  
  function gpass(a){
    return a.pass;
  }
  
  function gmess(a){
    return a.mess;
  }
  
  ////// Add Tests //////
  
  var tests = [];
  function test(run, res, cfn){
    return psh(tseq(run, res, cfn), tests);
  }
  
  ////// Run Tests //////
  
  var allpass = true;
  function runall(){
    allpass = true;
    out("Running tests...");
    out("");
    for (var i = 0; i < tests.length; i++){
      var res = run1(tests[i]);
      if (!gpass(res)){
        allpass = false;
        out(gmess(res));
      }
    }
    if (allpass)out("Passed all tests!");
  }
  
  function run1(a){
    var t = typ(a);
    switch (t){
      case "testeq":
        var run = grun(a);
        var cfn = gcfn(a);
        var corr = gres(a); // correct
        try {
          var res = evl(run);
          if (tfn(corr, cfn)(res))return rs(true);
          if (udfp(cfn)){
            return rs(false, "Failed: $1 -> $2 != $3", run, res, corr);
          }
          return rs(false, "Failed: $1 -> $2 != $3 using $4", run, res, corr, cfn);
        } catch (e){
          return rs(false, "Failed: $1 with error $2", run, e);
        }
    }
    return rs(false, "Unknown test type $1", t);
  }
  
  ////// DOM //////
  
  var res = $("results");
  var pg = $("page");
  
  var bot = $.bot;
  var atth = $.atth;
  
  function ou(a){
    atth(esc(a), res);
    bot(pg);
  }
  
  function out(a){
    atth(esc(a) + "<br>", res);
    bot(pg);
  }
  
  function esc(a){
    return rpl(["<", ">", "\n"],
               ["&lt", "&gt", "<br>"], a);
  }
  
  ////// Load Files //////
  
  window.test = test;
  window.load = load;
  window.udf = udf;
  window.tfna = $.tfna;
  
  aload("tests.js", runall);
  
  ////// Object Exposure //////
  
  win.Test = {
    tseq: tseq,
    grun: grun,
    gres: gres,
    gcfn: gcfn,
    rs: rs,
    gpass: gpass,
    gmess: gmess,
    
    tests: tests,
    test: test,
    
    runall: runall,
    run1: run1,
    
    ou: ou,
    out: out,
    esc: esc
  };
  
})();

