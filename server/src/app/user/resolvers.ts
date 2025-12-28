import { prisma } from "../../lib/db.js";
import type { GraphqlContext } from "../../interfaces.js";
import type { User } from "../../generated/prisma/client.js";
import { UserService } from "../../services/user.js";
import { redis } from "../../lib/redis.js";


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


const mutations = {
    followUser: async (parent: any, { to }: { to: string }, ctx: GraphqlContext) => {
        if (!ctx.user || !ctx.user.id) throw new Error("You are not authenticated!");
        await UserService.followUser(ctx.user.id, to)
        await redis.del(`recommendedUsers:${ctx.user.id}`);
        return true;
    },
    unfollowUser: async (parent: any, { to }: { to: string }, ctx: GraphqlContext) => {
        if (!ctx.user || !ctx.user.id) throw new Error("You are not authenticated!");
        await UserService.unfollowUser(ctx.user.id, to)
        await redis.del(`recommendedUsers:${ctx.user.id}`);
        return true
    }
}

const extraResolvers = {
    User: {
        posts: async (parent: User) => {

            const posts = await prisma.post.findMany({
                where: { authorId: parent.id },
                orderBy: { createdAt: 'desc' }
            });

            return posts;
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
        },


        recommendedUsers: async (parent: User, args: any, ctx: GraphqlContext) => {
            if (!ctx.user || !ctx.user.id) return [];
            const chachedUsers = await redis.get(`recommendedUsers:${ctx.user.id}`);
            if (chachedUsers) {
                return JSON.parse(chachedUsers);
            }
            const users: User[] = [];
            const myFollowings = await prisma.follow.findMany({
                where: {
                    follower: { id: ctx.user.id }
                },
                include: {
                    following: {
                        include: {
                            followers: {
                                include: {
                                    following: true
                                }
                            }
                        }
                    }
                }

            })

            for (const follow of myFollowings) {

                for (const fof of follow.following.followers) {
                    const user = fof.following;
                    // don't recommend myself
                    if (user.id === ctx.user.id) continue;
                    // don't recommend someone I already follow
                    if (myFollowings.find(f => f.followingId === user.id)) continue;
                    // don't add duplicates
                    if (users.find(u => u.id === user.id)) continue;
                    // add user to recommendations
                    users.push(user);
                    // limit to 5 recommendations
                    if (users.length >= 5) break;
                }
            }
            await redis.set(`recommendedUsers:${ctx.user.id}`, JSON.stringify(users));
            return users;
        }
    }
}

export const resolvers = {
    queries,
    mutations,
    extraResolvers
}