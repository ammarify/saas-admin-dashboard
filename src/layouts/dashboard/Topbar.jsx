import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../shared/i18n/I18nProvider';
import { APP_PATHS } from '../../routes/paths';
import { clearAuthSession } from '../../shared/config/auth';

function Topbar({ onMenuToggle, isDark, onThemeToggle }) {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useI18n();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  const notifications = [
    { id: 1, title: 'New order received', detail: 'Order #ORD-10245 from Emma Clark', time: '2 min ago', unread: true },
    { id: 2, title: 'Payment completed', detail: 'PAY-5512 was settled successfully', time: '12 min ago', unread: true },
    { id: 3, title: 'Low stock alert', detail: 'Smart Watch Pro stock dropped below threshold', time: '35 min ago', unread: false },
    { id: 4, title: 'New support ticket', detail: 'SUP-8811 assigned to Michael', time: '1 hr ago', unread: false },
  ];

  useEffect(() => {
    function onClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    }

    function onEscape(event) {
      if (event.key === 'Escape') {
        setIsNotificationOpen(false);
      }
    }

    window.addEventListener('mousedown', onClickOutside);
    window.addEventListener('keydown', onEscape);
    return () => {
      window.removeEventListener('mousedown', onClickOutside);
      window.removeEventListener('keydown', onEscape);
    };
  }, []);

  return (
    <header className="flex h-auto flex-col gap-3 border-b border-[#e6e8ef] bg-white px-4 py-3 dark:border-[#283247] dark:bg-[#111827] sm:h-[72px] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0">
      <div className="flex w-full items-center gap-3 sm:max-w-[560px]">
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label={t('topbar.toggle_sidebar')}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-[#e7e9f2] text-[#8b95af] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f8f9fd] hover:shadow-sm dark:border-[#2f3b54] dark:text-[#94a3b8] dark:hover:bg-[#182235]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <div className="relative w-full">
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b5bdd1] dark:text-[#73819b]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
          <input
            className="h-10 w-full rounded-md border border-[#ebedf5] bg-[#f8f9fd] pl-4 pr-9 text-[13px] text-[#5f6987] outline-none transition-all duration-200 placeholder:text-[#c0c6d6] hover:border-[#d7dff1] focus:border-[#cad1e8] dark:border-[#2f3b54] dark:bg-[#111827] dark:text-[#d1d8e6] dark:placeholder:text-[#73819b] dark:hover:border-[#415179] dark:focus:border-[#4d5f90]"
            type="search"
            placeholder={t('topbar.search_placeholder')}
          />
        </div>
      </div>

      <div className="flex w-full items-center justify-end gap-3 sm:ml-6 sm:w-auto">
        <button
          type="button"
          onClick={() => {
            clearAuthSession();
            navigate(APP_PATHS.login, { replace: true });
          }}
          className="rounded-md border border-[#e7e9f2] px-3 py-2 text-xs font-bold text-[#c45555] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#fff5f5] hover:shadow-sm dark:border-[#2f3b54] dark:text-[#ff9e9e] dark:hover:bg-[#2a1b27]"
        >
          Logout
        </button>

        <button
          type="button"
          onClick={onThemeToggle}
          className="grid h-9 w-9 place-items-center rounded-md border border-[#e7e9f2] text-[#6f7a96] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f8f9fd] hover:shadow-sm dark:border-[#2f3b54] dark:text-[#c5cede] dark:hover:bg-[#182235]"
          aria-label={t('topbar.toggle_theme')}
        >
          {isDark ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="rounded-md border border-[#e7e9f2] px-3 py-2 text-xs font-bold text-[#6f7a96] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f8f9fd] hover:shadow-sm dark:border-[#2f3b54] dark:text-[#c5cede] dark:hover:bg-[#182235]"
          aria-label={t('topbar.toggle_language')}
        >
          {language === 'en' ? 'AR' : 'EN'}
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-transparent px-2 py-1 text-[13px] font-semibold text-[#5f6987] transition-all duration-200 hover:border-[#e7e9f2] hover:bg-[#f8f9fd] dark:text-[#d5dbea] dark:hover:border-[#2f3b54] dark:hover:bg-[#182235]"
        >
          <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#ffd9a5] to-[#f7a83a] text-[11px] font-bold text-white">
            E
          </div>
          <span>{t('topbar.store_name')}</span>
          <svg
            className="h-4 w-4 text-[#94a0bc] dark:text-[#8fa0c0]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="m7 10 5 5 5-5" />
          </svg>
        </button>

        <div ref={notificationRef} className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            className="relative grid h-7 w-7 place-items-center rounded-md text-[#9ea7bf] transition-all duration-200 hover:bg-[#f8f9fd] hover:text-[#6f7a96] dark:text-[#90a0be] dark:hover:bg-[#182235] dark:hover:text-[#c5cede]"
            aria-label="Open notifications"
          >
            <svg
              className="h-[17px] w-[17px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
              <path d="M9.5 17a2.5 2.5 0 0 0 5 0" />
            </svg>
            <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-[#ef4444]" />
          </button>

          {isNotificationOpen ? (
            <div className="absolute right-0 top-10 z-50 w-[320px] overflow-hidden rounded-xl border border-[#e7ebf5] bg-white shadow-[0_20px_45px_rgba(15,23,42,0.18)] dark:border-[#2f3b54] dark:bg-[#111827]">
              <div className="flex items-center justify-between border-b border-[#edf0f7] px-4 py-3 dark:border-[#283247]">
                <p className="text-sm font-extrabold text-[#1f2440] dark:text-[#e5e7eb]">Notifications</p>
                <span className="rounded-full bg-[#edf2ff] px-2 py-0.5 text-[10px] font-bold text-[#5d70da] dark:bg-[#1c2640] dark:text-[#9eb0ff]">
                  {notifications.filter((item) => item.unread).length} NEW
                </span>
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {notifications.map((item) => (
                  <div key={item.id} className="border-b border-[#f0f2f8] px-4 py-3 transition-colors hover:bg-[#f8faff] last:border-b-0 dark:border-[#1f2a3d] dark:hover:bg-[#182235]">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-sm font-bold text-[#26304d] dark:text-[#e2e8f0]">{item.title}</p>
                      {item.unread ? <span className="h-2 w-2 rounded-full bg-[#5468d8]" /> : null}
                    </div>
                    <p className="text-xs text-[#73809d] dark:text-[#9db0cb]">{item.detail}</p>
                    <p className="mt-1 text-[11px] text-[#9aa6be] dark:text-[#7f8da8]">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
