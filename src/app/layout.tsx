import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import "./globals.css";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import AuthSessionProvider from "./components/AuthSessionProvider";

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
        <body className={inter.className}>{children}</body>
      </AuthSessionProvider>
    </html>
  );
}
