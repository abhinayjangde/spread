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
        {/* Header - Mobile */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between p-3">
            {user ? (
              <Image
                src={user?.avatar}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
            )}
            <h1 className="font-bold text-lg">Home</h1>
            <div className="w-8" />
          </div>
        </header>

        {/* Write Post */}
        <div className="flex gap-3 sm:gap-4 border-b border-gray-200 p-3 sm:p-4">
          <div className="flex-shrink-0 hidden sm:block">
            {user && (
              <Image
                src={user?.avatar}
                alt="Profile"
                width={48}
                height={48}
                className="rounded-full w-10 h-10 sm:w-12 sm:h-12 object-cover"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="overflow-y-auto no-scrollbar resize-none p-2 w-full focus:outline-none bg-transparent text-sm sm:text-base min-h-[60px] sm:min-h-[80px]"
              rows={2}
              placeholder="What's happening?"
              name="postContent"
              id="postContent"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 sm:gap-4">
                <MdOutlineImage
                  onClick={handleSelectImage}
                  className="text-xl sm:text-2xl cursor-pointer text-gray-600 hover:text-blue-500 transition-all"
                />
                <MdOutlineEmojiEmotions
                  className="text-xl sm:text-2xl cursor-pointer text-gray-600 hover:text-blue-500 transition-all"
                />
              </div>
              <button
                onClick={handleCreatePost}
                className="cursor-pointer text-sm sm:text-base bg-black text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full hover:bg-gray-800 transition-all font-medium disabled:opacity-50"
                disabled={!content.trim()}
              >
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Feed */}
        <FeedCard posts={posts} />

      </Layout>
    </>
  );
}

