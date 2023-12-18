/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Bg1 from "../../assets/basic.jpeg";
import Bg2 from "../../assets/laser-bg.jpg";
import Bg3 from "../../assets/business.jpg";
import Bg4 from "../../assets/vintage-bg-2.jpeg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import sdk from "../../lib/spotify-sdk/ClientInstance";
import { Artist, Track } from "@spotify/web-api-ts-sdk";
import { millisToMinutesAndSeconds } from "@/utils";
import { flattenDeep, groupBy, map, sortBy, sum, sumBy } from "lodash";
import { toPng } from "html-to-image";
import Container from "../components/core/Container";

type Receipt = {
  title: string;
  type: "top-song" | "top-artist" | "top-recents" | "top-genre" | "stats";
  duration: "short_term" | "medium_term" | "long_term";
  length: 10 | 15 | 20;
  background: 1 | 2 | 3 | 4;
  textColor: string | undefined;
};

type ReceiptData =
  | {
      type: "top-song";
      data: Track[];
    }
  | {
      type: "top-artist";
      data: Artist[];
    }
  | {
      type: "top-genre";
      data: string[][];
    };

function Receiptify() {
  const session = useSession();
  const [step, setStep] = useState(0);
  const [receipt, setReceipt] = useState<Receipt>({
    title: "Receiptify",
    type: "top-song",
    duration: "short_term",
    length: 10,
    background: 1,
    textColor: undefined,
  });

  const [data, setData] = useState<ReceiptData>();

  const DURATION = {
    short_term: "Last month",
    medium_term: "Last 6 months",
    long_term: "All time",
  };

  const BACKGROUND = {
    1: Bg1,
    2: Bg2,
    3: Bg3,
    4: Bg4,
  };

  const onNext = () => {
    if (step === 0) {
      setStep(1);
    } else {
      convertToImage();
    }
  };

  const renderTableBody = () => {
    if (data?.type === "top-song") {
      return data?.data.map((item, index) => (
        <tr key={item.id} className="h-auto">
          <td className=" text-md font-bold">
            <h2>{index + 1}</h2>
          </td>
          <td className=" text-md font-bold uppercase">{item.name}</td>
          <td className=" text-md font-bold">
            {millisToMinutesAndSeconds(item.duration_ms)}
          </td>
        </tr>
      ));
    } else if (data?.type === "top-artist") {
      return data?.data.map((item, index) => (
        <tr key={item.id} className="h-auto">
          <td className=" text-md font-bold">
            <h2>{index + 1}</h2>
          </td>
          <td className=" text-md font-bold uppercase">{item.name}</td>
          <td className=" text-md font-bold">{item.popularity}</td>
        </tr>
      ));
    } else if (data?.type === "top-genre") {
      return data?.data.map((item, index) => (
        <tr key={index} className="h-auto">
          <td className=" text-md font-bold">
            <h2>{index + 1}</h2>
          </td>
          <td className=" text-md font-bold uppercase">{item[0]}</td>
          <td className=" text-md font-bold">{item.length}</td>
        </tr>
      ));
    }
  };

  const convertToImage = async () => {
    const node = document.getElementById("my-receipt");
    if (!node) return;
    const dataUrl = await toPng(node);
    const link = document.createElement("a");
    link.download = "my-receipt.png";
    link.href = dataUrl;
    link.click();
  };

  const renderPreview = () => {
    return (
      <Card
        id="my-receipt"
        className={`w-full h-full min-h-[600px] flex flex-col justify-start items-center mt-6 bg-white text-black font-receipt`}
        style={{
          backgroundImage: `url(${BACKGROUND[receipt.background].src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <CardHeader className="flex flex-col space-y-1 items-center">
          <CardTitle className="text-2xl sm:text-5xl font-extrabold text-center ">
            {receipt.title || "Receiptify"}
          </CardTitle>
          <CardDescription className="text-lg text-center font-bold ">
            {DURATION[receipt.duration]}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4 px-8 py-0 w-full overflow-hidden">
          <div className="flex flex-col space-y-2 w-full">
            <h1 className="text-lg font-bold  uppercase">
              ORDER #001 for{" "}
              <span className="text-xl">{session.data?.user?.name}</span>
            </h1>
            <h1 className="text-md font-bold ">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h1>
            <p
              className=" font-bold  w-full overflow-hidden"
              style={{ whiteSpace: "nowrap" }}
            >
              -------------------------------------------
            </p>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="text-left  text-md font-bold ">#</th>
                  <th className="text-left  text-md font-bold ">Item</th>
                  <th className="text-left  text-md font-bold ">QTY</th>
                </tr>
              </thead>
              <tbody className="border-t-[15px] border-transparent">
                {renderTableBody()}
              </tbody>
            </table>
            <p
              className=" font-bold  w-full overflow-hidden"
              style={{ whiteSpace: "nowrap" }}
            >
              -------------------------------------------
            </p>
            <div className="flex justify-between w-full">
              <p className=" font-bold  uppercase">Total items</p>
              <p className=" font-bold  uppercase">{receipt.length}</p>
            </div>
            <div className="flex justify-between w-full">
              <p className=" font-bold  uppercase">Subtotal</p>
              <p className=" font-bold  uppercase">
                $
                {data?.type === "top-song"
                  ? millisToMinutesAndSeconds(sumBy(data?.data, "duration_ms"))
                  : data?.type === "top-artist"
                  ? sumBy(data?.data, "popularity")
                  : 100}
              </p>
            </div>
            <p
              className=" font-bold  w-full overflow-hidden"
              style={{ whiteSpace: "nowrap" }}
            >
              -------------------------------------------
            </p>
          </div>
        </CardContent>
        <CardFooter className="w-full px-8">
          <div className="w-full">
            <p className=" font-bold  uppercase">
              CARD: ### ### ### ### ##2023
            </p>
            <p className=" font-bold  uppercase">AUTH CODE: 18021998</p>
            <p className=" font-bold  uppercase">
              CARDHOLDER: {session.data?.user?.name}
            </p>
            <p className=" text-sm mt-6 font-bold text-center  uppercase">
              ***Generated by Receiptify***
            </p>
          </div>
        </CardFooter>
      </Card>
    );
  };

  const renderReceiptBackground = () => {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div
          className={`relative w-full h-80 rounded-lg overflow-hidden cursor-pointer ${
            receipt.background === 1
              ? "border-2 border-green-500"
              : "border-2 border-transparent"
          } `}
          onClick={() => setReceipt({ ...receipt, background: 1 })}
        >
          <img
            src={Bg1.src}
            alt=""
            className="absolute object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold text-gray-50">Basic</h1>
            <p className="mt-4 text-lg text-gray-50 text-center">
              A simple receipt with basic style
            </p>
          </div>
        </div>
        <div
          className={`relative w-full h-80 rounded-lg overflow-hidden cursor-pointer ${
            receipt.background === 2
              ? "border-2 border-green-500"
              : "border-2 border-transparent"
          } `}
          onClick={() => setReceipt({ ...receipt, background: 2 })}
        >
          <img
            src={Bg2.src}
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
          className={`relative w-full h-80 rounded-lg overflow-hidden cursor-pointer ${
            receipt.background === 3
              ? "border-2 border-green-500"
              : "border-2 border-transparent"
          } `}
          onClick={() => setReceipt({ ...receipt, background: 3 })}
        >
          <img
            src={Bg3.src}
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
        <div
          className={`relative w-full h-80 rounded-lg overflow-hidden cursor-pointer ${
            receipt.background === 4
              ? "border-2 border-green-500"
              : "border-2 border-transparent"
          } `}
          onClick={() => setReceipt({ ...receipt, background: 4 })}
        >
          <img
            src={Bg4.src}
            alt=""
            className="absolute object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold text-gray-50">Vintage</h1>
            <p className="mt-4 text-xl text-gray-50 text-center">
              A receipt with vintage background
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderCustomizeReceipt = () => {
    return (
      <div className="w-full h-full flex flex-col justify-center items-start mt-6 text-white">
        <div className="flex flex-col space-y-4 items-start justify-start">
          <div className="flex flex-col space-y-4">
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold text-md text-[#1DB954]">
              Choose Text Color{" "}
              <span className="text-white text-sm font-light">
                (default: #000000 (black))
              </span>
            </label>
            <Input
              className="flex h-10 border-input bg-background text-md ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full px-3 py-2 border rounded-md"
              placeholder="Text color in hex (ex: #000000)"
              onChange={(e) => {
                const value = e.target.value;
                if (value.length > 8) return;
                setReceipt({ ...receipt, textColor: value || "#000000" });
              }}
            />
          </div>
          <div className="flex flex-col space-y-4">
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold text-md text-[#1DB954]">
              Choose Title of Receipt{" "}
              <span className="text-white text-sm font-light">
                (default: Receipt)
              </span>
            </label>
            <Input
              className="flex h-10 border-input bg-background text-md ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full px-3 py-2 border rounded-md"
              placeholder="Receipt title"
              onChange={(e) => {
                const value = e.target.value;
                if (value.length > 20) return;
                setReceipt({ ...receipt, title: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col space-y-4">
            <Label className="font-bold text-lg text-[#1DB954]">
              Choose Receipt Type
            </Label>
            <Select
              onValueChange={(value) =>
                setReceipt({ ...receipt, type: value as any })
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Receipt type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 hover:cursor-pointer">
                <SelectItem
                  value="top-song"
                  className="text-md hover:cursor-pointer"
                >
                  Top Songs
                </SelectItem>
                <SelectItem
                  value="top-artist"
                  className="text-md hover:cursor-pointer"
                >
                  Top Artist
                </SelectItem>
                <SelectItem
                  value="top-genre"
                  className="text-md hover:cursor-pointer"
                >
                  Top Genres
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-4">
            <Label className="font-bold text-lg text-[#1DB954]">
              Choose Number of Items
            </Label>
            <Select
              onValueChange={(value) =>
                setReceipt({ ...receipt, length: parseInt(value, 10) as any })
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Number of items" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 hover:cursor-pointer">
                <SelectItem value="10" className="text-md hover:cursor-pointer">
                  10
                </SelectItem>
                <SelectItem value="15" className="text-md hover:cursor-pointer">
                  15
                </SelectItem>
                <SelectItem value="20" className="text-md hover:cursor-pointer">
                  20
                </SelectItem>
                <SelectItem
                  value="50"
                  className="text-md hover:cursor-pointer"
                  disabled
                >
                  50 (Premium only)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-4">
            <Label className="font-bold text-lg text-[#1DB954]">
              Choose Duration
            </Label>
            <div className="flex space-x-4">
              <Checkbox
                id="last-month"
                checked={receipt.duration === "short_term"}
                onCheckedChange={() =>
                  setReceipt({ ...receipt, duration: "short_term" })
                }
              />
              <label
                htmlFor="terms"
                className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Last month
              </label>
              <Checkbox
                id="last-6-months"
                checked={receipt.duration === "medium_term"}
                onCheckedChange={() =>
                  setReceipt({ ...receipt, duration: "medium_term" })
                }
              />
              <label
                htmlFor="terms"
                className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Last 6 months
              </label>
              <Checkbox
                id="all-time"
                checked={receipt.duration === "long_term"}
                onCheckedChange={() =>
                  setReceipt({ ...receipt, duration: "long_term" })
                }
              />
              <label
                htmlFor="terms"
                className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                All time
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const getTopSongs = async () => {
      const res = await sdk.currentUser.topItems(
        "tracks",
        receipt.duration,
        receipt.length
      );
      return res.items;
    };

    const getTopArtists = async () => {
      const res = await sdk.currentUser.topItems(
        "artists",
        receipt.duration,
        receipt.length
      );
      return res.items;
    };

    (async () => {
      if (receipt.type === "top-song") {
        const data = await getTopSongs();
        setData({ type: "top-song", data });
      } else if (receipt.type === "top-artist") {
        const data = await getTopArtists();
        setData({ type: "top-artist", data });
      } else if (receipt.type === "top-genre") {
        const data = await sdk.currentUser.followedArtists(undefined, 50);
        const getTopGenres = sortBy(
          groupBy(
            flattenDeep(map(data.artists.items, (item) => item.genres)),
            (item) => item
          ),
          (item) => item.length
        ).reverse();
        setData({ type: "top-genre", data: getTopGenres });
      }
    })();
  }, [receipt]);

  return (
    <Container>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-full h-full flex flex-col space-y-6 space-x-0 sm:flex-row sm:space-y-0 sm:space-x-6 justify-between mt-12">
          <div className="w-full h-full max-w-full sm:max-w-[70%] flex flex-col items-start">
            <h1 className="text-3xl font-bold text-white">
              {step === 0
                ? "Choose a style that you like"
                : "Customize your receipt"}
            </h1>
            {step === 0 ? renderReceiptBackground() : renderCustomizeReceipt()}
            <div className="mt-6 w-full flex justify-end text-white">
              {step === 1 && (
                <Button
                  variant="secondary"
                  onClick={() => setStep(0)}
                  className="text-md"
                >
                  <i className="bi bi-chevron-left mr-2 text-sm"></i> Theme
                </Button>
              )}
              <Button className="w-auto min-w-[120px]" onClick={onNext}>
                {step === 0 ? "Customize" : "Download Receipt"}
              </Button>
            </div>
          </div>
          <div className="w-auto h-auto grow flex flex-col items-start">
            <h1 className="text-3xl font-bold text-white">Preview</h1>
            <div className="w-full h-auto min-h-[700px] rounded-lg flex justify-end">
              {renderPreview()}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Receiptify;
