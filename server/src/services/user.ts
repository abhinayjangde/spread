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

        try {
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
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown database error";
            console.error("Auth error:", message, error);
            if (
                message.includes("Can't reach database server") ||
                message.includes("Tenant or user not found") ||
                message.includes("self-signed certificate")
            ) {
                throw new Error("Authentication service is temporarily unavailable. Please try again shortly.");
            }

            throw error;
        }
    }
    public static async followUser(from: string, to: string) {
        // Check if already following
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: { followerId: from, followingId: to }
            }
        });

        if (existingFollow) {
            // Already following, return existing record
            return existingFollow;
        }

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