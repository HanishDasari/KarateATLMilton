import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight, Star, Shield, Zap, Heart, Award, Flame } from 'lucide-react';
import Logo from '@/components/Logo';

// ── MyStudio links ──────────────────────────────────────────────────────────
// Update these if your studio's URLs change.
// PAY link is the belt-testing fee payment (NOT monthly tuition).
const MYSTUDIO_PAY_URL = 'https://cp.mystudio.io/e/?=2185/3778/833962//1781033351';
// Member portal login. Confirm this matches your studio's MyStudio login page.
const MYSTUDIO_LOGIN_URL = 'https://cp.mystudio.io/';


/**
 * CHAMPIONSHIP ASCENT DESIGN PHILOSOPHY
 * - Bold, confident, championship-level aesthetic
 * - Championship Red (#e11d2a) as signature color
 * - Asymmetric layouts with diagonal cuts
 * - Dynamic animations suggesting motion and progression
 * - Premium typography with Poppins Bold for impact
 */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
  },
};

export default function Home() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [schedFilter, setSchedFilter] = useState('all');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ============ HEADER ============ */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-12 w-auto" badgeClassName="w-12 h-12" />
            <div>
              <div className="font-bold text-lg text-gray-900">Karate Atlanta</div>
              <div className="text-xs text-gray-600 tracking-widest uppercase">Milton, GA</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#programs" className="text-gray-700 hover:text-red-600 transition font-medium">Programs</a>
            <a href="#schedule" className="text-gray-700 hover:text-red-600 transition font-medium">Schedule</a>
            <a href="#portals" className="text-gray-700 hover:text-red-600 transition font-medium">Portals</a>
            <a href="#contact" className="text-gray-700 hover:text-red-600 transition font-medium">Contact</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button asChild variant="ghost" className="hidden md:inline-flex text-gray-700 hover:text-red-600 font-semibold">
              <a href={MYSTUDIO_LOGIN_URL} target="_blank" rel="noopener noreferrer">Member Login</a>
            </Button>
            <Button asChild variant="outline" className="hidden sm:inline-flex border-red-600 text-red-600 hover:bg-red-50 font-bold">
              <a href={MYSTUDIO_PAY_URL} target="_blank" rel="noopener noreferrer">Pay Testing Fee</a>
            </Button>
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-bold">
              <a href="#contact">Free Trial<ChevronRight className="w-4 h-4" /></a>
            </Button>
          </div>
        </div>
      </header>

      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663070396176/ehAssBRRCrukxcwSkgxuBD/hero-martial-arts-39jMBNH5TPkqew5J6qnusQ.webp"
            alt="Hero martial artist"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        {/* Hero content */}
        <div className="container mx-auto px-4 relative z-10 py-20">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-bold text-sm">Rated 4.9 by Milton families</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Confidence Starts With a <span className="text-yellow-400">Single Kick.</span>
            </h1>

            <p className="text-xl text-gray-200 mb-8 max-w-xl">
              Georgia's award-winning ATA Taekwondo program — right here in Milton. We build focus, respect, and real self-defense skills in students ages 3 to adult. Your first class is on us.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button className="btn-championship">
                Claim Your Free Trial
                <ChevronRight className="w-5 h-5" />
              </Button>
              <Button className="btn-championship-ghost">
                Explore Programs
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <span className="text-gray-100 font-medium">ATA Certified Instructors</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <span className="text-gray-100 font-medium">Anti-Bullying Trained</span>
              </div>
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <span className="text-gray-100 font-medium">Most Awarded in GA</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ VALUE STRIP ============ */}
      <section className="bg-red-600 text-white py-6 overflow-hidden">
        <div className="marquee-track">
          {['CONFIDENCE', 'DISCIPLINE', 'FOCUS', 'RESPECT', 'FITNESS', 'SELF-DEFENSE'].map((value, i) => (
            <div key={i} className="flex items-center gap-6 px-8 whitespace-nowrap">
              <span className="font-bold text-xl tracking-widest">{value}</span>
              <span className="text-yellow-400 text-2xl">★</span>
            </div>
          ))}
          {['CONFIDENCE', 'DISCIPLINE', 'FOCUS', 'RESPECT', 'FITNESS', 'SELF-DEFENSE'].map((value, i) => (
            <div key={`repeat-${i}`} className="flex items-center gap-6 px-8 whitespace-nowrap">
              <span className="font-bold text-xl tracking-widest">{value}</span>
              <span className="text-yellow-400 text-2xl">★</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ STATS SECTION ============ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { number: '25+', label: 'Years Building Champions' },
              { number: '5000+', label: 'Students Trained' },
              { number: '4.9★', label: 'Average Family Rating' },
              { number: '100%', label: 'Beginners Welcome' },
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">{stat.number}</div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ WHY US SECTION ============ */}
      <section id="why" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="eyebrow mb-4">Why Families Choose Us</div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">More Than Kicks & Punches</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Martial arts is our vehicle — your child's growth is our mission. Every class is designed to build life skills that last far beyond the mat.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: Zap, title: 'Unshakeable Confidence', desc: 'Belt by belt, students set goals and smash them — building self-belief that shows up everywhere.' },
              { icon: Shield, title: 'Real Self-Defense', desc: 'Age-appropriate, practical skills taught by instructors trained to keep kids safe and aware.' },
              { icon: Award, title: 'Laser Focus', desc: 'Structured classes train attention and self-control — parents report better focus at home and school.' },
              { icon: Heart, title: 'Family Community', desc: 'A welcoming environment where instructors know every student by name and families cheer each other on.' },
              { icon: Star, title: 'Award-Winning Curriculum', desc: 'Backed by the American Taekwondo Association — the world\'s largest martial arts organization.' },
              { icon: Flame, title: 'Fitness That\'s Fun', desc: 'High-energy classes build strength and flexibility — kids burn energy without the boredom.' },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div key={i} variants={itemVariants} className="feature-card">
                  <Icon className="w-10 h-10 text-red-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============ PROGRAMS SECTION ============ */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="eyebrow mb-4">Programs for Every Age</div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Find the Right Class</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From wiggly preschoolers to focused adults, we have a program built for where you are right now.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                age: 'Ages 3–6',
                title: 'Tiny Tigers',
                desc: 'A playful first step into martial arts that builds listening skills, coordination, and confidence.',
                image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663070396176/ehAssBRRCrukxcwSkgxuBD/kids-training-joy-TpAbVCC8hEEPnwEDMRP8vZ.webp',
              },
              {
                age: 'Ages 7–12',
                title: 'Junior Champions',
                desc: 'Real technique, real discipline, real results. Kids earn belts and build genuine self-defense skills.',
                image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663070396176/ehAssBRRCrukxcwSkgxuBD/champion-belt-moment-AcaJDQruco3AbTbUHPoPBp.webp',
              },
              {
                age: 'Ages 13–17',
                title: 'Teen Warriors',
                desc: 'Advanced techniques, leadership training, and tournament prep for serious martial artists.',
                image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663070396176/ehAssBRRCrukxcwSkgxuBD/dojo-interior-2FNeuFeuYVdqTk2juSVTTT.webp',
              },
              {
                age: '18+',
                title: 'Adult Excellence',
                desc: 'Fitness, focus, and self-defense for busy adults. No experience necessary.',
                image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663070396176/ehAssBRRCrukxcwSkgxuBD/hero-martial-arts-39jMBNH5TPkqew5J6qnusQ.webp',
              },
            ].map((program, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="program-card relative rounded-2xl overflow-hidden min-h-80 flex flex-col justify-end p-8 text-white group cursor-pointer"
                style={{
                  backgroundImage: `url('${program.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent -z-10 group-hover:from-black/95 transition-all duration-300" />

                <div className="relative z-10">
                  <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold text-white mb-4">
                    {program.age}
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{program.title}</h3>
                  <p className="text-gray-100 mb-4">{program.desc}</p>
                  <div className="inline-flex items-center gap-2 text-yellow-400 font-bold group-hover:gap-4 transition-all">
                    Learn More <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ SCHEDULE SECTION ============ */}
      <section id="schedule" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="eyebrow mb-4">Weekly Class Schedule</div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">The Whole Schedule, One Place</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Filter by program to find class times that fit your family — then book a free trial in seconds.
            </p>
          </motion.div>

          {/* Filter chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { key: 'all', label: 'All Classes' },
              { key: 'tots', label: 'Tiny Tigers (3–6)' },
              { key: 'kids', label: 'Juniors (7–12)' },
              { key: 'teens', label: 'Teens (13–17)' },
              { key: 'adults', label: 'Adults (18+)' },
            ].map((c) => (
              <button
                key={c.key}
                onClick={() => setSchedFilter(c.key)}
                className={`px-5 py-2 rounded-full font-bold text-sm transition ${
                  schedFilter === c.key
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <Card className="max-w-4xl mx-auto overflow-hidden border-gray-200 p-0">
            <div className="divide-y divide-gray-100">
              {[
                { cats: ['tots'], day: 'Mon / Wed', time: '4:00 – 4:30 PM', name: 'Tiny Tigers', age: 'Ages 3–6', color: 'bg-orange-100 text-orange-700' },
                { cats: ['kids'], day: 'Mon / Wed', time: '5:00 – 5:45 PM', name: 'Juniors Beginner', age: 'Ages 7–12', color: 'bg-emerald-100 text-emerald-700' },
                { cats: ['kids'], day: 'Tue / Thu', time: '5:00 – 5:45 PM', name: 'Juniors Advanced', age: 'Ages 7–12', color: 'bg-emerald-100 text-emerald-700' },
                { cats: ['teens'], day: 'Tue / Thu', time: '6:00 – 6:45 PM', name: 'Teen Martial Arts', age: 'Ages 13–17', color: 'bg-blue-100 text-blue-700' },
                { cats: ['adults'], day: 'Mon / Wed', time: '7:00 – 8:00 PM', name: 'Adult Taekwondo', age: 'Ages 18+', color: 'bg-purple-100 text-purple-700' },
                { cats: ['adults'], day: 'Tue / Thu', time: '7:00 – 8:00 PM', name: 'Adult Taekwondo', age: 'Ages 18+', color: 'bg-purple-100 text-purple-700' },
                { cats: ['kids', 'teens', 'adults'], day: 'Saturday', time: '10:00 – 10:45 AM', name: 'All-Levels Open Mat', age: 'All Ages', color: 'bg-gray-100 text-gray-700' },
                { cats: ['tots', 'kids'], day: 'Saturday', time: '11:00 – 11:30 AM', name: 'Little Champions', age: 'Ages 3–8', color: 'bg-orange-100 text-orange-700' },
              ]
                .filter((row) => schedFilter === 'all' || row.cats.includes(schedFilter))
                .map((row, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-x-6 gap-y-1 px-6 py-4 hover:bg-gray-50 transition">
                    <div className="w-28 font-bold text-gray-900">{row.day}</div>
                    <div className="w-32 text-gray-700">{row.time}</div>
                    <div className="flex-1 min-w-[140px] font-semibold text-gray-900">{row.name}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.color}`}>{row.age}</span>
                  </div>
                ))}
            </div>
            <div className="bg-gray-50 px-6 py-4 text-sm text-gray-600">
              ℹ️ Sample weekly times — they may vary by season. Confirm your exact class when you book a free trial:{' '}
              <a href="tel:+16786240506" className="text-red-600 font-bold">(678) 624-0506</a>.
            </div>
          </Card>
        </div>
      </section>

      {/* ============ PORTALS SECTION ============ */}
      <section id="portals" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="eyebrow mb-4">Logins &amp; Portals</div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Everyone Has a Door In</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Parents, instructors, and admins each get the tools they need — securely powered by MyStudio.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: 'Parent Portal',
                icon: Heart,
                desc: 'View your membership, pay belt-testing fees, track your child’s belt progress, and update info.',
                cta: 'Parent Login',
                url: '/portal',
              },
              {
                title: 'Teacher Portal',
                icon: Shield,
                desc: 'Take attendance, manage class rosters, record belt testing results, and message families.',
                cta: 'Teacher Login',
                url: '/portal',
              },
              {
                title: 'Admin Portal',
                icon: Award,
                desc: 'Billing, memberships, reporting, and full studio management for owners and front desk.',
                cta: 'Admin Login',
                url: '/portal',
              },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <Card key={i} className="p-8 flex flex-col border-gray-200 hover:shadow-xl transition">
                  <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{p.title}</h3>
                  <p className="text-gray-600 mb-6 flex-1">{p.desc}</p>
                  <Button asChild className="bg-gray-900 hover:bg-red-600 text-white font-bold w-full">
                    <Link href={p.url}>
                      {p.cta}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </Card>
              );
            })}
          </div>

          <p className="text-center text-sm text-gray-500 mt-8 max-w-2xl mx-auto">
            New family?{' '}
            <a href="#contact" className="text-red-600 font-bold">Book a free trial</a>{' '}
            and we’ll set up your parent account.
          </p>
        </div>
      </section>

      {/* ============ TRIAL FORM SECTION ============ */}
      <section id="contact" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <div className="inline-block px-4 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-bold tracking-widest mb-4">
                FREE TRIAL — $0
              </div>

              <h2 className="text-4xl font-bold mb-2">Book Your First Class Free</h2>
              <p className="text-gray-300 mb-8">No experience needed. We'll text you to confirm a time that works.</p>

              {!formSubmitted ? (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Your Name</label>
              <input
                type="text"
                placeholder="Jane Smith"
                required
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-white"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Phone</label>
                <input
                  type="tel"
                  placeholder="(678) 555-0199"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Student Age</label>
                <select required className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white focus:outline-none focus:border-white">
                  <option value="">Select</option>
                  <option value="3-6">3–6 (Tiny Tigers)</option>
                  <option value="7-12">7–12 (Juniors)</option>
                  <option value="13-17">13–17 (Teens)</option>
                  <option value="18+">18+ (Adults)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                placeholder="you@email.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-white"
              />
            </div>

                  <Button className="w-full btn-championship">
                    Get My Free Class →
                  </Button>

                  <p className="text-xs text-gray-400 text-center">
                    🔒 We never share your info. Reply STOP to opt out of texts anytime.
                  </p>
                </form>
              ) : (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">You're all set! 🥋</h3>
                  <p className="text-gray-300">
                    Thanks! Our team will reach out within one business day to schedule your free class.
                    <br />
                    Can't wait? Call us at <a href="tel:+16786240506" className="text-yellow-400 font-bold hover:underline">(678) 624-0506</a>
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-black text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="inline-block bg-white rounded-lg p-2 mb-4">
                <Logo className="h-12 w-auto" badgeClassName="w-12 h-12" />
              </div>
              <div className="font-bold text-white mb-2">Karate Atlanta Milton</div>
              <p className="text-sm">13083 Hwy 9, Ste 720<br />Milton, GA 30004</p>
            </div>
            <div>
              <div className="font-bold text-white mb-4">Hours</div>
              <p className="text-sm">Mon–Fri: 2:30 PM–8:45 PM<br />Sat: 9:30 AM–12:30 PM</p>
            </div>
            <div>
              <div className="font-bold text-white mb-4">Members</div>
              <p className="text-sm flex flex-col gap-2">
                <a href={MYSTUDIO_LOGIN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-red-600">Member Login</a>
                <a href={MYSTUDIO_PAY_URL} target="_blank" rel="noopener noreferrer" className="hover:text-red-600">Pay Testing Fee</a>
                <a href="tel:+16786240506" className="hover:text-red-600">(678) 624-0506</a>
              </p>
            </div>
            <div>
              <div className="font-bold text-white mb-4">Follow</div>
              <p className="text-sm">Facebook • Instagram • YouTube</p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Karate Atlanta Milton. All rights reserved. | ATA Certified</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
