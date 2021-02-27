export enum ShapeTypes {
  rectangle = "rectangle",
  triangle = "triangle"
}

export enum fillStyles {
  solid = "solid",
  zigzag = "zigzag",
  crosshatch = "crosshatch",
  dashed = "dashed",
  zigzagLine = "zigzag-line"
}

export type Point = {
  x: number;
  y: number;
};

export const point = (x: number, y: number): Point => {
  return { x, y };
};

class BoundingRect {
  min: Point;
  max: Point;
  constructor(min?: Point, max?: Point) {
    this.min = min || { x: 0, y: 0 };
    this.max = max || { x: 0, y: 0 };
  }
}

export interface ExcaliShape {
  type: ShapeTypes;
  contains(P: Point): boolean;
}

abstract class Polygon implements ExcaliShape {
  type: ShapeTypes;
  private _points: Array<Point>;
  private _boundingRect: BoundingRect;

  constructor(type: ShapeTypes, points: Array<Point>) {
    this.type = type;
    this.points = points;
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
  protected _getCrossingNumber(P: Point): number {
    let crossingNumber = 0;
    for (let i = 0; i < this.points.length - 1; i++) {
      const current = this.points[i];
      const next = this.points[i + 1];
      if (P.x <= current.x && P.x <= next.x) {
        //downward edge
        if (next.y > current.y) {
          if (P.y >= current.y && P.y < next.y) {
            crossingNumber++;
          }
        }
        //upward edge
        else if (next.y < current.y) {
          if (P.y <= next.y && P.y > current.y) {
            crossingNumber++;
          }
        }
        //horizontal edge
        else {
          continue;
        }
      }
    }
    return crossingNumber;
  }
  //Checks whether point P is inside of Polygon's bounding box
  protected _isInBoundingBox(P: Point): boolean {
    const B = this._boundingRect;
    return P.x >= B.min.x && P.x <= B.max.x && P.y >= B.min.y && P.y <= B.max.y;
  }
  abstract contains(P: Point): boolean;
}
export class Rectangle extends Polygon {
  readonly height: number;
  readonly width: number;
  constructor(points: [Point, Point, Point, Point]) {
    super(ShapeTypes.rectangle, points);
  }
  contains(P: Point): boolean {
    //Check if element is in bounding box
    return this._isInBoundingBox(P);
  }
}
export class Triangle extends Polygon {
  constructor(points: [Point, Point, Point]) {
    super(ShapeTypes.triangle, points);
  }
  contains(P: Point): boolean {
    if (this._isInBoundingBox(P)) {
      const crossingNumber = this._getCrossingNumber(P);
      return crossingNumber % 2 !== 0;
    } else {
      return false;
    }
  }
}
