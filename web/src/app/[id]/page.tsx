"use client";
import FeedCard from "@/components/FeedCard";
import Layout from "@/components/layout/layout";
import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";

const UserProfile = ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {
    const [id, setId] = useState<string>("");
    const { user } = useCurrentUser();
    useEffect(() => {
        const getId = async () => {
            const { id } = await params;
            setId(id);
        }
        getId();
    }, [id, params]);

    return <>
        <Layout>
            <div className="cursor-pointer fixed backdrop-blur-2xl">
                <nav className="flex items-start gap-4">
                    <IoIosArrowRoundBack className="text-3xl" />
                    <div>
                        {user && <h2 className="text-xl">{user.firstName} {user.lastName}</h2>}
                        {user && <p className="text-gray-600 text-sm">{user.posts.length} Posts</p>}
                    </div>
                </nav>
            </div>
            <div className="p-4 mt-12 border-b bg-gray-100 border-b-gray-300">
                {
                    user && <Image
                        src={user.avatar}
                        width={100}
                        height={100}
                        className="rounded-full"
                        alt="profile-picture"
                    />
                }
                {user && <h2 className="text-xl">{user.firstName} {user.lastName}</h2>}

            </div>
            {user?.posts && <FeedCard posts={user.posts} />}

        </Layout>
    </>;
};

export default UserProfile;