# Next.js Snake Game

This is a complete, production-ready implementation of the classic Snake game, built with Next.js 14, TypeScript, and Tailwind CSS. It features a persistent leaderboard backed by a PostgreSQL database.

## Features

- Classic Snake gameplay on an HTML Canvas.
- Real-time scoring.
- Game Over modal with score submission.
- Persistent high score leaderboard.
- Fully responsive design.
- Containerized for predictable deployments.
- CI/CD pipeline for automated testing and deployment.

## Architecture

The application follows a modern, serverless-first architecture using Next.js.

-   **Frontend**: A client-rendered interactive application (`"use client"`) built with React. The game logic is encapsulated in a custom hook (`useSnakeGame`), and rendering is performed on an HTML `<canvas>`.
-   **Backend**: A simple RESTful API is exposed via Next.js Route Handlers (`/api/scores`) for managing high scores.
-   **Database**: A PostgreSQL database stores the high scores, accessed via the Prisma ORM for type-safe queries.
-   **Deployment**: The application is containerized using Docker and is ready for deployment on any platform that supports containers (e.g., Vercel, AWS Fargate, Google Cloud Run).

## Getting Started

### Prerequisites

-   Node.js (v20 or later)
-   Docker and Docker Compose
-   `pnpm`, `npm`, or `yarn`

### Local Development

1.  **Clone the repository:**