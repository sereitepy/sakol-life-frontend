# Sakol Life Frontend

Sakol Life platform: a study major guidance website that helps Cambodian students find the right university major based on a RIASEC personality quiz.

---

## What it does

- Walks students through a personality quiz and shows ranked major recommendations based on their answers
- Lets students filter and search results by field category, job outlook, and match score
- Shows detailed major pages with subjects, skills, and career paths
- Shows university pages with tuition fees, scholarships, facilities, and admission requirements
- Supports both guest users and registered accounts
- Google OAuth sign in via Supabase
- Bilingual content in English and Khmer (Soon)
- Dark mode support

---

## Tech stack

- Next.js 16 with App Router
- React 19
- Supabase for auth and database
- Radix UI for accessible components
- Tailwind CSS for styling
- next-themes for dark mode
- Deployed on DigitalOcean App Platform

---

## Requirements

- Node.js 18 or higher
- A Supabase project
- The backend API running (see backend README)

---

## Environment variables

Create a `.env.local` file in the root of the project:

```
NEXT_PUBLIC_SITE_URL=https://domain.com
BACKEND_URL=https://your-backend.ondigitalocean.app
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

For production, update these to your real URLs.

`NEXT_PUBLIC_SITE_URL` is important. It is used in the OAuth callback route to redirect the user back to the correct domain after signing in with Google. Without it, the redirect may fall back to the internal container URL instead of your real domain.

---

## Running locally

```bash
git clone https://github.com/your-org/sakollife-frontend.git
cd sakollife-frontend

npm install

# add your .env.local file, then:
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Pages

```
/                       home / landing page
/quiz                   the RIASEC personality quiz
/quiz/results           ranked major recommendations with filters
/majors/[id]            major detail page
/universities/[id]      university detail page
/signup                 sign up page
/login                  login page
/profile                user profile and saved majors
/auth/callback     OAuth callback route for Google sign in
```

---

## Auth

Authentication is handled by Supabase. Users can sign in with Google or create an account with email and password.

The OAuth callback is at `/auth/callback`. After Google redirects back to this route, the app exchanges the code for a Supabase session and redirects the user to the home page.

For this to work correctly, make sure the following are set in your Supabase dashboard under Authentication > URL Configuration:

```
Site URL:
https://domain.com

Redirect URLs:
https://domain.com/auth/callback
http://localhost:3000/auth/callback
```

Guest users can still take the quiz and browse results without an account. Their session is tracked using a randomly generated ID stored in sessionStorage.

---

## Deployment on DigitalOcean App Platform

1. Push your code to GitHub.
2. Create a new App on DigitalOcean and connect your repository.
3. Add all the environment variables listed above in the App settings. Make sure `NEXT_PUBLIC_SITE_URL` is set to your production domain.
4. Deploy.

DigitalOcean will assign a port automatically via the `PORT` environment variable. Next.js picks this up on its own, so you do not need to configure it manually.

If you are using Cloudflare in front of DigitalOcean, set your Cloudflare SSL mode to Full (strict) and point your DNS to DigitalOcean using a CNAME record pointing to your app's `.ondigitalocean.app` domain. Cloudflare supports CNAME flattening for root domains so this works for both `domain.com` and `www.domain.com`.
