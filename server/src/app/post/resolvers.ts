import type { GraphqlContext } from "../../interfaces.js";
import { prisma } from "../../lib/db.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import env from "../../config/env.js";
import { redis } from "../../lib/redis.js";
import { PostService } from "../../services/post.js";

export interface CreatePostPayload {
    content: string;
    imageURL?: string;
    userId: string;
}

const s3Client = new S3Client({
    region: env.aws.s3Region!,
    credentials: {
        accessKeyId: env.aws.s3AccessKeyId!,
        secretAccessKey: env.aws.s3SecretAccessKey!,
    }
});

const queries = {
    getAllPosts: async (parent: any, args: any, ctx: GraphqlContext) => {
        // const cachedPosts = await redis.get('allPosts');
        // if (cachedPosts) {
        //     return JSON.parse(cachedPosts);
        // }
        const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
        // await redis.set('allPosts', JSON.stringify(posts));
        return posts;
    },
    getSignedURLForPostImage: async (parent: any, { imageName, imageType }: { imageName: string, imageType: string }, ctx: GraphqlContext) => {
        if (!ctx.user || !ctx.user.id) {
            throw new Error("You must be logged in to get a signed URL");
        }

        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
        if (!allowedImageTypes.includes(imageType)) {
            throw new Error("Invalid image type");
        }

        try {
            const putObjCommand = new PutObjectCommand({
                Bucket: env.aws.s3BucketName!,
                Key: `uploads/${ctx.user.id}/posts/${imageName}-${Date.now().toString()}.${imageType.split('/')[1]}`,
                ContentType: imageType,
            });

            const signedURL = await getSignedUrl(s3Client, putObjCommand, { expiresIn: 3600 });
            return signedURL;
        } catch (error) {
            console.error("Error creating PutObjectCommand:", error);
            throw new Error("Could not create signed URL");
        }
    }
}

const mutations = {
    createPost: async (parent: any, { payload }: { payload: CreatePostPayload }, ctx: GraphqlContext) => {
        if (!ctx.user || !ctx.user.id) {
            throw new Error("You must be logged in to create a post");
        }

        return await PostService.createPost({
            content: payload.content,
            imageURL: payload.imageURL,
            userId: ctx.user.id
        })
    }
}

const extraResolvers = {
    Post: {
        author: async (parent: any) => {
            return prisma.user.findUnique({
                where: { id: parent.authorId }
            });
        }
    }
}

export const resolvers = { queries, mutations, extraResolvers }