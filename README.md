# Wholesale Business Dashboard

This is a modern, responsive Wholesale Business Dashboard built with Next.js 14. It provides a clear operational overview including sales performance, order activity, inventory status, and customer insights.

## Features

-   **At-a-glance Metrics**: Key performance indicators (KPIs) like Total Revenue, New Orders, and Customer Growth.
-   **Sales Visualization**: Time-series chart showing sales trends.
-   **Recent Activity**: Tables for recent orders and low-stock products.
-   **Secure Authentication**: Email/password login powered by NextAuth.js.
-   **Responsive Design**: Modern UI that works on desktop, tablet, and mobile.
-   **Server-Side Rendering**: Fast initial page loads using Next.js App Router and React Server Components.

---

## Technical Architecture

-   **Framework**: Next.js 14 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Database**: PostgreSQL
-   **ORM**: Prisma
-   **Authentication**: NextAuth.js (Auth.js)
-   **Charting**: Recharts
-   **Deployment**: Docker, Vercel (recommended)

The application is a monolithic Next.js app where the frontend and backend API are co-located. Data is primarily fetched on the server using React Server Components for optimal performance. API routes are available for client-side interactions.

---

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn
-   Docker (for local database)

### 1. Clone the repository