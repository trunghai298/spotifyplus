/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks";
import {
  Album,
  Playlist,
  PlaylistedTrack,
  SimplifiedTrack,
  Track,
} from "@spotify/web-api-ts-sdk";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import sdk from "../../lib/spotify-sdk/ClientInstance";
import { setTrack } from "../../lib/redux/slices/playerSlices";
import { cloneDeep, map, startCase, sumBy } from "lodash";
import { Loader } from "../components/Loader";
import Container from "../components/Container";
import { millisToMinAndSecs } from "@/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

type AlbumTracks = {
  type: "album";
  album: Album;
};
type PlaylistedTracks = {
  type: "playlist";
  playlist: Playlist;
};

type Tracks = PlaylistedTracks | AlbumTracks | undefined;

function TopTracks() {
  const [tracksData, setTracksData] = useState<Tracks | undefined>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      window.scrollTo(0, 0);
      const searchParams = new URLSearchParams(window.location.search);
      const type = searchParams.get("type");
      const id = searchParams.get("id");
      if (!type || !id) return;
      try {
        if (type === "playlist") {
          const playlist = await sdk.playlists.getPlaylist(id);
          setTracksData({ type, playlist });
        } else if (type === "album") {
          const album = await sdk.albums.get(id);
          setTracksData({ type, album });
        }
      } catch (error: any) {
        signOut();
      }
    })();
  }, []);

  const onClickTrack = (track: SimplifiedTrack | PlaylistedTrack) => {
    dispatch(setTrack(track as Track));
  };

  if (!tracksData) {
    return <Loader />;
  }

  const renderAlbumTracks = (album: Album) => {
    return (
      <div className="flex flex-col space-y-4 relative">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col justify-center space-y-8">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-x-4">
              <img
                src={album.images[0].url}
                alt=""
                width={300}
                height={300}
                loading="lazy"
                className="max-h-[200px] sm:max-h-[250px] md:max-h-[250px] lg:max-h-[300px] aspect-square object-cover object-center rounded-lg shadow-md"
              />
              <div className="flex flex-col space-y-2 items-start justify-end">
                <h4 className="text-white text-sm font-medium">
                  {startCase(album.album_type)}
                </h4>
                <h2 className="text-white text-4xl font-extrabold cursor-pointer hover:underline">
                  {album.name}
                </h2>
                <div className="flex items-center justify-between space-x-4">
                  <h3
                    className="text-white text-xs sm:text-sm md:text-md font-medium cursor-pointer hover:underline"
                    onClick={() =>
                      router.push(`/artists/${album.artists[0].id}`)
                    }
                  >
                    {album.artists[0].name}
                  </h3>
                  <h3 className="text-gray-400 text-xs sm:text-sm md:text-md font-normal">
                    {album.release_date}
                  </h3>
                  <h3 className="text-gray-400 text-xs sm:text-sm md:text-md font-normal">
                    {album.total_tracks} songs
                  </h3>
                  <h3 className="text-gray-400 text-xs sm:text-sm md:text-md font-normal">
                    {millisToMinAndSecs(
                      sumBy(album.tracks.items, (track) => track.duration_ms)
                    )}
                  </h3>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              {map(album.tracks.items, (track) => (
                <div className="flex flex-col space-y-2" key={track.id}>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-gray-400 text-sm font-normal">
                      {track.track_number}.
                    </h3>
                    <h3
                      className="text-lg font-bold cursor-pointer hover:underline"
                      onClick={() => onClickTrack(track)}
                    >
                      {track.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <p
                      className="text-gray-500 cursor-pointer hover:underline"
                      onClick={() =>
                        router.push(`/artists/${track.artists[0].id}`)
                      }
                    >
                      {track.artists[0].name}
                    </p>
                    <i
                      className="bi bi-play-circle text-gray-500"
                      onClick={() => onClickTrack(track)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const onRemoveTrack = async (pId: string, uri: string) => {
    try {
      await sdk.playlists.removeItemsFromPlaylist(pId, {
        tracks: [{ uri: uri }],
      });
      const playlistData = cloneDeep(tracksData) as PlaylistedTracks;
      const filteredTracks = playlistData.playlist.tracks.items.filter(
        (track) => track.track.uri !== uri
      );
      playlistData.playlist.tracks.items = filteredTracks;
      setTracksData(playlistData);
    } catch (error) {}
  };

  const onDeletePlaylist = async (pId: string) => {
    try {
      await sdk.currentUser.playlists.unfollow(pId);
      toast({
        title: "Playlist deleted",
        description: "Your playlist has been deleted successfully",
      });
    } catch (error) {}
  };

  const renderPlaylistTracks = (playlist: Playlist) => {
    return (
      <div className="flex flex-col space-y-4 relative">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col justify-center space-y-6">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-x-4">
              <img
                src={playlist.images[0].url}
                alt=""
                className="rounded-md aspect-video sm:aspect-square sm:max-w-[200px] sm:max-h-[200px] object-cover object-top"
                width={500}
                height={100}
                loading="lazy"
              />
              <div className="flex flex-col space-y-2 items-start justify-end">
                <h4 className="text-white text-sm font-medium">
                  {startCase(playlist.type)}
                </h4>
                <h2 className="text-white text-4xl font-bold cursor-pointer hover:underline">
                  {playlist.name}
                </h2>
                <div className="flex items-center justify-between space-x-4">
                  <h3
                    className="text-white text-xs sm:text-sm md:text-md font-medium cursor-pointer hover:underline"
                    onClick={() => router.push(`/artists/${playlist.owner.id}`)}
                  >
                    {playlist.owner.display_name}
                  </h3>
                  <h3 className="text-gray-400 text-xs sm:text-sm md:text-md font-normal">
                    {playlist.tracks.items.length} songs
                  </h3>
                  <h3 className="text-gray-400 text-xs sm:text-sm md:text-md font-normal">
                    {millisToMinAndSecs(
                      sumBy(
                        playlist.tracks.items,
                        (track) => track.track.duration_ms
                      )
                    )}
                  </h3>
                  <i
                    className="bi bi-trash3 text-lg cursor-pointer"
                    onClick={() => onDeletePlaylist(playlist.id)}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              {map(playlist.tracks.items, (track: { track: Track }) => (
                <div
                  className="flex flex-row items-center justify-between"
                  key={track.track.id}
                >
                  <div className="flex flex-row space-x-4 flex-1 items-center justify-start">
                    <img
                      src={track.track.album.images[0].url}
                      alt=""
                      className="rounded-md w-[40px] h-[40px] aspect-square object-cover"
                      width={100}
                      height={100}
                      loading="lazy"
                    />
                    <div>
                      <h3
                        className="text-lg font-bold cursor-pointer hover:underline"
                        onClick={() => onClickTrack(track.track)}
                      >
                        {track.track.name}
                      </h3>
                      <p
                        className="text-gray-500 cursor-pointer hover:underline"
                        onClick={() =>
                          router.push(`/artists/${track.track.artists[0].id}`)
                        }
                      >
                        {track.track.artists[0].name}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <i className="bi bi-three-dots text-lg cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white text-gray-700">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(
                            `/song-symmetry?trackId=${track.track.id}`
                          );
                        }}
                      >
                        <i className="bi bi-search text-xl" />
                        <DropdownMenuLabel>
                          Find similar songs
                        </DropdownMenuLabel>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <i className="bi bi-trash3 text-xl" />
                        <DropdownMenuLabel
                          onClick={() =>
                            onRemoveTrack(playlist.id, track.track.uri)
                          }
                        >
                          Remove from this playlist
                        </DropdownMenuLabel>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex flex-row space-x-4 items-center justify-end"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Container>
      {tracksData.type === "album"
        ? renderAlbumTracks(tracksData.album)
        : renderPlaylistTracks(tracksData.playlist)}
    </Container>
  );
}

export default TopTracks;
