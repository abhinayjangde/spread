
export const createPostMutation = `#graphql
    mutation CreatePost($payload: CreatePostData!){
        createPost(payload: $payload) {
            id
        }
    }
`;