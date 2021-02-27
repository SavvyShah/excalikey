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
import { point, ShapeTypes } from "./elements";
import ColorPicker from "./components/ColorPicker";

function App(): JSX.Element {
  const [canvasRef, Renderer] = useRenderer();
  const [drawing, setDrawing] = useState<boolean>(false);
  const [selection, setSelection] = useState<ShapeTypes | "pointer">(
    ShapeTypes.rectangle
  );
  const [fill, setFill] = useState<string>("black");
  const [stroke, setStroke] = useState<string>("black");

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (selection !== "pointer") {
      Renderer.setCurrent({
        type: selection,
        start: point(e.clientX, e.clientY),
        end: point(e.clientX, e.clientY),
        fill,
        stroke
      });
      setDrawing(true);
    } else {
      Renderer.select(e.clientX, e.clientY);
    }
  };
  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (drawing) {
      e.preventDefault();
      Renderer.setCurrent({ end: point(e.clientX, e.clientY), fill, stroke });
    }
  };
  const handleMouseUp = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    e.preventDefault();
    setDrawing(false);
    Renderer.addCurrent();
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
          setValue={setFill}
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
