import jwt from "jsonwebtoken";
import env from "../config/env.js";
import type { User } from "../generated/prisma/client.js";
import type { JWTUser } from "../interfaces.js";

export class JWTService {
    public static generateTokenForUser(user: User) {
        const payload: JWTUser = {
            id: user?.id,
            email: user?.email
        }

        const token = jwt.sign(payload, env.jwtSecret!)
        return token;
    }

    public static decodeToken(token: string) {
        try {
            return jwt.verify(token, env.jwtSecret as string) as JWTUser;
        } catch (error) {
            return null;
        }
    }
}