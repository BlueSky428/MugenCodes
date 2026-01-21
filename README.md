# Kizuna Studio Marketing Site

This project is a Next.js 14 marketing site built with the App Router and Tailwind CSS.

Run the app locally by installing dependencies and starting the dev server.

```
npm install
npm run dev
```

## Environment variables

### Required (local + Vercel)

- `DATABASE_URL`: Vercel Postgres Prisma/pooled URL (must start with `postgres://` or `postgresql://`)
- `AUTH_SECRET` (or `NEXTAUTH_SECRET`): used by NextAuth (generate via `openssl rand -base64 32`)
- `NEXTAUTH_URL`: your app URL (set to your deployed domain on Vercel)

### Optional (local only)

- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`: used by `npm run db:seed` to create the initial admin user
- `NEXT_PUBLIC_ENABLE_WS`: set to `true` only when running the local websocket server (not recommended on Vercel)
- `NEXT_PUBLIC_SOCKET_URL`: websocket server origin (local only)

## Database (Postgres) workflow

Local Postgres development:

```
# set DATABASE_URL first, then:
npx prisma migrate dev
npx prisma generate
npm run db:seed
```

Vercel deployment:

- Set `DATABASE_URL`, `AUTH_SECRET`, and `NEXTAUTH_URL` in Vercel Environment Variables.
- Set the Vercel **Build Command** to `npm run vercel-build` so migrations run during build.

## Contact form

Use the following environment variables when you connect a real email provider.

EMAIL_PROVIDER
EMAIL_FROM
EMAIL_TO

If no provider is configured, the server logs contact submissions in a mock mode.
