import jwt from "jsonwebtoken";
import env from "../config/env.js";
import type { User } from "../generated/prisma/client.js";

export class JWTService {
    public static generateTokenForUser(user: User) {
        const payload = {
            id: user?.id,
            email: user?.email
        }

        const token = jwt.sign(payload, env.jwtSecret!)
        return token;
    }
}