import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useOutletContext } from 'react-router-dom';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import { getCarts } from '../../../services/api/dummyJsonApi';

function EcommerceDashboardPage() {
  const { t } = useI18n();
  const { searchQuery = '' } = useOutletContext() ?? {};
  const [summary, setSummary] = useState({
    totalSales: '$0.00',
    orderCount: 0,
    topProducts: [],
  });

  useEffect(() => {
    let ignore = false;
    getCarts()
      .then((carts) => {
        if (!ignore) {
          const totalSales = carts.reduce((sum, cart) => sum + Number(cart.total || 0), 0);
          const topProducts = carts
            .flatMap((cart) => cart.products || [])
            .slice(0, 4)
            .map((item) => [`Product #${item.id}`, `$${Number(item.total || 0).toFixed(2)}`]);
          setSummary({
            totalSales: `$${totalSales.toFixed(2)}`,
            orderCount: carts.length,
            topProducts,
          });
        }
      })
      .catch(() => {
        if (!ignore) {
          setSummary({ totalSales: '$0.00', orderCount: 0, topProducts: [] });
          toast.error('Error occurred');
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const sections = useMemo(
    () => [
      {
        id: 'sales-overview',
        title: t('dashboard.total_sales'),
        keywords: [
          t('dashboard.title'),
          t('dashboard.total_sales'),
          t('dashboard.sales_period'),
          t('dashboard.legend_last_6_days'),
          t('dashboard.legend_last_week'),
          t('common.view_report'),
        ],
      },
      {
        id: 'order-time',
        title: t('dashboard.order_time'),
        keywords: [
          t('dashboard.order_time'),
          t('dashboard.order_time_period'),
          t('dashboard.afternoon'),
          t('dashboard.evening'),
          t('dashboard.morning'),
        ],
      },
      {
        id: 'channel-performance',
        title: t('dashboard.channel_performance'),
        keywords: [
          t('dashboard.channel_performance'),
          t('dashboard.channel_subtitle'),
          t('dashboard.store_ux'),
          t('dashboard.fulfillment'),
          t('dashboard.packaging'),
        ],
      },
      {
        id: 'top-selling',
        title: t('dashboard.top_selling'),
        keywords: [
          t('dashboard.top_selling'),
          t('dashboard.top_selling_subtitle'),
          ...summary.topProducts.flatMap(([item, price]) => [item, price]),
        ],
      },
      {
        id: 'orders',
        title: t('dashboard.orders'),
        keywords: [
          t('dashboard.orders'),
          t('dashboard.orders_period'),
          t('dashboard.vs_last_week_down'),
          t('dashboard.legend_last_6_days'),
          t('dashboard.legend_last_week'),
        ],
      },
    ],
    [summary.topProducts, t]
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;
  const matchesSearch = (values) => values.some((value) => value.toLowerCase().includes(normalizedQuery));
  const visibleSectionIds = new Set(
    isSearching ? sections.filter((section) => matchesSearch(section.keywords)).map((section) => section.id) : sections.map((section) => section.id)
  );
  const filteredTopProducts = isSearching
    ? summary.topProducts.filter(([item, price]) => matchesSearch([item, price, t('dashboard.top_selling')]))
    : summary.topProducts;
  const hasMatches = visibleSectionIds.size > 0;

  return (
    <section className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.85fr_0.85fr]">
        {[
          [t('dashboard.total_sales'), summary.totalSales, t('dashboard.vs_last_week_up')],
          [t('dashboard.orders'), summary.orderCount.toLocaleString(), t('dashboard.orders_period')],
          [t('dashboard.channel_performance'), '89%', t('dashboard.channel_subtitle')],
        ].map(([label, value, note], index) => (
          <article
            key={label}
            className={`rounded-[26px] border p-5 shadow-[0_20px_50px_rgba(15,23,42,0.07)] backdrop-blur-xl ${
              index === 0
                ? 'border-[#dde6f8] bg-[linear-gradient(135deg,#ffffff_0%,#f5f8ff_48%,#eef3ff_100%)] dark:border-[#334267] dark:bg-[linear-gradient(135deg,rgba(35,49,78,0.94)_0%,rgba(18,28,50,0.92)_100%)]'
                : 'border-white/60 bg-white/75 dark:border-white/8 dark:bg-white/5'
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#94a3b8] dark:text-[#7c8ba3]">{label}</p>
            <p className="mt-3 text-[2rem] font-extrabold tracking-tight text-[#172033] dark:text-white">{value}</p>
            <p className={`mt-3 text-sm ${index === 1 ? 'text-[#64748b] dark:text-[#9fb0c9]' : 'text-[#1c9b6e] dark:text-[#74d8b0]'}`}>{note}</p>
          </article>
        ))}
      </div>

      <div className="overflow-hidden rounded-[30px] border border-white/60 bg-white/72 shadow-[0_22px_60px_rgba(15,23,42,0.1)] backdrop-blur-xl dark:border-white/8 dark:bg-[#0f172a]/76">
      {isSearching && !hasMatches ? (
        <div className="border-b border-[#e6e8ef]/80 px-7 py-5 text-sm text-[#64748b] dark:border-[#283247] dark:text-[#9fb0c9]">
          No dashboard results found for "{searchQuery}".
        </div>
      ) : null}
      {visibleSectionIds.has('sales-overview') || visibleSectionIds.has('order-time') ? (
      <div className="grid grid-cols-12 border-b border-[#e6e8ef]/80 dark:border-[#283247]">
        {visibleSectionIds.has('sales-overview') ? (
        <div className={`col-span-12 border-b border-[#e6e8ef]/80 p-7 dark:border-[#283247] ${visibleSectionIds.has('order-time') ? 'xl:col-span-8 xl:border-b-0 xl:border-r' : ''}`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
          <h1 className="text-[34px] font-extrabold leading-none text-[#1d2341] dark:text-[#e5e7eb]">
            {t('dashboard.title')}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-[#70809b] dark:text-[#9db0cb]">{t('dashboard.sales_period')}</p>
          </div>
          <button className="rounded-xl border border-[#e2e8f8] bg-white/80 px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.16em] text-[#6473db] transition-all duration-200 hover:bg-white hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-[#9eb0ff] dark:hover:bg-white/10">
            {t('common.view_report')}
          </button>
          </div>

          <div className="mb-6 mt-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-[18px] font-bold text-[#222840] dark:text-[#e5e7eb]">{t('dashboard.total_sales')}</p>
              <p className="mt-2 text-[34px] font-extrabold tracking-tight text-[#1f2440] dark:text-[#e5e7eb]">
                {summary.totalSales}
              </p>
              <p className="mt-1 text-[13px] font-semibold text-[#23a16d]">
                {t('dashboard.vs_last_week_up')}
              </p>
              <p className="mt-4 text-[13px] text-[#a0a8bc]">{t('dashboard.sales_period')}</p>
            </div>
            <div className="rounded-[22px] border border-[#dce6fb] bg-[linear-gradient(135deg,#ffffff_0%,#f7f9ff_100%)] px-4 py-3 text-right shadow-[0_14px_32px_rgba(79,70,229,0.08)] dark:border-[#334267] dark:bg-[linear-gradient(135deg,rgba(31,45,73,0.96)_0%,rgba(16,25,43,0.94)_100%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.34)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#90a0c0] dark:text-[#9fb2d4]">{t('dashboard.legend_last_6_days')}</p>
              <p className="mt-2 text-2xl font-bold text-[#1f2440] dark:text-[#f8fbff]">+18.4%</p>
            </div>
          </div>

          <div className="mt-7">
            <div className="relative h-48 rounded-[24px] border border-[#edf1fa] bg-[linear-gradient(180deg,#fdfefe_0%,#f7f9ff_100%)] px-4 pb-5 pt-5 dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)]">
              <div className="absolute inset-x-4 top-1/2 border-t border-dashed border-[#edf0f7] dark:border-[#283247]" />
              <div className="flex h-full items-end justify-between">
                {[46, 34, 41, 31, 50, 55, 45, 39, 42, 31, 50, 55].map((v, i) => (
                  <div key={`g-${i}`} className="flex items-end gap-1.5">
                    <div className="w-2 rounded-t-[10px] bg-[linear-gradient(180deg,#7c8cff_0%,#4f62d8_100%)] shadow-[0_10px_24px_rgba(79,98,216,0.26)]" style={{ height: `${v + 8}px` }} />
                    <div className="w-2 rounded-t-[10px] bg-[#dce1eb] dark:bg-[#334155]" style={{ height: `${Math.max(v - 10, 24)}px` }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2 flex justify-between px-2 text-[11px] text-[#b0b7ca]">
              {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-6 text-[13px] text-[#8f98af] dark:text-[#c7d2e4]">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#4f62d8]" />
                {t('dashboard.legend_last_6_days')}
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#d5dae6]" />
                {t('dashboard.legend_last_week')}
              </div>
            </div>
          </div>
        </div>
        ) : null}

        {visibleSectionIds.has('order-time') ? (
        <div className={`col-span-12 p-7 ${visibleSectionIds.has('sales-overview') ? 'xl:col-span-4' : ''}`}>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-[19px] font-bold text-[#222840] dark:text-[#e5e7eb]">{t('dashboard.order_time')}</p>
              <p className="mt-2 text-[13px] text-[#a0a8bc]">{t('dashboard.order_time_period')}</p>
            </div>
            <button className="rounded-xl border border-[#e2e8f8] bg-white/80 px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.16em] text-[#6473db] transition-all duration-200 hover:bg-white hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-[#9eb0ff] dark:hover:bg-white/10">
              {t('common.view_report')}
            </button>
          </div>

          <div className="relative flex justify-center pt-4">
            <div
              className="h-44 w-44 rounded-full shadow-[0_24px_50px_rgba(99,102,241,0.2)]"
              style={{
                background:
                  'conic-gradient(#586bd9 0 40%, #8a98ec 40% 72%, #dbe4ff 72% 100%)',
              }}
            />
            <div className="absolute top-[42px] h-[108px] w-[108px] rounded-full bg-white dark:bg-[#0f172a]" />
            <div className="absolute right-1 top-[32px] rounded-[24px] bg-[#202a4f] px-4 py-4 text-white shadow-[0_20px_40px_rgba(15,23,42,0.28)]">
              <p className="text-[12px] font-bold">{t('dashboard.afternoon')}</p>
              <p className="text-[11px] text-[#cfd6ff]">{t('dashboard.afternoon_time')}</p>
              <p className="mt-1 text-[27px] font-extrabold leading-none">{t('dashboard.orders_count')}</p>
            </div>
          </div>

          <div className="mt-9 flex items-center justify-between text-[13px] text-[#8d95ab] dark:text-[#c7d2e4]">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#5569d9]" />
                {t('dashboard.afternoon')}
              </div>
              <p className="text-[18px] font-bold text-[#515a77] dark:text-[#e5e7eb]">40%</p>
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#8492e8]" />
                {t('dashboard.evening')}
              </div>
              <p className="text-[18px] font-bold text-[#515a77] dark:text-[#e5e7eb]">32%</p>
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#c8d0f7]" />
                {t('dashboard.morning')}
              </div>
              <p className="text-[18px] font-bold text-[#515a77] dark:text-[#e5e7eb]">28%</p>
            </div>
          </div>
        </div>
        ) : null}
      </div>
      ) : null}

      {visibleSectionIds.has('channel-performance') || visibleSectionIds.has('top-selling') || visibleSectionIds.has('orders') ? (
      <div className="grid grid-cols-12">
        {visibleSectionIds.has('channel-performance') ? (
        <div className="col-span-12 border-b border-[#e6e8ef]/80 p-7 dark:border-[#283247] lg:col-span-6 xl:col-span-4 xl:border-b-0 xl:border-r">
          <p className="text-[27px] font-extrabold text-[#1f2440] dark:text-[#e5e7eb]">{t('dashboard.channel_performance')}</p>
          <p className="mt-2 text-[13px] text-[#a0a8bc]">{t('dashboard.channel_subtitle')}</p>

          <div className="relative mt-8 h-[250px]">
            <div className="absolute left-[100px] top-[25px] grid h-[150px] w-[150px] place-items-center rounded-full border-[3px] border-[#f4a53a] text-center">
              <div>
                <p className="text-[46px] font-extrabold leading-none text-[#f2a334]">85%</p>
                <p className="text-[16px] font-semibold text-[#f2a334]">{t('dashboard.store_ux')}</p>
              </div>
            </div>
            <div className="absolute left-[34px] top-[0px] grid h-[96px] w-[96px] place-items-center rounded-full border-[3px] border-[#7f86e2] bg-[#777fe2] text-center text-white">
              <div>
                <p className="text-[34px] font-extrabold leading-none">85%</p>
                <p className="text-[13px] font-semibold">{t('dashboard.fulfillment')}</p>
              </div>
            </div>
            <div className="absolute left-[0px] top-[98px] grid h-[118px] w-[118px] place-items-center rounded-full border-[3px] border-[#44bfd8] bg-[#42bbd5] text-center text-white">
              <div>
                <p className="text-[37px] font-extrabold leading-none">92%</p>
                <p className="text-[13px] font-semibold">{t('dashboard.packaging')}</p>
              </div>
            </div>
          </div>
        </div>
        ) : null}

        {visibleSectionIds.has('top-selling') ? (
        <div className="col-span-12 border-b border-[#e6e8ef]/80 p-7 dark:border-[#283247] lg:col-span-6 xl:col-span-4 xl:border-b-0 xl:border-r">
          <p className="text-[27px] font-extrabold text-[#1f2440] dark:text-[#e5e7eb]">{t('dashboard.top_selling')}</p>
          <p className="mt-2 text-[13px] text-[#a0a8bc]">{t('dashboard.top_selling_subtitle')}</p>

            <div className="mt-8 space-y-4">
            {filteredTopProducts.map(([item, price]) => (
              <div key={item} className="flex items-center justify-between rounded-[18px] border border-[#eef2f8] bg-[#fbfcff] px-3 py-3 transition-colors hover:bg-white dark:border-white/8 dark:bg-white/5 dark:hover:bg-white/8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-[16px] bg-gradient-to-br from-[#f8c07a] via-[#e16d43] to-[#84b56a]" />
                  <p className="text-[14px] font-semibold text-[#515a77] dark:text-[#c7d2e4]">{item}</p>
                </div>
                <p className="text-[13px] font-semibold text-[#9aa2b8]">{price}</p>
              </div>
            ))}
            {filteredTopProducts.length === 0 ? (
              <div className="rounded-[18px] border border-dashed border-[#d9e2f3] px-3 py-6 text-center text-sm text-[#64748b] dark:border-[#334155] dark:text-[#9fb0c9]">
                No products match "{searchQuery}".
              </div>
            ) : null}
          </div>
        </div>
        ) : null}

        {visibleSectionIds.has('orders') ? (
        <div className="col-span-12 p-7 xl:col-span-4">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-[27px] font-extrabold text-[#1f2440] dark:text-[#e5e7eb]">{t('dashboard.orders')}</p>
              <p className="mt-1 text-[42px] font-extrabold leading-none text-[#1f2440] dark:text-[#e5e7eb]">{summary.orderCount.toLocaleString()}</p>
              <p className="mt-2 text-[13px] font-semibold text-[#ea5d5d]">
                {t('dashboard.vs_last_week_down')}
              </p>
              <p className="mt-3 text-[13px] text-[#a0a8bc]">{t('dashboard.orders_period')}</p>
            </div>
            <button className="rounded-xl border border-[#e2e8f8] bg-white/80 px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.16em] text-[#6473db] transition-all duration-200 hover:bg-white hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-[#9eb0ff] dark:hover:bg-white/10">
              {t('common.view_report')}
            </button>
          </div>

          <div className="mt-6 rounded-[22px] border border-[#edf0f7] bg-[#fbfcff] px-3 py-2 dark:border-white/8 dark:bg-white/5">
          <div className="h-36 border-b border-t border-dashed border-[#edf0f7] dark:border-[#283247]">
            <svg viewBox="0 0 320 130" className="h-full w-full">
              <polyline
                points="8,72 58,95 108,38 158,48 208,88 258,18"
                fill="none"
                stroke="#5b6edb"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <polyline
                points="8,45 58,18 108,80 158,22 208,51 258,31"
                fill="none"
                stroke="#d9deeb"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          </div>

          <div className="mt-2 flex justify-between px-2 text-[11px] text-[#b0b7ca]">
            {['01', '02', '03', '04', '05', '06'].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-6 text-[13px] text-[#8f98af] dark:text-[#c7d2e4]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#4f62d8]" />
              {t('dashboard.legend_last_6_days')}
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#d5dae6]" />
              {t('dashboard.legend_last_week')}
            </div>
          </div>
        </div>
        ) : null}
      </div>
      ) : null}
      </div>
    </section>
  );
}

export default EcommerceDashboardPage;
