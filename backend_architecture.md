# Backend Architecture Documentation

## Table of Contents
- [Overview](#overview)
- [Architecture Pattern](#architecture-pattern)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [GraphQL Schema](#graphql-schema)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Services Layer](#services-layer)
- [Caching Strategy](#caching-strategy)
- [File Upload System](#file-upload-system)
- [API Examples](#api-examples)
- [Environment Configuration](#environment-configuration)

---

## Overview

The **Spread** backend is a GraphQL API server built with Node.js and TypeScript. It provides a social media platform with features like user authentication, posts, comments, and following system. The server uses Apollo Server for GraphQL, Prisma ORM for database management, Redis for caching, and AWS S3 for file storage.

**Key Features:**
- Google OAuth 2.0 authentication with JWT tokens
- GraphQL API for flexible data querying
- PostgreSQL database with Prisma ORM
- Redis caching for performance optimization
- AWS S3 integration for image uploads
- Follow/unfollow system with recommendations
- Real-time post feed

---

## Architecture Pattern

The backend follows a **modular, service-oriented architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────┐
│              Client (Web/Mobile)                │
└─────────────────┬───────────────────────────────┘
                  │ HTTP/GraphQL
┌─────────────────▼───────────────────────────────┐
│         Express + Apollo Server                 │
│         (GraphQL Endpoint Layer)                │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│            Resolvers Layer                      │
│    (User Resolvers + Post Resolvers)            │
└───┬─────────────────────────────────────────┬───┘
    │                                         │
┌───▼─────────────────┐           ┌───────────▼────┐
│   Services Layer    │           │  Utilities     │
│  (Business Logic)   │           │  (JWT, etc.)   │
└───┬─────────────────┘           └────────────────┘
    │
┌───▼──────────────────────────────────────────────┐
│            Data Access Layer                     │
│  Prisma ORM + Redis Cache + AWS S3              │
└───┬──────────────────────────────────────────────┘
    │
┌───▼──────────────────────────────────────────────┐
│         Data Storage                             │
│  PostgreSQL + Redis + S3 Bucket                  │
└──────────────────────────────────────────────────┘
```

---

## Technology Stack

### Core Technologies
- **Runtime:** Node.js (v18+)
- **Language:** TypeScript
- **Framework:** Express.js 5.x
- **GraphQL:** Apollo Server 4.x

### Database & Caching
- **Database:** PostgreSQL 16
- **ORM:** Prisma 7.x
- **Cache:** Redis 7.x (ioredis client)

### Authentication & Security
- **Authentication:** JWT (jsonwebtoken)
- **OAuth:** Google OAuth 2.0
- **CORS:** Configurable origins

### Cloud Services
- **File Storage:** AWS S3 (SDK v3)
- **Pre-signed URLs:** S3 Request Presigner

### Package Manager
- **pnpm** 10.25.0

---

## Project Structure

```
server/
├── src/
│   ├── app/                      # GraphQL modules
│   │   ├── index.ts              # Apollo Server setup
│   │   ├── post/                 # Post module
│   │   │   ├── index.ts          # Module exports
│   │   │   ├── types.ts          # GraphQL type definitions
│   │   │   ├── queries.ts        # GraphQL query definitions
│   │   │   ├── mutations.ts      # GraphQL mutation definitions
│   │   │   └── resolvers.ts      # Query/Mutation implementations
│   │   └── user/                 # User module
│   │       ├── index.ts          # Module exports
│   │       ├── types.ts          # GraphQL type definitions
│   │       ├── queries.ts        # GraphQL query definitions
│   │       ├── mutations.ts      # GraphQL mutation definitions
│   │       └── resolvers.ts      # Query/Mutation implementations
│   │
│   ├── config/                   # Configuration
│   │   └── env.ts                # Environment variable loading
│   │
│   ├── generated/                # Auto-generated files
│   │   └── prisma/               # Prisma Client
│   │
│   ├── lib/                      # Core libraries
│   │   ├── db.ts                 # Prisma client instance
│   │   └── redis.ts              # Redis client instance
│   │
│   ├── prisma/                   # Database
│   │   ├── schema.prisma         # Database schema
│   │   └── migrations/           # Migration history
│   │
│   ├── services/                 # Business logic
│   │   ├── jwt.ts                # JWT token management
│   │   ├── user.ts               # User business logic
│   │   └── post.ts               # Post business logic
│   │
│   ├── index.ts                  # Application entry point
│   └── interfaces.ts             # TypeScript interfaces
│
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
└── Dockerfile                    # Docker configuration
```

---

## Core Components

### 1. Entry Point (`src/index.ts`)

The main entry point initializes and starts the Express server:

```typescript
import { startServer } from './app/index.js';
import env from './config/env.js';

async function init() {
    const app = await startServer();
    const port = env.port ?? 9000;

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

init();
```

**Key Responsibilities:**
- Initialize the Express app
- Load environment configuration
- Start the HTTP server on configured port

---

### 2. Apollo Server Setup (`src/app/index.ts`)

Sets up the GraphQL server with Express middleware:

```typescript
export async function startServer() {
    const app: Express = express();

    // CORS configuration
    app.use(cors({
        origin: ["http://localhost:3000", "https://spread-pi.vercel.app"],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'OK' });
    });

    // Apollo Server configuration
    const apolloServer = new ApolloServer<GraphqlContext>({
        typeDefs: `
            ${User.types}
            ${Post.types}

            type Query {
                ${User.queries}
                ${Post.queries}
            }

            type Mutation {
                ${Post.mutations}
                ${User.mutations}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
                ...Post.resolvers.queries
            },
            Mutation: {
                ...Post.resolvers.mutations,
                ...User.resolvers.mutations
            },
            ...Post.resolvers.extraResolvers,
            ...User.resolvers.extraResolvers
        },
        introspection: true,
        csrfPrevention: false,
    });

    await apolloServer.start();

    // GraphQL middleware with authentication context
    app.use(
        '/graphql',
        express.json(),
        expressMiddleware(apolloServer, {
            context: async ({ req, res }) => {
                const token = req.headers.authorization?.split(" ")[1];
                return {
                    user: token ? JWTService.decodeToken(token) : undefined
                }
            }
        }),
    );
    
    return app;
}
```

**Key Features:**
- **CORS Support:** Allows requests from specified frontend origins
- **Health Check:** `/health` endpoint for monitoring
- **Modular GraphQL Schema:** Types, queries, and mutations from separate modules
- **Authentication Context:** JWT token validation on every request
- **GraphQL Playground:** Introspection enabled for development

---

### 3. Database Client (`src/lib/db.ts`)

Prisma client with PostgreSQL adapter:

```typescript
import { PrismaClient } from "../generated/prisma/client.js"
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter, log: ["query"] })

export { prisma }
```

**Features:**
- PostgreSQL connection via adapter
- Query logging enabled
- Singleton pattern (single instance)

---

### 4. Redis Client (`src/lib/redis.ts`)

Redis connection for caching:

```typescript
import { Redis } from "ioredis"
import env from "../config/env.js";

const redis = new Redis(env.redisUrl as string);

export { redis }
```

**Usage:**
- Caching recommended users
- Future: Post caching, session storage

---

## GraphQL Schema

### User Module

**Type Definition:**
```graphql
type User {
    id: ID!
    firstName: String!
    lastName: String
    email: String!
    avatar: String 
    createdAt: String
    
    followers: [User]        # Users following this user
    following: [User]        # Users this user follows
    posts: [Post]            # Posts created by user
    
    recommendedUsers: [User] # Suggested users to follow
}
```

**Queries:**
```graphql
# Verify Google OAuth token and return JWT
verifyGoogleToken(token: String!): String

# Get currently authenticated user
getCurrentUser: User

# Get user by ID
getUserById(id: ID!): User
```

**Mutations:**
```graphql
# Follow a user
followUser(to: ID!): Boolean!

# Unfollow a user
unfollowUser(to: ID!): Boolean!
```

---

### Post Module

**Type Definition:**
```graphql
type Post {
    id: ID!
    content: String!
    imageURL: String
    createdAt: String
    author: User
}

input CreatePostData {
    content: String!
    imageURL: String
}
```

**Queries:**
```graphql
# Get all posts (newest first)
getAllPosts: [Post]

# Get pre-signed URL for uploading post image
getSignedURLForPostImage(imageName: String!, imageType: String!): String
```

**Mutations:**
```graphql
# Create a new post
createPost(payload: CreatePostData!): Post
```

---

## Database Schema

The database uses **Prisma ORM** with PostgreSQL. Here's the complete schema:

```prisma
model User {
  id        String    @id @default(cuid())
  firstName String
  lastName  String?
  email     String    @unique
  avatar    String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  posts     Post[]
  comments  Comment[]
  followers Follow[]  @relation("follower")
  following Follow[]  @relation("following")
}

model Post {
  id        String    @id @default(cuid())
  content   String
  imageURL  String?
  authorId  String
  author    User      @relation(fields: [authorId], references: [id])
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  comments  Comment[]
}

model Comment {
  id        String   @id @default(cuid())
  text      String
  postId    String
  post      Post     @relation(fields: [postId], references: [id])
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Follow {
  follower    User   @relation("follower", fields: [followerId], references: [id])
  followerId  String
  following   User   @relation("following", fields: [followingId], references: [id])
  followingId String

  @@id([followerId, followingId])  # Composite primary key
}
```

**Key Relationships:**
- **User → Posts:** One-to-many
- **User → Comments:** One-to-many
- **Post → Comments:** One-to-many
- **User → Followers:** Many-to-many (self-referential via Follow)
- **User → Following:** Many-to-many (self-referential via Follow)

**Migration Commands:**
```bash
# Create a new migration
pnpm migrate

# Apply migrations
pnpm generate

# Reset database (development only)
pnpm dlx prisma migrate reset
```

---

## Authentication Flow

### Google OAuth + JWT Flow

```
┌──────────┐                                      ┌──────────┐
│  Client  │                                      │  Server  │
└────┬─────┘                                      └────┬─────┘
     │                                                  │
     │  1. User clicks "Sign in with Google"           │
     │─────────────────────────────────────────────────▶
     │                                                  │
     │  2. Google OAuth flow (handled by client)       │
     │◀─────────────────────────────────────────────────│
     │                                                  │
     │  3. Send Google ID token to server              │
     │  mutation: verifyGoogleToken(token: "...")      │
     │─────────────────────────────────────────────────▶
     │                                                  │
     │                      4. Validate token with Google
     │                      5. Check if user exists    │
     │                      6. Create user if new      │
     │                      7. Generate JWT token      │
     │                                                  │
     │  8. Return JWT token                            │
     │◀─────────────────────────────────────────────────│
     │                                                  │
     │  9. Store JWT in localStorage/cookies           │
     │                                                  │
     │  10. Send JWT in Authorization header           │
     │  Authorization: Bearer <jwt_token>              │
     │─────────────────────────────────────────────────▶
     │                                                  │
     │                     11. Decode JWT              │
     │                     12. Attach user to context  │
     │                                                  │
     │  13. Return requested data                      │
     │◀─────────────────────────────────────────────────│
     │                                                  │
```

### Implementation Details

**1. Google Token Verification (`services/user.ts`):**
```typescript
public static async verifyGoogleToken(token: string): Promise<string> {
    // Verify with Google
    const googleOAuthURL = new URL('https://oauth2.googleapis.com/tokeninfo');
    googleOAuthURL.searchParams.append('id_token', token);
    const { data } = await axios.get<GoogleTokenResult>(googleOAuthURL.toString());

    // Find or create user
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
    });

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

    const user = await prisma.user.findUnique({
        where: { email: data.email }
    });

    // Generate JWT
    const userToken = JWTService.generateTokenForUser(user);
    return userToken;
}
```

**2. JWT Token Generation (`services/jwt.ts`):**
```typescript
export class JWTService {
    public static generateTokenForUser(user: User) {
        const payload: JWTUser = {
            id: user.id,
            email: user.email
        }
        const token = jwt.sign(payload, env.jwtSecret!)
        return token;
    }

    public static decodeToken(token: string) {
        try {
            return jwt.verify(token, env.jwtSecret as string) as JWTUser;
        } catch (error) {
            return null;
        }
    }
}
```

**3. GraphQL Context (`app/index.ts`):**
```typescript
context: async ({ req, res }) => {
    const token = req.headers.authorization?.split(" ")[1];
    return {
        user: token ? JWTService.decodeToken(token) : undefined
    }
}
```

---

## Services Layer

### User Service (`services/user.ts`)

**Methods:**

1. **verifyGoogleToken(token: string): Promise<string>**
   - Validates Google OAuth token
   - Creates/finds user in database
   - Returns JWT token

2. **followUser(from: string, to: string): Promise<Follow>**
   - Creates follow relationship
   - Prevents duplicate follows
   - Returns Follow record

3. **unfollowUser(from: string, to: string): Promise<Follow>**
   - Removes follow relationship
   - Deletes Follow record

**Example:**
```typescript
// Follow a user
await UserService.followUser(currentUserId, targetUserId);

// Unfollow a user
await UserService.unfollowUser(currentUserId, targetUserId);
```

---

### Post Service (`services/post.ts`)

**Methods:**

1. **createPost(data: CreatePostPayload): Promise<Post>**
   - Creates new post
   - Links to author
   - Returns created post

**Example:**
```typescript
const post = await PostService.createPost({
    content: "Hello World!",
    imageURL: "https://s3.amazonaws.com/bucket/image.jpg",
    userId: "user_123"
});
```

---

## Caching Strategy

The backend uses **Redis** for caching to improve performance:

### Cached Data

1. **Recommended Users:**
   ```typescript
   // Cache key: recommendedUsers:${userId}
   const cachedUsers = await redis.get(`recommendedUsers:${ctx.user.id}`);
   if (cachedUsers) {
       return JSON.parse(cachedUsers);
   }
   // ... compute recommendations
   await redis.set(`recommendedUsers:${ctx.user.id}`, JSON.stringify(users));
   ```

2. **All Posts (commented out but available):**
   ```typescript
   // Cache key: allPosts
   const cachedPosts = await redis.get('allPosts');
   if (cachedPosts) {
       return JSON.parse(cachedPosts);
   }
   ```

### Cache Invalidation

- **On Follow/Unfollow:** Invalidate recommended users cache
  ```typescript
  await redis.del(`recommendedUsers:${ctx.user.id}`);
  ```

- **On Post Creation:** Can invalidate all posts cache
  ```typescript
  await redis.del('allPosts');
  ```

---

## File Upload System

The backend uses **AWS S3** for storing post images with pre-signed URLs:

### Flow

```
┌─────────┐                           ┌─────────┐                    ┌──────┐
│ Client  │                           │ Server  │                    │  S3  │
└────┬────┘                           └────┬────┘                    └──┬───┘
     │                                     │                            │
     │ 1. Request signed URL               │                            │
     │ getSignedURLForPostImage()          │                            │
     │────────────────────────────────────▶│                            │
     │                                     │                            │
     │                                     │ 2. Generate signed URL     │
     │                                     │───────────────────────────▶│
     │                                     │                            │
     │ 3. Return signed URL                │                            │
     │◀────────────────────────────────────│                            │
     │                                     │                            │
     │ 4. Upload file to S3 via PUT        │                            │
     │────────────────────────────────────────────────────────────────▶│
     │                                     │                            │
     │ 5. Get public URL                   │                            │
     │◀────────────────────────────────────────────────────────────────│
     │                                     │                            │
     │ 6. Create post with imageURL        │                            │
     │────────────────────────────────────▶│                            │
     │                                     │                            │
```

### Implementation

**Query: getSignedURLForPostImage**
```typescript
const queries = {
    getSignedURLForPostImage: async (
        parent: any, 
        { imageName, imageType }: { imageName: string, imageType: string }, 
        ctx: GraphqlContext
    ) => {
        if (!ctx.user || !ctx.user.id) {
            throw new Error("You must be logged in to get a signed URL");
        }

        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
        if (!allowedImageTypes.includes(imageType)) {
            throw new Error("Invalid image type");
        }

        const putObjCommand = new PutObjectCommand({
            Bucket: env.aws.s3BucketName!,
            Key: `uploads/${ctx.user.id}/posts/${imageName}-${Date.now()}.${imageType.split('/')[1]}`,
            ContentType: imageType,
        });

        const signedURL = await getSignedUrl(s3Client, putObjCommand, { expiresIn: 3600 });
        return signedURL;
    }
}
```

**Features:**
- Pre-signed URLs expire in 1 hour (3600 seconds)
- Validates image types (jpeg, png, gif, webp)
- Requires authentication
- Organizes files by user ID and timestamp
- Client uploads directly to S3 (no server bandwidth used)

---

## API Examples

### Authentication

**Login with Google:**
```graphql
mutation VerifyGoogleToken {
  verifyGoogleToken(token: "google_id_token_here")
}

# Response
{
  "data": {
    "verifyGoogleToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Get Current User:**
```graphql
query GetCurrentUser {
  getCurrentUser {
    id
    firstName
    lastName
    email
    avatar
    followers {
      id
      firstName
    }
    following {
      id
      firstName
    }
  }
}

# Headers
{
  "Authorization": "Bearer <jwt_token>"
}
```

---

### User Operations

**Get User by ID:**
```graphql
query GetUser {
  getUserById(id: "clxxx123456") {
    id
    firstName
    lastName
    email
    avatar
    posts {
      id
      content
      imageURL
      createdAt
    }
  }
}
```

**Follow User:**
```graphql
mutation FollowUser {
  followUser(to: "user_id_to_follow")
}

# Response
{
  "data": {
    "followUser": true
  }
}
```

**Unfollow User:**
```graphql
mutation UnfollowUser {
  unfollowUser(to: "user_id_to_unfollow")
}
```

**Get Recommended Users:**
```graphql
query GetRecommendations {
  getCurrentUser {
    recommendedUsers {
      id
      firstName
      lastName
      avatar
    }
  }
}
```

---

### Post Operations

**Get All Posts:**
```graphql
query GetAllPosts {
  getAllPosts {
    id
    content
    imageURL
    createdAt
    author {
      id
      firstName
      lastName
      avatar
    }
  }
}
```

**Create Post (without image):**
```graphql
mutation CreatePost {
  createPost(payload: {
    content: "This is my first post!"
  }) {
    id
    content
    createdAt
    author {
      id
      firstName
    }
  }
}

# Headers
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Create Post (with image):**

Step 1: Get signed URL
```graphql
query GetSignedURL {
  getSignedURLForPostImage(
    imageName: "my-photo",
    imageType: "image/jpeg"
  )
}

# Response
{
  "data": {
    "getSignedURLForPostImage": "https://bucket.s3.amazonaws.com/uploads/user123/posts/my-photo-1703123456789.jpeg?X-Amz-..."
  }
}
```

Step 2: Upload to S3 (client-side)
```javascript
const response = await fetch(signedURL, {
  method: 'PUT',
  body: imageFile,
  headers: {
    'Content-Type': 'image/jpeg'
  }
});

// Extract public URL (remove query params from signed URL)
const imageURL = signedURL.split('?')[0];
```

Step 3: Create post with image URL
```graphql
mutation CreatePostWithImage {
  createPost(payload: {
    content: "Check out this photo!",
    imageURL: "https://bucket.s3.amazonaws.com/uploads/user123/posts/my-photo-1703123456789.jpeg"
  }) {
    id
    content
    imageURL
  }
}
```

---

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=9000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/spread_db?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# AWS S3 Configuration
AWS_S3_ACCESS_KEY_ID="your-aws-access-key"
AWS_S3_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_S3_REGION="us-east-1"
AWS_S3_BUCKET_NAME="your-s3-bucket-name"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Configuration Loading (`config/env.ts`)

```typescript
const _env = {
    port: process.env.PORT || 9000,
    jwtSecret: process.env.JWT_SECRET,
    aws: {
        s3AccessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        s3SecretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
        s3Region: process.env.AWS_S3_REGION,
        s3BucketName: process.env.AWS_S3_BUCKET_NAME,
    },
    redisUrl: process.env.REDIS_URL,
    databaseUrl: process.env.DATABASE_URL,
}

const env = Object.freeze(_env);
export default env;
```

---

## Development Workflow

### Setup
```bash
# Install dependencies
pnpm install

# Setup database
docker-compose up -d  # Start PostgreSQL & Redis

# Run migrations
pnpm migrate

# Generate Prisma Client
pnpm generate
```

### Development
```bash
# Start development server with auto-reload
pnpm dev

# Server runs on http://localhost:9000
# GraphQL Playground: http://localhost:9000/graphql
```

### Building for Production
```bash
# Build TypeScript
pnpm build

# Start production server
pnpm start
```

---

## Key Design Patterns

### 1. Module Pattern
Each GraphQL module (User, Post) is self-contained with:
- Type definitions
- Queries
- Mutations
- Resolvers

### 2. Service Layer Pattern
Business logic is separated into service classes:
- `UserService` - User-related operations
- `PostService` - Post-related operations
- `JWTService` - Authentication utilities

### 3. Singleton Pattern
Database and cache clients are singletons:
- `prisma` - Single Prisma Client instance
- `redis` - Single Redis client instance

### 4. Context Pattern
GraphQL context provides request-scoped data:
- Authenticated user information
- Shared across all resolvers

### 5. Field Resolver Pattern
Complex fields use dedicated resolvers:
- `User.posts` - Resolves user's posts
- `User.followers` - Resolves followers
- `User.recommendedUsers` - Computes recommendations
- `Post.author` - Resolves post author

---

## Performance Optimizations

1. **Redis Caching:**
   - Recommended users cached per user
   - Cache invalidation on follow/unfollow

2. **Database Indexing:**
   - Unique index on `User.email`
   - Composite primary key on `Follow`

3. **Efficient Queries:**
   - Prisma query logging enabled
   - Includes only needed relations

4. **Direct S3 Uploads:**
   - Pre-signed URLs for client-side uploads
   - Reduces server bandwidth

5. **GraphQL Field Resolvers:**
   - Lazy loading of related data
   - Only fetch what's requested

---

## Security Considerations

1. **Authentication:**
   - JWT tokens for API access
   - Google OAuth for secure login
   - Token verification on protected routes

2. **Authorization:**
   - Context-based user validation
   - Checks for authenticated user before mutations

3. **Input Validation:**
   - Image type validation for uploads
   - GraphQL schema type checking

4. **CORS:**
   - Restricted to specific origins
   - Configurable allowed headers

5. **Environment Variables:**
   - Sensitive data in `.env` file
   - Never committed to version control

6. **SQL Injection Protection:**
   - Prisma ORM with parameterized queries
   - No raw SQL execution

---

## Future Enhancements

- [ ] Implement real-time subscriptions for posts
- [ ] Add comment functionality (schema exists)
- [ ] Implement post likes/reactions
- [ ] Add pagination for posts and users
- [ ] Rate limiting for API endpoints
- [ ] Implement refresh tokens
- [ ] Add post search functionality
- [ ] Implement notifications system
- [ ] Add post editing and deletion
- [ ] Implement user blocking
- [ ] Add reporting system

---

## Troubleshooting

### Common Issues

**1. Database Connection Errors:**
```bash
# Check PostgreSQL is running
docker ps

# Verify connection string
echo $DATABASE_URL
```

**2. Redis Connection Errors:**
```bash
# Test Redis connection
redis-cli ping  # Should return PONG
```

**3. Prisma Client Out of Sync:**
```bash
# Regenerate Prisma Client
pnpm generate
```

**4. AWS S3 Upload Errors:**
- Verify AWS credentials in `.env`
- Check bucket permissions (allow PutObject)
- Ensure bucket exists and region is correct

**5. JWT Token Issues:**
- Verify `JWT_SECRET` is set
- Check token format: `Bearer <token>`
- Ensure token hasn't expired

---

## References

- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [GraphQL Specification](https://graphql.org/learn/)
- [Redis Documentation](https://redis.io/documentation)
- [AWS S3 SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
- [JWT.io](https://jwt.io/)

---

**Last Updated:** January 2026  
**Author:** Abhinay Jangde  
**Email:** abhinayjangde@gmail.com
