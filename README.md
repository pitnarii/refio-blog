# Refio Blog

Personal blog built with **React (Vite)** on the frontend and a separate **Express + Supabase** API.

| App | Repo | Deploy |
|-----|------|--------|
| Frontend | this repo (`refio-blog`) | [Vercel](https://vercel.com) |
| Backend | [`refio-blog-backend`](../refio-blog-backend) | [Render](https://render.com) |
| Database / Auth / Storage | Supabase | Supabase Cloud |

---

## Project structure

```text
refio-blog/
├── client/                 # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Navbar, Hero, articles, shared UI
│   │   ├── lib/            # API helpers (auth, posts, upload)
│   │   ├── pages/          # Public and authenticated pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── package.json            # npm workspaces root
└── vercel.json             # Vercel build config
```

---

## Prerequisites

- Node.js 18+ and npm
- A [Supabase](https://supabase.com) project (tables, Auth users, Storage bucket)
- Backend repo cloned next to this one (or any local path), e.g. `../refio-blog-backend`

---

## How to run locally

### 1. Start the backend

```bash
cd ../refio-blog-backend
npm install
npm run dev
```

API: [http://localhost:4000](http://localhost:4000)  
Health check: [http://localhost:4000/health](http://localhost:4000/health) → `{ "status": "ok" }`

### 2. Start the frontend

From this repo root:

```bash
npm install
npm run dev
```

Client: [http://localhost:5173](http://localhost:5173)

Keep **both** terminals running. If the API is down, articles and login will fail.

### Useful scripts (this repo)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint the client |

---

## Deployment

### A. Backend on Render

1. Create a **Web Service** from the `refio-blog-backend` repo.
2. Settings (typical):
   - **Build command:** `npm install`
   - **Start command:** `npm start` (runs `node app.mjs`)
3. Configure the service environment on Render (Supabase keys, `CLIENT_URL` = your Vercel URL).
4. Deploy, then open:

   ```text
   https://YOUR-SERVICE.onrender.com/health
   https://YOUR-SERVICE.onrender.com/api/posts
   ```

   Free-tier services may sleep; the first request can be slow.

### B. Frontend on Vercel

1. Import this `refio-blog` repo into Vercel.
2. Build settings (also in `vercel.json`):
   - **Install:** `npm install`
   - **Build:** `npm run build -w client`
   - **Output:** `client/dist`
3. Point the frontend at your Render API URL in Vercel project settings, then deploy (redeploy after changing that setting).

### C. After deploy checklist

1. `GET /health` on Render → `ok`
2. `GET /api/posts` on Render → JSON with `posts`
3. Open the Vercel site → articles load
4. Browser DevTools → Network → `/api/posts` is `200` (not CORS / failed)

---

## How to test each page

Base URL locally: `http://localhost:5173`  
Base URL production: your Vercel URL

### Public pages

| Page | Path | What to test |
|------|------|--------------|
| Home | `/` | Hero + article list from API; category filters; search; **View more** pagination |
| View post | `/viewPostPage/:id` | Open an article from the home grid; title, content, image load |
| Sign up | `/signup` | Create a new user; validation errors; success redirect |
| Sign up success | `/signup/success` | Shown after successful registration |
| Log in | `/login` | Valid credentials → toast + redirect home; wrong password → error toast |
| Profile | `/profile` | Requires login; edit name/username; upload profile picture then **Save** |
| Reset password | `/reset-password` | Requires login; current + new password flow |
| 404 | any unknown path | “Page Not Found” + link home |

**Navbar checks**

- Logged out: Log in / Sign up
- Logged in: avatar menu → Profile, Reset password, Log out

**Published articles** appear on the public home page only when their status is **publish** in Supabase.

### Suggested end-to-end smoke test

1. Open home → articles visible  
2. Open one post → content OK  
3. Sign up → log in → update profile + picture → Save  
4. Log out → public pages still work  

### Quick API checks (Postman / browser)

```text
GET  http://localhost:4000/health
GET  http://localhost:4000/api/posts
POST http://localhost:4000/api/auth/login
     Body (JSON): { "email": "...", "password": "..." }
POST http://localhost:4000/api/upload
     form-data: key "image" (File), Header: Authorization Bearer <token>
PUT  http://localhost:4000/api/auth/profile
     JSON: { "name", "username", "profilePicture": "<url from upload>" }
```

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| No articles on home | Backend down, API URL misconfigured, or no **published** posts |
| Login always fails | Wrong credentials, Supabase Auth user missing, or API unreachable |
| Upload / profile save fails | Missing `post-images` Storage bucket, or upload field not named `image` |
| Works locally, empty on Vercel | Frontend still pointing at the wrong API, or needs a redeploy |
| CORS errors in browser | Frontend origin not allowed on the Render backend CORS / `CLIENT_URL` |
| Render first load very slow | Free tier cold start — wait and retry `/health` |

---

## License

Private / personal project.