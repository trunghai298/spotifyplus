/* eslint-disable @next/next/no-img-element */
import { Track } from "@spotify/web-api-ts-sdk";
import { map } from "lodash";
import { useRouter } from "next/navigation";

type TracksGridProps = {
  tracks: Track[];
  onClickTrack?: (track: Track) => void;
  selectedTrack?: Track | undefined;
};

function TracksGrid(props: TracksGridProps) {
  const { tracks, onClickTrack, selectedTrack } = props;
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
      {map(tracks, (track) => (
        <div className="flex flex-col space-y-2" key={track.id}>
          <div className="relative">
            <img
              src={track.album.images[0].url}
              alt=""
              className="rounded-md"
              width={200}
              height={200}
              loading="lazy"
            />
            <div
              className={`h-full w-full absolute top-0 left-0 flex justify-center items-center ${
                selectedTrack?.id === track.id ? `opacity-100` : `opacity-0`
              } ${selectedTrack ? "hover:opacity-100" : ""} cursor-pointer`}
              onClick={() => onClickTrack?.(track)}
            >
              {selectedTrack?.id === track.id ? (
                <i className="bi bi-pause-circle-fill text-gray-300 text-4xl" />
              ) : (
                <i className="bi bi-play-circle-fill text-gray-300 text-4xl"></i>
              )}
            </div>
          </div>
          <h3
            className="text-lg font-bold cursor-pointer hover:underline"
            onClick={() => onClickTrack?.(track)}
          >
            {track.name}
          </h3>
          <p
            className="text-gray-500 cursor-pointer hover:underline"
            onClick={() => router.push(`/artist/${track.artists[0].id}`)}
          >
            {track.artists[0].name}
          </p>
        </div>
      ))}
    </div>
  );
}

export default TracksGrid;
