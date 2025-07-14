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


### 5. Run project in SSR Mode

Run the app in development mode using SSR:

```bash
npm run dev:ssr
# or
yarn dev:ssr
```

This starts the SSR server at http://localhost:3000

⚠️ npm run dev (standard Vite dev mode) is not supported for this app and will result in a hydration mismatch. Always use npm run dev:ssr for proper SSR development.


## 🏗 Build

To build both the client and the SSR server:

```bash
npm run build
```

This generates a production-ready output in the dist/ folder.


### 2. Preview (production):

After building the app, you can preview it locally using:

```bash
npm run preview
```

This will start a Node server with the compiled files.


## 📁 Folder Structure

```bash
project-root/
├── public/   
├── src/
│ ├── App.tsx
│ ├── entry-client.tsx
│ ├── entry-server.tsx
│ ├── styles/
│ │   └── main.scss
│ └── components/
├── index.html
├── server.ts
├── package.json  
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
