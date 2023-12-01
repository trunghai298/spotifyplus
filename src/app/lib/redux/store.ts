import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import player from "./slices";

export const store = configureStore({
  reducer: {
    player,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export type AsyncAppThunk<ReturnType = Promise<void>> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
