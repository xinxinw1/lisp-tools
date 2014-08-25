/***** Lisp to JS Compiler Devel *****/

/* require tools >= 3.0 */
/* require lisp-parse */
/* require lisp-tools */
/* require lisp-exec */

var cmpsi = L.cmpsi;

var but = $("cmp");
var src = $("src");
var res = $("res");

but.onclick = function (){
  try {
    res.value = cmpsi(src.value);
  } catch (e){
    res.value = e;
  }
};

src.value = $.get("test.lisp");
