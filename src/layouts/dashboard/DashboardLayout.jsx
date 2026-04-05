import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

function DashboardLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    }

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  function handleMenuToggle() {
    if (window.innerWidth < 1024) {
      setIsMobileSidebarOpen((prev) => !prev);
      return;
    }

    setIsDesktopSidebarOpen((prev) => !prev);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(147,197,253,0.24),transparent_26%),radial-gradient(circle_at_top_right,rgba(196,181,253,0.18),transparent_22%),linear-gradient(180deg,#f5f7ff_0%,#eef2ff_48%,#f7f9fc_100%)] text-[#1d2341] dark:bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_18%),linear-gradient(180deg,#07111f_0%,#0b1424_46%,#0d1728_100%)] dark:text-[#e5e7eb]">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:34px_34px]" />
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        isDesktopExpanded={isDesktopSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onDesktopToggle={() => setIsDesktopSidebarOpen((prev) => !prev)}
      />
      {isMobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-[#1f2440]/35 dark:bg-black/60 lg:hidden"
        />
      )}
      <div
        className={`min-w-0 transition-all duration-300 ${
          isDesktopSidebarOpen ? 'lg:pl-[288px]' : 'lg:pl-[92px]'
        }`}
      >
        <Topbar
          onMenuToggle={handleMenuToggle}
          isDark={isDark}
          onThemeToggle={() => setIsDark((prev) => !prev)}
          isDesktopSidebarOpen={isDesktopSidebarOpen}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main className="relative overflow-x-hidden px-3 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
