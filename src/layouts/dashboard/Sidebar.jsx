import { NavLink } from 'react-router-dom';
import { NAV_SECTIONS } from '../../constants/navigation';
import { APP_PATHS } from '../../routes/paths';
import { useI18n } from '../../shared/i18n/I18nProvider';

function Icon({ icon }) {
  const common = 'h-5 w-5';

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

function CollapseIcon({ isExpanded, isRtl }) {
  const direction = isExpanded ? (isRtl ? 'rotate-180' : '') : isRtl ? '' : 'rotate-180';

  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform ${direction}`} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

function Sidebar({ isMobileOpen, isDesktopExpanded, onClose, onDesktopToggle }) {
  const { t, language } = useI18n();
  const isRtl = language === 'ar';

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-full flex-col overflow-visible border-r border-white/8 bg-[linear-gradient(180deg,rgba(12,20,35,0.97)_0%,rgba(17,28,47,0.95)_50%,rgba(21,33,54,0.93)_100%)] text-white shadow-[0_24px_70px_rgba(3,8,20,0.22)] backdrop-blur-xl transition-[width,transform] duration-300 ease-out ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${isDesktopExpanded ? 'w-[288px]' : 'w-[92px]'}`}
    >
      <div className="flex h-[82px] items-center justify-center border-b border-white/8 px-3">
        <NavLink
          to={APP_PATHS.dashboard}
          onClick={onClose}
          className={`group flex items-center gap-3 ${isDesktopExpanded ? '' : 'justify-center'}`}
          title="ShopSync"
        >
          <div className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-[16px] border border-white/12 bg-[linear-gradient(145deg,#1e2f4f_0%,#243a64_36%,#5b6ee0_100%)] text-sm font-extrabold tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(79,70,229,0.26)]">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.42),transparent_28%)]" />
            <span className="relative">S</span>
          </div>
          <div className={`overflow-hidden transition-[max-width,opacity,transform] duration-300 ease-out ${isDesktopExpanded ? 'max-w-[180px] opacity-100 translate-x-0' : 'max-w-0 opacity-0 -translate-x-2'}`}>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-white/35">Control Center</p>
              <p className="mt-1 text-[1rem] font-semibold tracking-[0.14em] text-white/95">SHOPSYNC</p>
          </div>
        </NavLink>
      </div>

      <button
        type="button"
        onClick={onDesktopToggle}
        aria-label={t('sidebar.toggle')}
        title={t('sidebar.toggle')}
        className="absolute -right-7 top-24 z-20 hidden h-12 w-14 place-items-center rounded-r-[18px] rounded-l-[14px] border border-white/10 bg-[linear-gradient(135deg,rgba(19,31,52,0.98)_0%,rgba(44,60,102,0.92)_100%)] text-white/90 shadow-[0_16px_34px_rgba(3,8,20,0.34)] transition-all duration-300 hover:translate-x-0.5 hover:shadow-[0_18px_38px_rgba(3,8,20,0.4)] lg:grid"
      >
        <span className="pointer-events-none absolute left-0 top-2 bottom-2 w-px bg-white/14" />
        <span className="pointer-events-none absolute inset-[1px] rounded-r-[17px] rounded-l-[13px] border border-white/6" />
        <span className="relative flex items-center gap-1.5">
          <span className="h-7 w-[1px] rounded-full bg-white/14" />
          <CollapseIcon isExpanded={isDesktopExpanded} isRtl={isRtl} />
        </span>
      </button>

      <div className={`premium-scrollbar flex-1 overflow-y-auto py-5 transition-[padding] duration-300 ${isDesktopExpanded ? 'px-4' : 'px-3'}`}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.titleKey} className="mb-7">
            <div className={`${isDesktopExpanded ? 'mb-3 px-2' : 'mb-3 flex justify-center'}`}>
              <p className={`text-[10px] font-semibold uppercase tracking-[0.28em] text-white/28 transition-opacity duration-200 ${isDesktopExpanded ? 'opacity-100' : 'sr-only opacity-0'}`}>{t(section.titleKey)}</p>
              {!isDesktopExpanded ? <span className="h-px w-8 bg-white/10" /> : null}
            </div>
            <nav className="space-y-2">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={t(item.labelKey)}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group relative flex items-center rounded-[18px] transition-all duration-200 ${isDesktopExpanded ? 'gap-3 px-3 py-2.5' : 'justify-center px-0 py-3'} ${
                      isActive
                        ? 'bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(129,140,248,0.18))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_24px_rgba(79,70,229,0.16)]'
                        : 'text-white/58 hover:bg-white/7 hover:text-white/92'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive ? <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-gradient-to-b from-[#93c5fd] to-[#c4b5fd]" /> : null}
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[16px] border transition ${isActive ? 'border-white/10 bg-white/8' : 'border-transparent bg-white/0 group-hover:border-white/8 group-hover:bg-white/7'}`}>
                        <Icon icon={item.icon} />
                      </span>
                      <span className={`truncate text-[0.9rem] font-medium transition-[max-width,opacity,transform] duration-300 ease-out ${isDesktopExpanded ? 'max-w-[140px] opacity-100 translate-x-0' : 'max-w-0 opacity-0 -translate-x-2'}`}>{t(item.labelKey)}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
