"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import sdk from "../lib/spotify-sdk/ClientInstance";
import Container from "../components/Container";
import { debounce } from "lodash";
import { AudioFeatures, Track } from "@spotify/web-api-ts-sdk";
import Image from "next/image";
import { setTrack } from "../lib/redux/slices/playerSlices";
import Tooltip from "../components/Tooltip";

type SongRecommendation = {
  source: Track;
  recommendation: {
    tracks: Track[];
    seeds: {
      id: string;
      href: string;
      type: string;
      initialPoolSize: number;
      afterFilteringSize: number;
      afterRelinkingSize: number;
    }[];
  };
};

function SongLikeX() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResult, setSearchResult] = useState<Track[]>();
  const [songRecommendation, setSongRecommendation] =
    useState<SongRecommendation>();

  const dispatch = useAppDispatch();
  const router = useRouter();

  const onQueryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    debountSearch(e.target.value);
  };

  const onSearchTrack = async (q: string) => {
    if (q.length > 2) {
      const results = await sdk.search(q, ["track"], undefined, 5);
      console.log("results", results);
      setSearchResult(results.tracks.items);
    }
  };

  const recommendationAlgorithm = async (trackFeatures: AudioFeatures) => {
    const audioVibes = {
      acousticness: trackFeatures.acousticness,
      danceability: trackFeatures.danceability,
      energy: trackFeatures.energy,
      instrumentalness: trackFeatures.instrumentalness,
      liveness: trackFeatures.liveness,
      speechiness: trackFeatures.speechiness,
      valence: trackFeatures.valence,
    };

    const sortVides = Object.entries(audioVibes)
      .sort((a, b) => a[1] - b[1])
      .reverse();

    const rcmArguments = {
      [`min_${sortVides[0][0]}`]: sortVides[0][1] - 0.1,
      [`max_${sortVides[0][0]}`]: sortVides[0][1] + 0.1,
      [`min_${sortVides[1][0]}`]: sortVides[1][1] - 0.1,
      [`max_${sortVides[1][0]}`]: sortVides[1][1] + 0.1,
    };
    return rcmArguments;
  };

  const onGetRecommendation = async (
    track: Track,
    audioFeaturesInput?: AudioFeatures
  ) => {
    const audioFeatures = audioFeaturesInput
      ? audioFeaturesInput
      : await sdk.tracks.audioFeatures(track.id);
    const rcmArguments = await recommendationAlgorithm(audioFeatures);
    const results = await sdk.recommendations.get({
      seed_tracks: [track.id],
      ...rcmArguments,
      limit: 20,
    });
    console.log("results", results);
    setSongRecommendation({ source: track, recommendation: results });
  };

  useEffect(() => {
    (async () => {
      window.scrollTo(0, 0);
      const searchParams = new URLSearchParams(window.location.search);
      const trackId = searchParams.get("trackId");
      if (!trackId) return;
      try {
        const [track, audioFeatures] = await Promise.all([
          sdk.tracks.get(trackId),
          sdk.tracks.audioFeatures(trackId),
        ]);
        onGetRecommendation(track, audioFeatures);
      } catch (error: any) {
        signOut();
      }
    })();
  }, []);

  const debountSearch = debounce(onSearchTrack, 1000);

  const renderRecommendation = () => {
    if (!songRecommendation) return null;
    return (
      <div className="w-full flex flex-col space-y-10 justify-center items-center">
        <div className="w-full flex flex-col space-y-8 justify-center items-center">
          <div className="w-full flex flex-col space-y-3 sm:flex-row sm:space-x-4 justify-start sm:items-end">
            <div className="h-full flex flex-row space-x-2 sm:space-x-4 grow items-end">
              <div className="relative">
                <Image
                  width={200}
                  height={200}
                  quality={100}
                  src={songRecommendation.source.album.images[0].url}
                  alt=""
                  className="w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] md:w-[200px] md:h-[200px] lg:w-[250px] lg:h-[250px] object-contain rounded-md"
                />
                <div
                  className={`h-full w-full absolute top-0 left-0 flex justify-center items-center opacity-0 hover:opacity-100 cursor-pointer`}
                  onClick={() => dispatch(setTrack(songRecommendation.source))}
                >
                  <i className="bi bi-play-circle-fill text-gray-300 text-4xl"></i>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <h3 className="text-xl font-bold text-spotify-green-dark flex">
                  Songs Similar to
                </h3>
                <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold sm:font-extrabold text-white">
                  {songRecommendation.source.name}
                </h1>
                <h2 className="text-md font-medium text-white overflow-hidden text-ellipsis">
                  by {songRecommendation.source.artists[0].name}
                </h2>
              </div>
            </div>
            <div className="w-50 sm:w-100 md:w-100 lg:w-100 flex flex-row justify-end">
              <button className="flex items-center flex-row justify-between space-x-2  bg-spotify-green-dark hover:bg-spotify-green-light py-2 px-4 rounded-3xl">
                <i className="bi bi-spotify text-white text-2xl" />
                <h3 className="text-white text-sm font-bold uppercase">
                  Save Playlist
                </h3>
              </button>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col space-y-2 justify-center items-center">
          <div className="w-full rounded-sm flex flex-col space-y-4">
            {songRecommendation?.recommendation.tracks.map((track) => (
              <div className="w-full flex flex-col" key={track.id}>
                <div
                  className="w-full flex flex-row space-x-4 justify-start items-center rounded-md cursor-pointer"
                  onClick={() => dispatch(setTrack(track))}
                >
                  <Image
                    width={100}
                    height={100}
                    quality={100}
                    className="w-[40px] h-[40px] object-contain rounded-lg"
                    src={track.album.images[0].url}
                    alt=""
                  />
                  <div className="flex flex-col grow space-y-1">
                    <h2 className="text-lg font-bold text-white">
                      {track.name}
                    </h2>
                    <h2 className="text-md font-normal text-white overflow-hidden text-ellipsis">
                      {track.artists[0].name}
                    </h2>
                  </div>
                  <Tooltip text="Get Similar Songs">
                    <i
                      className="bi bi-search text-white text-xl"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.replace(`/songlikex?trackId=${track.id}`);
                      }}
                    />
                  </Tooltip>
                  <i className="bi bi-play-circle-fill text-white text-2xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSearchResult = () => {
    return (
      <>
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="w-full flex flex-col space-y-2 justify-center items-center">
            <h1 className="text-4xl font-bold text-white flex">Song Like X</h1>
            <h2 className="text-xl font-normal text-white flex">
              Find songs like your favorite song
            </h2>
          </div>
        </div>
        <div className="w-full flex flex-col space-y-2 justify-center items-center">
          <input
            className="flex w-80 sm:w-[600px] h-14 text-gray-900 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Type a song name"
            type="text"
            value={searchQuery}
            onChange={onQueryChange}
          />
          {searchResult && (
            <div className="w-80 sm:w-[600px] rounded-sm flex flex-col p-4 space-y-4 bg-white">
              {searchResult.map((track) => (
                <div className="w-full flex flex-col" key={track.id}>
                  <div
                    className="w-full flex flex-row space-x-4 justify-start items-center px-2 py-1 rounded-md hover:bg-gray-400 cursor-pointer"
                    onClick={() => onGetRecommendation(track)}
                  >
                    <Image
                      width={100}
                      height={100}
                      className="w-[40px] h-[40px] object-contain rounded-md"
                      src={track.album.images[0].url}
                      alt=""
                    />
                    <div className="flex flex-col grow space-y-1">
                      <h2 className="text-lg font-bold text-gray-900">
                        {track.name}
                      </h2>
                      <h2 className="text-md font-normal text-gray-500 overflow-hidden text-ellipsis">
                        {track.artists[0].name}
                      </h2>
                    </div>
                    <i className="bi bi-chevron-right text-white text-2xl" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };
  console.log("songRecommendation", songRecommendation);
  return (
    <Container>
      <div className="mt-12 flex flex-col space-y-6 items-center justify-center w-full h-full">
        {songRecommendation ? renderRecommendation() : renderSearchResult()}
      </div>
    </Container>
  );
}

export default SongLikeX;
