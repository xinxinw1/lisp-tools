(def + a
  (if (no a) 0
      (add (car a) (apl + (cdr a)))))

(def - a
  (if (no (cdr a)) (neg (car a))
      (sub (car a) (apl + (cdr a)))))

(def * a
  (if (no a) 1
      (mult (car a) (apl * (cdr a)))))

(def / a
  (if (no (cdr a)) (div 1 (car a))
      (div (car a) (apl * (cdr a)))))

(def ^ a
  (if (no a) 1
      (pow (car a) (apl ^ (cdr a)))))

(def > a
  (if (or (no a) (no (cdr a))) t
      (and (gt (car a) (cadr a))
           (apl > (cdr a)))))

(def >= a
  (if (or (no a) (no (cdr a))) t
      (and (ge (car a) (cadr a))
           (apl >= (cdr a)))))

(def < a
  (if (or (no a) (no (cdr a))) t
      (and (lt (car a) (cadr a))
           (apl < (cdr a)))))

(def <= a
  (if (or (no a) (no (cdr a))) t
      (and (le (car a) (cadr a))
           (apl <= (cdr a)))))

(def drpl (x y a)
  (if (is a x) y
     (atm? a) a
     (cons (drpl x y (car a)) (drpl x y (cdr a)))))

#|(mac defm (nm ag bd)
  `(do (def ,nm ,ag ,bd)
       (mac ,nm ,ag `,,(drpl bd))))|#

#|(def rpl (x y a)
   (if (no a) nil
       (is (car a) x) (cons y (rpl x y (cdr a)))
       (cons (car a) (rpl x y (cdr a)))))|#

#|(var bd '(if (negp a) (if (posp b) ["-" (abn a) b] ["" (abn a) (abn b)]) (if (negp b) ["-" a (abn b)] ["" a b])))

(var ag '(a b))

(drpl 'a (lis 'uq 'a) bd)|#

(mac dfm (nm ag bd)
  `(do (def ,nm ,ag ,bd)
       (mac ,nm ,ag
         ,(lis 'qq
            (rdc #[drpl %2 (lis 'uq %2) %1] bd ag)))))

#|(mac dfm (nm (ag) bd)
  `(do (def ,nm (,ag) ,bd)
       (mac ,nm (,ag) ,(lis 'qq (drpl ag (lis 'uq ag) bd)))))|#

(mac num (a) `(Number ,a))
(mac str (a) `(String ,a))

(mac len (a) `(. ,a length))
(mac pos (x a (o n nil)) `(.indexOf ,a ,x ,n))

(mac has (x a) `(isn (pos ,x ,a) -1))
(mac hsn (x a) `(is (pos ,x ,a) -1))
(mac har (x a) `(.test ,x ,a))
(mac sli (a n (o m nil)) `(.substring ,a ,n ,m))

(mac fst (a) `#(,a 0))
(mac las (a) `#(,a (- (len ,a) 1)))

(mac udfp (a) `(is a udf))
(mac nulp (a) `(is a null))

#|(mac inl (nm ag bd)
  `(mac ,nm ,ag
     `,,(rdc #[drpl %2 (aq %2) %1] bd (pnms ag))))|#
     
#|(mac inl (nm ag bd)
  `(mac ,nm ,ag
     `,,(let p (pnms ag)
          (dmap #[if (has % p) (aq %) %] bd))))|#

(def pad (a b)
  [(+ (nof (- (lint b) (lint a)) "0")
      a
      (if (and (intp a) (decp b)) "." "")
      (nof (- (ldec b) (ldec a)) "0"))
   (+ (nof (- (lint a) (lint b)) "0")
      b
      (if (and (intp b) (decp a)) "." "")
      (nof (- (ldec a) (ldec b)) "0"))])

(mac let (a x . bd)
  `(do (var ,a ,x) ,@bd))

(mac wit (vs . bd)
  `(do ,@(map #[hea % 'var] (grp vs 2)) ,@bd))

(mac blk a
  `((fn () ,@a)))

(mac letb (a x . bd)
  `((fn (,a) ,@bd) ,x))

(mac witb (vs . bd)
  (let g (grp vs 2)
    `((fn ,(map car g) ,@bd) ,@(map cadr g))))

#|(def proc (a)
  (case a
    lin? (proclin a)
    lns? (joi (map dolns (flata (geta a))))
    ind? (+ind (getn a) (dolns (lns (geta a))))
    rt?  (doln (geta a))
    syn? (str a)
    str? a
    (err dolns "Unknown a = $1" a)))
  
(def mklin (a (o s ""))
  (if (no a) s
      (mklin (cdr a) (mklin1 (car a) s))))

(def mklin1 (a s)
  (case a
    lin? (mklin (flata (geta a)) s)
    lns? (mklvllns (flata (geta a)) s)
    ind? (err mklin1 "Can't indent inside line")
    rt?  (mklin1 (geta a) s)
    syn? (mklin1 (str a) s)
    str? (app s a)
    (err mklin1 "Unknown a = $1" a)))

(def mklvllns (a (o s ""))
  (if (no a) s
      (case (car a)
        lin? (mklin (mklin1 a s)
        lns? (mklvllns (flata (geta a)) s)
        

(def dolns (a)
  (case a
    lns? (joi (map dolns (flata (geta a))))
    ind? (+ind (getn a) (dolns (lns (geta a))))
    rt?  (dolns (geta a))
    lin? (indent (app (doln a) "\n"))
    syn? (indent (app (doln a) "\n"))
    str? (indent (app (doln a) "\n"))
    (err dolns2 "Unknown a = $1" a)))|#

#|(def evllns2 (a)
  (case a
    lns? (evllns a)
    ind? (evlind a)
    syn? (indent (app a "\n"))
    str? (indent (app a "\n"))
    (err evllns2 "Unknown a = $1" a)))|#
    
#|(def indent (a)
  (str (nof *indlvl* " ") a))|#

#|(def lines a
  (joi (map [str (indent _) "\n"] a)))|#
  
;;; Convert to macro ;;;

#|(def cnv (a)
  (case a
    lin? `(line ,@(cnvl (geta a)))
    lns? `(lines ,@(cnvl (geta a)))
    ind? `(+ind ,(getn a) ,@(cnvl (geta a)))
    syn? (str a)
    str? a
    (err cnv "Unknown a = $1" a)))

; convert lis
(def cnvl (a)
  (map cnv (flata a)))|#


