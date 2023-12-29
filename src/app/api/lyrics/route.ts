import { Client } from "genius-lyrics";
import { NextResponse } from "next/server";

export const GET = async (req: Request, res: Response) => {
  try {
    const client = new Client();
    if (req.method === "GET") {
      const url = new URL(req.url);
      const songName = url.searchParams.get("song");
      const artistName = url.searchParams.get("artist");
      try {
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
        console.log(error);
        return NextResponse.json({ status: 404, error: "Lyrics not found" });
      }
    } else {
      return NextResponse.json({ status: 400, error: "Method not allowed" });
    }
  } catch (error) {
    console.log(error);
  }
};
