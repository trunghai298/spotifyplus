/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { MaxInt, Page, Track } from "@spotify/web-api-ts-sdk";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import sdk from "../lib/spotify-sdk/ClientInstance";
import { setTrack } from "../lib/redux/slices/playerSlices";
import { map } from "lodash";
import { Loader } from "./Loader";
import Image from "next/image";

type TimeRange = {
  title: "Last 4 weeks" | "Last 6 months" | "All time";
  value: "short_term" | "medium_term" | "long_term";
  numberOfTracks?: MaxInt<50>;
};

function TopTracks() {
  const [yourTopTracks, setYourTopTracks] = useState<Page<Track>>();
  const dispatch = useAppDispatch();
  const { track: selectedTrack } = useAppSelector((state) => state.player);
  const router = useRouter();

  const [timeRange, setTimeRange] = useState<TimeRange>({
    title: "Last 4 weeks",
    value: "short_term",
  });

  useEffect(() => {
    (async () => {
      try {
        const results = await sdk.currentUser.topItems(
          "tracks",
          timeRange.value,
          timeRange.numberOfTracks || 20
        );
        setYourTopTracks(results);
      } catch (error: any) {
        signOut();
      }
    })();
  }, [timeRange]);

  const onClickTrack = (track: Track) => {
    dispatch(setTrack(track));
  };

  if (!yourTopTracks) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col space-y-4 relative">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-4 gap-y-2">
        <h2 className="text-2xl text-white font-bold">Your Top Tracks</h2>
        <div className="flex gap-x-3">
          <h4
            className={`text-md text-white font-normal ${
              timeRange.value === "short_term"
                ? "bg-spotify-green bg-opacity-90 rounded-md px-2"
                : ""
            } cursor-pointer`}
            onClick={() =>
              setTimeRange({ title: "Last 4 weeks", value: "short_term" })
            }
          >
            Last 4 weeks
          </h4>
          <h4
            className={`text-md text-white font-normal ${
              timeRange.value === "medium_term"
                ? "bg-spotify-green bg-opacity-90 rounded-md px-2"
                : ""
            } cursor-pointer`}
            onClick={() =>
              setTimeRange({ title: "Last 6 months", value: "medium_term" })
            }
          >
            Last 6 months
          </h4>
          <h4
            className={`text-md text-white font-normal ${
              timeRange.value === "long_term"
                ? "bg-spotify-green bg-opacity-90 rounded-md px-2"
                : ""
            } cursor-pointer`}
            onClick={() =>
              setTimeRange({ title: "All time", value: "long_term" })
            }
          >
            All time
          </h4>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
        {map(yourTopTracks.items, (track) => (
          <div className="flex flex-col space-y-2" key={track.id}>
            <div className="relative">
              <img
                src={track.album.images[0].url}
                alt=""
                className="rounded-md"
                width={200}
                height={200}
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
