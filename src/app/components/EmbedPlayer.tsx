"use client";
import React, { FC, HTMLAttributes, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { setTrack } from "../lib/redux/slices";

export const EmbedPlayer: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const dispatch = useAppDispatch();
  const { track } = useAppSelector((state) => state.player);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (track) {
      document.title = track.name + "-" + track.artists[0].name;
    }
  }, [track]);

  useEffect(() => {
    let x = 0;
    let y = 0;
    const ele = ref.current;
    if (!ele || !track) return;
    const mouseDownHandler = function (e: any) {
      x = e.clientX;
      y = e.clientY;

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    };

    const mouseMoveHandler = function (e: any) {
      const dx = e.clientX - x;
      const dy = e.clientY - y;

      ele.style.top = `${ele.offsetTop + dy}px`;
      ele.style.left = `${ele.offsetLeft + dx}px`;

      x = e.clientX;
      y = e.clientY;
    };

    const mouseUpHandler = function () {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };

    ele.addEventListener("mousedown", mouseDownHandler);

    return () => {
      ele.removeEventListener("mousedown", mouseDownHandler);
      ele.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [track]);

  if (!track) return null;

  return (
    <div
      ref={ref}
      id="player"
      className="select-none fixed md:w-1/3 lg:w-1/4 transition ease-in-out duration-500 bottom-0 right-8 z-50 box-border"
    >
      <i className="opacity-0 hover:opacity-100 select-none bi bi-arrows-move text-gray-300 text-1xl cursor-pointer absolute right-6 -top-7" />
      <i
        className="bi bi-x-circle-fill text-gray-300 text-1xl cursor-pointer absolute -right-1 -top-7"
        onClick={() => dispatch(setTrack(undefined))}
      />
      <iframe
        src={`https://open.spotify.com/embed/track/${track?.id}?utm_source=generator`}
        width="100%"
        marginWidth={100}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
};
