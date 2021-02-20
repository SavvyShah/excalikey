import { useEffect, useState } from "react";

type Point = [number, number];

type Rectangle = {
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
};

type Triangle = {
  type: "triangle";
  points: [Point, Point, Point];
  fill: string;
};

interface Renderer {
  addCurrent: () => void;
  clear: () => void;
  current: Shape;
  setCurrent: React.Dispatch<React.SetStateAction<Shape>>;
}

export type Shape = Rectangle | Triangle | null;

const clearCanvas = (canvasEl: HTMLCanvasElement) => {
  const ctx: CanvasRenderingContext2D = canvasEl.getContext("2d");
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
};
const refreshCanvas = (canvasEl: HTMLCanvasElement, states: Array<Shape>) => {
  const ctx: CanvasRenderingContext2D = canvasEl.getContext("2d");
  clearCanvas(canvasEl);
  states.forEach((state) => {
    if (state === null) {
      return;
    }
    if (state.type === "rectangle") {
      const { x, y, width, height, fill } = state;
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = "black";
    } else if (state.type === "triangle") {
      const points = state.points;
      ctx.fillStyle = state.fill;
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      ctx.lineTo(points[1][0], points[1][1]);
      ctx.lineTo(points[2][0], points[2][1]);
      ctx.fill();
      ctx.fillStyle = "black";
    }
  });
};

const useRenderer = (canvasEl: HTMLCanvasElement): Renderer => {
  const [current, setCurrent] = useState<Shape>(null);
  const [canvasState, setCanvasState] = useState<Array<Shape>>([]);

  const Renderer = {
    addCurrent: () => {
      setCanvasState([...canvasState, current]);
      setCurrent(null);
    },
    clear: () => {
      setCanvasState([]);
      setCurrent(null);
    },
    current,
    setCurrent
  };

  useEffect(() => {
    if (canvasEl) {
      refreshCanvas(canvasEl, [...canvasState, current]);
    }
  }, [canvasState, current]);

  return Renderer;
};

export default useRenderer;
