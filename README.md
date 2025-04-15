# Requirements
- docker
- yarn (work for now)

# Backend
1. Go to backend directory:
```bash
cd backend
```
2. Create `.env` file in backend:
```env
SERVER_PORT=8080
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=todo_db
```
3. Start the application using Docker Compose:
```bash
docker-compose up -d
```

Remove "-d" if we don't want to watch log.

# Frontend
1. Go to frontend directory:
```bash
cd frontend
```

2. Create `.env` file in frontend:
```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

3. Install dependencies:
```bash
yarn install
```
4. To start the development server:

```bash
yarn dev
```

The application will be available at `http://localhost:5173`