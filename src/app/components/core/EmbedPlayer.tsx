"use client";
import React, { FC, HTMLAttributes, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../lib/redux/hooks";
import { setTrack } from "../../../lib/redux/slices/playerSlices";

export const EmbedPlayer: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const dispatch = useAppDispatch();
  const { track } = useAppSelector((state) => state.player);
  const [minimized, setMinimized] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let x = 0;
    let y = 0;
    const ele = ref.current;
    if (!ele || !track) return;
    document.title = `🎶 ${track.name} - ${track.artists[0].name} 🎶`;

    const mouseDownHandler = function (e: any) {
      setDragging(true);
      x = e.clientX;
      y = e.clientY;

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    };

    const mouseMoveHandler = function (e: any) {
      setDragging(true);
      const dx = e.clientX - x;
      const dy = e.clientY - y;

      ele.style.top = `${ele.offsetTop + dy}px`;
      ele.style.left = `${ele.offsetLeft + dx}px`;

      x = e.clientX;
      y = e.clientY;
    };

    const mouseUpHandler = function () {
      setDragging(false);
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
      style={{
        width: minimized ? "80px" : "",
        right: minimized ? 0 : 8,
        left: minimized ? "unset" : "",
      }}
      className={`select-none fixed h-[80px] md:w-1/3 lg:w-1/4 ${
        dragging ? "transition" : "transition-all"
      }  ease-in-out duration-500 bottom-0 right-8 z-50 box-border`}
    >
      <div className="absolute flex items-center justify-center space-x-1 right-0 -top-7">
        <i
          className={`select-none bi ${
            minimized ? "bi-arrows-angle-expand" : "bi-dash"
          } text-gray-300 ${
            minimized ? "text-sm" : "text-2xl"
          } font-bold cursor-pointer`}
          onClick={() => setMinimized(!minimized)}
        />
        <i className="select-none bi bi-arrows-move text-gray-300 text-md cursor-pointer" />
        <i
          className="bi bi-x-lg text-gray-300 text-lg cursor-pointer "
          onClick={() => dispatch(setTrack(undefined))}
        />
      </div>
      <iframe
        src={`https://open.spotify.com/embed/track/${track?.id}?utm_source=generator`}
        width="100%"
        height={80}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
};
