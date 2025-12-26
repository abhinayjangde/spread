import { graphqlClient } from "@/clients/api"
import { getCurrentUserQuery, getUserByIdQuery } from "@/graphql/query/user"
import { useQuery } from "@tanstack/react-query"

export const useCurrentUser = () => {
    const query = useQuery({
        queryKey: ["current_user"],
        queryFn: async () => await graphqlClient.request(getCurrentUserQuery)
    })
    return { ...query, user: query.data?.getCurrentUser }
}

export const useUserById = (id: string) => {
    const query = useQuery({
        queryKey: ["user_by_id", id],
        queryFn: async () => await graphqlClient.request(getUserByIdQuery, { id })
    })
    return { ...query, user: query.data?.getUserById }
}