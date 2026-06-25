import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Heart, Shield, Award, LogOut, ChevronLeft, CreditCard, Calendar,
  Users, TrendingUp, Loader2, AlertTriangle,
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

export default function Portal() {
  const { loading, session, profile, configured, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-10 w-auto" badgeClassName="w-10 h-10" />
            <span className="font-bold text-gray-900 hidden sm:inline">Karate Atlanta Milton</span>
          </Link>
          {session ? (
            <Button variant="outline" onClick={signOut} className="border-gray-300 font-semibold">
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
        {!configured ? (
          <NotConfigured />
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

function AdminDashboard() {
  const [counts, setCounts] = useState({ members: 0, students: 0, week: 0 });
  const [members, setMembers] = useState<{ full_name: string | null; role: string }[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
    (async () => {
      const [m, st, wk, list] = await Promise.all([
        supabase!.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'parent'),
        supabase!.from('students').select('id', { count: 'exact', head: true }),
        supabase!.from('attendance').select('id', { count: 'exact', head: true }).gte('date', weekAgo),
        supabase!.from('profiles').select('full_name, role').order('role').limit(12),
      ]);
      setCounts({ members: m.count ?? 0, students: st.count ?? 0, week: wk.count ?? 0 });
      setMembers((list.data as { full_name: string | null; role: string }[]) ?? []);
      setLoaded(true);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat icon={Users} label="Parent Members" value={counts.members} />
        <Stat icon={Award} label="Students" value={counts.students} tone="text-purple-600" />
        <Stat icon={TrendingUp} label="Check-ins (7 days)" value={counts.week} tone="text-emerald-600" />
      </div>

      <Card className="p-6 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-red-600" /> People</h3>
        {!loaded ? <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          : (
            <div className="divide-y divide-gray-100">
              {members.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <span className="font-semibold text-gray-900">{p.full_name || '(no name)'}</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-bold capitalize">{p.role}</span>
                </div>
              ))}
            </div>
          )}
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
