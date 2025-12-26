"use client"
import Layout from '@/components/layout/layout'
import { useState } from 'react'
import { IoSearch, IoSettingsOutline } from "react-icons/io5"
import { BsThreeDots } from "react-icons/bs"
import Image from 'next/image'

// Types
interface NewsItem {
    id: string
    title: string
    category: string
    subCategory?: string
    timeAgo?: string
    postCount: string
    isTrendingNow?: boolean
    avatars: string[]
}

interface TrendingItem {
    id: string
    category: string
    location?: string
    hashtag: string
    postCount: string
}

interface UserSuggestion {
    id: string
    name: string
    handle: string
    avatar: string
    isVerified?: boolean
}

// Mock data
const tabs = ["For You", "Trending", "News", "Sports", "Entertainment"]

const newsItems: NewsItem[] = [
    {
        id: "1",
        title: "ChatGPT Challenges Google but Stays as Sidekick in Search Habits",
        category: "News",
        isTrendingNow: true,
        postCount: "86 posts",
        avatars: ["/avatar1.png", "/avatar2.png"]
    },
    {
        id: "2",
        title: "Can Money Solve All Problems? X Users Weigh In",
        category: "News",
        timeAgo: "2 hours ago",
        postCount: "679 posts",
        avatars: ["/avatar1.png", "/avatar2.png"]
    },
    {
        id: "3",
        title: "Blinkit Delivers Missing Visa Docs to Delhi Embassy Queue in 15 Minutes",
        category: "Entertainment",
        timeAgo: "20 hours ago",
        postCount: "1.9K posts",
        avatars: ["/avatar1.png", "/avatar2.png"]
    }
]

const trendingItems: TrendingItem[] = [
    {
        id: "1",
        category: "Entertainment · Trending",
        hashtag: "#ChellaMagale",
        postCount: "18.1K posts"
    },
    {
        id: "2",
        category: "Entertainment · Trending",
        hashtag: "#BattleOfGalwan",
        postCount: "4,209 posts"
    },
    {
        id: "3",
        category: "Trending in India",
        location: "India",
        hashtag: "वैभव सूर्यवंशी",
        postCount: "2,819 posts"
    },
    {
        id: "4",
        category: "Trending in India",
        location: "India",
        hashtag: "Super Star Samarjit Lankesh",
        postCount: ""
    },
    {
        id: "5",
        category: "Politics · Trending",
        hashtag: "#SachinPilot",
        postCount: ""
    },
    {
        id: "6",
        category: "Sports · Trending",
        hashtag: "#TestCricket",
        postCount: ""
    }
]

const suggestedUsers: UserSuggestion[] = [
    {
        id: "1",
        name: "Hitesh Choudhary",
        handle: "@hiteshchoudhary",
        avatar: "https://avatars.githubusercontent.com/u/11613311?v=4",
        isVerified: true
    },
    {
        id: "2",
        name: "Arpit Bhayani",
        handle: "@arpitbhayani",
        avatar: "https://avatars.githubusercontent.com/u/4745789?v=4",
        isVerified: true
    },
    {
        id: "3",
        name: "Piyush Garg",
        handle: "@piyushgarg",
        avatar: "https://avatars.githubusercontent.com/u/44976328?v=4",
        isVerified: true
    }
]

const Explore = () => {
    const [activeTab, setActiveTab] = useState("For You")
    const [searchQuery, setSearchQuery] = useState("")

    return (
        <Layout>
            <div className="flex flex-col min-h-screen">
                {/* Search Header */}
                <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md px-4 pt-2 pb-0">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-100 dark:bg-zinc-900 rounded-full py-3 pl-12 pr-4 placeholder-gray-500 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-black outline-none transition-all"
                            />
                        </div>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                            <IoSettingsOutline className="text-xl" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex mt-3 border-b border-gray-200 dark:border-zinc-800 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 min-w-fit px-4 py-4 text-sm font-medium transition-colors relative hover:bg-gray-100 dark:hover:bg-zinc-900 ${activeTab === tab ? "text-black dark:text-white" : "text-gray-500"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-blue-500 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Today's News Section */}
                <div className="border-b border-gray-200 dark:border-zinc-800">
                    <h2 className="text-xl font-bold px-4 py-3 text-[#f91880]">Today&apos;s News</h2>

                    {newsItems.map((item) => (
                        <div
                            key={item.id}
                            className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-bold text-[15px] leading-5 mb-1 pr-2">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-[13px] text-gray-500 dark:text-gray-400">
                                        {/* Avatars */}
                                        <div className="flex -space-x-2">
                                            {item.avatars.map((_, index) => (
                                                <div
                                                    key={index}
                                                    className="w-5 h-5 rounded-full bg-linear-to-br from-blue-500 to-purple-500 border-2 border-white dark:border-black"
                                                />
                                            ))}
                                        </div>
                                        <span>
                                            {item.isTrendingNow ? "Trending now" : item.timeAgo}
                                        </span>
                                        <span>·</span>
                                        <span>{item.category}</span>
                                        <span>·</span>
                                        <span>{item.postCount}</span>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-blue-500/10 hover:text-blue-500 rounded-full transition-colors text-gray-500">
                                    <BsThreeDots />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trending Section */}
                <div className="border-b border-gray-200 dark:border-zinc-800">
                    {trendingItems.map((item) => (
                        <div
                            key={item.id}
                            className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[13px] text-gray-500 dark:text-gray-400">{item.category}</p>
                                    <p className="font-bold text-[15px] mt-0.5">{item.hashtag}</p>
                                    {item.postCount && (
                                        <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">{item.postCount}</p>
                                    )}
                                </div>
                                <button className="p-2 hover:bg-blue-500/10 hover:text-blue-500 rounded-full transition-colors text-gray-500">
                                    <BsThreeDots />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Who to Follow Section */}
                <div className="pb-20 lg:pb-4">
                    <h2 className="text-xl font-bold px-4 py-3">Who to follow</h2>

                    {suggestedUsers.map((user) => (
                        <div
                            key={user.id}
                            className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <Image
                                    src={user.avatar}
                                    alt={user.name}
                                    width={44}
                                    height={44}
                                    className="rounded-full object-cover"
                                />
                                <div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-[15px] hover:underline">
                                            {user.name}
                                        </span>
                                        {user.isVerified && (
                                            <svg viewBox="0 0 22 22" className="w-5 h-5 text-blue-500 fill-current">
                                                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-gray-500 dark:text-gray-400 text-[15px]">{user.handle}</span>
                                </div>
                            </div>
                            <button className="bg-black dark:bg-white text-white dark:text-black font-bold px-4 py-1.5 rounded-full text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                                Follow
                            </button>
                        </div>
                    ))}

                    <button className="w-full text-left px-4 py-3 text-blue-500 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                        Show more
                    </button>
                </div>
            </div>
        </Layout>
    )
}

export default Explore