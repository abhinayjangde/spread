import { graphqlClient } from "@/clients/api"
import { CreatePostData } from "@/gql/graphql"
import { createPostMutation } from "@/graphql/mutations/post"
import { getAllPostsQuery } from "@/graphql/query/post"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (payload: CreatePostData) => {
            return await graphqlClient.request(createPostMutation, { payload })
        },
        onMutate: () => {
            toast.loading("Creating post...", { id: "create_post" });
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["all_posts"] });
            toast.success("Post created successfully!", { id: "create_post" });
        }
    })
    return mutation;
}
export const useGetAllPosts = () => {
    const query = useQuery({
        queryKey: ["all_posts"],
        queryFn: async () => await graphqlClient.request(getAllPostsQuery)
    })
    return { ...query, posts: query.data?.getAllPosts }
}