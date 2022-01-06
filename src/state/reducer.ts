import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { Point, State } from "./type";

type Shape = {
  points: Point[];
  type: "rectangle" | "circle" | "triangle";
  id: string;
};

// Define the initial state using that type
const initialState: State = {
  drawing: null,
  selected: null,
  shapes: {},
};

export const slice = createSlice({
  name: "Shape",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    draw: (state, action: PayloadAction<Shape>) => {
      state.drawing = action.payload;
    },
    saveDrawing: (state) => {
      const { drawing } = state;
      if (drawing) {
        state.shapes[drawing.id] = drawing;
        state.drawing = null;
      }
    },
    select: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.shapes[id]) {
        state.selected = state.shapes[id];
      }
    },
  },
});

export const { draw, select, saveDrawing } = slice.actions;

export default slice.reducer;
