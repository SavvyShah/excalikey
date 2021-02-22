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

const BaseCurrent = {
  type: ShapeTypes.rectangle,
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0 },
  fill: "black"
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
    } as Shape;
  } else if (type === "triangle") {
    return {
      type: ShapeTypes.triangle,
      points: [
        start,
        { x: start.x + (end.x - start.x) / 2, y: end.y },
        { x: end.x, y: start.y }
      ],
      fill
    } as Shape;
  } else {
    return null;
  }
};
const clearCanvas = (canvasEl: HTMLCanvasElement) => {
  const ctx: CanvasRenderingContext2D = canvasEl.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
};
const refreshCanvas = (canvasEl: HTMLCanvasElement, states: Array<Shape>) => {
  const ctx: CanvasRenderingContext2D = canvasEl.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
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

const useRenderer = (
  canvasRef: React.RefObject<HTMLCanvasElement>
): Renderer | null => {
  if (!canvasRef.current) {
    return null;
  }
  const canvasEl: HTMLCanvasElement = canvasRef.current;
  const [current, setCurrent] = useState<Current>(BaseCurrent);
  const [canvasState, setCanvasState] = useState<Array<Shape>>([]);

  const Renderer = {
    addCurrent: () => {
      const currentShape = render(current);
      setCanvasState([...canvasState, currentShape]);
      setCurrent(BaseCurrent);
    },
    clear: () => {
      setCanvasState([]);
      setCurrent(BaseCurrent);
    },
    setCurrent: (update: Update) => {
      setCurrent({ ...current, ...update });
    }
  };

  useEffect(() => {
    const currentShape = render(current);
    refreshCanvas(canvasEl, [...canvasState, currentShape]);
  }, [canvasState, current]);

  return Renderer;
};

export default useRenderer;
