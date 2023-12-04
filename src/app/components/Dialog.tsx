"use client";
import React, { useEffect, useRef } from "react";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function Dialog({ children, open, onClose }: DialogProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-50 z-max"
        onClick={onClose}
      />
      <div
        role="dialog"
        className="fixed min-w-[300px] max-h-[500px] sm:min-h-[400px] sm:min-w-[600px] bg-purple-950 rounded-3xl sm:rounded-4xl p-8 sm:p-12 overflow-hidden shadow-xl transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all z-max"
        tabIndex={-1}
      >
        <div className="flex items-center justify-center min-height-100vh text-center sm:block">
          <i
            className="bi bi-x text-4xl text-white absolute top-4 right-4 cursor-pointer hover:text-gray-300 transition-colors"
            onClick={onClose}
          />
          {children}
        </div>
      </div>
    </>
  );
}

export default Dialog;
