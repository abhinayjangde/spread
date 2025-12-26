
export const getAllPostsQuery = `#graphql
  query GetAllPosts {
    getAllPosts {
      id,
      content,
      imageURL,
      createdAt
      author {
        id,
        firstName,
        lastName,
        avatar
      }
    }
}`;

export const getSignedURLForPostImageQuery = `#graphql
  query GetSignedURL($imageName: String!, $imageType: String!) {
  getSignedURLForPostImage(imageName: $imageName, imageType: $imageType)
}`;