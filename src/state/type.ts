export type Point = [number, number];

export type Shape = {
  points: Point[];
  type: "rectangle" | "circle" | "triangle";
  id: string;
  fillColor: string;
  strokeColor: string;
};

type ShapeDict = {
  [id: string]: Shape;
};

export type State = {
  shapes: ShapeDict;
  selected: Shape | null;
  drawing: Shape | null;
};

export default {};
