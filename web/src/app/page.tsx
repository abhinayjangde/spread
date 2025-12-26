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
import { FeedSkeleton, ComposerSkeleton, MobileHeaderSkeleton } from "@/components/Shimmer";
import { graphqlClient } from "@/clients/api";
import { getSignedURLForPostImageQuery } from "@/graphql/query/post";

export default function Home() {

  const { user, isLoading: userLoading } = useCurrentUser();
  const { posts = [], isLoading: postsLoading } = useGetAllPosts();
  const { mutate: createPost } = useCreatePost();
  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState<string | null>(null);

  const hanldeChangeInputFile = useCallback((input: HTMLInputElement) => {

    return async (event: Event) => {
      event.preventDefault();
      const file: File | null | undefined = input.files?.item(0);

      if (!file) return;
      const { getSignedURLForPostImage } = await graphqlClient.request(getSignedURLForPostImageQuery, {
        imageName: file.name,
        imageType: file.type
      })
      const signedURL = getSignedURLForPostImage;
      if (signedURL) {
        toast.loading("uploading...", { id: "uploadPostImage" });
        await fetch(signedURL, {
          method: "PUT",
          headers: {
            "Content-Type": file.type
          },
          body: file
        });
        toast.success("uploaded successfully.", { id: "uploadPostImage" });
      }

      const publicURL = signedURL.split("?")[0];
      setImageURL(publicURL);

    }
  }, [])
  const handleSelectImage = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.accept = 'image/*';
    const handlerFn = hanldeChangeInputFile(input);
    input.addEventListener("change", handlerFn)
    input.click();
  }, [hanldeChangeInputFile])

  const handleCreatePost = useCallback(async () => {
    if (content.trim().length === 0) {
      toast.error("Post content cannot be empty.");
      return;
    }
    createPost({ content, imageURL })
    setContent("");
  }, [content, imageURL, createPost])


  return (
    <>
      <Layout>
        {/* Header - Mobile */}
        {userLoading ? (
          <MobileHeaderSkeleton />
        ) : (
          <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 lg:hidden">
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
                <div className="w-8 h-8 bg-gray-200 dark:bg-zinc-800 rounded-full" />
              )}
              <h1 className="font-bold text-lg">Home</h1>
              <div className="w-8" />
            </div>
          </header>
        )}

        {/* Write Post */}
        {userLoading ? (
          <ComposerSkeleton />
        ) : (
          <div className="flex gap-3 sm:gap-4 border-b border-gray-200 dark:border-zinc-800 p-3 sm:p-4">
            <div className="shrink-0 hidden sm:block">
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
                className="overflow-y-auto no-scrollbar resize-none p-2 w-full focus:outline-none bg-transparent text-sm sm:text-base min-h-15 sm:min-h-20 placeholder-gray-500 dark:placeholder-gray-400"
                rows={2}
                placeholder="What's happening?"
                name="postContent"
                id="postContent"
              />
              {imageURL && (
                <Image src={imageURL} width={100} height={100} alt="Selected" className="mt-2 rounded-md max-h-60 object-cover" />
              )}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 sm:gap-4">
                  <MdOutlineImage
                    onClick={handleSelectImage}
                    className="text-xl sm:text-2xl cursor-pointer text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-all"
                  />
                  <MdOutlineEmojiEmotions
                    className="text-xl sm:text-2xl cursor-pointer text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-all"
                  />
                </div>
                <button
                  onClick={handleCreatePost}
                  className="cursor-pointer text-sm sm:text-base bg-black dark:bg-white text-white dark:text-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all font-medium disabled:opacity-50"
                  disabled={!content.trim()}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feed */}
        {postsLoading ? (
          <FeedSkeleton count={5} />
        ) : (
          <FeedCard posts={posts} />
        )}

      </Layout>
    </>
  );
}

