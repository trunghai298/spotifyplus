import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { PlaylistedTrack, SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";
import { map } from "lodash";
import sdk from "../../spotify-sdk/ClientInstance";

type PlaylistTracks = {
  tracks: PlaylistedTrack[];
} & SimplifiedPlaylist;

type IPlaylist = {
  playlist: PlaylistTracks[] | undefined;
};

export const playlistSlice = createSlice({
  name: "playlist",
  initialState: {
    playlist: undefined,
  } as IPlaylist,
  reducers: {
    setPlaylist: (
      state,
      action: PayloadAction<{ playlist: PlaylistTracks[] | undefined }>
    ) => {
      state.playlist = action.payload.playlist;
    },
  },
});

// Action creators are generated for each case reducer function
const { setPlaylist: setPlaylistAction } = playlistSlice.actions;

export const setPlaylist =
  (playlist: SimplifiedPlaylist[] | undefined) =>
  async (dispatch: AppDispatch) => {
    const playlistData = await Promise.all(
      map(playlist, async (item) => {
        const playListTracks = await sdk.playlists.getPlaylistItems(item.id);
        return {
          ...item,
          tracks: playListTracks.items,
        };
      })
    );
    dispatch(setPlaylistAction({ playlist: playlistData as PlaylistTracks[] }));
  };

export default playlistSlice.reducer;
