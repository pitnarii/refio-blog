# refio-blog

Personal blog frontend (Vite + React).

API lives in a separate repo: [`refio-blog-backend`](../refio-blog-backend).

## Project structure

```text
refio-blog/
├── client/                 # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/            # API helpers (auth, posts, upload)
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── package.json            # npm workspaces root (client only)
```

## How to run

1. Start the backend (separate terminal):

```bash
cd ../refio-blog-backend
npm install
npm run dev
```

2. Start the frontend:

```bash
npm install
npm run dev
```

Client: http://localhost:5173  
API: http://localhost:4000 (set `VITE_API_BASE_URL=http://localhost:4000` in `client/.env`)
