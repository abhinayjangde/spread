import { GraphQLClient } from "graphql-request"

const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("spread_token") || ""
    }
    return ""
}

export const graphqlClient = new GraphQLClient(process.env.NODE_ENV === "development" ? "http://localhost:9000/graphql" : process.env.NEXT_PUBLIC_API_URL as string, {
    headers: () => ({
        "Authorization": `Bearer ${getAuthToken()}`
    }),
})

