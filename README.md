# Nest Boilerplate

**Nest Boilerplate** is a base backend built with **NestJS**, ready to kickstart projects with **Google OAuth** authentication and **JWT**. It is designed to enable rapid development of robust and secure APIs, with a modular structure and MongoDB integration.

## Main Features

- Google OAuth authentication
- JWT with `sessionVersion` for global logout across all devices
- Basic user CRUD
- MongoDB integration via Docker

---

## Prerequisites

Before starting, make sure you have the following installed:

- **Node.js** (v20+ recommended)
- **npm** or **yarn**
- **Docker Desktop** (to run MongoDB as a container)
- **Git** (optional, if cloning the repository)

---

## Installation

1. Clone the repository:

```bash
git clone <REPOSITORY_URL>
cd <REPOSITORY_NAME>
```

2. Rename the app (Nest Boilerplate) in package.json and internal references for your new project.

3. Install dependencies:

```bash
npm install
```

or

```bash
yarn install
```

---

## Docker and MongoDB Setup

The project uses MongoDB in a Docker container. A ready-to-use docker-compose.yml file is provided.

1. Start the container:

```bash
docker-compose up -d
```

2. Check that MongoDB is running:

```bash
docker ps
docker exec -it mongodb mongosh -u root -p root
```

3. Stop the container:

```bash
docker-compose stop
```

4. Stop and remove the container and network (data is preserved):

```bash
docker-compose down
```

5. Stop and remove the container, network, and volumes (data will be deleted):

```bash
docker-compose down -v
```

> Note: Data is persisted in the mongodb_data volume between restarts.

---

## Environment Variables

Required environment variables, grouped by function:

#### Security & JWT

- SESSION_SECRET → internal session key (optional if only using JWT)
- JWT_SECRET → secret to sign JWT tokens
- JWT_EXPIRES_IN → token expiration (e.g., 1h)

#### Server & Environment

- PORT → application port (e.g., 3000)
- MONGODB_URI → MongoDB connection URI (e.g., mongodb://localhost:27017/nest-boilerplate)
- NODE_ENV → environment (development | production)
- FRONTEND_URL → frontend URL for post-login redirects
- NAME -> app name

#### Google OAuth

- GOOGLE_CLIENT_ID → Google client ID
- GOOGLE_CLIENT_SECRET → Google client secret
- GOOGLE_CALLBACK_URL → OAuth callback URL (e.g., http://localhost:3000/api/auth/google/callback)

---

## Development Scripts

```bash
npm run dev         # Run in development mode with hot reload
npm run build       # Compile the application
npm run start:prod  # Run in production
```

---

## NestJS Essentials

- Modules: Group related functionality and organize the app.
- Controllers: Define API endpoints.
- Services: Contain business logic and data access.
- Guards & Passport Strategies: Handle authentication and authorization.
- DTOs: Define data transfer objects for validation and typing.
- Dependency Injection & Modular Architecture: Promotes clean code and scalability.

---

## Basic API Usage

Authentication endpoints:

- GET /auth/google → initiate register/login
- GET /auth/google/callback → OAuth callback
- GET /auth/me → get current user info
- POST /auth/renew → renew JWT token
- POST /auth/logout-all → logout from all devices

---

## Final Notes

- Always rename the app and environment variables for new projects.
- Security: never expose sessionVersion, providerId, or other sensitive fields.
