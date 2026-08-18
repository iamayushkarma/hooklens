# HookLens

HookLens is a webhook inspector. You get a unique URL, point any service (Stripe, GitHub, Razorpay, Twilio, whatever) at it, and every request that hits that URL shows up live in your dashboard — headers, body, query params, all of it. You can also replay any captured request to a different URL, which is handy when you're debugging something locally and don't want to wait for the real event to fire again.

Basically a self-hosted alternative to webhook.site or RequestBin, built as a full multi-tenant app with teams, projects, and role-based access instead of just anonymous bins.

## How it's organized

```
User
 └── Workspace       (created automatically when you sign up)
      └── Project    (group endpoints by integration, e.g. "Stripe")
           └── Endpoint   (the actual /h/:slug URL that receives requests)
                └── Request Logs
```

A workspace can have multiple members with different roles (owner, admin, member, viewer), so a team can share the same set of webhook endpoints instead of everyone running their own.

## What it actually does

- Generates a unique catch-all URL per endpoint (`/h/:slug`) that accepts any HTTP method, any body, and always returns 200 — because that's what a real webhook receiver needs to do
- Streams incoming requests to the dashboard in real time over Socket.io, no refreshing
- Stores full request detail: method, headers, body, query params, IP, content type, size
- Lets you replay a captured request to any target URL, and shows you the response status/time/body from that replay
- Has an AI button that reads a request and gives you a plain-English guess at what service sent it and what it means (uses Groq/Llama, sanitizes auth headers and cookies before sending anything to the model)
- Request logs auto-expire after 90 days (Mongo TTL index) so the database doesn't just grow forever
- Email/password login plus Google sign-in, workspace invitations by email, in-app notifications

## Stack

**Frontend** — React + TypeScript, Vite, Tailwind, shadcn/ui, Zustand for state, React Router, Socket.io client, Prism.js for the JSON highlighting, Framer Motion for the little animations, Recharts for the analytics charts.

**Backend** — Node.js + Express + TypeScript, MongoDB with Mongoose, Socket.io for the live feed, JWT auth, Zod for validating every request body, Groq SDK for the AI explanations, Helmet + express-rate-limit for basic hardening.

## Project layout

```
HookLens/
├── client/          # React app
│   └── src/
│       ├── app/         # routing, layouts, providers
│       ├── features/    # one folder per feature (auth, endpoint, request, analytics, etc.)
│       ├── shared/       # shared api client, hooks, components
│       ├── socket/       # socket.io connection
│       └── store/        # zustand stores
└── server/          # Express API
    └── src/
        ├── controllers/   # route handlers
        ├── models/        # mongoose schemas
        ├── routes/        # express routers
        ├── middleware/    # auth, rbac, rate limiting, validation
        ├── socket/        # socket.io server + event emitting
        └── utils/         # replay engine, groq client, jwt, sanitizers
```

## Running it locally

You'll need Node, a MongoDB connection (Atlas free tier works fine), and a Groq API key if you want the AI explanations to work.

```bash
# install everything
npm install
npm install --prefix client
npm install --prefix server

# copy the env files and fill in your own values
cp server/.env.example server/.env
cp client/.env.example client/.env

# run both client and server together
npm run dev
```

Server runs on the port you set in `server/.env`, client runs via Vite (`npm run client` alone if you just want that). The two are run together with `concurrently` from the root `npm run dev` script.

### Environment variables you'll need

**server/.env**

- `PORT`, `MONGO_URI`, `CLIENT_URL`
- `JWT_SECRET`, `BCRYPT_SALT_ROUNDS`
- `GROQ_API_KEY` — for the AI payload explanations
- `RESEND_API_KEY`, `MAIL_FROM` — for sending workspace invite emails
- Firebase service account values (`FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, etc.) — only needed for Google sign-in

**client/.env**

- `VITE_API_URL`, `VITE_SOCKET_URL`, `VITE_WEBHOOK_BASE_URL`
- Firebase web config values — again, only needed if you want Google sign-in on the frontend

## A note on the capture route

`/h/:slug` is the only public route in the whole app — everything else needs a valid JWT. This is intentional: webhook senders (Stripe, GitHub, etc.) can't log in, so the endpoint has to accept anonymous requests, always answer 200 immediately, and never leak whether a slug exists or not. Everything after that response — saving to the DB, pushing to the socket — happens fire-and-forget so a slow database never delays the sender.
