# CyberPilot Technical Test

A full-stack user management application built with NestJS (backend) and React (frontend), featuring user data management, file imports, and modern UI components.

## 🏗️ Project Architecture

This project follows a monorepo structure with separate frontend and backend applications:

```
cyber-pilot-test-case/
├── backend/          # NestJS API with PostgreSQL
├── frontend/         # React TypeScript application
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v22 or higher)
- **Yarn** (v4.x)
- **Docker & Docker Compose** (for database services)
- **Git**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd test-case
```

### 2. Start Database Services

```bash
# Navigate to backend directory
cd backend

# Start PostgreSQL and Redis services
docker-compose up -d
```

### 3. Setup Backend

```bash
# Install dependencies
yarn install

# Setup environment variables
cp env.example .env
# Edit .env file with your configuration

# Run database migrations
yarn migration:up

# Run seeders to populate entities
yarn seeder:run

# Start the backend server
yarn start:dev
```

The backend API will be available at:

- **API**: http://localhost:3000/api/v1
- **Swagger Documentation**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/api/v1/health
- **Bull Dashboard**: http://localhost:3000/api/v1/queues/

### 4. Setup Frontend

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
yarn install

# Create environment file (optional)
cp .env.example .env.local
# Edit REACT_APP_API_URL if needed (defaults to localhost:3000)

# Start the frontend server
yarn start
```

The frontend application will be available at: http://localhost:3001

## 📋 Features

### Backend (NestJS API)

- **Modern Architecture**: CQRS pattern with command/query separation
- **Database**: PostgreSQL with MikroORM
- **Background Jobs**: Bull queue for processing imports
- **File Processing**: CSV and Excel file import support
- **API Documentation**: Swagger/OpenAPI integration
- **Health Monitoring**: Built-in health checks
- **Security**: Helmet, CORS, compression, validation

### Frontend (React Application)

- **Modern UI**: PrimeReact components with TypeScript
- **Data Management**: Advanced table with sorting, filtering, pagination
- **File Import**: Drag-and-drop CSV/Excel upload
- **Real-time**: React Query for data synchronization
- **Responsive**: Mobile-friendly design
- **Professional Layout**: Sidebar navigation with admin panel styling

## 🛠️ Development

### Backend Development

```bash
cd backend

# Development with hot reload
yarn start:dev

# Run tests
yarn test

# Generate migration
yarn migration:create

# Seed database
yarn seeder:run
```

### Frontend Development

```bash
cd frontend

# Development server
yarn start

# Run tests
yarn test

# Build for production
yarn build

# Lint code
yarn lint
```

## 📊 API Endpoints

### Users

- `GET /api/v1/users` - List all users (with pagination)
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `POST /api/v1/users/import` - Import users from file

### Jobs & Monitoring

- `GET /api/v1/health` - Application health status

## 🔧 Configuration

### Backend Environment Variables

```bash
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/cyber_pilot_db
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=cyber_pilot_db

# Background Jobs & Redis
BULL_REDIS_HOST=localhost
BULL_REDIS_PORT=6379
REDIS_HOST=localhost
REDIS_PORT=6379

# CORS & Swagger
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
SWAGGER_ENABLED=true
```

### Frontend Environment Variables

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:3000
```

## 🐳 Docker Deployment

### Development

```bash
# Start database services
cd backend
docker-compose up -d

# Build and run applications normally
```

### Production

```bash
# Build backend image
cd backend
docker build -t cyber-pilot-backend .

# Build frontend image
cd frontend
docker build -t cyber-pilot-frontend .
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
yarn test              # Unit tests
yarn test:e2e          # End-to-end tests
yarn test:cov          # Coverage report
```

### Frontend Tests

```bash
cd frontend
yarn test              # Interactive test runner
yarn test --coverage   # Coverage report
```

## 📚 Documentation

- **Backend**: See [backend/README.md](./backend/README.md) for detailed API documentation
- **Frontend**: See [frontend/README.md](./frontend/README.md) for UI component documentation

## 🔍 Troubleshooting

### Common Issues

**Database Connection Error**

```bash
# Ensure PostgreSQL is running
docker-compose ps

# Check database credentials in .env
cat backend/.env
```

**Port Already in Use**

```bash
# Find process using port
lsof -ti:3000 | xargs kill
lsof -ti:3001 | xargs kill
```

**Frontend API Connection Issues**

- Ensure backend is running on correct port
- Check CORS settings in backend `.env`
- Verify `REACT_APP_API_URL` in frontend `.env.local`

---

**Tech Stack**: NestJS • React • TypeScript • PostgreSQL • Redis • Docker • PrimeReact
