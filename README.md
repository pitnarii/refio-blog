# refio-blog

Personal blog project with a Vite + React client.

## Project structure

```text
refio-blog/
├── client/                 # Frontend (React + Vite)
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images
│   │   ├── components/     # Shared UI (Navbar, Hero, ui/*)
│   │   ├── data/           # Seed / mock data
│   │   ├── lib/            # Helpers (auth, articles, utils)
│   │   ├── pages/
│   │   │   ├── admin/      # Admin pages
│   │   │   └── public/     # Public pages
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
├── package.json            # npm workspaces root
└── vercel.json
```

## How to run

```bash
npm install
npm run dev          # client on http://localhost:5173
npm run build        # production build → client/dist
```
