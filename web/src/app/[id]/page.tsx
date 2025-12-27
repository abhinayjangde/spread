"use client";
import FeedCard from "@/components/FeedCard";
import Layout from "@/components/layout/layout";
import { useCurrentUser, useUserById } from "@/hooks/user";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { HiOutlineCalendar } from "react-icons/hi";
import { ProfileSkeleton, FeedSkeleton } from "@/components/Shimmer";
import { graphqlClient } from "@/clients/api";
import { followUserMutation, unfollowUserMutation } from "@/graphql/mutations/user";
import { useQueryClient } from "@tanstack/react-query";

const UserProfile = ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {
    const [id, setId] = useState<string>("");
    const { user, isLoading } = useUserById(id);
    const { user: currentUser } = useCurrentUser();
    const queryClient = useQueryClient();

    useEffect(() => {
        const getId = async () => {
            const { id } = await params;
            setId(id);
        }
        getId();
    }, [id, params]);

    const amIFollowing = currentUser?.following?.some((followedUser: { id: string; }) => followedUser.id === user?.id);

    // Follow Handler
    const handleFollowUser = useCallback(async () => {
        if (!user?.id) return;
        await graphqlClient.request(followUserMutation, { to: user?.id });
        await queryClient.invalidateQueries({ queryKey: ['current_user'] });
        await queryClient.invalidateQueries({ queryKey: ['user_by_id', user?.id] });
    }, [user?.id, queryClient]);

    // Unfollow Handler
    const handleUnfollowUser = useCallback(async () => {
        if (!user?.id) return;
        await graphqlClient.request(unfollowUserMutation, { to: user?.id });
        await queryClient.invalidateQueries({ queryKey: ['current_user'] });
        await queryClient.invalidateQueries({ queryKey: ['user_by_id', user?.id] });
    }, [user?.id, queryClient]);


    // Show skeleton while loading
    if (isLoading || !id) {
        return (
            <Layout>
                <ProfileSkeleton />
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Sticky Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800">
                <nav className="flex items-center gap-4 sm:gap-6 p-2 sm:p-3">
                    <Link
                        href="/"
                        className="p-1.5 sm:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-all"
                    >
                        <IoIosArrowRoundBack className="text-2xl sm:text-3xl" />
                    </Link>
                    <div className="min-w-0">
                        {user && (
                            <>
                                <h2 className="text-base sm:text-xl font-bold truncate">
                                    {user.firstName} {user.lastName}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                                    {user.posts.length} {user.posts.length === 1 ? 'Post' : 'Posts'}
                                </p>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            {/* Cover Photo Area */}
            <div className="h-24 sm:h-32 md:h-40 lg:h-48 bg-linear-to-r from-gray-200 to-gray-300 dark:from-zinc-800 dark:to-zinc-700" />

            {/* Profile Info Section */}
            <div className="px-3 sm:px-4 pb-4">
                {/* Avatar - Overlapping cover */}
                <div className="relative -mt-12 sm:-mt-16 mb-3">
                    {user && (
                        <Image
                            src={user.avatar}
                            width={120}
                            height={120}
                            className="rounded-full w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 border-4 border-white dark:border-black object-cover"
                            alt="profile-picture"
                        />
                    )}
                </div>

                {/* User Info */}
                {user && (
                    <div className="space-y-2 sm:space-y-3">
                        <div>
                            <div className="flex justify-between">

                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                                    {user.firstName} {user.lastName}
                                </h2>
                                {currentUser?.id !== user.id && (
                                    <>
                                        {
                                            amIFollowing ?
                                                (
                                                    <button onPointerOver={() => {
                                                        const unfollowBtn = document.getElementById("unfollow");
                                                        unfollowBtn?.addEventListener("pointerout", () => {
                                                            if (unfollowBtn) {
                                                                unfollowBtn.textContent = "Following";
                                                            }
                                                        });
                                                        if (unfollowBtn) {
                                                            unfollowBtn.textContent = "Unfollow";
                                                        }
                                                    }} className="w-24 px-2 font-semibold cursor-pointer hover:bg-gray-300 transition-all rounded-full dark:bg-gray-100 text-gray-900" id="unfollow"
                                                        onClick={handleUnfollowUser}
                                                    >Following</button>
                                                )

                                                : (
                                                    <button onClick={handleFollowUser} className="px-2 font-semibold cursor-pointer hover:bg-gray-300 transition-all rounded-full dark:bg-gray-100 text-gray-900">Follow</button>
                                                )
                                        }
                                    </>
                                )}
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">@{user.firstName?.toLowerCase()}{user.lastName?.toLowerCase()}</p>
                        </div>

                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                            <HiOutlineCalendar className="text-base sm:text-lg" />
                            <span>Joined {new Date(parseInt(user.createdAt)).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        </div>

                        <div className="flex gap-4 sm:gap-6 text-sm sm:text-base">
                            <div>
                                <span className="font-bold">{user.following.length || 0}</span>
                                <span className="text-gray-500 dark:text-gray-400 ml-1">Following</span>
                            </div>
                            <div>
                                <span className="font-bold">{user.followers.length || 0}</span>
                                <span className="text-gray-500 dark:text-gray-400 ml-1">Followers</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-zinc-800">
                <button className="flex-1 py-3 sm:py-4 text-sm sm:text-base font-medium text-center hover:bg-gray-100 dark:hover:bg-zinc-900 transition-all border-b-2 border-black dark:border-white cursor-pointer">
                    Posts
                </button>
                <button className="flex-1 py-3 sm:py-4 text-sm sm:text-base font-medium text-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-all cursor-pointer">
                    Replies
                </button>
                <button className="flex-1 py-3 sm:py-4 text-sm sm:text-base font-medium text-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-all cursor-pointer">
                    Likes
                </button>
            </div>

            {/* User Posts */}
            {user?.posts && <FeedCard posts={user.posts} />}
        </Layout>
    );
};

export default UserProfile;