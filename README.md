# MossKeep

A Next.js application with Supabase authentication and Drizzle ORM.

## Prerequisites

- Node.js 18+
- A Supabase project

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Copy the example environment file and fill in your Supabase credentials:

   ```bash
   cp .env.example .env.local
   ```

   Required variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `DATABASE_URL` - Your Supabase PostgreSQL connection string

3. **Set up the database**

   Generate migrations from the schema:

   ```bash
   npm run db:generate
   ```

   Apply migrations to your database:

   ```bash
   npm run db:migrate
   ```

   Or push schema directly (for development):

   ```bash
   npm run db:push
   ```

4. **Add foreign key constraint for Supabase auth**

   Run this SQL in your Supabase SQL Editor to link the users table to Supabase auth:

   ```sql
   ALTER TABLE public.users
   ADD CONSTRAINT users_user_id_fkey
   FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate migrations from schema |
| `npm run db:migrate` | Apply migrations to database |
| `npm run db:push` | Push schema directly (dev only) |
| `npm run db:studio` | Open Drizzle Studio GUI |

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [Supabase](https://supabase.com) - Authentication and PostgreSQL database
- [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com) - Styling
