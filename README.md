# NestJS Auth & Product API Demo

This is a simple demo project built with NestJS demonstrating user authentication (Signup/Login via OTP) using JWT and basic CRUD operations for Products, backed by MongoDB.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or higher recommended)
-   npm or yarn package manager
-   [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
-   [NestJS CLI](https://docs.nestjs.com/cli/overview) installed globally (`npm install -g @nestjs/cli`)

## Setup

1.  **Clone the repository (if applicable) or ensure you have the project files.**
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```
3.  **Configure Environment Variables:**
    *   Create a `.env` file in the project root.
    *   Add your MongoDB connection string and JWT settings:
        ```.env
        # Replace with your actual MongoDB connection string
        MONGO_URI=mongodb+srv://<username>:<password>@<your-cluster-url>/<database-name>?retryWrites=true&w=majority
        # Or for local MongoDB: MONGO_URI=mongodb://localhost:27017/nest_auth_demo

        # Replace with a strong, random secret for JWT signing
        JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY_GOES_HERE

        # Set JWT expiration time (e.g., 1h, 7d, 30m)
        JWT_EXPIRATION_TIME=1h
        ```
    *   **Important:** Replace placeholder values with your actual credentials and a secure `JWT_SECRET`. Do *not* commit your `.env` file to version control (ensure it's in `.gitignore`).

## Running the Application

```bash
# Development mode with watch (rebuilds on file changes)
npm run start:dev

# Production mode
npm run build
npm run start:prod