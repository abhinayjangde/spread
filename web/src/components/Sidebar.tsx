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
            icon: <GoHomeFill className="text-xl lg:text-2xl" />,
            link: "/"
        },
        {
            title: "Explore",
            icon: <FaSearch className="text-xl lg:text-2xl" />,
            link: "/explore"
        },
        {
            title: "Notifications",
            icon: <IoNotifications className="text-xl lg:text-2xl" />,
            link: "/notifications"
        },
        {
            title: "Bookmarks",
            icon: <IoBookmarkSharp className="text-xl lg:text-2xl" />,
            link: "/bookmarks"
        },
        {
            title: "Profile",
            icon: <FaUser className="text-xl lg:text-2xl" />,
            link: `/${user?.id}`
        }
    ], [user?.id])

    return (
        <>
            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
                <ul className="flex justify-around items-center py-2">
                    {sidebarMenuItems.slice(0, 4).map((item, index) => (
                        <li key={index}>
                            <Link
                                className="flex flex-col items-center gap-1 p-2 text-gray-700 hover:text-black transition-all"
                                href={item.link}
                            >
                                {item.icon}
                                <span className="text-xs">{item.title}</span>
                            </Link>
                        </li>
                    ))}
                    {user ? (
                        <li>
                            <Link
                                className="flex flex-col items-center gap-1 p-2 text-gray-700 hover:text-black transition-all"
                                href={`/${user?.id}`}
                            >
                                <Image
                                    src={user?.avatar || "https://avatars.githubusercontent.com/u/166032907?v=4"}
                                    alt="Profile"
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                />
                                <span className="text-xs">Profile</span>
                            </Link>
                        </li>
                    ) : (
                        <li>
                            <Link
                                className="flex flex-col items-center gap-1 p-2 text-gray-700 hover:text-black transition-all"
                                href="/"
                            >
                                <FaUser className="text-xl" />
                                <span className="text-xs">Profile</span>
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:col-span-2 xl:col-span-2 pt-3 lg:justify-end pr-4 relative h-screen sticky top-0">
                <div className="flex flex-col h-full w-full">
                    <Link href={"/"} className="text-xl h-fit flex justify-start items-center cursor-pointer">
                        <Image
                            src="https://avatars.githubusercontent.com/u/166032907?v=4"
                            alt="Logo"
                            width={40}
                            height={40}
                            className="rounded-full ml-2 lg:ml-3 inline"
                        />
                        <span className="mx-2 uppercase font-bold hidden xl:inline">spread</span>
                    </Link>
                    <div className="flex-1">
                        <ul className="mt-7">
                            {sidebarMenuItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        className="flex items-center gap-3 text-lg xl:text-xl cursor-pointer p-3 rounded-full hover:bg-gray-200 transition-all w-fit"
                                        href={item.link}
                                    >
                                        {item.icon}
                                        <span className="hidden xl:block">{item.title}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <button className="cursor-pointer mt-4 text-lg xl:text-xl p-3 xl:px-8 w-fit ml-1 bg-black text-white xl:py-2 rounded-full hover:bg-gray-800 transition-all">
                            <FaPlusCircle className="xl:hidden text-xl" />
                            <span className="hidden xl:block">Post</span>
                        </button>
                    </div>
                    {user && (
                        <div className="mb-4 flex gap-3 py-2 px-2 rounded-full hover:bg-gray-200 transition-all cursor-pointer items-center">
                            <Image
                                src={user?.avatar || "https://avatars.githubusercontent.com/u/166032907?v=4"}
                                alt="User Avatar"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <div className="hidden xl:flex flex-col">
                                <p className="font-semibold text-sm">{user?.firstName}</p>
                                <p className="text-xs text-gray-600 truncate max-w-[120px]">{user?.email}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Sidebar