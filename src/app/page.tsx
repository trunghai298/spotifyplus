"use client";

import { Page, SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { useSession, signOut, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import sdk from "./lib/spotify-sdk/ClientInstance";
import "bootstrap-icons/font/bootstrap-icons.css";
import { map } from "lodash";
import Link from "next/link";
import Image from "next/image";
import { Loader } from "./components/Loader";
import { setTrack } from "./lib/redux/slices";
import { useAppDispatch, useAppSelector } from "./lib/redux/hooks";
import { useRouter } from "next/navigation";
import BackGround from "../assets/bg.png";

export default function Home() {
  const session = useSession();

  if (!session || session.status !== "authenticated") {
    return (
      <div
        className="h-full min-h-screen max-h-screen overflow-hidden"
        style={{
          background:
            "linear-gradient(90deg, #417B94 3.82%, rgba(74, 163, 199, 0.71) 95.66%)",
        }}
      >
        <div className="relative px-40 flex flex-col sm:flex-row items-end justify-around h-full min-h-screen max-h-screen overflow-hidden">
          <div className="absolute -top-[10%] right-0 w-full opacity-10 z-0 overflow-hidden">
            <h1 className="w-full text-400px font-extrabold">ISUMUSIC</h1>
          </div>
          <div className="absolute -bottom-[10%] right-0 w-full opacity-10 z-0 overflow-hidden">
            <h1 className="w-full text-400px font-extrabold">NEWAYNA</h1>
          </div>
          <div className="h-full min-h-screen flex flex-col items-center justify-center z-max">
            <h1 className="text-5xl font-extrabold sm:text-7xl md:text-8xl lg:text-9xl">
              Spotify+_+
            </h1>
            <h3 className="text-sm sm:text-lg font-normal mt-8 px-8 text-center text-white w-[400px]">
              {
                "Explore your personalized Spotify journey with unique insights tailored just for you. Discover your music habits, top genres, and favorite artists in a whole new way."
              }
            </h3>
            <button
              className="w-auto h-auto mt-10 text-white text-xl sm:text-3xl font-bold px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3 md:py-4 rounded-full bg-spotify-green hover:bg-spotify-green/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => signIn("spotify")}
            >
              <i className="bi bi-spotify text-lg sm:text-4xl mr-4"></i>
              Sign in with Spotify
            </button>
          </div>
          <div className="w-full hidden sm:flex flex-col justify-start sm:justify-items-end items-end z-max">
            <Image
              src={BackGround}
              alt=""
              width={500}
              height={800}
              quality={100}
              objectFit="cover"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-24 lg:py-10">
      <WelcomeSection sdk={sdk} />
      <TopTracks sdk={sdk} />
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
          <div className="">
            <h1 className="text-3xl text-white font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Personalized Insights from Spotify
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl py-4 dark:text-gray-400">
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
                className="inline-flex items-center justify-center rounded-md text-sm text-white font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
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
  }, [sdk]);

  const onClickTrack = (track: Track) => {
    dispatch(setTrack(track));
  };

  if (!yourTopTracks) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col space-y-4 relative">
      {/* <EmbedPlayer track={selectedTrack} setTrack={setTrack} /> */}
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
};
