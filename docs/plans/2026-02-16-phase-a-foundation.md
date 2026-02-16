# Phase A: Foundation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add authentication, database persistence, and user dashboard to transform the audit tool into a SaaS product.

**Architecture:** Use Supabase Auth for authentication, create database tables for users/projects/audits, build a protected dashboard route, and integrate with existing Zustand store.

**Tech Stack:** Supabase (Auth + Database), Next.js 16 App Router, Zustand, @supabase/ssr

---

## Prerequisites

Before starting, user needs to:
1. Create a Supabase project at supabase.com
2. Get credentials (URL + anon key)
3. Add them to `.env.local`

---

## Task 1: Create Database Schema

**Files:**
- Supabase SQL Editor (run manually)
- No code files

**Step 1: Run SQL to create tables**

Execute this in Supabase SQL Editor:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects table (for agencies managing multiple clients)
create table projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  website text,
  business_type text,
  monthly_budget integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Audits table (store completed audits)
create table audits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references projects(id) on delete set null,
  platform text not null,
  score integer,
  grade text,
  data jsonb,
  status text default 'completed',
  created_at timestamptz default now()
);

-- Audit drafts table (save progress)
create table audit_drafts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references projects(id) on delete set null,
  platform text not null,
  responses jsonb not null,
  current_step integer default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table projects enable row level security;
alter table audits enable row level security;
alter table audit_drafts enable row level security;

-- RLS Policies
create policy "Users can view own projects" on projects for select using (auth.uid() = user_id);
create policy "Users can create projects" on projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on projects for delete using (auth.uid() = user_id);

create policy "Users can view own audits" on audits for select using (auth.uid() = user_id);
create policy "Users can create audits" on audits for insert with check (auth.uid() = user_id);

create policy "Users can view own drafts" on audit_drafts for select using (auth.uid() = user_id);
create policy "Users can create drafts" on audit_drafts for insert with check (auth.uid() = user_id);
create policy "Users can update own drafts" on audit_drafts for update using (auth.uid() = user_id);
create policy "Users can delete own drafts" on audit_drafts for delete using (auth.uid() = user_id);
```

---

## Task 2: Create Auth Context Provider

**Files:**
- Create: `components/providers/AuthProvider.tsx`
- Modify: `app/layout.tsx`

**Step 1: Create AuthProvider component**

```typescript
// components/providers/AuthProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

**Step 2: Wrap app in AuthProvider**

Modify `app/layout.tsx`:
```typescript
import { AuthProvider } from '@/components/providers/AuthProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

## Task 3: Create Login Page

**Files:**
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/signup/page.tsx`
- Modify: `app/layout.tsx` (remove Header from auth routes)

**Step 1: Create login page**

```typescript
// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/dashboard` },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 p-2 rounded hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            Continue with Google
          </button>
        </div>

        <p className="mt-4 text-center text-sm">
          Don't have an account? <Link href="/signup" className="text-blue-600">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
```

**Step 2: Create signup page (similar structure)**

```typescript
// app/(auth)/signup/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/dashboard` },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Check your email</h1>
          <p>We sent a confirmation link to {email}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              minLength={6}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account? <Link href="/login" className="text-blue-600">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
```

---

## Task 4: Create User Dashboard

**Files:**
- Create: `app/(dashboard)/dashboard/page.tsx`
- Create: `components/dashboard/AuditHistory.tsx`
- Create: `components/dashboard/ProjectList.tsx`

**Step 1: Create dashboard page**

```typescript
// app/(dashboard)/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';

interface Audit {
  id: string;
  platform: string;
  score: number;
  grade: string;
  created_at: string;
  project_name: string;
}

interface Project {
  id: string;
  name: string;
  website: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const [auditsRes, projectsRes] = await Promise.all([
      supabase.from('audits').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
    ]);

    if (auditsRes.data) setAudits(auditsRes.data);
    if (projectsRes.data) setProjects(projectsRes.data);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.email}</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/audit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              New Audit
            </Link>
            <button
              onClick={handleSignOut}
              className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600">{audits.length}</div>
            <div className="text-gray-600">Total Audits</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600">{projects.length}</div>
            <div className="text-gray-600">Projects</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-purple-600">
              {audits.length > 0 ? Math.round(audits.reduce((sum, a) => sum + a.score, 0) / audits.length) : 0}
            </div>
            <div className="text-gray-600">Avg Score</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-orange-600">
              {audits.filter(a => a.score >= 90).length}
            </div>
            <div className="text-gray-600">A Grade Audits</div>
          </div>
        </div>

        {/* Recent Audits */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Recent Audits</h2>
          </div>
          {audits.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No audits yet. <Link href="/audit" className="text-blue-600">Start your first audit</Link>
            </div>
          ) : (
            <div className="divide-y">
              {audits.map((audit) => (
                <div key={audit.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <div className="font-medium">{audit.project_name}</div>
                    <div className="text-sm text-gray-500">{audit.platform} • {new Date(audit.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-bold ${
                      audit.grade === 'A' ? 'text-green-600' :
                      audit.grade === 'B' ? 'text-blue-600' :
                      audit.grade === 'C' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {audit.grade}
                    </span>
                    <span className="text-lg">{audit.score}/100</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Projects</h2>
            <button className="text-blue-600 hover:underline">+ Add Project</button>
          </div>
          {projects.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No projects yet. Create a project to organize your audits.
            </div>
          ) : (
            <div className="divide-y">
              {projects.map((project) => (
                <div key={project.id} className="p-4 hover:bg-gray-50">
                  <div className="font-medium">{project.name}</div>
                  {project.website && (
                    <div className="text-sm text-gray-500">{project.website}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## Task 5: Update Header with Auth State

**Files:**
- Modify: `components/layout/Header.tsx`

**Step 1: Update Header component**

```typescript
// components/layout/Header.tsx (update existing)
'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';

export function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Claude Ads
        </Link>
        
        <nav className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <Link href="/dashboard" className="text-blue-600 hover:underline">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600 hover:text-gray-900">
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
```

---

## Task 6: Update Audit Store with Supabase Integration

**Files:**
- Modify: `store/audit-store.ts`

**Step 1: Update saveAuditToDb function**

The existing function is close but needs adjustment for the new schema:

```typescript
// Updated saveAuditToDb in store/audit-store.ts
saveAuditToDb: async (platform: Platform, score: number, data: any) => {
  const { createClient } = await import('@/lib/supabase/client');
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'User not authenticated' };

  const grade = scoreToGrade(score);

  const { error } = await supabase.from('audits').insert({
    user_id: user.id,
    platform,
    score,
    grade,
    data,
    project_name: get().formData.businessInfo?.name || 'Untitled Audit',
  });

  return { error };
},
```

---

## Task 7: Add Middleware for Protected Routes

**Files:**
- Modify: `middleware.ts`

**Step 1: Add route protection**

```typescript
// middleware.ts - add protected routes check
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(/* ... existing config ... */);

  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/audit'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Auth routes that should redirect to dashboard if already logged in
  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.some(route => pathname === route);

  if (isProtectedRoute && !user) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}
```

---

## Task 8: Test End-to-End Flow

**Step 1: Build the project**

Run: `npm run build`
Expected: Success with no TypeScript errors

**Step 2: Test locally**

1. Start dev server: `npm run dev`
2. Navigate to /login
3. Sign up with email/password
4. Verify redirect to /dashboard
5. Click "New Audit" 
6. Complete an audit
7. Verify audit appears in dashboard history

**Step 3: Commit changes**

```bash
git add -A
git commit -m "feat: add authentication and user dashboard

- Add Supabase Auth integration
- Create login/signup pages
- Build user dashboard with audit history
- Add protected routes via middleware
- Update audit store with DB persistence"
```

---

## Summary

| Task | Description | Est. Time |
|------|-------------|-----------|
| 1 | Create database schema | 10 min (SQL) |
| 2 | Create AuthProvider | 10 min |
| 3 | Create login/signup pages | 20 min |
| 4 | Create dashboard | 25 min |
| 5 | Update Header | 5 min |
| 6 | Update audit store | 10 min |
| 7 | Add middleware protection | 10 min |
| 8 | Test and commit | 15 min |
| **Total** | | **~1.5 hours** |
