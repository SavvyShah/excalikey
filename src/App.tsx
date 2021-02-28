import React, { useState } from "react";
import "./App.scss";

import {
  trash,
  triangle,
  square,
  fill as fillIcon,
  pointer
} from "./components/icons";

import Button from "./components/Button";

import useRenderer from "./services/hooks/useRenderer";

import IconTray, { IconButton } from "./components/IconTray";
import { Point, point, ShapeTypes } from "./elements";
import ColorPicker from "./components/ColorPicker";

function App(): JSX.Element {
  const [canvasRef, Renderer] = useRenderer();
  const [drawing, setDrawing] = useState<boolean>(false);
  const [selection, setSelection] = useState<ShapeTypes | "pointer">(
    ShapeTypes.rectangle
  );
  const [fill, setFill] = useState<string>("black");
  const [stroke, setStroke] = useState<string>("black");
  const [start, setStart] = useState<Point>(point(0, 0));
  const [end, setEnd] = useState<Point>(point(0, 0));

  const handleFill = (value: string) => {
    if (selection === "pointer") {
      Renderer.setSelected({ fill: value });
    }
    setFill(value);
  };
  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (selection === "pointer") {
      const { fill, stroke } = Renderer.select(e.clientX, e.clientY);
      setFill(fill);
      setStroke(stroke);
    } else if (selection === "rectangle") {
      Renderer.setCurrent({
        type: ShapeTypes.rectangle,
        points: [start, point(end.x, start.y), end, point(start.x, end.y)],
        fill,
        stroke
      });
      setStart(point(e.clientX, e.clientY));
      setEnd(point(e.clientX, e.clientY));
      setDrawing(true);
    } else if (selection === "triangle") {
      Renderer.setCurrent({
        type: ShapeTypes.triangle,
        points: [
          start,
          point(end.x, start.y),
          point(start.x + (end.x - start.x) / 2, end.y)
        ],
        fill,
        stroke
      });
      setStart(point(e.clientX, e.clientY));
      setEnd(point(e.clientX, e.clientY));
      setDrawing(true);
    }
  };
  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (drawing) {
      e.preventDefault();
      if (selection === "rectangle") {
        Renderer.setCurrent({
          type: ShapeTypes.rectangle,
          points: [start, point(end.x, start.y), end, point(start.x, end.y)],
          fill,
          stroke
        });
        setEnd(point(e.clientX, e.clientY));
      } else if (selection === "triangle") {
        Renderer.setCurrent({
          type: ShapeTypes.triangle,
          points: [
            start,
            point(end.x, start.y),
            point(start.x + (end.x - start.x) / 2, end.y)
          ],
          fill,
          stroke
        });
        setEnd(point(e.clientX, e.clientY));
      }
    }
  };
  const handleMouseUp = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    e.preventDefault();
    setDrawing(false);
    setStart(point(0, 0));
    setEnd(point(0, 0));
    if (drawing) {
      Renderer.addCurrent();
    }
  };

  return (
    <div>
      <IconTray className="fixed">
        <Button
          className="button margin-0125 pad-1"
          onClick={() => Renderer.clear()}
          active={false}
        >
          {trash}
        </Button>
        <ColorPicker
          className="margin-0125 pad-1"
          value={fill}
          setValue={handleFill}
          icon={fillIcon}
        />
        <ColorPicker
          className="margin-0125 pad-1"
          value={stroke}
          setValue={setStroke}
          icon={square}
        />
      </IconTray>
      <IconTray className="fixed-h-center">
        <IconButton
          selected={selection === "pointer"}
          onClick={() => setSelection("pointer")}
          className="margin-0125"
          style={{ padding: "0.7rem" }}
        >
          {pointer}
        </IconButton>
        <IconButton
          selected={selection === ShapeTypes.rectangle}
          onClick={() => setSelection(ShapeTypes.rectangle)}
          className="margin-0125 pad-1"
        >
          {square}
        </IconButton>
        <IconButton
          selected={selection === ShapeTypes.triangle}
          onClick={() => setSelection(ShapeTypes.triangle)}
          className="margin-0125 pad-1"
        >
          {triangle}
        </IconButton>
      </IconTray>
      <canvas
        width={window.innerWidth}
        height={window.innerHeight}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        Canvas not supported
      </canvas>
    </div>
  );
}

export default App;
