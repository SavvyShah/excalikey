import React, { useEffect, useState } from "react";

import Button from "./components/Button";

import IconTray, { IconButton } from "./components/IconTray";
import ColorPicker from "./components/ColorPicker";
import { useAppDispatch, useAppSelector } from "./state";
import { deleteSelected, draw, saveDrawing, select } from "./state/reducer";
import { Shape } from "./state/type";
import RoughCanvas from "./RoughCanvas";
import checkPointInShape from "./check-inclusion";
import useKeyDownEvent from "./hooks/useKeyDownEvent";
import {
  Fill as FillIcon,
  Pointer,
  Rectangle,
  Trash,
  Triangle,
} from "./components/icons";
import ContextMenu, { Action } from "./components/ContextMenu";

type ShapeTypes = "rectangle" | "circle" | "triangle";
type Point = [number, number];

function App(): JSX.Element {
  const { drawing, shapes, selected } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [actionType, setActionType] = useState<ShapeTypes | "pointer" | null>();
  const [counter, setCounter] = useState(0);
  const [fill, setFill] = useState<string>("white");
  const [stroke, setStroke] = useState<string>("black");
  const [start, setStart] = useState<Point>([0, 0]);
  const [end, setEnd] = useState<Point>([0, 0]);
  const [showMenu, setShowMenu] = useState(false);

  const canvasShapes = Object.keys(shapes).map((id) => shapes[id]);

  const menuX = selected && selected.points[0][0];
  const menuY = selected && selected.points[0][1];

  const menuActions: Action[] = [
    {
      name: "Delete selected",
      handler: () => {
        setShowMenu(false);
        dispatch(deleteSelected());
      },
      danger: true,
    },
  ];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      dispatch(deleteSelected());
    }
  };
  useKeyDownEvent(handleKeyDown);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (actionType === "pointer") {
      const found = findShapeAtPoint(canvasShapes, [e.clientX, e.clientY]);
      dispatch(select(found ? found.id : null));
    } else if (actionType === "rectangle") {
      dispatch(
        draw({
          type: "rectangle",
          id: `shape-${counter}`,
          points: generatePoints("rectangle", start, end),
          fillColor: fill,
          strokeColor: stroke,
        })
      );
    } else if (actionType === "triangle") {
      dispatch(
        draw({
          type: "triangle",
          id: `shape-${counter}`,
          points: generatePoints("triangle", start, end),
          fillColor: fill,
          strokeColor: stroke,
        })
      );
    }
    setStart([e.clientX, e.clientY]);
    setEnd([e.clientX, e.clientY]);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (drawing) {
      if (actionType === "rectangle") {
        dispatch(
          draw({
            ...drawing,
            points: generatePoints("rectangle", start, end),
            fillColor: fill,
            strokeColor: stroke,
          })
        );
      } else if (actionType === "triangle") {
        dispatch(
          draw({
            ...drawing,
            points: generatePoints("triangle", start, end),
            fillColor: fill,
            strokeColor: stroke,
          })
        );
      }
      setEnd([e.clientX, e.clientY]);
    }
  };
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (drawing) {
      dispatch(saveDrawing());
    }
    setStart([0, 0]);
    setEnd([0, 0]);
    setCounter(counter + 1);
  };
  const handleLongPress = (point: Point) => {
    const found = findShapeAtPoint(canvasShapes, point);
    dispatch(select(found ? found.id : null));
    setShowMenu(true);
  };

  return (
    <div>
      {menuX && menuY && (
        <ContextMenu
          onClose={() => dispatch(select(null))}
          x={30}
          y={50}
          z={3}
          actions={menuActions}
        />
      )}
      <IconTray style={{ position: "fixed" }}>
        <Button onClick={() => console.log("clear everything")} active={false}>
          <Trash />
        </Button>
        <ColorPicker
          style={{ padding: "7px", margin: "0.125rem" }}
          value={fill}
          onChange={(val) => setFill(val)}
          icon={<FillIcon />}
        />
        <ColorPicker
          style={{ padding: "7px", margin: "0.125rem" }}
          value={stroke}
          onChange={(val) => setStroke(val)}
          icon={<Rectangle />}
        />
      </IconTray>
      <IconTray style={{ position: "fixed", marginLeft: "45vw" }}>
        <IconButton
          selected={actionType === "pointer"}
          onClick={() => setActionType("pointer")}
          style={{ padding: "7px", margin: "0.125rem" }}
        >
          <Pointer />
        </IconButton>
        <IconButton
          selected={actionType === "rectangle"}
          onClick={() => setActionType("rectangle")}
          style={{ padding: "7px", margin: "0.125rem" }}
        >
          <Rectangle />
        </IconButton>
        <IconButton
          selected={actionType === "triangle"}
          onClick={() => setActionType("triangle")}
          style={{ padding: "7px", margin: "0.125rem" }}
        >
          <Triangle />
        </IconButton>
      </IconTray>
      <RoughCanvas
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onLongPress={handleLongPress}
      />
    </div>
  );
}

function generatePoints(type: ShapeTypes, start: Point, end: Point): Point[] {
  if (type === "rectangle") {
    return [start, [end[0], start[1]], end, [start[0], end[1]]];
  } else if (type === "triangle") {
    return [start, [end[0], start[1]], [(start[0] + end[0]) / 2, end[1]]];
  } else if (type === "circle") {
    return [start];
  } else {
    return [];
  }
}

function findShapeAtPoint(shapes: Shape[], point: Point): Shape | undefined {
  const found = shapes
    .reverse()
    .find((shape) =>
      checkPointInShape({ type: "polygon", points: shape.points }, point)
    );
  return found;
}

export default App;
