import { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Heart, Shield, Award, LogOut, ChevronLeft, CreditCard, Calendar,
  Users, CheckCircle2, TrendingUp, DollarSign,
} from 'lucide-react';
import Logo from '@/components/Logo';

// MyStudio belt-testing payment link (kept in sync with Home.tsx).
const MYSTUDIO_PAY_URL = 'https://cp.mystudio.io/e/?=2185/3778/833962//1781033351';

// ── DEMO credentials (front-end only — NOT real security) ───────────────────
// These let you preview each portal. Replace with real auth/MyStudio for production.
type Role = 'parent' | 'teacher' | 'admin';
const DEMO_USERS: Record<Role, { username: string; password: string; name: string }> = {
  parent: { username: 'parent', password: 'karate123', name: 'Jordan (Parent)' },
  teacher: { username: 'teacher', password: 'karate123', name: 'Mr. Lee (Instructor)' },
  admin: { username: 'admin', password: 'karate123', name: 'Front Desk (Admin)' },
};

const ROLE_META: Record<Role, { title: string; icon: typeof Heart }> = {
  parent: { title: 'Parent Portal', icon: Heart },
  teacher: { title: 'Teacher Portal', icon: Shield },
  admin: { title: 'Admin Portal', icon: Award },
};

const SESSION_KEY = 'ka_portal_session';

export default function Portal() {
  const params = useParams();
  const urlRole = (params.role as Role) || 'parent';
  const role: Role = ['parent', 'teacher', 'admin'].includes(urlRole) ? urlRole : 'parent';

  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY);
      if (s === role) setAuthed(true);
      else setAuthed(false);
    } catch { /* ignore */ }
    setUsername('');
    setPassword('');
    setError('');
  }, [role]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = DEMO_USERS[role];
    if (username.trim().toLowerCase() === u.username && password === u.password) {
      try { localStorage.setItem(SESSION_KEY, role); } catch { /* ignore */ }
      setAuthed(true);
      setError('');
    } else {
      setError('Incorrect username or password. Use the demo credentials shown below.');
    }
  };

  const handleLogout = () => {
    try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
    setAuthed(false);
  };

  const Meta = ROLE_META[role];
  const Icon = Meta.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-10 w-auto" badgeClassName="w-10 h-10" />
            <span className="font-bold text-gray-900 hidden sm:inline">Karate Atlanta Milton</span>
          </Link>
          {authed ? (
            <Button variant="outline" onClick={handleLogout} className="border-gray-300 font-semibold">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          ) : (
            <Link href="/" className="text-sm text-gray-600 hover:text-red-600 font-semibold inline-flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Back to site
            </Link>
          )}
        </div>
      </header>

      {/* Role switcher */}
      <div className="container mx-auto px-4 pt-6">
        <div className="flex flex-wrap gap-2">
          {(['parent', 'teacher', 'admin'] as Role[]).map((r) => (
            <Link
              key={r}
              href={`/portal/${r}`}
              className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                r === role ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:text-gray-900'
              }`}
            >
              {ROLE_META[r].title}
            </Link>
          ))}
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {!authed ? (
          /* ---------- LOGIN ---------- */
          <div className="max-w-md mx-auto">
            <Card className="p-8 border-gray-200">
              <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mb-5">
                <Icon className="w-7 h-7 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{Meta.title}</h1>
              <p className="text-gray-500 mb-6 text-sm">Sign in to access your dashboard.</p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none"
                    placeholder="Enter username"
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none"
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold">
                  Sign In
                </Button>
              </form>
              <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm">
                <p className="font-bold text-amber-800 mb-1">🔑 Demo credentials</p>
                <p className="text-amber-700">
                  Username: <code className="font-mono font-bold">{DEMO_USERS[role].username}</code><br />
                  Password: <code className="font-mono font-bold">{DEMO_USERS[role].password}</code>
                </p>
                <p className="text-amber-700/80 text-xs mt-2">
                  Demo preview only — not connected to real accounts or data.
                </p>
              </div>
            </Card>
          </div>
        ) : (
          /* ---------- DASHBOARD ---------- */
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <Icon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{Meta.title}</h1>
                <p className="text-gray-500 text-sm">Welcome back, {DEMO_USERS[role].name}</p>
              </div>
            </div>

            {role === 'parent' && <ParentDashboard />}
            {role === 'teacher' && <TeacherDashboard />}
            {role === 'admin' && <AdminDashboard />}

            <p className="text-center text-xs text-gray-400 mt-10">
              This is a demo dashboard with sample data. Real membership data lives in MyStudio.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

/* ============================ ROLE DASHBOARDS ============================ */

function Stat({ icon: Icon, label, value, tone = 'text-red-600' }: { icon: typeof Heart; label: string; value: string; tone?: string }) {
  return (
    <Card className="p-5 border-gray-200">
      <Icon className={`w-6 h-6 ${tone} mb-3`} />
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </Card>
  );
}

function ParentDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat icon={Award} label="Current Belt" value="Green" />
        <Stat icon={Calendar} label="Next Class" value="Mon 5:00 PM" />
        <Stat icon={CheckCircle2} label="Classes This Month" value="9" tone="text-emerald-600" />
      </div>

      <Card className="p-6 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-red-600" /> Belt Progress</h3>
        <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
          <div className="bg-gradient-to-r from-red-600 to-red-500 h-3 rounded-full" style={{ width: '65%' }} />
        </div>
        <p className="text-sm text-gray-500">65% toward next belt test. Keep it up!</p>
      </Card>

      <Card className="p-6 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><CreditCard className="w-5 h-5 text-red-600" /> Belt Testing Fee</h3>
        <p className="text-sm text-gray-500 mb-4">Your child is eligible for the next belt test. Pay the testing fee securely through MyStudio.</p>
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-bold">
          <a href={MYSTUDIO_PAY_URL} target="_blank" rel="noopener noreferrer">Pay Testing Fee</a>
        </Button>
      </Card>
    </div>
  );
}

function TeacherDashboard() {
  const roster = [
    { name: 'Ava M.', belt: 'Yellow', present: true },
    { name: 'Liam K.', belt: 'Green', present: true },
    { name: 'Noah R.', belt: 'White', present: false },
    { name: 'Mia S.', belt: 'Blue', present: true },
  ];
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat icon={Calendar} label="Today's Classes" value="4" />
        <Stat icon={Users} label="Students Today" value="32" tone="text-blue-600" />
        <Stat icon={Award} label="Testing This Week" value="6" tone="text-purple-600" />
      </div>

      <Card className="p-6 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-red-600" /> Juniors 5:00 PM — Attendance</h3>
        <div className="divide-y divide-gray-100">
          {roster.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div>
                <span className="font-semibold text-gray-900">{s.name}</span>
                <span className="ml-3 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{s.belt} Belt</span>
              </div>
              <span className={`text-sm font-bold ${s.present ? 'text-emerald-600' : 'text-gray-400'}`}>
                {s.present ? '✓ Present' : 'Absent'}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-4">
        <Stat icon={Users} label="Active Members" value="214" />
        <Stat icon={TrendingUp} label="New This Month" value="18" tone="text-emerald-600" />
        <Stat icon={DollarSign} label="Monthly Revenue" value="$38.2k" tone="text-emerald-600" />
        <Stat icon={Calendar} label="Trials Booked" value="11" tone="text-blue-600" />
      </div>

      <Card className="p-6 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-red-600" /> This Week</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between border-b border-gray-100 py-2"><span className="text-gray-500">Memberships sold</span><span className="font-bold text-gray-900">7</span></div>
          <div className="flex justify-between border-b border-gray-100 py-2"><span className="text-gray-500">Testing fees collected</span><span className="font-bold text-gray-900">$1,140</span></div>
          <div className="flex justify-between border-b border-gray-100 py-2"><span className="text-gray-500">Free trials completed</span><span className="font-bold text-gray-900">9</span></div>
          <div className="flex justify-between border-b border-gray-100 py-2"><span className="text-gray-500">Retention rate</span><span className="font-bold text-emerald-600">94%</span></div>
        </div>
      </Card>

      <Card className="p-6 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><CreditCard className="w-5 h-5 text-red-600" /> Payments</h3>
        <p className="text-sm text-gray-500 mb-4">Manage billing, memberships, and testing fees in MyStudio.</p>
        <Button asChild className="bg-gray-900 hover:bg-red-600 text-white font-bold">
          <a href={MYSTUDIO_PAY_URL} target="_blank" rel="noopener noreferrer">Open Payments</a>
        </Button>
      </Card>
    </div>
  );
}
