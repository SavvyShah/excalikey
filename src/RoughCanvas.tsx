import React, {
  KeyboardEventHandler,
  PointerEventHandler,
  useEffect,
  useRef,
} from "react";
import { Drawable } from "roughjs/bin/core";
import rough from "roughjs";
import { useAppSelector } from "./state";

const MIN_LEN = 50;
const SELECT_OFFSET = 10;

type Point = [number, number];

type Shape = {
  id: string;
  type: "rectangle" | "triangle" | "circle";
  points: Point[];
};

type Props = {
  onPointerUp?: PointerEventHandler<HTMLCanvasElement>;
  onPointerDown?: PointerEventHandler<HTMLCanvasElement>;
  onPointerMove?: PointerEventHandler<HTMLCanvasElement>;
};

type ShapeMap = {
  [id: string]: {
    drawable: Drawable;
    scale: [number, number];
  };
};

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
  onPointerDown,
  onPointerUp,
  onPointerMove,
}: Props) {
  const { drawing, shapes, selected } = useAppSelector((state) => state);
  const canvas = useRef<HTMLCanvasElement>(null);
  const shapeMapRef = useRef<ShapeMap>({});

  useEffect(() => {
    const canvasEl = canvas.current;
    const shapeMap = shapeMapRef.current;
    if (canvasEl && shapeMap) {
      const ctx = canvasEl.getContext("2d") as CanvasRenderingContext2D;
      //Clear the canvas to draw shapes again
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      //Shapes already saved and needed to be drawn again
      Object.keys(shapes).forEach((id) => {
        const roughCanvas = rough.canvas(canvasEl);
        roughCanvas.draw(shapeMap[id].drawable);
      });
      //If we are currently drawing a shape
      if (drawing) {
        const { id, points, strokeColor, fillColor } = drawing;
        const roughCanvas = rough.canvas(canvasEl);
        const drawable = roughCanvas.generator.polygon(points, {
          stroke: strokeColor,
          fillStyle: "solid",
          fill: fillColor,
        });
        shapeMap[id] = { drawable, scale: [1, 1] };
        roughCanvas.draw(drawable);
      }
      //If a shape is selected then draw a dashed box around it
      if (selected) {
        const { points } = selected;
        const roughCanvas = rough.canvas(canvasEl);
        const minX = points.map((a) => a[0]).reduce((a, b) => Math.min(a, b));
        const minY = points.map((a) => a[1]).reduce((a, b) => Math.min(a, b));
        const maxX = points.map((a) => a[0]).reduce((a, b) => Math.max(a, b));
        const maxY = points.map((a) => a[1]).reduce((a, b) => Math.max(a, b));
        const s: Point = [minX - SELECT_OFFSET, minY - SELECT_OFFSET];
        const e: Point = [maxX + SELECT_OFFSET, maxY + SELECT_OFFSET];
        roughCanvas.rectangle(s[0], s[1], e[0] - s[0], e[1] - s[1], {
          strokeLineDash: [5, 5],
        });
      }
    }
  }, [shapes, drawing, selected]);

  return (
    <canvas
      ref={canvas}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      width={window.innerWidth}
      height={window.innerHeight}
      className="appCanvas"
    >
      Canvas not supported!
    </canvas>
  );
}
