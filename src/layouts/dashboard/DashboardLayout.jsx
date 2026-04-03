import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

function DashboardLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
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
    <div className="relative min-h-screen bg-[#f5f7fb] text-[#1d2341] dark:bg-[#0b1220] dark:text-[#e5e7eb]">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        isDesktopOpen={isDesktopSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
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
          isDesktopSidebarOpen ? 'lg:pl-[250px]' : 'lg:pl-0'
        }`}
      >
        <Topbar
          onMenuToggle={handleMenuToggle}
          isDark={isDark}
          onThemeToggle={() => setIsDark((prev) => !prev)}
        />
        <main className="px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
