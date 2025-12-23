import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import type { Express } from "express";
import cors from 'cors';


export async function startServer() {
    const app: Express = express();

    const apolloServer = new ApolloServer({
        typeDefs: `
        type Query {
            hello: String
        }
        `,
        resolvers: {
            Query: {
                hello: () => 'Hello world!',
            },
        },

    });

    await apolloServer.start();

    app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        express.json(),
        expressMiddleware(apolloServer),
    );
    return app;
}