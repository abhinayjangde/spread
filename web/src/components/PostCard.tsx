"use client";
import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import { useCallback } from "react";
import { MdOutlineEmojiEmotions, MdOutlineImage } from "react-icons/md";

const PostCard = () => {
    const { user } = useCurrentUser();
    const handleSelectImage = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.accept = 'image/*';
        input.click();
    }, [])
    return (
        <div className="grid grid-cols-12 gap-4 border-t border-gray-400 p-4">
            <div className="col-span-1">
                {user && <Image
                    src="https://avatars.githubusercontent.com/u/64852930?v=4" alt="Profile"
                    width={100}
                    height={100}
                    className="rounded-full m-2"
                />}
            </div>
            <div className="col-span-11 px-4">

                <textarea
                    className="overflow-y-auto no-scrollbar resize-none p-2 w-full focus:outline-none bg-transparent"
                    cols={4}
                    rows={3}
                    placeholder="What's happening?"
                    name="postContent"
                    id="postContent"
                />
                <div className="">
                    <MdOutlineImage onClick={handleSelectImage} className="text-2xl cursor-pointer text-gray-800 hover:text-black transition-all inline" />
                    <MdOutlineEmojiEmotions className="text-2xl cursor-pointer text-gray-800 hover:text-black transition-all inline mx-4" />
                    <button className="cursor-pointer float-right text-sm bg-black text-white px-4 py-1 rounded-full hover:bg-gray-800 transition-all">Post</button>
                </div>
            </div>
        </div>
    )
}

export default PostCard