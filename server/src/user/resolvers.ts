import axios from "axios";
import { prisma } from "../lib/db.js";
import { JWTService } from "../services/jwt.js";
import type { GraphqlContext } from "../interfaces.js";
import type { User } from "../generated/prisma/client.js";

interface GoogleTokenResult {
    nbf?: string;
    name?: string;
    picture: string;
    given_name: string;
    family_name: string;
    email_verified: string;
    iss?: string;
    azp?: string;
    aud?: string;
    sub?: string;
    email: string;
    iat?: string;
    exp?: string;
    jti?: string;
    alg?: string;
    kid?: string;
    typ?: string;
}

const queries = {
    verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
        const googleToken = token;
        const googleOAuthURL = new URL('https://oauth2.googleapis.com/tokeninfo');
        googleOAuthURL.searchParams.append('id_token', googleToken);
        const { data } = await axios.get<GoogleTokenResult>(googleOAuthURL.toString(), {
            responseType: 'json'
        });

        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        })

        if (!existingUser) {
            await prisma.user.create({
                data: {
                    email: data.email,
                    firstName: data?.given_name,
                    lastName: data?.family_name,
                    avatar: data?.picture
                }
            });
        }

        const user = await prisma.user.findUnique({
            where: { email: data.email }
        })

        if (!user) {
            throw new Error("User with email not found!")
        }
        const userToken = JWTService.generateTokenForUser(user);

        return userToken;
    },
    getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
        const id = ctx.user?.id;
        if (!id) return null;

        const user = await prisma.user.findUnique({ where: { id } });
        return user;
    }
}

const extraResolvers = {
    User: {
        posts: async (parent: User) => {
            return await prisma.post.findMany({ where: { authorId: parent.id } });
        }
    }
}
export const resolvers = {
    queries,
    extraResolvers
}