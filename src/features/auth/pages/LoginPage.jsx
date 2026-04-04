import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { APP_PATHS } from '../../../routes/paths';
import { saveAuthSession } from '../../../shared/config/auth';

const DEMO_EMAIL = 'admin@shopsync.com';
const DEMO_PASSWORD = 'Admin@123';

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m5 12 4.2 4.2L19 6.5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3.5 6.5h17v11h-17z" />
      <path d="m4.5 7.5 7.5 6 7.5-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const email = form.email.trim().toLowerCase();
      const password = form.password;

      if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
        toast.error('Invalid credentials. Use demo credentials shown below.');
        return;
      }

      saveAuthSession(`${DEMO_EMAIL}:${Date.now()}`);
      toast.success('Login successful');
      navigate(APP_PATHS.dashboard, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#edf2fb] dark:bg-[#0b1220]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(84,104,216,0.28),transparent_48%),radial-gradient(circle_at_78%_10%,rgba(68,191,216,0.24),transparent_42%),radial-gradient(circle_at_84%_84%,rgba(84,104,216,0.2),transparent_46%),linear-gradient(135deg,#eef3ff_0%,#e7eefc_38%,#edf4ff_100%)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(84,104,216,0.35),transparent_48%),radial-gradient(circle_at_78%_10%,rgba(68,191,216,0.2),transparent_42%),radial-gradient(circle_at_84%_84%,rgba(84,104,216,0.3),transparent_46%),linear-gradient(140deg,#0b1220_0%,#0f172a_50%,#131c31_100%)]" />
      <div className="absolute inset-0 opacity-65 [background-image:linear-gradient(rgba(90,109,219,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(90,109,219,0.08)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="absolute -left-16 top-24 h-64 w-64 rounded-full bg-[#6073dd]/30 blur-3xl dark:bg-[#4b5fc5]/35" />
      <div className="absolute right-[-70px] top-[-30px] h-72 w-72 rounded-full bg-[#53c2db]/30 blur-3xl dark:bg-[#2a8ca3]/35" />
      <div className="absolute bottom-[-100px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#6b7be2]/25 blur-3xl dark:bg-[#4456af]/30" />
      <div className="absolute right-10 top-1/3 hidden h-40 w-40 rotate-12 rounded-[2rem] border border-white/40 bg-white/30 shadow-[0_20px_50px_rgba(41,57,104,0.12)] backdrop-blur-sm lg:block dark:border-white/10 dark:bg-white/5" />
      <div className="absolute left-16 top-1/2 hidden h-28 w-28 -rotate-12 rounded-[1.5rem] border border-white/50 bg-white/40 shadow-[0_20px_40px_rgba(41,57,104,0.1)] backdrop-blur-sm lg:block dark:border-white/10 dark:bg-white/5" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-2">
        <article className="relative hidden px-6 py-4 lg:block">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#5f72d9] shadow-sm dark:bg-[#0f172a]/80 dark:text-[#a9b5f3]">
            <span className="inline-grid h-5 w-5 place-items-center rounded-full bg-[#5468d8] text-[10px] text-white">S</span>
            ShopSync
          </div>

          <h1 className="mt-7 max-w-xl text-5xl font-extrabold leading-[1.05] text-[#1e2442] dark:text-[#e5e7eb]">
            Premium Commerce Operations Platform
          </h1>
          <p className="mt-5 max-w-lg text-base text-[#6f7c9b] dark:text-[#94a3b8]">
            Monitor performance, manage orders, and run your storefront from a focused, enterprise-grade command layer.
          </p>

          <div className="mt-10 grid max-w-xl gap-4">
            {['Live order intelligence', 'Secure team collaboration', 'Unified product and revenue insights'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl bg-white/60 px-4 py-3 text-sm font-semibold text-[#334062] shadow-[0_10px_30px_rgba(60,75,129,0.1)] backdrop-blur-md dark:bg-[#0f172a]/70 dark:text-[#dbe4f0]">
                <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-[#e9eeff] text-[#5a6ddb] dark:bg-[#1b2743] dark:text-[#9eb0ff]">
                  <CheckIcon />
                </span>
                {item}
              </div>
            ))}
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/65 px-4 py-3 shadow-[0_10px_30px_rgba(60,75,129,0.08)] backdrop-blur-md dark:bg-[#0f172a]/70">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8894b3] dark:text-[#94a3b8]">Orders</p>
              <p className="mt-1 text-2xl font-extrabold text-[#2b3556] dark:text-[#e5e7eb]">12.4k</p>
            </div>
            <div className="rounded-xl bg-white/65 px-4 py-3 shadow-[0_10px_30px_rgba(60,75,129,0.08)] backdrop-blur-md dark:bg-[#0f172a]/70">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8894b3] dark:text-[#94a3b8]">Revenue</p>
              <p className="mt-1 text-2xl font-extrabold text-[#2b3556] dark:text-[#e5e7eb]">$98k</p>
            </div>
            <div className="rounded-xl bg-white/65 px-4 py-3 shadow-[0_10px_30px_rgba(60,75,129,0.08)] backdrop-blur-md dark:bg-[#0f172a]/70">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8894b3] dark:text-[#94a3b8]">NPS</p>
              <p className="mt-1 text-2xl font-extrabold text-[#2b3556] dark:text-[#e5e7eb]">4.8</p>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-[#dce3f4] bg-white/92 p-8 shadow-[0_32px_100px_rgba(35,47,94,0.24)] backdrop-blur-xl dark:border-[#26334d] dark:bg-[#111827]/92 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6070da] dark:text-[#9eb0ff]">Admin Access</p>
          <h2 className="mt-3 text-4xl font-extrabold text-[#1e2442] dark:text-[#e5e7eb]">Welcome Back</h2>
          <p className="mt-2 text-sm text-[#7d88a5] dark:text-[#94a3b8]">Sign in to continue to your workspace.</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#8d97b0] dark:text-[#94a3b8]">
              Email
              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8e98b3] dark:text-[#94a3b8]">
                  <MailIcon />
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="admin@shopsync.com"
                  className="h-12 w-full rounded-xl border border-[#e1e6f2] bg-[#f8faff] pl-10 pr-3 text-sm text-[#3d4766] outline-none transition focus:border-[#8fa0df] focus:ring-2 focus:ring-[#8fa0df]/20 dark:border-[#2c3951] dark:bg-[#0f172a] dark:text-[#e2e8f0]"
                />
              </div>
            </label>

            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#8d97b0] dark:text-[#94a3b8]">
              Password
              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8e98b3] dark:text-[#94a3b8]">
                  <LockIcon />
                </span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="Enter password"
                  className="h-12 w-full rounded-xl border border-[#e1e6f2] bg-[#f8faff] pl-10 pr-3 text-sm text-[#3d4766] outline-none transition focus:border-[#8fa0df] focus:ring-2 focus:ring-[#8fa0df]/20 dark:border-[#2c3951] dark:bg-[#0f172a] dark:text-[#e2e8f0]"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 h-12 w-full rounded-xl bg-gradient-to-r from-[#5468d8] to-[#4d7be3] text-sm font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-dashed border-[#d7dff4] bg-[#f9fbff] p-4 text-xs leading-relaxed text-[#6b7898] dark:border-[#32405c] dark:bg-[#0f172a] dark:text-[#9fb0cc]">
            Demo credentials: <span className="font-semibold">admin@shopsync.com</span> / <span className="font-semibold">Admin@123</span>
          </div>
        </article>
      </div>
    </section>
  );
}

export default LoginPage;
