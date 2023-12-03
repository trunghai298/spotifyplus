"use client";
import React from "react";

type TooltipProps = {
  children: React.ReactNode;
  text: string;
};

function Tooltip({ children, text, ...rest }: TooltipProps) {
  return (
    <div className="relative flex flex-col items-center group">
      {children}
      <div className="absolute w-auto min-w-[150px] bottom-0 flex flex-col items-center hidden mb-8 group-hover:flex">
        <span className="relative  rounded-md z-10 p-3 text-xs leading-none text-white  bg-black shadow-lg">
          {text}
        </span>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
      </div>
    </div>
  );
}

export default Tooltip;
