;;;; Tools Devel ;;;;

(with (win window udf)
   (var doc win.document)
   (var inf Infinity)
   
   ;;; Type ;;;
   
   (dfm cls (a)
     (Object.prototype.toString.call a))
   
   (def type (a)
     (var tp (cls a))
     (cas tp
       "[object Object]"    "obj"
       "[object String]"    "str"
       "[object Number]"    "num"
       "[object Array]"     "arr"
       "[object Arguments]" "args"
       "[object Function]"  "fn"
       "[object Undefined]" "udf"
       "[object Boolean]"   "bool"
       "[object RegExp]"    "rgx"
       "[object Null]"      "null"
                            tp))
   
   ;;; Predicates ;;;
   
   (dfm nump (a)
     (is (cls a) "[object Number]"))
   
   (dfm strp (a)
     (is (cls a) "[object String]"))
   
   (def arrp (a)
     (var c (cls a))
     (in c "[object Array]"
           "[object Arguments]"
           "[object HTMLCollection]"
           "[object NodeList]"
           "[object NamedNodeMap]"
           "[object MozNamedAttrMap]"))
   
   (def irrp (a)
     (var c (cls a))
     (in c "[object Arguments]"
           "[object HTMLCollection]"
           "[object NodeList]"
           "[object NamedNodeMap]"
           "[object MozNamedAttrMap]"))
   
   (dfm fnp (a)
     (is (cls a) "[object Function]"))
   
   (dfm objp (a)
     (is (cls a) "[object Object]"))
   
   (dfm rgxp (a)
     (is (cls a) "[object RegExp]"))
   
   (dfm udfp (a) (is a udf))
   (dfm nulp (a) (is a null))
   
   ;;; Comparison ;;;
   
   (def is (a b) (is a b))
   
   (def iso (a b)
     (if (is a b) true
         (and !(arrp a) !(arrp b)) false
         (isn (len a) (len b)) false
         (do (to i (len a)
               (if (isn (# a i) (# b i)) (ret false)))
             true)))
)
