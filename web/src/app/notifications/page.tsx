"use client"
import Layout from '@/components/layout/layout'
import { useState } from 'react'
import { IoSettingsOutline } from "react-icons/io5"



// Mock data
const tabs = ["All", "Verified", "Mention"]

const Notifications = () => {
    const [activeTab, setActiveTab] = useState("All")
    return (
        <Layout>
            <div className="flex flex-col min-h-screen">
                {/* Search Header */}
                <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md px-4 pt-2 pb-0">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl font-bold">Notifications</h2>
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



            </div>
        </Layout>
    )
}

export default Notifications