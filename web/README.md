# Spread Frontend Documentation 🎨

> **A comprehensive guide to understanding the Spread social media platform frontend architecture and codebase**

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Directory Structure](#directory-structure)
- [Core Concepts](#core-concepts)
- [Components](#components)
- [Pages & Routing](#pages--routing)
- [State Management](#state-management)
- [GraphQL Integration](#graphql-integration)
- [Styling & Theming](#styling--theming)
- [Development Workflow](#development-workflow)
- [Configuration Files](#configuration-files)
- [Best Practices](#best-practices)

---

## Overview

The Spread frontend is a modern, responsive social media application built with **Next.js 16** and **React 19**. It provides a Twitter/X-like user experience with features like post creation, user profiles, social interactions, and real-time updates.

### Key Features

- 🎨 **Responsive Design** - Mobile-first approach with adaptive layouts
- 🌓 **Dark Mode** - System-aware theme switching with persistence
- 🔐 **Google OAuth** - Seamless authentication flow
- 📝 **Post Management** - Create, view, and interact with posts
- 👥 **Social Features** - Follow/unfollow users, view profiles
- 🖼️ **Image Upload** - Direct S3 upload with signed URLs
- ⚡ **Optimistic Updates** - Instant UI feedback with React Query
- 🎭 **Loading States** - Skeleton screens for better UX

---

## Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.0 | React framework with App Router |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |

### State & Data Management

| Library | Purpose |
|---------|---------|
| **TanStack Query (React Query)** | Server state management, caching, and data fetching |
| **graphql-request** | Lightweight GraphQL client |
| **GraphQL Code Generator** | Auto-generate TypeScript types from GraphQL schema |

### Authentication & UI

| Library | Purpose |
|---------|---------|
| **@react-oauth/google** | Google OAuth integration |
| **react-hot-toast** | Toast notifications |
| **react-icons** | Icon library |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **pnpm** | Fast package manager |
| **concurrently** | Run multiple scripts simultaneously |

---

## Architecture

### Design Patterns

The frontend follows several key architectural patterns:

1. **Component-Based Architecture** - Modular, reusable UI components
2. **Server-First Rendering** - Leverages Next.js App Router for optimal performance
3. **Client-Side State Management** - React Query for server state, Context API for UI state
4. **Custom Hooks Pattern** - Encapsulated data fetching and business logic
5. **Layout Composition** - Shared layout components for consistent UI

### Data Flow

```
User Action → Custom Hook → GraphQL Client → Backend API
                ↓
            React Query (Cache & State)
                ↓
            Component Re-render
```

### Authentication Flow

```
1. User clicks "Sign in with Google"
2. Google OAuth popup → User authenticates
3. Receive Google token → Send to backend
4. Backend validates → Returns JWT
5. Store JWT in localStorage
6. Include JWT in GraphQL request headers
7. React Query fetches current user data
```

---

## Directory Structure

```
web/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── [id]/                 # Dynamic user profile route
│   │   │   └── page.tsx          # User profile page
│   │   ├── bookmarks/            # Bookmarks page
│   │   ├── explore/              # Explore/discovery page
│   │   ├── notifications/        # Notifications page
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── page.tsx              # Home feed page
│   │   └── globals.css           # Global styles
│   │
│   ├── clients/                  # API client configuration
│   │   └── api.ts                # GraphQL client setup
│   │
│   ├── components/               # Reusable UI components
│   │   ├── layout/
│   │   │   └── layout.tsx        # Main app layout wrapper
│   │   ├── FeedCard.tsx          # Post/tweet card component
│   │   ├── Shimmer.tsx           # Loading skeleton components
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   └── Widget.tsx            # Right sidebar widget
│   │
│   ├── context/                  # React Context providers
│   │   └── ThemeContext.tsx      # Dark/light theme management
│   │
│   ├── gql/                      # Auto-generated GraphQL types
│   │   ├── fragment-masking.ts   # Fragment masking utilities
│   │   ├── gql.ts                # GraphQL document parser
│   │   ├── graphql.ts            # TypeScript types from schema
│   │   └── index.ts              # Barrel export
│   │
│   ├── graphql/                  # GraphQL operations
│   │   ├── mutations/
│   │   │   ├── post.ts           # Post mutations
│   │   │   └── user.ts           # User mutations
│   │   └── query/
│   │       ├── post.ts           # Post queries
│   │       └── user.ts           # User queries
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── post.ts               # Post-related hooks
│   │   └── user.ts               # User-related hooks
│   │
│   └── providers.tsx             # Global providers wrapper
│
├── codegen.ts                    # GraphQL Code Generator config
├── eslint.config.mjs             # ESLint configuration
├── graphql.schema.json           # GraphQL introspection schema
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.mjs            # PostCSS configuration
├── tsconfig.json                 # TypeScript configuration
└── pnpm-lock.yaml                # Lockfile
```

---

## Core Concepts

### 1. App Router (Next.js 16)

The project uses Next.js App Router for file-based routing with React Server Components:

- **Server Components** - Default component type, rendered on server
- **Client Components** - Marked with `"use client"`, interactive components
- **Layouts** - Shared UI that persists across route changes
- **Dynamic Routes** - `[id]` folder for user profiles

### 2. GraphQL Code Generation

The project auto-generates TypeScript types from the GraphQL schema:

**Process:**
1. Backend GraphQL schema is introspected
2. GraphQL operations in `src/graphql/` are analyzed
3. TypeScript types are generated in `src/gql/`
4. Type-safe queries/mutations are available

**Command:**
```bash
pnpm codegen  # Runs in watch mode during development
```

### 3. React Query (TanStack Query)

Server state management with powerful features:

- **Automatic Caching** - Reduces unnecessary network requests
- **Background Refetching** - Keeps data fresh
- **Optimistic Updates** - Instant UI feedback
- **Query Invalidation** - Refresh specific queries after mutations

**Query Keys:**
- `["current_user"]` - Logged-in user data
- `["user_by_id", id]` - Specific user profile
- `["all_posts"]` - Feed posts

---

## Components

### Layout Components

#### `Layout` (`src/components/layout/layout.tsx`)

Main layout wrapper that structures the app into three columns:

```tsx
<Layout>
  {/* Your page content */}
</Layout>
```

**Structure:**
- **Left Column** (2-3 cols) - Sidebar navigation
- **Center Column** (6-7 cols) - Main content feed
- **Right Column** (3-4 cols) - Widgets/suggestions

**Responsive Behavior:**
- Mobile: Bottom navigation, full-width content
- Desktop: Three-column layout with fixed sidebar

#### `Sidebar` (`src/components/Sidebar.tsx`)

Navigation component with different layouts for mobile and desktop:

**Desktop Features:**
- Logo and brand name
- Navigation menu items (Home, Explore, Notifications, Bookmarks, Profile)
- Post button
- Theme toggle
- User profile card
- Logout button

**Mobile Features:**
- Fixed bottom navigation bar
- Icon-only menu items
- Compact profile button

**Key Functionality:**
```tsx
const { logout } = useLogout();  // Logout hook
const { theme, toggleTheme } = useTheme();  // Theme management
```

#### `Widget` (`src/components/Widget.tsx`)

Right sidebar component showing:

**For Non-Authenticated Users:**
- Google Sign-in button with theme-aware styling
- Trending topics placeholder
- Suggestions placeholder

**For Authenticated Users:**
- Recommended users to follow
- Trending topics
- What's happening section

### Display Components

#### `FeedCard` (`src/components/FeedCard.tsx`)

Displays post/tweet cards with:

- User avatar and name
- Post content (text + optional image)
- Timestamp with relative time formatting
- Action buttons (Comment, Retweet, Like, Share)
- Hover effects and transitions
- Responsive sizing

**Time Formatting Logic:**
```tsx
const diffInSeconds = Math.floor((now - createdAt) / 1000);
// < 60s: "Xs"
// < 1h: "Xm"
// < 24h: "Xh"
// < 7d: "Xd"
// Else: Full date
```

#### `Shimmer` (`src/components/Shimmer.tsx`)

Loading skeleton components for better perceived performance:

- `FeedCardSkeleton` - Placeholder for feed cards
- `FeedSkeleton` - Multiple feed card skeletons
- `ProfileSkeleton` - User profile page skeleton
- `ComposerSkeleton` - Post composer skeleton
- `WidgetSkeleton` - Widget skeleton
- `MobileHeaderSkeleton` - Mobile header skeleton

**Usage:**
```tsx
{isLoading ? <FeedSkeleton count={5} /> : <FeedCard posts={posts} />}
```

---

## Pages & Routing

### Home Page (`src/app/page.tsx`)

**Route:** `/`

**Features:**
- Post composer with image upload
- Feed of all posts
- Mobile sticky header
- Real-time post creation

**Key Functionality:**

1. **Image Upload:**
```tsx
const handleSelectImage = () => {
  // 1. Create file input
  // 2. Request signed URL from backend
  // 3. Upload to S3
  // 4. Set image URL state
}
```

2. **Post Creation:**
```tsx
const handleCreatePost = () => {
  createPost({ content, imageURL });
  setContent("");  // Clear composer
}
```

**State Management:**
- `content` - Post text content
- `imageURL` - Uploaded image URL
- `user` - Current user from React Query
- `posts` - All posts from React Query

### User Profile (`src/app/[id]/page.tsx`)

**Route:** `/[userId]`

**Features:**
- User profile header with avatar
- Follow/unfollow functionality
- User stats (followers, following, posts)
- User's post feed
- Tabs for Posts, Replies, Likes (Posts tab active)

**Dynamic Route Handling:**
```tsx
const UserProfile = ({ params }: { params: Promise<{ id: string }> }) => {
  const [id, setId] = useState("");
  
  useEffect(() => {
    const getId = async () => {
      const { id } = await params;
      setId(id);
    }
    getId();
  }, [params]);
}
```

**Follow/Unfollow Logic:**
```tsx
const amIFollowing = currentUser?.following?.some(
  (user) => user.id === profileUser?.id
);

// Conditional rendering
{amIFollowing ? (
  <button onClick={handleUnfollow}>Following</button>
) : (
  <button onClick={handleFollow}>Follow</button>
)}
```

### Explore Page (`src/app/explore/page.tsx`)

**Route:** `/explore`

**Features:**
- Search bar with settings
- Category tabs (For You, Trending, News, Sports, Entertainment)
- Today's News section with mock data
- Trending hashtags
- Who to follow suggestions

**UI Patterns:**
- Sticky search header with backdrop blur
- Tab navigation with active indicator
- Hover states for better interactivity

### Notifications Page (`src/app/notifications/page.tsx`)

**Route:** `/notifications`

**Features:**
- Tab navigation (All, Verified, Mention)
- Settings button
- Placeholder for notification items

### Bookmarks Page (`src/app/bookmarks/page.tsx`)

**Route:** `/bookmarks`

**Features:**
- Simple header
- Placeholder for bookmarked posts

---

## State Management

### React Query Configuration

**Setup** (`src/providers.tsx`):
```tsx
const [queryClient] = useState(() => new QueryClient());

<QueryClientProvider client={queryClient}>
  {/* App content */}
</QueryClientProvider>
```

### Custom Hooks

#### User Hooks (`src/hooks/user.ts`)

**`useCurrentUser`**
```tsx
const { user, isLoading } = useCurrentUser();
```
- Fetches currently authenticated user
- Query key: `["current_user"]`
- Returns user data + loading state

**`useUserById`**
```tsx
const { user, isLoading } = useUserById(userId);
```
- Fetches specific user by ID
- Query key: `["user_by_id", id]`
- Used for profile pages

**`useLogout`**
```tsx
const { logout } = useLogout();
logout();  // Clears token and cache
```
- Removes JWT from localStorage
- Clears React Query cache
- Forces re-authentication

#### Post Hooks (`src/hooks/post.ts`)

**`useCreatePost`**
```tsx
const { mutate: createPost } = useCreatePost();
createPost({ content, imageURL });
```
- Creates new post
- Shows loading toast
- Invalidates `["all_posts"]` query on success
- Shows success toast

**`useGetAllPosts`**
```tsx
const { posts, isLoading } = useGetAllPosts();
```
- Fetches all posts for feed
- Query key: `["all_posts"]`
- Returns array of posts

### Context API

#### Theme Context (`src/context/ThemeContext.tsx`)

**Features:**
- Light/dark mode toggle
- System preference detection
- localStorage persistence
- Prevents flash of wrong theme

**Usage:**
```tsx
const { theme, toggleTheme, setTheme } = useTheme();

<button onClick={toggleTheme}>
  {theme === "dark" ? "Light Mode" : "Dark Mode"}
</button>
```

**Implementation Details:**
- Default: Dark mode
- Reads from localStorage on mount
- Falls back to system preference
- Updates `<html>` class attribute

---

## GraphQL Integration

### Client Configuration (`src/clients/api.ts`)

```tsx
export const graphqlClient = new GraphQLClient(
  process.env.NODE_ENV === "development" 
    ? "http://localhost:9000/graphql" 
    : process.env.NEXT_PUBLIC_API_URL,
  {
    headers: () => ({
      "Authorization": `Bearer ${getAuthToken()}`
    })
  }
);
```

**Key Points:**
- Environment-aware endpoint
- Auto-includes JWT in all requests
- Retrieves token from localStorage

### GraphQL Operations

#### User Queries (`src/graphql/query/user.ts`)

**`verifyUserGoogleTokenQuery`**
- Validates Google OAuth token
- Returns JWT for app authentication

**`getCurrentUserQuery`**
- Fetches authenticated user with:
  - Profile data (id, email, avatar, name)
  - Recommended users
  - Followers/following
  - User's posts

**`getUserByIdQuery`**
- Fetches specific user profile
- Includes followers, following, posts

#### Post Queries (`src/graphql/query/post.ts`)

**`getAllPostsQuery`**
- Fetches all posts for feed
- Includes author data

**`getSignedURLForPostImageQuery`**
- Requests S3 signed URL for image upload
- Parameters: imageName, imageType

#### User Mutations (`src/graphql/mutations/user.ts`)

**`followUserMutation`**
```graphql
mutation FollowUser($to: ID!) {
  followUser(to: $to)
}
```

**`unfollowUserMutation`**
```graphql
mutation UnfollowUser($to: ID!) {
  unfollowUser(to: $to)
}
```

#### Post Mutations (`src/graphql/mutations/post.ts`)

**`createPostMutation`**
```graphql
mutation CreatePost($payload: CreatePostData!) {
  createPost(payload: $payload) {
    id
  }
}
```

### Code Generation

**Configuration** (`codegen.ts`):
```typescript
{
  schema: "http://localhost:9000/graphql",  // GraphQL endpoint
  documents: ['src/**/*.{tsx,ts}'],         // Find operations
  generates: {
    './src/gql/': {
      preset: 'client',                     // Generate client types
    },
    './graphql.schema.json': {
      plugins: ['introspection'],           // Schema introspection
    }
  }
}
```

**Generated Files:**
- `src/gql/graphql.ts` - All TypeScript types
- `src/gql/gql.ts` - Document parser
- `graphql.schema.json` - Schema introspection

---

## Styling & Theming

### Tailwind CSS Configuration

**PostCSS Setup** (`postcss.config.mjs`):
```javascript
{
  plugins: {
    "@tailwindcss/postcss": {},
  }
}
```

### Global Styles (`src/app/globals.css`)

**Key Features:**

1. **Dark Mode Variant**
```css
@custom-variant dark (&:where(.dark, .dark *));
```

2. **No Scrollbar Utility**
```css
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
```

3. **Shimmer Animation**
```css
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

4. **Responsive Breakpoints**
- Custom `xs` breakpoint at 480px
- Safe area padding for notched devices

### Theme System

**How Dark Mode Works:**

1. User toggles theme → `ThemeContext.toggleTheme()`
2. Context updates state → `theme = "dark"`
3. Effect runs → `document.documentElement.classList.add("dark")`
4. Saves to localStorage → `spread_theme`
5. Tailwind's `dark:` variants activate

**Styling Pattern:**
```tsx
<div className="bg-white dark:bg-black text-black dark:text-white">
  Content
</div>
```

### Design System

**Colors:**
- Light mode: White background, gray accents
- Dark mode: Black background, zinc accents
- Accent: Blue (#3B82F6) for interactive elements

**Typography:**
- Font: Inter (Google Fonts)
- Sizes: Responsive with `sm:`, `md:`, `lg:` breakpoints

**Spacing:**
- Consistent padding: 3-4 units (0.75-1rem)
- Gap between elements: 3-4 units

---

## Development Workflow

### Getting Started

1. **Install Dependencies**
```bash
pnpm install
```

2. **Environment Variables**

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:9000/graphql
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

3. **Start Development Server**
```bash
pnpm dev
```

This runs:
- `pnpm codegen` - GraphQL code generation (watch mode)
- `next dev` - Next.js dev server

The app will be available at `http://localhost:3000`

### Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `concurrently "pnpm codegen" "next dev"` | Development mode |
| `build` | `next build` | Production build |
| `start` | `next start` | Start production server |
| `lint` | `eslint` | Lint code |
| `codegen` | `gql-gen --config codegen.ts --watch` | Generate GraphQL types |

### Development Flow

1. **Backend Running**
   - Ensure GraphQL API is running at `http://localhost:9000/graphql`

2. **Code Changes**
   - Edit components/pages
   - GraphQL types auto-regenerate on query/mutation changes
   - Hot reload updates browser

3. **Adding New Features**
   - Create/update GraphQL operations in `src/graphql/`
   - Code generator creates types
   - Use types in custom hooks
   - Build UI components
   - Add to pages

### Testing Authentication

1. Click Google Sign-in button
2. Authenticate with Google
3. JWT stored in localStorage as `spread_token`
4. User data fetched via `useCurrentUser()`
5. UI updates to show authenticated state

---

## Configuration Files

### Next.js Config (`next.config.ts`)

```typescript
{
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "spread-dev.s3.ap-south-1.amazonaws.com" }
    ]
  }
}
```

**Purpose:** Allow Next.js Image component to load images from trusted domains

### TypeScript Config (`tsconfig.json`)

**Key Settings:**
- `target: "ES2017"` - Modern JavaScript features
- `strict: true` - Strict type checking
- `jsx: "react-jsx"` - New JSX transform
- `paths: { "@/*": ["./src/*"] }` - Path aliases

### ESLint Config (`eslint.config.mjs`)

Uses `eslint-config-next` for Next.js best practices and React Query rules.

---

## Best Practices

### 1. Component Design

✅ **Do:**
- Use client components (`"use client"`) only when needed
- Keep components small and focused
- Use TypeScript interfaces for props
- Implement loading states with skeletons

❌ **Don't:**
- Make everything a client component
- Mix business logic with UI rendering
- Ignore TypeScript errors

### 2. State Management

✅ **Do:**
- Use React Query for server state
- Use Context API for UI state (theme)
- Invalidate queries after mutations
- Use query keys consistently

❌ **Don't:**
- Store server data in useState
- Fetch data in useEffect
- Mutate cache directly

### 3. GraphQL

✅ **Do:**
- Use generated types
- Keep queries/mutations in separate files
- Request only needed fields
- Handle loading and error states

❌ **Don't:**
- Write queries inline
- Over-fetch data
- Ignore type safety

### 4. Styling

✅ **Do:**
- Use Tailwind utility classes
- Support dark mode with `dark:` variant
- Make layouts responsive
- Use semantic HTML

❌ **Don't:**
- Write custom CSS unless necessary
- Hardcode colors
- Ignore mobile view

### 5. Performance

✅ **Do:**
- Use Next.js Image component
- Implement code splitting
- Show loading states
- Optimize re-renders

❌ **Don't:**
- Load large images without optimization
- Create unnecessary re-renders
- Fetch data on every render

---

## Common Patterns

### Pattern 1: Protected Routes

```tsx
const { user, isLoading } = useCurrentUser();

if (isLoading) return <Skeleton />;
if (!user) return <LoginPrompt />;

return <ProtectedContent />;
```

### Pattern 2: Optimistic Updates

```tsx
const { mutate } = useMutation({
  mutationFn: async (data) => await api(data),
  onMutate: () => toast.loading("Processing..."),
  onSuccess: () => {
    queryClient.invalidateQueries(['data']);
    toast.success("Success!");
  }
});
```

### Pattern 3: Responsive Layouts

```tsx
<div className="
  flex-col lg:grid lg:grid-cols-12
  p-3 sm:p-4
  text-sm sm:text-base
">
  {/* Mobile: column, Desktop: grid */}
</div>
```

---

## Troubleshooting

### Common Issues

**Issue:** GraphQL types not updating
```bash
# Solution: Restart codegen
pnpm codegen
```

**Issue:** Authentication not working
```bash
# Check:
1. Backend is running
2. Google Client ID is correct
3. localStorage has 'spread_token'
4. Token is not expired
```

**Issue:** Images not loading
```bash
# Check:
1. Domain is in next.config.ts
2. Image URL is correct
3. CORS is configured on S3
```

**Issue:** Dark mode not persisting
```bash
# Check:
1. ThemeProvider wraps app
2. localStorage is accessible
3. No errors in console
```

---

## Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)

### Related Files
- [Backend Architecture](../server/BACKEND_ARCHITECTURE.md)
- [Backend Quick Reference](../server/QUICK_REFERENCE.md)
- [Root README](../README.md)

---

## Contributing

When contributing to the frontend:

1. **Follow the existing patterns** - Check similar components/hooks
2. **Update types** - Run codegen after GraphQL changes
3. **Test responsively** - Check mobile, tablet, desktop views
4. **Support dark mode** - Use `dark:` variants
5. **Add loading states** - Use shimmer components
6. **Document complex logic** - Add comments for non-obvious code

---

## License

This project is licensed under the ISC License.

## Author

**Abhinay Jangde**
- Email: abhinayjangde@gmail.com
- GitHub: [@abhinayjangde](https://github.com/abhinayjangde)

---

**Happy Coding! 🚀**
