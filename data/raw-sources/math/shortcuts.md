# HKDSE Maths — Shortcuts, formulae & classic traps (Compulsory Part)

Exam-authentic techniques and the wrong-answer traps DSE actually uses. Generated
questions should make distractors out of THESE mistakes, and explanations should
name the shortcut.

## Quadratics
- Roots `α, β` of `ax² + bx + c = 0`: **sum `α+β = -b/a`**, **product `αβ = c/a`**.
  Many "find the value without solving" questions hinge on this.
- Discriminant `Δ = b² - 4ac`: `Δ>0` two distinct real roots; `Δ=0` a double root;
  `Δ<0` no real roots. "Two equal real roots" ⇒ `Δ = 0` (not `>0`).
- Vertex by completing the square: `a(x-h)² + k`, vertex `(h, k)`; max/min value is
  `k`. For `a>0` it's a minimum; `a<0` a maximum (sign-of-`a` trap).

## Percentages, interest & growth
- Successive percentage changes **multiply**: +20% then -20% ⇒ `×1.2×0.8 = 0.96`, a
  net **4% loss**, not 0%. (The "they cancel" answer is the trap.)
- Reverse percentage: if a price after +15% is $920, original `= 920 / 1.15`, NOT
  `920 × 0.85`.
- Compound interest: `A = P(1 + r)ⁿ` (per period). Growth/decay share this form;
  decay uses `(1 - r)`.

## Sequences & series
- Arithmetic: `Tₙ = a + (n-1)d`, `Sₙ = n/2 · (2a + (n-1)d) = n/2 · (first + last)`.
- Geometric: `Tₙ = arⁿ⁻¹`, `Sₙ = a(rⁿ - 1)/(r - 1)`.
- Sum to infinity exists **only when `|r| < 1`**: `S∞ = a/(1 - r)`. Forgetting the
  convergence condition is a standard trap.

## Logarithms & indices
- `log(MN)=logM+logN`, `log(M/N)=logM-logN`, `log Mᵏ = k logM`.
- Change of base: `log_a b = log b / log a`.
- `log` of a non-positive number is undefined — watch the domain.

## Trigonometry (degrees)
- Identity `sin²θ + cos²θ = 1`; `tanθ = sinθ/cosθ`.
- Sine rule `a/sinA = b/sinB = c/sinC`; cosine rule `c² = a² + b² - 2ab cosC`.
- Triangle area `= ½ ab sinC`.
- Exact values worth memorising: `sin30=½, cos30=√3/2, tan45=1, sin60=√3/2`.

## Coordinate geometry
- Distance `√((x₂-x₁)² + (y₂-y₁)²)`; midpoint `((x₁+x₂)/2,(y₁+y₂)/2)`.
- Slope `m = (y₂-y₁)/(x₂-x₁)`. **Parallel ⇒ equal slopes**;
  **perpendicular ⇒ `m₁·m₂ = -1`**.
- Circle `(x-h)² + (y-k)² = r²`, centre `(h,k)`, radius `r`.
  General form `x²+y²+Dx+Ey+F=0` ⇒ centre `(-D/2,-E/2)`, radius `√((D/2)²+(E/2)²-F)`.

## Polynomials
- Remainder theorem: remainder of `f(x) ÷ (x-a)` is `f(a)`.
- Factor theorem: `(x-a)` is a factor ⟺ `f(a)=0`.

## Inequalities
- Multiplying or dividing by a **negative number flips the inequality sign** — the
  single most common inequality error.
- Quadratic inequality `ax²+bx+c > 0`: solve the equation, then use the parabola's
  sign (opens up for `a>0`).

## Variation
- Direct `y = kx`; inverse `y = k/x`; joint `y = kxz`; partial `y = k₁ + k₂x`.
  Find `k` from given data first, then substitute.

## Statistics
- Quartiles, IQR `= Q3 - Q1`; an outlier is commonly beyond `Q1-1.5·IQR` or
  `Q3+1.5·IQR`.
- Box-and-whisker reads five numbers: min, Q1, median, Q3, max.
- Mean is sensitive to outliers; the **median is resistant** — a frequent
  "which average is fairer" discussion point.

## Probability
- `P(not A) = 1 - P(A)` (complement — often the fastest route for "at least one").
- **Mutually exclusive**: `P(A or B) = P(A) + P(B)`.
- **Independent**: `P(A and B) = P(A) · P(B)`. Do not confuse the two.
- Expected value `E = Σ (value × probability)`.
