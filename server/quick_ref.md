# Backend Quick Reference Guide

A quick reference for developers working with the Spread backend.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start PostgreSQL and Redis
docker-compose up -d

# Setup database
pnpm migrate && pnpm generate

# Start development server
pnpm dev
```

Server: `http://localhost:9000/graphql`

---

## 📁 File Structure

```
server/src/
├── app/              # GraphQL modules
│   ├── user/        # User: types, queries, mutations, resolvers
│   └── post/        # Post: types, queries, mutations, resolvers
├── services/        # Business logic (jwt, user, post)
├── lib/             # Database & Redis clients
├── config/          # Environment configuration
└── prisma/          # Database schema & migrations
```

---

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Entry point |
| `src/app/index.ts` | Apollo Server setup |
| `src/lib/db.ts` | Prisma client |
| `src/lib/redis.ts` | Redis client |
| `src/services/jwt.ts` | JWT utilities |
| `src/config/env.ts` | Environment config |
| `src/prisma/schema.prisma` | Database schema |

---

## 📊 Database Models

```
User
├── id, firstName, lastName, email, avatar
├── posts: Post[]
├── comments: Comment[]
├── followers: Follow[]
└── following: Follow[]

Post
├── id, content, imageURL, authorId
├── author: User
└── comments: Comment[]

Comment
├── id, text, postId, authorId
├── post: Post
└── author: User

Follow (Many-to-Many)
├── followerId → User
└── followingId → User
```

---

## 🔐 Authentication

**Login Flow:**
```graphql
# 1. Client gets Google ID token
# 2. Send to server
mutation {
  verifyGoogleToken(token: "google_id_token")
}
# Returns: JWT token

# 3. Use JWT in all requests
# Header: Authorization: Bearer <jwt_token>
```

**Protected Queries/Mutations:**
- `getCurrentUser`
- `createPost`
- `followUser`
- `unfollowUser`
- `getSignedURLForPostImage`

---

## 📝 Common GraphQL Operations

### Get Current User
```graphql
query {
  getCurrentUser {
    id
    firstName
    email
    followers { id firstName }
    following { id firstName }
    posts { id content }
  }
}
```

### Create Post
```graphql
mutation {
  createPost(payload: {
    content: "Hello World!"
    imageURL: "https://..."
  }) {
    id
    content
    createdAt
  }
}
```

### Get All Posts
```graphql
query {
  getAllPosts {
    id
    content
    imageURL
    createdAt
    author {
      id
      firstName
      avatar
    }
  }
}
```

### Follow User
```graphql
mutation {
  followUser(to: "user_id_here")
}
```

### Get Image Upload URL
```graphql
query {
  getSignedURLForPostImage(
    imageName: "photo"
    imageType: "image/jpeg"
  )
}
```

---

## 🛠️ npm Scripts

```bash
pnpm dev        # Development mode with auto-reload
pnpm build      # Build TypeScript
pnpm start      # Production server
pnpm migrate    # Run database migrations
pnpm generate   # Generate Prisma Client
```

---

## 🔧 Environment Variables

**Required:**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/spread_db"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key"
```

**Optional (for S3 uploads):**
```env
AWS_S3_ACCESS_KEY_ID="..."
AWS_S3_SECRET_ACCESS_KEY="..."
AWS_S3_REGION="us-east-1"
AWS_S3_BUCKET_NAME="bucket-name"
```

---

## 🏗️ Add New GraphQL Feature

**Example: Add "Like Post" feature**

### 1. Update Database Schema (`src/prisma/schema.prisma`)
```prisma
model Like {
  id        String   @id @default(cuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())

  @@unique([postId, userId])
}

// Add to Post model
model Post {
  // ...
  likes Like[]
}

// Add to User model
model User {
  // ...
  likes Like[]
}
```

### 2. Run Migration
```bash
pnpm migrate
```

### 3. Update GraphQL Types (`src/app/post/types.ts`)
```typescript
export const types = `#graphql
  type Post {
    id: ID!
    content: String!
    imageURL: String
    createdAt: String
    author: User
    likes: [User]  # Add this
    likesCount: Int  # Add this
  }
`;
```

### 4. Add Mutation (`src/app/post/mutations.ts`)
```typescript
export const mutations = `#graphql
  createPost(payload: CreatePostData!): Post
  likePost(postId: ID!): Boolean!  # Add this
  unlikePost(postId: ID!): Boolean!  # Add this
`;
```

### 5. Implement Resolver (`src/app/post/resolvers.ts`)
```typescript
const mutations = {
  // ... existing mutations
  likePost: async (parent: any, { postId }: { postId: string }, ctx: GraphqlContext) => {
    if (!ctx.user) throw new Error("Not authenticated");
    
    await prisma.like.create({
      data: {
        postId,
        userId: ctx.user.id
      }
    });
    return true;
  },
  unlikePost: async (parent: any, { postId }: { postId: string }, ctx: GraphqlContext) => {
    if (!ctx.user) throw new Error("Not authenticated");
    
    await prisma.like.delete({
      where: {
        postId_userId: { postId, userId: ctx.user.id }
      }
    });
    return true;
  }
};

const extraResolvers = {
  Post: {
    // ... existing resolvers
    likes: async (parent: any) => {
      const likes = await prisma.like.findMany({
        where: { postId: parent.id },
        include: { user: true }
      });
      return likes.map(like => like.user);
    },
    likesCount: async (parent: any) => {
      return await prisma.like.count({
        where: { postId: parent.id }
      });
    }
  }
};
```

### 6. Test
```graphql
mutation {
  likePost(postId: "post_123")
}

query {
  getAllPosts {
    id
    content
    likesCount
    likes {
      id
      firstName
    }
  }
}
```

---

## 🐛 Debug Tips

**Enable Query Logging:**
Already enabled in `lib/db.ts`:
```typescript
const prisma = new PrismaClient({ log: ["query"] })
```

**Check GraphQL Errors:**
Visit `http://localhost:9000/graphql` for Apollo Sandbox with detailed error messages.

**Redis Cache Check:**
```bash
redis-cli
> KEYS *
> GET recommendedUsers:user_123
```

**Database Inspection:**
```bash
pnpm dlx prisma studio
# Opens GUI at http://localhost:5555
```

---

## 🚨 Common Errors

### "PrismaClientInitializationError"
```bash
# Solution: Check DATABASE_URL and ensure PostgreSQL is running
docker-compose up -d postgres
```

### "Cannot find module './generated/prisma/client'"
```bash
# Solution: Generate Prisma Client
pnpm generate
```

### "Redis connection refused"
```bash
# Solution: Start Redis
docker-compose up -d redis
```

### "JWT malformed"
```bash
# Solution: Ensure Authorization header format
# Correct: Authorization: Bearer eyJhbGc...
# Wrong: Authorization: eyJhbGc...
```

### "AWS S3 Access Denied"
```bash
# Solution: Check IAM permissions
# Required: s3:PutObject on bucket
```

---

## 📚 Related Documentation

- **Full Architecture Guide:** [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- **Main README:** [../README.md](../README.md)
- **Prisma Docs:** https://www.prisma.io/docs
- **Apollo Server Docs:** https://www.apollographql.com/docs/apollo-server/

---

## 🔄 CI/CD Notes

**Build Command:**
```bash
pnpm build
```

**Start Command:**
```bash
pnpm start
```

**Health Check Endpoint:**
```
GET /health
Response: { "status": "OK" }
```

**Required Environment (Production):**
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `AWS_S3_*` (if using uploads)

---

## 💡 Best Practices

1. **Always use services for business logic** - Don't put logic in resolvers
2. **Validate authentication** - Check `ctx.user` for protected operations
3. **Invalidate caches** - Clear Redis cache when data changes
4. **Use transactions** - For operations affecting multiple models
5. **Log queries** - Keep query logging on in development
6. **Type safety** - Use generated Prisma types
7. **Handle errors** - Throw descriptive errors for clients

---

**Quick Links:**
- GraphQL Playground: http://localhost:9000/graphql
- Prisma Studio: Run `pnpm dlx prisma studio`
- Health Check: http://localhost:9000/health

**Need Help?** Check [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) for detailed documentation.
