import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Heart, Shield, Award, LogOut, ChevronLeft, CreditCard, Calendar,
  Users, TrendingUp, Loader2, AlertTriangle, Plus, Trash2,
} from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, type Role } from '@/lib/supabase';

const MYSTUDIO_PAY_URL = 'https://cp.mystudio.io/e/?=2185/3778/833962//1781033351';

const ROLE_META: Record<Role, { title: string; icon: typeof Heart }> = {
  parent: { title: 'Parent Portal', icon: Heart },
  teacher: { title: 'Teacher Portal', icon: Shield },
  admin: { title: 'Admin Portal', icon: Award },
};

const DEMO_KEY = 'ka_demo_role';

export default function Portal() {
  const { loading, session, profile, configured, signOut } = useAuth();

  // Demo mode is active whenever real Supabase auth isn't configured yet.
  const demoMode = !configured;
  const [demoRole, setDemoRole] = useState<Role | null>(() => {
    try { return (localStorage.getItem(DEMO_KEY) as Role) || null; } catch { return null; }
  });

  const authed = demoMode ? !!demoRole : !!session;

  const loginDemo = (role: Role) => {
    try { localStorage.setItem(DEMO_KEY, role); } catch { /* ignore */ }
    setDemoRole(role);
  };
  const handleSignOut = async () => {
    if (demoMode) {
      try { localStorage.removeItem(DEMO_KEY); } catch { /* ignore */ }
      setDemoRole(null);
    } else {
      await signOut();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-10 w-auto" badgeClassName="w-10 h-10" />
            <span className="font-bold text-gray-900 hidden sm:inline">Karate Atlanta Milton</span>
          </Link>
          {authed ? (
            <Button variant="outline" onClick={handleSignOut} className="border-gray-300 font-semibold">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          ) : (
            <Link href="/" className="text-sm text-gray-600 hover:text-red-600 font-semibold inline-flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Back to site
            </Link>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {demoMode ? (
          !demoRole ? <DemoLogin onLogin={loginDemo} /> : <DemoDashboard role={demoRole} onSwitch={loginDemo} />
        ) : loading ? (
          <Centered><Loader2 className="w-8 h-8 text-red-600 animate-spin" /></Centered>
        ) : !session ? (
          <LoginForm />
        ) : !profile ? (
          <Notice title="Account pending setup" body="Your login worked, but no role is assigned yet. Ask an admin to set your role in the dashboard." />
        ) : (
          <Dashboard />
        )}
      </main>
    </div>
  );
}

/* ===================== TEMPORARY HARDCODED LOGIN (demo) ===================== */
// Active only until Supabase keys are added. Username = role, shared password.
const DEMO_PASSWORD = 'karate123';

function DemoLogin({ onLogin }: { onLogin: (role: Role) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = (['parent', 'teacher', 'admin'] as Role[]).find((r) => r === username.trim().toLowerCase());
    if (role && password === DEMO_PASSWORD) { onLogin(role); setError(''); }
    else setError('Try username "parent", "teacher", or "admin" with the demo password below.');
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-8 border-gray-200">
        <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mb-5">
          <Shield className="w-7 h-7 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Portal Sign In</h1>
        <p className="text-gray-500 mb-6 text-sm">Sign in to preview the Parent, Teacher, or Admin portal.</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="parent / teacher / admin"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none" autoComplete="username" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none" autoComplete="current-password" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold">Sign In</Button>
        </form>
        <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm">
          <p className="font-bold text-amber-800 mb-1">🔑 Temporary demo logins</p>
          <p className="text-amber-700">
            Username: <code className="font-mono font-bold">parent</code>, <code className="font-mono font-bold">teacher</code>, or <code className="font-mono font-bold">admin</code><br />
            Password: <code className="font-mono font-bold">{DEMO_PASSWORD}</code>
          </p>
          <p className="text-amber-700/80 text-xs mt-2">Preview only with sample data. Real logins activate once Supabase keys are added.</p>
        </div>
      </Card>
    </div>
  );
}

function DemoDashboard({ role, onSwitch }: { role: Role; onSwitch: (r: Role) => void }) {
  const Meta = ROLE_META[role];
  const Icon = Meta.icon;
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-6">
        {(['parent', 'teacher', 'admin'] as Role[]).map((r) => (
          <button key={r} onClick={() => onSwitch(r)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition ${r === role ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:text-gray-900'}`}>
            {ROLE_META[r].title}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center"><Icon className="w-6 h-6 text-red-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{Meta.title}</h1>
          <p className="text-gray-500 text-sm">Demo preview — sample data</p>
        </div>
      </div>
      {role === 'parent' && <DemoParent />}
      {role === 'teacher' && <DemoTeacher />}
      {role === 'admin' && <DemoAdmin />}
      <p className="text-center text-xs text-gray-400 mt-10">Demo data. Connect Supabase (see SETUP-PORTALS.md) for real accounts and data.</p>
    </div>
  );
}

function DemoParent() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat icon={Award} label="Current Belt" value="Green" />
        <Stat icon={Calendar} label="Next Class" value="Mon 5:00 PM" />
        <Stat icon={Users} label="Classes This Month" value={9} tone="text-emerald-600" />
      </div>
      <Card className="p-6 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-red-600" /> Belt Progress</h3>
        <div className="w-full bg-gray-100 rounded-full h-3 mb-2"><div className="bg-gradient-to-r from-red-600 to-red-500 h-3 rounded-full" style={{ width: '65%' }} /></div>
        <p className="text-sm text-gray-500">65% toward next belt test.</p>
      </Card>
      <Card className="p-6 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><CreditCard className="w-5 h-5 text-red-600" /> Belt Testing Fee</h3>
        <p className="text-sm text-gray-500 mb-4">Pay belt-testing fees securely through MyStudio.</p>
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-bold">
          <a href={MYSTUDIO_PAY_URL} target="_blank" rel="noopener noreferrer">Pay Testing Fee</a>
        </Button>
      </Card>
    </div>
  );
}

function DemoTeacher() {
  const roster = [
    { name: 'Ava M.', belt: 'Yellow', present: true },
    { name: 'Liam K.', belt: 'Green', present: true },
    { name: 'Noah R.', belt: 'White', present: false },
    { name: 'Mia S.', belt: 'Blue', present: true },
  ];
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat icon={Calendar} label="Today's Classes" value={4} />
        <Stat icon={Users} label="Students Today" value={32} tone="text-blue-600" />
        <Stat icon={Award} label="Testing This Week" value={6} tone="text-purple-600" />
      </div>
      <Card className="p-6 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-red-600" /> Juniors 5:00 PM — Attendance</h3>
        <div className="divide-y divide-gray-100">
          {roster.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div><span className="font-semibold text-gray-900">{s.name}</span><span className="ml-3 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{s.belt} Belt</span></div>
              <span className={`text-sm font-bold ${s.present ? 'text-emerald-600' : 'text-gray-400'}`}>{s.present ? '✓ Present' : 'Absent'}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DemoAdmin() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-4">
        <Stat icon={Users} label="Active Members" value={214} />
        <Stat icon={TrendingUp} label="New This Month" value={18} tone="text-emerald-600" />
        <Stat icon={CreditCard} label="Monthly Revenue" value="$38.2k" tone="text-emerald-600" />
        <Stat icon={Calendar} label="Trials Booked" value={11} tone="text-blue-600" />
      </div>
      <Card className="p-6 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-red-600" /> This Week</h3>
        <div className="grid sm:grid-cols-2 gap-x-8 text-sm">
          <div className="flex justify-between border-b border-gray-100 py-2"><span className="text-gray-500">Memberships sold</span><span className="font-bold text-gray-900">7</span></div>
          <div className="flex justify-between border-b border-gray-100 py-2"><span className="text-gray-500">Testing fees collected</span><span className="font-bold text-gray-900">$1,140</span></div>
          <div className="flex justify-between border-b border-gray-100 py-2"><span className="text-gray-500">Free trials completed</span><span className="font-bold text-gray-900">9</span></div>
          <div className="flex justify-between border-b border-gray-100 py-2"><span className="text-gray-500">Retention rate</span><span className="font-bold text-emerald-600">94%</span></div>
        </div>
      </Card>
      <Card className="p-6 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><CreditCard className="w-5 h-5 text-red-600" /> Payments</h3>
        <p className="text-sm text-gray-500 mb-4">Manage billing and testing fees in MyStudio.</p>
        <Button asChild className="bg-gray-900 hover:bg-red-600 text-white font-bold">
          <a href={MYSTUDIO_PAY_URL} target="_blank" rel="noopener noreferrer">Open Payments</a>
        </Button>
      </Card>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-center py-20">{children}</div>;
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="max-w-md mx-auto">
      <Card className="p-8 border-gray-200 text-center">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 text-sm">{body}</p>
      </Card>
    </div>
  );
}

function NotConfigured() {
  return (
    <Notice
      title="Portals aren't connected yet"
      body="The site owner needs to add the Supabase keys (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) to enable real logins. See SETUP-PORTALS.md."
    />
  );
}

/* ----------------------------- LOGIN ----------------------------- */
function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error } = await signIn(email.trim(), password);
    if (error) setError(error);
    setBusy(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-8 border-gray-200">
        <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mb-5">
          <Shield className="w-7 h-7 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Member Sign In</h1>
        <p className="text-gray-500 mb-6 text-sm">Parents, teachers, and admins sign in here. Your dashboard is chosen by your account role.</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none"
              placeholder="you@email.com" autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none"
              placeholder="••••••••" autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
          </Button>
        </form>
        <p className="text-xs text-gray-400 mt-6 text-center">
          New family? <Link href="/#contact" className="text-red-600 font-bold">Book a free trial</Link> and we’ll create your account.
        </p>
      </Card>
    </div>
  );
}

/* --------------------------- DASHBOARD --------------------------- */
function Dashboard() {
  const { profile } = useAuth();
  if (!profile) return null;
  const Meta = ROLE_META[profile.role];
  const Icon = Meta.icon;
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
          <Icon className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{Meta.title}</h1>
          <p className="text-gray-500 text-sm">Welcome back{profile.full_name ? `, ${profile.full_name}` : ''}</p>
        </div>
      </div>
      {profile.role === 'parent' && <ParentDashboard />}
      {profile.role === 'teacher' && <TeacherDashboard />}
      {profile.role === 'admin' && <AdminDashboard />}
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone = 'text-red-600' }: { icon: typeof Heart; label: string; value: string | number; tone?: string }) {
  return (
    <Card className="p-5 border-gray-200">
      <Icon className={`w-6 h-6 ${tone} mb-3`} />
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </Card>
  );
}

interface Student { id: string; full_name: string; belt: string | null; parent_id: string | null; }

function ParentDashboard() {
  const { session } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!supabase || !session) return;
    supabase.from('students').select('id, full_name, belt, parent_id').eq('parent_id', session.user.id)
      .then(({ data }) => { setStudents((data as Student[]) ?? []); setLoaded(true); });
  }, [session]);

  return (
    <div className="space-y-6">
      <Card className="p-6 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-red-600" /> My Students</h3>
        {!loaded ? <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          : students.length === 0 ? <p className="text-sm text-gray-500">No students linked to your account yet. Ask the front desk to add your child.</p>
          : (
            <div className="divide-y divide-gray-100">
              {students.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-3">
                  <span className="font-semibold text-gray-900">{s.full_name}</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-bold">{s.belt || 'White'} Belt</span>
                </div>
              ))}
            </div>
          )}
      </Card>

      <Card className="p-6 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><CreditCard className="w-5 h-5 text-red-600" /> Belt Testing Fee</h3>
        <p className="text-sm text-gray-500 mb-4">Pay belt-testing fees securely through MyStudio.</p>
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-bold">
          <a href={MYSTUDIO_PAY_URL} target="_blank" rel="noopener noreferrer">Pay Testing Fee</a>
        </Button>
      </Card>
    </div>
  );
}

function TeacherDashboard() {
  const { session } = useAuth();
  const today = new Date().toISOString().slice(0, 10);
  const [students, setStudents] = useState<Student[]>([]);
  const [present, setPresent] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  async function refresh() {
    if (!supabase) return;
    const [{ data: studs }, { data: att }] = await Promise.all([
      supabase.from('students').select('id, full_name, belt, parent_id').order('full_name'),
      supabase.from('attendance').select('student_id').eq('date', today).eq('present', true),
    ]);
    setStudents((studs as Student[]) ?? []);
    setPresent(new Set(((att as { student_id: string }[]) ?? []).map((a) => a.student_id)));
    setLoaded(true);
  }
  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, []);

  async function markPresent(studentId: string) {
    if (!supabase || !session) return;
    await supabase.from('attendance').upsert(
      { student_id: studentId, date: today, present: true, marked_by: session.user.id },
      { onConflict: 'student_id,date' },
    );
    setPresent((prev) => new Set(prev).add(studentId));
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat icon={Users} label="Total Students" value={students.length} />
        <Stat icon={Calendar} label="Present Today" value={present.size} tone="text-emerald-600" />
        <Stat icon={Award} label="Date" value={today} tone="text-blue-600" />
      </div>

      <Card className="p-6 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-red-600" /> Take Attendance — {today}</h3>
        {!loaded ? <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          : students.length === 0 ? <p className="text-sm text-gray-500">No students yet. Add students from the Admin portal.</p>
          : (
            <div className="divide-y divide-gray-100">
              {students.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-semibold text-gray-900">{s.full_name}</span>
                    <span className="ml-3 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{s.belt || 'White'} Belt</span>
                  </div>
                  {present.has(s.id) ? (
                    <span className="text-sm font-bold text-emerald-600">✓ Present</span>
                  ) : (
                    <Button onClick={() => markPresent(s.id)} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 font-bold h-9">
                      Mark Present
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
      </Card>
    </div>
  );
}

const BELTS = ['White', 'Yellow', 'Orange', 'Green', 'Blue', 'Purple', 'Red', 'Brown', 'Black'];
const selectCls = 'px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none';

interface ProfileRow { id: string; full_name: string | null; role: Role; }

function AdminDashboard() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [week, setWeek] = useState(0);
  const [loaded, setLoaded] = useState(false);

  async function refresh() {
    if (!supabase) return;
    const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
    const [p, s, wk] = await Promise.all([
      supabase.from('profiles').select('id, full_name, role').order('role'),
      supabase.from('students').select('id, full_name, belt, parent_id').order('full_name'),
      supabase.from('attendance').select('id', { count: 'exact', head: true }).gte('date', weekAgo),
    ]);
    setProfiles((p.data as ProfileRow[]) ?? []);
    setStudents((s.data as Student[]) ?? []);
    setWeek(wk.count ?? 0);
    setLoaded(true);
  }
  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, []);

  const parents = profiles.filter((p) => p.role === 'parent');
  const memberCount = parents.length;

  if (!loaded) return <Centered><Loader2 className="w-8 h-8 text-red-600 animate-spin" /></Centered>;

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat icon={Users} label="Parent Members" value={memberCount} />
        <Stat icon={Award} label="Students" value={students.length} tone="text-purple-600" />
        <Stat icon={TrendingUp} label="Check-ins (7 days)" value={week} tone="text-emerald-600" />
      </div>

      <AddStudentForm parents={parents} onChange={refresh} />

      <Card className="p-6 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-red-600" /> Students</h3>
        {students.length === 0 ? <p className="text-sm text-gray-500">No students yet — add one above.</p> : (
          <div className="divide-y divide-gray-100">
            {students.map((s) => <StudentRow key={s.id} s={s} parents={parents} onChange={refresh} />)}
          </div>
        )}
      </Card>

      <Card className="p-6 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2"><Users className="w-5 h-5 text-red-600" /> People &amp; Roles</h3>
        <p className="text-sm text-gray-500 mb-4">Set names and roles. Create the accounts in Supabase → Authentication; they appear here.</p>
        <div className="divide-y divide-gray-100">
          {profiles.map((p) => <PersonRow key={p.id} p={p} onSaved={refresh} />)}
        </div>
      </Card>

      <Card className="p-6 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><CreditCard className="w-5 h-5 text-red-600" /> Payments</h3>
        <p className="text-sm text-gray-500 mb-4">Manage billing and testing fees in MyStudio.</p>
        <Button asChild className="bg-gray-900 hover:bg-red-600 text-white font-bold">
          <a href={MYSTUDIO_PAY_URL} target="_blank" rel="noopener noreferrer">Open Payments</a>
        </Button>
      </Card>
    </div>
  );
}

function AddStudentForm({ parents, onChange }: { parents: ProfileRow[]; onChange: () => void }) {
  const [name, setName] = useState('');
  const [belt, setBelt] = useState('White');
  const [parentId, setParentId] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !name.trim()) return;
    setBusy(true); setMsg('');
    const { error } = await supabase.from('students').insert({
      full_name: name.trim(), belt, parent_id: parentId || null,
    });
    setBusy(false);
    if (error) { setMsg(error.message); return; }
    setName(''); setBelt('White'); setParentId(''); setMsg('✓ Student added');
    onChange();
  };

  return (
    <Card className="p-6 border-gray-200">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-red-600" /> Add Student</h3>
      <form onSubmit={submit} className="grid sm:grid-cols-[1fr_auto_1fr_auto] gap-3 items-center">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Student name" required
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none" />
        <select value={belt} onChange={(e) => setBelt(e.target.value)} className={selectCls}>
          {BELTS.map((b) => <option key={b} value={b}>{b} Belt</option>)}
        </select>
        <select value={parentId} onChange={(e) => setParentId(e.target.value)} className={selectCls}>
          <option value="">— Link a parent (optional) —</option>
          {parents.map((p) => <option key={p.id} value={p.id}>{p.full_name || '(unnamed parent)'}</option>)}
        </select>
        <Button type="submit" disabled={busy} className="bg-red-600 hover:bg-red-700 text-white font-bold">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
        </Button>
      </form>
      {msg && <p className="text-sm mt-3 text-gray-600">{msg}</p>}
    </Card>
  );
}

function StudentRow({ s, parents, onChange }: { s: Student; parents: ProfileRow[]; onChange: () => void }) {
  const [belt, setBelt] = useState(s.belt ?? 'White');
  const [parentId, setParentId] = useState(s.parent_id ?? '');
  const [busy, setBusy] = useState(false);
  const dirty = belt !== (s.belt ?? 'White') || (parentId || '') !== (s.parent_id ?? '');

  const save = async () => {
    if (!supabase) return;
    setBusy(true);
    await supabase.from('students').update({ belt, parent_id: parentId || null }).eq('id', s.id);
    setBusy(false); onChange();
  };
  const del = async () => {
    if (!supabase || !window.confirm(`Remove ${s.full_name}?`)) return;
    await supabase.from('students').delete().eq('id', s.id);
    onChange();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-3">
      <span className="font-semibold text-gray-900 flex-1 min-w-[120px]">{s.full_name}</span>
      <select value={belt} onChange={(e) => setBelt(e.target.value)} className={selectCls}>
        {BELTS.map((b) => <option key={b} value={b}>{b} Belt</option>)}
      </select>
      <select value={parentId} onChange={(e) => setParentId(e.target.value)} className={selectCls}>
        <option value="">— No parent —</option>
        {parents.map((p) => <option key={p.id} value={p.id}>{p.full_name || '(unnamed parent)'}</option>)}
      </select>
      <Button onClick={save} disabled={!dirty || busy} variant="outline" className="border-gray-300 font-bold h-9">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
      </Button>
      <Button onClick={del} variant="ghost" className="text-gray-400 hover:text-red-600 h-9 px-2" aria-label="Delete">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

function PersonRow({ p, onSaved }: { p: ProfileRow; onSaved: () => void }) {
  const [name, setName] = useState(p.full_name ?? '');
  const [role, setRole] = useState<Role>(p.role);
  const [busy, setBusy] = useState(false);
  const dirty = name !== (p.full_name ?? '') || role !== p.role;

  const save = async () => {
    if (!supabase) return;
    setBusy(true);
    await supabase.from('profiles').update({ full_name: name, role }).eq('id', p.id);
    setBusy(false); onSaved();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-3">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name"
        className="flex-1 min-w-[140px] px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none" />
      <select value={role} onChange={(e) => setRole(e.target.value as Role)} className={selectCls}>
        <option value="parent">Parent</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin</option>
      </select>
      <Button onClick={save} disabled={!dirty || busy} variant="outline" className="border-gray-300 font-bold h-9">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
      </Button>
    </div>
  );
}
