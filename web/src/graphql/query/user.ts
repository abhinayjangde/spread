export const verifyUserGoogleTokenQuery = `#graphql
  query VerifyUserGoogleToken($token: String!) {
    verifyUserGoogleToken(token: $token) {
      id
      email
      name
      token
    }
}
`;