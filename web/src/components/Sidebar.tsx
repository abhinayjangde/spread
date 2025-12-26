import Image from 'next/image'
import Link from 'next/link'
import { useCurrentUser } from '@/hooks/user';
import { GoHomeFill } from "react-icons/go";
import { FaPlusCircle, FaSearch } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { IoBookmarkSharp } from "react-icons/io5";
import { useMemo } from 'react';

interface SpreadSidebarButton {
    title: string,
    icon: React.ReactNode,
    link: string
}



const Sidebar: React.FC = () => {
    const { user } = useCurrentUser();
    const sidebarMenuItems: SpreadSidebarButton[] = useMemo(() => [
        {
            title: "Home",
            icon: <GoHomeFill className="text-2xl" />,
            link: "/"
        },
        {
            title: "Explore",
            icon: <FaSearch className="text-2xl" />,
            link: "/explore"
        },
        {
            title: "Notifications",
            icon: <IoNotifications className="text-2xl" />,
            link: "/notifications"
        },
        {
            title: "Bookmarks",
            icon: <IoBookmarkSharp className="text-2xl" />,
            link: "/bookmarks"
        },
        {
            title: "Profile",
            icon: <FaUser className="text-2xl" />,
            link: `/${user?.id}`
        }
    ], [user?.id])
    return (


        <div className="col-span-2 pt-3 flex md:justify-end pr-4 relative">
            <div>
                <Link href={"/"} className="text-xl h-fit flex justify-start items-center cursor-pointer">
                    <Image src="https://avatars.githubusercontent.com/u/166032907?v=4" alt="Logo" width={40} height={40}
                        className="rounded-full ml-3 inline" />
                    <span className="mx-2 uppercase font-bold hidden md:inline">spread</span>
                </Link>
                <div className="">
                    <ul className="mt-7">
                        {sidebarMenuItems.map((item, index) => (
                            <li key={index}>
                                <Link className="flex items-center gap-2 text-xl cursor-pointer p-3 hover:bg-gray-200 transition-all" href={item.link}>
                                    {item.icon}
                                    <span className="hidden md:block">{item.title}</span>
                                </Link>
                            </li>
                        ))}
                        <li className="flex items-center gap-2 text-xl cursor-pointer p-3">
                            <FaPlusCircle className="block md:hidden text-2xl" />
                        </li>
                    </ul>
                    <button className="hidden md:block cursor-pointer mt-4 text-xl px-8 w-fit ml-3 bg-black text-white py-2 rounded-full hover:bg-gray-800 transition-all">Post</button>
                </div>
                {user &&
                    <div className="absolute bottom-0 right-0 flex gap-3 w-full py-2 hover:bg-gray-200 transition-all cursor-pointer items-center justify-start">

                        <Image src={user?.avatar || "https://avatars.githubusercontent.com/u/166032907?v=4"} alt="User Avatar" width={40} height={40} className="rounded-full ml-3" />

                        <div className="flex flex-col">
                            <p className="hidden md:block font-semibold">{user?.firstName}</p>
                            <p className="hidden md:block text-sm">{user?.email}</p>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Sidebar