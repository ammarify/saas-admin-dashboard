import { NavLink } from 'react-router-dom';
import { NAV_SECTIONS } from '../../constants/navigation';
import { useI18n } from '../../shared/i18n/I18nProvider';

function Icon({ icon }) {
  const common = 'h-4 w-4';

  if (icon === 'layout') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M10 5v14" />
      </svg>
    );
  }

  if (icon === 'cart') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 5h2l2.2 9h10.6l2-7H7.4" />
        <circle cx="10" cy="18" r="1.5" />
        <circle cx="17" cy="18" r="1.5" />
      </svg>
    );
  }

  if (icon === 'book') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="5" y="4" width="14" height="16" rx="2" />
        <path d="M9 8h6M9 12h6" />
      </svg>
    );
  }

  if (icon === 'message') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 12a7 7 0 0 1-7 7H6l-2 2v-9a7 7 0 1 1 16 0Z" />
      </svg>
    );
  }

  if (icon === 'settings') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2h0a1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.1a1 1 0 0 0 .6.9h0a1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v0a1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.1a1 1 0 0 0-.9.6Z" />
      </svg>
    );
  }

  if (icon === 'wallet') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18M16 14h2" />
      </svg>
    );
  }

  if (icon === 'user') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="3" />
        <path d="M5 19a7 7 0 0 1 14 0" />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </svg>
  );
}

function Sidebar({ isMobileOpen, isDesktopOpen, onClose }) {
  const { t } = useI18n();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-full w-[250px] flex-col border-r border-[#e6e8ef] bg-[#f2f4f9] transition-transform duration-300 dark:border-[#283247] dark:bg-[#111827] ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isDesktopOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full'}`}
    >
      <div className="flex h-[72px] items-center gap-3 border-b border-[#e6e8ef] px-6 dark:border-[#283247]">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5166d7] text-[10px] font-bold text-white">
          S
        </div>
        <p className="text-[13px] font-extrabold tracking-[0.08em] text-[#5f6b8a] dark:text-[#a9b4cc]">
          SHOPSYNC
        </p>
      </div>

      <div className="px-6 pt-6">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a4abc2] dark:text-[#677792]">
          {t(NAV_SECTIONS[0].titleKey)}
        </p>
        <nav className="space-y-1.5">
          {NAV_SECTIONS[0].items.map((item) => {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex h-9 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#e6ebff] text-[#5367d6] shadow-[inset_0_0_0_1px_rgba(83,103,214,0.14)]'
                      : 'text-[#7d869f] hover:translate-x-0.5 hover:bg-[#e9edf8] hover:text-[#5f6fd8] dark:text-[#9cabc6] dark:hover:bg-[#182235] dark:hover:text-[#c9d4f6]'
                  }`
                }
                onClick={() => onClose()}
              >
                <Icon icon={item.icon} />
                <span>{t(item.labelKey)}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="px-6 pt-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a4abc2] dark:text-[#677792]">
          {t(NAV_SECTIONS[1].titleKey)}
        </p>
        <nav className="space-y-1.5">
          {NAV_SECTIONS[1].items.map((item) => {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex h-9 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#e6ebff] text-[#5367d6] shadow-[inset_0_0_0_1px_rgba(83,103,214,0.14)]'
                      : 'text-[#7d869f] hover:translate-x-0.5 hover:bg-[#e9edf8] hover:text-[#5f6fd8] dark:text-[#9cabc6] dark:hover:bg-[#182235] dark:hover:text-[#c9d4f6]'
                  }`
                }
                onClick={() => onClose()}
              >
                <Icon icon={item.icon} />
                <span>{t(item.labelKey)}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="flex-1" />
    </aside>
  );
}

export default Sidebar;
