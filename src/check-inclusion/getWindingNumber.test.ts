import checkPointInShape, { Shape } from ".";

const triangle: Shape = {
  type: "polygon",
  points: [
    [7, 4],
    [5, 2.5],
    [10, 1],
  ],
};
const quadrilateral: Shape = {
  type: "polygon",
  points: [
    [4, 3],
    [3, -3],
    [6, -3],
    [8, -2],
  ],
};

describe("Point inclusion in polygon", () => {
  test("point should be outside triangle", () => {
    expect(checkPointInShape(triangle, [3, 4])).toBe(false);
  });
  test("point should be inside triangle", () => {
    expect(checkPointInShape(triangle, [7, 2.5])).toBe(true);
  });
  test("point should be inside quadrilateral", () => {
    expect(checkPointInShape(quadrilateral, [5, 1])).toBe(true);
    expect(checkPointInShape(quadrilateral, [5, -1])).toBe(true);
  });
  test("point should be outside quadrilateral", () => {
    expect(checkPointInShape(quadrilateral, [3, 1])).toBe(false);
  });
});
