/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks";
import { MaxInt, Page, Track } from "@spotify/web-api-ts-sdk";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import sdk from "../../lib/spotify-sdk/ClientInstance";
import { setTrack } from "../../lib/redux/slices/playerSlices";
import { map } from "lodash";
import { Loader } from "./Loader";
import Image from "next/image";
import TracksGrid from "./TracksGrid";

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
      <TracksGrid
        tracks={yourTopTracks.items}
        onClickTrack={onClickTrack}
        selectedTrack={selectedTrack}
      />
    </div>
  );
}

export default TopTracks;
