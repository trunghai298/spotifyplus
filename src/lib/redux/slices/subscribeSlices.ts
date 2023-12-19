import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";

type ISubscribe = {
  openDialog: boolean;
};

export const subscribeSlice = createSlice({
  name: "subscribe",
  initialState: {
    openDialog: false,
  } as ISubscribe,
  reducers: {
    openSubscribeDialog: (state) => {
      state.openDialog = true;
    },
    closeSubscribeDialog: (state) => {
      state.openDialog = false;
    },
  },
});

// Action creators are generated for each case reducer function
const { openSubscribeDialog, closeSubscribeDialog } = subscribeSlice.actions;

export const setOpenSubscribeDialog = () => async (dispatch: AppDispatch) => {
  dispatch(openSubscribeDialog());
};

export const setCloseSubscribeDialog = () => async (dispatch: AppDispatch) => {
  dispatch(closeSubscribeDialog());
};

export default subscribeSlice.reducer;
