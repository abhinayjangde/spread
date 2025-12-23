"use client";
import Link from "next/link";
import { FaTwitter } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { FaSearch } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { IoBookmarkSharp } from "react-icons/io5";
import FeedCard from "@/components/FeedCard";
import Image from "next/image";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

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
  const handleSingInWithGoogle = (cred: CredentialResponse) => {
    console.log(cred);
  }
  return (
    <div className="grid grid-cols-12 h-screen w-screen px-56">
      {/* Sidebar  */}
      <div className="col-span-2 pt-3">
        <Link href={"/"} className="text-3xl h-fit cursor-pointer">
          <Image src="https://avatars.githubusercontent.com/u/166032907?v=4" alt="Logo" width={40} height={40}
            className="rounded-full ml-3" />
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
        <div className="m-4 p-4 border border-gray-400 rounded-lg">
          <h2 className="font-bold text-2xl mb-4">New to Spread</h2>
          <GoogleLogin onSuccess={(cred) => handleSingInWithGoogle(cred)} />
        </div>
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

