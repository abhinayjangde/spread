"use client";

import { useCallback } from "react";
import { useState } from "react";
import Image from "next/image";
import { MdOutlineEmojiEmotions, MdOutlineImage } from "react-icons/md";
import toast from "react-hot-toast";
import Layout from "@/components/layout/layout";
import FeedCard from "@/components/FeedCard";
import { useCurrentUser } from "@/hooks/user";
import { useCreatePost, useGetAllPosts } from "@/hooks/post";

export default function Home() {

  const { user } = useCurrentUser();
  const { posts = [] } = useGetAllPosts();
  const { mutate: createPost } = useCreatePost();
  const [content, setContent] = useState("");

  const handleSelectImage = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.accept = 'image/*';
    input.click();
  }, [])

  const handleCreatePost = useCallback(async () => {
    if (content.trim().length === 0) {
      toast.error("Post content cannot be empty.");
      return;
    }
    createPost({ content })
    setContent("");
  }, [content, createPost])


  return (
    <>
      <Layout>

        {/* Write Post  */}
        <div className="grid grid-cols-12 gap-4 border-t border-gray-400 p-3 md:p-4">
          <div className="col-span-2 md:col-span-1">
            {user && <Image
              src={user?.avatar} alt="Profile"
              width={100}
              height={100}
              className="rounded-full m-2"
            />}
          </div>
          <div className="col-span-10 md:col-span-11 md:px-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
              <button onClick={handleCreatePost} className="cursor-pointer float-right text-sm bg-black text-white px-4 py-1 rounded-full hover:bg-gray-800 transition-all">Post</button>
            </div>
          </div>
        </div>

        {/* Feed  */}
        <FeedCard posts={posts} />

      </Layout>
    </>
  );
}

