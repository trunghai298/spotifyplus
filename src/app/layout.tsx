import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import "./globals.css";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import AuthSessionProvider from "./components/AuthSessionProvider";
import { Header } from "./components/Header";
import { EmbedPlayer } from "./components/EmbedPlayer";
import { Providers } from "./lib/redux/providers";
import "bootstrap-icons/font/bootstrap-icons.css";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <AuthSessionProvider session={session}>
        <body className={`${inter.className} h-full min-h-screen bg-gray-900`}>
          <Providers>
            <EmbedPlayer />
            <Header session={session} />
            {children}
          </Providers>
        </body>
      </AuthSessionProvider>
    </html>
  );
}
