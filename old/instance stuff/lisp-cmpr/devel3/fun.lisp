(def cons (a b) #[a b])
(def car (a) #(a 0))
(def cdr (a) #(a 1))

(def no (a)
  (is (. a length) 0))

(def lis ()
  (var a arguments)
  (var l nil)
  (eacr x a
    (= l (cons x l)))
  l)

(def len (a) (. a length))

(def dsp (a)
  (if (no a) "[]"
      (+ "[" (car a) ", " (dsp (cdr a)) "]")))

(def al (a)
  (alert (dsp a)))

(def map (x a)
  (if (no a) nil
      (cons (x (car a)) (map x (cdr a)))))

(al (lis 1 2 3))

(al (map [+ _ 5] '(1 2 3 4 5)))

(let a #[1 2 3 4 5]
  (each x a (alert x)))
  
(mac cons (a b) `#[,a ,b])
(mac car (a) `#(,a 0))
(mac cdr (a) `#(,a 1))

(mac lis a
  (if (no a) nil
      `(cons ,(car a) (lis ,@(cdr a)))))

(smac nil #[])

(inl al (a) (alert a))

(def rnd (mn mx)
  (+ (Math.floor (* (Math.random) (+ (- mx mn) 1))) mn))

(def zero? (a)
  (is a 0))

(tags
  (al "here")
  a (al 'a)
    (if (zero? (rnd 0 1)) (go c))
  b (al 'b)
    (if (zero? (rnd 0 1)) (go a))
  c (al 'c)
    (if (zero? (rnd 0 1)) (go b)))

(def foo ()
  (al "Entering foo")
  (block a
    (al " Entering BLOCK")
    (bar (fn () (retfr a)))
    (al " Leaving BLOCK"))
  (al "Leaving foo"))

(def bar (f)
  (al "  Entering bar")
  (block a (baz f))
  (al "  Leaving bar"))

(def baz (f)
  (al "   Entering baz")
  (f)
  (al "   Leaving baz"))

(foo)

(inl cons (a b) (obj a a b b))
(inl car (a) (. a a))
(inl cdr (a) (. a b))

(cons x y)
(car x)
(cdr y)