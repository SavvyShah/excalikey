import React, { useEffect, useRef, useState } from "react";
import "./App.scss";

import rough from "roughjs";

import trashIcon from "./assets/icons/trash.svg";
import rectangleIcon from "./assets/icons/rectangle.svg";
import triangleIcon from "./assets/icons/triangle.svg";

import Button from "./components/Button";

import { Rectangle, Triangle, ExcaliShape, ShapeTypes } from "./elements";
import IconTray, { IconButton } from "./components/IconTray";
import { Drawable } from "roughjs/bin/core";

interface Shape {
  drawable: Drawable;
  x: number;
  y: number;
}

function App(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>();
  const [drawing, setDrawing] = useState<boolean>(false);
  const [selectedElement, setSelectedElement] = useState<ShapeTypes>(
    ShapeTypes.rectangle
  );
  const [current, setCurrent] = useState<Shape>();

  useEffect(() => {
    if (current && current.drawable) {
      const roughCanvas = rough.canvas(canvasRef.current);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      roughCanvas.draw(current.drawable);
    }
  }, [current]);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    e.preventDefault();
    const roughCanvas = rough.canvas(canvasRef.current);
    const generator = roughCanvas.generator;
    const rectangle = generator.rectangle(e.clientX, e.clientY, 0, 0);
    const shape = {
      x: e.clientX,
      y: e.clientY,
      drawable: rectangle
    };
    setCurrent(shape);
    setDrawing(true);
  };
  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (drawing) {
      e.preventDefault();
      const roughCanvas = rough.canvas(canvasRef.current);
      const generator = roughCanvas.generator;
      const rectangle = generator.rectangle(
        current.x,
        current.y,
        e.clientX - current.x,
        e.clientY - current.y
      );
      const shape = {
        x: current.x,
        y: current.y,
        drawable: rectangle
      };
      setCurrent(shape);
    }
  };
  const handleMouseUp = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    e.preventDefault();
    setDrawing(false);
    setCurrent({ x: 0, y: 0, drawable: null });
  };

  return (
    <div>
      <IconTray className="fixed">
        <Button className="button" active={false}>
          <img src={trashIcon} className="icon" alt="trash" />
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
