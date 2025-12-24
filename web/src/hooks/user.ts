import { graphqlClient } from "@/clients/api"
import { getCurrentUserQuery } from "@/graphql/query/user"
import { useQuery } from "@tanstack/react-query"

export const useCurrentUser = () => {
    const query = useQuery({
        queryKey: ["current_user"],
        queryFn: async () => await graphqlClient.request(getCurrentUserQuery)
    })
    return { ...query, user: query.data?.getCurrentUser }
}