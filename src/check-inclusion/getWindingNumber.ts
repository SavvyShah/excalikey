import type { Shape, Point } from "./index";

export default function getWindingNumber(shape: Shape, point: Point): number {
  let wn = 0; // the  winding number counter
  const V: Point[] = [...shape.points, shape.points[0]]; //The vertices
  const P = point;
  // loop through all edges of the polygon
  for (let i = 0; i < shape.points.length; i++) {
    if (V[i][1] <= P[1]) {
      // start y <= P.y
      if (V[i + 1][1] > P[1])
        if (isLeft(V[i], V[i + 1], P) > 0)
          // an upward crossing
          // P left of  edge
          ++wn; // have  a valid up intersect
    } else {
      // start y > P.y (no test needed)
      if (V[i + 1][1] <= P[1])
        if (isLeft(V[i], V[i + 1], P) < 0)
          // a downward crossing
          // P right of  edge
          --wn; // have  a valid down intersect
    }
  }
  return wn;
}
function isLeft(P0: Point, P1: Point, point: Point) {
  return (
    (P1[0] - P0[0]) * (point[1] - P0[1]) - (point[0] - P0[0]) * (P1[1] - P0[1])
  );
}
