"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export const Header = ({ session }: any) => {
  const router = useRouter();

  if (!session) return null;
  return (
    <div className="sticky top-0 w-full p-2 sm:px-10 bg-gray-900 z-max h-24 flex justify-between items-center">
      <div className="flex gap-x-1 items-center">
        <i className="bi bi-spotify"></i>
        <a
          className="text-2xl font-bold text-white cursor-pointer"
          onClick={() => router.push("/")}
        >
          Spotify Plus
        </a>
      </div>
      <div className="flex items-center justify-between gap-x-1 bg-none sm:bg-gray-300 px-0 sm:px-4 py-1 rounded-xl">
        <Image
          src={session.user.image || ""}
          alt=""
          width={30}
          height={30}
          quality={100}
          className="rounded-full"
        />
        <h2 className="text-md hidden sm:inline md:inline font-bold text-gray-900">
          {session.user.name}
        </h2>
      </div>
    </div>
  );
};
