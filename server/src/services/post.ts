import { prisma } from "../lib/db.js";
import { redis } from "../lib/redis.js";

interface CreatePostPayload {
    content: string;
    imageURL?: string | undefined;
    userId: string;
}

export class PostService {
    public static async createPost(data: CreatePostPayload) {

        const post = await prisma.post.create({
            data: {
                content: data.content,
                imageURL: data.imageURL as string,
                author: {
                    connect: { id: data.userId }
                }
            }
        })

        // await redis.del('allPosts');
        return post;
    }
}