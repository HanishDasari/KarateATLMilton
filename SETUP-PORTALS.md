# Setting up the real Parent / Teacher / Admin portals

The portals use **Supabase** (free) for real logins and a real database. The
website stays on Render; Supabase stores the accounts and data. ~15 minutes.

---

## 1. Create a Supabase project
1. Go to <https://supabase.com> → sign up → **New project**.
2. Pick a name and a database password (save it). Wait ~2 min for it to spin up.

## 2. Create the database tables
1. In Supabase, open **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this repo, copy everything, paste it in, click **Run**.
   - This creates the `profiles`, `students`, and `attendance` tables, security
     rules, and an auto-profile trigger.

## 3. Get your keys
1. Supabase → **Project Settings** → **API**.
2. Copy the **Project URL** and the **anon public** key.

## 4. Add the keys to Render (so the live site can use them)
1. Render → your service → **Environment** → **Add Environment Variable**:
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon public key
2. **Manual Deploy → Deploy latest commit.**
   (These are read at *build* time, so a fresh deploy is required after adding them.)

> Local development: copy `.env.example` to `.env` and paste the same two values,
> then `npm run dev`.

## 5. Create the first admin
1. Supabase → **Authentication** → **Users** → **Add user** (email + password).
2. Supabase → **Table Editor** → `profiles` → find that user's row → set **role** to `admin`.
3. Go to `https://your-site/portal`, sign in → you'll land in the **Admin Portal**.

## 6. Add teachers and parents
- **Add user** in Authentication for each teacher/parent (they default to `parent`).
- To make someone a **teacher**, set their `role` to `teacher` in the `profiles` table.
- Parents keep the default `parent` role.

## 7. Add students (so dashboards show real data)
For now, add students in **Table Editor → `students`**:
- `full_name`: the child's name
- `belt`: e.g. White, Yellow, Green…
- `parent_id`: the **id** from that parent's row in the `profiles` table

Once a student is linked to a parent, the parent sees them in the Parent Portal,
teachers can take their attendance, and admins see the totals.

---

## What works today
- **Real login** (email + password) for everyone, role-based dashboards.
- **Parent:** sees their linked children + belt, and a Pay Testing Fee button.
- **Teacher:** sees all students and can **mark attendance** (saved to the database).
- **Admin:** live counts (members, students, weekly check-ins) and a people list.

## Nice next steps (ask anytime)
- In-app **Add Student / assign roles / link parent** forms (so you never touch
  the Supabase table editor).
- Self-serve **parent sign-up** from the free-trial form.
- Belt-test scheduling, messaging, class rosters per time slot.
