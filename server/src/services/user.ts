import axios from "axios";
import { prisma } from "../lib/db.js";
import { JWTService } from "./jwt.js";

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

export class UserService {
    public static async verifyGoogleToken(token: string): Promise<string> {
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
    }
    public static async followUser(from: string, to: string) {
        return await prisma.follow.create({
            data: {
                follower: {
                    connect: { id: from }
                },
                following: {
                    connect: { id: to }
                }
            }
        });
    }
    public static async unfollowUser(from: string, to: string) {
        return await prisma.follow.delete({
            where: {
                followerId_followingId: { followerId: from, followingId: to }
            }
        })
    }
}