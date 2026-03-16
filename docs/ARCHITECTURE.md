Here is the detailed technical architecture for the Snake game, designed for direct implementation by a Code Agent.

---

## 1. Architecture Overview

This architecture outlines a modern, serverless-first web application for a classic Snake game. The system is built as a monolithic repository using Next.js 14, leveraging its capabilities for both the frontend and the backend API.

The core architectural pattern is a **client-rendered interactive application with a server-side API for data persistence**.

-   **Frontend**: A single-page interface built with React and the Next.js App Router. The game logic, state management, and rendering loop will be handled entirely on the client-side using React hooks (`useState`, `useEffect`, `useCallback`). The page will be a Client Component (`"use client"`) due to its high level of interactivity.
-   **Backend**: A simple RESTful API is exposed via Next.js Route Handlers. This API has a single resource, `/api/scores`, which handles fetching high scores and submitting new ones.
-   **Database**: A PostgreSQL database stores the high scores. The application interacts with the database via the Prisma ORM, ensuring type-safe database access from the API routes.
-   **Deployment**: The application is containerized using Docker and designed for deployment on a serverless container platform like Google Cloud Run, connected to a managed database like Cloud SQL.

### System Architecture Diagram

```mermaid
graph TD
    subgraph "User's Browser"
        A[Next.js Frontend: React Game Component]
    end

    subgraph "Next.js Application (Serverless Function / Container)"
        B[Page Route: /] --> C{Server Component Shell}
        C --> A
        D[API Route: /api/scores]
        E[Prisma Client]
    end

    subgraph "Cloud Infrastructure"
        F[PostgreSQL Database]
    end

    A -- "HTTP GET/POST" --> D
    D -- "TCP/IP" --> E
    E -- "SQL Queries" --> F

    style A fill:#cde4ff
    style D fill:#d2ffd2
    style F fill:#ffdac1
```

## 2. Technology Stack

| Layer      | Technology                  | Justification                                                                                                                                                                                           |
| ---------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend   | Next.js 14 (App Router) + React 18 + TypeScript | The App Router enables modern React features like Server Components for the shell and Client Components for interactivity. TypeScript provides essential type safety for a robust codebase. |
| Styling    | Tailwind CSS                | A utility-first CSS framework that allows for rapid UI development directly within the JSX, keeping styles colocated with their components and ensuring consistency.                                       |
| API        | Next.js Route Handlers      | The native way to build API endpoints in the App Router. They are lightweight, colocated with the frontend code, and seamlessly deploy as serverless functions.                                            |
| Database   | PostgreSQL with Prisma ORM  | PostgreSQL is a powerful, reliable, and open-source relational database. Prisma provides a best-in-class, type-safe ORM that simplifies database interactions and migrations.                               |
| Auth       | None (Anonymous Submission) | Per the PRD, users submit a name with their score without logging in. This simplifies the architecture by avoiding the complexity of user accounts, sessions, and authentication flows for v1.            |
| Deployment | Docker + Google Cloud Run   | Containerizing with Docker ensures a consistent and reproducible environment. Cloud Run provides a scalable, serverless platform to run the container, and Cloud SQL offers a managed PostgreSQL service. |

## 3. Project Structure

```
snake-game-nextjs/
├── .dockerignore
├── .env.example
├── .eslintrc.json
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── next.config.mjs
├── package.json
├── postcss.config.js
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
│   └── favicon.ico
├── README.md
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── scores/
│   │   │       ├── route.ts
│   │   │       └── _lib/
│   │   │           └── validation.ts
│   │   ├── components/
│   │   │   ├── game/
│   │   │   │   ├── GameBoard.tsx
│   │   │   │   ├── GameContainer.tsx
│   │   │   │   └── useGameLogic.ts
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── GameOverModal.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   └── Leaderboard.tsx
│   │   │   └── ScoreDisplay.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   └── prisma.ts
│   └── styles/
│       └── globals.css
├── tailwind.config.ts
└── tsconfig.json
```

## 4. Database Schema

The schema will be defined in `prisma/schema.prisma`. It contains a single model for storing scores.

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Score {
  id         Int      @id @default(autoincrement())
  playerName String   @db.VarChar(50)
  score      Int
  createdAt  DateTime @default(now())

  @@map("scores")
}
```

## 5. API Design

The API consists of one resource: `/api/scores`.

| Method | Path           | Request                                                                                             | Response                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              - | Auth |
| ------ | -------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| `GET`  | `/api/scores`  | **Query Params:**<br>`limit` (optional, number, default: 10): Number of scores to return. | **Success (200 OK):**<br>```json<br>{<br>  "scores": [<br>    {<br>      "id": 1,<br>      "playerName": "Alice",<br>      "score": 150,<br>      "createdAt": "2023-10-27T10:00:00.000Z"<br>    },<br>    ...<br>  ]<br>}<br>```<br>**Error (500 Internal Server Error):**<br>```json<br>{ "error": "Failed to fetch scores" }<br>``` | None |
| `POST` | `/api/scores`  | **Body (JSON):**<br>```json<br>{<br>  "playerName": "Bob",<br>  "score": 125<br>}<br>```<br>**Validation (Zod):**<br>- `playerName`: string, 1-50 chars<br>- `score`: number, > 0 | **Success (201 Created):**<br>```json<br>{<br>  "id": 2,<br>  "playerName": "Bob",<br>  "score": 125,<br>  "createdAt": "2023-10-27T10:05:00.000Z"<br>}<br>```<br>**Error (400 Bad Request):**<br>```json<br>{ "error": "Invalid input", "details": [...] }<br>```<br>**Error (500 Internal Server Error):**<br>```json<br>{ "error": "Failed to save score" }<br>``` | None |

## 6. Page & Component Architecture

### Wireframes

#### Main Game Interface

```
+----------------------------------------------------------------------+
| Snake Game                                        Score: 15          |
+----------------------------------------------------------------------+
|                                                                      |
|                                                                      |
|                                                                      |
|                           +-------+                                  |
|                           |       |                                  |
|                           |   *   |  (food)                          |
|                           |       |                                  |
|                           +-------+                                  |
|                                                                      |
|                                                                      |
|    (snake)  >>>>>>O                                                  |
|                                                                      |
|                                                                      |
|                                                                      |
|                                                                      |
+----------------------------------------------------------------------+
| Controls: Use Arrow Keys to move. Press 'Space' to start/pause.      |
+----------------------------------------------------------------------+
```

#### Game Over Modal

```
+----------------------------------------------------------------------+
|                          [ Game Over! ]                              |
|                                                                      |
|                       Your Final Score: 150                          |
|                                                                      |
|       Enter your name: [ Alice_________ ]                            |
|                                                                      |
|                      +-------------------+                           |
|                      |  Submit Score     |                           |
|                      +-------------------+                           |
|                                                                      |
|                      [ Play Again ]                                  |
|                                                                      |
+----------------------------------------------------------------------+
```

---

### Pages

#### **`page.tsx`**

-   **Route**: `/`
-   **Purpose**: The main entry point of the application. Renders the overall page layout, including the game container and the leaderboard.
-   **Components Used**: `GameContainer`, `Leaderboard`.
-   **API Calls**: This page itself makes no API calls. Child components (`Leaderboard`) will fetch data.
-   **Structure**: This will be a Server Component that composes client components. It provides the static layout structure.

### Components

#### **`GameContainer.tsx`** (`"use client"`)

-   **Name**: `GameContainer`
-   **Purpose**: The main stateful component that orchestrates the entire game experience. It manages game state (playing, paused, game over), score, and user interactions.
-   **Props**: None.
-   **State**:
    -   `score: number`
    -   `gameState: 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'`
    -   `highScores: Score[]` (to pass down to Leaderboard and refresh on new submission)
-   **Hooks**: `useGameLogic` custom hook to encapsulate the complex game loop logic.
-   **User Interactions**: Listens for keyboard events (`ArrowKeys`, `Space`) to pass to the game logic. Handles starting, pausing, and restarting the game.
-   **Where Used**: `src/app/page.tsx`

#### **`useGameLogic.ts`** (`"use client"`)

-   **Name**: `useGameLogic`
-   **Purpose**: A custom hook to abstract the core snake game mechanics (movement, collision detection, food generation, game loop). This keeps `GameContainer` clean.
-   **Arguments**:
    -   `onGameOver: (score: number) => void`
    -   `onScore: () => void`
-   **Returns**:
    -   `snake: {x: number, y: number}[]`
    -   `food: {x: number, y: number}`
    -   `direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'`
    -   `handleKeyPress: (key: string) => void`
    -   `startGame: () => void`
    -   `pauseGame: () => void`
-   **Logic**: Contains the main `useEffect` hook with `setInterval` for the game loop. Manages all positional data and collision checks.

#### **`GameBoard.tsx`** (`"use client"`)

-   **Name**: `GameBoard`
-   **Purpose**: A presentational component that renders the game grid, the snake segments, and the food item based on the props it receives.
-   **Props**:
    -   `snake: {x: number, y: number}[]`
    -   `food: {x: number, y: number}`
    -   `gridSize: number` (e.g., 20)
-   **Where Used**: `GameContainer.tsx`

#### **`ScoreDisplay.tsx`** (`"use client"`)

-   **Name**: `ScoreDisplay`
-   **Purpose**: Displays the current score.
-   **Props**: `score: number`
-   **Where Used**: `GameContainer.tsx`

#### **`GameOverModal.tsx`** (`"use client"`)

-   **Name**: `GameOverModal`
-   **Purpose**: A modal that appears when the game is over. Displays the final score and provides a form to submit the player's name.
-   **Props**:
    -   `isOpen: boolean`
    -   `score: number`
    -   `onClose: () => void` (used for "Play Again")
    -   `onSubmit: (playerName: string) => Promise<void>`
-   **State**: `playerName: string`, `isSubmitting: boolean`
-   **API Calls**: `POST /api/scores` when the user submits their name.
-   **Where Used**: `GameContainer.tsx`

#### **`Leaderboard.tsx`** (`"use client"`)

-   **Name**: `Leaderboard`
-   **Purpose**: Fetches and displays the top 10 high scores.
-   **Props**:
    -   `initialScores: Score[]` (can be passed from a Server Component parent)
    -   `refreshTrigger: any` (a value that changes to trigger a re-fetch)
-   **State**: `scores: Score[]`, `isLoading: boolean`
-   **API Calls**: `GET /api/scores?limit=10` on initial mount and when `refreshTrigger` changes. Uses `swr` or `react-query` for efficient data fetching and caching.
-   **Where Used**: `src/app/page.tsx`

#### **`Button.tsx`**, **`Input.tsx`**

-   **Purpose**: Generic, reusable UI components for buttons and form inputs, styled with Tailwind CSS. They will have variants for different use cases (e.g., primary button, text input).

## 7. Authentication & Authorization

Authentication is not required for this version of the application. Score submission is anonymous; users provide a name in a text field, which is not tied to a user account. This simplifies the architecture significantly.

-   **Flow**:
    1.  User plays the game.
    2.  Game ends.
    3.  User enters a name in the "Game Over" modal.
    4.  Client sends a `POST` request to `/api/scores` with `{ playerName, score }`.
-   **Authorization**: There are no protected routes or role-based access controls.

## 8. Deployment Architecture

### `Dockerfile` (Multi-stage)

```dockerfile
# Dockerfile

# 1. Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 2. Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
ENV DATABASE_URL="postgresql://user:pass@host:port/db"
RUN npx prisma generate
RUN npm run build

# 3. Production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### `docker-compose.yml` (for Local Development)

```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: snakegamedb
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    depends_on:
      - db
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: 'postgresql://user:password@db:5432/snakegamedb'

volumes:
  postgres_data:
```

### Cloud Run Configuration

-   **Source**: Deploy from the container image built by the Dockerfile and pushed to Google Artifact Registry.
-   **CPU Allocation**: Allocate 1 vCPU.
-   **Memory**: 512 MiB.
-   **Port**: `3000`.
-   **Concurrency**: 80 (default).
-   **Environment Variables**:
    -   `PORT=3000`
    -   `DATABASE_URL`: The connection string for the Cloud SQL for PostgreSQL instance. Use the private IP for lower latency and better security.
-   **VPC Connector**: Configure a Serverless VPC Access connector to allow Cloud Run to communicate with the Cloud SQL instance over its private IP address.

## 9. Security Considerations

-   **Input Validation**: All incoming data to the `POST /api/scores` endpoint must be strictly validated using a library like **Zod**. This will be implemented in `src/app/api/scores/_lib/validation.ts`. We will check for `playerName` length and type, and ensure `score` is a positive integer. This prevents oversized data and basic NoSQL/SQL injection attempts.
-   **Anti-Cheating**: Client-side score submission is inherently insecure. A malicious user can easily bypass the game and submit a high score via an API client. For v1, this is an **accepted risk**. Future mitigations could involve lightweight obfuscation or a simple challenge-response mechanism, but these are out of scope.
-   **Rate Limiting**: The `/api/scores` POST endpoint should be rate-limited to prevent spam/abuse. A middleware can be added to the route handler to limit requests from a single IP address (e.g., using `@upstash/ratelimit` with Redis for a serverless environment, or a simple in-memory store for basic protection).
-   **Secrets Management**: The `DATABASE_URL` must be managed as a secret. It will be passed as an environment variable during the build/run phase. It must never be hardcoded in the source code. The `.env.example` file will provide a template, and the actual `.env` file will be in `.gitignore`.
-   **CORS**: Next.js Route Handlers have same-origin protection by default. No extra CORS configuration is needed as the API is only called by the frontend from the same domain.

## 10. Architecture Risks

-   **Client-Side Performance**: The game loop relies on `setInterval` and re-renders on every tick. On low-powered devices, this could lead to jank or lag. The rendering logic in `GameBoard` must be optimized to only re-render what's necessary. Using `<canvas>` instead of DOM elements for the board is a potential optimization if performance becomes an issue. For v1, DOM elements are sufficient and simpler to implement.
-   **Score Integrity**: As mentioned in Security, scores can be faked. The leaderboard's credibility is low. This is a deliberate trade-off to keep the v1 architecture simple. If this becomes a business problem, a more complex server-side game state validation would be required