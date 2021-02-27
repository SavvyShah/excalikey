import { useEffect, useState, useRef, MutableRefObject } from "react";

import rough from "roughjs";
import { RoughCanvas } from "roughjs/bin/canvas";
import { Drawable } from "roughjs/bin/core";
import {
  ExcaliShape,
  Rectangle,
  Triangle,
  point,
  Point,
  ShapeTypes
} from "../../elements";

interface Renderer {
  addCurrent: () => void;
  clear: () => void;
  setCurrent: (update: Update) => void;
  select: (x: number, y: number) => void;
}

const Config = {
  options: null
};

type Current = {
  confirmed: false;
  drawable: Drawable;
  type: ShapeTypes;
  start: Point;
  end: Point;
  fill: string;
  stroke: string;
};

const BaseCurrent: Current = {
  confirmed: false,
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
      id: number;
      confirmed: true;
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
  const [id, setId] = useState<number>(0);
  const [canvasState, setCanvasState] = useState<Map<number, RenderState>>(
    new Map()
  );

  useEffect(() => {
    roughCanvasRef.current = rough.canvas(canvasRef.current, Config);
  }, []);

  const Renderer: Renderer = {
    select: (x: number, y: number) => {
      for (const state of canvasState.values()) {
        if (state.confirmed) {
          if (state.shape.contains(point(x, y))) {
            return state;
          }
        }
      }
    },
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
      setCanvasState(
        new Map([
          ...canvasState,
          [id, { shape, drawable: current.drawable, id, confirmed: true }]
        ])
      );
      setCurrent({
        ...BaseCurrent,
        fill: current.fill,
        stroke: current.stroke
      });
      setId(id + 1);
    },
    clear: () => {
      setCanvasState(new Map());
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
        ...canvasState.values(),
        current
      ]);
    }
  }, [canvasState, current]);

  return [canvasRef, Renderer];
};

export default useRenderer;
