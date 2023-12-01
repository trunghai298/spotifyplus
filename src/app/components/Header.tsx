"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export const Header = ({ session }: any) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  if (!session) return null;
  return (
    <header className="sticky -top-[1px] w-full p-2 sm:px-10 bg-gray-900 z-max h-24 flex justify-between items-center">
      <div className="flex gap-x-1 items-center">
        <i className="bi bi-spotify"></i>
        <a
          className="text-2xl font-bold text-white cursor-pointer"
          onClick={() => router.push("/")}
        >
          Spotify++
        </a>
      </div>
      <nav className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-4">
          <a
            className="text-lg font-medium text-zinc-900 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300 cursor-pointer"
            onClick={() => router.push("/songlikex")}
          >
            Song Like X
          </a>
          <a
            className="text-lg font-medium text-zinc-900 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300 cursor-pointer"
            onClick={() => router.push("/wrapped")}
          >
            Wrapped
          </a>
          <a
            className="text-lg font-medium text-zinc-900 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300 cursor-pointer"
            onClick={() => router.push("/receipt")}
          >
            Receiptify
          </a>
          <a
            className="text-lg font-medium text-zinc-900 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300 cursor-pointer"
            onClick={() => router.push("/analytics")}
          >
            Analytics
          </a>
        </div>
        <Image
          src={session.user.image || ""}
          alt=""
          width={40}
          height={40}
          className="rounded-full w-[30px] h-[30px] block sm:hidden border-2 border-gray-300 cursor-pointer"
        />
        <div className="hidden sm:inline-block relative cursor-pointer min-w-[100px]">
          <div
            className="bg-gray-300 text-gray-700 font-semibold py-1 px-2 rounded-md inline-flex items-center"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Image
              src={session.user.image || ""}
              alt=""
              width={30}
              height={30}
              quality={100}
              className="rounded-full w-[35px] h-[35px]"
            />
            <h2 className="text-md hidden sm:inline md:inline font-bold text-gray-900">
              {session.user.name}
            </h2>
            {isDropdownOpen ? (
              <i className="bi bi-caret-up-fill text-gray-900" />
            ) : (
              <i className="bi bi-caret-down-fill text-gray-900" />
            )}
          </div>
          <div
            className={`dropdown-menu absolute ${
              isDropdownOpen ? "block" : "hidden"
            } text-gray-700 pt-1 flex z-max w-full`}
          >
            <div className="bg-white relative shadow-md rounded-lg p-2 w-full">
              <ul className="w-full">
                <li className="">
                  <a
                    className="text-sm text-gray-500 bg-white hover:bg-gray-200 rounded-md py-1 px-2 block whitespace-no-wrap"
                    href="#"
                    onClick={() => signOut()}
                  >
                    Profile
                  </a>
                </li>
                <div className="border-b border-gray-200 my-1"></div>
                <li className="">
                  <a
                    className="text-sm text-gray-500 bg-white hover:bg-gray-200 rounded-md py-1 px-2 block whitespace-no-wrap"
                    href="#"
                    onClick={() => signOut()}
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
