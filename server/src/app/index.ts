import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import type { Express } from "express";
import cors from 'cors';
import { User } from "./user/index.js";
import { Post } from "./post/index.js";
import type { GraphqlContext } from "../interfaces.js";
import { JWTService } from "../services/jwt.js";


export async function startServer() {
    const app: Express = express();

    app.use(cors<cors.CorsRequest>({
        origin: ["http://localhost:3000", "https://spread-pi.vercel.app", "https://spread.codebhaiya.com"],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'OK' });
    });

    const apolloServer = new ApolloServer<GraphqlContext>({
        typeDefs: `
            ${User.types}
            ${Post.types}

            type Query {
                ${User.queries}
                ${Post.queries}
            }

            type Mutation {
                ${Post.mutations}
                ${User.mutations}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
                ...Post.resolvers.queries
            },
            Mutation: {
                ...Post.resolvers.mutations,
                ...User.resolvers.mutations
            },
            ...Post.resolvers.extraResolvers,
            ...User.resolvers.extraResolvers
        },
        introspection: true,
        csrfPrevention: false,
    });

    await apolloServer.start();

    app.use(
        '/graphql',
        express.json(),
        expressMiddleware(apolloServer, {
            context: async ({ req, res }) => {
                const token = req.headers.authorization?.split(" ")[1];

                return {
                    user: token ? JWTService.decodeToken(token) : undefined
                }
            }
        }),
    );
    return app;
}