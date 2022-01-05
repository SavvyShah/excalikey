export type Point = [number, number];

export interface Shape {
  points: Point[];
  id: string;
  type: "rectangle" | "triangle" | "circle";
}

type ShapeDict = {
  [id: string]: Shape;
};

export type State = {
  shapes: ShapeDict;
  selected: Shape | null;
  drawing: Shape | null;
};
