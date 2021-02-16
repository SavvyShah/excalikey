import React, { useRef, useEffect, useState } from "react";
import "./App.scss";

const clearCanvas = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
};
const refreshCanvas = (ctx: CanvasRenderingContext2D, states) => {
  clearCanvas(ctx);
  states.forEach(({ x, y, width, height, scale }) => {
    ctx.fillRect(x, y, width, height);
  });
};
function App() {
  const canvasRef = useRef();
  const ctx: CanvasRenderingContext2D =
    canvasRef.current && canvasRef.current.getContext("2d");
  const [state, setState] = useState([]);
  const [current, setCurrent] = useState({
    type: "rect",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (ctx && state.length) {
      refreshCanvas(ctx, [...state, current]);
    } else if (ctx) {
      refreshCanvas(ctx, [current]);
    }
  });
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    e.preventDefault();
    const newEl = {
      type: "rect",
      x: e.clientX,
      y: e.clientY,
      width: 0,
      height: 0,
    };
    setDrawing(true);
    setCurrent(newEl);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (drawing) {
      //Do nothing for now
      e.preventDefault();
      const newEl = {
        type: "rect",
        x: current.x,
        y: current.y,
        width: (e.clientX - current.x),
        height: (e.clientY - current.y),
      };
      
      setCurrent(newEl);
    }
  };
  const handleMouseUp = (e:React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const newEl = {
      confirmed: true,
    };
    const newState = [...state];
    newState.push({ ...current, ...newEl });
    setDrawing(false);
    setState(newState);
  };

  return (
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
  );
}

export default App;
