import { point, Rectangle, Triangle } from "./index";

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
      point(10, 20),
      point(20, 20),
      point(15, 30)
    ]);
    expect(triangle.contains(point(15, 25))).toBe(true);
    expect(triangle.contains(point(16, 25))).toBe(true);
    expect(triangle.contains(point(16, 26))).toBe(true);
    expect(triangle.contains(point(18, 22))).toBe(true);
  });
  test("is outside triangle", () => {
    const triangle = new Triangle([point(0, 0), point(3, 0), point(2, 2)]);
    expect(triangle.contains(point(0.5, 1.5))).toBe(false);
  });
});
