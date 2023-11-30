/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Page,
  SearchResults,
  SpotifyApi,
  TopTracksResult,
  Track,
} from "@spotify/web-api-ts-sdk";
import { useSession, signOut, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import sdk from "./lib/spotify-sdk/ClientInstance";
import "bootstrap-icons/font/bootstrap-icons.css";
import { map } from "lodash";

export default function Home() {
  const session = useSession();

  if (!session || session.status !== "authenticated") {
    return (
      <div>
        <h1>Spotify Web API Typescript SDK in Next.js</h1>
        <button
          className="bg-green-600 text-white w-auto px-4 py-2 rounded-full"
          onClick={() => signIn("spotify")}
        >
          Sign in with Spotify
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 px-4 py-4 sm:px-6 sm:py-4 md:px-8 md:py-6 lg:px-24 lg:py-12">
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-x-1 items-center">
          <i className="bi bi-spotify"></i>
          <h2 className="text-2xl font-bold">Spotify Plus</h2>
        </div>
        <div className="flex items-center justify-between gap-x-1 bg-gray-300 px-2 py-1 rounded-xl">
          <img
            src={session.data.user?.image || ""}
            alt=""
            width={30}
            height={30}
            className="rounded-full"
          />
          <h2 className="text-md font-medium text-gray-900">
            {session.data.user?.name}
          </h2>
        </div>
      </div>
      <WelcomeSection sdk={sdk} />
      <TopTracks sdk={sdk} />
      {/* <SpotifySearch sdk={sdk} /> */}
    </div>
  );
}

const WelcomeSection = ({ sdk }: { sdk: SpotifyApi }) => {
  const [searchInput, setSearchInput] = useState("");

  const search = async () => {
    const results = await sdk.search(searchInput, ["track"]);
    console.log(results);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <section className="w-full py-4 md:py-8 lg:py-12 xl:py-18">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Personalized Insights from Spotify
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Uncover your music journey with personalized analytics and data.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form className="flex space-x-2">
              <input
                className="flex text-gray-900 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-lg flex-1"
                placeholder="Enter your artist name or song title"
                type="text"
                value={searchInput}
                onChange={(e) => onInputChange(e)}
              />
              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                type="submit"
                onClick={search}
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const TopTracks = ({ sdk }: { sdk: SpotifyApi }) => {
  const [yourTopTracks, setYourTopTracks] = useState<Page<Track>>();
  const [selectedTrack, setSelectedTrack] = useState<Track>();

  useEffect(() => {
    (async () => {
      try {
        const results = await sdk.currentUser.topItems("tracks", "medium_term" , 50);
        console.log(results);
        setYourTopTracks(results);
      } catch (error: any) {
        signOut();
      }
    })();
  }, []);

  const onClickTrack = (track: Track) => {
    setSelectedTrack(track);
  };

  if (!yourTopTracks) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-4 relative">
      {selectedTrack && (
        <div className="inline-block fixed md:w-1/3 lg:w-1/4 transition ease-in-out duration-500 bottom-0 right-8 z-50 box-border">
          <i className="bi bi-x-circle-fill text-gray-300 text-1xl cursor-pointer absolute -right-1 -top-3" onClick={() => setSelectedTrack(undefined)} />
          <iframe
            src={`https://open.spotify.com/embed/track/${selectedTrack.id}?utm_source=generator`}
            width="100%"
            height="150"
            marginWidth={100}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      )}
      {/* <audio
        src={selectedTrack?.preview_url as string}
        autoPlay={!!selectedTrack}
      ></audio> */}
      <h2 className="text-2xl font-bold">Your Top Tracks</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
        {map(yourTopTracks.items, (track) => (
          <div className="flex flex-col space-y-2" key={track.id}>
            <div className="relative">
              <img
                src={track.album.images[0].url}
                alt=""
                className="rounded-md"
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

            <h3 className="text-lg font-bold cursor-pointer hover:underline">
              {track.name}
            </h3>
            <p className="text-gray-500 cursor-pointer hover:underline">
              {track.artists[0].name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
