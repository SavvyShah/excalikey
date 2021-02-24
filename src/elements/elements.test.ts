import { Polygon } from "./index";

describe("Shape polygon contains method", () => {
  test("is inside bounding box of rectangle", () => {
    const rectangle = new Polygon([
      { x: 10, y: 10 },
      { x: 50, y: 10 },
      { x: 50, y: 30 },
      { x: 10, y: 30 }
    ]);
    expect(rectangle.contains({ x: 11, y: 11 })).toBe(true);
    expect(rectangle.contains({ x: 50, y: 30 })).toBe(true);
  });
  test("is outside bounding box of rectangle", () => {
    const rectangle = new Polygon([
      { x: 10, y: 10 },
      { x: 50, y: 10 },
      { x: 50, y: 30 },
      { x: 10, y: 30 }
    ]);
    expect(rectangle.contains({ x: 9, y: 9 })).toBe(false);
    expect(rectangle.contains({ x: 40, y: 35 })).toBe(false);
  });
});
