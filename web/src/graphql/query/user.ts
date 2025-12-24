export const verifyUserGoogleTokenQuery = `#graphql
  query VerifyGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
}
`;