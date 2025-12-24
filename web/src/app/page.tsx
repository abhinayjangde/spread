"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import { GoHomeFill } from "react-icons/go";
import { FaSearch } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { IoBookmarkSharp } from "react-icons/io5";
import FeedCard from "@/components/FeedCard";
import Image from "next/image";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useCallback } from "react";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";

interface SpreadSidebarButton {
  title: string,
  icon: React.ReactNode
}

const sidebarMenuItems: SpreadSidebarButton[] = [
  {
    title: "Home",
    icon: <GoHomeFill className="text-2xl" />
  },
  {
    title: "Explore",
    icon: <FaSearch className="text-2xl" />
  },
  {
    title: "Notifications",
    icon: <IoNotifications className="text-2xl" />
  },
  {
    title: "Bookmarks",
    icon: <IoBookmarkSharp className="text-2xl" />
  },
  {
    title: "Profile",
    icon: <FaUser className="text-2xl" />
  }
]

export default function Home() {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const handleSingInWithGoogle = useCallback(async (cred: CredentialResponse) => {
    const googleToken = cred.credential;
    if (!googleToken) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    const { verifyGoogleToken } = await graphqlClient.request(verifyUserGoogleTokenQuery, { token: googleToken })
    toast.success(`Welcome back!`);
    console.log(verifyGoogleToken);
    if (verifyGoogleToken) {
      localStorage.setItem("spread_token", verifyGoogleToken);
    }

    await queryClient.invalidateQueries({ queryKey: ["current_user"] });
  }, [user, queryClient]);


  return (
    <div className="grid grid-cols-12 h-screen w-screen px-56">
      {/* Sidebar  */}
      <div className="col-span-2 pt-3 relative">
        <Link href={"/"} className="text-3xl h-fit flex justify-start items-center cursor-pointer">
          <Image src="https://avatars.githubusercontent.com/u/166032907?v=4" alt="Logo" width={40} height={40}
            className="rounded-full ml-3 inline" />
          <span className="mx-2 uppercase font-bold">spread</span>
        </Link>
        <div className="">
          <ul className="mt-7">
            {sidebarMenuItems.map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-xl cursor-pointer p-3 hover:bg-gray-200 transition-all">
                {item.icon}
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
          <button className="cursor-pointer mt-4 text-xl px-8 w-fit ml-3 bg-black text-white py-2 rounded-full hover:bg-gray-800 transition-all">Post</button>
        </div>
        {user &&
          <div className="absolute bottom-0 right-0 flex gap-3 w-full py-2 hover:bg-gray-200 transition-all cursor-pointer items-center justify-start">

            <Image src={user?.avatar || "https://avatars.githubusercontent.com/u/166032907?v=4"} alt="User Avatar" width={40} height={40} className="rounded-full ml-3" />

            <div className="flex flex-col">
              <p className="font-semibold">{user?.firstName}</p>
              <p className="text-sm">{user?.email}</p>
            </div>
          </div>
        }
      </div>
      {/* Feed  */}
      <div className="col-span-5 h-screen overflow-y-scroll border-x border-gray-400">
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
      </div>
      {/* Widgets  */}
      <div className="col-span-4">
        {
          !user && <div className="m-4 p-4 border border-gray-400 rounded-lg">
            <h2 className="font-bold text-2xl mb-4">New to Spread</h2>
            <GoogleLogin onSuccess={(cred) => handleSingInWithGoogle(cred)} />
          </div>
        }

        <div className="m-4 p-4 border border-gray-400 rounded-lg">
          <h2 className="font-bold text-2xl mb-4">You might like</h2>
          <p>This is a placeholder for widgets like trends, suggestions, etc.</p>
        </div>
        <div className="m-4 p-4 border border-gray-400 rounded-lg">
          <h2 className="font-bold text-2xl mb-4">Widgets</h2>
          <p>This is a placeholder for widgets like trends, suggestions, etc.</p>
        </div>
        <div className="m-4 p-4 border border-gray-400 rounded-lg">
          <h2 className="font-bold text-2xl mb-4">What&apos;s happening</h2>
          <p>This is a placeholder for widgets like trends, suggestions, etc.</p>
        </div>
      </div>
    </div>
  );
}

