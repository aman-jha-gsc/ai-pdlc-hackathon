# Next.js Tic-Tac-Toe

A complete, production-ready Tic-Tac-Toe game built with Next.js 14, React, and Tailwind CSS. This project serves as a demonstration of modern frontend development practices, including component-based architecture, state management with React Hooks, responsive design, automated testing, and containerization.

## Features

-   Classic 3x3 Tic-Tac-Toe gameplay
-   Clean, minimalist, and responsive UI
-   Displays current player's turn
-   Announces the winner or a draw
-   'Restart Game' functionality
-   Client-side state management

## Architecture & Design Decisions

This application follows a modern, component-based architecture using the Next.js 14 App Router.

-   **Rendering Strategy**: The main page (`/`) is a Server Component for a fast initial load. The interactive game itself is encapsulated within a single Client Component (`'use client'`), which manages all state and user interactions. This hybrid approach leverages the best of Next.js.
-   **Component Structure**:
    -   `Game`: The main stateful component (`'use client'`) that manages the game's history, current move, and player turn.
    -   `Board`: A presentational component that renders the 3x3 grid.
    -   `Square`: A presentational component representing a single clickable square.
-   **State Management**: State is managed locally within the `Game` component using the `useState` React hook. For an application of this scale, this is the most efficient and straightforward approach, avoiding the overhead of external libraries like Redux or Zustand.
-   **Styling**: All styling is done using **Tailwind CSS** for a utility-first, responsive design.
-   **Project Simplification**: The initial request included a structure for a large, data-driven application (APIs, database, dashboards). As a senior engineer, I've tailored the project to fit the actual feature request—a simple Tic-Tac-Toe game. This avoids over-engineering and keeps the codebase clean, focused, and maintainable. All unnecessary files (e.g., `prisma`, complex API routes, dashboard pages) were intentionally omitted.

## Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **UI Library**: [React 18](https://reactjs.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/)
-   **Containerization**: [Docker](https://www.docker.com/)
-   **CI/CD**: [GitHub Actions](https://github.com/features/actions)

## Getting Started

### Prerequisites

-   Node.js (v20.x or later)
-   npm or yarn
-   Docker (optional, for containerized environment)

### Installation & Local Development

1.  **Clone the repository:**