<!DOCTYPE html>
<html>

<head>
  <title>Test Page</title>
  <meta charset="UTF-8">
  <script src="/codes/libjs/tools/3.x-devel/tools.js"></script>
  <script src="/codes/libjs/prec-math/devel2/prec-math.js"></script>
  <script src="/codes/libjs/lisp-tools/1.x-devel/lisp-tools.js"></script>
  <script src="/codes/libjs/lisp-parse/devel/lisp-parse.js"></script>
  <script src="/codes/libjs/lisp-exec/devel2/lisp-exec.js"></script>
  <script src="/codes/libjs/ajax/4.x-devel/ajax.js"></script>
  <script src="/codes/libjs/lisp-core/devel/lisp-core.js"></script>
  <script src="/codes/libjs/lisp-compile/devel2/lisp-compile.js"></script>
  <script src="/codes/libjs/lisp-cmp-core/devel/lisp-cmp-core.js"></script>
</head>

<body>
<script type="text/javascript">
/*for (var i = 65; i <= 90; i++){
  document.write("addVariable2(\"" + String.fromCharCode(i) + "\", \"" + String.fromCharCode(i) + "\", test2);<br>");
}
for (var i = 97; i <= 122; i++){
  document.write("addVariable2(\"" + String.fromCharCode(i) + "\", \"" + String.fromCharCode(i) + "\", test2);<br>");
}*/
/*function test(a){
  alert(a);
}
var x = {};
x[test] = 5;
test = 3;
alert(x);*/


/*function a(n){
  if (n == 0)return 1;
  return n*a(n-1);
}

var b = function (n){
  if (n == 0)return 1;
  return n*b(n-1);
}

$.alert("a: " + a(10));
$.alert("b: " + b(10));

var c = a;
var d = b;
a = null;
b = null;

$.alert("c: " + c(10));
$.alert("d: " + d(10));*/

//$.al($.beg("  abcaaa", /\s/));

//$.al($.beg(["&arr", []], "&arr"));

/*function a(){
  (new RegExp("test")).test("test");
}

function b(){
  (new RegExp("test", "g")).test("test");
}

$.speed(a, b, 1000000);*/

//$.al(Lisp.cmp(Lisp.prs($.get("test.lisp"))));

//$.al($.vals({a: "test", 0: 343, 6.234: "hey"}));

/*function Mammal(name){
  this.name = name;
}

Mammal.prototype.toString = function(){
  return "[Mammal '" + this.name + "']";
}

function Cat(name){
  Cat.__proto__.call(this, name);
}

Cat.__proto__ = Mammal;
Cat.prototype.__proto__ = Mammal.prototype;
Cat.prototype.toString = function(){
  return "[Cat '" + this.name + "']";
}

var bob = new Mammal('Bob');
var kitty = new Cat('Felix');

alert(bob.toString());
alert(kitty.toString());*/

/*function Employee (){
  this.name = "";
  this.dept = "general";
}

function Manager () {
  this.reports = [];
}
Manager.prototype = new Employee;

function WorkerBee () {
  this.projects = [];
}
WorkerBee.prototype = new Employee;

function SalesPerson () {
   this.dept = "sales";
   this.quota = 100;
}
SalesPerson.prototype = new WorkerBee;

function Engineer () {
   this.dept = "engineering";
   this.machine = "";
}
Engineer.prototype = new WorkerBee;

var jim = new Employee;
var sally = new Manager;
var mark = new WorkerBee;
var fred = new SalesPerson;
var jane = new Engineer;

$.al(jane);*/

/*

function Employee(name, dept){
  if (!udefp(name))this.name = name;
  if (!udefp(dept))this.dept = dept;
}
Employee.prototype.name = "";
Employee.prototype.dept = "general";

function Manager(name, dept, reports){
  this.constructor.__proto__.call(name, dept);
  if (!udefp(reports))this.reports = reports;
}
Manager.__proto__ = Employee;
Manager.prototype.__proto__ = Employee.prototype;
Manager.prototype.reports = [];

*/

/*var udefp = $.udefp;
var al = $.al;

function Employee(name, dept){
  this.name = udefp(name)?"":name;
  this.dept = udefp(dept)?"general":dept;
}

Employee.prototype.act = function (){
  alert("I'm an employee!");
}

function Manager(name, dept, reports){
  this.__proto__.__proto__.constructor.call(this, name, dept);
  this.reports = udefp(reports)?[]:reports;
}
Manager.prototype.__proto__ = Employee.prototype;*/

/*function WorkerBee(){}
WorkerBee.prototype.__proto__ = Employee.prototype;
WorkerBee.prototype.projects = [];

function SalesPerson(){}
SalesPerson.prototype.__proto__ = WorkerBee.prototype;
SalesPerson.prototype.dept = "sales";
SalesPerson.prototype.quota = 100;

function Engineer(){}
Engineer.prototype.__proto__ = WorkerBee.prototype;
Engineer.prototype.dept = "engineering";
Engineer.prototype.machine = "";*/

/*var jim = new Employee("Jim", "marketing");
var sally = new Manager("Sally", "marketing", ["test"]);

sally.act();

$.al(sally);*/

//$.al(L.lis("1", "2", "3", "4", "5"));
//$.al(L.disp(L.tagarr(["ewf", 'gee', "ewf"])));
//$.al(L.iso(L.arr(L.arr(1, 3, 4, 5), 2, 3, 4, 5), L.arr(L.arr(1, 3, 4, 5), 2, 3, 4, 5)));

//$.al(new Date());

$.al(L.cmp(L.prs($.get("prec-math.lisp"))));

</script>
</body>

</html>
