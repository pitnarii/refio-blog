# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## How to run

```bash
npm run dev          # client (5173) + server (4000)
npm run dev:client   # frontend only
npm run dev:server   # backend only
```

## Deploy on Vercel (frontend)

Use **one** of these setups in your Vercel project settings:

### Option A — Root Directory: `client` (recommended)

| Setting | Value |
|---------|-------|
| Root Directory | `client` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

Also enable **Include source files outside of the Root Directory in the Build Step** (required for npm workspaces).

`client/vercel.json` sets `outputDirectory` to `dist` for SPA routing.

### Option B — Root Directory: repo root

| Setting | Value |
|---------|-------|
| Root Directory | `.` |
| Build Command | `npm run build -w client` |
| Output Directory | `client/dist` |
| Install Command | `npm install` |

Root `vercel.json` configures this automatically.

### Backend (Express)

Deploy `server/` as a **separate** Vercel project with Root Directory set to `server`. It uses `server/vercel.json` for the Node serverless function.