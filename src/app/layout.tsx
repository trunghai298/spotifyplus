import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import "./globals.css";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import AuthSessionProvider from "./components/AuthSessionProvider";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const Header = ({ session }: any) => {
    if (!session) return null;
    return (
      <div className="sticky top-0 w-full px-10 bg-gray-900 z-max h-24 flex justify-between items-center">
        <div className="flex gap-x-1 items-center">
          <i className="bi bi-spotify"></i>
          <h2 className="text-2xl font-bold">Spotify Plus</h2>
        </div>
        <div className="flex items-center justify-between gap-x-1 bg-gray-300 px-4 py-1 rounded-xl">
          <Image
            src={session.user.image || ""}
            alt=""
            width={30}
            height={30}
            quality={100}
            className="rounded-full"
          />
          <h2 className="text-md font-bold text-gray-900">
            {session.user.name}
          </h2>
        </div>
      </div>
    );
  };

  return (
    <html lang="en">
      <AuthSessionProvider session={session}>
        <body className={inter.className}>
          <Header session={session} />
          {children}
        </body>
      </AuthSessionProvider>
    </html>
  );
}
