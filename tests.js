QUnit.test('Type', function (assert){
  //// Type ////
  
  assert.same(L.typ(L.sy("test")), "sym");
  assert.same(L.dat(L.sy("test")), "test");
  
  var a = L.mkdat("test", "hey");
  L.sdat(a, "what");
  assert.same(L.typ(a), "test");
  
  var a = L.mkdat("test", "hey");
  L.sdat(a, "what");
  assert.same(L.dat(a), "what");
});

QUnit.test('Builders', function (assert){
  //// Builders ////
  
  var a = L.mk("test", {a: 3, b: 4, type: "hey"});
  assert.same(L.typ(a), "test");
  var a = L.mk("test", {a: 3, b: 4, type: "hey"});
  assert.same(L.rep(a, "a"), 3);
  var a = L.mk("test", {a: 3, b: 4, type: "hey"});
  L.tag(a, "type", "hey");
  assert.same(L.typ(a), "hey");
  var a = L.mk("test", {a: 3, b: 4, type: "hey"});
  L.det(a, "type");
  assert.same(L.typ(a), udf);
  var a = L.mk("test", {a: 3, b: 4, type: "hey"});
  L.det(a, "type");
  assert.same(L.tagp(a), false);
  
  assert.same(L.typ(L.car(L.cons(L.sy("test"), L.nu("253")))), "sym");
  assert.same(L.dat(L.car(L.cons(L.sy("test"), L.nu("253")))), "test");
  
  assert.same(L.typ(L.cdr(L.cons(L.sy("test"), L.nu("253")))), "num");
  assert.teststr(L.dat(L.cdr(L.cons(L.sy("test"), L.nu("253")))), "253");
  
  assert.same(L.typ(L.nil()), "nil");
  assert.same(L.nilp(L.nil()), true);
  assert.same(L.lisp(L.nil()), false);
  assert.same(L.symp(L.nil()), false);
  
  var a = L.cons(1, 2);
  L.scar(a, 3);
  assert.same(L.car(a), 3);
  
  var a = L.cons(1, 2);
  L.scar(a, 3);
  assert.same(L.cdr(a), 2);
  
  var a = L.cons(1, 2);
  L.scdr(a, 3);
  assert.same(L.car(a), 1);
  
  var a = L.cons(1, 2);
  L.scdr(a, 3);
  assert.same(L.cdr(a), 3);
  
  assert.same(L.typ(L.lis(L.nu("1"), L.nu("2"), L.nu("3"))), "lis");
  assert.same(L.is(L.nu("1"), L.car(L.lis(L.nu("1"), L.nu("2"), L.nu("3")))),
         true);
  assert.same(L.iso(L.cdr(L.lis(L.nu("1"), L.nu("2"), L.nu("3"))), 
                    L.lis(L.nu("2"), L.nu("3"))),
         true);
  assert.same(L.is(L.lis(), L.nil()), true);
  
  assert.same(L.nilp(L.lisd()), true)
  assert.same(L.typ(L.lisd(1, 2)), "lis")
  assert.same(L.car(L.lisd(1, 2)), 1)
  assert.same(L.cdr(L.lisd(1, 2)), 2)
  assert.same(L.iso(L.lisd(1, 2, 3), L.cons(1, L.cons(2, 3))), true)
  assert.same(L.iso(L.lisd(1, 2, 3, L.nil()), L.lis(1, 2, 3)), true)
  
  
  assert.same(L.typ(L.arr(1, 2, 3)), "arr");
  assert.same(L.dat(L.arr(1, 2, 3)), [1, 2, 3], $.iso);
});

QUnit.test('Predicates', function (assert){
  //// Predicates ////
  
  assert.same(L.udfp, $.udfp);
  
  assert.same(L.tagp(L.sy("test")), true);
  assert.same(L.tagp(null), false);
  assert.same(L.tagp(undefined), false);
  
  assert.same(L.isa("sym", L.sy("test")), true);
  assert.same(L.isa("sym", L.st("test")), false);
  
  assert.same(L.isany("sym", L.st("test"), L.nu("334"), L.sy("ta")), true);
  assert.same(L.isany("arr", L.st("test"), L.nu("334"), L.sy("ta")), false);
  
  assert.same(L.typin(L.st("test"), "arr", "cons", "mac"), false);
  assert.same(L.typin(L.st("test"), "arr", "cons", "str"), true);
  
  assert.same(L.symp(L.sy("test")), true);
  assert.same(L.symp(L.st("test")), false);
  
  assert.same(L.nump(L.sy("353")), false);
  assert.same(L.nump(L.st("353")), false);
  assert.same(L.nump(L.nu("353")), true);
  
  assert.same(L.strp(L.sy("test")), false);
  assert.same(L.strp(L.st("test")), true);
  
  assert.same(L.arrp(L.cons(1, 2)), false);
  assert.same(L.arrp(L.st("test")), false);
  assert.same(L.arrp(L.nil()), false);
  assert.same(L.arrp(L.arr(1, 2)), true);
  
  assert.same(L.objp(L.cons(1, 2)), false);
  assert.same(L.objp(L.st("test")), false);
  assert.same(L.objp(L.nil()), false);
  assert.same(L.objp(L.arr(1, 2)), false);
  assert.same(L.objp(L.ob({a: 3, b: 4})), true);
  
  assert.same(L.rgxp(L.cons(1, 2)), false);
  assert.same(L.rgxp(L.st("test")), false);
  assert.same(L.rgxp(L.nil()), false);
  assert.same(L.rgxp(L.arr(1, 2)), false);
  assert.same(L.rgxp(L.ob({a: 3, b: 4})), false);
  assert.same(L.rgxp(/test/g), false);
  assert.same(L.rgxp(L.rx(/test/g)), true);
  
  assert.same(L.jnp(L.cons(1, 2)), false);
  assert.same(L.jnp(L.st("test")), false);
  assert.same(L.jnp(L.nil()), false);
  assert.same(L.jnp(L.arr(1, 2)), false);
  assert.same(L.jnp(L.ob({a: 3, b: 4})), false);
  assert.same(L.jnp(/test/g), false);
  assert.same(L.jnp(L.rx(/test/g)), false);
  assert.same(L.jnp(function (){}), false);
  assert.same(L.jnp(L.jn(function (){})), true);
  
  // mac and smac
  
  assert.same(L.nilp(L.sy("test")), false);
  assert.same(L.nilp(L.st("nil")), false);
  assert.same(L.nilp(L.sy("nil")), false);
  assert.same(L.nilp(L.nil()), true);
  
  assert.same(L.lisp(L.st("test")), false);
  assert.same(L.lisp(L.nil()), false);
  assert.same(L.lisp(L.sy("nil")), false);
  assert.same(L.lisp(L.cons(L.nu("34"), L.nu("52"))), true);
  
  assert.same(L.atmp(L.sy("nil")), true);
  assert.same(L.atmp(L.nil()), true);
  assert.same(L.atmp(L.cons(L.nu("34"), L.nu("52"))), false);
  
  assert.same(L.synp(L.sy("nil")), true);
  assert.same(L.synp(L.nil()), false);
  assert.same(L.synp(L.st("test")), true);
  assert.same(L.synp(L.nu("253")), false);
  assert.same(L.synp(L.cons(L.nu("34"), L.nu("52"))), false);
  
  assert.same(L.fnp(L.jn(function (){})), true);
  // fnp of other function types
});

QUnit.test('Comparison', function (assert){
  //// Comparison ////
  
  assert.same(L.is(L.sy("nil"), L.sy("nil")), true);
  assert.same(L.is(L.st("nil"), L.st("nil")), true);
  assert.same(L.is(L.sy("nil"), L.st("nil")), false);
  assert.same(L.is(L.sy("nil"), L.sy("nill")), false);
  assert.same(L.is(L.nil(), L.nil()), true);
  assert.same(L.is(L.nu("345"), L.nu("345")), true);
  assert.same(L.is(L.nu("345"), L.nu("346")), false);
  assert.same(L.is(L.rx(/test/g), L.rx(/test/g)), true);
  assert.same(L.is(L.cons(L.nu("34"), L.nu("52")), L.cons(L.nu("34"), L.nu("52"))),
         false);
  var a = L.cons(L.nu("34"), L.nu("52"));
  assert.same(L.is(a, a), true);
  
  assert.same(L.isn(L.sy("nil"), L.sy("nil")), false);
  assert.same(L.isn(L.nu("345"), L.nu("346")), true);
  assert.same(L.isn(L.cons(L.nu("34"), L.nu("52")), L.cons(L.nu("34"), L.nu("52"))),
         true);
  
  assert.same(L.iso(L.sy("nil"), L.sy("nil")), true);
  assert.same(L.iso(L.st("nil"), L.st("nil")), true);
  assert.same(L.iso(L.sy("nil"), L.st("nil")), false);
  assert.same(L.iso(L.sy("nil"), L.sy("nill")), false);
  assert.same(L.iso(L.nil(), L.nil()), true);
  assert.same(L.iso(L.nu("345"), L.nu("345")), true);
  assert.same(L.iso(L.nu("345"), L.nu("346")), false);
  assert.same(L.iso(L.rx(/test/g), L.rx(/test/g)), true);
  assert.same(L.iso(L.cons(L.nu("34"), L.nu("52")), L.cons(L.nu("34"), L.nu("52"))),
         true);
  var a = L.cons(L.nu("34"), L.nu("52"));
  assert.same(L.iso(a, a), true);
  assert.same(L.iso(L.ob({a: 3, b: 4}), L.ob({a: 3, b: 4})), true)
  assert.same(L.iso(L.ob({a: L.st("3"), b: L.st("4")}), L.ob({a: L.st("3"), b: L.st("4")})), true)
  assert.same(L.iso(L.arr(1, 2, 3), L.arr(1, 2, 3)), true);
  assert.same(L.iso(L.arr(1, 2, 3, 4), L.arr(1, 2, 3)), false);
  assert.same(L.iso(L.arr(L.lis(3), 2, 3), L.arr(L.lis(3), 2, 3)), true);
  assert.same(L.iso(L.lis(L.arr(3), 2, 3), L.lis(L.arr(3), 2, 3)), true);
  
  assert.same(L.inp(L.nu("345"), L.nu("34"), L.sy("test"), L.rx(/test/g), L.st("hey")),
         false);
  assert.same(L.inp(L.nu("345"), L.nu("34"), L.sy("test"), L.rx(/test/g), L.nu("345")),
         true);
  
  var a = L.nil();
  assert.same(L.sta(a, 1, function (){return L.car(a);}), 1);
  assert.same(L.nilp(a), true);
  var a = L.nil();
  assert.same(L.sta(a, 1, function (){
    return L.sta(a, 2, function (){
      return L.cadr(a);
    });
  }), 1);
});

QUnit.test('Display', function (assert){
  //// Display ////
  
  assert.same(L.dsj(L.nu("2353")), "2353");
  assert.same(L.dsj(L.sy("test")), "test");
  //assert.same(L.dsj(L.sy("te st")), "|te st|");
  assert.same(L.dsj(L.st("test")), "\"test\"");
  assert.same(L.dsj(L.st("tes\\\"t")), "\"tes\\\\\\\"t\"");
  assert.same(L.dsj(L.lis(L.nu("1"), L.nu("2"), L.nu("3"))), "(1 2 3)");
  assert.same(L.dsj(L.cons(L.nu("1"), L.nu("2"))), "(1 . 2)");
  assert.same(L.dsj(L.lisd(L.nu("1"), L.nu("2"), L.nu("3"))), "(1 2 . 3)");
  assert.same(L.dsj(L.lis(L.sy("qt"), L.sy("test"))), "'test");
  assert.same(L.dsj(L.lis(L.sy("uqs"), L.sy("test"))), ",@test");
  assert.same(L.dsj(L.ar([L.nu("1"), L.nu("2"), L.nu("3")])), "#[1 2 3]");
  assert.same(L.dsj(L.ob({a: L.nu("1"), b: L.nu("2")})), "{a 1 b 2}");
  assert.same(L.dsj(L.rx(/test\//g)), "#\"test\\\/\"");
  assert.same(L.dsj(L.rx(/test"\//g)), "#\"test\\\"\\\/\"");
  assert.same(L.dsj(L.jn(L.atmp)), "<jn atmp(a)>");
  assert.same(L.dsj(L.mkdat("test", L.nu("2"))), "<test {data 2}>");
  assert.same(L.dsj("test"), "<js \"test\">");
  
  // test dsj fn types
  
  assert.same(L.typ(L.dsp(L.lis(L.nu("1"), L.nu("2"), L.nu("3")))), "str");
  assert.same(L.dat(L.dsp(L.lis(L.nu("1"), L.nu("2"), L.nu("3")))), "(1 2 3)");
  
  //// Output ////
  
  var d = 0;
  L.ofn(function (a){d = a;});
  L.ou("test");
  assert.same(d, "test");
  
  var d = 0;
  L.ofn(function (a){d = a;});
  L.out(L.st("test"));
  assert.same(L.typ(d), "str");
  assert.same(L.dat(d), "test\n");
  
  var d = 0;
  L.ofn(function (a){d = a;});
  L.pr(L.st("test $1 $2 $3"), L.nu("23"), L.st("43"), L.nil());
  assert.same(L.typ(d), "str");
  assert.same(L.dat(d), "test 23 \"43\" nil");
});

QUnit.test('Converters', function (assert){
  //// Converters ////
  
  assert.same(L.typ(L.sym(L.sy("test"))), "sym");
  assert.same(L.dat(L.sym(L.sy("test"))), "test");
  assert.same(L.typ(L.sym(L.sy("nil"))), "sym");
  assert.same(L.dat(L.sym(L.sy("nil"))), "nil");
  assert.same(L.typ(L.sym(L.nil())), "sym");
  assert.same(L.dat(L.sym(L.nil())), "");
  assert.same(L.typ(L.sym(L.nu("235"))), "sym");
  assert.same(L.dat(L.sym(L.nu("235"))), "235");
  assert.same(L.typ(L.sym(L.st("235"))), "sym");
  assert.same(L.dat(L.sym(L.st("235"))), "235");
  assert.same(L.typ(L.sym(L.lis(L.nu("1"), L.nu("2")))), "sym");
  assert.same(L.dat(L.sym(L.lis(L.nu("1"), L.nu("2")))), "(1 2)");
  
  assert.same(L.typ(L.str1(L.sy("test"))), "str");
  assert.same(L.dat(L.str1(L.sy("test"))), "test");
  assert.same(L.typ(L.str1(L.sy("nil"))), "str");
  assert.same(L.dat(L.str1(L.sy("nil"))), "nil");
  assert.same(L.typ(L.str1(L.nil())), "str");
  assert.same(L.dat(L.str1(L.nil())), "");
  assert.same(L.typ(L.str1(L.nu("235"))), "str");
  assert.same(L.dat(L.str1(L.nu("235"))), "235");
  assert.same(L.typ(L.str1(L.st("235"))), "str");
  assert.same(L.dat(L.str1(L.st("235"))), "235");
  assert.same(L.typ(L.str1(L.st("nil"))), "str");
  assert.same(L.dat(L.str1(L.st("nil"))), "nil");
  assert.same(L.typ(L.str1(L.lis(L.nu("1"), L.nu("2")))), "str");
  assert.same(L.dat(L.str1(L.lis(L.nu("1"), L.nu("2")))), "(1 2)");
  
  assert.same(L.typ(L.str(L.sy("test"), L.nil(), L.nu("34"))), "str");
  assert.same(L.dat(L.str(L.sy("test"), L.nil(), L.nu("34"))), "test34");
  
  assert.same(L.typ(L.num(L.sy("test"))), "num");
  assert.teststr(L.dat(L.num(L.sy("test"))), "0");
  assert.same(L.typ(L.num(L.sy("nil"))), "num");
  assert.teststr(L.dat(L.num(L.sy("nil"))), "0");
  assert.same(L.typ(L.num(L.nil())), "num");
  assert.teststr(L.dat(L.num(L.nil())), "0");
  assert.same(L.typ(L.num(L.nu("235"))), "num");
  assert.teststr(L.dat(L.num(L.nu("235"))), "235");
  assert.same(L.typ(L.num(L.st("235"))), "num");
  assert.teststr(L.dat(L.num(L.st("235"))), "235");
  assert.same(L.typ(L.num(L.st("2test"))), "num");
  assert.teststr(L.dat(L.num(L.st("2test"))), "2");
  assert.same(L.typ(L.num(L.st("hey"))), "num");
  assert.teststr(L.dat(L.num(L.st("hey"))), "0");
  assert.same(L.typ(L.num(L.st("-2test"))), "num");
  assert.teststr(L.dat(L.num(L.st("-2test"))), "-2");
  assert.same(L.typ(L.num(L.st("-1"))), "num");
  assert.teststr(L.dat(L.num(L.st("-1"))), "-1");
  assert.same(L.typ(L.num(L.lis(L.nu("1"), L.nu("2")))), "num");
  assert.teststr(L.dat(L.num(L.lis(L.nu("1"), L.nu("2")))), "0");
  
  assert.same(L.has(L.tfn(L.st("test")), L.lis(L.st("tes"), L.st("tests"), L.sy("test"))), false);
  assert.same(L.has(L.tfn(L.st("test")), L.lis(L.st("tes"), L.st("test"), L.sy("test"))), false, $.isn);
  assert.same(L.has(L.tfn(L.jn(function (a){return L.chkb(a > 3);})), L.lis(1, 2, 3)), false);
  assert.same(L.has(L.tfn(L.jn(function (a){return L.chkb(a > 3);})), L.lis(2, 3, 4)), false, $.isn);
  
  //assert.same(L.tfn());
  
  assert.same(L.typ(L.tarr(L.lis(1, 2, 3))), "arr");
  assert.same(L.dat(L.tarr(L.lis(1, 2, 3))), [1, 2, 3], $.iso);
  var a = L.arr(1, 2, 3);
  assert.same(L.tarr(a) === a, true);
  var a = L.arr(L.st("t"), L.st("e"), L.st("s"), L.st("t"));
  assert.same(L.iso(a, L.tarr(L.st("test"))),
       true);
  var a = L.arr(L.sy("t"), L.sy("e"), L.sy("s"), L.sy("t"));
  assert.same(L.iso(a, L.tarr(L.sy("test"))), true);
  //var a = L.arr(L.nu("5"), L.nu("3"), L.nu("7"), L.nu("3"));
  //assert.same(L.iso(a, L.tarr(L.nu("5373"))), true);
  // test for tarr(obj)
  
  assert.same(L.iso(L.tlis(L.arr(1, 2, 3)), L.lis(1, 2, 3)), true);
  var a = L.lis(1, 2, 3);
  assert.same(L.tlis(a) === a, true);
  var a = L.lis(L.st("t"), L.st("e"), L.st("s"), L.st("t"));
  assert.same(L.iso(a, L.tlis(L.st("test"))), true);
  var a = L.lis(L.sy("t"), L.sy("e"), L.sy("s"), L.sy("t"));
  assert.same(L.iso(a, L.tlis(L.sy("test"))), true);
  //var a = L.lis(L.nu("5"), L.nu("3"), L.nu("7"), L.nu("3"));
  //assert.same(L.iso(a, L.tlis(L.nu("5373"))), true);
  // test for tlis(obj)
  
  // test tobj(lis) and tobj(arr)
  var a = L.ob({a: 3, b: 4});
  assert.same(L.tobj(a) === a, true);
  var a = L.ob({0: L.st("t"), 1: L.st("e"), 2: L.st("s"), 3: L.st("t")});
  assert.same(L.iso(a, L.tobj(L.st("test"))), true);
  var a = L.ob({0: L.sy("t"), 1: L.sy("e"), 2: L.sy("s"), 3: L.sy("t")});
  assert.same(L.iso(a, L.tobj(L.sy("test"))), true);
  //var a = L.ob({0: L.nu("5"), 1: L.nu("3"), 2: L.nu("7"), 3: L.nu("3")});
  //assert.same(L.iso(a, L.tobj(L.nu("5373"))), true);
  
  // test prop and jstr
  
  assert.same(L.jarr(L.lis(1, 2, 3)), [1, 2, 3], $.iso);
  assert.same(L.jarr(L.arr(1, 2, 3)), [1, 2, 3], $.iso);
  assert.same(L.jarr(L.arr()), [], $.iso);
  assert.same(L.jarr(L.nil()), [], $.iso);
  
  assert.same(L.jnum(L.nu("34")), 34);
  assert.same(L.jnum(L.st("34")), 34);
  assert.same(L.jnum(L.lis(L.nu("34"))), 0);
  
  assert.same(L.is(L.lnum(34), L.nu("34")), true);
  assert.same(L.is(L.lnum("34"), L.nu("34")), true);
  assert.same(L.is(L.lnum([34]), L.nu("0")), true);
  
  assert.same(L.jmat(L.sy("test")), "test");
  assert.same(L.jmat(L.sy("nil")), "nil");
  assert.same(L.jmat(L.nil()), "");
  assert.same(L.jmat(L.nu("253")), "253");
  var a = L.rx(/test/g);
  assert.same(L.jmat(a) === L.dat(a), true);
  assert.same(L.jmat(L.arr(L.st("1"), L.sy("test"), L.nu("76"))),
         ["1", "test", "76"], $.iso);
  assert.same(L.jmat(L.lis(L.st("1"), L.sy("test"), L.nu("76"))),
         ["1", "test", "76"], $.iso);
  
  assert.same(L.typ(L.lbn(L.nilp)), "jn");
  assert.same(L.typ(L.dat(L.lbn(L.nilp))(L.nil())), "sym");
  assert.same(L.dat(L.dat(L.lbn(L.nilp))(L.nil())), "t");
  assert.same(L.typ(L.dat(L.lbn(L.nilp))(L.sy("hey"))), "nil");
  assert.same(L.typ(L.dat(L.lbn(L.nilp))(L.nu("0"))), "nil");
  
  var a = function (a){return a;};
  assert.same(L.tjn(L.jn(a)) === a, true);
  // test tjn of other fn types
  
  // if given a js fn instead of a lisp fn,
  //   checks whether arg is equal to the js fn
  assert.same(L.jbn(L.nilp)(L.nil()), false);
  assert.same(L.jbn(L.nilp)(L.st("nil")), false);
  assert.same(L.jbn(L.nilp)(L.nilp), true);
  
  // everything is true if return of input function outputs
  //   a js bool instead of the required lisp bool
  assert.same(L.jbn(L.jn(L.nilp))(L.nil()), true);
  assert.same(L.jbn(L.jn(L.nilp))(L.st("hey")), true);
  assert.same(L.jbn(L.jn(L.nilp))(L.sy("hey")), true);
  assert.same(L.jbn(L.jn(L.nilp))(L.lis(1, 2, 3)), true);
  
  assert.same(L.jbn(L.lbn(L.nilp))(L.nil()), true);
  assert.same(L.jbn(L.lbn(L.nilp))(L.st("hey")), false);
  assert.same(L.jbn(L.lbn(L.nilp))(L.sy("hey")), false);
  assert.same(L.jbn(L.lbn(L.nilp))(L.lis(1, 2, 3)), false);
  assert.same(L.jbn(L.lbn(L.nilp))(L.st("nil")), false);
  assert.same(L.jbn(L.lbn(function (a){return a < 5;}))(3), true);
  assert.same(L.jbn(L.lbn(function (a){return a < 5;}))(5), false);
  assert.same(L.jbn(L.lbn(function (a){return a < 5;}))(10), false);
});

QUnit.test('Sequence Items', function (assert){
  //// Sequence ////
  
  //// Items ////
  
  assert.same(L.ref1(L.arr(1, 2, 3), L.nu("0")), 1);
  assert.same(L.ref1(L.lis(1, 2, 3), L.nu("0")), 1);
  assert.same(L.typ(L.ref1(L.st("123"), L.nu("0"))), "str");
  assert.same(L.dat(L.ref1(L.st("123"), L.nu("0"))), "1");
  assert.same(L.ref1(L.arr(1, 2, 3), L.nu("2")), 3);
  assert.same(L.ref1(L.lis(1, 2, 3), L.nu("2")), 3);
  assert.same(L.typ(L.ref1(L.sy("123"), L.nu("2"))), "sym");
  assert.same(L.dat(L.ref1(L.sy("123"), L.nu("2"))), "3");
  assert.same(L.ref1(L.ob({a: 3, b: 4}), L.sy("a")), 3);
  assert.same(L.ref1(L.ob({a: 3, b: 4}), L.st("b")), 4);
  assert.same(L.ref1(L.ob({a: 3, b: 4, 4: 1}), L.nu("4")), 1);
  assert.same(L.typ(L.ref1(L.nil(), L.nu("2"))), "nil");
  assert.same(L.ref1(L.ob({a: 3, b: 4}), L.st("b")), 4);
  assert.same(L.ref1(L.ob({a: 3, b: 4, 4: 1}), L.nu("4")), 1);
  assert.same(L.nilp(L.ref1(L.lis(1, 2, 3), L.nu("3"))), true);
  assert.same(L.nilp(L.ref1(L.arr(1, 2, 3), L.nu("3"))), true);
  assert.same(L.nilp(L.ref1(L.st("123"), L.nu("3"))), true);
  assert.same(L.nilp(L.ref1(L.ob({a: 3, b: 4}), L.st("c"))), true);
  
  assert.same(L.nilp(L.ref(L.lis(1, 2, 3), L.nu("-3"))), true);
  assert.same(L.nilp(L.ref(L.arr(1, 2, 3), L.nu("-3"))), true);
  assert.same(L.nilp(L.ref(L.st("123"), L.nu("-3"))), true);
  
  assert.same(L.ref(L.arr(L.arr(1, 2), L.arr(3, 4)), L.nu("0"), L.nu("1")), 2);
  assert.same(L.typ(L.ref(L.arr(L.st("test"), L.arr(3, 4)), L.nu("0"), L.nu("1"))),
         "str");
  assert.same(L.dat(L.ref(L.arr(L.st("test"), L.arr(3, 4)), L.nu("0"), L.nu("1"))),
         "e");
  
  var a = L.lis(1, 2, 3);
  L.set(a, L.nu("2"), 10);
  assert.same(L.ref(a, L.nu("2")), 10);
  
  var a = L.arr(1, 2, 3);
  L.set(a, L.nu("2"), 10);
  assert.same(L.ref(a, L.nu("2")), 10);
  
  var a = L.ob({a: 1, b: 2, c: 3});
  L.set(a, L.sy("a"), 10);
  assert.same(L.ref(a, L.st("a")), 10);
  
  assert.same(L.fst(L.lis(1, 2, 3)), 1);
  assert.same(L.las(L.lis(1, 2, 3)), 3);
  assert.same(L.typ(L.fst(L.st("testing"))), "str");
  assert.same(L.dat(L.fst(L.st("testing"))), "t");
  assert.same(L.typ(L.las(L.st("testing"))), "str");
  assert.same(L.dat(L.las(L.st("testing"))), "g");
});

QUnit.test('Apply', function (assert){
  //// Apply ////
  
  // need tests for objects
  
  assert.same(L.iso(L.apl(L.jn(L.lis), L.arr(1, 2, 3)), L.lis(1, 2, 3)), true);
  assert.same(L.iso(L.apl(L.jn(L.arr), L.lis(1, 2, 3)), L.arr(1, 2, 3)), true);
  
  assert.same(L.iso(L.cal(L.jn(L.lis), 1, 2, 3), L.lis(1, 2, 3)), true);
  assert.same(L.iso(L.cal(L.jn(L.arr), 1, 2, 3), L.arr(1, 2, 3)), true);
  
  assert.same(L.iso(L.map(L.jn(function (a){return a+3;}), L.lis(1, 2, 3)), L.lis(4, 5, 6)),
         true);
  assert.same(L.dat(L.map(L.jn(function (a){return a+3;}), L.arr(1, 2, 3))),
         [4, 5, 6], $.iso);
  assert.same(L.dat(L.map(L.jn(function (a){return a+3;}), L.ob({a: 1, b: 2}))),
         {a: 4, b: 5}, $.iso);
  
  
  assert.same(L.typ(L.pos(L.nu("1"), L.lis(L.nu("3"), L.nu("2"), L.nu("5")))), "num");
  assert.teststr(L.dat(L.pos(L.nu("1"), L.lis(L.nu("3"), L.nu("2"), L.nu("5")))), "-1");
  assert.same(L.typ(L.pos(L.nu("1"), L.lis(L.nu("3"), L.nu("2"), L.nu("1")))), "num");
  assert.teststr(L.dat(L.pos(L.nu("1"), L.lis(L.nu("3"), L.nu("2"), L.nu("1")))), "2");
  assert.same(L.typ(L.pos(L.nu("1"), L.lis(L.nu("1"), L.nu("2"), L.nu("3")), L.nu("1"))),
         "num");
  assert.teststr(L.dat(L.pos(L.nu("1"), L.lis(L.nu("1"), L.nu("2"), L.nu("3")), L.nu("1"))),
         "-1");
  assert.same(L.typ(L.pos(L.nu("1"), L.lis(L.nu("1"), L.nu("2"), L.nu("1")), L.nu("1"))),
         "num");
  assert.teststr(L.dat(L.pos(L.nu("1"), L.lis(L.nu("1"), L.nu("2"), L.nu("1")), L.nu("1"))),
         "2");
  
  assert.same(L.typ(L.pos(L.nu("1"), L.arr(L.nu("3"), L.nu("2"), L.nu("5")))), "num");
  assert.teststr(L.dat(L.pos(L.nu("1"), L.arr(L.nu("3"), L.nu("2"), L.nu("5")))), "-1");
  assert.same(L.typ(L.pos(L.nu("1"), L.arr(L.nu("3"), L.nu("2"), L.nu("1")))), "num");
  assert.teststr(L.dat(L.pos(L.nu("1"), L.arr(L.nu("3"), L.nu("2"), L.nu("1")))), "2");
  assert.same(L.typ(L.pos(L.nu("1"), L.arr(L.nu("1"), L.nu("2"), L.nu("3")), L.nu("1"))),
         "num");
  assert.teststr(L.dat(L.pos(L.nu("1"), L.arr(L.nu("1"), L.nu("2"), L.nu("3")), L.nu("1"))),
         "-1");
  assert.same(L.typ(L.pos(L.nu("1"), L.arr(L.nu("1"), L.nu("2"), L.nu("1")), L.nu("1"))),
         "num");
  assert.teststr(L.dat(L.pos(L.nu("1"), L.arr(L.nu("1"), L.nu("2"), L.nu("1")), L.nu("1"))),
         "2");
  
  assert.same(L.typ(L.pos(L.nu("1"), L.st("325"))), "num");
  assert.teststr(L.dat(L.pos(L.nu("1"), L.st("325"))), "-1");
  assert.same(L.typ(L.pos(L.nu("1"), L.st("321"))), "num");
  assert.teststr(L.dat(L.pos(L.nu("1"), L.st("321"))), "2");
  assert.same(L.typ(L.pos(L.nu("1"), L.st("123"), L.nu("1"))), "num");
  assert.teststr(L.dat(L.pos(L.nu("1"), L.st("123"), L.nu("1"))), "-1");
  assert.same(L.typ(L.pos(L.nu("1"), L.st("121"), L.nu("1"))), "num");
  assert.teststr(L.dat(L.pos(L.nu("1"), L.st("121"), L.nu("1"))), "2");
  
  assert.same(L.has(L.nu("1"), L.lis(L.nu("3"), L.nu("2"), L.nu("5"))), false);
  assert.same(L.has(L.nu("1"), L.lis(L.nu("3"), L.nu("2"), L.nu("1"))), false, $.isn);
  assert.same(L.has(L.nu("1"), L.lis(L.nu("1"), L.nu("2"), L.nu("3"))), false, $.isn);
  assert.same(L.has(L.nu("1"), L.lis(L.st("1"), L.nu("2"), L.sy("t"))), false);
  assert.same(L.has(L.nu("1"), L.lis(L.nu("1"), L.nu("1"), L.sy("t"))), false, $.isn);
  
  assert.same(L.has(L.nu("1"), L.arr(L.nu("3"), L.nu("2"), L.nu("5"))), false);
  assert.same(L.has(L.nu("1"), L.arr(L.nu("3"), L.nu("2"), L.nu("1"))), false, $.isn);
  assert.same(L.has(L.nu("1"), L.arr(L.nu("1"), L.nu("2"), L.nu("3"))), false, $.isn);
  assert.same(L.has(L.nu("1"), L.arr(L.st("1"), L.nu("2"), L.sy("t"))), false);
  assert.same(L.has(L.nu("1"), L.arr(L.nu("1"), L.nu("1"), L.sy("t"))), false, $.isn);
  
  assert.same(L.has(L.nu("1"), L.st("325")), false);
  assert.same(L.has(L.nu("1"), L.st("321")), false, $.isn);
  assert.same(L.has(L.nu("1"), L.st("123")), false, $.isn);
  assert.same(L.has(L.nu("1"), L.st("12t")), false, $.isn);
  assert.same(L.has(L.nu("1"), L.st("11t")), false, $.isn);
  
  assert.same(L.has(L.nu("1"), L.nil()), false);
  assert.same(L.has(L.nil(), L.nil()), false);
  
  
  assert.same(L.iso(L.rem(1, L.lis(1, 2, 1, 1, 3, 5, -1, 10)), L.lis(2, 3, 5, -1, 10)),
         true);
  assert.same(L.iso(L.rem(1, L.arr(1, 2, 1, 1, 3, 5, -1, 10)), L.arr(2, 3, 5, -1, 10)),
         true);
  assert.same(L.typ(L.rem(L.nu("1"), L.st("121135110"))), "str");
  assert.same(L.dat(L.rem(L.nu("1"), L.st("121135110"))), "2350");
  assert.same(L.nilp(L.rem(L.nu("1"), L.nil())), true);
  
  
  assert.same(L.iso(L.rpl(1, 10, L.lis(1, 2, 3, 1, 4, 5)), L.lis(10, 2, 3, 10, 4, 5)),
         true);
  assert.same(L.iso(L.rpl(1, 10, L.arr(1, 2, 3, 1, 4, 5)), L.arr(10, 2, 3, 10, 4, 5)),
         true);
  assert.same(L.typ(L.rpl(L.st("t"), L.nu("3"), L.st("test a b c e s t"))),
         "str");
  assert.same(L.dat(L.rpl(L.st("t"), L.nu("3"), L.st("test a b c e s t"))),
         "3es3 a b c e s 3");
  assert.same(L.typ(L.rpl(L.nu("4"), L.st("10"), L.sy("test 3 4 5 e 4 t"))),
         "sym");
  assert.same(L.typ(L.rpl(L.nu("4"), L.st("10"), L.nil())), "nil");
  assert.same(L.iso(
                L.rpl(L.nu("4"), L.st("10"),
                  L.ob({
                    a: L.nu("4"),
                    b: L.st("4"),
                    c: L.arr(L.nu("4"))
                  })),
                L.ob({
                  a: L.st("10"),
                  b: L.st("4"),
                  c: L.arr(L.nu("4"))
                })), 
         true);
  assert.same(L.iso(L.rpl(L.lbn(function (a){return a < 5;}), 10, L.lis(1, 2, 9, 3, 6, 1, 4, 5)), L.lis(10, 10, 9, 10, 6, 10, 10, 5)),
         true);
  
});

QUnit.test('Whole', function (assert){
  //// Whole ////
  
  assert.same(L.typ(L.len(L.lis(1, 2, 3))), "num");
  assert.teststr(L.dat(L.len(L.lis(1, 2, 3))), "3");
  assert.same(L.typ(L.len(L.arr(1, 2, 3))), "num");
  assert.teststr(L.dat(L.len(L.arr(1, 2, 3))), "3");
  assert.same(L.typ(L.len(L.st("12345"))), "num");
  assert.teststr(L.dat(L.len(L.st("12345"))), "5");
  assert.same(L.typ(L.len(L.ob({a: 3, b: 4}))), "num");
  assert.teststr(L.dat(L.len(L.ob({a: 3, b: 4}))), "2");
  assert.same(L.typ(L.len(L.nil())), "num");
  assert.teststr(L.dat(L.len(L.nil())), "0");
  
  assert.same(L.emp(L.lis()), true);
  assert.same(L.emp(L.lis(L.nil())), false);
  assert.same(L.emp(L.arr()), true);
  assert.same(L.emp(L.arr(1)), false);
  assert.same(L.emp(L.st("")), true);
  assert.same(L.emp(L.st("1")), false);
  assert.same(L.emp(L.ob({})), true);
  assert.same(L.emp(L.ob({a: 3})), false);
  
  assert.same(L.iso(L.cpy(L.lis(1, 2, 3)), L.lis(1, 2, 3)), true);
  assert.same(L.iso(L.cpy(L.arr(1, 2, 3)), L.arr(1, 2, 3)), true);
  assert.same(L.iso(L.cpy(L.ob({a: 3, b: 4})), L.ob({a: 3, b: 4})), true);
  var a = L.lis(1, 2, 3);
  assert.same(L.cpy(a) === a, false);
  var a = L.arr(1, 2, 3);
  assert.same(L.cpy(a) === a, false);
  var a = L.ob({a: 3, b: 4});
  assert.same(L.cpy(a) === a, false);
  var a = L.cons(1, 2); var b = L.cpy(a);
  L.scar(b, 3);
  assert.same(L.car(a), 1);
  var a = L.arr(1, 2); var b = L.cpy(a);
  L.set(b, L.nu("1"), 10);
  assert.same(L.ref(a, L.nu("1")), 2);
  var a = L.mkdat("test", "hey"); var b = L.cpy(a);
  L.sdat(b, "what");
  assert.same(L.dat(a), "hey");
  var a = L.mkdat("test", "hey"); var b = L.cpy(a);
  L.tag(b, "type", "obj");
  assert.same(L.typ(a), "test");
  
  assert.same(L.iso(L.rev(L.lis(1, 2, 3)), L.lis(3, 2, 1)), true);
  var a = L.lis(1, 2, 3);
  L.rev(a);
  assert.same(L.iso(a, L.lis(1, 2, 3)), true);
  assert.same(L.typ(L.rev(L.arr(1, 2, 3))), "arr");
  assert.same(L.dat(L.rev(L.arr(1, 2, 3))), [3, 2, 1], $.iso);
  assert.same(L.typ(L.rev(L.arr())), "arr");
  assert.same(L.dat(L.rev(L.arr())), [], $.iso);
  assert.same(L.typ(L.rev(L.st("123"))), "str");
  assert.same(L.dat(L.rev(L.st("123"))), "321");
  //assert.same(L.typ(L.rev(L.nu("123"))), "num");
  //assert.same(L.dat(L.rev(L.nu("123"))), "321");
  assert.same(L.typ(L.rev(L.sy("hey"))), "sym");
  assert.same(L.dat(L.rev(L.sy("hey"))), "yeh");
  assert.same(L.typ(L.rev(L.nil())), "nil");
  assert.same(L.typ(L.rev(L.st(""))), "str");
  assert.same(L.dat(L.rev(L.st(""))), "");
  //assert.same(L.typ(L.rev(L.nu(""))), "num");
  //assert.same(L.dat(L.rev(L.nu(""))), "");
  assert.same(L.typ(L.rev(L.sy(""))), "sym");
  assert.same(L.dat(L.rev(L.sy(""))), "");
  
  assert.same(L.iso(L.revlis(L.lis(1, 2, 3), L.lis(4, 5, 6)), L.lis(3, 2, 1, 4, 5, 6)),
         true);
  assert.same(L.iso(L.revlis(L.lis(1, 2, 3)), L.lis(3, 2, 1)), true);
  assert.same(L.iso(L.revlis(L.lis(1, 2, 3), L.st("hey")), L.lisd(3, 2, 1, L.st("hey"))),
         true);
});

QUnit.test('Parts', function (assert){
  //// Parts ////
  
  assert.same(L.iso(L.sli(L.lis(1, 2, 3), L.nu("1")), L.lis(2, 3)),
         true);
  assert.same(L.iso(L.sli(L.lis(1, 2, 3, 4, 5), L.nu("1"), L.nu("3")), L.lis(2, 3)),
         true);
  assert.same(L.iso(L.sli(L.arr(1, 2, 3), L.nu("1")), L.arr(2, 3)),
         true);
  assert.same(L.iso(L.sli(L.arr(1, 2, 3, 4, 5), L.nu("1"), L.nu("3")), L.arr(2, 3)),
         true);
  assert.same(L.typ(L.sli(L.st("123"), L.nu("1"))), "str");
  assert.same(L.dat(L.sli(L.st("123"), L.nu("1"))), "23");
  assert.same(L.typ(L.sli(L.st("12345"), L.nu("1"), L.nu("3"))), "str");
  assert.same(L.dat(L.sli(L.st("12345"), L.nu("1"), L.nu("3"))), "23");
  assert.same(L.iso(L.sli(L.lis(1, 2, 3), L.nu("6")), L.lis()),
         true);
  assert.same(L.iso(L.sli(L.arr(1, 2, 3), L.nu("6")), L.arr()),
         true);
  assert.same(L.iso(L.sli(L.lis(1, 2, 3, 4, 5), L.nu("1"), L.nu("-3")), L.lis()),
         true);
  assert.same(L.iso(L.sli(L.arr(1, 2, 3, 4, 5), L.nu("1"), L.nu("-3")), L.arr()),
         true);
  assert.same(L.typ(L.sli(L.st("123"), L.nu("6"))), "str");
  assert.same(L.dat(L.sli(L.st("123"), L.nu("6"))), "");
  assert.same(L.typ(L.sli(L.st("12345"), L.nu("1"), L.nu("-3"))), "str");
  assert.same(L.dat(L.sli(L.st("12345"), L.nu("1"), L.nu("-3"))), "");
  
  assert.same(L.iso(L.fstn(L.nu("2"), L.lis(1, 2, 3, 4, 5)), L.lis(1, 2)), true);
  assert.same(L.iso(L.fstn(L.nu("2"), L.arr(1, 2, 3, 4, 5)), L.arr(1, 2)), true);
  assert.same(L.typ(L.fstn(L.nu("2"), L.st("12345"))), "str");
  assert.same(L.dat(L.fstn(L.nu("2"), L.st("12345"))), "12");
  assert.same(L.nilp(L.fstn(L.nu("2"), L.lis())), true);
  assert.same(L.iso(L.fstn(L.nu("2"), L.arr()), L.arr()), true);
  assert.same(L.typ(L.fstn(L.nu("2"), L.st(""))), "str");
  assert.same(L.dat(L.fstn(L.nu("2"), L.st(""))), "");
  
  // rstn
  
  assert.same(L.iso(L.rst(L.lis(1, 2, 3, 4, 5)), L.lis(2, 3, 4, 5)), true);
  assert.same(L.iso(L.rst(L.arr(1, 2, 3, 4, 5)), L.arr(2, 3, 4, 5)), true);
  assert.same(L.typ(L.rst(L.st("12345"))), "str");
  assert.same(L.dat(L.rst(L.st("12345"))), "2345");
  assert.same(L.nilp(L.rst(L.lis())), true);
  assert.same(L.iso(L.rst(L.arr()), L.arr()), true);
  assert.same(L.typ(L.rst(L.st(""))), "str");
  assert.same(L.dat(L.rst(L.st(""))), "");
  
  assert.same(L.iso(L.mid(L.lis(1, 2, 3, 4, 5)), L.lis(2, 3, 4)), true);
  assert.same(L.iso(L.mid(L.arr(1, 2, 3, 4, 5)), L.arr(2, 3, 4)), true);
  assert.same(L.typ(L.mid(L.st("12345"))), "str");
  assert.same(L.dat(L.mid(L.st("12345"))), "234");
  assert.same(L.nilp(L.mid(L.lis())), true);
  assert.same(L.iso(L.mid(L.arr()), L.arr()), true);
  assert.same(L.typ(L.mid(L.st(""))), "str");
  assert.same(L.dat(L.mid(L.st(""))), "");
});

QUnit.test('Group', function (assert){
  //// Group ////
  
  assert.same(L.dsj(L.spl(L.st("testegest"), L.sy("t"))), "(\"\" \"es\" \"eges\" \"\")");
  assert.same(L.iso(L.spl(L.lis(1, 2, 3, 4, 1, 2, 5),
                          L.lbn(function (a){return a === 1;})),
                    L.lis(L.nil(), L.lis(2, 3, 4), L.lis(2, 5))),
          true);
  assert.same(L.iso(L.spl(L.arr(1, 2, 3, 4, 1, 2, 5),
                          L.lbn(function (a){return a === 1;})), 
                    L.arr(L.arr(), L.arr(2, 3, 4), L.arr(2, 5))),
          true);
  assert.same(L.dsj(L.spl(L.sy("testegest"), L.st("t"))), "( es eges )");
  //assert.same(L.dsj(L.spl(L.nu("1523634"), L.st("3"))), "(152 6 4)");
  //assert.same(L.dsj(L.spl(L.nu("1523634"))), "(1 5 2 3 6 3 4)");
  // test spl x = udf for cons and arr
  
  assert.testiso(L.grp(L.lis(1, 2, 3, 4, 5), L.nu("2")), L.lis(L.lis(1, 2), L.lis(3, 4), L.lis(5)));
  assert.testiso(L.grp(L.arr(1, 2, 3, 4, 5), L.nu("2")), L.arr(L.arr(1, 2), L.arr(3, 4), L.arr(5)));
  assert.testiso(L.grp(L.st("12345"), L.nu("2")), L.lis(L.st("12"), L.st("34"), L.st("5")));
  assert.testiso(L.grp(L.lis(), L.nu("2")), L.lis());
  assert.testiso(L.grp(L.arr(), L.nu("2")), L.arr());
  assert.testiso(L.grp(L.st(""), L.nu("2")), L.lis());
});

QUnit.test('Join', function (assert){
  //// Join ////
  
  assert.same(L.typ(L.joi(L.lis(L.nu("1"), L.st("3"), L.sy("t"), L.nil()))),
         "str");
  assert.same(L.dat(L.joi(L.lis(L.nu("1"), L.st("3"), L.sy("t"), L.nil()))),
         "13t");
  assert.same(L.typ(L.joi(L.lis(L.nu("1"), L.st("3"), L.sy("t"), L.nil()), L.sy("hey"))),
         "str");
  assert.same(L.dat(L.joi(L.arr(L.nu("1"), L.st("3"), L.sy("t"), L.nil()), L.sy("hey"))),
         "1hey3heythey");
  assert.same(L.typ(L.joi(L.arr(L.nu("1"), L.st("3"), L.sy("t"), L.nil()))),
         "str");
  assert.same(L.dat(L.joi(L.arr(L.nu("1"), L.st("3"), L.sy("t"), L.nil()))),
         "13t");
  assert.same(L.typ(L.joi(L.arr(L.nu("1"), L.st("3"), L.sy("t"), L.nil()), L.sy("hey"))),
         "str");
  assert.same(L.dat(L.joi(L.arr(L.nu("1"), L.st("3"), L.sy("t"), L.nil()), L.sy("hey"))),
         "1hey3heythey");
  
  assert.testiso(L.fla(L.lis(L.lis(1, 2), 3, L.lis(L.lis(1, 2), 4))),
            L.lis(1, 2, 3, L.lis(1, 2), 4));
  assert.testiso(L.fla(L.arr(L.arr(1, 2), 3, L.arr(L.arr(1, 2), 4))),
            L.arr(1, 2, 3, L.arr(1, 2), 4));
  assert.testiso(L.fla(L.arr(L.lis(1, 2), 3, L.arr(L.lis(1, 2), 4))),
            L.arr(1, 2, 3, L.lis(1, 2), 4));
  assert.testiso(L.fla(L.lis(L.arr(1, 2), 3, L.lis(L.arr(1, 2), 4))),
            L.lis(1, 2, 3, L.arr(1, 2), 4));
  assert.testiso(L.fla(L.lis(L.lis(1, 2), 3, L.lis(L.lis(1, 2), 4)), 10),
            L.lis(1, 2, 10, 3, 10, L.lis(1, 2), 4));
  assert.testiso(L.fla(L.arr(L.arr(1, 2), 3, L.arr(L.arr(1, 2), 4)), 10),
            L.arr(1, 2, 10, 3, 10, L.arr(1, 2), 4));
  assert.testiso(L.fla(L.arr(L.lis(1, 2), 3, L.arr(L.lis(1, 2), 4)), 10),
            L.arr(1, 2, 10, 3, 10, L.lis(1, 2), 4));
  assert.testiso(L.fla(L.lis(L.arr(1, 2), 3, L.lis(L.arr(1, 2), 4)), 10),
            L.lis(1, 2, 10, 3, 10, L.arr(1, 2), 4));
  assert.testiso(L.fla(L.lis()), L.nil());
  assert.testiso(L.fla(L.arr()), L.arr());
  assert.testiso(L.fla(L.lis(), 35), L.nil());
  assert.testiso(L.fla(L.arr(), 35), L.arr());
  
  assert.same(L.nilp(L.app()), true);
  assert.same(L.iso(L.app2(L.lis(1, 2, 3, 4), L.lis(1, 2, 3, 4)), L.lis(1, 2, 3, 4, 1, 2, 3, 4)),
         true);
  assert.same(L.iso(L.app2(L.lis(1, 2, 3, 4), L.arr(1, 2, 3, 4)), L.lis(1, 2, 3, 4, 1, 2, 3, 4)),
         true);
  assert.same(L.iso(L.app2(L.arr(1, 2, 3, 4), L.lis(1, 2, 3, 4)), L.arr(1, 2, 3, 4, 1, 2, 3, 4)),
         true);
  assert.same(L.iso(L.app2(L.arr(1, 2, 3, 4), L.arr(1, 2, 3, 4)), L.arr(1, 2, 3, 4, 1, 2, 3, 4)),
         true);
  assert.testiso(L.app2(L.nil(), L.lis(1)), L.lis(1));
  assert.testiso(L.app2(L.nil(), L.arr(1)), L.lis(1));
  assert.testiso(L.app2(L.nil(), L.nil()), L.nil());
  assert.testiso(L.app2(L.arr(), L.nil()), L.arr());
  assert.testiso(L.app2(L.lis(), L.nil()), L.nil());
  assert.same(L.typ(L.app(L.st("test"), L.sy("hey"), L.nu("0"))), "str");
  assert.same(L.dat(L.app(L.st("test"), L.sy("hey"), L.nu("0"))), "testhey0");
  assert.same(L.typ(L.app(L.sy("test"), L.st("hey"), L.nu("0"))), "sym");
  assert.same(L.dat(L.app(L.sy("test"), L.sy("hey"), L.nu("0"))), "testhey0");
  //assert.same(L.typ(L.app(L.nu("53"), L.st("hey"), L.sy("0"))), "num");
  //assert.same(L.dat(L.app(L.nu("53"), L.st("hey"), L.sy("0"))), "5300");
  assert.same(L.typ(L.app(L.ob({a: 3, b: 4}), L.ob({b: 5, c: 6}))), "obj");
  assert.same(L.dat(L.app(L.ob({a: 3, b: 4}), L.ob({b: 5, c: 6}))),
         {a: 3, b: 5, c: 6}, $.iso);
});

QUnit.test('Reduce', function (assert){
  //// Reduce ////
  
  assert.same(L.iso(L.fold(L.jn(L.cons), L.lis(1, 2, 3, 4)), L.cons(L.cons(L.cons(1, 2), 3), 4)),
         true);
  assert.same(L.iso(L.fold(L.jn(L.cons), L.nil(), L.lis(1, 2, 3, 4)), L.cons(L.cons(L.cons(L.cons(L.nil(), 1), 2), 3), 4)),
         true);
  assert.same(L.iso(L.fold(L.jn(function (l, a){return L.cons(a, l);}), L.lis(1, 2, 3, 4)), L.cons(4, L.cons(3, L.cons(2, 1)))), 
         true);
  assert.same(L.iso(L.fold(L.jn(function (l, a){return L.cons(a, l);}), L.nil(), L.lis(1, 2, 3, 4)), L.lis(4, 3, 2, 1)),
         true);
  assert.same(L.fold(L.jn(function (l, a){return l + a;}), 0, L.arr(1, 2, 3, 4)),
         10);
  assert.same(L.fold(L.jn(function (l, a){return Math.pow(l, a);}), 2, L.arr(1, 2, 3, 4)),
         16777216);
  assert.same(L.nilp(L.fold(L.jn(L.cons), L.nil())), true);
  assert.same(L.nilp(L.fold(L.jn(L.cons), L.nil(), L.nil())), true);
  
  
  assert.same(L.iso(L.foldi(L.jn(function (l, a, i){
    return L.cons(L.lis(i, a), l);
  }), L.nil(), L.lis(1, 2, 3, 4)), L.lis(L.lis(L.nu("3"), 4), L.lis(L.nu("2"), 3), L.lis(L.nu("1"), 2), L.lis(L.nu("0"), 1))),
         true);
  assert.same(L.iso(L.foldi(L.jn(function (l, a, i){
    return L.cons(L.lis(i, a), l);
  }), L.nil(), L.arr(1, 2, 3, 4)), L.lis(L.lis(L.nu("3"), 4), L.lis(L.nu("2"), 3), L.lis(L.nu("1"), 2), L.lis(L.nu("0"), 1))),
         true);
  assert.same(L.nilp(L.foldi(L.jn(L.cons), L.nil())), true);
  assert.same(L.nilp(L.foldi(L.jn(L.cons), L.nil(), L.nil())), true);
  assert.same(L.iso(L.foldr(L.jn(L.cons), L.nil(), L.lis(1, 2, 3, 4)), L.lis(1, 2, 3, 4)),
         true);
  assert.same(L.foldr(L.jn(Math.pow), 1, L.arr(4, 2, 3)),
         65536);
  assert.same(L.nilp(L.foldr(L.jn(L.cons), L.nil())), true);
  assert.same(L.nilp(L.foldr(L.jn(L.cons), L.nil(), L.nil())), true);
  assert.same(L.iso(L.foldri(L.jn(function (a, l, i){
    return L.cons(L.lis(i, a), l);
  }), L.nil(), L.lis(1, 2, 3, 4)), L.lis(L.lis(L.nu("0"), 1), L.lis(L.nu("1"), 2), L.lis(L.nu("2"), 3), L.lis(L.nu("3"), 4))),
         true);
  assert.same(L.iso(L.foldri(L.jn(function (a, l, i){
    return L.cons(L.lis(i, a), l);
  }), L.nil(), L.arr(1, 2, 3, 4)), L.lis(L.lis(L.nu("0"), 1), L.lis(L.nu("1"), 2), L.lis(L.nu("2"), 3), L.lis(L.nu("3"), 4))),
         true);
  assert.same(L.nilp(L.foldri(L.jn(L.cons), L.nil())), true);
  assert.same(L.nilp(L.foldri(L.jn(L.cons), L.nil(), L.nil())), true);
});

QUnit.test('Array', function (assert){
  //// Array ////
  
  assert.testiso(L.head(L.lis(1, 2, 3), 10), L.lis(10, 1, 2, 3));
  assert.testiso(L.head(L.arr(1, 2, 3), 10), L.arr(10, 1, 2, 3));
  assert.testiso(L.head(L.lis(), 10), L.lis(10));
  assert.testiso(L.head(L.arr(), 10), L.arr(10));
  assert.testiso(L.tail(L.lis(1, 2, 3), 10), L.lis(1, 2, 3, 10));
  assert.testiso(L.tail(L.arr(1, 2, 3), 10), L.arr(1, 2, 3, 10));
  assert.testiso(L.tail(L.lis(), 10), L.lis(10));
  assert.testiso(L.tail(L.arr(), 10), L.arr(10));
});

QUnit.test('Other', function (assert){
  //// Other ////
  
  assert.same(L.beg(L.lis(1, 2, 3), 1), true);
  assert.same(L.beg(L.lis(1, 2, 3), 2), false);
  assert.same(L.beg(L.lis(1, 2, 3), 2, 1), true);
  assert.same(L.beg(L.lis(1, 2, 3), 2, 3), false);
  assert.same(L.beg(L.arr(1, 2, 3), 1), true);
  assert.same(L.beg(L.arr(1, 2, 3), 2), false);
  assert.same(L.beg(L.arr(1, 2, 3), 2, 1), true);
  assert.same(L.beg(L.arr(1, 2, 3), 2, 3), false);
  assert.same(L.beg(L.sy("123"), L.sy("1")), true);
  assert.same(L.beg(L.sy("123"), L.st("2")), false);
  assert.same(L.beg(L.sy("123"), L.sy("2"), L.nu("1")), true);
  assert.same(L.beg(L.sy("123"), L.st("2"), L.sy("3")), false);
  assert.same(L.beg(L.nil(), 1), false);
  assert.same(L.beg(L.nil(), L.nil()), false);
  assert.same(L.beg(L.nil(), 1, L.nil(), L.sy("nil")), false);
});

QUnit.test('Imperative Each', function (assert){
  //// Imperative ////
  
  //// Each ////
  
  var a = L.lis(1, 2, 3); var n = 0;
  L.each(a, L.jn(function (a){n += a;}));
  assert.same(n, 6);
  var a = L.arr(1, 2, 3); var n = 0;
  L.each(a, L.jn(function (a){n += a;}));
  assert.same(n, 6);
  var a = L.ob({a: 1, b: 2, c: 3}); var n = 0;
  L.each(a, L.jn(function (a){n += a;}));
  assert.same(n, 6);
});

QUnit.test('Imp Array', function (assert){
  //// Array ////
  
  var a = L.nil();
  assert.same(L.psh(4, a) === a, true);
  assert.same(L.iso(a, L.lis(4)), true);
  var a = L.lis(1, 2, 3);
  assert.same(L.psh(4, a) === a, true);
  assert.same(L.iso(a, L.lis(4, 1, 2, 3)), true);
  var a = L.arr(1, 2, 3);
  assert.same(L.psh(4, a) === a, true);
  assert.same(L.iso(a, L.arr(1, 2, 3, 4)), true);
  
  var a = L.lis(1, 2, 3);
  assert.same(L.pop(a), 1);
  assert.same(L.iso(a, L.lis(2, 3)), true);
  var a = L.arr(1, 2, 3); 
  assert.same(L.pop(a), 3);
  assert.same(L.iso(a, L.arr(1, 2)), true);
});

QUnit.test('List', function (assert){
  //// List ////
  
  assert.same(L.cxr("a")(L.lis(1, 2)), 1);
  assert.same(L.cxr("ad")(L.lis(1, 2)), 2);
  assert.same(L.cxr("adddd")(L.lis(1, 2, 3, 4, 5)), 5);
  assert.same(L.cxr("a", L.lis(1, 2)), 1);
  assert.same(L.cxr("adddd", L.lis(1, 2, 3, 4, 5)), 5);
  
  assert.same(L.nth(L.nu("0"), L.lis(1, 2, 3)), 1);
  assert.same(L.nth(L.nu("2"), L.lis(1, 2, 3)), 3);
  assert.same(L.nilp(L.nth(L.nu("10"), L.lis(1, 2, 3))), true);
  assert.same(L.nilp(L.nth(L.nu("-1"), L.lis(1, 2, 3))), true);
  assert.same(L.nilp(L.nth(L.nu("1.5"), L.lis(1, 2, 3))), true);
  
  var a = L.lis(1, 2, 3);
  assert.same(L.ncdr(L.nu("0"), a) === a, true);
  var a = L.cons(1, 2); var b = L.cons(10, L.cons(3, a));
  assert.same(L.ncdr(L.nu("2"), b) === a, true);
  assert.same(L.nilp(L.ncdr(L.nu("10"), L.lis(1, 2, 3))), true);
  
  assert.same(L.iso(L.nrev(L.lis(1, 2, 3, 4)), L.lis(4, 3, 2, 1)), true);
  var a = L.lis(1, 2, 3, 4); var b = L.lis(1, 2, 3, 4);
  L.nrev(a);
  assert.same(L.iso(a, b), false);
  assert.same(L.nilp(L.nrev(L.nil())), true);
  
});

QUnit.test('Number', function (assert){
  //// Number ////
  
  assert.same(L.odd(L.nu("153")), true);
  assert.same(L.odd(L.nu("0")), false);
  
  assert.same(L.typ(L.add()), "num");
  assert.teststr(L.dat(L.add()), "0");
  assert.same(L.typ(L.add(L.nu("1"))), "num");
  assert.teststr(L.dat(L.add(L.nu("1"))), "1");
  assert.same(L.typ(L.add(L.nu("1"), L.nu("2"), L.nu("3"))), "num");
  assert.teststr(L.dat(L.add(L.nu("1"), L.nu("2"), L.nu("3"))), "6");
  
  assert.same(L.typ(L.add1(L.nu("0"))), "num");
  assert.teststr(L.dat(L.add1(L.nu("0"))), "1");
  
  assert.same(L.typ(L.sub()), "num");
  assert.teststr(L.dat(L.sub()), "0");
  assert.same(L.typ(L.sub(L.nu("1"))), "num");
  assert.teststr(L.dat(L.sub(L.nu("1"))), "-1");
  assert.same(L.typ(L.sub(L.nu("1"), L.nu("2"), L.nu("3"))), "num");
  assert.teststr(L.dat(L.sub(L.nu("1"), L.nu("2"), L.nu("3"))), "-4");
  
  assert.same(L.typ(L.sub1(L.nu("0"))), "num");
  assert.teststr(L.dat(L.sub1(L.nu("0"))), "-1");
  
  assert.same(L.typ(L.mul()), "num");
  assert.teststr(L.dat(L.mul()), "1");
  assert.same(L.typ(L.mul(L.nu("2"))), "num");
  assert.teststr(L.dat(L.mul(L.nu("2"))), "2");
  assert.same(L.typ(L.mul(L.nu("2"), L.nu("3"), L.nu("4"))), "num");
  assert.teststr(L.dat(L.mul(L.nu("2"), L.nu("3"), L.nu("4"))), "24");
  
  assert.same(L.typ(L.div()), "num");
  assert.teststr(L.dat(L.div()), "1");
  assert.same(L.typ(L.div(L.nu("2"))), "num");
  assert.teststr(L.dat(L.div(L.nu("2"))), "0.5");
  assert.same(L.typ(L.div(L.nu("2"), L.nu("4"), L.nu("5"))), "num");
  assert.teststr(L.dat(L.div(L.nu("2"), L.nu("4"), L.nu("5"))), "0.1");
  
  
  assert.same(L.lt(), true);
  assert.same(L.lt(L.nu("1")), true);
  assert.same(L.lt(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("4")), true);
  assert.same(L.lt(L.nu("4"), L.nu("3"), L.nu("2"), L.nu("1")), false);
  assert.same(L.lt(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("3")), false);
  assert.same(L.lt(L.nu("3"), L.nu("2"), L.nu("1"), L.nu("1")), false);
  assert.same(L.lt(L.nu("3"), L.nu("3"), L.nu("3"), L.nu("3")), false);
  assert.same(L.lt(L.nu("-1"), L.nu("-2"), L.nu("-3"), L.nu("-4")), false);
  assert.same(L.lt(L.nu("-4"), L.nu("-3"), L.nu("-2"), L.nu("-1")), true);
  assert.same(L.lt(L.nu("0.1"), L.nu("0.2"), L.nu("0.3"), L.nu("0.4")), true);
  assert.same(L.lt(L.nu("0.4"), L.nu("0.3"), L.nu("0.2"), L.nu("0.1")), false);
  assert.same(L.lt(L.nu("-0.1"), L.nu("-0.2"), L.nu("-0.3"), L.nu("-0.4")), false);
  assert.same(L.lt(L.nu("-0.4"), L.nu("-0.3"), L.nu("-0.2"), L.nu("-0.1")), true);
  
  assert.same(L.gt(), true);
  assert.same(L.gt(L.nu("1")), true);
  assert.same(L.gt(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("4")), false);
  assert.same(L.gt(L.nu("4"), L.nu("3"), L.nu("2"), L.nu("1")), true);
  assert.same(L.gt(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("3")), false);
  assert.same(L.gt(L.nu("3"), L.nu("2"), L.nu("1"), L.nu("1")), false);
  assert.same(L.gt(L.nu("3"), L.nu("3"), L.nu("3"), L.nu("3")), false);
  assert.same(L.gt(L.nu("-1"), L.nu("-2"), L.nu("-3"), L.nu("-4")), true);
  assert.same(L.gt(L.nu("-4"), L.nu("-3"), L.nu("-2"), L.nu("-1")), false);
  assert.same(L.gt(L.nu("0.1"), L.nu("0.2"), L.nu("0.3"), L.nu("0.4")), false);
  assert.same(L.gt(L.nu("0.4"), L.nu("0.3"), L.nu("0.2"), L.nu("0.1")), true);
  assert.same(L.gt(L.nu("-0.1"), L.nu("-0.2"), L.nu("-0.3"), L.nu("-0.4")), true);
  assert.same(L.gt(L.nu("-0.4"), L.nu("-0.3"), L.nu("-0.2"), L.nu("-0.1")), false);
  
  assert.same(L.le(), true);
  assert.same(L.le(L.nu("1")), true);
  assert.same(L.le(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("4")), true);
  assert.same(L.le(L.nu("4"), L.nu("3"), L.nu("2"), L.nu("1")), false);
  assert.same(L.le(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("3")), true);
  assert.same(L.le(L.nu("3"), L.nu("2"), L.nu("1"), L.nu("1")), false);
  assert.same(L.le(L.nu("3"), L.nu("3"), L.nu("3"), L.nu("3")), true);
  assert.same(L.le(L.nu("-1"), L.nu("-2"), L.nu("-3"), L.nu("-4")), false);
  assert.same(L.le(L.nu("-4"), L.nu("-3"), L.nu("-2"), L.nu("-1")), true);
  assert.same(L.le(L.nu("0.1"), L.nu("0.2"), L.nu("0.3"), L.nu("0.4")), true);
  assert.same(L.le(L.nu("0.4"), L.nu("0.3"), L.nu("0.2"), L.nu("0.1")), false);
  assert.same(L.le(L.nu("-0.1"), L.nu("-0.2"), L.nu("-0.3"), L.nu("-0.4")), false);
  assert.same(L.le(L.nu("-0.4"), L.nu("-0.3"), L.nu("-0.2"), L.nu("-0.1")), true);
  
  assert.same(L.ge(), true);
  assert.same(L.ge(L.nu("1")), true);
  assert.same(L.ge(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("4")), false);
  assert.same(L.ge(L.nu("4"), L.nu("3"), L.nu("2"), L.nu("1")), true);
  assert.same(L.ge(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("3")), false);
  assert.same(L.ge(L.nu("3"), L.nu("2"), L.nu("1"), L.nu("1")), true);
  assert.same(L.ge(L.nu("3"), L.nu("3"), L.nu("3"), L.nu("3")), true);
  assert.same(L.ge(L.nu("-1"), L.nu("-2"), L.nu("-3"), L.nu("-4")), true);
  assert.same(L.ge(L.nu("-4"), L.nu("-3"), L.nu("-2"), L.nu("-1")), false);
  assert.same(L.ge(L.nu("0.1"), L.nu("0.2"), L.nu("0.3"), L.nu("0.4")), false);
  assert.same(L.ge(L.nu("0.4"), L.nu("0.3"), L.nu("0.2"), L.nu("0.1")), true);
  assert.same(L.ge(L.nu("-0.1"), L.nu("-0.2"), L.nu("-0.3"), L.nu("-0.4")), true);
  assert.same(L.ge(L.nu("-0.4"), L.nu("-0.3"), L.nu("-0.2"), L.nu("-0.1")), false);
  
  assert.same(L.typ(L.rnd(L.nu("1.2353"), L.nu("3"))), "num");
  assert.teststr(L.dat(L.rnd(L.nu("1.2355"), L.nu("3"))), "1.236");
  
});

QUnit.test('String', function (assert){
  //// String ////
  
  assert.same(L.typ(L.low(L.st("TeSt"))), "str");
  assert.same(L.dat(L.low(L.st("TeSt"))), "test");
  assert.same(L.typ(L.low(L.sy("TeSt"))), "sym");
  assert.same(L.dat(L.low(L.sy("TeSt"))), "test");
  
  assert.same(L.typ(L.upp(L.st("TeSt"))), "str");
  assert.same(L.dat(L.upp(L.st("TeSt"))), "TEST");
  assert.same(L.typ(L.upp(L.sy("TeSt"))), "sym");
  assert.same(L.dat(L.upp(L.sy("TeSt"))), "TEST");
  
  assert.same(L.typ(L.stf(L.st("test"))), "str");
  assert.same(L.dat(L.stf(L.st("test"))), "test");
  assert.same(L.typ(L.stf(L.sy("test"))), "str");
  assert.same(L.dat(L.stf(L.sy("test"))), "test");
  assert.same(L.typ(L.stf(L.st("test $1 $2 $3"), L.nu("34"), L.sy("t"), L.st("hey"))), "str");
  assert.same(L.dat(L.stf(L.st("test $1 $2 $3"), L.nu("34"), L.sy("t"), L.st("hey"))), "test 34 t \"hey\"");
  assert.same(L.typ(L.stf(L.sy("test $1 $2 $3"), L.nu("34"), L.sy("t"), L.st("hey"))), "str");
  assert.same(L.dat(L.stf(L.sy("test $1 $2 $3"), L.nu("34"), L.sy("t"), L.st("hey"))), "test 34 t \"hey\"");
  
});

QUnit.test('Object', function (assert){
  //// Object ////
  
  assert.same(L.ohas({a: 3}, L.sy("a")), true);
  assert.same(L.ohas({a: 3}, L.sy("b")), false);
  var a = {a: 3};
  L.oput(a, L.sy("a"), 65);
  assert.same(L.oref(a, L.sy("a")), 65);
  /*assert.testdef(L.orem);
  assert.testdef(L.oref);
  assert.testdef(L.oset);
  assert.testdef(L.osetp);
  assert.testdef(L.odel);
  assert.testdef(L.oren);
  assert.testdef(L.owith);*/
});

QUnit.test('Checkers', function (assert){
  //// Checkers ////
  
  assert.same(L.nilp(L.chku(undefined)), true);
  assert.same(L.nilp(L.chku(L.nil())), true);
  assert.same(L.typ(L.chku(L.st("undefined"))), "str");
  assert.same(L.dat(L.chku(L.st("undefined"))), "undefined");
  
  // everything except false is t
  assert.same(L.nilp(L.chkb(false)), true);
  assert.same(L.nilp(L.chkb(true)), false);
  assert.same(L.nilp(L.chkb(0)), false);
  //assert.same(L.nilp(L.chkb(null)), false);
  //assert.same(L.nilp(L.chkb(undefined)), false);
  
  // should be same as above
  assert.same(L.nilp(L.chrb(function (a){return a;})(false)), true);
  assert.same(L.nilp(L.chrb(function (a){return a;})(true)), false);
  assert.same(L.nilp(L.chrb(function (a){return a;})(0)), false);
  //assert.same(L.nilp(L.chrb(function (a){return a;})(null)), false);
  //assert.same(L.nilp(L.chrb(function (a){return a;})(undefined)), false);
  
  assert.same(L.bchk(L.nil()), false);
  assert.same(L.bchk(L.sy("t")), true);
  assert.same(L.bchk(L.nu("0")), true);
  assert.same(L.bchk(L.st("nil")), true);
  assert.same(L.bchk(L.cons(1, 2)), true);
  
  assert.same(L.bchr(function (a){return a;})(L.nil()), false);
  assert.same(L.bchr(function (a){return a;})(L.sy("t")), true);
  assert.same(L.bchr(function (a){return a;})(L.nu("0")), true);
  assert.same(L.bchr(function (a){return a;})(L.st("nil")), true);
  assert.same(L.bchr(function (a){return a;})(L.cons(1, 2)), true);
});

/*QUnit.test('Error', function (assert){
  //// Error ////
  
  //assert.testerr(L.err(L.car, "Testing $1", L.lis(L.nu("1"), L.nu("2"))), "Error: <jn car(a)>: Testing (1 2)");
});*/

QUnit.test('Other', function (assert){
  //// Other ////
  
  assert.same(L.dol(1, 2, 3, 4, 5), 5);
  assert.same(L.nilp(L.dol()), true);
  assert.same(L.dol(1), 1);
  
  assert.same(L.do1(1, 2, 3, 4, 5), 1);
  assert.same(L.nilp(L.do1()), true);
  assert.same(L.do1(1), 1);
  
  /*assert.testdef(L.gs);
  assert.testdef(L.gsn);*/
});
