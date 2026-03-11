# Next.js Snake Game

A complete, production-ready implementation of the classic Snake game built with Next.js 14, React, and Tailwind CSS.

This project serves as a demonstration of modern frontend development practices, including component-based architecture, state management with custom hooks, automated testing, and CI/CD.

## Live Demo

The application is deployed on Vercel. You can play the game here: [Link to be added after deployment]

## Features

-   Classic Snake gameplay
-   Score tracking
-   Game over and restart functionality
-   Responsive design for desktop and mobile
-   Keyboard controls (Arrow Keys)

## Architecture Overview

The application follows a client-side rendered (CSR) architecture, even though it's built on Next.js. This is ideal for a self-contained, interactive experience like a game.

-   **Framework**: Next.js 14 (App Router)
-   **UI**: React 18
-   **Styling**: Tailwind CSS
-   **State Management**: A custom React hook (`useGameLogic`) encapsulates all game state and logic, providing a single source of truth.
-   **Rendering**: UI components are purely presentational. They receive state as props and render the game board, snake, and food declaratively.
-   **Controls**: A global event listener captures keyboard input to control the snake's direction.

## Getting Started

### Prerequisites

-   Node.js (v20.x or later)
-   npm, yarn, or pnpm

### 1. Clone the Repository