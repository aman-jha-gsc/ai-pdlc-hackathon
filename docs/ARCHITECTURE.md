Of course. As the Principal Software Architect, I have reviewed the Product Requirements Document (PRD) for Clarity Finance. Based on the requirements, I have designed a technical architecture that prioritizes security, speed of delivery for the MVP, and future scalability.

Here is the detailed Technical Architecture Document.

***

# Technical Architecture Document: Clarity Finance MVP

| **Document Title** | Clarity Finance - MVP Technical Architecture |
| :--- | :--- |
| **Version** | 1.0 |
| **Status** | Approved for Implementation |
| **Author** | Principal Software Architect |
| **Last Updated** | [Current Date] |

## 1. Architecture Overview

The system will be implemented as a **3-Tier Monolithic Web Application**. This architecture is chosen for the MVP to accelerate development, simplify deployment, and reduce operational overhead. It consists of three distinct layers:

1.  **Client Tier (Frontend):** A modern Single-Page Application (SPA) running in the user's browser, responsible for all user interface rendering and interaction.
2.  **Server Tier (Backend):** A single, deployable Node.js application that serves the API. It contains all business logic, including user authentication, data processing, and communication with third-party services.
3.  **Data Tier (Database):** A relational PostgreSQL database that persists all application data.

While monolithic, the backend application will be designed with strong internal modularity. Business domains (Authentication, Plaid Integration, Budgeting) will be separated into distinct service modules within the codebase. This approach ensures that if the application scales successfully, these modules can be extracted into independent microservices with minimal refactoring.

The core user flow is as follows: The user interacts with the React client. The client makes authenticated API calls over HTTPS to the Node.js backend. The backend processes these requests, interacting with the PostgreSQL database for data persistence and the external Plaid API for bank aggregation services.

## 2. Component Diagram (Text)

This diagram illustrates the high-level components and their interactions.

```
+---------------------------------------------------------------------------------+
|   User (Browser)                                                                |
+---------------------------------------------------------------------------------+
      |
      | HTTPS (REST API Calls)
      v
+---------------------------------------------------------------------------------+
|   Server Tier: Node.js Monolith (Hosted on Cloud Run)                           |
|                                                                                 |
|   +--------------------------+      +----------------------------------------+  |
|   |   API Gateway / Router   |----->|         Authentication Service         |  |
|   |   (Express.js)           |      | (JWT, bcrypt)                          |  |
|   +--------------------------+      +----------------------------------------+  |
|               |                                                                 |
|               |                                                                 |
|   +--------------------------+      +----------------------------------------+  |
|   |    Budgeting Engine      |<---->|       Transaction Processor            |  |
|   | (Data Aggregation Logic) |      | (Background Job via Cloud Scheduler)   |  |
|   +--------------------------+      +----------------------------------------+  |
|               |                                      |                          |
|               |                                      v                          |
|   +--------------------------------------------------------------------------+  |
|   |                       Bank Aggregator Service (Plaid Wrapper)            |  |
|   +--------------------------------------------------------------------------+  |
|               |                                      |                          |
+---------------|--------------------------------------|--------------------------+
                |                                      |
                | (SQL via Prisma ORM)                   | (HTTPS API Calls)
                v                                      v
+--------------------------+             +----------------------------------------+
|   Data Tier:             |             |   Third-Party Service:                 |
|   PostgreSQL Database    |             |   Plaid API                            |
|   (Cloud SQL)            |             |                                        |
+--------------------------+             +----------------------------------------+

```

## 3. Technology Stack

| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend** | **React 18+ with Vite** | Provides a fast development experience and a robust component model. Vite offers near-instant server start and Hot Module Replacement (HMR). |
| | **TypeScript** | Enforces type safety, reducing runtime errors and improving developer productivity and code maintainability. |
| | **Tailwind CSS** | A utility-first CSS framework that allows for rapid UI development without leaving the HTML. |
| **Backend** | **Node.js (LTS)** | The non-blocking, event-driven architecture is highly performant for I/O-bound operations like API requests and database queries. |
| | **Express.js** | A minimal and flexible Node.js framework that provides a robust set of features for building our REST API. |
| | **TypeScript** | Ensures code quality and consistency with the frontend stack. |
| **Database** | **PostgreSQL 15+** | A powerful, open-source object-relational database system known for its reliability, feature robustness, and data integrity, which is critical for a financial application. |
| **ORM** | **Prisma** | A next-generation, type-safe ORM for Node.js and TypeScript. It simplifies database access, migrations, and ensures that our queries are type-safe from the database to the client. |

## 4. Service Breakdown

The monolithic backend will be composed of the following logical service modules:

#### Authentication Service
*   **Responsibility:** Manages user registration, login, and session management via JWTs.
*   **Inputs:** User credentials (email, password).
*   **Outputs:** A signed JSON Web Token (JWT) upon successful login.
*   **Dependencies:** `Users` table in the database.
*   **Implementation Details:**
    *   Passwords will be hashed using `bcrypt` with a salt round of at least 12.
    *   JWTs will be signed using a secret key (stored in Secret Manager).
    *   Tokens will contain `userId` and have a short expiry (e.g., 24 hours) for security.
    *   A middleware will be implemented in Express to validate the JWT on every protected API request.

#### Bank Aggregator Service (Plaid Wrapper)
*   **Responsibility:** To abstract all interactions with the Plaid API, acting as an anti-corruption layer.
*   **Inputs:** `public_token` from the frontend, `user_id`.
*   **Outputs:** Transaction data, account metadata.
*   **Dependencies:** External Plaid API, `BankAccounts` table.
*   **Implementation Details:**
    *   Implements methods like `exchangePublicToken`, `fetchTransactions`, `getAccountInfo`.
    *   Handles the secure storage of the `access_token`. Before saving to the `BankAccounts` table, the token will be encrypted using AES-256-GCM with an encryption key stored in Secret Manager.
    *   Includes robust error handling for Plaid API failures (e.g., rate limits, invalid tokens, item errors).

#### Transaction Processor (Background Job)
*   **Responsibility:** Periodically fetches new transactions for all connected user accounts.
*   **Inputs:** A list of `BankAccounts` with their encrypted `plaid_access_token`.
*   **Outputs:** New records inserted into the `Transactions` table.
*   **Dependencies:** `Bank Aggregator Service`, `BankAccounts` table, `Transactions` table.
*   **Implementation Details:**
    *   This will be a separate, triggerable service (e.g., a dedicated Cloud Run instance or Cloud Function).
    *   A Cloud Scheduler job will trigger this service on a fixed schedule (e.g., every 24 hours at midnight UTC).
    *   The job will fetch all `BankAccounts`, decrypt the `access_token` for each, call the `Bank Aggregator Service` to get new transactions since the `last_successful_update`, and insert them into the database.
    *   It will also perform initial, rule-based categorization based on merchant names.

#### Budgeting Engine
*   **Responsibility:** Provides the core logic for calculating spending against budget limits.
*   **Inputs:** `user_id`, `month`, `year`.
*   **Outputs:** A JSON object containing an array of budget statuses (e.g., `{ categoryId, categoryName, budgetedAmount, spentAmount, remainingAmount }`).
*   **Dependencies:** `Budgets`, `Transactions`, `Categories` tables.
*   **Implementation Details:**
    *   This is not a long-running process but a set of functions used by the API.
    *   The primary logic will be an efficient SQL query (generated by Prisma) that joins `Transactions` and `Budgets` on `category_id` and `user_id`, filtering by the current month, and using `SUM()` and `GROUP BY` to aggregate spending per category.

## 5. Data Architecture

#### Database Schema (PostgreSQL)
Primary keys are `id` (UUID), and foreign keys follow the `entityId` convention.

```sql
-- Users table to store authentication information
CREATE TABLE "Users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "firstName" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- BankAccounts linked by a user, storing Plaid item metadata
-- The 'accessToken' MUST be encrypted at the application level before insertion.
CREATE TABLE "BankAccounts" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
    "plaidItemId" TEXT NOT NULL UNIQUE, -- Plaid's Item ID
    "accessToken" TEXT NOT NULL, -- Encrypted Plaid access_token
    "institutionName" TEXT NOT NULL,
    "lastSuccessfulUpdate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Categories for transactions. Can be default (userId is NULL) or user-defined.
CREATE TABLE "Categories" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID REFERENCES "Users"("id") ON DELETE CASCADE, -- NULL for default categories
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    UNIQUE("userId", "name") -- A user cannot have two categories with the same name
);

-- Individual transactions fetched from Plaid
CREATE TABLE "Transactions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "bankAccountId" UUID NOT NULL REFERENCES "BankAccounts"("id") ON DELETE CASCADE,
    "categoryId" UUID REFERENCES "Categories"("id") ON DELETE SET NULL,
    "plaidTransactionId" TEXT NOT NULL UNIQUE,
    "merchantName" TEXT,
    "amount" DECIMAL(10, 2) NOT NULL, -- Positive for income, negative for expenses
    "date" DATE NOT NULL,
    "isPending" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- User-defined monthly budgets for specific categories
CREATE TABLE "Budgets" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
    "categoryId" UUID NOT NULL REFERENCES "Categories"("id") ON DELETE CASCADE,
    "amount" DECIMAL(10, 2) NOT NULL,
    "month" INTEGER NOT NULL, -- e.g., 1 for January, 12 for December
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    UNIQUE("userId", "categoryId", "month", "year") -- Only one budget per category per month
);
```

#### Data Flow & Caching
*   **Data Flow:** Raw transaction data flows from Plaid -> Backend -> PostgreSQL. Aggregated budget and transaction data flows from PostgreSQL -> Backend API -> Frontend Client.
*   **Caching Strategy:** The results of the Budgeting Engine (which require expensive `SUM` queries) are ideal candidates for caching. We will implement a simple in-memory cache (`node-cache`) on the `/api/budgets` endpoint with a short TTL (e.g., 5 minutes) to reduce database load during frequent dashboard refreshes. For a larger scale, this can be replaced with Redis.

## 6. API Design

All endpoints will be prefixed with `/api`.

#### Authentication
*   `POST /auth/register`: Creates a new user. Body: `{ firstName, email, password }`.
*   `POST /auth/login`: Authenticates a user. Body: `{ email, password }`. Returns `{ token }`.

#### Plaid Integration
*   `POST /plaid/create_link_token`: Creates and returns a `link_token` for the frontend.
*   `POST /plaid/exchange_public_token`: Exchanges a `public_token` for an `access_token`. Body: `{ publicToken, institutionName }`.

#### Core Resources
*   `GET /transactions?month=YYYY-MM`: Get all transactions for the authenticated user for a given month.
*   `PUT /transactions/:id`: Update a transaction. Body: `{ categoryId }`.
*   `GET /categories`: Get all default and user-specific categories.
*   `POST /categories`: Create a new custom category. Body: `{ name }`.
*   `GET /budgets?month=YYYY-MM`: Get all budgets and their current spending status for the month.
*   `POST /budgets`: Create a new budget. Body: `{ categoryId, amount, month, year }`.
*   `PUT /budgets/:id`: Update a budget's amount. Body: `{ amount }`.
*   `DELETE /budgets/:id`: Delete a budget.

#### Authentication & Error Handling
*   **Authentication:** All endpoints except `/auth/*` will be protected. Clients must include an `Authorization: Bearer <JWT>` header. A global middleware will verify the token and attach the `userId` to the request object.
*   **Error Handling:** The API will use standard HTTP status codes. Errors will be returned in a consistent JSON format:
    ```json
    {
      "error": {
        "message": "A human-readable error message.",
        "code": "ERROR_CODE_SLUG" // e.g., "INVALID_INPUT", "UNAUTHENTICATED"
      }
    }
    ```

## 7. UI/UX Structure

| Screen Name | Purpose | Key Components | User Actions |
| :--- | :--- | :--- | :--- |
| **Login / Register** | User authentication. | Forms, input fields, buttons. | Log in, sign up for a new account. |
| **Dashboard** | At-a-glance view of financial health for the current month. | Navbar, Budget progress cards (with progress bars), "Connect Bank" prompt. | View budget progress, navigate to other pages. |
| **Transactions** | View, search, and categorize all transactions. | Navbar, Transaction list/table, filters (by month), search bar. | Change a transaction's category, view transaction details. |
| **Budgets & Categories** | Manage monthly budgets and spending categories. | Navbar, Budget list (CRUD), Category list (CRUD), forms. | Create/edit/delete budgets, create/edit/delete custom categories. |
| **Settings** | Manage user profile and connected bank accounts. | Navbar, "Connected Accounts" list, "Log Out" button. | Connect a new bank account, remove a connected account, log out. |

## 8. Infrastructure & Deployment

*   **Cloud Provider:** Google Cloud Platform (GCP).
*   **Web Server:** **Cloud Run** will host the containerized Node.js monolith. It provides auto-scaling (including to zero) and a simple deployment model.
*   **Database:** **Cloud SQL for PostgreSQL** will be used as the managed database, simplifying backups, maintenance, and scaling.
*   **Background Jobs:** **Cloud Scheduler** will send a message to a dedicated **Cloud Run** service (configured for background processing) to trigger the `Transaction Processor` daily.
*   **Secrets:** **Secret Manager** will be the single source of truth for all secrets (Plaid keys, database password, JWT secret, application-level encryption key).
*   **CI/CD Pipeline (via GitHub Actions):**
    1.  **On Push to `main`:** Trigger workflow.
    2.  **Install & Test:** `npm install`, run linting, unit tests (`jest`), and integration tests.
    3.  **Build & Push Image:** Build a Docker image of the Node.js application and push it to **Google Artifact Registry**.
    4.  **Deploy:** Use the `gcloud` CLI to deploy the new image to the Cloud Run service.

## 9. Security Considerations

Security is paramount for a financial application.

*   **IAM & Least Privilege:** The Cloud Run service account will be granted only the necessary IAM roles: `Cloud SQL Client` (to connect to the database) and `Secret Manager Secret Accessor` (to read secrets). No other permissions will be granted.
*   **Secrets Management:** Secrets will **never** be stored in source code. They will be injected into the Cloud Run environment at runtime from Secret Manager.
*   **Data Encryption:**
    *   **In Transit:** TLS 1.2+ will be enforced on the Cloud Run load balancer for all client-server communication.
    *   **At Rest (Database):** Cloud SQL's default at-rest encryption will be enabled.
    *   **At Rest (Application-Level):** The `plaid_access_token` will be encrypted using `crypto` (AES-256-GCM) in the Node.js application before being stored in the database. The encryption key will be stored in Secret Manager.
*   **API Security:**
    *   All API inputs will be validated using a schema validation library like `zod` to prevent injection and malformed data errors.
    *   The JWT authentication middleware will protect all sensitive endpoints.
    *   Standard security headers (e.g., via `helmet` for Express) will be applied to mitigate common vulnerabilities like XSS and clickjacking.

## 10. Architecture Risks

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Monolith Becomes Unwieldy** | Medium | The application may become difficult to maintain and deploy as more features are added. | Maintain strict modularity within the codebase from day one. The logical service boundaries defined in Section 4 will serve as blueprints for future extraction into microservices if necessary. |
| **Plaid API Dependency** | High | The application's core functionality is entirely dependent on Plaid's availability, data quality, and pricing. | The `Bank Aggregator Service` acts as an anti-corruption layer, isolating all Plaid-specific logic. This makes it easier to adapt to Plaid API changes or even swap it for an alternative aggregator in the future. |
| **Background Job Performance** | Medium | A single-threaded, scheduled job may not scale to process transactions for tens of thousands of users in a timely manner. | For the MVP, this is acceptable. Post-MVP, we will migrate this process to a more robust, scalable pattern using a message queue like **Google Pub/Sub** and parallel processing with multiple **Cloud Functions** or Cloud Run instances. |
| **Data Privacy & User Trust** | High | Users are sensitive about connecting financial accounts. A security incident would be catastrophic. | Adhere strictly to the security measures outlined in Section 9. Be transparent with users via a clear Privacy Policy. Never store or request bank credentials directly. The application-level encryption of Plaid tokens provides a critical extra layer of defense. |