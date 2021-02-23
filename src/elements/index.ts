export enum ShapeTypes {
  polygon = "polygon",
  curve = "curve"
}

type Point = {
  x: number;
  y: number;
};

class BoundingRect {
  min: Point;
  max: Point;
  constructor(min?: Point, max?: Point) {
    this.min = min || { x: 0, y: 0 };
    this.max = max || { x: 0, y: 0 };
  }
}

abstract class Shape {
  type: ShapeTypes;
  constructor(S: { type: ShapeTypes }) {
    this.type = S.type;
  }
  abstract contains(P: Point): boolean;
}
export class Polygon extends Shape {
  private _points: Array<Point>;
  private _boundingRect: BoundingRect;

  constructor(points: Array<Point>) {
    super({ type: ShapeTypes.polygon });
    this._points = points;
    this._boundingRect = new BoundingRect();
  }
  get points(): Array<Point> {
    return this._points;
  }
  set points(points: Array<Point>) {
    this._points = points;
    const min: Point = {
      x: points.reduce(
        (currentMin, point) => (currentMin < point.x ? currentMin : point.x),
        points[0].x
      ),
      y: points.reduce(
        (currentMin, point) => (currentMin < point.y ? currentMin : point.y),
        points[0].y
      )
    };
    const max: Point = {
      x: points.reduce(
        (currentMax, point) => (currentMax > point.x ? currentMax : point.x),
        points[0].x
      ),
      y: points.reduce(
        (currentMax, point) => (currentMax > point.y ? currentMax : point.y),
        points[0].y
      )
    };
    this._boundingRect = new BoundingRect(min, max);
  }
  getPoints(): Array<Point> {
    return this._points;
  }
  private _getWindingNumber(P: Point): number {
    return 0;
  }
  private _isInBoundingBox(P: Point) {
    const B = this._boundingRect;
    return P.x > B.min.x && P.x < B.max.x && P.y > B.min.y && P.y < B.max.y;
  }
  contains(P: Point): boolean {
    const B = this._boundingRect;
    //Check if element is in bounding box
    //If shape is not a rectangle then getWindingNumber
    return false;
  }
}
