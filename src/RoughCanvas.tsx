import React, { MouseEventHandler, useEffect, useRef } from "react";
import { Drawable } from "roughjs/bin/core";
import rough from "roughjs";

const MIN_LEN = 50;

type Point = [number, number];

type Shape = {
  id: string;
  type: "rectangle" | "triangle" | "circle";
  points: Point[];
};

type Props = {
  shapes: Shape[];
  onMouseUp: MouseEventHandler<HTMLCanvasElement>;
  onMouseDown: MouseEventHandler<HTMLCanvasElement>;
  onMouseMove: MouseEventHandler<HTMLCanvasElement>;
};

type ShapeMap = {
  [id: string]: {
    drawable: Drawable;
    scale: [number, number];
  };
};

function generateDrawable(canvas: HTMLCanvasElement, shape: Shape): Drawable {
  const roughCanvas = rough.canvas(canvas);
  const generator = roughCanvas.generator;
  const start = shape.points[0];
  switch (shape.type) {
    case "rectangle":
      return generator.rectangle(start[0], start[1], MIN_LEN, MIN_LEN);
    case "triangle":
      return generator.polygon([
        start,
        [start[0] + MIN_LEN, start[1]],
        [start[0] + 5, start[1] + MIN_LEN],
      ]);
    default:
      return generator.polygon([]);
  }
}
function getScale(shape: Shape): [number, number] {
  let hScale = 1;
  let vScale = 1;

  const { points } = shape;
  switch (shape.type) {
    case "rectangle":
      hScale = (points[2][0] - points[0][0]) / MIN_LEN;
      vScale = (points[2][1] - points[0][1]) / MIN_LEN;
      break;
    case "triangle":
      hScale = points[0][0] - points[2][0];
      vScale = points[0][1] - points[2][1];
      break;
  }
  return [hScale, vScale];
}

export default function RoughCanvas({
  shapes,
  onMouseDown,
  onMouseUp,
  onMouseMove,
}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvasEl = canvas.current;
    if (canvasEl) {
      const ctx = canvasEl.getContext("2d") as CanvasRenderingContext2D;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      shapes.forEach(({ points }) => {
        const roughCanvas = rough.canvas(canvasEl);
        roughCanvas.polygon(points);
      });
    }
  }, [shapes]);

  return (
    <canvas
      ref={canvas}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      width={window.innerWidth}
      height={window.innerHeight}
    >
      Canvas not supported!
    </canvas>
  );
}
