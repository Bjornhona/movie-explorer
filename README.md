# 🎬 Movie Explorer - React + Vite + TypeScript

A beautiful, modern movie discovery application built with React, Vite, and TypeScript. Browse trending movies, manage your wishlist, and explore upcoming releases with a stunning UI powered by The Movie Database (TMDB) API.

## ✨ Features

- 🎭 **Movie Discovery** - Browse upcoming, popular, and top-rated movies
- ❤️ **Wishlist Management** - Save and manage your favorite movies
- 🔐 **TMDB Authentication** - Secure login with TMDB account
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- ⚡ **Server-Side Rendering** - Fast loading with SSR support
- 🎨 **Modern Styling** - Custom SCSS with beautiful animations
- 🧪 **Comprehensive Testing** - Full test coverage with Vitest

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (recommended: 22+)
- **npm** or **yarn** package manager
- **TMDB API Key** (free at [themoviedb.org](https://www.themoviedb.org/settings/api))

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/movie-explorer.git
cd movie-explorer
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
# Create .env file
touch .env
```

Add your TMDB API key to the `.env` file:

```env
# TMDB API Configuration
VITE_TMDB_API_KEY=your_tmdb_api_key_here

# Optional: Customize server port (default: 3000)
PORT=3000

# Optional: Customize base URL for development
VITE_BASE_URL=http://localhost:3000
```

### 4. Get Your TMDB API Key

1. Visit [The Movie Database](https://www.themoviedb.org/)
2. Create a free account
3. Go to **Settings** → **API**
4. Request an API key for **Developer** use
5. Copy your API key and add it to the `.env` file

### 5. Start Development Server

```bash
# Start in SSR mode (recommended)
npm run dev:ssr

# Or start in standard Vite mode
npm run dev
```

The application will be available at **http://localhost:3000**

⚠️ **Important**: Use `npm run dev:ssr` for proper SSR development. The standard `npm run dev` may cause hydration mismatches.

## 🏗️ Available Scripts

```bash
# Development
npm run dev:ssr          # Start SSR development server
npm run dev              # Start standard Vite dev server

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run test suite
npm run test:watch       # Run tests in watch mode
```

## 📁 Project Structure

```
movie-explorer/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── icons/         # SVG icons
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   ├── styles/            # SCSS stylesheets
│   │   ├── _variables.scss # Design system variables
│   │   ├── _components.scss # Shared components
│   │   └── ...
│   ├── __tests__/         # Test files
│   ├── App.tsx            # Main app component
│   ├── entry-client.tsx   # Client entry point
│   ├── entry-server.tsx   # Server entry point
│   └── main.tsx           # App entry point
├── server.ts              # Express SSR server
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── vitest.config.ts       # Test configuration
├── eslint.config.ts       # ESLint configuration
└── package.json           # Dependencies and scripts
```

## 🎨 Design System

The application uses a custom design system built with SCSS:

- **Colors**: Purple gradient theme with semantic color palette
- **Typography**: Inter font family with responsive sizing
- **Spacing**: Consistent spacing scale
- **Components**: Reusable card, button, and layout components
- **Animations**: Smooth transitions and hover effects

## 🔐 Authentication

The app uses TMDB's authentication system:

1. **Request Token** - Get a temporary request token
2. **User Approval** - Redirect to TMDB for user approval
3. **Session Creation** - Create a session with the approved token
4. **Account Access** - Fetch user account information

## 🧪 Testing

The project includes comprehensive tests:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

Test files are located in `src/__tests__/` and follow the naming convention:
- `ComponentName.test.tsx` for component tests
- `hookName.test.ts` for hook tests

## 🔧 Environment Variables

| Variable            | Description       | Required | Default |
|---------------------|-------------------|----------|---------|
| `VITE_TMDB_API_KEY` | Your TMDB API key |    ✅    |    -    |

## 🐛 Troubleshooting

### Common Issues

**1. Hydration Mismatch**
- Use `npm run dev:ssr` instead of `npm run dev`
- Ensure server and client render the same content

**2. API Key Issues**
- Verify your TMDB API key is correct
- Check that the key has proper permissions
- Ensure the `.env` file is in the root directory

**3. Port Already in Use**
- Change the port in `.env`: `PORT=3001`
- Or kill the process using the port

**4. Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`

### Getting Help

1. Check the [Issues](../../issues) page
2. Review the [TMDB API documentation](https://developers.themoviedb.org/3)
3. Ensure all dependencies are up to date

## 📄 License

This project is provided for technical assessment purposes only. All rights to movie data belong to The Movie Database (TMDB).

## 🙌 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for the API
- [Vite](https://vitejs.dev/) for the build tool
- [React](https://react.dev/) for the UI framework
- [Vitest](https://vitest.dev/) for testing

## 👨‍💻 Author

Built by Åsa Eriksson — passionate about clean code, UI/UX, and frontend craftsmanship.

---

**Happy coding! 🎬✨**
