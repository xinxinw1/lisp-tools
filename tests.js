QUnit.assert.type = function (a, t, cfn){
  this.same(L.typ(a), t, cfn);
}

QUnit.assert.data = function (a, d, cfn){
  this.same(L.dat(a), d, cfn);
}

QUnit.assert.typdat = function (a, t, d){
  this.type(a, t);
  this.data(a, d);
}

QUnit.test("Type", function (assert){
  var a;
  
  assert.typdat(L.sym("test"), "sym", "test");
  
  a = L.mkdat("test", "hey");
  L.sdat(a, "what");
  assert.typdat(a, "test", "what");
  
  a = L.mk("test", {a: 3, b: 4, type: "hey"});
  assert.type(a, "test");
  assert.same(L.rep(a, "a"), 3);
  
  L.tag(a, "type", "hey");
  assert.type(a, "hey");
  
  L.det(a, "type");
  assert.type(a, udf);
  assert.false(L.tagp(a));
  
  a = L.num("253");
  assert.type(a, "num");
  assert.true(R.realp(L.dat(a)));
  assert.same(R.tostr(L.dat(a)), "253");
  
  a = L.nil();
  assert.type(a, "nil");
  assert.type(L.car(a), "nil");
  assert.type(L.cdr(a), "nil");
  
  
  a = L.cons(1, 2);
  assert.type(a, "lis");
  assert.same(L.car(a), 1);
  assert.same(L.cdr(a), 2);
  
  a = L.cons(1, 2);
  L.scar(a, 3);
  assert.same(L.car(a), 3);
  assert.same(L.cdr(a), 2);
  
  a = L.cons(1, 2);
  L.scdr(a, 3);
  assert.same(L.car(a), 1);
  assert.same(L.cdr(a), 3);
  
  a = L.lis(1, 2, 3);
  assert.type(a, "lis");
  assert.same(L.car(a), 1);
  assert.same(L.cadr(a), 2);
  assert.same(L.car(L.cddr(a)), 3);
  assert.type(L.cdr(L.cddr(a)), "nil");
  
  a = L.lis();
  assert.type(a, "nil");
  
  a = L.lisd(1, 2);
  assert.type(a, "lis");
  assert.same(L.car(a), 1);
  assert.same(L.cdr(a), 2);
  
  a = L.lisd(1, 2, 3);
  assert.type(a, "lis");
  assert.same(L.car(a), 1);
  assert.same(L.cadr(a), 2);
  assert.same(L.cddr(a), 3);
  
  a = L.arr(1, 2, 3);
  assert.type(a, "arr");
  
});


QUnit.test("Predicates", function (assert){
  var a;
  
  assert.samewpre(L.udfp, [
    udf, true,
    1, false,
    0, false,
    null, false
  ]);
  
  assert.samewpre(L.tagp, [
    L.sym("test"), true,
    null, false,
    true, false,
    false, false,
    udf, false,
    1, false,
    0, false,
    L.nil(), true,
    "test", false,
    function (){}, false
  ]);
  
  a = L.nil();
  assert.true(L.nilp(a));
  assert.false(L.lisp(a));
  assert.false(L.symp(a));
  assert.false(L.nump(a));
  assert.false(L.arrp(a));
  assert.false(L.objp(a));
  assert.false(L.strp(a));
  assert.true(L.listp(a));
  
  a = L.str("nil");
  assert.true(L.strp(a));
  assert.false(L.symp(a));
  assert.false(L.nump(a));
  assert.true(L.synp(a));
  assert.false(L.listp(a));
  
  a = L.sym("nil");
  assert.false(L.strp(a));
  assert.true(L.symp(a));
  assert.false(L.nump(a));
  assert.true(L.synp(a));
  assert.false(L.listp(a));
  
  a = L.num("353");
  assert.false(L.strp(a));
  assert.false(L.symp(a));
  assert.true(L.nump(a));
  assert.false(L.synp(a));
  assert.false(L.listp(a));
  
  a = L.lis(1, 2);
  assert.true(L.lisp(a));
  assert.false(L.nilp(a));
  assert.false(L.arrp(a));
  assert.false(L.objp(a));
  assert.true(L.listp(a));
  
  a = L.arr(1, 2, 3);
  assert.false(L.lisp(a));
  assert.false(L.nilp(a));
  assert.true(L.arrp(a));
  assert.false(L.objp(a));
  assert.false(L.listp(a));
  
  a = L.obj({a: 3, b: 4});
  assert.false(L.lisp(a));
  assert.false(L.nilp(a));
  assert.false(L.arrp(a));
  assert.true(L.objp(a));
  
  assert.true(L.rgxp(L.rgx(/test/g)));
  assert.false(L.rgxp(/test/g));
  
  assert.false(L.jnp(function (){}));
  assert.true(L.jnp(L.jn(function (){})));
  
});

QUnit.assert.is = function (act, exp){
  this.same(act, exp, L.is);
}

QUnit.assert.allis = function (arr){
  this.allsame(arr, L.is);
}

QUnit.assert.isn = function (act, notexp){
  this.diff(act, notexp, L.isn);
}

QUnit.assert.allisn = function (arr){
  this.alldiff(arr, L.isn);
}

QUnit.assert.iso = function (act, exp){
  this.same(act, exp, L.iso);
}

QUnit.assert.niso = function (act, notexp){
  this.diff(act, notexp, $.negf(L.iso));
}

QUnit.test("Comparison", function (assert){
  var a;
  
  assert.allis([
    L.nil(), L.nil(),
    L.str("15"), L.str("15"),
    L.sym("15"), L.sym("15"),
    L.rgx(/test/g), L.rgx(/test/g)
  ]);
  
  assert.allisn([
    L.nil(), L.str("1"),
    L.num("15"), L.num("16"),
    L.num("15"), L.str("15"),
    L.str("15"), L.sym("15"),
    L.str("15"), L.str("16"),
    L.sym("15"), L.sym("16"),
    L.rgx(/test1/g), L.rgx(/test/g),
    L.rgx(/test/), L.rgx(/test/g),
    L.cons(1, 2), L.cons(1, 2),
    L.arr(1, 2), L.arr(1, 2),
    L.obj({a: 3, b: 4}), L.obj({a: 3, b: 4})
  ]);
  
  a = L.cons(1, 2);
  assert.is(a, a);
  
  assert.iso(L.cons(1, 2), L.cons(1, 2));
  assert.niso(L.cons(1, 2), L.cons(1, 3));
  assert.iso(L.nil(), L.nil());
  assert.iso(L.arr(1, 2), L.arr(1, 2));
  assert.niso(L.arr(1, 2), L.arr(1, 3));
  assert.iso(L.lis(1, 2, 3), L.lis(1, 2, 3));
  assert.iso(
    L.lis(L.arr(1, 2, 3), L.obj({a: 3, b: 4}), L.lis(2, 3, 4)), 
    L.lis(L.arr(1, 2, 3), L.obj({a: 3, b: 4}), L.lis(2, 3, 4))
  );
  assert.niso(
    L.lis(L.arr(1, 2, 3), L.obj({a: 3, b: 4}), L.lis(2, 3, 4)), 
    L.lis(L.arr(1, 2, 3), L.obj({a: 3, b: 5}), L.lis(2, 3, 4))
  );
  
  assert.false(L.inp(L.num("345"), L.num("34"), L.sym("test"), L.rgx(/test/g), L.str("hey")));
  assert.true(L.inp(L.num("345"), L.num("34"), L.sym("test"), L.rgx(/test/g), L.num("345")));
  
});

QUnit.test("Stack", function (assert){
  assert.expect(10);
  
  var a = L.nil();
  
  assert.same(L.sta(a, 1, function (){
    assert.iso(a, L.lis(1));
    return 234;
  }), 234);
  assert.type(a, "nil");
  
  assert.same(L.sta(a, 1, function (){
    assert.iso(a, L.lis(1));
    return L.sta(a, 2, function (){
      assert.iso(a, L.lis(2, 1));
      return 563;
    });
  }), 563);
  assert.type(a, "nil");
  
  try {
    L.sta(a, 1, function (){
      assert.iso(a, L.lis(1));
      L.sta(a, 2, function (){
        assert.iso(a, L.lis(2, 1));
        throw new Error("hey");
      });
    });
  } catch (e){
    assert.type(a, "nil");
  }
  
});

QUnit.test("Dsj", function (assert){
  assert.samewpre(L.dsj, [
    L.num("2353"), "2353",
    L.sym("test"), "test",
    L.sym("te st"), "|te st|",
    L.str("test"), "\"test\"",
    L.str("tes\\\"t"), "\"tes\\\\\\\"t\"",
    L.lis(L.num("1"), L.num("2"), L.num("3")), "(1 2 3)",
    L.cons(L.num("1"), L.num("2")), "(1 . 2)",
    L.lisd(L.num("1"), L.num("2"), L.num("3")), "(1 2 . 3)",
    L.lis(L.sym("qt"), L.sym("test")), "'test",
    L.lis(L.sym("uqs"), L.sym("test")), ",@test",
    L.arr(L.num("1"), L.num("2"), L.num("3")), "#[1 2 3]",
    L.obj({a: L.num("1"), b: L.num("2")}), "{a 1 b 2}",
    L.rgx(/test\\\//g), "#\"test\\\\\\\/\"",
    L.rgx(/test"\\\//g), "#\"test\\\"\\\\\\\/\"",
    L.jn(L.atmp), "<jn atmp(a)>",
    L.mkdat("test", L.num("2")), "<test {data 2}>",
    "test", "<js \"test\">",
    L.lis(L.arr(L.obj({a: L.lis(L.num("1")), b: L.arr(L.str("32"))}))),
      "(#[{a (1) b #[\"32\"]}])"
  ]);
});

QUnit.test("Dsj Recursive", function (assert){
  var a, b;
  
  a = L.lis(L.num("1"));
  L.scdr(a, a);
  assert.same(L.dsj(a), "(1 . (...))");
  
  a = L.lis(L.num("1"), L.num("2"));
  L.scdr(L.cdr(a), a);
  assert.same(L.dsj(a), "(1 2 . (...))");
  
  a = L.lis(L.num("2"));
  b = L.cons(L.num("1"), a);
  L.scdr(a, a);
  assert.same(L.dsj(b), "(1 2 . (...))");
  
  a = L.lis(L.num("1"));
  L.scar(a, a);
  assert.same(L.dsj(a), "((...))");
  
  a = L.lis(L.arr(L.obj({a: L.nil(), b: L.arr(L.str("32"))})));
  L.dat(L.dat(L.car(a))[0]).a = a;
  assert.same(L.dsj(a), "(#[{a (...) b #[\"32\"]}])");
  
  b = L.arr(L.str("32"));
  a = L.lis(L.arr(L.obj({a: b, b: b})));
  assert.same(L.dsj(a), "(#[{a #[\"32\"] b #[\"32\"]}])");
  
  b = L.arr(L.obj({a: L.nil(), b: L.arr(L.str("32"))}));
  a = L.lis(b);
  L.dat(L.dat(L.car(a))[0]).a = b;
  assert.same(L.dsj(a), "(#[{a #[...] b #[\"32\"]}])");
});

QUnit.test("Output", function (assert){
  assert.expect(8);
  var d;
  
  d = 0;
  var old = L.gofn();
  var nfn = function (a){d = a;};
  L.wout(
    nfn,
    function (){
      assert.same(L.gofn(), nfn);
      L.ou("test");
    }
  );
  assert.same(d, "test");
  assert.same(L.gofn(), old);
  
  d = 0;
  var nfn = function (a){d = a;};
  try {
    L.wout(
      nfn,
      function (){
        assert.same(L.gofn(), nfn);
        throw new Error("test");
      }
    );
  } catch (e){}
  assert.same(d, 0);
  assert.same(L.gofn(), old);
  
  d = 0;
  L.wout(
    function (a){d = a;},
    function (){L.out(L.str("test"));}
  );
  assert.is(d, L.str("test\n"));
  assert.same(L.gofn(), old);
});

/*


//// Output ////

test('var d = 0; L.ofn(function (a){d = a;}); L.ou("test"); d',
       "test");
test('var d = 0; L.ofn(function (a){d = a;}); L.out(L.str("test")); L.typ(d)',
       "str");
test('var d = 0; L.ofn(function (a){d = a;}); L.out(L.str("test")); L.dat(d)',
       "test\n");
test('var d = 0; L.ofn(function (a){d = a;}); ' +
     'L.pr(L.str("test $1 $2 $3"), L.nu("23"), L.str("43"), L.nil()); L.typ(d)',
       "str");
test('var d = 0; L.ofn(function (a){d = a;}); ' +
     'L.pr(L.str("test $1 $2 $3"), L.nu("23"), L.str("43"), L.nil()); L.dat(d)',
       "test 23 \"43\" nil");
*/

QUnit.assert.t = function (a, m){
  this.push(L.is(a, L.sym("t")), L.dsj(a), "t", m);
}

QUnit.assert.nil = function (a, m){
  this.push(L.nilp(a), L.dsj(a), "nil", m);
}

QUnit.test("Converters", function (assert){
  assert.samewpre(L.tsym, [
    L.sym("test"), L.sym("test"),
    L.sym("nil"), L.sym("nil"),
    L.nil(), L.sym(""),
    L.num("235"), L.sym("235"),
    L.str("235"), L.sym("235"),
    L.lis(L.num("1"), L.num("2")), L.sym("(1 2)")
  ], L.is);
  
  assert.samewpre(L.tstr1, [
    L.sym("test"), L.str("test"),
    L.sym("nil"), L.str("nil"),
    L.nil(), L.str(""),
    L.num("235"), L.str("235"),
    L.str("235"), L.str("235"),
    L.str("nil"), L.str("nil"),
    L.lis(L.num("1"), L.num("2")), L.str("(1 2)")
  ], L.is);
  
  assert.samewpre(L.tnum, [
    L.sym("test"), L.num("0"),
    L.sym("nil"), L.num("0"),
    L.nil(), L.num("0"),
    L.num("235"), L.num("235"),
    L.str("445"), L.num("445"),
    L.str("2test"), L.num("0"),
    L.str("hey"), L.num("0"),
    L.str("-2"), L.num("-2"),
    L.str("-2.353"), L.num("-2.353"),
    L.sym("712"), L.num("712"),
    L.sym("-3"), L.num("-3"),
    L.sym("-3.353"), L.num("-3.353"),
    L.lis(L.num("1"), L.num("2")), L.num("0")
  ], L.is);
  
  assert.is(L.tstr(L.sym("test"), L.nil(), L.num("34")), L.str("test34"));
  
  assert.nil(L.dat(L.tfn(L.str("test")))(L.str("tes")));
  assert.t(L.dat(L.tfn(L.str("test")))(L.str("test")));
  assert.nil(L.dat(L.jn(function (a){return L.chkb(a > 3);}))(3));
  assert.t(L.dat(L.jn(function (a){return L.chkb(a > 3);}))(4));
  
  /*
  test('L.typ(L.tarr(L.lis(1, 2, 3)))', "arr");
  test('L.dat(L.tarr(L.lis(1, 2, 3)))', [1, 2, 3], $.iso);
  test('var a = L.arr(1, 2, 3); L.tarr(a) === a', true);
  test('var a = L.arr(L.str("t"), L.str("e"), L.str("s"), L.str("t")); ' +
       'L.iso(a, L.tarr(L.str("test")))',
       true);
  test('var a = L.arr(L.sym("t"), L.sym("e"), L.sym("s"), L.sym("t")); ' +
       'L.iso(a, L.tarr(L.sym("test")))',
       true);
  test('var a = L.arr(L.nu("5"), L.nu("3"), L.nu("7"), L.nu("3")); ' +
       'L.iso(a, L.tarr(L.nu("5373")))',
       true);
  // test for tarr(obj)
  
  test('L.iso(L.tlis(L.arr(1, 2, 3)), L.lis(1, 2, 3))', true);
  test('var a = L.lis(1, 2, 3); L.tlis(a) === a', true);
  test('var a = L.lis(L.str("t"), L.str("e"), L.str("s"), L.str("t")); ' +
       'L.iso(a, L.tlis(L.str("test")))',
       true);
  test('var a = L.lis(L.sym("t"), L.sym("e"), L.sym("s"), L.sym("t")); ' +
       'L.iso(a, L.tlis(L.sym("test")))',
       true);
  test('var a = L.lis(L.nu("5"), L.nu("3"), L.nu("7"), L.nu("3")); ' +
       'L.iso(a, L.tlis(L.nu("5373")))',
       true);
  // test for tlis(obj)
  
  // test tobj(lis) and tobj(arr)
  test('var a = L.obj({a: 3, b: 4}); L.tobj(a) === a', true);
  test('var a = L.obj({0: L.str("t"), 1: L.str("e"), 2: L.str("s"), 3: L.str("t")});' +
       'L.iso(a, L.tobj(L.str("test")))',
       true);
  test('var a = L.obj({0: L.sym("t"), 1: L.sym("e"), 2: L.sym("s"), 3: L.sym("t")});' +
       'L.iso(a, L.tobj(L.sym("test")))',
       true);
  test('var a = L.obj({0: L.nu("5"), 1: L.nu("3"), 2: L.nu("7"), 3: L.nu("3")});' +
       'L.iso(a, L.tobj(L.nu("5373")))',
       true);
  */
  
  // test prop and jstr
  
  assert.samewpre(L.jarr, [
    L.lis(1, 2, 3), [1, 2, 3],
    L.arr(1, 2, 3), [1, 2, 3],
    L.arr(), [],
    L.nil(), []
  ], $.iso);
  
  assert.samewpre(L.jnum, [
    L.num("34"), 34,
    L.str("34"), 34,
    L.lis(L.num("34")), 0
  ]);
  
  assert.samewpre(L.lnum, [
    34, L.num("34"),
    "34", L.num("34"),
    [34], L.num("0")
  ], L.is);
  
  /*
  test('L.jmat(L.sym("test"))', "test");
  test('L.jmat(L.sym("nil"))', "nil");
  test('L.jmat(L.nil())', "");
  test('L.jmat(L.nu("253"))', "253");
  test('var a = L.rgx(/test/g); L.jmat(a) === L.dat(a)', true);
  test('L.jmat(L.arr(L.str("1"), L.sym("test"), L.nu("76")))',
         ["1", "test", "76"], $.iso);
  test('L.jmat(L.lis(L.str("1"), L.sym("test"), L.nu("76")))',
         ["1", "test", "76"], $.iso);
  */
  
  assert.type(L.lbn(L.nilp), "jn");
  assert.t(L.dat(L.lbn(L.nilp))(L.nil()));
  assert.nil(L.dat(L.lbn(L.nilp))(L.sym("hey")));
  assert.nil(L.dat(L.lbn(L.nilp))(L.num("0")));
  
  var a;
  
  a = function (a){return a;};
  assert.same(L.tjn(L.jn(a)), a);
  // test tjn of other fn types
  
  // if given a js fn instead of a lisp fn,
  //   the output of L.jbn checks whether its arg is equal to the js fn
  assert.samewpre(L.jbn(L.nilp), [
    L.nil(), false,
    L.str("nil"), false,
    L.nilp, true
  ]);
  
  // everything is true if return of input function outputs
  //   a js bool instead of the required lisp bool
  assert.truewpre(L.jbn(L.jn(L.nilp)), [
    L.nil(),
    L.str("hey"),
    L.lis(1, 2, 3)
  ]);
  
  assert.samewpre(L.jbn(L.lbn(L.nilp)), [
    L.nil(), true,
    L.str("hey"), false,
    L.sym("hey"), false,
    L.lis(1, 2, 3), false,
    L.str("nil"), false
  ]);
  
  assert.samewpre(L.jbn(L.lbn(function (a){return a < 5;})), [
    3, true,
    5, false,
    10, false
  ]);

});

/*

//// Sequence ////

//// Items ////

test('L.ref1(L.arr(1, 2, 3), L.nu("0"))', 1);
test('L.ref1(L.lis(1, 2, 3), L.nu("0"))', 1);
test('L.typ(L.ref1(L.str("123"), L.nu("0")))', "str");
test('L.dat(L.ref1(L.str("123"), L.nu("0")))', "1");
test('L.ref1(L.arr(1, 2, 3), L.nu("2"))', 3);
test('L.ref1(L.lis(1, 2, 3), L.nu("2"))', 3);
test('L.typ(L.ref1(L.sym("123"), L.nu("2")))', "sym");
test('L.dat(L.ref1(L.sym("123"), L.nu("2")))', "3");
test('L.ref1(L.obj({a: 3, b: 4}), L.sym("a"))', 3);
test('L.ref1(L.obj({a: 3, b: 4}), L.str("b"))', 4);
test('L.ref1(L.obj({a: 3, b: 4, 4: 1}), L.nu("4"))', 1);
test('L.typ(L.ref1(L.nil(), L.nu("2")))', "nil");
test('L.ref1(L.obj({a: 3, b: 4}), L.str("b"))', 4);
test('L.ref1(L.obj({a: 3, b: 4, 4: 1}), L.nu("4"))', 1);
test('L.nilp(L.ref1(L.lis(1, 2, 3), L.nu("3")))', true);
test('L.nilp(L.ref1(L.arr(1, 2, 3), L.nu("3")))', true);
test('L.nilp(L.ref1(L.str("123"), L.nu("3")))', true);
test('L.nilp(L.ref1(L.obj({a: 3, b: 4}), L.str("c")))', true);

test('L.nilp(L.ref(L.lis(1, 2, 3), L.nu("-3")))', true);
test('L.nilp(L.ref(L.arr(1, 2, 3), L.nu("-3")))', true);
test('L.nilp(L.ref(L.str("123"), L.nu("-3")))', true);

test('L.ref(L.arr(L.arr(1, 2), L.arr(3, 4)), L.nu("0"), L.nu("1"))', 2);
test('L.typ(L.ref(L.arr(L.str("test"), L.arr(3, 4)), L.nu("0"), L.nu("1")))',
       "str");
test('L.dat(L.ref(L.arr(L.str("test"), L.arr(3, 4)), L.nu("0"), L.nu("1")))',
       "e");

test('var a = L.lis(1, 2, 3); L.set(a, L.nu("2"), 10); L.ref(a, L.nu("2"))',
       10);
test('var a = L.arr(1, 2, 3); L.set(a, L.nu("2"), 10); L.ref(a, L.nu("2"))',
       10);
test('var a = L.obj({a: 1, b: 2, c: 3});' +
     'L.set(a, L.sym("a"), 10); L.ref(a, L.str("a"))',
       10);

test('L.fst(L.lis(1, 2, 3))', 1);
test('L.las(L.lis(1, 2, 3))', 3);
test('L.typ(L.fst(L.str("testing")))', "str");
test('L.dat(L.fst(L.str("testing")))', "t");
test('L.typ(L.las(L.str("testing")))', "str");
test('L.dat(L.las(L.str("testing")))', "g");

//// Apply ////

// need tests for objects

test('L.iso(L.apl(L.jn(L.lis), L.arr(1, 2, 3)), L.lis(1, 2, 3))', true);
test('L.iso(L.apl(L.jn(L.arr), L.lis(1, 2, 3)), L.arr(1, 2, 3))', true);

test('L.iso(L.cal(L.jn(L.lis), 1, 2, 3), L.lis(1, 2, 3))', true);
test('L.iso(L.cal(L.jn(L.arr), 1, 2, 3), L.arr(1, 2, 3))', true);

test('L.iso(L.map(L.jn(function (a){return a+3;}), L.lis(1, 2, 3)),' + 
           'L.lis(4, 5, 6))',
       true);
test('L.dat(L.map(L.jn(function (a){return a+3;}), L.arr(1, 2, 3)))',
       [4, 5, 6], $.iso);
test('L.dat(L.map(L.jn(function (a){return a+3;}), L.obj({a: 1, b: 2})))',
       {a: 4, b: 5}, $.iso);


test('L.typ(L.pos(L.nu("1"), L.lis(L.nu("3"), L.nu("2"), L.nu("5"))))', "num");
test('L.dat(L.pos(L.nu("1"), L.lis(L.nu("3"), L.nu("2"), L.nu("5"))))', "-1");
test('L.typ(L.pos(L.nu("1"), L.lis(L.nu("3"), L.nu("2"), L.nu("1"))))', "num");
test('L.dat(L.pos(L.nu("1"), L.lis(L.nu("3"), L.nu("2"), L.nu("1"))))', "2");
test('L.typ(L.pos(L.nu("1"), L.lis(L.nu("1"), L.nu("2"), L.nu("3")), ' +
                 'L.nu("1")))',
       "num");
test('L.dat(L.pos(L.nu("1"), L.lis(L.nu("1"), L.nu("2"), L.nu("3")), ' +
                 'L.nu("1")))',
       "-1");
test('L.typ(L.pos(L.nu("1"), L.lis(L.nu("1"), L.nu("2"), L.nu("1")), ' +
                 'L.nu("1")))',
       "num");
test('L.dat(L.pos(L.nu("1"), L.lis(L.nu("1"), L.nu("2"), L.nu("1")), ' +
                 'L.nu("1")))',
       "2");

test('L.typ(L.pos(L.nu("1"), L.arr(L.nu("3"), L.nu("2"), L.nu("5"))))', "num");
test('L.dat(L.pos(L.nu("1"), L.arr(L.nu("3"), L.nu("2"), L.nu("5"))))', "-1");
test('L.typ(L.pos(L.nu("1"), L.arr(L.nu("3"), L.nu("2"), L.nu("1"))))', "num");
test('L.dat(L.pos(L.nu("1"), L.arr(L.nu("3"), L.nu("2"), L.nu("1"))))', "2");
test('L.typ(L.pos(L.nu("1"), L.arr(L.nu("1"), L.nu("2"), L.nu("3")), ' +
                 'L.nu("1")))',
       "num");
test('L.dat(L.pos(L.nu("1"), L.arr(L.nu("1"), L.nu("2"), L.nu("3")), ' +
                 'L.nu("1")))',
       "-1");
test('L.typ(L.pos(L.nu("1"), L.arr(L.nu("1"), L.nu("2"), L.nu("1")), ' +
                 'L.nu("1")))',
       "num");
test('L.dat(L.pos(L.nu("1"), L.arr(L.nu("1"), L.nu("2"), L.nu("1")), ' +
                 'L.nu("1")))',
       "2");

test('L.typ(L.pos(L.nu("1"), L.str("325")))', "num");
test('L.dat(L.pos(L.nu("1"), L.str("325")))', "-1");
test('L.typ(L.pos(L.nu("1"), L.str("321")))', "num");
test('L.dat(L.pos(L.nu("1"), L.str("321")))', "2");
test('L.typ(L.pos(L.nu("1"), L.str("123"), L.nu("1")))', "num");
test('L.dat(L.pos(L.nu("1"), L.str("123"), L.nu("1")))', "-1");
test('L.typ(L.pos(L.nu("1"), L.str("121"), L.nu("1")))', "num");
test('L.dat(L.pos(L.nu("1"), L.str("121"), L.nu("1")))', "2");

test('L.has(L.nu("1"), L.lis(L.nu("3"), L.nu("2"), L.nu("5")))', false);
test('L.has(L.nu("1"), L.lis(L.nu("3"), L.nu("2"), L.nu("1")))', false, $.isn);
test('L.has(L.nu("1"), L.lis(L.nu("1"), L.nu("2"), L.nu("3")))', false, $.isn);
test('L.has(L.nu("1"), L.lis(L.str("1"), L.nu("2"), L.sym("t")))', false);
test('L.has(L.nu("1"), L.lis(L.nu("1"), L.nu("1"), L.sym("t")))', false, $.isn);

test('L.has(L.nu("1"), L.arr(L.nu("3"), L.nu("2"), L.nu("5")))', false);
test('L.has(L.nu("1"), L.arr(L.nu("3"), L.nu("2"), L.nu("1")))', false, $.isn);
test('L.has(L.nu("1"), L.arr(L.nu("1"), L.nu("2"), L.nu("3")))', false, $.isn);
test('L.has(L.nu("1"), L.arr(L.str("1"), L.nu("2"), L.sym("t")))', false);
test('L.has(L.nu("1"), L.arr(L.nu("1"), L.nu("1"), L.sym("t")))', false, $.isn);

test('L.has(L.nu("1"), L.str("325"))', false);
test('L.has(L.nu("1"), L.str("321"))', false, $.isn);
test('L.has(L.nu("1"), L.str("123"))', false, $.isn);
test('L.has(L.nu("1"), L.str("12t"))', false, $.isn);
test('L.has(L.nu("1"), L.str("11t"))', false, $.isn);

test('L.has(L.nu("1"), L.nil())', false);
test('L.has(L.nil(), L.nil())', false);


test('L.iso(L.rem(1, L.lis(1, 2, 1, 1, 3, 5, -1, 10)), ' +
           'L.lis(2, 3, 5, -1, 10))',
       true);
test('L.iso(L.rem(1, L.arr(1, 2, 1, 1, 3, 5, -1, 10)), ' +
           'L.arr(2, 3, 5, -1, 10))',
       true);
test('L.typ(L.rem(L.nu("1"), L.str("121135110")))', "str");
test('L.dat(L.rem(L.nu("1"), L.str("121135110")))', "2350");
test('L.nilp(L.rem(L.nu("1"), L.nil()))', true);


test('L.iso(L.rpl(1, 10, L.lis(1, 2, 3, 1, 4, 5)), L.lis(10, 2, 3, 10, 4, 5))',
       true);
test('L.iso(L.rpl(1, 10, L.arr(1, 2, 3, 1, 4, 5)), L.arr(10, 2, 3, 10, 4, 5))',
       true);
test('L.typ(L.rpl(L.str("t"), L.nu("3"), L.str("test a b c e s t")))',
       "str");
test('L.dat(L.rpl(L.str("t"), L.nu("3"), L.str("test a b c e s t")))',
       "3es3 a b c e s 3");
test('L.typ(L.rpl(L.nu("4"), L.str("10"), L.sym("test 3 4 5 e 4 t")))',
       "sym");
test('L.typ(L.rpl(L.nu("4"), L.str("10"), L.nil()))', "nil");
test('L.iso(L.rpl(L.nu("4"), L.str("10"), ' +
                 'L.obj({a: L.nu("4"), ' +
                       'b: L.str("4"), ' +
                       'c: L.arr(L.nu("4"))})), ' +
           'L.obj({a: L.str("10"), ' +
                 'b: L.str("4"), ' +
                 'c: L.arr(L.nu("4"))}))', 
       true);
test('L.iso(L.rpl(L.lbn(function (a){return a < 5;}), 10, ' +
                 'L.lis(1, 2, 9, 3, 6, 1, 4, 5)), ' +
           'L.lis(10, 10, 9, 10, 6, 10, 10, 5))',
       true);


//// Whole ////

test('L.typ(L.len(L.lis(1, 2, 3)))', "num");
test('L.dat(L.len(L.lis(1, 2, 3)))', "3");
test('L.typ(L.len(L.arr(1, 2, 3)))', "num");
test('L.dat(L.len(L.arr(1, 2, 3)))', "3");
test('L.typ(L.len(L.str("12345")))', "num");
test('L.dat(L.len(L.str("12345")))', "5");
test('L.typ(L.len(L.obj({a: 3, b: 4})))', "num");
test('L.dat(L.len(L.obj({a: 3, b: 4})))', "2");
test('L.typ(L.len(L.nil()))', "num");
test('L.dat(L.len(L.nil()))', "0");

test('L.emp(L.lis())', true);
test('L.emp(L.lis(L.nil()))', false);
test('L.emp(L.arr())', true);
test('L.emp(L.arr(1))', false);
test('L.emp(L.str(""))', true);
test('L.emp(L.str("1"))', false);
test('L.emp(L.obj({}))', true);
test('L.emp(L.obj({a: 3}))', false);

test('L.iso(L.cpy(L.lis(1, 2, 3)), L.lis(1, 2, 3))', true);
test('L.iso(L.cpy(L.arr(1, 2, 3)), L.arr(1, 2, 3))', true);
test('L.iso(L.cpy(L.obj({a: 3, b: 4})), L.obj({a: 3, b: 4}))', true);
test('var a = L.lis(1, 2, 3); L.cpy(a) === a', false);
test('var a = L.arr(1, 2, 3); L.cpy(a) === a', false);
test('var a = L.obj({a: 3, b: 4}); L.cpy(a) === a', false);
test('var a = L.cons(1, 2); var b = L.cpy(a);' +
     'L.scar(b, 3); L.car(a)',
     1);
test('var a = L.arr(1, 2); var b = L.cpy(a);' +
     'L.set(b, L.nu("1"), 10); L.ref(a, L.nu("1"))',
     2);
test('var a = L.mkdat("test", "hey"); var b = L.cpy(a);' +
     'L.sdat(b, "what"); L.dat(a)',
     "hey");
test('var a = L.mkdat("test", "hey"); var b = L.cpy(a);' +
     'L.tag(b, "type", "obj"); L.typ(a)',
     "test");

test('L.iso(L.rev(L.lis(1, 2, 3)), L.lis(3, 2, 1))', true);
test('var a = L.lis(1, 2, 3); L.rev(a); L.iso(a, L.lis(1, 2, 3))', true);
test('L.typ(L.rev(L.arr(1, 2, 3)))', "arr");
test('L.dat(L.rev(L.arr(1, 2, 3)))', [3, 2, 1], $.iso);
test('L.typ(L.rev(L.arr()))', "arr");
test('L.dat(L.rev(L.arr()))', [], $.iso);
test('L.typ(L.rev(L.str("123")))', "str");
test('L.dat(L.rev(L.str("123")))', "321");
test('L.typ(L.rev(L.nu("123")))', "num");
test('L.dat(L.rev(L.nu("123")))', "321");
test('L.typ(L.rev(L.sym("hey")))', "sym");
test('L.dat(L.rev(L.sym("hey")))', "yeh");
test('L.typ(L.rev(L.nil()))', "nil");
test('L.typ(L.rev(L.str("")))', "str");
test('L.dat(L.rev(L.str("")))', "");
test('L.typ(L.rev(L.nu("")))', "num");
test('L.dat(L.rev(L.nu("")))', "");
test('L.typ(L.rev(L.sym("")))', "sym");
test('L.dat(L.rev(L.sym("")))', "");

test('L.iso(L.revlis(L.lis(1, 2, 3), L.lis(4, 5, 6)), L.lis(3, 2, 1, 4, 5, 6))',
       true);
test('L.iso(L.revlis(L.lis(1, 2, 3)), L.lis(3, 2, 1))', true);
test('L.iso(L.revlis(L.lis(1, 2, 3), L.str("hey")),' +
           'L.lisd(3, 2, 1, L.str("hey")))',
       true);

//// Parts ////

test('L.iso(L.sli(L.lis(1, 2, 3), L.nu("1")), ' +
           'L.lis(2, 3))',
       true);
test('L.iso(L.sli(L.lis(1, 2, 3, 4, 5), L.nu("1"), L.nu("3")), ' +
           'L.lis(2, 3))',
       true);
test('L.iso(L.sli(L.arr(1, 2, 3), L.nu("1")), ' +
           'L.arr(2, 3))',
       true);
test('L.iso(L.sli(L.arr(1, 2, 3, 4, 5), L.nu("1"), L.nu("3")), ' +
           'L.arr(2, 3))',
       true);
test('L.typ(L.sli(L.str("123"), L.nu("1")))', "str");
test('L.dat(L.sli(L.str("123"), L.nu("1")))', "23");
test('L.typ(L.sli(L.str("12345"), L.nu("1"), L.nu("3")))', "str");
test('L.dat(L.sli(L.str("12345"), L.nu("1"), L.nu("3")))', "23");
test('L.iso(L.sli(L.lis(1, 2, 3), L.nu("6")), ' +
           'L.lis())',
       true);
test('L.iso(L.sli(L.arr(1, 2, 3), L.nu("6")), ' +
           'L.arr())',
       true);
test('L.iso(L.sli(L.lis(1, 2, 3, 4, 5), L.nu("1"), L.nu("-3")), ' +
           'L.lis())',
       true);
test('L.iso(L.sli(L.arr(1, 2, 3, 4, 5), L.nu("1"), L.nu("-3")), ' +
           'L.arr())',
       true);
test('L.typ(L.sli(L.str("123"), L.nu("6")))', "str");
test('L.dat(L.sli(L.str("123"), L.nu("6")))', "");
test('L.typ(L.sli(L.str("12345"), L.nu("1"), L.nu("-3")))', "str");
test('L.dat(L.sli(L.str("12345"), L.nu("1"), L.nu("-3")))', "");

test('L.iso(L.fstn(L.nu("2"), L.lis(1, 2, 3, 4, 5)), L.lis(1, 2))', true);
test('L.iso(L.fstn(L.nu("2"), L.arr(1, 2, 3, 4, 5)), L.arr(1, 2))', true);
test('L.typ(L.fstn(L.nu("2"), L.str("12345")))', "str");
test('L.dat(L.fstn(L.nu("2"), L.str("12345")))', "12");
test('L.nilp(L.fstn(L.nu("2"), L.lis()))', true);
test('L.iso(L.fstn(L.nu("2"), L.arr()), L.arr())', true);
test('L.typ(L.fstn(L.nu("2"), L.str("")))', "str");
test('L.dat(L.fstn(L.nu("2"), L.str("")))', "");

// rstn

test('L.iso(L.rst(L.lis(1, 2, 3, 4, 5)), L.lis(2, 3, 4, 5))', true);
test('L.iso(L.rst(L.arr(1, 2, 3, 4, 5)), L.arr(2, 3, 4, 5))', true);
test('L.typ(L.rst(L.str("12345")))', "str");
test('L.dat(L.rst(L.str("12345")))', "2345");
test('L.nilp(L.rst(L.lis()))', true);
test('L.iso(L.rst(L.arr()), L.arr())', true);
test('L.typ(L.rst(L.str("")))', "str");
test('L.dat(L.rst(L.str("")))', "");

test('L.iso(L.mid(L.lis(1, 2, 3, 4, 5)), L.lis(2, 3, 4))', true);
test('L.iso(L.mid(L.arr(1, 2, 3, 4, 5)), L.arr(2, 3, 4))', true);
test('L.typ(L.mid(L.str("12345")))', "str");
test('L.dat(L.mid(L.str("12345")))', "234");
test('L.nilp(L.mid(L.lis()))', true);
test('L.iso(L.mid(L.arr()), L.arr())', true);
test('L.typ(L.mid(L.str("")))', "str");
test('L.dat(L.mid(L.str("")))', "");

//// Group ////

test('L.dsj(L.spl(L.str("testegest"), L.sym("t")))', "(\"\" \"es\" \"eges\" \"\")");
test('L.iso(L.spl(L.lis(1, 2, 3, 4, 1, 2, 5), ' +
                 'L.lbn(function (a){return a === 1;})), ' +
           'L.lis(L.nil(), L.lis(2, 3, 4), L.lis(2, 5)))',
        true);
test('L.iso(L.spl(L.arr(1, 2, 3, 4, 1, 2, 5), ' +
                 'L.lbn(function (a){return a === 1;})), ' +
           'L.arr(L.arr(), L.arr(2, 3, 4), L.arr(2, 5)))',
        true);
test('L.dsj(L.spl(L.sym("testegest"), L.str("t")))', "( es eges )");
test('L.dsj(L.spl(L.nu("1523634"), L.str("3")))', "(152 6 4)");
test('L.dsj(L.spl(L.nu("1523634")))', "(1 5 2 3 6 3 4)");
// test spl x = udf for cons and arr

function testiso(a, b){
  return test('L.iso(' + a + ', ' + b + ')', true);
}

testiso('L.grp(L.lis(1, 2, 3, 4, 5), L.nu("2"))',
          'L.lis(L.lis(1, 2), L.lis(3, 4), L.lis(5))');
testiso('L.grp(L.arr(1, 2, 3, 4, 5), L.nu("2"))',
          'L.arr(L.arr(1, 2), L.arr(3, 4), L.arr(5))');
testiso('L.grp(L.str("12345"), L.nu("2"))',
          'L.lis(L.str("12"), L.str("34"), L.str("5"))');
testiso('L.grp(L.lis(), L.nu("2"))', 'L.lis()');
testiso('L.grp(L.arr(), L.nu("2"))', 'L.arr()');
testiso('L.grp(L.str(""), L.nu("2"))', 'L.lis()');

//// Join ////

test('L.typ(L.joi(L.lis(L.nu("1"), L.str("3"), L.sym("t"), L.nil())))',
       "str");
test('L.dat(L.joi(L.lis(L.nu("1"), L.str("3"), L.sym("t"), L.nil())))',
       "13t");
test('L.typ(L.joi(L.lis(L.nu("1"), L.str("3"), L.sym("t"), L.nil()), ' +
                 'L.sym("hey")))',
       "str");
test('L.dat(L.joi(L.arr(L.nu("1"), L.str("3"), L.sym("t"), L.nil()), ' +
                 'L.sym("hey")))',
       "1hey3heythey");
test('L.typ(L.joi(L.arr(L.nu("1"), L.str("3"), L.sym("t"), L.nil())))',
       "str");
test('L.dat(L.joi(L.arr(L.nu("1"), L.str("3"), L.sym("t"), L.nil())))',
       "13t");
test('L.typ(L.joi(L.arr(L.nu("1"), L.str("3"), L.sym("t"), L.nil()), ' +
                 'L.sym("hey")))',
       "str");
test('L.dat(L.joi(L.arr(L.nu("1"), L.str("3"), L.sym("t"), L.nil()), ' +
                 'L.sym("hey")))',
       "1hey3heythey");

testiso('L.fla(L.lis(L.lis(1, 2), 3, L.lis(L.lis(1, 2), 4)))',
          'L.lis(1, 2, 3, L.lis(1, 2), 4)');
testiso('L.fla(L.arr(L.arr(1, 2), 3, L.arr(L.arr(1, 2), 4)))',
          'L.arr(1, 2, 3, L.arr(1, 2), 4)');
testiso('L.fla(L.arr(L.lis(1, 2), 3, L.arr(L.lis(1, 2), 4)))',
          'L.arr(1, 2, 3, L.lis(1, 2), 4)');
testiso('L.fla(L.lis(L.arr(1, 2), 3, L.lis(L.arr(1, 2), 4)))',
          'L.lis(1, 2, 3, L.arr(1, 2), 4)');
testiso('L.fla(L.lis(L.lis(1, 2), 3, L.lis(L.lis(1, 2), 4)), 10)',
          'L.lis(1, 2, 10, 3, 10, L.lis(1, 2), 4)');
testiso('L.fla(L.arr(L.arr(1, 2), 3, L.arr(L.arr(1, 2), 4)), 10)',
          'L.arr(1, 2, 10, 3, 10, L.arr(1, 2), 4)');
testiso('L.fla(L.arr(L.lis(1, 2), 3, L.arr(L.lis(1, 2), 4)), 10)',
          'L.arr(1, 2, 10, 3, 10, L.lis(1, 2), 4)');
testiso('L.fla(L.lis(L.arr(1, 2), 3, L.lis(L.arr(1, 2), 4)), 10)',
          'L.lis(1, 2, 10, 3, 10, L.arr(1, 2), 4)');
testiso('L.fla(L.lis())', 'L.nil()');
testiso('L.fla(L.arr())', 'L.arr()');
testiso('L.fla(L.lis(), 35)', 'L.nil()');
testiso('L.fla(L.arr(), 35)', 'L.arr()');

test('L.nilp(L.app())', true);
test('L.iso(L.app2(L.lis(1, 2, 3, 4), L.lis(1, 2, 3, 4)), ' +
           'L.lis(1, 2, 3, 4, 1, 2, 3, 4))',
       true);
test('L.iso(L.app2(L.lis(1, 2, 3, 4), L.arr(1, 2, 3, 4)), ' +
           'L.lis(1, 2, 3, 4, 1, 2, 3, 4))',
       true);
test('L.iso(L.app2(L.arr(1, 2, 3, 4), L.lis(1, 2, 3, 4)), ' +
           'L.arr(1, 2, 3, 4, 1, 2, 3, 4))',
       true);
test('L.iso(L.app2(L.arr(1, 2, 3, 4), L.arr(1, 2, 3, 4)), ' +
           'L.arr(1, 2, 3, 4, 1, 2, 3, 4))',
       true);
testiso('L.app2(L.nil(), L.lis(1))', 'L.lis(1)');
testiso('L.app2(L.nil(), L.arr(1))', 'L.lis(1)');
testiso('L.app2(L.nil(), L.nil())', 'L.nil()');
testiso('L.app2(L.arr(), L.nil())', 'L.arr()');
testiso('L.app2(L.lis(), L.nil())', 'L.nil()');
test('L.typ(L.app(L.str("test"), L.sym("hey"), L.nu("0")))', "str");
test('L.dat(L.app(L.str("test"), L.sym("hey"), L.nu("0")))', "testhey0");
test('L.typ(L.app(L.sym("test"), L.str("hey"), L.nu("0")))', "sym");
test('L.dat(L.app(L.sym("test"), L.sym("hey"), L.nu("0")))', "testhey0");
test('L.typ(L.app(L.nu("53"), L.str("hey"), L.sym("0")))', "num");
test('L.dat(L.app(L.nu("53"), L.str("hey"), L.sym("0")))', "5300");
test('L.typ(L.app(L.obj({a: 3, b: 4}), L.obj({b: 5, c: 6})))', "obj");
test('L.dat(L.app(L.obj({a: 3, b: 4}), L.obj({b: 5, c: 6})))',
       {a: 3, b: 5, c: 6}, $.iso);

//// Reduce ////

test('L.iso(L.fold(L.jn(L.cons), L.lis(1, 2, 3, 4)), ' +
           'L.cons(L.cons(L.cons(1, 2), 3), 4))',
       true);
test('L.iso(L.fold(L.jn(L.cons), L.nil(), L.lis(1, 2, 3, 4)), ' +
           'L.cons(L.cons(L.cons(L.cons(L.nil(), 1), 2), 3), 4))',
       true);
test('L.iso(L.fold(L.jn(function (l, a){return L.cons(a, l);}), ' +
                  'L.lis(1, 2, 3, 4)), ' +
           'L.cons(4, L.cons(3, L.cons(2, 1))))', 
       true);
test('L.iso(L.fold(L.jn(function (l, a){return L.cons(a, l);}), ' +
                  'L.nil(), L.lis(1, 2, 3, 4)), ' +
           'L.lis(4, 3, 2, 1))',
       true);
test('L.fold(L.jn(function (l, a){return l + a;}), ' +
            '0, L.arr(1, 2, 3, 4))',
       10);
test('L.fold(L.jn(function (l, a){return Math.pow(l, a);}), ' +
            '2, L.arr(1, 2, 3, 4))',
       16777216);
test('L.nilp(L.fold(L.jn(L.cons), L.nil()))', true);
test('L.nilp(L.fold(L.jn(L.cons), L.nil(), L.nil()))', true);


test('L.iso(L.foldi(L.jn(function (l, a, i){' +
                          'return L.cons(L.lis(i, a), l);' +
                        '}), ' +
                   'L.nil(), L.lis(1, 2, 3, 4)), ' +
           'L.lis(L.lis(L.nu("3"), 4), L.lis(L.nu("2"), 3), ' +
                 'L.lis(L.nu("1"), 2), L.lis(L.nu("0"), 1)))',
       true);
test('L.iso(L.foldi(L.jn(function (l, a, i){' +
                          'return L.cons(L.lis(i, a), l);' +
                        '}), ' +
                   'L.nil(), L.arr(1, 2, 3, 4)), ' +
           'L.lis(L.lis(L.nu("3"), 4), L.lis(L.nu("2"), 3), ' +
                 'L.lis(L.nu("1"), 2), L.lis(L.nu("0"), 1)))',
       true);
test('L.nilp(L.foldi(L.jn(L.cons), L.nil()))', true);
test('L.nilp(L.foldi(L.jn(L.cons), L.nil(), L.nil()))', true);
test('L.iso(L.foldr(L.jn(L.cons), L.nil(), L.lis(1, 2, 3, 4)), ' +
           'L.lis(1, 2, 3, 4))',
       true);
test('L.foldr(L.jn(Math.pow), 1, L.arr(4, 2, 3))',
       65536);
test('L.nilp(L.foldr(L.jn(L.cons), L.nil()))', true);
test('L.nilp(L.foldr(L.jn(L.cons), L.nil(), L.nil()))', true);
test('L.iso(L.foldri(L.jn(function (a, l, i){' +
                          'return L.cons(L.lis(i, a), l);' +
                        '}), ' +
                    'L.nil(), L.lis(1, 2, 3, 4)), ' +
           'L.lis(L.lis(L.nu("0"), 1), L.lis(L.nu("1"), 2), ' +
                 'L.lis(L.nu("2"), 3), L.lis(L.nu("3"), 4)))',
       true);
test('L.iso(L.foldri(L.jn(function (a, l, i){' +
                          'return L.cons(L.lis(i, a), l);' +
                        '}), ' +
                    'L.nil(), L.arr(1, 2, 3, 4)), ' +
           'L.lis(L.lis(L.nu("0"), 1), L.lis(L.nu("1"), 2), ' +
                 'L.lis(L.nu("2"), 3), L.lis(L.nu("3"), 4)))',
       true);
test('L.nilp(L.foldri(L.jn(L.cons), L.nil()))', true);
test('L.nilp(L.foldri(L.jn(L.cons), L.nil(), L.nil()))', true);

//// Array ////

testiso('L.head(L.lis(1, 2, 3), 10)', 'L.lis(10, 1, 2, 3)');
testiso('L.head(L.arr(1, 2, 3), 10)', 'L.arr(10, 1, 2, 3)');
testiso('L.head(L.lis(), 10)', 'L.lis(10)');
testiso('L.head(L.arr(), 10)', 'L.arr(10)');
testiso('L.tail(L.lis(1, 2, 3), 10)', 'L.lis(1, 2, 3, 10)');
testiso('L.tail(L.arr(1, 2, 3), 10)', 'L.arr(1, 2, 3, 10)');
testiso('L.tail(L.lis(), 10)', 'L.lis(10)');
testiso('L.tail(L.arr(), 10)', 'L.arr(10)');

//// Other ////

test('L.beg(L.lis(1, 2, 3), 1)', true);
test('L.beg(L.lis(1, 2, 3), 2)', false);
test('L.beg(L.lis(1, 2, 3), 2, 1)', true);
test('L.beg(L.lis(1, 2, 3), 2, 3)', false);
test('L.beg(L.arr(1, 2, 3), 1)', true);
test('L.beg(L.arr(1, 2, 3), 2)', false);
test('L.beg(L.arr(1, 2, 3), 2, 1)', true);
test('L.beg(L.arr(1, 2, 3), 2, 3)', false);
test('L.beg(L.sym("123"), L.sym("1"))', true);
test('L.beg(L.sym("123"), L.str("2"))', false);
test('L.beg(L.sym("123"), L.sym("2"), L.nu("1"))', true);
test('L.beg(L.sym("123"), L.str("2"), L.sym("3"))', false);
test('L.beg(L.nil(), 1)', false);
test('L.beg(L.nil(), L.nil())', false);
test('L.beg(L.nil(), 1, L.nil(), L.sym("nil"))', false);

//// Imperative ////

//// Each ////

test('var a = L.lis(1, 2, 3); var n = 0; L.each(a, L.jn(function (a){n += a;})); n', 6);
test('var a = L.arr(1, 2, 3); var n = 0; L.each(a, L.jn(function (a){n += a;})); n', 6);
test('var a = L.obj({a: 1, b: 2, c: 3}); var n = 0; L.each(a, L.jn(function (a){n += a;})); n', 6);

//// Array ////

test('var a = L.nil(); L.psh(4, a) === a', true);
test('var a = L.nil(); L.psh(4, a); L.iso(a, L.lis(4))', true);
test('var a = L.lis(1, 2, 3); L.psh(4, a) === a', true);
test('var a = L.lis(1, 2, 3); L.psh(4, a); L.iso(a, L.lis(4, 1, 2, 3))', true);
test('var a = L.arr(1, 2, 3); L.psh(4, a) === a', true);
test('var a = L.arr(1, 2, 3); L.psh(4, a); L.iso(a, L.arr(1, 2, 3, 4))', true);

test('var a = L.lis(1, 2, 3); L.pop(a)', 1);
test('var a = L.lis(1, 2, 3); L.pop(a); L.iso(a, L.lis(2, 3))', true);
test('var a = L.arr(1, 2, 3); L.pop(a)', 3);
test('var a = L.arr(1, 2, 3); L.pop(a); L.iso(a, L.arr(1, 2))', true);

//// List ////

test('L.cxr("a")(L.lis(1, 2))', 1);
test('L.cxr("ad")(L.lis(1, 2))', 2);
test('L.cxr("adddd")(L.lis(1, 2, 3, 4, 5))', 5);
test('L.cxr("a", L.lis(1, 2))', 1);
test('L.cxr("adddd", L.lis(1, 2, 3, 4, 5))', 5);

test('L.nth(L.nu("0"), L.lis(1, 2, 3))', 1);
test('L.nth(L.nu("2"), L.lis(1, 2, 3))', 3);
test('L.nilp(L.nth(L.nu("10"), L.lis(1, 2, 3)))', true);
test('L.nilp(L.nth(L.nu("-1"), L.lis(1, 2, 3)))', true);
test('L.nilp(L.nth(L.nu("1.5"), L.lis(1, 2, 3)))', true);

test('var a = L.lis(1, 2, 3); L.ncdr(L.nu("0"), a) === a', true);
test('var a = L.cons(1, 2); var b = L.cons(10, L.cons(3, a)); ' +
     'L.ncdr(L.nu("2"), b) === a', true);
test('L.nilp(L.ncdr(L.nu("10"), L.lis(1, 2, 3)))', true);

test('L.iso(L.nrev(L.lis(1, 2, 3, 4)), L.lis(4, 3, 2, 1))', true);
test('var a = L.lis(1, 2, 3, 4); var b = L.lis(1, 2, 3, 4); ' +
     'L.nrev(a); L.iso(a, b)', false);
test('L.nilp(L.nrev(L.nil()))', true);


//// Number ////

test('L.odd(L.nu("153"))', true);
test('L.odd(L.nu("0"))', false);

test('L.typ(L.add())', "num");
test('L.dat(L.add())', "0");
test('L.typ(L.add(L.nu("1")))', "num");
test('L.dat(L.add(L.nu("1")))', "1");
test('L.typ(L.add(L.nu("1"), L.nu("2"), L.nu("3")))', "num");
test('L.dat(L.add(L.nu("1"), L.nu("2"), L.nu("3")))', "6");

test('L.typ(L.add1(L.nu("0")))', "num");
test('L.dat(L.add1(L.nu("0")))', "1");

test('L.typ(L.sub())', "num");
test('L.dat(L.sub())', "0");
test('L.typ(L.sub(L.nu("1")))', "num");
test('L.dat(L.sub(L.nu("1")))', "-1");
test('L.typ(L.sub(L.nu("1"), L.nu("2"), L.nu("3")))', "num");
test('L.dat(L.sub(L.nu("1"), L.nu("2"), L.nu("3")))', "-4");

test('L.typ(L.sub1(L.nu("0")))', "num");
test('L.dat(L.sub1(L.nu("0")))', "-1");

test('L.typ(L.mul())', "num");
test('L.dat(L.mul())', "1");
test('L.typ(L.mul(L.nu("2")))', "num");
test('L.dat(L.mul(L.nu("2")))', "2");
test('L.typ(L.mul(L.nu("2"), L.nu("3"), L.nu("4")))', "num");
test('L.dat(L.mul(L.nu("2"), L.nu("3"), L.nu("4")))', "24");

test('L.typ(L.div())', "num");
test('L.dat(L.div())', "1");
test('L.typ(L.div(L.nu("2")))', "num");
test('L.dat(L.div(L.nu("2")))', "0.5");
test('L.typ(L.div(L.nu("2"), L.nu("4"), L.nu("5")))', "num");
test('L.dat(L.div(L.nu("2"), L.nu("4"), L.nu("5")))', "0.1");


test('L.lt()', true);
test('L.lt(L.nu("1"))', true);
test('L.lt(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("4"))', true);
test('L.lt(L.nu("4"), L.nu("3"), L.nu("2"), L.nu("1"))', false);
test('L.lt(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("3"))', false);
test('L.lt(L.nu("3"), L.nu("2"), L.nu("1"), L.nu("1"))', false);
test('L.lt(L.nu("3"), L.nu("3"), L.nu("3"), L.nu("3"))', false);
test('L.lt(L.nu("-1"), L.nu("-2"), L.nu("-3"), L.nu("-4"))', false);
test('L.lt(L.nu("-4"), L.nu("-3"), L.nu("-2"), L.nu("-1"))', true);
test('L.lt(L.nu("0.1"), L.nu("0.2"), L.nu("0.3"), L.nu("0.4"))', true);
test('L.lt(L.nu("0.4"), L.nu("0.3"), L.nu("0.2"), L.nu("0.1"))', false);
test('L.lt(L.nu("-0.1"), L.nu("-0.2"), L.nu("-0.3"), L.nu("-0.4"))', false);
test('L.lt(L.nu("-0.4"), L.nu("-0.3"), L.nu("-0.2"), L.nu("-0.1"))', true);

test('L.gt()', true);
test('L.gt(L.nu("1"))', true);
test('L.gt(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("4"))', false);
test('L.gt(L.nu("4"), L.nu("3"), L.nu("2"), L.nu("1"))', true);
test('L.gt(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("3"))', false);
test('L.gt(L.nu("3"), L.nu("2"), L.nu("1"), L.nu("1"))', false);
test('L.gt(L.nu("3"), L.nu("3"), L.nu("3"), L.nu("3"))', false);
test('L.gt(L.nu("-1"), L.nu("-2"), L.nu("-3"), L.nu("-4"))', true);
test('L.gt(L.nu("-4"), L.nu("-3"), L.nu("-2"), L.nu("-1"))', false);
test('L.gt(L.nu("0.1"), L.nu("0.2"), L.nu("0.3"), L.nu("0.4"))', false);
test('L.gt(L.nu("0.4"), L.nu("0.3"), L.nu("0.2"), L.nu("0.1"))', true);
test('L.gt(L.nu("-0.1"), L.nu("-0.2"), L.nu("-0.3"), L.nu("-0.4"))', true);
test('L.gt(L.nu("-0.4"), L.nu("-0.3"), L.nu("-0.2"), L.nu("-0.1"))', false);

test('L.le()', true);
test('L.le(L.nu("1"))', true);
test('L.le(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("4"))', true);
test('L.le(L.nu("4"), L.nu("3"), L.nu("2"), L.nu("1"))', false);
test('L.le(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("3"))', true);
test('L.le(L.nu("3"), L.nu("2"), L.nu("1"), L.nu("1"))', false);
test('L.le(L.nu("3"), L.nu("3"), L.nu("3"), L.nu("3"))', true);
test('L.le(L.nu("-1"), L.nu("-2"), L.nu("-3"), L.nu("-4"))', false);
test('L.le(L.nu("-4"), L.nu("-3"), L.nu("-2"), L.nu("-1"))', true);
test('L.le(L.nu("0.1"), L.nu("0.2"), L.nu("0.3"), L.nu("0.4"))', true);
test('L.le(L.nu("0.4"), L.nu("0.3"), L.nu("0.2"), L.nu("0.1"))', false);
test('L.le(L.nu("-0.1"), L.nu("-0.2"), L.nu("-0.3"), L.nu("-0.4"))', false);
test('L.le(L.nu("-0.4"), L.nu("-0.3"), L.nu("-0.2"), L.nu("-0.1"))', true);

test('L.ge()', true);
test('L.ge(L.nu("1"))', true);
test('L.ge(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("4"))', false);
test('L.ge(L.nu("4"), L.nu("3"), L.nu("2"), L.nu("1"))', true);
test('L.ge(L.nu("1"), L.nu("2"), L.nu("3"), L.nu("3"))', false);
test('L.ge(L.nu("3"), L.nu("2"), L.nu("1"), L.nu("1"))', true);
test('L.ge(L.nu("3"), L.nu("3"), L.nu("3"), L.nu("3"))', true);
test('L.ge(L.nu("-1"), L.nu("-2"), L.nu("-3"), L.nu("-4"))', true);
test('L.ge(L.nu("-4"), L.nu("-3"), L.nu("-2"), L.nu("-1"))', false);
test('L.ge(L.nu("0.1"), L.nu("0.2"), L.nu("0.3"), L.nu("0.4"))', false);
test('L.ge(L.nu("0.4"), L.nu("0.3"), L.nu("0.2"), L.nu("0.1"))', true);
test('L.ge(L.nu("-0.1"), L.nu("-0.2"), L.nu("-0.3"), L.nu("-0.4"))', true);
test('L.ge(L.nu("-0.4"), L.nu("-0.3"), L.nu("-0.2"), L.nu("-0.1"))', false);

test('L.typ(L.rnd(L.nu("1.2353"), L.nu("3")))', "num");
test('L.dat(L.rnd(L.nu("1.2355"), L.nu("3")))', "1.236");


//// String ////

test('L.typ(L.low(L.str("TeSt")))', "str");
test('L.dat(L.low(L.str("TeSt")))', "test");
test('L.typ(L.low(L.sym("TeSt")))', "sym");
test('L.dat(L.low(L.sym("TeSt")))', "test");

test('L.typ(L.upp(L.str("TeSt")))', "str");
test('L.dat(L.upp(L.str("TeSt")))', "TEST");
test('L.typ(L.upp(L.sym("TeSt")))', "sym");
test('L.dat(L.upp(L.sym("TeSt")))', "TEST");

test('L.typ(L.stf(L.str("test")))', "str");
test('L.dat(L.stf(L.str("test")))', "test");
test('L.typ(L.stf(L.sym("test")))', "str");
test('L.dat(L.stf(L.sym("test")))', "test");
test('L.typ(L.stf(L.str("test $1 $2 $3"), ' +
           'L.nu("34"), L.sym("t"), L.str("hey")))', "str");
test('L.dat(L.stf(L.str("test $1 $2 $3"), ' +
           'L.nu("34"), L.sym("t"), L.str("hey")))', "test 34 t \"hey\"");
test('L.typ(L.stf(L.sym("test $1 $2 $3"), ' +
           'L.nu("34"), L.sym("t"), L.str("hey")))', "str");
test('L.dat(L.stf(L.sym("test $1 $2 $3"), ' +
           'L.nu("34"), L.sym("t"), L.str("hey")))', "test 34 t \"hey\"");


//// Object ////

test('L.ohas({a: 3}, L.sym("a"))', true);
test('L.ohas({a: 3}, L.sym("b"))', false);
test('var a = {a: 3}; L.oput(a, L.sym("a"), 65); L.oref(a, L.sym("a"))', 65);*/
/*testdef('L.orem');
testdef('L.oref');
testdef('L.oset');
testdef('L.osetp');
testdef('L.odel');
testdef('L.oren');
testdef('L.owith');*/

//// Checkers ////

/*test('L.nilp(L.chku(undefined))', true);
test('L.nilp(L.chku(L.nil()))', true);
test('L.typ(L.chku(L.str("undefined")))', "str");
test('L.dat(L.chku(L.str("undefined")))', "undefined");

// everything except false is t
test('L.nilp(L.chkb(false))', true);
test('L.nilp(L.chkb(true))', false);
test('L.nilp(L.chkb(0))', false);
//test('L.nilp(L.chkb(null))', false);
//test('L.nilp(L.chkb(undefined))', false);

// should be same as above
test('L.nilp(L.chrb(function (a){return a;})(false))', true);
test('L.nilp(L.chrb(function (a){return a;})(true))', false);
test('L.nilp(L.chrb(function (a){return a;})(0))', false);
//test('L.nilp(L.chrb(function (a){return a;})(null))', false);
//test('L.nilp(L.chrb(function (a){return a;})(undefined))', false);

test('L.bchk(L.nil())', false);
test('L.bchk(L.sym("t"))', true);
test('L.bchk(L.nu("0"))', true);
test('L.bchk(L.str("nil"))', true);
test('L.bchk(L.cons(1, 2))', true);

test('L.bchr(function (a){return a;})(L.nil())', false);
test('L.bchr(function (a){return a;})(L.sym("t"))', true);
test('L.bchr(function (a){return a;})(L.nu("0"))', true);
test('L.bchr(function (a){return a;})(L.str("nil"))', true);
test('L.bchr(function (a){return a;})(L.cons(1, 2))', true);

//// Error ////

//testerr('L.err(L.car, "Testing $1", L.lis(L.nu("1"), L.nu("2")))', "Error: <jn car(a)>: Testing (1 2)");

//// Other ////

test('L.dol(1, 2, 3, 4, 5)', 5);
test('L.nilp(L.dol())', true);
test('L.dol(1)', 1);

test('L.do1(1, 2, 3, 4, 5)', 1);
test('L.nilp(L.do1())', true);
test('L.do1(1)', 1);*/

/*testdef('L.gs');
testdef('L.gsn');*/


