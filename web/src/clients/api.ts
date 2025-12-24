import { GraphQLClient } from "graphql-request"

export const graphqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string, {
    headers: {
        "Authorization": `Bearer ${typeof window !== "undefined" ? localStorage.getItem("spread_token") : ""}`
    },
})

