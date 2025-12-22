import Link from "next/link";
import { FaTwitter } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { FaSearch } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { IoBookmarkSharp } from "react-icons/io5";

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
  return (
    <div className="grid grid-cols-12 h-screen w-screen px-56">
      {/* Sidebar  */}
      <div className="col-span-2 pt-3">
        <Link href={"/"} className="text-3xl h-fit cursor-pointer">
          <FaTwitter className="ml-3" />
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
          <button className="cursor-pointer mt-4 text-xl px-8 w-fit ml-3 bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition-all">Post</button>
        </div>
      </div>
      {/* Feed  */}
      <div className="col-span-6 border-x"></div>
      {/* Widgets  */}
      <div className="col-span-3"></div>
    </div>
  );
}

