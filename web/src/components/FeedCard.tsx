import Image from 'next/image'
import React from 'react'
import { FiMessageSquare } from "react-icons/fi";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";
import { Post } from '@/gql/graphql';
import Link from 'next/link';

export interface PostProps extends Post { }

const FeedCard: React.FC<{ posts: PostProps[] }> = ({ posts }) => {

    return (
        <>
            {posts?.map((post) => (
                <div
                    key={post.id}
                    className="flex gap-3 sm:gap-4 border-t border-gray-400 p-3 sm:p-4 hover:bg-gray-50 transition-all cursor-pointer"
                >
                    {/* Avatar */}
                    <div className="shrink-0">
                        {post.author?.avatar && (
                            <Link href={`/${post.author.id}`}>
                                <Image
                                    src={post.author.avatar}
                                    alt="Profile"
                                    width={48}
                                    height={48}
                                    className="rounded-full w-10 h-10 sm:w-12 sm:h-12 object-cover"
                                />
                            </Link>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                            <h5 className="text-sm sm:text-base font-bold truncate">
                                {post.author?.firstName} {post.author?.lastName}
                            </h5>
                            <span className="text-gray-500 text-xs sm:text-sm">
                                · {(() => {
                                    const now = Date.now();
                                    const createdAt = Number(post.createdAt);
                                    const diffInSeconds = Math.floor((now - createdAt) / 1000);

                                    if (diffInSeconds < 60) return `${diffInSeconds}s`;
                                    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
                                    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
                                    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

                                    return new Date(createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: new Date(createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                                    });
                                })()}
                            </span>
                        </div>

                        <p className="text-sm sm:text-base mt-1 wrap-break-word">
                            {post.content}
                        </p>
                        {post.imageURL && (
                            <Image src={post.imageURL} width={500} height={300} alt="Post Image" className="mt-2 rounded-md max-h-96 object-cover" />
                        )}
                        { }

                        {/* Action Buttons */}
                        <div className="flex justify-between max-w-70 sm:max-w-[320px] mt-3 text-gray-500">
                            <button className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-full hover:bg-blue-50 hover:text-blue-500 transition-all group">
                                <FiMessageSquare className="text-base sm:text-lg" />
                                <span className="text-xs sm:text-sm hidden xs:inline">0</span>
                            </button>
                            <button className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-full hover:bg-green-50 hover:text-green-500 transition-all group">
                                <AiOutlineRetweet className="text-base sm:text-lg" />
                                <span className="text-xs sm:text-sm hidden xs:inline">0</span>
                            </button>
                            <button className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-all group">
                                <FaRegHeart className="text-base sm:text-lg" />
                                <span className="text-xs sm:text-sm hidden xs:inline">0</span>
                            </button>
                            <button className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-full hover:bg-blue-50 hover:text-blue-500 transition-all group">
                                <MdOutlineFileUpload className="text-base sm:text-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default FeedCard