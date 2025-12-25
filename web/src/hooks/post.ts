import { graphqlClient } from "@/clients/api"
import { getAllPostsQuery } from "@/graphql/query/post"
import { useQuery } from "@tanstack/react-query"

export const useGetAllPosts = () => {
    const query = useQuery({
        queryKey: ["all_posts"],
        queryFn: async () => await graphqlClient.request(getAllPostsQuery)
    })
    return { ...query, posts: query.data?.getAllPosts }
}