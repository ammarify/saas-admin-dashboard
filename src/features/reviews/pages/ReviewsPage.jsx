import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';

const PAGE_SIZE = 4;

function ReviewsPage() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState({ open: false, row: null });
  const reviews = [
    { customer: 'Sophia Wilson', rating: 5, message: 'Fast shipping and premium quality product.' },
    { customer: 'James Moore', rating: 4, message: 'Great experience, packaging can be improved.' },
    { customer: 'Olivia Davis', rating: 5, message: 'Excellent support and smooth checkout.' },
    { customer: 'Henry Lee', rating: 3, message: 'Delivery took longer than expected.' },
    { customer: 'Ava Johnson', rating: 5, message: 'Excellent value for money and fast delivery.' },
    { customer: 'Noah Carter', rating: 4, message: 'Product quality is good and support is responsive.' },
    { customer: 'Mia Brown', rating: 5, message: 'Super smooth checkout and accurate tracking updates.' },
    { customer: 'Ethan Hall', rating: 4, message: 'Loved the product, but delivery was slightly delayed.' },
  ];
  const totalPages = Math.ceil(reviews.length / PAGE_SIZE);
  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return reviews.slice(start, start + PAGE_SIZE);
  }, [page, reviews]);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[30px] font-extrabold text-[#1d2341] dark:text-[#e5e7eb]">{t('reviews.title')}</h1>
          <p className="text-sm text-[#96a0b7] dark:text-[#94a3b8]">{t('reviews.subtitle')}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [t('reviews.avg_rating'), '4.6 / 5'],
          [t('reviews.total_reviews'), '1,924'],
          [t('reviews.positive'), '82%'],
          [t('reviews.needs_attention'), '7%'],
        ].map(([label, value]) => (
          <article key={label} className="rounded-sm border border-[#e6e8ef] bg-white px-5 py-4 dark:border-[#283247] dark:bg-[#111827]">
            <p className="text-xs uppercase tracking-wide text-[#9ba4b9]">{label}</p>
            <p className="mt-1 text-2xl font-extrabold text-[#1f2440] dark:text-[#e5e7eb]">{value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {rows.map((review) => (
          <article key={review.customer} className="rounded-sm border border-[#e6e8ef] bg-white p-5 dark:border-[#283247] dark:bg-[#111827]">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1f2440] dark:text-[#e5e7eb]">{review.customer}</h2>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <svg
                    key={`${review.customer}-star-${index}`}
                    viewBox="0 0 24 24"
                    className={`h-4 w-4 ${index < review.rating ? 'text-[#f0a42a]' : 'text-[#cfd6e6] dark:text-[#4b5567]'}`}
                    fill="currentColor"
                  >
                    <path d="m12 2.5 2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 17.33 6.2 20.37l1.1-6.47-4.7-4.58 6.5-.94L12 2.5z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-sm text-[#66708d] dark:text-[#c7d2e4]">{review.message}</p>
            <button onClick={() => setModal({ open: true, row: review })} className="mt-4 rounded-md border border-[#e6e9f4] px-3 py-1.5 text-xs font-semibold text-[#6070da] dark:border-[#2f3b54] dark:text-[#9eb0ff]">{t('common.update')}</button>
          </article>
        ))}
      </div>

      <div className="flex justify-end rounded-sm border border-[#e6e8ef] bg-white px-5 py-4 dark:border-[#283247] dark:bg-[#111827]">
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </div>

      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, row: null })}
        title={`${t('common.update')} ${t('reviews.title')}`}
        subtitle={t('reviews.subtitle')}
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setModal({ open: false, row: null });
          }}
        >
          <label className="block text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
            {t('customers.col_name')}
            <input defaultValue={modal.row?.customer || ''} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
          </label>
          <label className="block text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
            {t('reviews.title')}
            <textarea defaultValue={modal.row?.message || ''} rows={4} className="mt-1 w-full rounded-md border border-[#e7ebf5] bg-white px-3 py-2 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModal({ open: false, row: null })} className="rounded-md border border-[#e7ebf5] px-4 py-2 text-xs font-bold text-[#6f7a96] dark:border-[#2f3b54] dark:text-[#c7d2e4]">Cancel</button>
            <button type="submit" className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white">Save</button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

export default ReviewsPage;
