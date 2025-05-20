# Angi - Restaurant Review & Rating Platform

A comprehensive restaurant review and rating application built with modern technologies. The application allows users to discover restaurants, read reviews, explore cuisines, and find dining options nearby.

## Project Overview

This project consists of:

- **Frontend**: React application built with React 19, TypeScript, and Ant Design
- **Backend**: Go-based RESTful API using Gin framework and GORM ORM with MySQL

## Prerequisites

- Docker & Docker Compose
- Node.js (v18 or higher)
- Go 1.21 or higher
- Yarn package manager

## Getting Started

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a `.env` file in the backend directory:

```env
SERVER_PORT=8080
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=angi_db
```

3. Start the application using Docker Compose:

```bash
./rebuild-all.sh
```

The API will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Create a `.env` file in the frontend directory:

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

3. Install dependencies:

```bash
yarn install
```

4. Start the development server:

```bash
yarn dev
```

The application will be available at `http://localhost:5173`

## API Documentation

After starting the Docker containers, you can access the Swagger UI to test and explore the API:

- URL: `http://localhost:8080/swagger/index.html`

## Key Features

- Restaurant discovery with ratings and reviews
- Cuisine-based filtering
- Location-based restaurant recommendations
- Detailed restaurant information
- User reviews and ratings
- Search functionality

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- Ant Design
- React Router
- TailwindCSS
- React Query

### Backend

- Go 1.21
- Gin web framework
- GORM ORM
- MySQL database
- Uber FX (Dependency Injection)
- Zerolog (Logging)
- Swagger (API Documentation)

## Project Structure

The application follows a clean architecture approach:

```
angi/
├── frontend/         # React frontend application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── ...
└── backend/          # Go backend application
    ├── cmd/          # Application entry points
    ├── config/       # Configuration management
    ├── database/     # Database setup
    ├── internal/     # Internal application code
    └── ...
```

## License

This project is licensed under the MIT License.
