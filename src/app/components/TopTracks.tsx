"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { Page, Track } from "@spotify/web-api-ts-sdk";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import sdk from "../lib/spotify-sdk/ClientInstance";
import { setTrack } from "../lib/redux/slices";
import { map } from "lodash";
import { Loader } from "./Loader";
import Image from "next/image";

function TopTracks() {
  const [yourTopTracks, setYourTopTracks] = useState<Page<Track>>();
  const dispatch = useAppDispatch();
  const { track: selectedTrack } = useAppSelector((state) => state.player);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const results = await sdk.currentUser.topItems(
          "tracks",
          "long_term",
          15
        );
        setYourTopTracks(results);
      } catch (error: any) {
        signOut();
      }
    })();
  }, []);

  const onClickTrack = (track: Track) => {
    dispatch(setTrack(track));
  };

  if (!yourTopTracks) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col space-y-4 relative">
      <h2 className="text-2xl text-white font-bold mb-2">Your Top Tracks</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
        {map(yourTopTracks.items, (track) => (
          <div className="flex flex-col space-y-2" key={track.id}>
            <div className="relative">
              <Image
                src={track.album.images[0].url}
                alt=""
                className="rounded-md"
                width={200}
                height={200}
                quality={100}
                loading="lazy"
              />
              <div
                className={`h-full w-full absolute top-0 left-0 flex justify-center items-center ${
                  selectedTrack?.id === track.id ? `opacity-100` : `opacity-0`
                } hover:opacity-100 cursor-pointer`}
                onClick={() => onClickTrack(track)}
              >
                {selectedTrack?.id === track.id ? (
                  <i className="bi bi-pause-circle-fill text-gray-300 text-4xl" />
                ) : (
                  <i className="bi bi-play-circle-fill text-gray-300 text-4xl"></i>
                )}
              </div>
            </div>
            <h3
              className="text-lg font-bold cursor-pointer hover:underline"
              onClick={() => onClickTrack(track)}
            >
              {track.name}
            </h3>
            <p
              className="text-gray-500 cursor-pointer hover:underline"
              onClick={() => router.push(`/artists/${track.artists[0].id}`)}
            >
              {track.artists[0].name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopTracks;
