# Backend Code Flow Examples

This document provides detailed code flow examples for common operations in the Spread backend.

## Table of Contents
- [User Authentication Flow](#user-authentication-flow)
- [Create Post Flow](#create-post-flow)
- [Get Feed Flow](#get-feed-flow)
- [Follow User Flow](#follow-user-flow)
- [Image Upload Flow](#image-upload-flow)
- [Recommended Users Flow](#recommended-users-flow)

---

## User Authentication Flow

### Complete Flow: Login with Google

```
CLIENT                          SERVER                          GOOGLE                    DATABASE
  │                               │                               │                          │
  │  1. Click "Sign in"           │                               │                          │
  │──────────────────────────────▶│                               │                          │
  │                               │                               │                          │
  │  2. Redirect to Google        │                               │                          │
  │◀──────────────────────────────│                               │                          │
  │                               │                               │                          │
  │  3. User authorizes           │                               │                          │
  │──────────────────────────────────────────────────────────────▶│                          │
  │                               │                               │                          │
  │  4. Get Google ID token       │                               │                          │
  │◀──────────────────────────────────────────────────────────────│                          │
  │                               │                               │                          │
  │  5. Send token to server      │                               │                          │
  │  verifyGoogleToken(token)     │                               │                          │
  │──────────────────────────────▶│                               │                          │
  │                               │                               │                          │
  │                               │  6. Verify token              │                          │
  │                               │──────────────────────────────▶│                          │
  │                               │                               │                          │
  │                               │  7. Return user data          │                          │
  │                               │◀──────────────────────────────│                          │
  │                               │                               │                          │
  │                               │  8. Check if user exists      │                          │
  │                               │────────────────────────────────────────────────────────▶│
  │                               │                               │                          │
  │                               │  9. User data or null         │                          │
  │                               │◀────────────────────────────────────────────────────────│
  │                               │                               │                          │
  │                               │  10. Create user if new       │                          │
  │                               │────────────────────────────────────────────────────────▶│
  │                               │                               │                          │
  │                               │  11. Get user                 │                          │
  │                               │────────────────────────────────────────────────────────▶│
  │                               │                               │                          │
  │                               │  12. User data                │                          │
  │                               │◀────────────────────────────────────────────────────────│
  │                               │                               │                          │
  │                               │  13. Generate JWT             │                          │
  │                               │  (JWTService)                 │                          │
  │                               │                               │                          │
  │  14. Return JWT token         │                               │                          │
  │◀──────────────────────────────│                               │                          │
  │                               │                               │                          │
  │  15. Store JWT in localStorage│                               │                          │
  │                               │                               │                          │
```

### Code Path

**1. GraphQL Query (`app/user/queries.ts`):**
```typescript
verifyGoogleToken(token: String!): String
```

**2. Resolver (`app/user/resolvers.ts`):**
```typescript
const queries = {
    verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
        return await UserService.verifyGoogleToken(token);
    }
}
```

**3. Service Layer (`services/user.ts`):**
```typescript
public static async verifyGoogleToken(token: string): Promise<string> {
    // Step 1: Verify with Google
    const googleOAuthURL = new URL('https://oauth2.googleapis.com/tokeninfo');
    googleOAuthURL.searchParams.append('id_token', token);
    const { data } = await axios.get<GoogleTokenResult>(googleOAuthURL.toString());
    
    // Step 2: Find existing user
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
    });
    
    // Step 3: Create if doesn't exist
    if (!existingUser) {
        await prisma.user.create({
            data: {
                email: data.email,
                firstName: data.given_name,
                lastName: data.family_name,
                avatar: data.picture
            }
        });
    }
    
    // Step 4: Get user
    const user = await prisma.user.findUnique({
        where: { email: data.email }
    });
    
    // Step 5: Generate JWT
    const userToken = JWTService.generateTokenForUser(user);
    
    return userToken;
}
```

**4. JWT Generation (`services/jwt.ts`):**
```typescript
public static generateTokenForUser(user: User) {
    const payload: JWTUser = {
        id: user.id,
        email: user.email
    }
    const token = jwt.sign(payload, env.jwtSecret!)
    return token;
}
```

---

## Create Post Flow

### Complete Flow

```
CLIENT                          SERVER                          S3                      DATABASE/REDIS
  │                               │                               │                          │
  │  1. Get signed URL            │                               │                          │
  │  getSignedURLForPostImage()   │                               │                          │
  │──────────────────────────────▶│                               │                          │
  │                               │                               │                          │
  │                               │  2. Verify JWT in context     │                          │
  │                               │  (Middleware)                 │                          │
  │                               │                               │                          │
  │                               │  3. Generate signed URL       │                          │
  │                               │──────────────────────────────▶│                          │
  │                               │                               │                          │
  │                               │  4. Return signed URL         │                          │
  │                               │◀──────────────────────────────│                          │
  │                               │                               │                          │
  │  5. Signed URL                │                               │                          │
  │◀──────────────────────────────│                               │                          │
  │                               │                               │                          │
  │  6. Upload image to S3        │                               │                          │
  │──────────────────────────────────────────────────────────────▶│                          │
  │                               │                               │                          │
  │  7. Upload success            │                               │                          │
  │◀──────────────────────────────────────────────────────────────│                          │
  │                               │                               │                          │
  │  8. Create post with imageURL │                               │                          │
  │  createPost(payload)          │                               │                          │
  │──────────────────────────────▶│                               │                          │
  │                               │                               │                          │
  │                               │  9. Verify user in context    │                          │
  │                               │                               │                          │
  │                               │  10. Create post in DB        │                          │
  │                               │────────────────────────────────────────────────────────▶│
  │                               │                               │                          │
  │                               │  11. Post created             │                          │
  │                               │◀────────────────────────────────────────────────────────│
  │                               │                               │                          │
  │                               │  12. (Optional) Clear cache   │                          │
  │                               │  redis.del('allPosts')        │                          │
  │                               │────────────────────────────────────────────────────────▶│
  │                               │                               │                          │
  │  13. Return created post      │                               │                          │
  │◀──────────────────────────────│                               │                          │
  │                               │                               │                          │
```

### Code Path

**Query: Get Signed URL (`app/post/resolvers.ts`):**
```typescript
getSignedURLForPostImage: async (
    parent: any, 
    { imageName, imageType }: { imageName: string, imageType: string }, 
    ctx: GraphqlContext
) => {
    // 1. Validate authentication
    if (!ctx.user || !ctx.user.id) {
        throw new Error("You must be logged in");
    }
    
    // 2. Validate image type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(imageType)) {
        throw new Error("Invalid image type");
    }
    
    // 3. Create S3 command
    const putObjCommand = new PutObjectCommand({
        Bucket: env.aws.s3BucketName!,
        Key: `uploads/${ctx.user.id}/posts/${imageName}-${Date.now()}.${imageType.split('/')[1]}`,
        ContentType: imageType,
    });
    
    // 4. Get signed URL (expires in 1 hour)
    const signedURL = await getSignedUrl(s3Client, putObjCommand, { expiresIn: 3600 });
    
    return signedURL;
}
```

**Mutation: Create Post (`app/post/resolvers.ts`):**
```typescript
createPost: async (
    parent: any, 
    { payload }: { payload: CreatePostPayload }, 
    ctx: GraphqlContext
) => {
    // 1. Validate authentication
    if (!ctx.user || !ctx.user.id) {
        throw new Error("You must be logged in to create a post");
    }
    
    // 2. Call service
    return await PostService.createPost({
        content: payload.content,
        imageURL: payload.imageURL,
        userId: ctx.user.id
    })
}
```

**Service (`services/post.ts`):**
```typescript
public static async createPost(data: CreatePostPayload) {
    // 1. Create post in database
    const post = await prisma.post.create({
        data: {
            content: data.content,
            imageURL: data.imageURL as string,
            author: {
                connect: { id: data.userId }
            }
        }
    })
    
    // 2. Invalidate cache (currently commented)
    // await redis.del('allPosts');
    
    return post;
}
```

---

## Get Feed Flow

### Complete Flow

```
CLIENT                          SERVER                          DATABASE/REDIS
  │                               │                                  │
  │  1. Request all posts         │                                  │
  │  getAllPosts                  │                                  │
  │──────────────────────────────▶│                                  │
  │                               │                                  │
  │                               │  2. (Optional) Check cache       │
  │                               │  redis.get('allPosts')           │
  │                               │─────────────────────────────────▶│
  │                               │                                  │
  │                               │  3. Cache miss (null)            │
  │                               │◀─────────────────────────────────│
  │                               │                                  │
  │                               │  4. Query database               │
  │                               │  findMany({ orderBy: createdAt })│
  │                               │─────────────────────────────────▶│
  │                               │                                  │
  │                               │  5. Return posts                 │
  │                               │◀─────────────────────────────────│
  │                               │                                  │
  │                               │  6. (Optional) Cache posts       │
  │                               │  redis.set('allPosts', ...)      │
  │                               │─────────────────────────────────▶│
  │                               │                                  │
  │  7. Return posts to client    │                                  │
  │◀──────────────────────────────│                                  │
  │                               │                                  │
  │  8. Request author for post   │                                  │
  │  (Field resolver)             │                                  │
  │──────────────────────────────▶│                                  │
  │                               │                                  │
  │                               │  9. Query user by authorId       │
  │                               │─────────────────────────────────▶│
  │                               │                                  │
  │                               │  10. Return user                 │
  │                               │◀─────────────────────────────────│
  │                               │                                  │
  │  11. Return complete data     │                                  │
  │◀──────────────────────────────│                                  │
  │                               │                                  │
```

### Code Path

**Query (`app/post/resolvers.ts`):**
```typescript
getAllPosts: async (parent: any, args: any, ctx: GraphqlContext) => {
    // 1. Check cache (currently commented)
    // const cachedPosts = await redis.get('allPosts');
    // if (cachedPosts) return JSON.parse(cachedPosts);
    
    // 2. Query database
    const posts = await prisma.post.findMany({ 
        orderBy: { createdAt: 'desc' } 
    });
    
    // 3. Cache results (currently commented)
    // await redis.set('allPosts', JSON.stringify(posts));
    
    return posts;
}
```

**Field Resolver (`app/post/resolvers.ts`):**
```typescript
const extraResolvers = {
    Post: {
        author: async (parent: any) => {
            // Resolve author for each post
            return prisma.user.findUnique({
                where: { id: parent.authorId }
            });
        }
    }
}
```

---

## Follow User Flow

### Complete Flow

```
CLIENT                          SERVER                          DATABASE/REDIS
  │                               │                                  │
  │  1. Follow user               │                                  │
  │  followUser(to: "user_id")    │                                  │
  │──────────────────────────────▶│                                  │
  │                               │                                  │
  │                               │  2. Verify authentication        │
  │                               │  ctx.user exists?                │
  │                               │                                  │
  │                               │  3. Check if already following   │
  │                               │  findUnique(followerId, followingId)
  │                               │─────────────────────────────────▶│
  │                               │                                  │
  │                               │  4. Return existing or null      │
  │                               │◀─────────────────────────────────│
  │                               │                                  │
  │                               │  5. Create follow if not exists  │
  │                               │  follow.create(...)              │
  │                               │─────────────────────────────────▶│
  │                               │                                  │
  │                               │  6. Follow created               │
  │                               │◀─────────────────────────────────│
  │                               │                                  │
  │                               │  7. Clear recommendations cache  │
  │                               │  redis.del(recommendedUsers:id)  │
  │                               │─────────────────────────────────▶│
  │                               │                                  │
  │  8. Return success            │                                  │
  │◀──────────────────────────────│                                  │
  │                               │                                  │
```

### Code Path

**Mutation (`app/user/resolvers.ts`):**
```typescript
followUser: async (parent: any, { to }: { to: string }, ctx: GraphqlContext) => {
    // 1. Validate authentication
    if (!ctx.user || !ctx.user.id) {
        throw new Error("You are not authenticated!");
    }
    
    // 2. Call service
    await UserService.followUser(ctx.user.id, to);
    
    // 3. Invalidate recommendations cache
    await redis.del(`recommendedUsers:${ctx.user.id}`);
    
    return true;
}
```

**Service (`services/user.ts`):**
```typescript
public static async followUser(from: string, to: string) {
    // 1. Check if already following
    const existingFollow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: { 
                followerId: from, 
                followingId: to 
            }
        }
    });
    
    // 2. Return if already exists
    if (existingFollow) {
        return existingFollow;
    }
    
    // 3. Create follow relationship
    return await prisma.follow.create({
        data: {
            follower: { connect: { id: from } },
            following: { connect: { id: to } }
        }
    });
}
```

---

## Image Upload Flow

### Detailed S3 Upload Process

```
CLIENT                          SERVER                          AWS S3
  │                               │                               │
  │  1. User selects image        │                               │
  │                               │                               │
  │  2. Request signed URL        │                               │
  │  query {                      │                               │
  │    getSignedURLForPostImage(  │                               │
  │      imageName: "photo"       │                               │
  │      imageType: "image/jpeg"  │                               │
  │    )                          │                               │
  │  }                            │                               │
  │──────────────────────────────▶│                               │
  │                               │                               │
  │                               │  3. Validate user (JWT)       │
  │                               │  4. Validate image type       │
  │                               │  5. Generate S3 key           │
  │                               │     uploads/{userId}/posts/   │
  │                               │     {name}-{timestamp}.{ext}  │
  │                               │                               │
  │                               │  6. Create PutObjectCommand   │
  │                               │  7. Generate pre-signed URL   │
  │                               │     (expires in 3600s)        │
  │                               │─────────────────────────────▶│
  │                               │                               │
  │                               │  8. Signed URL with token     │
  │                               │◀─────────────────────────────│
  │                               │                               │
  │  9. Return signed URL         │                               │
  │◀──────────────────────────────│                               │
  │                               │                               │
  │  10. PUT request to S3        │                               │
  │  (Direct from client)         │                               │
  │────────────────────────────────────────────────────────────▶│
  │  Headers:                     │                               │
  │    Content-Type: image/jpeg   │                               │
  │  Body: <binary image data>    │                               │
  │                               │                               │
  │  11. Upload success           │                               │
  │  (200 OK)                     │                               │
  │◀────────────────────────────────────────────────────────────│
  │                               │                               │
  │  12. Extract public URL       │                               │
  │  (Remove query params)        │                               │
  │                               │                               │
  │  13. Create post with URL     │                               │
  │  mutation {                   │                               │
  │    createPost(payload: {      │                               │
  │      content: "..."           │                               │
  │      imageURL: "https://..."  │                               │
  │    })                         │                               │
  │  }                            │                               │
  │──────────────────────────────▶│                               │
  │                               │                               │
```

### S3 Key Structure

```
uploads/
├── {userId1}/
│   └── posts/
│       ├── photo1-1703123456789.jpeg
│       ├── photo2-1703123467890.png
│       └── image3-1703123478901.webp
├── {userId2}/
│   └── posts/
│       └── picture-1703123489012.jpeg
└── {userId3}/
    └── posts/
        └── snapshot-1703123490123.png
```

---

## Recommended Users Flow

### Algorithm Overview

```
For current user:
  1. Get all users I follow (myFollowings)
  2. For each person I follow:
     a. Get their followers (friends of friends)
     b. For each of their followers:
        - Skip if it's me
        - Skip if I already follow them
        - Skip if already in recommendations
        - Add to recommendations
  3. Limit to 5 recommendations
  4. Cache results
```

### Complete Flow

```
CLIENT                          SERVER                          DATABASE/REDIS
  │                               │                                  │
  │  1. Request recommended users │                                  │
  │  getCurrentUser {             │                                  │
  │    recommendedUsers { ... }   │                                  │
  │  }                            │                                  │
  │──────────────────────────────▶│                                  │
  │                               │                                  │
  │                               │  2. Verify authentication        │
  │                               │                                  │
  │                               │  3. Check cache                  │
  │                               │  redis.get(recommendedUsers:id)  │
  │                               │─────────────────────────────────▶│
  │                               │                                  │
  │                               │  4. Cache miss                   │
  │                               │◀─────────────────────────────────│
  │                               │                                  │
  │                               │  5. Get my followings            │
  │                               │  with their followers            │
  │                               │─────────────────────────────────▶│
  │                               │                                  │
  │                               │  6. Return follow graph          │
  │                               │◀─────────────────────────────────│
  │                               │                                  │
  │                               │  7. Process algorithm            │
  │                               │  (friends of friends)            │
  │                               │  - Filter duplicates             │
  │                               │  - Filter self                   │
  │                               │  - Filter existing follows       │
  │                               │  - Limit to 5                    │
  │                               │                                  │
  │                               │  8. Cache recommendations        │
  │                               │  redis.set(...)                  │
  │                               │─────────────────────────────────▶│
  │                               │                                  │
  │  9. Return recommended users  │                                  │
  │◀──────────────────────────────│                                  │
  │                               │                                  │
```

### Code Path

**Field Resolver (`app/user/resolvers.ts`):**
```typescript
recommendedUsers: async (parent: User, args: any, ctx: GraphqlContext) => {
    // 1. Validate authentication
    if (!ctx.user || !ctx.user.id) return [];
    
    // 2. Check cache
    const cachedUsers = await redis.get(`recommendedUsers:${ctx.user.id}`);
    if (cachedUsers) {
        return JSON.parse(cachedUsers);
    }
    
    const users: User[] = [];
    
    // 3. Get my followings with nested followers
    const myFollowings = await prisma.follow.findMany({
        where: { follower: { id: ctx.user.id } },
        include: {
            following: {
                include: {
                    followers: {
                        include: { following: true }
                    }
                }
            }
        }
    });
    
    // 4. Process friends of friends
    for (const follow of myFollowings) {
        for (const fof of follow.following.followers) {
            const user = fof.following;
            
            // Skip myself
            if (user.id === ctx.user.id) continue;
            
            // Skip if already following
            if (myFollowings.find(f => f.followingId === user.id)) continue;
            
            // Skip duplicates
            if (users.find(u => u.id === user.id)) continue;
            
            // Add to recommendations
            users.push(user);
            
            // Limit to 5
            if (users.length >= 5) break;
        }
    }
    
    // 5. Cache results
    await redis.set(`recommendedUsers:${ctx.user.id}`, JSON.stringify(users));
    
    return users;
}
```

---

## Performance Considerations

### Query Optimization

**N+1 Problem Prevention:**
```typescript
// ❌ Bad: N+1 queries
const posts = await prisma.post.findMany();
for (const post of posts) {
    post.author = await prisma.user.findUnique({ where: { id: post.authorId } });
}

// ✅ Good: Single query with include
const posts = await prisma.post.findMany({
    include: { author: true }
});

// ✅ Best: GraphQL field resolver (only loads when requested)
const extraResolvers = {
    Post: {
        author: async (parent: any) => {
            return prisma.user.findUnique({ where: { id: parent.authorId } });
        }
    }
}
```

### Caching Strategy

**When to Cache:**
- Expensive computations (recommended users)
- Frequently accessed data (all posts)
- Rarely changing data (user profiles)

**When to Invalidate:**
- On data mutation (create, update, delete)
- On relationship changes (follow, unfollow)

**Example:**
```typescript
// Cache on read
const cachedData = await redis.get(key);
if (cachedData) return JSON.parse(cachedData);

const data = await expensiveOperation();
await redis.set(key, JSON.stringify(data));

// Invalidate on write
await redis.del(key);
```

---

## Error Handling

### Common Error Patterns

**1. Authentication Errors:**
```typescript
if (!ctx.user || !ctx.user.id) {
    throw new Error("You must be logged in");
}
```

**2. Not Found Errors:**
```typescript
const user = await prisma.user.findUnique({ where: { id } });
if (!user) {
    throw new Error("User not found");
}
```

**3. Validation Errors:**
```typescript
const allowedTypes = ['image/jpeg', 'image/png'];
if (!allowedTypes.includes(imageType)) {
    throw new Error("Invalid image type");
}
```

**4. External Service Errors:**
```typescript
try {
    const signedURL = await getSignedUrl(s3Client, command);
    return signedURL;
} catch (error) {
    console.error("Error creating signed URL:", error);
    throw new Error("Could not create signed URL");
}
```

---

## Database Transaction Example

For operations affecting multiple models:

```typescript
// Example: Delete user and all related data
const deleteUser = async (userId: string) => {
    await prisma.$transaction(async (tx) => {
        // Delete user's posts
        await tx.post.deleteMany({ where: { authorId: userId } });
        
        // Delete user's comments
        await tx.comment.deleteMany({ where: { authorId: userId } });
        
        // Delete follow relationships
        await tx.follow.deleteMany({
            where: {
                OR: [
                    { followerId: userId },
                    { followingId: userId }
                ]
            }
        });
        
        // Delete user
        await tx.user.delete({ where: { id: userId } });
    });
};
```

---

## Summary

This document provides detailed code flows for:
1. **Authentication** - Google OAuth + JWT
2. **Post Creation** - Including S3 image upload
3. **Feed Retrieval** - With caching and field resolvers
4. **Follow System** - With cache invalidation
5. **Recommendations** - Friends of friends algorithm

For more information, see:
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
