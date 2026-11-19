// Homepage demo figure: two tangents from an external point.
// Points are constructed so A and B lie on the circle and PA, PB are
// perpendicular to the radii OA, OB. C sits on the major arc AB.

export interface Point {
  x: number
  y: number
}

export const TANGENT_FIGURE = (() => {
  const O: Point = { x: 178, y: 82 }
  const P: Point = { x: 58, y: 82 }
  const r = 44
  const dx = P.x - O.x
  const dy = P.y - O.y
  const len2 = dx * dx + dy * dy
  const base = (r * r) / len2
  const scale = (r * Math.sqrt(len2 - r * r)) / len2
  const A: Point = {
    x: O.x + base * dx - scale * dy,
    y: O.y + base * dy + scale * dx,
  }
  const B: Point = {
    x: O.x + base * dx + scale * dy,
    y: O.y + base * dy - scale * dx,
  }
  // 25 degrees above the positive x-axis, on the side opposite the minor arc AB.
  const theta = (25 * Math.PI) / 180
  const C: Point = {
    x: O.x + r * Math.cos(theta),
    y: O.y - r * Math.sin(theta),
  }
  return { O, P, r, A, B, C }
})()

function pointToward(from: Point, to: Point, length: number): Point {
  const x = to.x - from.x
  const y = to.y - from.y
  const len = Math.hypot(x, y)
  return { x: from.x + (x / len) * length, y: from.y + (y / len) * length }
}

/** Small arc at P marking the angle between the two tangents. */
export function tangentAnglePath(radius = 18): string {
  const { P, A, B } = TANGENT_FIGURE
  const start = pointToward(P, A, radius)
  const end = pointToward(P, B, radius)
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`
}
