Of course. As a principal software architect, here is the detailed technical architecture document for the Clarity Finance App, based on the provided product requirements and design tasks.

---

## **Technical Architecture Document: Clarity Finance App (MVP)**

| | |
| :--- | :--- |
| **Document Title:** | Technical Architecture: Clarity Finance App MVP |
| **Version:** | 1.0 |
| **Status:** | Final |
| **Author:** | Principal Software Architect |
| **Date:** | October 26, 2023 |

### **1. Architecture Overview**

This document outlines the technical architecture for the **Clarity Finance App**, a mobile application focused on manual budget tracking. The system is designed around a classic and robust **Client-Server architecture**.

The core architectural principles are:
*   **Separation of Concerns:** The frontend (Client) is responsible for user interface and experience, while the backend (Server) handles all business logic, data processing, and persistence. This separation allows for independent development, deployment, and scaling.
*   **Stateless Backend:** The API server will be stateless. Each incoming request will contain all the necessary information (via the JWT and request body) to be processed. This is critical for horizontal scalability and resilience.
*   **API-Driven Communication:** The client and server communicate exclusively through a secure, versioned RESTful API over HTTPS. This ensures a well-defined contract and allows for future clients (e.g., a web app) to be developed against the same backend.
*   **Security by Design:** Security is a primary consideration, with measures implemented at the application, infrastructure, and data layers. Every authenticated request will be authorized to ensure users can only access their own data.

### **2. Component Diagram (Text)**

The following diagram illustrates the high-level system components and the flow of information.

```ascii
+---------------------------------+
|      User (on Mobile Device)    |
+---------------------------------+
               |
               v
+---------------------------------+
|   Mobile Client (React Native)  |
| - UI/UX Components              |
| - State Management              |
| - Secure JWT Storage            |
+---------------------------------+
               |
               | HTTPS (REST API Calls)
               | Authorization: Bearer <JWT>
               v
+---------------------------------+
|    API Gateway (e.g., GCP)      |
| - Routing, Rate Limiting, CORS  |
+---------------------------------+
               |
               v
+---------------------------------+
|   Backend API (Node.js/Express) |
| - Authentication Middleware     |
| - Business Logic (Controllers)  |
| - Data Access Layer (Services)  |
+---------------------------------+
               |
               | SQL Queries
               v
+---------------------------------+
|  Database (PostgreSQL)          |
| - Managed Service (Cloud SQL)   |
| - Tables: Users, Transactions...|
| - Indexes for Performance       |
+---------------------------------+
```

### **3. Technology Stack**

The technology stack is chosen to optimize for developer velocity, cross-platform reach, and scalable performance for the MVP.

*   **Frontend (Mobile Client):** **React Native**
    *   **Justification:** Enables the development of a single codebase that compiles to both iOS and Android native applications. This significantly reduces development time and cost. The large community, extensive library ecosystem, and strong backing from Meta make it a reliable choice for building high-quality user interfaces.

*   **Backend (REST API):** **Node.js with Express.js**
    *   **Justification:** Node.js's non-blocking, event-driven architecture is exceptionally well-suited for I/O-bound applications like a REST API that primarily interacts with a database. Using JavaScript/TypeScript on the backend creates language synergy with the React Native frontend, allowing for potential code sharing and easier developer context switching. Express.js is a minimal and flexible framework that provides a robust set of features for building the API.

*   **Database:** **PostgreSQL**
    *   **Justification:** As a powerful, open-source object-relational database system, PostgreSQL offers proven reliability, data integrity, and a rich feature set. Its strong support for relational constraints (foreign keys) is essential for maintaining the integrity of our financial data model. It is highly scalable and supported by all major cloud providers as a managed service.

### **4. Service Breakdown**

For the MVP, the backend will be implemented as a single, monolithic service. This approach prioritizes development speed and simplifies deployment.

*   **Service Name:** `clarity-api`
*   **Responsibilities:**
    *   User registration and authentication (JWT issuance).
    *   CRUD (Create, Read, Update, Delete) operations for all user-owned resources: Transactions, Categories, and Budgets.
    *   Data aggregation and calculation for the dashboard summary.
    *   Enforcing all business rules and authorization logic (e.g., a user can only access their own data).
*   **Inputs:** JSON payloads received via HTTPS requests from the client.
*   **Outputs:** JSON responses sent to the client.
*   **Dependencies:**
    *   **Primary:** PostgreSQL Database.
    *   **Infrastructure:** Secret Manager for credentials.
*   **Scalability:** The service is designed to be stateless. It can be scaled horizontally by running multiple instances behind a load balancer (a feature handled automatically by Cloud Run).

### **5. Data Architecture**

#### **Database Schema (PostgreSQL)**

The following SQL statements define the core tables for the application. We use `UUID` for primary keys to prevent enumeration attacks and `TIMESTAMP WITH TIME ZONE` for all timestamps. Indexes are created on foreign keys and frequently queried columns to ensure fast lookups.

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table: Stores user account information
CREATE TABLE "Users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "hashed_password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Categories Table: Stores user-defined spending categories
CREATE TABLE "Categories" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    -- A user cannot have two categories with the same name
    UNIQUE("user_id", "name")
);
CREATE INDEX idx_categories_user_id ON "Categories"("user_id");

-- Transactions Table: Stores all income and expense records
CREATE TYPE transaction_type AS ENUM ('income', 'expense');

CREATE TABLE "Transactions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
    "category_id" UUID REFERENCES "Categories"("id") ON DELETE SET NULL, -- If a category is deleted, transaction becomes uncategorized
    "amount" DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    "type" transaction_type NOT NULL,
    "date" DATE NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_transactions_user_id ON "Transactions"("user_id");
CREATE INDEX idx_transactions_category_id ON "Transactions"("category_id");
CREATE INDEX idx_transactions_date ON "Transactions"("date"); -- For date-based filtering

-- Budgets Table: Stores monthly budget limits for categories
CREATE TABLE "Budgets" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
    "category_id" UUID NOT NULL REFERENCES "Categories"("id") ON DELETE CASCADE, -- If a category is deleted, its budget is also deleted
    "amount" DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    "month" INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    -- A user can only have one budget per category per month/year
    UNIQUE("user_id", "category_id", "month", "year")
);
CREATE INDEX idx_budgets_user_id ON "Budgets"("user_id");
CREATE INDEX idx_budgets_category_id ON "Budgets"("category_id");
```

#### **Caching Strategy**

For the MVP, caching will be minimal. However, to improve performance and reduce database load for read-heavy operations, a caching layer (e.g., **Redis**) will be considered post-MVP. The primary candidate for caching is the `GET /api/dashboard/summary` endpoint. The aggregated summary data for a user for the current month can be cached with a short TTL (Time-To-Live) of 5-10 minutes. The cache would be invalidated whenever a user creates, updates, or deletes a transaction or budget for that month.

### **6. API Design**

The API follows RESTful principles. All endpoints are prefixed with `/api`. Authentication is handled via JWT.

#### **Authentication Strategy: JSON Web Tokens (JWT)**

1.  **Login:** A user submits their `email` and `password` to `POST /api/auth/login`.
2.  **Token Issuance:** The server validates the credentials. If successful, it generates a signed JWT containing a payload with the `userId` and an expiration timestamp (`exp`, e.g., 30 days).
3.  **Client Storage:** The mobile client receives the token and stores it securely in the device's Keychain (iOS) or Keystore (Android).
4.  **Authenticated Requests:** For all subsequent requests to protected endpoints, the client includes the JWT in the HTTP `Authorization` header as a Bearer token: `Authorization: Bearer <the_jwt>`.
5.  **Server Verification:** A middleware on the backend intercepts every request to a protected route. It verifies the token's signature and checks that it has not expired. If valid, it extracts the `userId` from the payload and attaches it to the request object (e.g., `req.user`) for use in downstream business logic.

#### **Standard Error Response**

Failed requests will return a standardized JSON error object:
```json
{
  "error": "string", // A machine-readable error code, e.g., "ValidationError"
  "message": "string" // A human-readable description of the error
}
```

#### **API Endpoint Definitions**

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| **User Registration** | `POST /api/users/register` | Public | Creates a new user account. |
| **Request Body:** `{ "email": "alex@example.com", "password": "securepassword123" }` |
| **Success (201 Created):** `{ "id": "uuid-...", "email": "alex@example.com", "createdAt": "..." }` |
| --- | --- | --- | --- |
| **User Login** | `POST /api/auth/login` | Public | Authenticates a user and returns a JWT. |
| **Request Body:** `{ "email": "alex@example.com", "password": "securepassword123" }` |
| **Success (200 OK):** `{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }` |
| --- | --- | --- | --- |
| **Create Transaction** | `POST /api/transactions` | JWT | Adds a new income or expense transaction. |
| **Request Body:** `{ "amount": 45.50, "type": "expense", "date": "2023-10-26", "categoryId": "uuid-...", "description": "Weekly groceries" }` |
| **Success (201 Created):** `{ "id": "uuid-...", "amount": "45.50", "type": "expense", ... }` |
| --- | --- | --- | --- |
| **Get Transactions** | `GET /api/transactions` | JWT | Retrieves a list of the user's transactions. |
| **Query Params:** `?categoryId=<uuid>&month=<int>&year=<int>&type=<income|expense>` |
| **Success (200 OK):** `[ { "id": "...", "amount": "45.50", ... }, { ... } ]` |
| --- | --- | --- | --- |
| **Create Category** | `POST /api/categories` | JWT | Creates a new spending category. |
| **Request Body:** `{ "name": "Utilities" }` |
| **Success (201 Created):** `{ "id": "uuid-...", "userId": "uuid-...", "name": "Utilities" }` |
| --- | --- | --- | --- |
| **Get Categories** | `GET /api/categories` | JWT | Retrieves all of the user's categories. |
| **Request Body:** N/A |
| **Success (200 OK):** `[ { "id": "...", "name": "Groceries" }, { "id": "...", "name": "Utilities" } ]` |
| --- | --- | --- | --- |
| **Create/Update Budget** | `POST /api/budgets` | JWT | Sets or updates a budget for a category for a specific month. |
| **Request Body:** `{ "categoryId": "uuid-...", "amount": 500.00, "month": 11, "year": 2023 }` |
| **Success (201 Created):** `{ "id": "uuid-...", "categoryId": "...", "amount": "500.00", ... }` |
| --- | --- | --- | --- |
| **Get Budgets** | `GET /api/budgets` | JWT | Retrieves the user's budgets for a given period. |
| **Query Params:** `?month=11&year=2023` (defaults to current month/year if not provided) |
| **Success (200 OK):** `[ { "id": "...", "categoryId": "...", "categoryName": "Groceries", "amount": "500.00", ... } ]` |
| --- | --- | --- | --- |
| **Get Dashboard Summary** | `GET /api/dashboard/summary` | JWT | Retrieves aggregated data for the dashboard. |
| **Query Params:** `?month=11&year=2023` (defaults to current month/year if not provided) |
| **Success (200 OK):** `{ "totalIncome": "3500.00", "totalExpenses": "1250.75", "netIncome": "2249.25", "spendingByCategory": [ { "categoryId": "...", "categoryName": "Groceries", "total": "450.25" } ], "budgetProgress": [ { "categoryId": "...", "categoryName": "Groceries", "spent": "450.25", "budget": "500.00" } ] }` |

### **7. UI/UX Structure**

The mobile application will be structured around the following key screens:

*   **Authentication Flow (Unauthenticated)**
    *   **Screen:** Login / Register
    *   **Purpose:** Allow users to sign in or create a new account.
    *   **Components:** Email/Password input fields, "Login" button, "Sign Up" toggle/link.
    *   **Actions:** Submit credentials for login or registration.

*   **Main App (Authenticated)**
    *   **Screen:** Dashboard (Home)
    *   **Purpose:** Provide an at-a-glance summary of the user's financial health for the current month.
    *   **Components:**
        *   Main Navigation (Tabs: Dashboard, Transactions, Settings).
        *   Summary Cards (`Total Income`, `Total Expenses`, `Net Income`).
        *   Pie Chart (`Spending by Category`).
        *   List of Progress Bars (`Budget vs. Spending`).
        *   Floating Action Button (FAB) to add a new transaction.
    *   **Actions:** Navigate to other screens, initiate adding a transaction.

    *   **Screen:** Transaction History
    *   **Purpose:** Allow users to view, filter, and manage all their past transactions.
    *   **Components:**
        *   Filter controls (by category, type, date range).
        *   Chronological list of transaction items (showing amount, category, date).
    *   **Actions:** Filter the list, tap a transaction to view details, swipe to delete.

    *   **Screen:** Add/Edit Transaction
    *   **Purpose:** A modal or full-screen form for creating or modifying a transaction.
    *   **Components:** Form fields (Amount, Type toggle, Date picker, Category selector, Description).
    *   **Actions:** Save or cancel the transaction.

    *   **Screen:** Settings / Management
    *   **Purpose:** A central place for managing categories, budgets, and user profile.
    *   **Components:**
        *   List items for "Manage Categories" and "Manage Budgets".
        *   "Logout" button.
    *   **Actions:** Navigate to the category or budget management sub-screens.

### **8. Infrastructure & Deployment**

We will use a serverless-first approach on **Google Cloud Platform (GCP)** to minimize operational overhead and scale cost-effectively.

*   **Compute:** **Cloud Run** will host the containerized Node.js API. It automatically scales the number of container instances based on traffic, including scaling down to zero.
*   **Database:** **Cloud SQL for PostgreSQL** will be used as the managed database. It handles backups, replication, patches, and scaling, allowing the team to focus on application development.
*   **Container Registry:** **Google Artifact Registry** will store the Docker images of the `clarity-api` service.
*   **API Gateway:** **Google Cloud API Gateway** will be placed in front of Cloud Run to provide a stable endpoint, handle CORS policies, and implement rate limiting.
*   **Continuous Integration & Deployment (CI/CD):** A **GitHub Actions** workflow will be configured:
    1.  **On push to `main` branch:**
    2.  **Test:** Run linting, unit tests, and integration tests.
    3.  **Build:** Build a new Docker image.
    4.  **Push:** Tag the image and push it to Artifact Registry.
    5.  **Deploy:** Deploy the new image as a new revision to the Cloud Run service.

### **9. Security Considerations**

Security is paramount and is addressed at multiple layers.

*   **Authentication & Authorization:**
    *   JWTs are used for stateless authentication. The secret key for signing JWTs will be stored in **Google Secret Manager** and injected into the Cloud Run environment at runtime.
    *   **Critical:** Every authenticated API endpoint that accesses or modifies a resource (`Transaction`, `Category`, `Budget`) **must** include a `WHERE user_id = :currentUserId` clause in its database query. The `currentUserId` is extracted from the validated JWT. This prevents any user from accessing another user's data.

*   **Data Security:**
    *   **In Transit:** All communication between the client, API Gateway, and Cloud Run will be encrypted via **HTTPS/TLS**.
    *   **At Rest:** Data in the Cloud SQL instance is encrypted at rest by default.
    *   **Password Hashing:** User passwords will be hashed using **bcrypt** with a cost factor of at least 12.

*   **Infrastructure Security:**
    *   **Principle of Least Privilege:** The Cloud Run service will operate under a dedicated IAM service account that has permissions *only* to connect to the Cloud SQL instance and read from Secret Manager. It will not have any other permissions.
    *   **Input Validation:** The backend will use a validation library (e.g., `joi`) to strictly validate and sanitize all incoming data from API requests to prevent SQL Injection, XSS, and other data-tampering attacks.

### **10. Architecture Risks & Mitigation**

*   **Risk:** **Data Tenancy Flaw.** A bug in authorization logic could expose one user's data to another.
    *   **Mitigation:** This is the highest-priority risk. Mitigation includes mandatory code reviews for all data-accessing code, a standardized data access layer that enforces the `user_id` check, and dedicated E2E tests that attempt to cross-access data and assert failure.

*   **Risk:** **Performance Bottleneck at the Database.** As the `Transactions` table grows, complex dashboard queries could become slow.
    *   **Mitigation:** Proper indexing is the first line of defense. For post-MVP, we will explore using read replicas for read-heavy workloads and materializing aggregated views for common dashboard queries.

*   **Risk:** **Vendor Lock-in.** Using GCP-managed services (Cloud Run, Cloud SQL) creates a dependency on the Google Cloud ecosystem.
    *   **Mitigation:** This is an acceptable trade-off for the MVP, as the benefits of reduced operational overhead far outweigh the risk. The use of standard technologies (Docker, PostgreSQL, Node.js) ensures that the application is portable to other cloud providers or on-premise infrastructure if necessary in the future, albeit with engineering effort.

*   **Risk:** **Monolith Complexity.** The single API service may become difficult to maintain and deploy as more features are added post-MVP.
    *   **Mitigation:** The initial monolith design is intentional for speed. The architecture is modular internally (services, controllers, data access layers), which will facilitate a future migration to microservices if and when the complexity warrants it. For example, a future "Reporting Service" or "AI Prediction Service" could be built and deployed independently.