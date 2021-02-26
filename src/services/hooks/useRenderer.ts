import { useEffect, useState, useRef, MutableRefObject } from "react";

import rough from "roughjs";
import { RoughCanvas } from "roughjs/bin/canvas";
import { Drawable } from "roughjs/bin/core";
import { ExcaliShape, Rectangle, Triangle, point, Point } from "../../elements";

export enum ShapeTypes {
  rectangle = "rectangle",
  triangle = "triangle"
}

interface Renderer {
  addCurrent: () => void;
  clear: () => void;
  setCurrent: (update: Update) => void;
}

const Config = {
  options: null
};

type Current = {
  drawable: Drawable;
  type: ShapeTypes;
  start: Point;
  end: Point;
  fill: string;
  stroke: string;
};
const BaseCurrent: Current = {
  drawable: null,
  type: ShapeTypes.rectangle,
  start: point(0, 0),
  end: point(0, 0),
  fill: "black",
  stroke: "black"
};
type Update = {
  type?: ShapeTypes;
  start?: Point;
  end?: Point;
  fill?: string;
  stroke?: string;
};

type RenderState =
  | {
      drawable: Drawable;
      shape: ExcaliShape;
    }
  | Current;

const clearCanvas = (canvas: HTMLCanvasElement) => {
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
};

const refreshCanvas = (
  canvas: HTMLCanvasElement,
  roughCanvas: RoughCanvas,
  state: RenderState[]
) => {
  clearCanvas(canvas);
  state
    .filter((shape) => shape && shape.drawable)
    .forEach((shape) => {
      roughCanvas.draw(shape.drawable);
    });
};

const useRenderer = (): [
  ref: MutableRefObject<HTMLCanvasElement>,
  Renderer: Renderer
] => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const roughCanvasRef = useRef<RoughCanvas>();
  const [current, setCurrent] = useState<Current>(BaseCurrent);
  const [canvasState, setCanvasState] = useState<RenderState[]>([]);

  useEffect(() => {
    roughCanvasRef.current = rough.canvas(canvasRef.current, Config);
  }, []);

  const Renderer: Renderer = {
    addCurrent: () => {
      let shape: ExcaliShape;
      if (current.type === ShapeTypes.rectangle) {
        const { start, end } = current;
        shape = new Rectangle([
          start,
          point(end.x, start.y),
          end,
          point(start.x, end.y)
        ]);
      } else if (current.type === ShapeTypes.triangle) {
        const { start, end } = current;
        shape = new Triangle([
          start,
          point(end.x, start.y),
          point(start.x + (end.x - start.x) / 2, end.y)
        ]);
      }
      setCanvasState([...canvasState, { shape, drawable: current.drawable }]);
      setCurrent({ ...BaseCurrent, ...current });
    },
    clear: () => {
      setCanvasState([]);
      setCurrent(BaseCurrent);
    },
    setCurrent: (update: Update) => {
      let drawable: Drawable;
      const { start, end, type, fill, stroke } = { ...current, ...update };
      if (type === ShapeTypes.rectangle) {
        drawable = roughCanvasRef.current.generator.rectangle(
          start.x,
          start.y,
          end.x - start.x,
          end.y - start.y,
          { fill, stroke }
        );
      }
      if (type === ShapeTypes.triangle) {
        drawable = roughCanvasRef.current.generator.polygon(
          [
            [start.x, start.y],
            [end.x, start.y],
            [start.x + (end.x - start.x) / 2, end.y]
          ],
          { fill, stroke }
        );
      }
      setCurrent({ ...current, ...update, drawable });
    }
  };

  useEffect(() => {
    if (roughCanvasRef && roughCanvasRef.current) {
      refreshCanvas(canvasRef.current, roughCanvasRef.current, [
        ...canvasState,
        current
      ]);
    }
  }, [canvasState, current]);

  return [canvasRef, Renderer];
};

export default useRenderer;
