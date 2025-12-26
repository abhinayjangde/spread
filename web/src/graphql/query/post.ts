
export const getAllPostsQuery = `#graphql
  query GetAllPosts {
    getAllPosts {
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
}`;