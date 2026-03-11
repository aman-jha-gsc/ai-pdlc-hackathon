# Zenith To-Do App

Welcome to Zenith, a minimalist, single-page to-do application for the web. It's designed for individuals seeking a straightforward and aesthetically pleasing tool for managing daily tasks.

## Features

- **Create, Read, Update, Delete (CRUD):** Full to-do management.
- **Elegant & Minimalist UI:** A clean interface that helps you focus.
- **Inline Editing:** Double-click a to-do to edit it directly.
- **Persistent Sessions:** Your to-do list is tied to your browser, no login required.
- **Dark Mode:** Easy on the eyes.
- **Responsive Design:** Works beautifully on desktop and mobile.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Backend Logic:** Next.js Server Actions

## Architecture Overview

Zenith is a server-rendered application built on Next.js.

- **Frontend:** The UI is constructed with React Server Components (RSCs) for initial page loads and Client Components for interactive elements.
- **Backend (API):** Data mutations (Create, Update, Delete) are handled by **Next.js Server Actions**. These functions are co-located with their corresponding UI components and execute securely on the server.
- **Database:** A PostgreSQL database serves as the single source of truth, accessed via the Prisma ORM.
- **User Identification:** A unique `sessionId` is generated for each new visitor and stored in an `httpOnly` cookie. All tasks are associated with this `sessionId`.

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- Docker and Docker Compose

### 1. Clone the Repository