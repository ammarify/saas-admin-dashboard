import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../shared/i18n/I18nProvider';
import { APP_PATHS } from '../../routes/paths';
import { clearAuthSession } from '../../shared/config/auth';
import { useNotifications } from '../../shared/notifications/notificationsContext';

function Topbar({ onMenuToggle, isDark, onThemeToggle, isDesktopSidebarOpen, searchQuery, onSearchChange }) {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useI18n();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  const visibleNotifications = useMemo(
    () =>
      notifications.length > 0
        ? notifications
        : [
            {
              id: 'empty-state',
              title: t('topbar.notifications'),
              detail: 'Activity from product and customer changes will appear here.',
              createdAt: Date.now(),
              unread: false,
              isEmptyState: true,
            },
          ],
    [notifications, t]
  );

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

  function formatRelativeTime(timestamp) {
    const elapsedMs = Date.now() - Number(timestamp || Date.now());
    const minutes = Math.max(1, Math.floor(elapsedMs / 60000));

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hr ago`;
    }

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  return (
    <header className="sticky top-0 z-30 mx-4 mt-4 rounded-[24px] border border-white/60 bg-white/82 px-4 py-3 shadow-[0_16px_42px_rgba(148,163,184,0.14)] backdrop-blur-xl dark:border-white/8 dark:bg-[#0f172a]/80 dark:shadow-[0_20px_50px_rgba(2,6,23,0.38)] sm:mx-6 lg:mx-8 xl:mx-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-3 lg:max-w-[620px]">
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label={t('topbar.toggle_sidebar')}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#e7e9f2] bg-white/80 text-[#66748f] transition-all duration-200 hover:bg-white hover:shadow-sm dark:border-white/8 dark:bg-white/5 dark:text-[#cbd5e1] dark:hover:bg-white/10 lg:hidden"
        >
          <svg viewBox="0 0 24 24" className={`h-5 w-5 transition-transform duration-300 ${isDesktopSidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="m15 6-6 6 6 6" />
          </svg>
        </button>
        <div className="relative w-full">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] dark:text-[#73819b]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
          <input
            className="h-10 w-full appearance-none rounded-xl border border-[#e9eef8] bg-[#f8fbff] pl-11 pr-4 text-[13px] text-[#5f6987] outline-none transition-all duration-200 placeholder:text-[#a8b4c8] hover:border-[#d7dff1] focus:border-[#cad1e8] focus:bg-white [color-scheme:light] dark:border-[#334155] dark:bg-[#0f172a] dark:text-[#e5edf8] dark:placeholder:text-[#8fa1bd] dark:hover:border-[#415179] dark:focus:border-[#4d5f90] dark:focus:bg-[#111c31] dark:[color-scheme:dark] dark:[-webkit-text-fill-color:#e5edf8]"
            type="search"
            placeholder={t('topbar.search_placeholder')}
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            autoComplete="off"
            aria-label={t('topbar.search_placeholder')}
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
        <label className="group relative overflow-hidden rounded-xl border border-[#dfe8f7] bg-[linear-gradient(135deg,#ffffff_0%,#f4f8ff_100%)] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_8px_18px_rgba(148,163,184,0.08)] transition hover:border-[#cad8f0] hover:bg-white dark:border-[#33415f] dark:bg-[linear-gradient(135deg,rgba(18,28,46,0.98),rgba(24,36,58,0.94))] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_32px_rgba(2,6,23,0.32)] dark:hover:border-[#42537a] dark:hover:bg-[linear-gradient(135deg,rgba(22,34,55,1),rgba(28,41,67,0.96))]">
          <span className="sr-only">{t('topbar.language_dropdown')}</span>
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#94a3b8] dark:text-[#90a3c3]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 12h16M12 4a16.5 16.5 0 0 1 0 16M12 4a16.5 16.5 0 0 0 0 16" />
            </svg>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#94a3b8] dark:text-[#90a3c3]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="m7 10 5 5 5-5" />
            </svg>
          </span>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="min-w-[124px] appearance-none bg-transparent pl-6 pr-6 text-xs font-bold uppercase tracking-[0.16em] text-[#334155] outline-none dark:text-[#edf3ff]"
            aria-label={t('topbar.language_dropdown')}
          >
            <option value="en">{t('topbar.language_en')}</option>
            <option value="ar">{t('topbar.language_ar')}</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => {
            clearAuthSession();
            navigate(APP_PATHS.login, { replace: true });
          }}
          className="group relative overflow-hidden rounded-xl border border-[#dfe7f4] bg-[linear-gradient(135deg,#ffffff_0%,#f4f7fe_100%)] px-3.5 py-2.5 text-xs font-bold tracking-[0.08em] text-[#44516f] shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_24px_rgba(148,163,184,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#cad6ec] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_16px_30px_rgba(148,163,184,0.14)] dark:border-[#33415f] dark:bg-[linear-gradient(135deg,rgba(17,28,46,0.98),rgba(26,39,63,0.95))] dark:text-[#dbe7fb] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_34px_rgba(2,6,23,0.34)] dark:hover:border-[#43537a] dark:hover:bg-[linear-gradient(135deg,rgba(22,34,55,1),rgba(31,46,75,0.97))]"
        >
          <span className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-[linear-gradient(90deg,rgba(84,104,216,0.12),rgba(84,104,216,0))] dark:bg-[linear-gradient(90deg,rgba(129,140,248,0.2),rgba(129,140,248,0))]" />
          <span className="relative flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#5468d8] dark:text-[#9eb0ff]" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M15 17l5-5-5-5" />
              <path d="M20 12H9" />
              <path d="M12 19H7a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h5" />
            </svg>
            <span>{t('topbar.logout')}</span>
          </span>
        </button>

        <button
          type="button"
          onClick={onThemeToggle}
          className="grid h-10 w-10 place-items-center rounded-xl border border-[#e7e9f2] bg-white/80 text-[#6f7a96] transition-all duration-200 hover:bg-white hover:shadow-sm dark:border-white/8 dark:bg-white/5 dark:text-[#c5cede] dark:hover:bg-white/10"
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

        {/* <button
          type="button"
          onClick={() => navigate(APP_PATHS.dashboard)}
          className="flex items-center gap-2.5 rounded-xl border border-[#e7edf7] bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_100%)] px-3 py-2 text-[13px] font-semibold text-[#5f6987] transition-all duration-200 hover:bg-white hover:shadow-sm dark:border-[#33415f] dark:bg-[linear-gradient(135deg,rgba(18,28,46,0.98),rgba(26,39,63,0.94))] dark:text-[#e6eefc] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_16px_30px_rgba(2,6,23,0.3)] dark:hover:border-[#42537a] dark:hover:bg-[linear-gradient(135deg,rgba(22,34,55,1),rgba(31,46,75,0.96))]"
        >
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-[radial-gradient(circle_at_30%_30%,#f8fafc_0%,#dbeafe_18%,#a78bfa_45%,#4f46e5_100%)] text-[11px] font-bold text-white shadow-[0_10px_24px_rgba(79,70,229,0.24)]">
            S
          </div>
          <span className="text-[13px] font-semibold">{t('topbar.store_name')}</span>
        </button> */}

        <div ref={notificationRef} className="relative">
          <button
            type="button"
            onClick={() =>
              setIsNotificationOpen((prev) => {
                const next = !prev;
                if (next && unreadCount > 0) {
                  markAllAsRead();
                }
                return next;
              })
            }
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#e7e9f2] bg-white/80 text-[#9ea7bf] transition-all duration-200 hover:bg-white hover:text-[#6f7a96] hover:shadow-sm dark:border-white/8 dark:bg-white/5 dark:text-[#90a0be] dark:hover:bg-white/10 dark:hover:text-[#c5cede]"
            aria-label={t('topbar.notifications')}
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
            {unreadCount > 0 ? (
              <>
                <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-[#ef4444]" />
                <span className="absolute -right-1.5 -top-1.5 min-w-[18px] rounded-full bg-[#5468d8] px-1 py-0.5 text-center text-[10px] font-bold leading-none text-white shadow-[0_8px_18px_rgba(84,104,216,0.3)]">
                  {unreadCount}
                </span>
              </>
            ) : null}
          </button>

          {isNotificationOpen ? (
            <div className="absolute right-0 top-14 z-50 w-[340px] overflow-hidden rounded-[24px] border border-[#e7ebf5] bg-white/95 shadow-[0_20px_45px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-white/8 dark:bg-[#111827]/96">
              <div className="flex items-center justify-between border-b border-[#edf0f7] px-5 py-4 dark:border-[#283247]">
                <p className="text-sm font-extrabold text-[#1f2440] dark:text-[#e5e7eb]">{t('topbar.notifications')}</p>
                <span className="rounded-full bg-[#edf2ff] px-2 py-0.5 text-[10px] font-bold text-[#5d70da] dark:bg-[#1c2640] dark:text-[#9eb0ff]">
                  {unreadCount} {t('topbar.new_label')}
                </span>
              </div>
              <div className="premium-scrollbar max-h-[320px] overflow-y-auto">
                {visibleNotifications.map((item) => (
                  <div key={item.id} className="border-b border-[#f0f2f8] px-4 py-3 transition-colors hover:bg-[#f8faff] last:border-b-0 dark:border-[#1f2a3d] dark:hover:bg-[#182235]">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-sm font-bold text-[#26304d] dark:text-[#e2e8f0]">{item.title}</p>
                      {item.unread ? <span className="h-2 w-2 rounded-full bg-[#5468d8]" /> : null}
                    </div>
                    <p className="text-xs text-[#73809d] dark:text-[#9db0cb]">{item.detail}</p>
                    <p className="mt-1 text-[11px] text-[#9aa6be] dark:text-[#7f8da8]">
                      {item.isEmptyState ? 'Waiting for activity' : formatRelativeTime(item.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      </div>
    </header>
  );
}

export default Topbar;
