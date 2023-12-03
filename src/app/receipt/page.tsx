"use client";
import React, { useState } from "react";
import Container from "../components/Container";
import Image from "next/image";
import Bg1 from "../../assets/basic.jpeg";
import Bg2 from "../../assets/laser-bg.jpg";
import Bg3 from "../../assets/business.jpg";
import Receipt1Sample from "../../assets/1.png";
import Receipt2Sample from "../../assets/laser-sample.png";
import Receipt3Sample from "../../assets/business-sample.png";

function Receiptify() {
  const [receiptStyle, setReceiptStyle] = useState(0);

  return (
    <Container>
      <div className="w-full h-full flex flex-col justify-center items-center">
        {/**display a grid contain 3 style of receipt */}
        <div className="w-full h-full flex flex-col sm:flex-row justify-between mt-12">
          <div className="w-full h-full max-w-full sm:max-w-[70%] flex flex-col items-start">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
              Choose a style that you like
            </h1>
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div
                className={`relative w-full h-96 rounded-lg overflow-hidden cursor-pointer ${
                  receiptStyle === 0 ? "border-2 border-green-500" : ""
                } `}
                onClick={() => setReceiptStyle(0)}
              >
                <Image
                  src={Bg1}
                  alt=""
                  className="absolute object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <h1 className="text-4xl font-bold text-gray-50">Basic</h1>
                  <p className="mt-4 text-xl text-gray-50 text-center">
                    A simple receipt with basic style
                  </p>
                </div>
              </div>
              <div
                className={`relative w-full h-96 rounded-lg overflow-hidden cursor-pointer ${
                  receiptStyle === 1 ? "border-2 border-green-500" : ""
                } `}
                onClick={() => setReceiptStyle(1)}
              >
                <Image
                  src={Bg2}
                  alt=""
                  className="absolute object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <h1 className="text-4xl font-bold text-gray-50">Laser</h1>
                  <p className="mt-4 text-xl text-gray-50 text-center">
                    A receipt with laser background
                  </p>
                </div>
              </div>
              <div
                className={`relative w-full h-96 rounded-lg overflow-hidden cursor-pointer ${
                  receiptStyle === 2 ? "border-2 border-green-500" : ""
                } `}
                onClick={() => setReceiptStyle(2)}
              >
                <Image
                  src={Bg3}
                  alt=""
                  className="absolute object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <h1 className="text-4xl font-bold text-gray-50">Dream</h1>
                  <p className="mt-4 text-xl text-gray-50 text-center">
                    A receipt with purple background
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/**display a panel to preview receipt sample in the right */}
          <div className="w-auto h-auto grow flex flex-col items-start">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
              Preview
            </h1>
            <div className="mt-6 w-full h-auto min-h-[500px] max-h-[600px] rounded-lg flex justify-end">
              <Image
                src={
                  receiptStyle === 0
                    ? Receipt1Sample
                    : receiptStyle === 1
                    ? Receipt2Sample
                    : Receipt3Sample
                }
                alt=""
                height={600}
                width={100}
                quality={100}
                className="h-full w-full h-[700px"
              />
            </div>
            <button className="mt-6 w-full bg-green-500 hover:bg-green-600 text-gray-50 font-bold py-2 px-4 rounded-lg">
              Download image
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Receiptify;
