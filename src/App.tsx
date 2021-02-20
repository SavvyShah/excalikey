import React, { useRef, useState } from "react";
import "./App.scss";

import trashIcon from "./assets/icons/trash.svg";

import Island from "./components/Island";
import Button from "./components/Button";

import type { Shape } from "./services/hooks/useRenderer";
import useRenderer from "./services/hooks/useRenderer";

function App(): JSX.Element {
  const canvasRef = useRef();
  const [drawing, setDrawing] = useState<boolean>(false);
  const Renderer = useRenderer(canvasRef.current);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    e.preventDefault();
    const newEl: Shape = {
      type: "rectangle",
      x: e.clientX,
      y: e.clientY,
      width: 0,
      height: 0,
      fill: `rgb(${Math.random() * 256},${Math.random() * 256},${
        Math.random() * 256
      })`
    };
    setDrawing(true);
    Renderer.setCurrent(newEl);
  };
  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (drawing) {
      e.preventDefault();
      if (Renderer.current.type == "rectangle") {
        const newEl = {
          x: Renderer.current.x,
          y: Renderer.current.y,
          width: e.clientX - Renderer.current.x,
          height: e.clientY - Renderer.current.y
        };
        Renderer.setCurrent({ ...Renderer.current, ...newEl });
      }
    }
  };
  const handleMouseUp = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    e.preventDefault();
    Renderer.addCurrent();
    setDrawing(false);
  };

  return (
    <div>
      <Island className="fixed">
        <Button
          className="button"
          onClick={() => {
            Renderer.clear();
          }}
        >
          <img className="icon" src={trashIcon} alt="trash" />
        </Button>
      </Island>
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
