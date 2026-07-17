# WatchLore 🎬

WatchLore is a full-stack web application designed for movie, TV series, and anime enthusiasts. It allows users to search and discover content from the TMDB database, add titles to their personal watch vault, manage their watching status, write reviews/ratings, and upload posters or backdrops.

The project is structured as a monorepo consisting of:

- `/client`: A React + Vite SPA frontend.
- `/server`: A Go (Golang) REST API backend that also serves the built frontend assets in production.

---

## 🛠️ Tech Stack

### Frontend (Client)

- **Core:** React 19, TypeScript, Vite
- **State Management:** Redux Toolkit (Redux slices for authentication and theme)
- **Server State/Caching:** TanStack Query (React Query v5) for performance-focused data fetching
- **Styling:** Tailwind CSS v4 for modern utility styling
- **Routing:** React Router v8
- **API Integration:** Axios with custom response interceptors for JWT token silent refreshing
- **UI Components:** Lucide Icons & React Hot Toast for micro-animations and notifications

### Backend (Server)

- **Core Language:** Go (Golang) 1.26+
- **Router:** Chi Router v5 (lightweight, modular router)
- **Database:** MongoDB (using `go.mongodb.org/mongo-driver/v2`)
- **Authentication:** Stateless session authentication using custom signed JWTs (Access & Refresh tokens via HTTP-Only cookies)
- **Security & Control:**
  - CORS middleware (`github.com/go-chi/cors`)
  - Global rate limiting (`github.com/go-chi/httprate`)
  - Request body size limiting middleware to prevent DOS attacks
- **File Storage:** ImageKit Go SDK v2 for storing uploaded posters and backdrops

---

## 📡 API Endpoints

### 1. Health Checks

- `GET /api/health` — Checks database connectivity and system status.

### 2. User Authentication (`/auth/users`)

- `POST /auth/users/register` — Create a new user account.
- `POST /auth/users/login` — Login user (issues HTTP-Only JWT cookies).
- `POST /auth/users/logout` — Revoke and clear auth cookies.
- `GET /auth/users/refresh` — Refresh the Access Token using the Refresh Token cookie.
- `GET /auth/users/get-me` — Retrieve the current user's profile info _(requires Authorization)_.

### 3. Show & Vault Management (`/api/shows`)

- `GET /api/shows` — Retrieve all shows saved in the user's vault _(requires Authorization)_.
- `POST /api/shows` — Save a new show manually to the vault _(requires Authorization, max 10MB body)_.
- `GET /api/shows/{id}` — Get details of a single show by its database ID.
- `PATCH /api/shows/{id}` — Update watch status, rating, genre, or notes for a saved show _(requires Authorization)_.
- `DELETE /api/shows/{id}` — Remove a show from the user's vault _(requires Authorization)_.
- `POST /api/shows/{id}/images/upload` — Upload a local file as the show's poster image _(requires Authorization, max 10MB file size upload to ImageKit)_.
- `POST /api/shows/{id}/images/url` — Link a show to an external image URL _(requires Authorization)_.

### 4. Content Discovery (`/api/discover`)

- `GET /api/discover/{type}` — Fetch content dynamically from TMDB _(requires Authorization)_.
  - Valid types: `trending`, `movies`, `series`, `anime`.

---

## 💻 Local Setup & Development

### Prerequisites

- **Go:** version 1.23 or higher
- **Node.js:** version 20 or higher
- **pnpm:** package manager (`npm i -g pnpm`)
- **MongoDB:** a local instance or a MongoDB Atlas cloud URI

### 1. Set Up the Backend (Server)

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Create a `.env` file:
   ```env
   PORT=6969
   ENV=development
   MONGODB_URI=mongodb://localhost:27017/
   DB_NAME=watchLore
   JWT_SECRET=your_super_secret_jwt_key
   ACCESS_TOKEN_TTL=25m
   REFRESH_TOKEN_TTL=72h
   ImageKitPrivateKey=your_imagekit_private_key
   ImageKitPublicKey=your_imagekit_public_key
   ImageKitURL=https://ik.imagekit.io/your_endpoint/
   TMDB_API_KEY=your_tmdb_v4_read_access_token
   ALLOWED_ORIGINS=http://localhost:5173
   ```
3. Run the development server (auto-rebuilds using Air if installed, or runs directly):
   ```bash
   # Using Go directly
   go run cmd/api/main.go

   # Or using the Makefile
   make run
   ```

### 2. Set Up the Frontend (Client)

1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file to point to the backend server:
   ```env
   VITE_API_BASE_URL=http://localhost:6969/
   ```
4. Run the Vite development server:
   ```bash
   pnpm dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## 🚀 Combined Production Mode (Local Testing)

To test the production environment locally where the Go server compiles and hosts the React application directly:

1. Build the React frontend:
   ```bash
   cd client
   pnpm build
   ```
2. Start the Go backend:
   ```bash
   cd ../server
   go run cmd/api/main.go
   ```
3. Open your browser and access the app directly at **`http://localhost:6969`**. The Go router will serve the React SPA bundle from `../client/dist`.
