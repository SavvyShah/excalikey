import React, { useEffect, useRef, useState } from "react";
import "./App.scss";

import trashIcon from "./assets/icons/trash.svg";
import rectangleIcon from "./assets/icons/rectangle.svg";
import triangleIcon from "./assets/icons/triangle.svg";

import Button from "./components/Button";

import useRenderer from "./services/hooks/useRenderer";

import IconTray, { IconButton } from "./components/IconTray";
import { point, ShapeTypes } from "./elements";

function App(): JSX.Element {
  const [canvasRef, Renderer] = useRenderer();
  const [drawing, setDrawing] = useState<boolean>(false);
  const [selectedElement, setSelectedElement] = useState<ShapeTypes>(
    ShapeTypes.rectangle
  );

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    e.preventDefault();
    Renderer.setCurrent({
      type: selectedElement,
      start: point(e.clientX, e.clientY),
      end: point(e.clientX, e.clientY)
    });
    setDrawing(true);
  };
  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (drawing) {
      e.preventDefault();
      Renderer.setCurrent({ end: point(e.clientX, e.clientY) });
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
        <Button className="button" active={false}>
          <img
            src={trashIcon}
            onClick={() => Renderer.clear()}
            className="icon"
            alt="trash"
          />
        </Button>
      </IconTray>
      <IconTray className="fixed-h-center">
        <IconButton
          selected={selectedElement === ShapeTypes.rectangle}
          onClick={() => setSelectedElement(ShapeTypes.rectangle)}
          className="margin-025"
        >
          <img src={rectangleIcon} alt="rectangle" />
        </IconButton>
        <IconButton
          selected={selectedElement === ShapeTypes.triangle}
          onClick={() => setSelectedElement(ShapeTypes.triangle)}
          className="margin-025"
        >
          <img src={triangleIcon} alt="triangle" />
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
