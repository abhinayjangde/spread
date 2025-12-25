
export const getAllPostsQuery = `#graphql
  query GetAllPosts {
    getAllPosts {
      id,
      content,
      imageURL,
      author {
        firstName,
        lastName,
        avatar
      }
    }
}`;