/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession, signIn } from "next-auth/react";
import BackGround from "../assets/bg.png";
import { Button } from "@/components/ui/button";
import SongSymmetry from "./components/SongSymmetry";
import Logo from "../assets/logo2.webp";

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
        <div className="relative px-40 flex flex-col sm:flex-row sm:items-end justify-around h-full min-h-screen max-h-screen overflow-hidden">
          <div className="absolute -top-[10%] right-0 w-full opacity-10 z-0 overflow-hidden">
            <h1 className="w-full text-400px font-extrabold">ISUMUSIC</h1>
          </div>
          <div className="absolute -bottom-[10%] right-0 w-full opacity-10 z-0 overflow-hidden">
            <h1 className="w-full text-400px font-extrabold">NEWAYNA</h1>
          </div>
          <div className="h-full min-h-screen flex flex-col items-center justify-center z-max">
            <h1 className="text-5xl font-extrabold sm:text-7xl md:text-8xl lg:text-9xl">
              Song Symmetry
            </h1>
            <div className="mt-4">
              <img src={Logo.src} alt="logo" width={80} height={80} />
            </div>
            <h3 className="text-sm sm:text-lg font-normal mt-8 px-8 text-center text-white w-[400px]">
              {
                "Explore your personalized Spotify journey with unique insights tailored just for you. Discover your music habits, top genres, and favorite artists in a whole new way."
              }
            </h3>
            <Button
              className="w-auto min-w-[300px] h-auto mt-10 text-white text-xl sm:text-3xl font-bold px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3 md:py-4 rounded-full bg-spotify-green hover:bg-spotify-green/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => signIn("spotify")}
            >
              <i className="bi bi-spotify text-lg sm:text-4xl mr-4"></i>
              Sign in with Spotify
            </Button>
          </div>
          <div className="w-full hidden sm:flex flex-col justify-start sm:justify-items-end items-end z-max">
            <img src={BackGround.src} alt="" width={500} height={800} />
          </div>
        </div>
      </div>
    );
  }

  return <SongSymmetry />;
}
