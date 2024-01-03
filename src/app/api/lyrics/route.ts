import { Client } from "genius-lyrics";
import { NextResponse } from "next/server";

export const GET = async (req: Request, res: Response) => {
  try {
    const client = new Client();
    const url = new URL(req.url);
    const songName = url.searchParams.get("song");
    const artistName = url.searchParams.get("artist");
    const searches = await client.songs.search(songName + " " + artistName);
    const song = searches[0];
    const lyrics = await song?.lyrics();
    return NextResponse.json({
      status: 200,
      lyrics: lyrics,
      title: song?.title,
      artist: song?.artist.name,
      album: song?.album?.name,
      albumArt: song?.album?.image,
      releaseDate: song?.releasedAt,
      image: song?.image,
    });
  } catch (error) {
    return NextResponse.json({ status: 404, error: "Lyrics not found" });
  }
};
