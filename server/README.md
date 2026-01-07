# Spread Backend Server

GraphQL API server for the Spread social media platform built with Node.js, TypeScript, Apollo Server, Prisma, and PostgreSQL.

## 📚 Documentation

This directory contains comprehensive documentation to help you understand and work with the backend codebase:

### 🏗️ [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
**Complete architectural documentation** covering:
- System architecture and design patterns
- Technology stack details
- GraphQL schema (types, queries, mutations)
- Database schema and relationships
- Authentication flow (Google OAuth + JWT)
- Services layer
- Caching strategy with Redis
- AWS S3 file upload system
- Complete API examples
- Environment configuration
- Security considerations
- Performance optimizations

👉 **Start here** for a deep understanding of the entire system.

---

### 🚀 [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
**Quick reference guide** with:
- Quick start commands
- File structure overview
- Common GraphQL operations
- Step-by-step guide to add new features
- Debugging tips and tools
- Common errors and solutions
- Best practices

👉 **Use this** for day-to-day development and quick lookups.

---

### 🔄 [CODE_FLOW_EXAMPLES.md](./CODE_FLOW_EXAMPLES.md)
**Detailed code flow diagrams** showing:
- User authentication flow (Google OAuth → JWT)
- Post creation with S3 image upload
- Feed retrieval with caching
- Follow/unfollow operations
- Recommended users algorithm
- Performance optimization patterns
- Error handling examples

👉 **Reference this** to understand how data flows through the system.

---

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start PostgreSQL and Redis with Docker
docker-compose up -d

# Run database migrations
pnpm migrate

# Generate Prisma Client
pnpm generate

# Start development server
pnpm dev
```

Server will be available at:
- **GraphQL API:** http://localhost:9000/graphql
- **Health Check:** http://localhost:9000/health

---

## 📂 Project Structure

```
server/
├── src/
│   ├── app/                    # GraphQL modules
│   │   ├── index.ts           # Apollo Server setup
│   │   ├── user/              # User module (types, queries, mutations, resolvers)
│   │   └── post/              # Post module (types, queries, mutations, resolvers)
│   ├── services/              # Business logic
│   │   ├── jwt.ts             # JWT authentication
│   │   ├── user.ts            # User operations
│   │   └── post.ts            # Post operations
│   ├── lib/                   # Core libraries
│   │   ├── db.ts              # Prisma client
│   │   └── redis.ts           # Redis client
│   ├── config/                # Configuration
│   │   └── env.ts             # Environment variables
│   ├── prisma/                # Database
│   │   ├── schema.prisma      # Schema definition
│   │   └── migrations/        # Migration history
│   ├── index.ts               # Entry point
│   └── interfaces.ts          # TypeScript interfaces
├── BACKEND_ARCHITECTURE.md    # 📚 Complete documentation
├── QUICK_REFERENCE.md         # 🚀 Developer quick reference
├── CODE_FLOW_EXAMPLES.md      # 🔄 Code flow diagrams
├── package.json
├── tsconfig.json
└── Dockerfile
```

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with auto-reload |
| `pnpm build` | Build TypeScript to JavaScript |
| `pnpm start` | Start production server |
| `pnpm migrate` | Run database migrations |
| `pnpm generate` | Generate Prisma Client |

---

## 🔑 Key Technologies

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js 5.x
- **GraphQL:** Apollo Server 4.x
- **Database:** PostgreSQL + Prisma ORM
- **Cache:** Redis (ioredis)
- **Auth:** JWT + Google OAuth 2.0
- **Storage:** AWS S3 (SDK v3)
- **Package Manager:** pnpm

---

## 🌟 Features

- ✅ GraphQL API with Apollo Server
- ✅ Google OAuth 2.0 authentication
- ✅ JWT-based session management
- ✅ PostgreSQL database with Prisma ORM
- ✅ Redis caching for performance
- ✅ AWS S3 integration for image uploads
- ✅ Follow/unfollow system
- ✅ User recommendations (friends of friends)
- ✅ Post creation and feed
- ✅ CORS configuration
- ✅ Health check endpoint

---

## 📊 Database Models

```
┌─────────────┐         ┌─────────────┐
│    User     │────────▶│    Post     │
│             │  1:N    │             │
└─────────────┘         └─────────────┘
      │ │                      │
      │ │                      │
      │ │                      ▼
      │ │              ┌─────────────┐
      │ │              │   Comment   │
      │ └─────────────▶│             │
      │        1:N     └─────────────┘
      │
      ▼
┌─────────────┐
│   Follow    │  (Self-referential M:N)
│             │
└─────────────┘
```

---

## 🔐 Environment Variables

Required variables in `.env`:

```env
# Server
PORT=9000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/spread_db"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key"

# AWS S3 (optional, for image uploads)
AWS_S3_ACCESS_KEY_ID="..."
AWS_S3_SECRET_ACCESS_KEY="..."
AWS_S3_REGION="us-east-1"
AWS_S3_BUCKET_NAME="..."
```

---

## 🎯 Common Tasks

### Get Current User
```graphql
query {
  getCurrentUser {
    id
    firstName
    email
    posts { id content }
  }
}
```

### Create a Post
```graphql
mutation {
  createPost(payload: {
    content: "Hello World!"
  }) {
    id
    content
    createdAt
  }
}
```

### Follow a User
```graphql
mutation {
  followUser(to: "user_id_here")
}
```

See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for more examples.

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Verify connection string
echo $DATABASE_URL
```

### Prisma Client Out of Sync
```bash
# Regenerate Prisma Client
pnpm generate
```

### Redis Connection Failed
```bash
# Check if Redis is running
docker ps | grep redis

# Test Redis connection
redis-cli ping
```

For more troubleshooting tips, see [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#-common-errors).

---

## 🧪 Testing the API

### Using Apollo Sandbox
1. Start the server: `pnpm dev`
2. Open browser: http://localhost:9000/graphql
3. Explore schema and run queries

### Using cURL
```bash
# Health check
curl http://localhost:9000/health

# GraphQL query
curl -X POST http://localhost:9000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ getAllPosts { id content } }"}'
```

---

## 📖 Learning Path

**For New Developers:**
1. Start with [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Get up and running
2. Read [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) - Understand the system
3. Reference [CODE_FLOW_EXAMPLES.md](./CODE_FLOW_EXAMPLES.md) - Learn data flows

**For Contributors:**
1. Review [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#-add-new-graphql-feature) - Adding features
2. Check [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md#key-design-patterns) - Design patterns
3. Follow best practices in [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#-best-practices)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the design patterns in the documentation
4. Test your changes
5. Submit a pull request

---

## 📝 Additional Resources

- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/)
- [Prisma Docs](https://www.prisma.io/docs)
- [GraphQL Learn](https://graphql.org/learn/)
- [Redis Docs](https://redis.io/documentation)
- [AWS S3 SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)

---

## 📧 Support

- **Author:** Abhinay Jangde
- **Email:** abhinayjangde@gmail.com
- **Repository:** [github.com/abhinayjangde/spread](https://github.com/abhinayjangde/spread)

---

**Happy Coding! 🚀**
