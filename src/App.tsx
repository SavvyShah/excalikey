import React, { useState } from "react";
import "./App.scss";

import { trash, triangle, square, fill as fillIcon } from "./components/icons";

import Button from "./components/Button";

import useRenderer from "./services/hooks/useRenderer";

import IconTray, { IconButton } from "./components/IconTray";
import { point, ShapeTypes } from "./elements";
import ColorPicker from "./components/ColorPicker";

function App(): JSX.Element {
  const [canvasRef, Renderer] = useRenderer();
  const [drawing, setDrawing] = useState<boolean>(false);
  const [selectedElement, setSelectedElement] = useState<ShapeTypes>(
    ShapeTypes.rectangle
  );
  const [fill, setFill] = useState<string>("black");
  const [stroke, setStroke] = useState<string>("black");

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    e.preventDefault();
    Renderer.setCurrent({
      type: selectedElement,
      start: point(e.clientX, e.clientY),
      end: point(e.clientX, e.clientY),
      fill,
      stroke
    });
    setDrawing(true);
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
          selected={selectedElement === ShapeTypes.rectangle}
          onClick={() => setSelectedElement(ShapeTypes.rectangle)}
          className="margin-0125 pad-1"
        >
          {square}
        </IconButton>
        <IconButton
          selected={selectedElement === ShapeTypes.triangle}
          onClick={() => setSelectedElement(ShapeTypes.triangle)}
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
