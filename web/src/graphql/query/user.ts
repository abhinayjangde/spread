export const verifyUserGoogleTokenQuery = `#graphql
  query VerifyGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
}
`;

export const getCurrentUserQuery = `#graphql
  query GetCurrentUser {
    getCurrentUser {
      id,
      email,
      avatar,
      firstName,
      lastName,
      posts {
        id,
        content,
        imageURL,
        author {
          firstName,
          lastName,
          avatar
        }
      }
    }
}`;

export const getUserByIdQuery = `#graphql
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id,
      firstName,
      lastName,
      avatar,
      posts {
        id,
        content,
        imageURL,
        author {
          id,
          firstName,
          lastName,
          avatar
        }
      }
    }
}`;