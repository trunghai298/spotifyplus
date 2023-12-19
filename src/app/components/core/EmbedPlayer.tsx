"use client";
import React, { FC, HTMLAttributes, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../lib/redux/hooks";
import {
  closePlayer,
  expandPlayer,
} from "../../../lib/redux/slices/playerSlices";

export const EmbedPlayer: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const dispatch = useAppDispatch();
  const { track, type, size, src, state } = useAppSelector(
    (state) => state.player
  );
  const [minimized, setMinimized] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let x = 0;
    let y = 0;
    const ele = ref.current;
    if (!ele || state === "closed") return;
    if (track) {
      document.title = `🎶 ${track.name} - ${track.artists[0].name} 🎶`;
    }
    setMinimized(false);
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
  }, [track, state]);

  useEffect(() => {
    if (!dragging) {
      const player = ref.current;
      if (player && player.offsetLeft < 0) {
        player.style.setProperty("left", "0");
        player.style.setProperty("right", "unset");
      }
      if (player && player.offsetTop < 0) {
        player.style.setProperty("top", "100px");
        player.style.setProperty("bottom", "unset");
      }
      if (
        player &&
        window.innerWidth - player.offsetLeft < player.clientWidth
      ) {
        player.style.setProperty("right", "0");
        player.style.setProperty("left", "unset");
      }
      if (minimized) {
        if (player && player.offsetLeft > window.innerWidth / 2) {
          player?.style.setProperty("right", "0");
          player?.style.setProperty("left", "unset");
        } else {
          player?.style.setProperty("left", "0");
          player?.style.setProperty("right", "unset");
        }
      } else {
        player?.style.setProperty("top", "unset");
        player?.style.setProperty("bottom", "4rem");
      }
    }
  }, [dragging, minimized, size]);

  if (state === "closed") return null;

  return (
    <div
      ref={ref}
      id="player"
      style={{
        width: minimized ? "80px" : "",
        right: minimized ? 0 : 8,
        left: minimized ? "unset" : "",
      }}
      className={`select-none fixed ${
        size === "compact" ? "h-[80px]" : "h-[300px]"
      } md:w-1/3 lg:w-1/4 ${
        dragging ? "transition" : "transition-all"
      }  ease-in-out duration-500 ${
        size === "compact" ? "bottom-0" : "bottom-16"
      } right-8 z-50 box-border`}
    >
      <div className="absolute flex items-center justify-center space-x-1 right-0 -top-7">
        {!minimized && (
          <i
            className={`select-none bi ${
              size === "compact"
                ? "bi-aspect-ratio"
                : "bi-arrows-angle-contract"
            } font-bold cursor-pointer`}
            onClick={() => dispatch(expandPlayer())}
          />
        )}
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
          onClick={() => dispatch(closePlayer())}
        />
      </div>
      <iframe
        src={src}
        width="100%"
        height={size === "compact" || minimized ? 80 : 352}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
};
