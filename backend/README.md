# Angi Backend

A modern RESTful API for the Angi restaurant review and rating platform, built with Go using clean architecture principles.

## Tech Stack

- Go 1.21
- Gin v1.10.0 (Web Framework)
- GORM v1.25.7 (ORM)
- MySQL (Database)
- Uber FX v1.20.1 (Dependency Injection)
- Viper v1.18.2 (Configuration Management)
- Zerolog v1.32.0 (Logging)
- Swagger v1.16.3 (API Documentation)

## Project Structure

```
.
├── cmd
│   └── main.go           # Application entry point
├── config
│   └── config.go         # Configuration management
├── database
│   └── db.go             # Database connection setup
├── internal
│   ├── constant          # Constants and enums
│   ├── controller        # HTTP handlers
│   ├── dto               # Data Transfer Objects
│   ├── logger            # Logging configuration
│   ├── model             # Data models
│   ├── repository        # Database operations
│   └── service           # Business logic
├── docs                  # Swagger documentation
├── docker-compose.yml    # Docker compose configuration
├── Dockerfile            # Docker build configuration
├── go.mod                # Go module file
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites

- Go 1.21 or higher
- Docker and Docker Compose
- MySQL (if running locally)

### Running with Docker

1. Clone the repository:

```bash
git clone https://github.com/yourusername/angi.git
cd angi/backend
```

2. Start the application using Docker Compose:

```bash
./rebuild-all.sh
```

This script will:

- Build the Docker image
- Start the MySQL database container
- Start the application container

The application will be available at `http://localhost:8080`

### Running Locally

1. Clone the repository
2. Create a `.env` file based on `.env.example`:

```env
SERVER_PORT=8080
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=angi_db
```

3. Run MySQL database (or use Docker Compose for database only)
4. Run the application:

```bash
go run cmd/main.go
```

## API Endpoints

### Health Check

- `GET /health` - Check API health status

### Restaurant Endpoints

- `GET /api/v1/restaurants` - Get all restaurants
- `GET /api/v1/restaurants/:id` - Get a specific restaurant
- `GET /api/v1/restaurants/search` - Search restaurants
- `GET /api/v1/restaurants/cuisines` - Get all cuisines
- `GET /api/v1/cuisines/:name/restaurants` - Get restaurants by cuisine

### Review Endpoints

- `GET /api/v1/restaurants/:id/reviews` - Get reviews for a restaurant
- `POST /api/v1/restaurants/:id/reviews` - Create a new review

## Request/Response Examples

### Get Restaurants

```json
GET /api/v1/restaurants?latitude=10.7776&longitude=106.6977&limit=10
```

### Response Format

```json
{
  "message": "Restaurants retrieved successfully",
  "data": [
    {
      "id": "123",
      "name": "Restaurant Name",
      "address": "123 Main St",
      "latitude": 10.7776,
      "longitude": 106.6977,
      "rating": 4.5,
      "review_count": 120,
      "city_id": "SGN",
      "district_id": "D1",
      "food_type_name": "Vietnamese",
      "distance": 0.5
    }
  ]
}
```

## API Documentation

### Swagger

The API is documented using Swagger/OpenAPI. To access the documentation:

1. Start the application
2. Visit `http://localhost:8080/swagger/index.html`

The Swagger UI provides interactive documentation where you can:

- View all available endpoints
- Read detailed API descriptions
- Test API endpoints directly from the browser
- View request/response schemas

## Architecture

The application follows clean architecture principles:

1. **Controller Layer**: Handles HTTP requests/responses and input validation
2. **Service Layer**: Contains business logic and orchestrates data operations
3. **Repository Layer**: Abstracts data access and database operations
4. **Model Layer**: Defines data structures and domain entities

## Dependency Injection

The application uses Uber FX for dependency injection, which helps to:

- Create loosely coupled components
- Manage dependencies efficiently
- Improve testability
- Simplify lifecycle management

## Configuration

The application uses Viper for configuration management, allowing:

- Environment-based configuration
- Multiple config sources (files, env vars)
- Hot reloading of configuration
- Type-safe configuration access
