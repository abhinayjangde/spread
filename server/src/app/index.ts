import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import type { Express } from "express";
import cors from 'cors';
import { User } from "../user/index.js";


export async function startServer() {
    const app: Express = express();
    app.use(cors<cors.CorsRequest>({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    const apolloServer = new ApolloServer({
        typeDefs: `
            ${User.types}
            type Query {
                ${User.queries}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries
            },
        },

    });

    await apolloServer.start();

    app.use(
        '/graphql',
        express.json(),
        expressMiddleware(apolloServer),
    );
    return app;
}