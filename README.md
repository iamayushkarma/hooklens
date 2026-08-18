# HookLens

Live: **https://tryhooklens.vercel.app**

HookLens is a webhook inspector. You get a unique URL, point any service at it (Stripe, GitHub, Razorpay, Twilio, whatever sends webhooks), and every request that hits that URL shows up live in your dashboard — full headers, body, query params, IP, all of it, as it arrives. You can also replay any captured request to a different URL, which is useful when you're debugging locally and don't want to trigger the real event again just to test a fix.

Think of it as a self-hosted webhook.site or RequestBin, except built as a proper multi-tenant app: teams, projects, role-based permissions, instead of one anonymous throwaway bin per visit.

## How data is structured

```
User
 └── Workspace       created automatically when you sign up
      └── Project    groups related endpoints, e.g. "Stripe Integration"
           └── Endpoint   the actual /h/:slug URL that receives requests
                └── Request Logs
```

A workspace can have several members with different roles — owner, admin, member, viewer — so a team shares one set of endpoints instead of everyone spinning up their own. Roles are enforced on both workspace-level actions (invite people, delete the workspace) and project-level actions (edit a project, delete an endpoint).

## What it actually does

- Generates a unique catch-all URL per endpoint (`/h/:slug`). It accepts any HTTP method, any body, any content type, and always answers `200` immediately — that's what a real webhook receiver has to do, since the sender doesn't care about your app logic, it just wants an ack.
- Streams every incoming request to the dashboard in real time over Socket.io. No refreshing, no polling.
- Stores the full request: method, headers, body, query params, IP, user agent, content type, size — all sanitized before saving.
- Replay engine: re-sends any captured request to a target URL of your choice and reports back the response status, headers, body, and how long it took. Useful for testing a local server against a real production payload.
- AI explain button: sends the request (with `Authorization`, `Cookie`, and other sensitive headers stripped out first) to Groq's Llama 3.3 model and gets back a short, plain-English guess at what service sent it and what it means.
- Request logs auto-delete after 90 days using a MongoDB TTL index, so storage doesn't grow forever.
- Email/password auth plus Google sign-in (Firebase), workspace invites by email (Resend), and in-app notifications for things like "you were invited to a workspace."
- Analytics per workspace and per endpoint — request volume over time, that kind of thing.

## Stack

**Frontend** — React 19 + TypeScript, Vite, Tailwind CSS, shadcn/ui components, Zustand for state, React Router, Socket.io client for the live feed, Prism.js for JSON syntax highlighting, Framer Motion for animations, Recharts for the analytics charts, React Hook Form + Zod for forms.

**Backend** — Node.js + Express + TypeScript, MongoDB with Mongoose, Socket.io server, JWT auth with bcrypt password hashing, Zod for validating every incoming request, Groq SDK for the AI explanations, Firebase Admin for verifying Google sign-in tokens, Resend for transactional email, Helmet + express-rate-limit for basic hardening, nanoid for generating endpoint slugs.

## Project layout

```
HookLens/
├── client/
│   └── src/
│       ├── app/          routing, layouts, providers
│       ├── features/     one folder per feature — auth, endpoint, request,
│       │                 project, workspace, analytics, notification, dashboard
│       ├── shared/        shared api client, hooks, reusable components
│       ├── socket/         socket.io client connection
│       └── store/           zustand stores (auth, workspace, notifications, ui)
└── server/
    └── src/
        ├── controllers/    route handlers, one file per resource
        ├── models/          mongoose schemas
        ├── routes/           express routers
        ├── middleware/        auth, rbac, rate limiting, request validation
        ├── socket/             socket.io server setup + event emitters
        ├── validators/          zod schemas for input validation
        └── utils/                replay engine, groq client, jwt, sanitizers
```

## API reference

All routes are prefixed with `/api/v1`. Everything needs a Bearer JWT except auth and the capture route.

**Auth** — `/auth`

- `POST /register`, `POST /login`, `POST /google`
- `GET /me`, `PATCH /me`, `PATCH /me/password`, `DELETE /me`

**Workspaces** — `/workspaces`

- `GET /`, `POST /`, `PATCH /:id`, `DELETE /:id`
- `GET /:id/members`, `POST /:id/invite`, `PATCH /:id/members/:userId/role`, `DELETE /:id/members/:userId`
- `GET /invite/accept/:token`, `POST /invite/decline/:token`
- `POST /:id/invitations/:invitationId/resend`, `DELETE /:id/invitations/:invitationId`

**Projects** — `/projects`

- `GET /`, `POST /`, `PATCH /:id`, `DELETE /:id`

**Endpoints** — `/endpoints`

- `GET /`, `POST /`, `PATCH /:id`, `DELETE /:id`
- `POST /:id/test` — sends a sample test request to yourself
- `GET /:id/requests` — request history for one endpoint

**Requests** — `/requests`

- `GET /project/:projectId`, `GET /:id`, `DELETE /:id`
- `POST /:id/replay`, `POST /:id/explain`

**Analytics** — `/analytics`

- `GET /workspace/:id`, `GET /endpoint/:id`

**Notifications** — `/notifications`

- `GET /`, `GET /unread-count`, `PATCH /read-all`, `PATCH /:id/read`, `DELETE /:id`

**Capture (public, no auth)**

- `ALL /h/:slug` — this is the whole point of the app. Accepts any method, always returns `{ received: true }` with a 200.

## Socket events

Client subscribes to a room per endpoint slug (`endpoint:<slug>`) and a room per user (`user:<userId>`).

- `request:new` — a new request just hit one of your endpoints
- `request:deleted` — a request log was deleted
- `endpoint:disabled` — an endpoint was turned off
- `notification:new`, `notification:read`, `notification:deleted`

## Running it locally

You'll need Node 18+, a MongoDB connection (Atlas free tier is fine), and a few free-tier API keys depending on which features you want working.

```bash
git clone <your-fork-url>
cd HookLens

# install everything
npm install
npm install --prefix client
npm install --prefix server

# set up your env files (see below)
cp server/.env.example server/.env
cp client/.env.example client/.env

# run client and server together from the root
npm run dev
```

That last command uses `concurrently` to run the API and the Vite dev server side by side. If you just want one or the other: `npm run server` or `npm run client`.

### server/.env

```dotenv
PORT=8000
CLIENT_URL=http://localhost:5173

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/hooklens?retryWrites=true&w=majority

# Auth
JWT_SECRET=some-long-random-string
BCRYPT_SALT_ROUNDS=11

# AI payload explanations — free tier at console.groq.com
GROQ_API_KEY=

# Transactional email for workspace invites — free tier at resend.com
RESEND_API_KEY=
MAIL_FROM="HookLens <onboarding@resend.dev>"

# Firebase (only needed if you want Google sign-in)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=
FIREBASE_UNIVERSE_DOMAIN=googleapis.com
```

### client/.env

```dotenv
VITE_API_URL=http://localhost:8000/api/v1
VITE_WEBHOOK_BASE_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:8000

# Firebase (only needed if you want Google sign-in on the frontend)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

Never commit a real `.env` file. The Firebase and Mongo values above are placeholders — get your own from the Firebase console and MongoDB Atlas.

## Why the capture route is public

`/h/:slug` is the only unauthenticated route in the whole app. Every other route sits behind JWT middleware. This is on purpose — a webhook sender like Stripe can't log in, so the route has to accept anonymous traffic, respond `200` instantly, and never reveal whether a slug is real or not (no 404s, no error leaks). Everything that happens after that response — sanitizing and saving the request, pushing it out over the socket, bumping the request counter — runs fire-and-forget, so a slow database write never delays or breaks the sender's webhook delivery.
