# test-no-db-nest

NestJS API built with [QuickShip](https://github.com/SeifElkadyy/QuickShip-CLI)

## 🚀 Features

- ✅ NestJS 10+ with TypeScript
- ✅ PostgreSQL with Prisma ORM
- ✅ Passport.js + JWT Authentication
- ✅ Swagger API Documentation
- ✅ Docker Support
- ✅ Class Validator
- ✅ Modular Architecture
- ✅ Testing with Jest

## 📦 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration.

3. Run database migrations:

```bash
npx prisma migrate dev --name init
```

4. Generate Prisma Client:

```bash
npx prisma generate
```


### Development

Start the development server:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

📖 **API Documentation:** http://localhost:3000/api/docs


### Production Build

```bash
npm run build
npm run start:prod
```

### Docker

Build and run with Docker:

```bash
docker-compose up
```


## 🧪 Testing

Run tests:

```bash
npm test
```

## 📚 API Endpoints

### Health Check

```
GET /health
```

### Authentication

```
POST /api/auth/register - Register new user
POST /api/auth/login    - Login user
GET  /api/auth/me       - Get current user (protected)
```

### Users

```
GET /api/users          - Get all users (protected)
GET /api/users/:id      - Get user by ID (protected)
```


## 🔧 Available Scripts

- `start:dev` - Start development server
- `start:debug` - Start in debug mode
- `build` - Build for production
- `start:prod` - Start production server
- `test` - Run tests
- `lint` - Lint code

## 📁 Project Structure

```
src/
├── auth/           # Authentication module
├── users/          # Users module
├── database/       # Database configuration
├── common/         # Common utilities
├── app.module.ts   # Root module
└── main.ts         # Application entry point
```

## 🚀 Deployment

Deploy to:
- Railway: `quickship deploy --platform railway`
- Render: `quickship deploy --platform render`
- Fly.io: `quickship deploy --platform fly`

## 📄 License

MIT

---

Built with ❤️ using [QuickShip CLI](https://github.com/SeifElkadyy/QuickShip-CLI)
