"use client";
import { Track } from "@spotify/web-api-ts-sdk";
import React, { FC, HTMLAttributes } from "react";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { setTrack } from "../lib/redux/slices";

export const EmbedPlayer: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const dispatch = useAppDispatch();
  const { track } = useAppSelector((state) => state.player);

  if (!track) return null;

  return (
    <div className="inline-block fixed md:w-1/3 lg:w-1/4 transition ease-in-out duration-500 bottom-0 right-8 z-50 box-border">
      <i
        className="bi bi-x-circle-fill text-gray-300 text-1xl cursor-pointer absolute -right-1 -top-3"
        onClick={() => dispatch(setTrack(undefined))}
      />
      <iframe
        src={`https://open.spotify.com/embed/track/${track?.id}?utm_source=generator`}
        width="100%"
        height="150"
        marginWidth={100}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
};
