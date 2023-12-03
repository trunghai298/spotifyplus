"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import {
  Album,
  PlaylistedTrack,
  SimplifiedTrack,
  Track,
} from "@spotify/web-api-ts-sdk";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import sdk from "../lib/spotify-sdk/ClientInstance";
import { setTrack } from "../lib/redux/slices/playerSlices";
import { map } from "lodash";
import Image from "next/image";
import { Loader } from "../components/Loader";
import Container from "../components/Container";

type AlbumTracks = {
  type: "album";
  tracks: SimplifiedTrack[];
  images: Album["images"];
};
type PlaylistedTracks = {
  type: "playlist";
  tracks: PlaylistedTrack[];
};

type Tracks = PlaylistedTracks | AlbumTracks | undefined;

function TopTracks() {
  const [tracks, setTracks] = useState<Tracks | undefined>();
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const type = searchParams.get("type");
      const id = searchParams.get("id");
      if (!type || !id) return;
      try {
        let results;
        if (type === "playlist") {
          results = (await sdk.playlists.getPlaylistItems(id)).items;
          setTracks({ type, tracks: results });
        } else if (type === "album") {
          const album = await sdk.albums.get(id);
          setTracks({ type, tracks: album.tracks.items, images: album.images });
        }
      } catch (error: any) {
        signOut();
      }
    })();
  }, []);

  const onClickTrack = (track: SimplifiedTrack | PlaylistedTrack) => {
    dispatch(setTrack(track as Track));
  };

  if (!tracks) {
    return <Loader />;
  }

  const renderAlbumTracks = (tracks: AlbumTracks) => {
    return (
      <div className="flex flex-col space-y-4 relative">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col justify-center space-y-6">
            <Image
              src={tracks.images[0].url}
              alt=""
              className="rounded-md w-full aspect-auto md:aspect-video object-cover"
              width={500}
              height={500}
              quality={100}
              loading="lazy"
            />
            <div className="flex flex-col space-y-2">
              {map(tracks.tracks, (track) => (
                <div className="flex flex-col space-y-2" key={track.id}>
                  <h3
                    className="text-lg font-bold cursor-pointer hover:underline"
                    onClick={() => onClickTrack(track)}
                  >
                    {track.name}
                  </h3>
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

  const renderPlaylistTracks = (tracks: PlaylistedTracks) => {
    return (
      <div className="flex flex-col space-y-4 relative">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col justify-center space-y-6">
            <div className="flex flex-col space-y-2">
              {map(tracks.tracks, (track: { track: Track }) => (
                <div
                  className="flex flex-row space-x-4 items-center justify-start"
                  key={track.track.id}
                >
                  <div>
                    <Image
                      src={track.track.album.images[0].url}
                      alt=""
                      className="rounded-md w-[40px] h-[40px] aspect-square object-cover"
                      width={100}
                      height={100}
                      quality={100}
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold cursor-pointer hover:underline"
                      onClick={() => onClickTrack(track.track)}
                    >
                      {track.track.name}
                    </h3>
                    <p
                      className="text-gray-500 cursor-pointer hover:underline"
                      onClick={() => router.push(`/artists/${track.track.id}`)}
                    >
                      {track.track.name}
                    </p>
                  </div>
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
      {tracks.type === "album"
        ? renderAlbumTracks(tracks)
        : renderPlaylistTracks(tracks)}
    </Container>
  );
}

export default TopTracks;
