import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "./store";
import { Track } from "@spotify/web-api-ts-sdk";

interface IPlayer {
  track: Track | undefined;
}

export const playerSlice = createSlice({
  name: "player",
  initialState: {
    track: undefined,
  } as IPlayer,
  reducers: {
    setTrack: (state, action: PayloadAction<{ track: Track | undefined }>) => {
      state.track = action.payload.track;
    },
  },
});

// Action creators are generated for each case reducer function
const { setTrack: setTrackAction } = playerSlice.actions;

export const setTrack =
  (track: Track | undefined) => async (dispatch: AppDispatch) => {
    dispatch(setTrackAction({ track }));
  };

export default playerSlice.reducer;
