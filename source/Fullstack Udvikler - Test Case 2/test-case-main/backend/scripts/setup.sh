#!/bin/bash

# Cyber Pilot API Setup Script
echo "🚀 Setting up Cyber Pilot API..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if Yarn is installed
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn is not installed. Please install Yarn first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp env.example .env
    echo "✅ Environment file created. Please update .env with your settings."
else
    echo "✅ Environment file already exists."
fi

# Stop Docker services
echo "🐳 Stopping Docker services..."
docker-compose down

# Start Docker services
echo "🐳 Starting Database services..."
docker-compose up -d postgres redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check if database is accessible
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ Database is ready!"
else
    echo "⚠️  Database might not be ready yet. You may need to wait a bit longer."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with the correct settings"
echo "2. Run 'yarn start:dev' to start the development server"
echo "3. Visit http://localhost:3000/docs for API documentation"
echo ""
echo "Useful commands:"
echo "- yarn start:dev    # Start development server"
echo "- yarn build        # Build for production"
echo "- yarn test         # Run tests"
echo "- yarn lint         # Run linter"
echo "- docker-compose logs -f  # View database logs"
echo "- docker-compose down     # Stop Database services"
echo "" 