import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import { SkeletonCard } from '../../../shared/components/ui/Skeleton';
import { toast } from 'react-toastify';
import { getComments, updateComment } from '../../../services/api/dummyJsonApi';
import { useNotifications } from '../../../shared/notifications/notificationsContext';

const PAGE_SIZE = 4;

function ReviewsPage() {
  const { t, language } = useI18n();
  const { addNotification } = useNotifications();
  const isArabic = language === 'ar';
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ open: false, row: null });
  const [reviews, setReviews] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { customer: '', rating: '5', message: '' },
  });

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    getComments()
      .then((comments) => {
        if (!ignore) {
          setReviews(
            comments.map((comment) => ({
              id: comment.id,
              customer: comment.user?.fullName || `User #${comment.user?.id || 0}`,
              rating: (comment.likes % 5) + 1,
              message: comment.body,
            }))
          );
        }
      })
      .catch(() => {
        if (!ignore) {
          setReviews([]);
          toast.error('Error occurred');
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);
  const filteredReviews = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reviews.filter((review) => {
      const matchesQuery =
        !q ||
        review.customer.toLowerCase().includes(q) ||
        review.message.toLowerCase().includes(q);
      const matchesRating =
        ratingFilter === 'all' ||
        (ratingFilter === 'high' && review.rating >= 4) ||
        (ratingFilter === 'low' && review.rating < 4);
      return matchesQuery && matchesRating;
    });
  }, [reviews, query, ratingFilter]);
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / PAGE_SIZE));
  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredReviews.slice(start, start + PAGE_SIZE);
  }, [page, filteredReviews]);

  useEffect(() => {
    setPage(1);
  }, [query, ratingFilter]);

  function openUpdateModal(row) {
    if (!row) return;
    reset({ customer: row.customer || '', rating: String(row.rating || 5), message: row.message || '' });
    setModal({ open: true, row });
  }

  async function onSubmit(values) {
    if (!modal.row?.id) return;
    setIsSubmitting(true);
    try {
      await updateComment(modal.row.id, { body: values.message.trim() });
      setReviews((prev) =>
        prev.map((item) =>
          item.id === modal.row.id
            ? { ...item, customer: values.customer, rating: Number(values.rating), message: values.message }
            : item
        )
      );
      addNotification({
        title: isArabic ? 'تم تحديث المراجعة' : 'Review updated',
        detail: isArabic ? `تم تحديث مراجعة ${values.customer.trim()}.` : `Review from ${values.customer.trim()} was updated.`,
      });
      setModal({ open: false, row: null });
      toast.success('Review updated successfully');
    } catch {
      toast.error('Error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[30px] font-extrabold text-[#1d2341] dark:text-[#e5e7eb]">{t('reviews.title')}</h1>
          <p className="text-sm text-[#96a0b7] dark:text-[#94a3b8]">{t('reviews.subtitle')}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-sm border border-[#e6e8ef] bg-white p-4 dark:border-[#283247] dark:bg-[#111827] sm:flex-row sm:flex-wrap sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isArabic ? 'ابحث عن المراجع أو التعليق...' : 'Search reviewer or feedback...'}
          className="h-10 w-full min-w-0 flex-1 rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0] sm:min-w-[220px]"
        />
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="select-field h-10 w-full min-w-0 rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0] sm:min-w-[180px] sm:w-auto"
        >
          <option value="all">{isArabic ? 'جميع التقييمات' : 'All Ratings'}</option>
          <option value="high">{isArabic ? '4-5 نجوم' : '4-5 Stars'}</option>
          <option value="low">{isArabic ? '1-3 نجوم' : '1-3 Stars'}</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [t('reviews.avg_rating'), `${(reviews.reduce((sum, review) => sum + review.rating, 0) / Math.max(reviews.length, 1)).toFixed(1)} / 5`],
          [t('reviews.total_reviews'), String(reviews.length)],
          [t('reviews.positive'), `${Math.round((reviews.filter((review) => review.rating >= 4).length / Math.max(reviews.length, 1)) * 100)}%`],
          [t('reviews.needs_attention'), `${Math.round((reviews.filter((review) => review.rating <= 2).length / Math.max(reviews.length, 1)) * 100)}%`],
        ].map(([label, value]) => (
          <article key={label} className="rounded-sm border border-[#e6e8ef] bg-white px-5 py-4 dark:border-[#283247] dark:bg-[#111827]">
            <p className="text-xs uppercase tracking-wide text-[#9ba4b9]">{label}</p>
            <p className="mt-1 text-2xl font-extrabold text-[#1f2440] dark:text-[#e5e7eb]">{value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {isLoading
          ? Array.from({ length: PAGE_SIZE }, (_, index) => <SkeletonCard key={`review-skeleton-${index}`} />)
          : rows.map((review) => (
          <article key={review.customer} className="rounded-sm border border-[#e6e8ef] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-[#283247] dark:bg-[#111827]">
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
            <button onClick={() => openUpdateModal(review)} className="mt-4 rounded-md border border-[#e6e9f4] px-3 py-1.5 text-xs font-semibold text-[#6070da] dark:border-[#2f3b54] dark:text-[#9eb0ff]">{t('common.update')}</button>
          </article>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-sm border border-[#e6e8ef] bg-white px-5 py-4 dark:border-[#283247] dark:bg-[#111827] sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[#9aa3b8] dark:text-[#94a3b8]">
          {isArabic ? 'عرض' : 'Showing'} {filteredReviews.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredReviews.length)} {t('orders.of')} {filteredReviews.length}
        </p>
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </div>

      <Modal
        isOpen={modal.open}
        onClose={() => !isSubmitting && setModal({ open: false, row: null })}
        title={`${t('common.update')} ${t('reviews.title')}`}
        subtitle={t('reviews.subtitle')}
      >
        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <label className="block text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
            {t('customers.col_name')}
            <input {...register('customer', { required: 'Customer name is required' })} className={`mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.customer ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`} />
            {errors.customer ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.customer.message}</p> : null}
          </label>
          <label className="block text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
            {isArabic ? 'التقييم' : 'Rating'}
            <input type="number" min="1" max="5" {...register('rating', { required: 'Rating is required', min: { value: 1, message: 'Rating must be at least 1' }, max: { value: 5, message: 'Rating cannot be more than 5' } })} className={`mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.rating ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`} />
            {errors.rating ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.rating.message}</p> : null}
          </label>
          <label className="block text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
            {t('reviews.title')}
            <textarea {...register('message', { required: 'Review message is required' })} rows={4} className={`mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm dark:bg-[#0f172a] ${errors.message ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`} />
            {errors.message ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.message.message}</p> : null}
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" disabled={isSubmitting} onClick={() => setModal({ open: false, row: null })} className="rounded-md border border-[#e7ebf5] px-4 py-2 text-xs font-bold text-[#6f7a96] dark:border-[#2f3b54] dark:text-[#c7d2e4]">{isArabic ? 'إلغاء' : 'Cancel'}</button>
            <button type="submit" disabled={isSubmitting} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white disabled:opacity-70">{isSubmitting ? (isArabic ? 'جاري الحفظ...' : 'Saving...') : (isArabic ? 'حفظ' : 'Save')}</button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

export default ReviewsPage;
