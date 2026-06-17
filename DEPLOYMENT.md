# BB2 Burger — Deployment Guide

## 1. Setup Supabase

1. Go to https://supabase.com and create a new project.
2. In the **SQL Editor**, run `supabase/schema.sql` first, then `supabase/seed.sql`.
3. In **Storage → Buckets**, create a bucket named `images` and set it to **Public**.
4. Add these storage policies in the SQL editor:

```sql
insert into storage.buckets (id, name, public) values ('images', 'images', true);

create policy "Public read images" on storage.objects
  for select using (bucket_id = 'images');

create policy "Auth upload images" on storage.objects
  for insert with check (bucket_id = 'images' and auth.role() = 'authenticated');

create policy "Auth delete images" on storage.objects
  for delete using (bucket_id = 'images' and auth.role() = 'authenticated');
```

5. In **Authentication → Users**, click **Add user** and create the admin account (email + password). No public registration is needed.
6. Copy your **Project URL** and **anon public key** from **Settings → API**.

---

## 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 3. Run Locally

```bash
cd bb2-react
npm install
npm run dev
```

Open http://localhost:5173

Admin panel: http://localhost:5173/admin/login

---

## 4. Deploy to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
cd bb2-react
vercel
```

When prompted:
- Framework: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

Then add environment variables in Vercel Dashboard → Project → Settings → Environment Variables:

```
VITE_SUPABASE_URL       = https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY  = eyJ...
```

Redeploy after adding env vars.

### Option B — Vercel Dashboard (GitHub)

1. Push `bb2-react` folder to a GitHub repository.
2. Go to https://vercel.com/new → Import repository.
3. Set **Root Directory** to `bb2-react` (if it is a subfolder).
4. Add the two environment variables.
5. Click **Deploy**.

---

## 5. Admin Access

URL: `https://your-domain.vercel.app/admin/login`

Login with the email/password you created in Supabase Auth.

From the admin panel you can:
- Manage **Categories** (add, edit, delete)
- Manage **Menu Items** (add, edit, delete, toggle availability, mark featured)
- Moderate **Reviews** (approve/reject)
- Update **Settings** (brand name, WhatsApp number, address, logo, banners)

---

## 6. WhatsApp Number

Go to Admin → Settings and update `whatsapp_number` to your number in international format **without** the `+` sign.

Example: `201006473229` (Egypt)

---

## 7. Project Structure

```
bb2-react/
├── src/
│   ├── components/
│   │   ├── admin/          # Admin dashboard panels
│   │   ├── home/           # Hero, Reviews slider, Review form
│   │   ├── layout/         # Navbar, Footer, StickyCart
│   │   └── ui/             # ProductCard, Toast
│   ├── context/            # Cart, Favorites, Toast state
│   ├── hooks/              # useSettings (Supabase settings table)
│   ├── lib/                # supabase.js client
│   └── pages/
│       ├── admin/          # AdminLogin, AdminDashboard
│       ├── Home.jsx
│       ├── Menu.jsx
│       ├── Product.jsx
│       ├── Cart.jsx
│       └── Favorites.jsx
├── supabase/
│   ├── schema.sql          # Database tables + RLS policies
│   └── seed.sql            # All original JSON data migrated
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```
