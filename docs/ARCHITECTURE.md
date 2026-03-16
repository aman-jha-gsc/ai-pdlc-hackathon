Here is the detailed technical architecture for the Wholesale Business Dashboard, designed for direct implementation by a Code Agent.

---

## 1. Architecture Overview

The system is designed as a monolithic web application using the Next.js 14 App Router. This architecture co-locates the frontend UI, backend API, and server-side rendering logic within a single project, simplifying development and deployment for this MVP.

The core architectural pattern is server-centric, leveraging React Server Components (RSCs) for data fetching and rendering on the server, which minimizes client-side JavaScript and improves initial load performance. API routes are implemented as Next.js Route Handlers, which are serverless functions deployed alongside the application.

Authentication is handled by Auth.js (NextAuth.js), using a Credentials Provider for email/password login. Session state is managed via secure, HTTP-only JWT cookies. All dashboard pages are protected, and unauthorized access is redirected to a login page via middleware.

The application will be containerized using Docker for consistent environments and deployed as a serverless container on Google Cloud Run, connected to a PostgreSQL database on Google Cloud SQL.

### System Architecture Diagram

```mermaid
graph TD
    subgraph "User's Browser"
        A[User]
    end

    subgraph "Google Cloud Platform"
        B[Next.js 14 Application on Cloud Run]
        C[PostgreSQL Database on Cloud SQL]
        D[Google Secret Manager for Env Vars]

        subgraph B
            B1[Frontend (React Server Components)]
            B2[Backend (API Route Handlers)]
            B3[Auth.js (Authentication)]
            B4[Prisma ORM (DB Client)]
        end
    end

    A -- HTTPS Request --> B;
    B1 -- Server-side Data Fetch --> B2;
    B2 -- Authenticates Request --> B3;
    B3 -- Manages Session --> A;
    B2 -- Queries Data via ORM --> B4;
    B4 -- SQL --> C[PostgreSQL];
    C -- Returns Data --> B4;
    B4 -- Returns Data --> B2;
    B2 -- Returns JSON --> B1;
    B1 -- Renders HTML --> A;
    B -- Reads Secrets --> D;
```

## 2. Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Frontend** | **Next.js 14 (App Router) + React 18 + TypeScript** | The App Router with RSCs provides excellent performance and a modern developer experience. TypeScript ensures type safety across the entire stack, reducing bugs and improving maintainability. |
| **Styling** | **Tailwind CSS + shadcn/ui** | Tailwind CSS is a utility-first framework that enables rapid, custom UI development. `shadcn/ui` provides a set of beautifully designed, accessible, and unstyled components that can be easily customized, accelerating development while maintaining a high-quality look and feel. |
| **UI Charts** | **Recharts** | A composable charting library built on React components. It's easy to integrate, highly customizable, and works well with server-side rendering environments. |
| **API** | **Next.js Route Handlers** | The native solution for building APIs within Next.js. They are serverless, easy to write, and co-located with the frontend code, simplifying the architecture. They support modern JavaScript features like `async/await`. |
| **Database** | **PostgreSQL + Prisma ORM** | PostgreSQL is a powerful, reliable, and open-source relational database. Prisma ORM provides a best-in-class developer experience with full type safety, auto-completion, and declarative schema management, which perfectly complements the TypeScript stack. |
| **Auth** | **Auth.js (NextAuth.js v5)** | The industry standard for authentication in Next.js. It's highly configurable, secure by default (CSRF protection, JWT session cookies), and simplifies the implementation of various authentication strategies. |
| **Deployment** | **Docker + Google Cloud Run** | Docker provides environment consistency from local development to production. Cloud Run is a fully managed, serverless platform that automatically scales containers, offering a cost-effective and low-maintenance deployment solution. |

## 3. Project Structure

```
.
├── .env.example
├── .eslintrc.json
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── next.config.mjs
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
├── tsconfig.json
└── src/
    ├── app/
    │   ├── (auth)/
    │   │   └── login/
    │   │       └── page.tsx
    │   ├── (protected)/
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── api/
    │   │   ├── auth/
    │   │   │   └── [...nextauth]/
    │   │   │       └── route.ts
    │   │   ├── customers/
    │   │   │   └── top/
    │   │   │       └── route.ts
    │   │   ├── orders/
    │   │   │   └── recent/
    │   │   │       └── route.ts
    │   │   ├── products/
    │   │   │   └── low-stock/
    │   │   │       └── route.ts
    │   │   └── stats/
    │   │       ├── overview/
    │   │       │   └── route.ts
    │   │       └── sales-over-time/
    │   │           └── route.ts
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    │   ├── auth/
    │   │   └── login-form.tsx
    │   ├── dashboard/
    │   │   ├── low-stock-list.tsx
    │   │   ├── recent-orders-table.tsx
    │   │   ├── sales-chart.tsx
    │   │   ├── stats-cards.tsx
    │   │   └── top-customers-list.tsx
    │   ├── shared/
    │   │   ├── header.tsx
    │   │   ├── page-title.tsx
    │   │   └── sidebar.tsx
    │   └── ui/
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       └── table.tsx
    ├── lib/
    │   ├── auth.ts
    │   ├── db.ts
    │   ├── definitions.ts
    │   ├── formatters.ts
    │   └── utils.ts
    ├── middleware.ts
    └── prisma/
        ├── migrations/
        └── schema.prisma
```

## 4. Database Schema

File: `src/prisma/schema.prisma`

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  hashedPassword String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Customer {
  id          String   @id @default(cuid())
  name        String
  email       String   @unique
  phone       String?
  companyName String?
  address     String?
  createdAt   DateTime @default(now())
  orders      Order[]
}

model Product {
  id            String      @id @default(cuid())
  name          String
  sku           String      @unique
  description   String?
  price         Float       // Stored as a float, represents the current price
  stockQuantity Int
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  orderItems    OrderItem[]
}

model Order {
  id          String      @id @default(cuid())
  orderDate   DateTime    @default(now())
  status      OrderStatus @default(PENDING)
  totalAmount Float
  customerId  String
  customer    Customer    @relation(fields: [customerId], references: [id])
  items       OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model OrderItem {
  id                  String  @id @default(cuid())
  quantity            Int
  priceAtTimeOfOrder  Float   // Price of the product when the order was placed
  orderId             String
  order               Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId           String
  product             Product @relation(fields: [productId], references: [id])

  @@unique([orderId, productId])
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

## 5. API Design

All protected endpoints require a valid session cookie, which is handled by the middleware.

| Method | Path | Request (Query/Body) | Response (JSON) | Auth |
|--------|------|----------------------|-----------------|------|
| **POST** | `/api/auth/[...nextauth]` | Handled by Auth.js | Handled by Auth.js | Public |
| **GET** | `/api/stats/overview` | - | `{ "totalRevenue": number, "revenueChange": number, "monthOrders": number, "ordersChange": number, "newCustomers": number, "customersChange": number, "activeProducts": number }` | Required |
| **GET** | `/api/stats/sales-over-time` | `?period=7d` (or `30d`, `90d`, `1y`) | `{ "sales": [ { "date": "YYYY-MM-DD", "revenue": number } ] }` | Required |
| **GET** | `/api/orders/recent` | `?limit=5` | `[ { "id": string, "customerName": string, "date": string, "total": number, "status": "PENDING" \| ... } ]` | Required |
| **GET** | `/api/products/low-stock` | `?limit=5&threshold=10` | `[ { "id": string, "name": string, "sku": string, "stock": number } ]` | Required |
| **GET** | `/api/customers/top` | `?limit=5&period=30d` | `[ { "id": string, "name": string, "companyName": string, "totalSpent": number } ]` | Required |

## 6. Page & Component Architecture

### Pages

*   **Route:** `/login` (`src/app/(auth)/login/page.tsx`)
    *   **Purpose:** Display the login form for user authentication.
    *   **Components:** `LoginForm`
    *   **API Calls:** None directly. The form POSTs to `/api/auth/callback/credentials`.
    *   **User Interactions:** User enters email and password, clicks "Sign In".

*   **Route:** `/` (`src/app/(protected)/page.tsx`)
    *   **Purpose:** The main dashboard view. Displays all key business metrics at a glance. This page will be a Server Component that fetches initial data.
    *   **Components:** `PageTitle`, `StatsCards`, `SalesChart`, `RecentOrdersTable`, `LowStockList`, `TopCustomersList`.
    *   **API Calls (Server-side):** Fetches data from all API endpoints (`/api/stats/overview`, `/api/stats/sales-over-time`, etc.) to pass as initial props to the client components.
    *   **User Interactions:** View data, potentially change time ranges on charts.

### Reusable Components

*   **`Header`** (`src/components/shared/header.tsx`)
    *   **Props:** None
    *   **Purpose:** Displays the top navigation bar, including user profile/logout button.
    *   **Used In:** `(protected)/layout.tsx`

*   **`Sidebar`** (`src/components/shared/sidebar.tsx`)
    *   **Props:** None
    *   **Purpose:** Displays the main navigation links (e.g., Dashboard, Orders, Products). For the MVP, it will only have a link to the Dashboard.
    *   **Used In:** `(protected)/layout.tsx`

*   **`StatsCards`** (`src/components/dashboard/stats-cards.tsx`)
    *   **Props:** `data: { totalRevenue: number, revenueChange: number, ... }`
    *   **Purpose:** A group of 4 `Card` components displaying the main KPIs from the overview API.
    *   **Data Source:** `/api/stats/overview`

*   **`SalesChart`** (`src/components/dashboard/sales-chart.tsx`)
    *   **Props:** `initialData: { date: string, revenue: number }[]`
    *   **Purpose:** A line chart visualizing sales revenue over a selected period. Uses Recharts. It will be a Client Component to handle user interaction for changing the time period.
    *   **Data Source:** `/api/stats/sales-over-time`

*   **`RecentOrdersTable`** (`src/components/dashboard/recent-orders-table.tsx`)
    *   **Props:** `data: { id: string, customerName: string, ... }[]`
    *   **Purpose:** A `Table` component showing the 5 most recent orders.
    *   **Data Source:** `/api/orders/recent`

*   **`LowStockList`** (`src/components/dashboard/low-stock-list.tsx`)
    *   **Props:** `data: { id: string, name: string, stock: number }[]`
    *   **Purpose:** A list within a `Card` showing products with inventory below a certain threshold.
    *   **Data Source:** `/api/products/low-stock`

*   **`TopCustomersList`** (`src/components/dashboard/top-customers-list.tsx`)
    *   **Props:** `data: { id: string, name: string, totalSpent: number }[]`
    *   **Purpose:** A list within a `Card` showing the top customers by total spending.
    *   **Data Source:** `/api/customers/top`

*   **`LoginForm`** (`src/components/auth/login-form.tsx`)
    *   **Props:** None
    *   **Purpose:** A Client Component with state for email/password fields. Handles form submission logic.
    *   **Data Source:** N/A. Submits data to Auth.js.

## 7. Authentication & Authorization

*   **Authentication Flow:**
    1.  User navigates to `/login`.
    2.  User enters their email and password into the `LoginForm` component.
    3.  On submit, the form calls the `signIn` function from `next-auth/react`, specifying the 'credentials' provider.
    4.  Auth.js makes a POST request to `/api/auth/callback/credentials`.
    5.  The `authorize` function in the Auth.js configuration (`src/lib/auth.ts`) is executed.
    6.  Inside `authorize`, we find the user by email in the database and compare the provided password with the stored hash using `bcrypt`.
    7.  If credentials are valid, the user object is returned. Auth.js creates a session and sets a secure, HTTP-only JWT cookie.
    8.  The user is redirected to the dashboard (`/`).

*   **Session Management:** Handled automatically by Auth.js. The session is accessible on the server via `auth()` and on the client via the `useSession` hook or `SessionProvider`.

*   **Route Protection:**
    *   A `src/middleware.ts` file will be created.
    *   It will use the `auth` function from `src/lib/auth.ts` to check for a valid session.
    *   The middleware's `matcher` config will be set to `['/((?!api|_next/static|_next/image|favicon.ico|login).*)']`, protecting all routes except for the specified public assets and the login page.
    *   If no session exists, the middleware will redirect the user to `/login`.

*   **Authorization:** For the MVP, authorization is binary: you are either logged in or you are not. Any authenticated user can view the dashboard. The Prisma schema is ready for future expansion with a `Role` enum on the `User` model if role-based access control is needed.

## 8. Deployment Architecture

### Dockerfile

File: `Dockerfile`

```dockerfile
# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Set build-time env vars if needed (e.g., for telemetry)
# ARG NEXT_PUBLIC_...
# ENV NEXT_PUBLIC_...=$NEXT_PUBLIC_...

# Build the Next.js application
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy built application from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
```
*Note: This Dockerfile assumes `output: 'standalone'` is set in `next.config.mjs` for an optimized production build.*

### Docker Compose (for Local Development)

File: `docker-compose.yml`

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - db
    volumes:
      - .:/app # Mount local code for hot-reloading in dev
      - /app/node_modules
      - /app/.next

  db:
    image: postgres:15-alpine
    restart: always
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=wholesaledb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Google Cloud Run Configuration

1.  **Build & Push Image:** Build the Docker image and push it to Google Artifact Registry.
    ```bash
    gcloud builds submit --tag gcr.io/[PROJECT_ID]/wholesale-dashboard
    ```
2.  **Deploy Service:** Deploy the image to Cloud Run.
    ```bash
    gcloud run deploy wholesale-dashboard \
      --image gcr.io/[PROJECT_ID]/wholesale-dashboard \
      --platform managed \
      --region us-central1 \
      --allow-unauthenticated \
      --set-env-vars="NEXTAUTH_URL=https://your-service-url.a.run.app" \
      --add-cloudsql-instances [INSTANCE_CONNECTION_NAME] \
      --set-secrets="DATABASE_URL=DATABASE_URL:latest,NEXTAUTH_SECRET=NEXTAUTH_SECRET:latest"
    ```
3.  **Required Setup:**
    *   A Cloud SQL for PostgreSQL instance must be created.
    *   Secrets (`DATABASE_URL`, `NEXTAUTH_SECRET`) must be stored in Google Secret Manager.
    *   The Cloud Run service account needs permissions to access Cloud SQL and Secret Manager.

### Environment Variables

File: `.env.example`

```
# Prisma / Database
DATABASE_URL="postgresql://user:password@localhost:5432/wholesaledb?schema=public"

# NextAuth.js
# Generate a secret with: openssl rand -base64 32
NEXTAUTH_SECRET="your-super-secret-key-for-nextauth"
NEXTAUTH_URL="http://localhost:3000"
```

## 9. Security Considerations

*   **Input Validation:** All API Route Handlers that accept query parameters or request bodies will use `Zod` to validate input, preventing malformed data and potential injection attacks.
*   **Authentication:** Passwords will be hashed using `bcrypt` before being stored in the database. Auth.js will be used to manage secure, HTTP-only session cookies with CSRF protection enabled by default.
*   **Secrets Management:** All sensitive information (database connection strings, API keys, `NEXTAUTH_SECRET`) will be managed via environment variables, loaded from Google Secret Manager in production. They will never be hardcoded in the source code.
*   **CORS:** The default Next.js same-origin policy is sufficient for this monolithic architecture. No additional CORS configuration is needed unless the API needs to be exposed to other frontends.
*   **Rate Limiting:** For production, consider enabling rate limiting on the Cloud Armor security policy attached to the Cloud Run service, specifically for the `/api/auth/callback/credentials` endpoint to mitigate brute-force login attempts.
*   **SQL Injection:** Using Prisma ORM mitigates the risk of SQL injection, as it generates parameterized queries and escapes values automatically.
*   **XSS (Cross-Site Scripting):** React inherently protects against XSS by escaping content rendered in JSX. All third-party libraries will be vetted for security vulnerabilities.

## 10. Architecture Risks

*   **Monolith Complexity:** While simple for an MVP, as the application grows, the monolithic structure could become complex. If the API layer's logic or load becomes significant, the architecture supports refactoring the API into a separate microservice, with the Next.js app becoming a pure frontend consumer.
*   **Database Performance:** The dashboard relies on aggregate queries which can become slow as data volume increases.
    *   **Mitigation:**
        1.  Ensure all foreign keys and frequently queried columns (e.g., `Order.orderDate`) are indexed.
        2.  Implement caching for expensive queries using Next.js's built-in `unstable_cache` or a dedicated Redis instance.
        3.  For very large datasets, create materialized views in PostgreSQL for pre-aggregated reporting data.
*   **Cold Starts:** As a serverless platform, Cloud Run can experience "cold starts" if the service has no traffic.
    *   **Mitigation:** For a consistently responsive experience, configure a `min-instances` of `1`. This keeps one container warm at all times, albeit at a slightly higher cost. The multi-stage Dockerfile is designed to minimize image size, which also helps reduce cold start times.