export const queries = `#graphql
    getAllPosts: [Post]
    getSignedURLForPostImage(imageName: String!, imageType: String!): String
`;