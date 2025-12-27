import { prisma } from "../../lib/db.js";
import type { GraphqlContext } from "../../interfaces.js";
import type { User } from "../../generated/prisma/client.js";
import { UserService } from "../../services/user.js";


const queries = {
    verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
        return await UserService.verifyGoogleToken(token);
    },
    getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
        const id = ctx.user?.id;
        if (!id) return null;

        const user = await prisma.user.findUnique({ where: { id } });
        return user;
    },
    getUserById: async (parent: any, { id }: { id: string }, ctx: GraphqlContext) => {
        const user = await prisma.user.findUnique({ where: { id } });
        return user;
    }
}

const extraResolvers = {
    User: {
        posts: async (parent: User) => {
            return await prisma.post.findMany({ where: { authorId: parent.id } });
        },
        followers: async (parent: User) => {
            const follows = await prisma.follow.findMany({
                where: { following: { id: parent.id } },
                include: { follower: true }
            });
            return follows.map(f => f.follower);
        },
        following: async (parent: User) => {
            const follows = await prisma.follow.findMany({
                where: { follower: { id: parent.id } },
                include: { following: true }
            });
            return follows.map(f => f.following);
        }
    }
}

const mutations = {
    followUser: async (parent: any, { to }: { to: string }, ctx: GraphqlContext) => {
        if (!ctx.user || !ctx.user.id) throw new Error("You are not authenticated!");
        await UserService.followUser(ctx.user.id, to)
        return true;
    },
    unfollowUser: async (parent: any, { to }: { to: string }, ctx: GraphqlContext) => {
        if (!ctx.user || !ctx.user.id) throw new Error("You are not authenticated!");
        await UserService.unfollowUser(ctx.user.id, to)
        return true
    }
}

export const resolvers = {
    queries,
    mutations,
    extraResolvers
}