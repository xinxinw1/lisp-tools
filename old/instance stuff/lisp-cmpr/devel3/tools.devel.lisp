;;;; Tools Devel ;;;;

(with (win window udf)
  (var doc win.document)
  (var inf Infinity)
  
  ;;; Type ;;;
  
  (def cls (a)
    (Object.prototype.toString.call a))
  
  (def type (a)
    (let tp (cls a)
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
  
  (def nump (a)
    (is (cls a) "[object Number]"))
  
  (def strp (a)
    (is (cls a) "[object String]"))
  
  (def arrp (a)
    (in (cls a)
      "[object Array]"
      "[object Arguments]"
      "[object HTMLCollection]"
      "[object NodeList]"
      "[object NamedNodeMap]"
      "[object MozNamedAttrMap]"))
  
  (def irrp (a)
    (in (cls a)
      "[object Arguments]"
      "[object HTMLCollection]"
      "[object NodeList]"
      "[object NamedNodeMap]"
      "[object MozNamedAttrMap]"))
  
  (def fnp (a)
    (is (cls a) "[object Function]"))
  
  (def objp (a)
    (is (cls a) "[object Object]"))
  
  (def rgxp (a)
    (is (cls a) "[object RegExp]"))
  
  (def udfp (a) (is a udf))
  (def nulp (a) (is a null))
  
  ;;; Comparison ;;;
  
  (def is (a b) (is a b))
  
  (mac rwith (nm vs . bd)
    (let g (grp vs 2)
      `((rfn ,nm ,(map car g) ,@bd) ,@(map cadr g))))
  
  (mac infloop a `(whi true ,@a))
  
  #|
  (tailrec iso (a a b b i 0)
    (if (is i l) true
        (isn #(a i) #(b i)) false
        (iso a b (+ i 1))))
  
  (with (a a b b i 0)
    (infloop
      (ret (if (is i l) true
               (isn #(a i) #(b i)) false
               (nrt (do (= a a)
                        (= b b)
                        (= i (+ i 1))))))))
  
  (mac tailrec (nm vs . bd)
    (let g (grp vs 2)
      `(mlet (,nm ,(map car g)
               `(nrt (do ,,@(map [qq (= ,_ ,(auq _))] (map car g)))))
         (with ,vs
           (infloop
             (ret ,@bd))))))
  
  (mlet (iso (a b i)
          `(nrt (do (= a ,a)
                    (= b ,b)
                    (= i ,i))))
    (with (a a b b i 0)
      (infloop
        (ret (if (is i l) true
                 (isn (# a i) (# b i)) false
                 (iso a b (+ i 1)))))))|#
  
  (def iso (a b)
    (if (is a b) true
        (and !(arrp a) !(arrp b)) false
        (let l (len a)
          (if (isn l (len b)) false
              (rwith iso (a a b b i 0)
                 (if (is i l) true
                     (isn #(a i) #(b i)) false
                     (iso a b (+ i 1))))))))
)
