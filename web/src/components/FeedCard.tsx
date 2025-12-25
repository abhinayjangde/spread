import Image from 'next/image'
import React from 'react'
import { FiMessageSquare } from "react-icons/fi";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";

export interface Post {
    id: string;
    content: string;
    imageURL?: string;
    author: {
        firstName: string;
        lastName: string;
        avatar: string;
    }
}

const FeedCard: React.FC<{ posts: Post[] }> = ({ posts }) => {

    return (
        <>
            {
                posts?.map((post) => (<div key={post.id} className="grid grid-cols-12 gap-4 border-t border-gray-400 p-4 hover:bg-gray-100 cursor-pointer transition-all">
                    <div className="col-span-1">
                        <Image
                            src={post.author.avatar} alt="Profile"
                            width={100}
                            height={100}
                            className="rounded-full m-2"
                        />
                    </div>
                    <div className="col-span-11 px-4">
                        <h5 className="font-bold text-xl">{post.author.firstName} {post.author.lastName}</h5>
                        <p>
                            {post.content}
                        </p>

                        <div className="flex justify-between w-[90%] mt-4 text-xl text-gray-600">
                            <div>
                                <FiMessageSquare className="mt-2 cursor-pointer" />
                            </div>
                            <div>
                                <AiOutlineRetweet className="mt-2 cursor-pointer" />
                            </div>
                            <div>
                                <FaRegHeart className="mt-2 cursor-pointer" />
                            </div>
                            <div>
                                <MdOutlineFileUpload className="mt-2 cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>))
            }
        </>

    )
}

export default FeedCard