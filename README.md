# 🎬 React + Vite — Movie Explorer App

This is a fully handcrafted **React + Vite + TypeScript** application that showcases trending movies from [The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api). It uses **SCSS for styling** and is implemented with **Server-Side Rendering (SSR)** — without any UI frameworks, boilerplates, or third-party libraries beyond essential tooling.


## 🚀 Tech Stack

- **React 19.1.0** with JSX transform and clean codebase with ES6
- **Vite** as the modern frontend build tool for fast development
- **TypeScript** (strict mode)
- **SCSS** for custom styling — no Tailwind, CSS Modules or Styled Components
- **SSR** with a custom Express + Vite integration
- **External API** fetches data from TMDB API


## 🚀 Getting Started

Follow the steps below to set up and run the project locally.


### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/movie-explorer.git
cd movie-explorer
```


### 2. Install Dependencies

Make sure you have Node.js version 22+ installed.

```bash
npm install
# or
yarn
```


### 3. Set Up Environment Variables

You'll need an API key from TMDB.

Create a .env file in the root of the project and add:

```bash
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```


### 4. Run in Development Mode (Client Only)

```bash
npm run dev
# or
yarn dev
```

The app will be available at:
http://localhost:5173


### 5. Run project in SSR Mode

To run with SSR support locally:

```bash
npm run dev:ssr
# or
yarn dev:ssr
```

This starts the SSR server at http://localhost:3000


## 🏗 Build for Production

### 1. Build the client and SSR bundle:

```bash
npm run build
```

This will generate the static client files and the SSR server bundle in the dist/ folder.


### 2. Preview the production build (locally):

```bash
npm run preview
```

This runs the Vite preview server for the client build (not SSR).

### 3. Run SSR server in production mode:

If you want to serve the SSR output in production, use:

```bash
node dist/server.js
```

Make sure you’ve handled copying or bundling your server.ts logic into the dist folder properly. You may need a custom bundler or script to compile server.ts separately (e.g. with esbuild or tsc).


## 📁 Folder Structure

```bash
project-root/
├── src/
│ ├── App.tsx
│ ├── main.tsx
│ ├── entry-client.tsx
│ ├── entry-server.tsx
│ └── components/
├── styles/
│ └── main.scss
├── index.html
├── server.ts
├── vite.config.ts
├── tsconfig.json
└── README.md
```


## 🧱 ESLint Configuration

Flat config (eslint.config.ts)

React rules and hooks best practices

TypeScript + Node type support

No eslint-define-config dependency needed


## 🧼 SCSS Styling

Global SCSS variables and mixins can be imported into all components using vite.config.ts’s additionalData setting.


## 🧪 Testing

No automated tests included in this version.

You can test functionality manually by:

* Searching for movies
* Refreshing SSR-rendered pages
* Checking mobile responsiveness


## 🌍 Live Demo
Deployed version not available yet.


## 📄 License
This project is provided for technical assessment purposes only. All rights to movie data belong to TheMovieDatabase (TMDB).


## 🙌 Acknowledgments

* TMDB API
* Vite Docs
* React Docs



## 🙋‍♀️ Author

Built by Åsa Eriksson — passionate about clean code, UI/UX, and frontend craftsmanship.


```    "dev:ssr": "ts-node --esm server.ts",```