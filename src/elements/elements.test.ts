import { Point, Rectangle, Triangle } from "./index";

describe("Rectangle.contains()", () => {
  test("is inside rectangle", () => {
    const rectangle = new Rectangle([
      { x: 10, y: 10 },
      { x: 50, y: 10 },
      { x: 50, y: 30 },
      { x: 10, y: 30 }
    ]);
    expect(rectangle.contains({ x: 11, y: 11 })).toBe(true);
    expect(rectangle.contains({ x: 50, y: 30 })).toBe(true);
  });
  test("is outside rectangle", () => {
    const rectangle = new Rectangle([
      { x: 10, y: 10 },
      { x: 50, y: 10 },
      { x: 50, y: 30 },
      { x: 10, y: 30 }
    ]);
    expect(rectangle.contains({ x: 9, y: 9 })).toBe(false);
    expect(rectangle.contains({ x: 40, y: 35 })).toBe(false);
  });
});

describe("Triangle.contains()", () => {
  test("is inside triangle", () => {
    const triangle = new Triangle([
      Point(10, 20),
      Point(20, 20),
      Point(15, 30)
    ]);
    expect(triangle.contains(Point(15, 25))).toBe(true);
  });
});
