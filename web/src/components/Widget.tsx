"use client";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useCurrentUser } from "@/hooks/user";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCallback } from "react";
import { graphqlClient } from "@/clients/api";
import { useQueryClient } from "@tanstack/react-query";
import { WidgetSkeleton } from "./Shimmer";
import { useTheme } from "@/context/ThemeContext";
import { User } from "@/gql/graphql";
import Image from "next/image";
import Link from "next/link";

const Widget: React.FC = () => {
    const { user, isLoading } = useCurrentUser();
    const { theme } = useTheme();
    const queryClient = useQueryClient();
    const handleSingInWithGoogle = useCallback(async (cred: CredentialResponse) => {
        const googleToken = cred.credential;
        if (!googleToken) {
            toast.error("Google sign-in failed. Please try again.");
            return;
        }
        const { verifyGoogleToken } = await graphqlClient.request(verifyUserGoogleTokenQuery, { token: googleToken })
        toast.success(`${user?.firstName ? `Welcome back, ${user.firstName}!` : "Successfully signed in with Google!"}`);
        console.log(verifyGoogleToken);
        if (verifyGoogleToken) {
            localStorage.setItem("spread_token", verifyGoogleToken);
        }

        await queryClient.invalidateQueries({ queryKey: ["current_user"] });
    }, [user, queryClient]);

    return (
        <div className="hidden lg:block lg:col-span-3 xl:col-span-4 h-screen sticky top-0 overflow-y-auto no-scrollbar">
            {/* Loading State */}
            {isLoading ? (
                <>
                    <WidgetSkeleton />
                    <WidgetSkeleton />
                    <WidgetSkeleton />
                </>
            ) : (
                <>
                    {/* Google Login Card - shown only when not logged in */}
                    {!user && (
                        <div className="m-3 xl:m-4 p-3 xl:p-4 border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
                            <h2 className="font-bold text-lg xl:text-2xl mb-3 xl:mb-4">New to Spread</h2>
                            <GoogleLogin
                                onSuccess={(cred) => handleSingInWithGoogle(cred)}
                                theme={theme === "dark" ? "filled_black" : "outline"}
                            />
                        </div>
                    )}

                    {/* Suggestions Card */}
                    <div className="m-3 xl:m-4 p-3 xl:p-4 border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
                        <h2 className="font-bold text-lg xl:text-2xl mb-3 xl:mb-4">You might like</h2>
                        <p className="text-sm xl:text-base text-gray-600 dark:text-gray-400">This is a placeholder for widgets like trends, suggestions, etc.</p>
                    </div>

                    {/* Trending Card */}
                    <div className="m-3 xl:m-4 p-3 xl:p-4 border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
                        <h2 className="font-bold text-lg xl:text-2xl mb-3 xl:mb-4">What&apos;s happening</h2>
                        <p className="text-sm xl:text-base text-gray-600 dark:text-gray-400">This is a placeholder for widgets like trends, suggestions, etc.</p>
                    </div>

                    {/* Recommended Users Card */}
                    {
                        user?.recommendedUsers.length > 0 && (
                            <div className="m-3 xl:m-4 p-3 xl:p-4 border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
                                <h2 className="font-bold text-lg xl:text-2xl mb-3 xl:mb-4">You may know them</h2>


                                <div>
                                    {user.recommendedUsers.map((u: User) =>
                                        <div
                                            className="flex justify-between items-center gap-4 py-4 border-t border-gray-200 dark:border-zinc-800"
                                            key={u.id}
                                        >
                                            <div className="flex gap-4">
                                                {u.avatar && <Image src={u.avatar} alt={`${u.firstName} ${u.lastName}`} width={50} height={50}
                                                    className="rounded-full" />}

                                                <div className="flex flex-col">
                                                    <p>{u.firstName} {u.lastName}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">@{u.firstName.toLowerCase()}{u.lastName?.toLowerCase()}</p>
                                                </div>
                                            </div>
                                            <Link href={`/${u.id}`} className="font-semibold cursor-pointer hover:bg-gray-300 transition-all rounded-full bg-gray-200 dark:bg-gray-100 text-gray-900 h-fit py-1 px-3">Find</Link>

                                        </div>)
                                    }
                                </div>
                            </div>
                        )
                    }


                </>
            )}
        </div>
    )
}

export default Widget