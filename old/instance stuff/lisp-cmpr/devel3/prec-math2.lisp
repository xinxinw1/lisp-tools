;;;; Precise Math Library Devel ;;;;

(witb (win window udf)
  ;;; Import ;;;
  
  ;;; Macros ;;;
  
  (mac butn (n a)
    `(sli ,a 0 (- (len ,a) ,n)))
  
  (mac lasn (n a)
    `(sli ,a (- (len ,a) ,n)))
  
  ;;; Basic operation functions ;;;
  
  (mac xsgn (sgn a b)
    `(do (var ,sgn "")
         (if (negp ,a)
               (do (zap abn ,a)
                   (if (negp ,b) (zap abn ,b)
                       (= ,sgn "-")))
             (negp ,b)
               (do (zap abn ,b) (= ,sgn "-")))))
  
  (dej add (a b p)
    (if (is p (- inf)) (ret "0"))
    
    (var sign "")
    (if (negp a)
          (if !(negp b) (ret (sub b (abn a) p))
               (do (= sign "-")
                   (zap abn a)
                   (zap abn b)))
        (negp b) (ret (sub a (abn b) p)))
    
    ;(= [a b] (pad a b))
    (var arr (pad a b))
    (= a #(arr 0)) (= b #(arr 1))
    
    (dec small)
    (var sum "")
    (var carry 0)
    (inr i a
      (when (is #(a i) ".")
        (&= "." sum)
        (cont)))
      (= small (+ (num #(a i)) (num #(b i)) carry))
      (if (>= small 10)
            (do (&= (- small 10) sum)
                (= carry 1))
          (do (&= small sum)
              (= carry 0))))
    
    (if (is carry 1) (&= "1" sum))
    (&= sign sum)
    (if (decp sum) (zap trimr sum))
    
    (ret (if (udfp p) sum (rnd sum p))))
  
  
  ; multiply two positive (non-zero) integes
  (def mulInt (a b)
    (if (and (<= (len a) 7) (<= (len b) 7))
          (str (* (num a) (num b)))
        (or (<= (len a) 200) (<= (len b) 200))
          (mulLong a b)
        (mulKarat a b)))
  
  ; long multiplication; for 8-200 digits
  (dej mulLong (a b)
    (if (> (len b) (len a)) (ret (mulLong b a)))
    
    (var prod "0")
    (dec curra currb curr small ln carry)
    (lop (var i (len b)) (> i 0) (-= i 7)
      (= currb (num (sli b (- i 7) i)))
      (if (is currb 0) (cont))
      (= curr "") (= carry 0)
      (rep (/ (- (len b) i) 7) (+= curr "0000000"))
      (lop (var j (len a)) (> j 0) (-= j 7)
        (= curra (num (sli a (- j 7) j)))
        (if (is curra 0)
              (if (isn carry 0) (= small (str carry))
                  (do (if (> (- j 7) 0) (&= "0000000" curr))
                      (cont)))
            (= small (str (+ (* currb curra) carry))))
        (= ln (len small))
        (if (> ln 7)
              (do (&= (sli small (- ln 7) ln) curr)
                  (= carry (num (sli small 0 (- ln 7)))))
            (do (&= small curr)
                (if (> (- j 7) 0) (rep (- 7 ln) (&= "0" curr)))
                (= carry 0))))
      (if (isn carry 0) (&= carry curr))
      (zap add prod curr))
     
    (ret prod))
  
  ; Karatsuba multiplication; for more than 200 digits
  ; http://en.wikipedia.org/wiki/Karatsuba_algorithm
  (def mulKarat (a b)
    (wit (lena (len a) lenb (len b))
      (if (> lenb lena) (mulKarat b a)
          ; Math.min(alen, blen) = blen
          (<= lenb 200) (mulLong a b)
          (isn lena lenb)
            #|
            a = a1*10^m + a0
            a*b = (a1*10^m + a0)*b
                = (a1*b)*10^m + a0*b
            |#
            (do (var m (if (> lena (* 2 lenb))
                             (Math.ceil (/ lena 2))
                           (- lena lenb)))
                (var a1 (butn m a))
                (var a0 (triml (lasn m a)))
                (add (right (mulKarat a1 b) m) (mulKarat a0 b)))
          
          #|
          a = a1*10^m + a0
          b = b1*10^m + b0
          
          a*b = (a1*10^m + a0)*(b1*10^m + b0)
              = (a1*b1)*10^(2*m) + (a1*b0 + a0*b1)*10^m + a0*b0
              = (a1*b1)*10^(2*m) + ((a1+a0)*(b1+b0) - a1*b1 - a0*b0)*10^m + a0*b0
              = z2*10^(2*m) + z1*10^m + z0
          |#
          (do (var m (Math.ceil (/ (len a) 2)))
            
              (var a1 (butn m a))
              (var a0 (triml (lasn m a)))
              (var b1 (butn m b))
              (var b0 (triml (lasn m b)))
              
              (var z2 (mulKarat a1 b1))
              (var z0 (mulKarat a0 b0))
              (var z1 (sub (sub (mulKarat (add a1 a0) (add b1 b0)) z2) z0))
              
              (add (add (right z2 (* 2 m)) (right z1 m)) z0)))))
  
  (mac psgn (sgn a)
    `(do (var ,sgn "")
         (if (negp ,a)
               (do (= ,sgn "-")
                   (zap abn a)))))
  
  #|(dej rnd (a p)
    (if (is a "0") (ret "0"))
    (if (is p (- inf)) (ret "0"))
    
    (psgn sign a)
    
    (var dot (pos "." a))
    (var r)
    (if (or (is p 0) (udfp p))
          (if (is dot -1) (ret (+ sign a)))
          (= r (fstn dot a))
          (if (>= (num #(a (+ dot 1))) 5) (zap add1 r))
        (< p 0)
          (if (is dot -1) (= dot (len a)))
          (if (< (+ dot p) 0) (ret "0")
          (= r (fstn (+ dot p) a))
          if (num(a[dot+p]) >= 5)r = add1(r);
          else if (r == "")return "0";
          r += nof("0", -p);
    } else {
      if (dot == -1 || dot+p+1 >= len(a))return sign+a;
      r = sli(a, 0, dot+p+1);
      if (num(a[dot+p+1]) >= 5)r = add1(r);
      r = trimr(r);
    }
    
    return (r == "0")?r:sign+r;
  }|#
  
)
