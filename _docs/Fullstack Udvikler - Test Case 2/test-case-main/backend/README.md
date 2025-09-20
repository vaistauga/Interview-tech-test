# Cyber Pilot API

A minimal NestJS API boilerplate project featuring a monorepo structure with shared libraries, CQRS pattern, background job processing, and comprehensive development tools.

## 🚀 Features

- **NestJS Framework** - Modern Node.js framework for building scalable server-side applications
- **Monorepo Structure** - Organized with `src/` for main application
- **TypeScript** - Full TypeScript support with path mapping (`@api/*`)
- **CQRS Pattern** - Command Query Responsibility Segregation for better architecture
- **Background Jobs** - Bull queue for processing background tasks (user imports)
- **Database** - PostgreSQL with MikroORM for type-safe database operations
- **API Documentation** - Swagger/OpenAPI integration
- **Health Checks** - Built-in health monitoring endpoints
- **Security** - Helmet, CORS, compression, and validation
- **Testing** - Jest testing framework with coverage
- **Docker** - Multi-stage Dockerfile and Docker Compose setup
- **Code Quality** - ESLint, Prettier, and pre-configured rules

## 🛠️ Prerequisites

- Node.js (v22.X.X or higher)
- Yarn 4.9.2
- Docker and Docker Compose (for database)
- PostgreSQL (if running locally)

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install dependencies
yarn install
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit environment variables
nano .env
```

### 3. Start Database Services

```bash
# Start PostgreSQL and Redis with Docker
docker-compose up -d

# Or start only PostgreSQL
docker-compose up -d postgres
```

### 4. Run the Application

```bash
# Development mode with hot reload
yarn start:dev

# Production mode
yarn build
yarn start:prod
```

The API will be available at:
- **API**: http://localhost:3000/api/v1
- **Swagger Documentation**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/api/v1/health
- **Bull Dashboard**: http://localhost:3000/api/v1/queues/

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Application port | `3000` |
| `API_PREFIX` | API route prefix | `api/v1` |
| `DATABASE_URL` | Complete PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/cyber_pilot_db` |
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `DATABASE_USERNAME` | Database username | `postgres` |
| `DATABASE_PASSWORD` | Database password | `password` |
| `DATABASE_NAME` | Database name | `cyber_pilot_db` |
| `BULL_REDIS_HOST` | Redis host for Bull queue | `localhost` |
| `BULL_REDIS_PORT` | Redis port for Bull queue | `6379` |
| `BULL_REDIS_PASSWORD` | Redis password (optional) | `""` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_PASSWORD` | Redis password (optional) | `""` |
| `UPLOAD_DIR` | File upload directory | `./uploads` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000,http://localhost:3001` |
| `SWAGGER_ENABLED` | Enable Swagger docs | `true` |
| `SWAGGER_PATH` | Swagger documentation path | `docs` |

## 🔧 Available Scripts

```bash
# Development
yarn start:dev          # Start with hot reload
yarn start:debug        # Start with debug mode

# Building
yarn build              # Build for production
yarn start:prod         # Start production build

# Testing
yarn test               # Run unit tests
yarn test:watch         # Run tests in watch mode
yarn test:cov           # Run tests with coverage
yarn test:e2e           # Run end-to-end tests

# Code Quality
yarn lint               # Run ESLint
yarn format             # Format code with Prettier
```

## 🏗️ CQRS Architecture

The API uses CQRS (Command Query Responsibility Segregation) pattern:

### Commands
- **DeleteUserCommand** - Delete users
- **ImportUsersCommand** - Bulk import users

### Queries
- **GetUserQuery** - Retrieve single user
- **GetUsersQuery** - Retrieve users with pagination

### Background Jobs
- **User Import** - Process large user imports in background
- **Job Monitoring** - Track job status and progress

## 🐳 Docker Deployment

### Development with Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:cov

# Run specific test file
yarn test users.service.spec.ts

# Run tests in watch mode
yarn test:watch
```

## 📚 Database

The application uses MikroORM with PostgreSQL. Database entities are automatically discovered and migrations can be generated.

### Useful Commands
```bash
# Generate migration
npx mikro-orm migration:create

# Run migrations
npx mikro-orm migration:up

# Create database schema
npx mikro-orm schema:create
```

## 🔍 Monitoring

### Health Checks
The application includes comprehensive health checks:
- Database connectivity
- Memory usage
- Application status

Access health information at: `GET /api/v1/health`

### Logging
The application uses NestJS built-in logging. In production, consider integrating with external logging services.

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

**Port Already in Use**
- Change the `PORT` in `.env`
- Kill process using the port: `lsof -ti:3000 | xargs kill`

**Background Job Issues**
- Ensure Redis is running for job queue
- Check job processor logs for errors
- Monitor job queue status

---

## 🔗 Frontend Integration

This API is designed to work with the React frontend located in `../frontend`. 

### CORS Configuration
The API is configured to accept requests from:
- `http://localhost:3000` (default React dev server)
- `http://localhost:3001` (alternative frontend port)

### API Client
The frontend uses a React Query-based API client that provides:
- Automatic caching and background refetching
- Error handling with retry functionality
- Loading states and optimistic updates
- TypeScript interfaces for type safety

### Real-time Data Sync
- User data updates are immediately reflected in the frontend
- File import progress can be monitored through job status endpoints
- Health checks ensure backend availability

### Development Workflow
1. Start the backend API first (`yarn start:dev`)
2. Start the frontend development server
3. Both applications will hot-reload on file changes
4. Use Swagger docs at `/docs` for API testing