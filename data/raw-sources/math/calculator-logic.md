# HKDSE Maths — Calculator logic (Compulsory Part)

HK students sit the exam with an HKEAA-approved calculator (commonly Casio
fx-50FH II / fx-3650P II / fx-991 series). Questions and explanations should reflect
how a student would actually reach the answer on these machines.

## Mode discipline (the #1 source of silly mistakes)
- **DEG vs RAD**: DSE compulsory trig is in **degrees**. A wrong angle mode is the
  classic trap — `sin 30` must give `0.5`, not `-0.988`.
- **STAT / SD mode** for any "mean / standard deviation" question.
- Reset to **COMP** (normal) mode before ordinary arithmetic.

## Statistics keys
- Enter data in SD/STAT mode, then read:
  - mean `x̄`,
  - **population** standard deviation `σn` (DSE uses σ, the population s.d., NOT the
    sample `σn-1`). Picking `σn-1` is a standard distractor.
- For grouped data, enter the **class mark** (mid-value) as x with its frequency.
- Adding a constant `k` to every datum: mean `+k`, **s.d. unchanged**.
- Multiplying every datum by `k`: mean `×k`, s.d. `×|k|`, variance `×k²`.

## Equation solving
- Quadratics: use the EQN/poly solver or the formula
  `x = (-b ± √(b²-4ac)) / 2a`. Keep surds exact unless told to round.
- Simultaneous linear equations: EQN mode (2 unknowns) — faster and avoids
  arithmetic slips than elimination by hand.

## Probability keys
- `nCr` for combinations (order doesn't matter — committees, choosing).
- `nPr` for permutations (order matters — arrangements, seatings).
- Mixing these up is the most common probability error.

## Rounding convention
- Unless a question states otherwise, give the final answer **correct to 3
  significant figures**. Round only at the END; keep full precision in `Ans`/memory
  during intermediate steps to avoid accumulated rounding error.
- "Correct to 3 sig. fig." vs "3 decimal places" are different — read carefully.

## Useful memory habits
- Store an intermediate result with `STO` and recall with `RCL`/`Ans` instead of
  re-typing — re-typing a rounded number is a frequent trap built into questions.
- `Ans` chains a multi-step calculation without losing precision.
