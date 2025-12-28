import { GraphQLClient } from "graphql-request"

const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("spread_token") || ""
    }
    return ""
}

export const graphqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string, {
    headers: () => ({
        "Authorization": `Bearer ${getAuthToken()}`
    }),
})

