import { Client } from "genius-lyrics";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: Response) => {
  try {
    const client = new Client();
    const songName = req.nextUrl.searchParams.get("song");
    const artistName = req.nextUrl.searchParams.get("artist");
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
  } catch (error: any) {
    return NextResponse.json({ status: 404, error: error.message });
  }
};
