import { useEffect, useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import { getCarts } from '../../../services/api/dummyJsonApi';

function EcommerceDashboardPage() {
  const { t } = useI18n();
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
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="overflow-hidden rounded-sm border border-[#e6e8ef] bg-white dark:border-[#283247] dark:bg-[#111827]">
      <div className="grid grid-cols-12 border-b border-[#e6e8ef] dark:border-[#283247]">
        <div className="col-span-12 border-b border-[#e6e8ef] p-6 dark:border-[#283247] xl:col-span-8 xl:border-b-0 xl:border-r">
          <h1 className="mb-8 text-[32px] font-extrabold leading-none text-[#1d2341] dark:text-[#e5e7eb]">
            {t('dashboard.title')}
          </h1>

          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-[19px] font-bold text-[#222840] dark:text-[#e5e7eb]">{t('dashboard.total_sales')}</p>
              <p className="mt-2 text-[37px] font-extrabold tracking-tight text-[#1f2440] dark:text-[#e5e7eb]">
                {summary.totalSales}
              </p>
              <p className="mt-1 text-[13px] font-semibold text-[#23a16d]">
                {t('dashboard.vs_last_week_up')}
              </p>
              <p className="mt-4 text-[13px] text-[#a0a8bc]">{t('dashboard.sales_period')}</p>
            </div>
            <button className="rounded-md border border-[#e9ecf5] px-5 py-2 text-[12px] font-bold text-[#6473db] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f8faff] hover:shadow-sm dark:border-[#2f3b54] dark:text-[#9eb0ff] dark:hover:bg-[#182235]">
              {t('common.view_report')}
            </button>
          </div>

          <div className="mt-7">
            <div className="relative h-44 rounded-lg border-b border-t border-dashed border-[#edf0f7] px-2 pb-6 pt-4 dark:border-[#283247]">
              <div className="absolute inset-x-2 top-1/2 border-t border-dashed border-[#edf0f7] dark:border-[#283247]" />
              <div className="flex h-full items-end justify-between">
                {[46, 34, 41, 31, 50, 55, 45, 39, 42, 31, 50, 55].map((v, i) => (
                  <div key={`g-${i}`} className="flex items-end gap-1.5">
                    <div className="w-1.5 rounded-t-[2px] bg-[#4f62d8]" style={{ height: `${v}px` }} />
                    <div className="w-1.5 rounded-t-[2px] bg-[#dce1eb]" style={{ height: `${Math.max(v - 14, 20)}px` }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2 flex justify-between px-2 text-[11px] text-[#b0b7ca]">
              {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-6 text-[13px] text-[#8f98af]">
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

        <div className="col-span-12 p-6 xl:col-span-4">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-[19px] font-bold text-[#222840] dark:text-[#e5e7eb]">{t('dashboard.order_time')}</p>
              <p className="mt-2 text-[13px] text-[#a0a8bc]">{t('dashboard.order_time_period')}</p>
            </div>
            <button className="rounded-md border border-[#e9ecf5] px-5 py-2 text-[12px] font-bold text-[#6473db] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f8faff] hover:shadow-sm dark:border-[#2f3b54] dark:text-[#9eb0ff] dark:hover:bg-[#182235]">
              {t('common.view_report')}
            </button>
          </div>

          <div className="relative flex justify-center pt-4">
            <div
              className="h-40 w-40 rounded-full"
              style={{
                background:
                  'conic-gradient(#586bd9 0 40%, #8a98ec 40% 72%, #c8d0f7 72% 100%)',
              }}
            />
            <div className="absolute top-[38px] h-[100px] w-[100px] rounded-full bg-white" />
            <div className="absolute right-1 top-[32px] rounded-md bg-[#2f3564] px-4 py-3 text-white shadow-lg">
              <p className="text-[12px] font-bold">{t('dashboard.afternoon')}</p>
              <p className="text-[11px] text-[#cfd6ff]">{t('dashboard.afternoon_time')}</p>
              <p className="mt-1 text-[27px] font-extrabold leading-none">{t('dashboard.orders_count')}</p>
            </div>
          </div>

          <div className="mt-9 flex items-center justify-between text-[13px] text-[#8d95ab]">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#5569d9]" />
                {t('dashboard.afternoon')}
              </div>
              <p className="text-[18px] font-bold text-[#515a77]">40%</p>
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#8492e8]" />
                {t('dashboard.evening')}
              </div>
              <p className="text-[18px] font-bold text-[#515a77]">32%</p>
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#c8d0f7]" />
                {t('dashboard.morning')}
              </div>
              <p className="text-[18px] font-bold text-[#515a77]">28%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-12 border-b border-[#e6e8ef] p-6 dark:border-[#283247] lg:col-span-6 xl:col-span-4 xl:border-b-0 xl:border-r">
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

        <div className="col-span-12 border-b border-[#e6e8ef] p-6 dark:border-[#283247] lg:col-span-6 xl:col-span-4 xl:border-b-0 xl:border-r">
          <p className="text-[27px] font-extrabold text-[#1f2440] dark:text-[#e5e7eb]">{t('dashboard.top_selling')}</p>
          <p className="mt-2 text-[13px] text-[#a0a8bc]">{t('dashboard.top_selling_subtitle')}</p>

            <div className="mt-8 space-y-4">
            {summary.topProducts.map(([item, price]) => (
              <div key={item} className="flex items-center justify-between rounded-md border-b border-[#f0f2f8] px-2 pb-3 pt-2 transition-colors hover:bg-[#f8faff] dark:border-[#283247] dark:hover:bg-[#182235] last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#f8c07a] via-[#e16d43] to-[#84b56a]" />
                  <p className="text-[14px] font-semibold text-[#515a77] dark:text-[#c7d2e4]">{item}</p>
                </div>
                <p className="text-[13px] font-semibold text-[#9aa2b8]">{price}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 p-6 xl:col-span-4">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-[27px] font-extrabold text-[#1f2440] dark:text-[#e5e7eb]">{t('dashboard.orders')}</p>
              <p className="mt-1 text-[42px] font-extrabold leading-none text-[#1f2440] dark:text-[#e5e7eb]">{summary.orderCount.toLocaleString()}</p>
              <p className="mt-2 text-[13px] font-semibold text-[#ea5d5d]">
                {t('dashboard.vs_last_week_down')}
              </p>
              <p className="mt-3 text-[13px] text-[#a0a8bc]">{t('dashboard.orders_period')}</p>
            </div>
            <button className="rounded-md border border-[#e9ecf5] px-5 py-2 text-[12px] font-bold text-[#6473db] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f8faff] hover:shadow-sm dark:border-[#2f3b54] dark:text-[#9eb0ff] dark:hover:bg-[#182235]">
              {t('common.view_report')}
            </button>
          </div>

          <div className="mt-6 h-36 border-b border-t border-dashed border-[#edf0f7] dark:border-[#283247]">
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

          <div className="mt-2 flex justify-between px-2 text-[11px] text-[#b0b7ca]">
            {['01', '02', '03', '04', '05', '06'].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-6 text-[13px] text-[#8f98af]">
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
    </section>
  );
}

export default EcommerceDashboardPage;
