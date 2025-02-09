# Dual N Back 

A modern frontend application built with React, focusing on implementing the Dual N-Back cognitive training exercise. Currently running as a client-side only application with browser state management.

## Play the Game

You can access and play the game at: [https://free-n-back.vercel.app](https://free-n-back.vercel.app)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [PNPM](https://pnpm.io/) (`npm install -g pnpm`)

## Project Structure

```
project-root/
├── client/                # React frontend
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
# In client directory
cp .env.example .env.local
```

4. Start development server:
```bash
pnpm dev
```

## Detailed Setup Instructions

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
```

4. Start the development server:
```bash
pnpm dev
```

The client will start on `http://localhost:5173`

## Available Scripts

In the project root directory:

```bash
# Run development server
pnpm dev

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

## Environment Variables

### Client (.env.local)

```env
VITE_API_URL=http://localhost:5173
```

## Adding Dependencies

To add a dependency to the client:

```bash
# Add to client
pnpm add <package-name>

# Add as dev dependency
pnpm add -D <package-name>
```

## VSCode Setup (Recommended)

Install these extensions for the best development experience:

- ESLint
- Prettier
- ES7+ React/Redux/React-Native snippets

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

### Client Deployment

1. Build the client:
```bash
pnpm build
```

2. The `dist` folder will contain the built files ready for deployment

## Future Development

Server-side features are currently under development. This will include user authentication, progress tracking, and performance analytics. Stay tuned for updates!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details