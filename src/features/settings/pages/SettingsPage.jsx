import { useI18n } from '../../../shared/i18n/I18nProvider';

function SettingsPage() {
  const { t } = useI18n();
  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-[30px] font-extrabold text-[#1d2341] dark:text-[#e5e7eb]">{t('analytics.title')}</h1>
        <p className="text-sm text-[#96a0b7] dark:text-[#94a3b8]">{t('analytics.subtitle')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [t('analytics.revenue'), '$98,752'],
          [t('analytics.conversion'), '4.2%'],
          [t('analytics.avg_order'), '$76'],
          [t('analytics.bounce'), '31%'],
        ].map(([label, value]) => (
          <article key={label} className="rounded-sm border border-[#e6e8ef] bg-white px-5 py-4 dark:border-[#283247] dark:bg-[#111827]">
            <p className="text-xs uppercase tracking-wide text-[#9ba4b9]">{label}</p>
            <p className="mt-1 text-2xl font-extrabold text-[#1f2440] dark:text-[#e5e7eb]">{value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-sm border border-[#e6e8ef] bg-white p-5 dark:border-[#283247] dark:bg-[#111827]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1f2440] dark:text-[#e5e7eb]">{t('analytics.revenue_trend')}</h2>
            <button className="rounded-md border border-[#e7eaf4] px-3 py-1.5 text-xs font-semibold text-[#6170da] dark:border-[#2f3b54] dark:text-[#9eb0ff]">{t('common.view_report')}</button>
          </div>
          <div className="h-[220px] border-y border-dashed border-[#edf0f7] pt-3 dark:border-[#283247]">
            <svg viewBox="0 0 500 220" className="h-full w-full">
              <polyline points="10,170 80,145 150,152 220,101 290,120 360,78 430,42" fill="none" stroke="#5a6ddb" strokeWidth="4" strokeLinecap="round" />
              <polyline points="10,120 80,130 150,110 220,122 290,98 360,110 430,103" fill="none" stroke="#d8deec" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </article>

        <article className="rounded-sm border border-[#e6e8ef] bg-white p-5 dark:border-[#283247] dark:bg-[#111827]">
          <h2 className="mb-4 text-lg font-bold text-[#1f2440] dark:text-[#e5e7eb]">{t('analytics.traffic_sources')}</h2>
          <div className="space-y-4">
            {[
              [t('analytics.organic'), 42],
              [t('analytics.paid'), 28],
              [t('analytics.social'), 18],
              [t('analytics.direct'), 12],
            ].map(([name, percent]) => (
              <div key={name}>
                <div className="mb-1 flex items-center justify-between text-sm text-[#5f6987] dark:text-[#c7d2e4]">
                  <span>{name}</span>
                  <span className="font-semibold">{percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#edf0f7]">
                  <div className="h-2 rounded-full bg-[#5569d9]" style={{ width: `${percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default SettingsPage;
