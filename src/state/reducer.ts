import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { Shape, State } from "./type";

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
      state.selected = null;
    },
    saveDrawing: (state) => {
      const { drawing } = state;
      if (drawing) {
        state.shapes[drawing.id] = drawing;
        state.drawing = null;
      }
    },
    select: (state, action: PayloadAction<string | null>) => {
      const id = action.payload;
      if (id && state.shapes[id]) {
        state.selected = state.shapes[id];
      }
    },
    deleteSelected: (state) => {
      const { selected } = state;
      if (selected) {
        delete state.shapes[selected.id];
        state.selected = null;
      }
    },
  },
});

export const { draw, select, saveDrawing } = slice.actions;

export default slice.reducer;
