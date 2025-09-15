# Android & Windows Device Management Backend

This is the backend server for a comprehensive device management application, built with Node.js, Express, and MongoDB. It provides a RESTful API and a real-time WebSocket interface for managing contacts, files, location, installed applications, and more from various devices.

## Features

- **Authentication:** Secure JWT-based authentication.
- **Real-time Updates:** WebSocket integration using `socket.io` for instant updates on device status.
- **Device Management:** Register devices, track online/offline status, and send commands.
- **Data Management:** Full CRUD APIs for Contacts, Files (metadata & uploads), Gallery, Location, Call Logs, and Installed Apps.
- **Scalable Architecture:** Built with an MVC pattern and features a reusable middleware for advanced, paginated results.
- **Dockerized:** The entire application stack (app + database) is containerized for easy setup and deployment.

## Prerequisites

- For running with Docker (recommended):
  - [Docker](https://www.docker.com/products/docker-desktop)
  - [Docker Compose](https://docs.docker.com/compose/install/)
- For local development and testing (without Docker):
  - [Node.js](https://nodejs.org/) (v14 or higher)
  - A running [MongoDB](https://www.mongodb.com/try/download/community) instance.

## Getting Started

There are two ways to run the application: via Docker (recommended for production-like setup) or locally on your machine (ideal for development and testing).

### 1. Environment Configuration

The application uses a `config.env` file for environment variables. To get started, copy the example configuration file:

```bash
cp config.env.example config.env
```

Next, open the `config.env` file and fill in the values for the following variables:

```env
# Server Port
PORT=5000

# MongoDB Connection URI
# For a local MongoDB instance, this would look like:
# MONGO_URI=mongodb://localhost:27017/your_db_name
MONGO_URI=mongodb://localhost:27017/device_management_db

# Admin Credentials for the initial login
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_super_long_and_random_jwt_secret
JWT_EXPIRES_IN=30d
```

### 2. Running with Docker (Recommended)

The `docker-compose.yml` file is configured to use the official MongoDB image and will pass the environment variables from your local `config.env` file into the `app` service container.

Once the `config.env` file is created, you can build and run the entire application stack with a single command:

```bash
docker-compose up --build
```

- `--build`: Forces Docker to rebuild the application image based on the `Dockerfile`. You should use this the first time you run the app or after making code changes.
- You can add the `-d` flag (`docker-compose up --build -d`) to run the containers in detached mode (in the background).

The server will be running at `http://localhost:5000`. The MongoDB database (inside Docker) will be accessible on port `27017`.

### 3. Running Locally (Without Docker)

If you prefer to run the application directly on your machine, follow these steps after configuring your `config.env` file:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Run the development server:**
    ```bash
    npm run dev
    ```
3.  **Run tests:**
    ```bash
    npm test
    ```
    **Note:** The tests will run against the database specified in your `MONGO_URI`. It is highly recommended to use a dedicated test database, as the tests will wipe all data from the collections before running.

### 4. Stopping the Application

To stop the containers, press `Ctrl + C` in the terminal where they are running, or run the following command from the project root:

```bash
docker-compose down
```

This will stop and remove the containers. To also remove the database volume (deleting all data), you can run `docker-compose down -v`.

## API Documentation

Detailed documentation for all API endpoints can be found in the `src/docs` directory.
