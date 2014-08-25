;;;; Precise Math Library Devel ;;;;

(witb (win window udf)
  ;;; Import ;;;
  
  (imp $ nump strp inp al err)
  
  (var inf Infinity)
  
  ;;; Macros ;;;
  
  (inl num (a) (Number a))
  (inl str (a) (String a))
  
  (inl len (a) (. a length))
  (inl pos (x a (o n)) (.indexOf a x n))
  
  (inl has (x a) (isn (pos x a) -1))
  (inl hsn (x a) (is (pos x a) -1))
  (inl har (x a) (.test x a))
  (inl sli (a n (o m)) (.substring a n m))
  
  (inl fst (a) #(a 0))
  (inl las (a) #(a (- (len a) 1)))
    
  (inl udfp (a) (is a udf))
  (inl nulp (a) (is a null))
  
  #|(las a)
  (sli a 1)
  (pos "test" a)|#
  
  ;;; Default precision ;;;
  
  (var pc 16)
  
  (def prec (p)
    (if (udfp p) pc
        (= pc p)))
  
  ;;; Js number constants ;;;
  
  ; Javascript largest integer: 2^53 = 9007199254740992
  ; Javascript largest float ≈ 1.79769313486231580793728e+308
  ; shortened to 1.7976931348623157e+308
  
  ;;; Real number functions ;;;
  
  ;; Validators ;;
  
  (def vldp (a)
    (and (strp a) (har #"^(\+|-)?[0-9]+(\.[0-9]+)?$" a)))
  
  ;; Predicates ;;
  
  (dfm posp (a)
    (isn (fst a) "-"))
  
  (dfm negp (a)
    (is (fst a) "-"))
  
  (dfm intp (a)
    (hsn "." a))
  
  (dfm decp (a)
    (has "." a))
        
  (def evnp (a)
    (if (decp a) false
        (let n (las a)
          (in n "0" "2" "4" "6" "8"))))
  
  (def oddp (a)
    (if (decp a) false
        (let n (las a)
          (in n "1" "3" "5" "7" "9"))))
  
  (def d5p (a)
    (if (decp a) false
        (let n (las a)
          (in n "0" "5"))))
  
  (var x (oddp "5"))
  
  ;; Converters ;;
  
  (def real (a)
    (if (vldp a) a
        (nump a) (str a)
        false))
  
  (def rint (a)
    (if (vldp a)
          (if (intp a) a false)
        (and (nump a) (intp (str a)))
          (str a)
        false))
  
  ;; Processing functions ;;
  
  (inl pd (a) (pos "." a))
  
  (def pdot (a)
    (var dot (pd a))
    (if (is dot -1) (len a) dot))
  
  (def rdot (a)
    (var dot (pd a))
    (if (is dot -1) a
        (+ (sli a 0 dot) (sli a (+ dot 1)))))
  
  (def lint (a)
    (if (negp a) (- (pdot a) 1) (pdot a)))
  
  (def ldec (a)
    (var dot (pd a))
    (if (is dot -1) 0 (- (len a) 1 dot)))
  
  (def lbth (a)
    (var dot (pd a))
    (if (is dot -1) [0 a]
        [dot (- (len a) 1 dot)]))
  
  #|function decrem(a){
    var dot = pos(".", a);
    if (dot == -1)return [0, a];
    return [len(a)-1-dot, triml(sli(a, 0, dot) + sli(a, dot+1))];
  }|#
  
  (def sint (a)
    (var dot (pd a))
    (if (is dot -1) a
        (sli a 0 dot)))
  
  (def sdec (a)
    (var dot (pd a))
    (if (is dot -1) ""
        (sli a (+ dot 1))))
  
  (dfm sign (a)
    (if (negp a) "-" ""))
  
  (dfm abs (a)
    (if (negp a) (sli a 1) a))
  
  (dfm abn (a) (sli a 1))
  
  (def xsgn (a b)
    (if (negp a)
          (if (posp b) ["-" (abn a) b]
              ["" (abn a) (abn b)])
        (negp b) ["-" a (abn b)]
        ["" a b]))
  
  ;(var x (xsgn a))
  
  (def neg (a)
    (if (is a "0") a
        (negp a) (abn a)
        (+ "-" a)))
  
  (def nneg (a)
    (if (is a "0") a
        (+ "-" a)))
  
  (def trim (a)
    (var s (negp a))
    (do (if s (= a (abn a)))
        (= a (triml (if (intp a) a (trimr a))))
        (if s (nneg a) a)))
  
  (dej triml (a)
    (ind i a
      (if (isn #(a i) "0")
        (if (is #(a i) ".") (ret (sli a (- i 1)))
            (isn i 0) (ret (sli a i))
            (ret a))))
    (ret "0"))
  
  (dej trimr (a)
    (inr i a
      (if (isn #(a i) "0")
        (if (is #(a i) ".") (ret (sli a 0 i))
            (isn i (- (len a) 1)) (ret (sli a 0 (+ i 1)))
            (ret a))))
    (ret "0"))
  
  (dej pad (a b)
    (var alen (len a))
    (var blen (len b))
    (var adot (pd a))
    (var bdot (pd b))
    
    (if (is adot -1)
          (if (is bdot -1)
            (do (rep (- alen blen) (&= "0" b))
                (rep (- blen alen) (&= "0" a))
                (ret [a b]))
            (do (+= a ".0")
                (= adot alen)
                (+= alen 2)))
        (is bdot -1)
          (do (+= b ".0")
              (= bdot blen)
              (+= blen 2)))
    
    (rep (- (- alen adot) (- blen bdot)) (+= b "0"))
    (rep (- (- blen bdot) (- alen adot)) (+= a "0"))
    
    (rep (- adot bdot) (&= "0" b))
    (rep (- bdot adot) (&= "0" a))
    
    (ret [a b]))
  
  
  
)
