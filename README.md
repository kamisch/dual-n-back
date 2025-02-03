# Dual N Back 

A modern full-stack application built with MongoDB, Express.js, React, and Node.js (MERN stack), using PNPM as the package manager.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [PNPM](https://pnpm.io/) (`npm install -g pnpm`)
- [MongoDB](https://www.mongodb.com/try/download/community)

## Project Structure

```
project-root/
├── client/                # React frontend
├── server/                # Express backend
├── pnpm-workspace.yaml    # Workspace configuration
└── package.json          # Root package.json
```

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-name>
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# In server directory
cp .env.example .env

# In client directory
cp .env.example .env.local
```

4. Start development servers:
```bash
# Start both client and server
pnpm dev

# Or start them separately
pnpm dev:client
pnpm dev:server
```

## Detailed Setup Instructions

### Server Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your configuration
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/your-database-name
JWT_SECRET=your-secret-key
```

4. Start the server:
```bash
pnpm dev
```

The server will start on `http://localhost:5000`

### Client Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your configuration
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
pnpm dev
```

The client will start on `http://localhost:5173`

## Available Scripts

In the project root directory:

```bash
# Run all development servers
pnpm dev

# Run client only
pnpm dev:client

# Run server only
pnpm dev:server

# Build all packages
pnpm build

# Run linting
pnpm lint
```

In the client directory:

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
```

In the server directory:

```bash
pnpm dev          # Start development server
pnpm start        # Start production server
pnpm test         # Run tests
```

## Environment Variables

### Server (.env)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/your-database-name
JWT_SECRET=your-secret-key
JWT_EXPIRE=24h
```

### Client (.env.local)

```env
VITE_API_URL=http://localhost:5000/api
```

## Adding Dependencies

To add a dependency to a specific workspace:

```bash
# Add to client
pnpm --filter client add <package-name>

# Add to server
pnpm --filter server add <package-name>

# Add as dev dependency
pnpm --filter <workspace> add -D <package-name>
```

## VSCode Setup (Recommended)

Install these extensions for the best development experience:

- ESLint
- Prettier
- ES7+ React/Redux/React-Native snippets
- MongoDB for VS Code

Add this to your VSCode settings.json:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Deployment

### Server Deployment

1. Build the server:
```bash
cd server
pnpm build
```

2. Set production environment variables
3. Start the server:
```bash
pnpm start
```

### Client Deployment

1. Build the client:
```bash
cd client
pnpm build
```

2. The `dist` folder will contain the built files ready for deployment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details