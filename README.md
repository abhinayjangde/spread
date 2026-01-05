# Spread 📱

A full-stack social media platform built with modern web technologies. Users can create posts, discover content, follow other users, and engage with a vibrant community.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Local Setup Guide](#local-setup-guide)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Features

✨ **User Management**
- Google OAuth authentication
- User profiles and follow system
- JWT-based session management

📝 **Post Creation & Management**
- Create, read, update, and delete posts
- Image uploads to AWS S3
- Real-time post discovery

💬 **Social Features**
- Comment on posts
- Follow/unfollow users
- Personalized feed based on followed users
- Explore trending content

🔔 **Additional**
- Bookmark posts
- Notification system
- Responsive design for all devices

## Tech Stack

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js 5.x
- **GraphQL:** Apollo Server 5.x
- **Database:** PostgreSQL with Prisma ORM
- **Cache:** Redis
- **Authentication:** JWT + Google OAuth 2.0
- **Cloud Storage:** AWS S3
- **Package Manager:** pnpm

### Frontend
- **Framework:** Next.js 16
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 with PostCSS
- **State Management:** TanStack Query (React Query)
- **API Client:** GraphQL Request
- **Code Generation:** GraphQL Code Generator
- **Package Manager:** pnpm

### DevOps
- **Containerization:** Docker & Docker Compose
- **Database Migrations:** Prisma Migrate

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v10.25.0 or higher) - [Install](https://pnpm.io/installation)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Redis** (v6 or higher) - [Download](https://redis.io/download) or use Docker
- **Git** - [Download](https://git-scm.com/)

### Optional but Recommended
- **Docker & Docker Compose** - For running PostgreSQL and Redis in containers

## Project Structure

```
spread/
├── server/                    # Backend (GraphQL API)
│   ├── src/
│   │   ├── app/              # GraphQL modules (post, user)
│   │   ├── config/           # Environment configuration
│   │   ├── generated/        # Auto-generated Prisma types
│   │   ├── lib/              # Database and Redis connections
│   │   ├── services/         # Business logic (JWT, user, post)
│   │   └── index.ts          # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── migrations/       # Database migration files
│   └── package.json
│
├── web/                       # Frontend (Next.js App)
│   ├── src/
│   │   ├── app/              # Next.js pages and layouts
│   │   ├── components/       # React components
│   │   ├── clients/          # API client setup
│   │   ├── context/          # React context (Theme)
│   │   ├── gql/              # GraphQL code-generated files
│   │   ├── graphql/          # GraphQL queries and mutations
│   │   └── hooks/            # Custom React hooks
│   ├── public/               # Static assets
│   └── package.json
│
└── docker-compose.yml        # Docker services configuration
```

## Local Setup Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/spread.git
cd spread
```

### Step 2: Install Dependencies

Install dependencies for both server and web packages:

```bash
# Install all dependencies in monorepo
pnpm install
```

### Step 3: Setup PostgreSQL and Redis

#### Option A: Using Docker (Recommended)

Create a `docker-compose.yml` file in the root directory:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: spread_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: spread_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: spread_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

Run the containers:

```bash
docker-compose up -d
```

#### Option B: Local Installation

**PostgreSQL:**
- Follow the [official PostgreSQL installation guide](https://www.postgresql.org/download/)
- Create a database named `spread_db`

**Redis:**
- Follow the [official Redis installation guide](https://redis.io/download)
- Or on Windows, use WSL2 or Docker

### Step 4: Configure Environment Variables

#### Backend Environment (`.env` in `server/` directory)

Create `server/.env` file:

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

# Google OAuth (optional, if using in backend)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### Frontend Environment (`.env.local` in `web/` directory)

Create `web/.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:9000/graphql"

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"

# Environment
NODE_ENV=development
```

### Step 5: Setup AWS S3 (Optional but Recommended)

1. Create an AWS account at [aws.amazon.com](https://aws.amazon.com)
2. Create an S3 bucket for storing images
3. Create an IAM user with S3 access
4. Generate access keys and add them to your `.env` file

### Step 6: Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add `http://localhost:3000` to authorized redirect URIs
6. Copy your Client ID and Client Secret to the `.env` files

### Step 7: Initialize Database

Navigate to the server directory and run migrations:

```bash
cd server
pnpm migrate
```

This will:
- Create tables in PostgreSQL based on `prisma/schema.prisma`
- Generate Prisma Client for type-safe database access

### Step 8: Generate Prisma Client

```bash
pnpm generate
```

## Environment Variables

### Server Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `9000` |
| `NODE_ENV` | Environment mode | `development` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/spread_db` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `AWS_S3_ACCESS_KEY_ID` | AWS access key | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_S3_SECRET_ACCESS_KEY` | AWS secret key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_S3_REGION` | AWS S3 region | `us-east-1` |
| `AWS_S3_BUCKET_NAME` | S3 bucket name | `spread-bucket` |

### Frontend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | GraphQL API endpoint | `http://localhost:9000/graphql` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID | `123456.apps.googleusercontent.com` |

## Running the Application

### Terminal 1: Start Backend Server

```bash
cd server
pnpm dev
```

The GraphQL server will start at `http://localhost:9000/graphql`

### Terminal 2: Start Frontend Development Server

```bash
cd web
pnpm dev
```

The Next.js application will start at `http://localhost:3000`

### Access the Application

- **Web App:** [http://localhost:3000](http://localhost:3000)
- **GraphQL Playground:** [http://localhost:9000/graphql](http://localhost:9000/graphql)

## API Documentation

### GraphQL Schema

The GraphQL schema is automatically generated based on the resolvers. Access the Apollo Server Sandbox at:

```
http://localhost:9000/graphql
```

You can use this interface to:
- Explore the schema
- Write and test queries/mutations
- View documentation

### Key Queries

```graphql
# Get user profile
query GetUser($id: String!) {
  user(id: $id) {
    id
    email
    username
    bio
    avatar
  }
}

# Get feed posts
query GetFeed {
  feed {
    id
    title
    content
    imageUrl
    author {
      id
      username
    }
    comments {
      id
      content
    }
  }
}
```

### Key Mutations

```graphql
# Create a post
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    content
  }
}

# Follow a user
mutation FollowUser($userId: String!) {
  followUser(userId: $userId) {
    id
    following {
      id
    }
  }
}
```

## Useful Commands

### Server Commands

```bash
cd server

# Development mode with auto-reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run database migrations
pnpm migrate

# Generate Prisma Client
pnpm generate
```

### Frontend Commands

```bash
cd web

# Development mode with hot reload and code generation
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Generate GraphQL types
pnpm codegen
```

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :9000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :9000
kill -9 <PID>
```

### Database Connection Issues
- Ensure PostgreSQL is running: `sudo service postgresql status`
- Check connection string in `.env`
- Reset database: `pnpm migrate reset` (development only)

### Redis Connection Issues
- Ensure Redis is running: `redis-cli ping`
- Check Redis URL in `.env`
- Default URL should be `redis://localhost:6379`

### GraphQL Code Generation Errors
```bash
cd web
pnpm codegen
```

### Prisma Migration Conflicts
```bash
cd server
pnpm migrate reset --force
```

## Building for Production

### Backend

```bash
cd server
pnpm build
pnpm start
```

### Frontend

```bash
cd web
pnpm build
pnpm start
```

## Deployment

### Using Docker

Build and run the entire stack:

```bash
docker-compose up --build
```

### Using Vercel (Frontend Only)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Using Railway/Render (Backend)

1. Connect GitHub repository
2. Set environment variables
3. Deploy and get production URL
4. Update `NEXT_PUBLIC_API_URL` in frontend

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Resources & References

### Authentication
- [JWT.io](https://www.jwt.io/)
- [jsonwebtoken - npm](https://www.npmjs.com/package/jsonwebtoken)
- [Google OAuth 2.0](https://developers.google.com/identity)

### Frontend Libraries
- [@react-oauth/google](https://react-oauth.vercel.app/)
- [graphql-request](https://www.npmjs.com/package/graphql-request)
- [React Hot Toast](https://react-hot-toast.com/)

### Backend Technologies
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [Prisma ORM](https://www.prisma.io/)
- [Express.js](https://expressjs.com/)
- [ioredis](https://github.com/luin/ioredis)

### Code Generation & Tools
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
- [TanStack Query (React Query)](https://tanstack.com/query/latest)

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Author

**Abhinay Jangde**
- Email: abhinayjangde@gmail.com

---

**Happy Coding! 🚀**