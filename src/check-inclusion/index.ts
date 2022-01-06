import getWindingNumber from "./getWindingNumber";

export type Point = [number, number];

export type Shape = {
  type: "polygon" | "circle";
  points: Point[];
};

function isInBoundingCircle(center: Point, radius: number, point: Point) {
  return false;
}

export default function checkPointInShape(shape: Shape, point: Point): boolean {
  if (shape.type === "polygon") {
    return getWindingNumber(shape, point) !== 0;
  } else {
    return isInBoundingCircle([0, 0], 2, point);
  }
}
