"use client";
import {
  Artist,
  Page,
  SimplifiedAlbum,
  SimplifiedTrack,
  TopTracksResult,
} from "@spotify/web-api-ts-sdk";
import React, { use, useEffect, useState } from "react";
import sdk from "../../lib/spotify-sdk/ClientInstance";
import Image from "next/image";
import { Loader } from "@/app/components/Loader";

function ArtistPage() {
  const [artist, setArtist] = useState<Artist>();
  const [albums, setAlbums] = useState<Page<SimplifiedAlbum>>();
  const [topTracks, setTracks] = useState<TopTracksResult>();
  const [selectedAlbum, setSelectedAlbum] = useState<SimplifiedAlbum>();

  const millisToMinutesAndSeconds = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds: any = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  useEffect(() => {
    (async () => {
      const id = window.location.pathname.split("/")[2];
      const [artist, albums, topTracks] = await Promise.all([
        sdk.artists.get(id),
        sdk.artists.albums(id, "single,album"),
        sdk.artists.topTracks(id, "KR"),
      ]);
      // setSelectedAlbum(albums.items[0]);
      setTracks(topTracks);
      setAlbums(albums);
      setArtist(artist);
    })();
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     if (!selectedAlbum) return;
  //     const tracks = await sdk.albums.tracks(selectedAlbum.id);
  //     setTracks(tracks);
  //   })();
  // }, [selectedAlbum]);

  if (!artist || !albums) {
    return <Loader />;
  }

  return (
    <div className="h-full bg-gray-900 px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-24 lg:py-10">
      <div className="w-full flex gap-x-6">
        <div>
          <Image
            src={artist.images[0].url}
            alt=""
            width={200}
            height={200}
            className="max-h-[400px] object-cover object-center sm:object-scale-down rounded-lg shadow-md"
          />
          <div className="w-full py-4">
            <h1 className="text-3xl font-bold text-white">{artist.name}</h1>
            <p className="text-gray-400">{artist.followers.total} Followers</p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Top Tracks</h2>
          <table className="table-auto w-full">
            <thead>
              <tr className="border-b-[1px] border-gray-500">
                <th className="text-left text-gray-400 min-w-[50px] text-sm">
                  #
                </th>
                <th className="text-left text-gray-400 min-w-[300px] text-sm">
                  Title
                </th>
                <th className="text-left text-gray-400 min-w-[200px] text-sm">
                  Date Added
                </th>
                <th className="text-left">
                  <i className="bi bi-clock w-[10px] h-[10px]" />
                </th>
              </tr>
            </thead>
            <tbody>
              {topTracks?.tracks.map((track, index) => (
                <tr key={track.id} className="my-2">
                  <td className="text-white hover:underline hover:cursor-pointer">
                    <h2 className="text-gray-400">{index}</h2>
                  </td>
                  <td className="flex items-center w-full max-w-[300px] gap-x-2 text-white hover:underline hover:cursor-pointer overflow-hidden">
                    <Image
                      src={track.album.images[0].url}
                      alt=""
                      width={30}
                      height={30}
                      className="rounded-sm max-h-[30px] object-cover object-center"
                    />
                    <h2>{track.name}</h2>
                  </td>
                  <td className="text-gray-400">{track.album.name}</td>
                  <td className="text-gray-400">
                    {millisToMinutesAndSeconds(track.duration_ms)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full mt-4">
        <h1 className="text-2xl font-bold text-white mb-4">Albums</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-8">
          {albums.items.map((album) => (
            <div key={album.id} className="flex flex-col items-center w-fit">
              <Image
                src={album.images[0].url}
                alt=""
                width={200}
                height={200}
                className="w-fit object-cover object-top rounded-lg shadow-md"
              />
              <h2
                className="text-white mt-2 hover:cursor-pointer hover:underline"
                onClick={() => setSelectedAlbum(album)}
              >
                {album.name}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ArtistPage;
