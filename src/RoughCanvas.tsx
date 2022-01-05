import React, { MouseEventHandler, useEffect, useRef } from "react";
import { Drawable } from "roughjs/bin/core";
import rough from "roughjs";

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
      return generator.rectangle(start[0], start[1], 10, 10);
    case "triangle":
      return generator.polygon([
        start,
        [start[0] + 10, start[1]],
        [start[0] + 5, start[1] + 10],
      ]);
    default:
      return generator.polygon([]);
  }
}
function getScale(shape: Shape): [number, number] {
  const start = shape.points[0];
  const end = shape.points[shape.points.length - 1];
  switch (shape.type) {
    case "rectangle":
      return [end[0] - start[0], end[1] - start[1]];
    case "triangle":
      return [end[0] - start[0], end[1] - start[1]];
    default:
      return [1, 1];
  }
}

export default function RoughCanvas({
  shapes,
  onMouseDown,
  onMouseUp,
  onMouseMove,
}: Props) {
  const shapeMap = useRef<ShapeMap>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    //Keep the shape map updated
    if (canvas.current && shapeMap.current) {
      shapes.forEach((shape) => {
        if (shapeMap.current && !shapeMap.current[shape.id]) {
          shapeMap.current[shape.id] = {
            drawable: generateDrawable(
              canvas.current as HTMLCanvasElement,
              shape
            ),
            scale: getScale(shape),
          };
        }
      });
    }
  }, [shapes]);
  useEffect(() => {
    const canvasEl = canvas.current;
    if (canvasEl && shapeMap.current) {
      shapes.forEach(({ id }) => {
        if (shapeMap.current) {
          const shape = shapeMap.current[id];
          const roughCanvas = rough.canvas(canvasEl);
          const ctx = canvasEl.getContext("2d") as CanvasRenderingContext2D;
          ctx.scale(shape.scale[0], shape.scale[1]);
          roughCanvas.draw(shapeMap.current[id].drawable);
          ctx.scale(1, 1);
        }
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
