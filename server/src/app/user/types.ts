export const types = `#graphql
  type User {
        id: ID!
        firstName: String!
        lastName: String
        email: String!
        avatar: String 
        createdAt: String

        followers: [User]
        following: [User]
        posts: [Post]

        recommendedUsers: [User]
    }
`;