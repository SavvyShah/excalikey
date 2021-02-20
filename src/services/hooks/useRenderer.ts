import { useEffect, useState } from "react";

export enum ShapeTypes {
  rectangle = "rectangle",
  triangle = "triangle"
}

type Point = {
  x: number;
  y: number;
};

type Rectangle = {
  type: ShapeTypes.rectangle;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
};

type Triangle = {
  type: ShapeTypes.triangle;
  points: [Point, Point, Point];
  fill: string;
};

type Current = {
  type: ShapeTypes;
  start: Point;
  end: Point;
  fill: string;
};

type Update = {
  type?: ShapeTypes;
  start?: Point;
  end?: Point;
  fill?: string;
};

interface Renderer {
  addCurrent: () => void;
  clear: () => void;
  setCurrent: (update: Update) => void;
}

export type Shape = Rectangle | Triangle | null;

const render = (current: Current): Shape => {
  if (current === null) {
    return null;
  }
  const { type, start, end, fill } = current;
  if (type === "rectangle") {
    return {
      type: ShapeTypes.rectangle,
      x: start.x,
      y: start.y,
      width: end.x - start.x,
      height: end.y - start.y,
      fill
    };
  } else if (type === "triangle") {
    return {
      type: ShapeTypes.triangle,
      points: [
        start,
        { x: start.x + (end.x - start.x) / 2, y: end.y },
        { x: end.x, y: start.y }
      ],
      fill
    };
  }
};
const clearCanvas = (canvasEl: HTMLCanvasElement) => {
  const ctx: CanvasRenderingContext2D = canvasEl.getContext("2d");
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
};
const refreshCanvas = (canvasEl: HTMLCanvasElement, states: Array<Shape>) => {
  const ctx: CanvasRenderingContext2D = canvasEl.getContext("2d");
  clearCanvas(canvasEl);
  states.forEach((state) => {
    if (state === null) {
      return null;
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
      ctx.moveTo(points[0].x, points[0].y);
      ctx.lineTo(points[1].x, points[1].y);
      ctx.lineTo(points[2].x, points[2].y);
      ctx.fill();
      ctx.fillStyle = "black";
    }
  });
};

const useRenderer = (canvasEl: HTMLCanvasElement): Renderer => {
  const [current, setCurrent] = useState<Current>(null);
  const [canvasState, setCanvasState] = useState<Array<Shape>>([]);

  const Renderer = {
    addCurrent: () => {
      const currentShape = render(current);
      setCanvasState([...canvasState, currentShape]);
      setCurrent(null);
    },
    clear: () => {
      setCanvasState([]);
      setCurrent(null);
    },
    setCurrent: (update: Update) => {
      setCurrent({ ...current, ...update });
    }
  };

  useEffect(() => {
    if (canvasEl) {
      const currentShape = render(current);
      refreshCanvas(canvasEl, [...canvasState, currentShape]);
    }
  }, [canvasState, current]);

  return Renderer;
};

export default useRenderer;
