import { useEffect, useState, useRef, MutableRefObject } from "react";

import rough from "roughjs";
import { RoughCanvas } from "roughjs/bin/canvas";
import { Drawable } from "roughjs/bin/core";
import { Point as RoughPoint } from "roughjs/bin/geometry";
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
  select: (x: number, y: number) => ConfirmedState;
  setSelected: (update: { fill?: string; stroke?: string }) => void;
}

const Config = {
  options: null
};
const SELECTED_BORDER_OFFSET = 5;

interface BaseState {
  confirmed: boolean;
  stroke: string;
  fill: string;
  drawable: Drawable;
}

interface BaseCurrent extends BaseState {
  confirmed: false;
}

interface CurrentRect extends BaseCurrent {
  type: ShapeTypes.rectangle;
  points: [Point, Point, Point, Point];
}
interface CurrentTriangle extends BaseCurrent {
  type: ShapeTypes.triangle;
  points: [Point, Point, Point];
}

type Current = CurrentRect | CurrentTriangle;

const BaseCurrent: Current = {
  confirmed: false,
  drawable: null,
  type: ShapeTypes.rectangle,
  points: [point(0, 0), point(0, 0), point(0, 0), point(0, 0)],
  fill: "black",
  stroke: "black"
};

interface BaseUpdate {
  fill?: string;
  stroke?: string;
}
interface RectUpdate extends BaseUpdate {
  type: ShapeTypes.rectangle;
  points: [Point, Point, Point, Point];
}
interface TriangleUpdate extends BaseUpdate {
  type: ShapeTypes.triangle;
  points: [Point, Point, Point];
}

type Update = RectUpdate | TriangleUpdate;

interface BaseConfirmed extends BaseState {
  confirmed: true;
  id: number;
  shape: ExcaliShape;
  selected: boolean;
}
interface ConfirmedRect extends BaseConfirmed {
  type: ShapeTypes.rectangle;
  points: [Point, Point, Point, Point];
}
interface ConfirmedTriangle extends BaseConfirmed {
  type: ShapeTypes.triangle;
  points: [Point, Point, Point];
}

type ConfirmedState = ConfirmedRect | ConfirmedTriangle;

type RenderState = ConfirmedState | Current;

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
      if (shape.confirmed && shape.selected) {
        const { min, max } = shape.shape.bounds;
        roughCanvas.rectangle(
          min.x - SELECTED_BORDER_OFFSET,
          min.y - SELECTED_BORDER_OFFSET,
          max.x - min.x + 2 * SELECTED_BORDER_OFFSET,
          max.y - min.y + 2 * SELECTED_BORDER_OFFSET
        );
      }
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
  const [selected, setSelected] = useState<ConfirmedState>();
  const [id, setId] = useState<number>(0);
  const [canvasState, setCanvasState] = useState<Map<number, RenderState>>(
    new Map()
  );

  useEffect(() => {
    roughCanvasRef.current = rough.canvas(canvasRef.current, Config);
  }, []);

  const Renderer: Renderer = {
    select: (x: number, y: number) => {
      let newSelected: ConfirmedState;
      for (const state of canvasState.values()) {
        if (state.confirmed) {
          if (state.shape.contains(point(x, y))) {
            newSelected = state;
            break;
          }
        }
      }
      const newCanvasState = new Map(canvasState);
      //unselect old selected element
      if (selected)
        newCanvasState.set(selected.id, { ...selected, selected: false });
      //select newly selected element
      newCanvasState.set(newSelected.id, { ...newSelected, selected: true });
      setCanvasState(newCanvasState);
      setSelected({ ...newSelected, selected: true });
      return newSelected;
    },
    setSelected: (update: { fill?: string; stroke?: string }) => {
      const newCanvasState = new Map(canvasState);
      newCanvasState.set(selected.id, { ...selected, ...update });
      const { points, fill, stroke } = { ...selected, ...update };
      const pointsArr: RoughPoint[] = points.map((point) => [point.x, point.y]);
      const drawable = roughCanvasRef.current.generator.polygon(pointsArr, {
        fill,
        stroke
      });
      setSelected({ ...selected, ...update, drawable });
      setCanvasState(newCanvasState);
    },
    addCurrent: () => {
      let shape: ExcaliShape;
      if (current.type === ShapeTypes.rectangle) {
        shape = new Rectangle(current.points);
      } else if (current.type === ShapeTypes.triangle) {
        shape = new Triangle(current.points);
      }
      setCanvasState(
        new Map([
          ...canvasState,
          [id, { shape, ...current, id, confirmed: true, selected: false }]
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
      const { points, type, fill, stroke } = { ...current, ...update };
      const pointsArr: RoughPoint[] = points.map((point) => [point.x, point.y]);
      if (type === ShapeTypes.rectangle) {
        drawable = roughCanvasRef.current.generator.polygon(pointsArr, {
          fill,
          stroke
        });
      }
      if (type === ShapeTypes.triangle) {
        drawable = roughCanvasRef.current.generator.polygon(pointsArr, {
          fill,
          stroke
        });
      }
      const newCanvasState = new Map(canvasState);
      //when drawing unselect current selection
      if (selected) {
        newCanvasState.set(selected.id, { ...selected, selected: false });
      }
      setCanvasState(newCanvasState);
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
  }, [canvasState, current, selected]);

  return [canvasRef, Renderer];
};

export default useRenderer;
