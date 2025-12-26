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
        author {
          firstName,
          lastName,
          avatar
        }
      }
    }
}`;