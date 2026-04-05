import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import { SkeletonCard } from '../../../shared/components/ui/Skeleton';
import { toast } from 'react-toastify';
import { addPost, getPosts, updatePost } from '../../../services/api/dummyJsonApi';
import { useNotifications } from '../../../shared/notifications/notificationsContext';

const PAGE_SIZE = 4;

function HelpPage() {
  const { t, language } = useI18n();
  const { addNotification } = useNotifications();
  const isArabic = language === 'ar';
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ open: false, mode: 'add', row: null });
  const [tickets, setTickets] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { id: '', subject: '', priority: 'medium', assignee: '', status: 'open' },
  });

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    getPosts()
      .then((posts) => {
        if (!ignore) {
          setTickets(
            posts.map((post, index) => ({
              id: `SUP-${8800 + post.id}`,
              rawId: post.id,
              subject: post.title,
              priority: index % 3 === 0 ? 'high' : index % 3 === 1 ? 'medium' : 'low',
              assignee: `Agent #${(post.userId || 1)}`,
              status: index % 2 === 0 ? 'open' : 'in_progress',
            }))
          );
        }
      })
      .catch(() => {
        if (!ignore) {
          setTickets([]);
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
  const filteredTickets = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesQuery =
        !q ||
        ticket.id.toLowerCase().includes(q) ||
        ticket.subject.toLowerCase().includes(q) ||
        ticket.assignee.toLowerCase().includes(q);
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
      return matchesQuery && matchesPriority;
    });
  }, [tickets, query, priorityFilter]);
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / PAGE_SIZE));
  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredTickets.slice(start, start + PAGE_SIZE);
  }, [page, filteredTickets]);

  useEffect(() => {
    setPage(1);
  }, [query, priorityFilter]);

  function openAddModal() {
    reset({ id: `SUP-${8800 + tickets.length + 1}`, subject: '', priority: 'medium', assignee: '', status: 'open' });
    setModal({ open: true, mode: 'add', row: null });
  }

  function openUpdateModal(row) {
    if (!row) return;
    reset({ id: row.id || '', subject: row.subject || '', priority: row.priority || 'medium', assignee: row.assignee || '', status: row.status || 'open' });
    setModal({ open: true, mode: 'update', row });
  }

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      if (modal.mode === 'add') {
        const created = await addPost({ title: values.subject, body: 'Created from dashboard', userId: 1 });
        setTickets((prev) => [
          {
            id: values.id,
            rawId: created.id,
            subject: values.subject,
            priority: values.priority,
            assignee: values.assignee,
            status: values.status,
          },
          ...prev,
        ]);
        addNotification({
          title: isArabic ? 'تمت إضافة تذكرة' : 'Ticket added',
          detail: isArabic ? `تم إنشاء ${values.id} للمسؤول ${values.assignee}.` : `${values.id} was created for ${values.assignee}.`,
        });
        toast.success('Ticket added successfully');
      } else if (modal.row?.rawId) {
        await updatePost(modal.row.rawId, { title: values.subject, body: 'Updated from dashboard' });
        setTickets((prev) => prev.map((item) => (item.rawId === modal.row.rawId ? { ...item, id: values.id, subject: values.subject, priority: values.priority, assignee: values.assignee, status: values.status } : item)));
        addNotification({
          title: isArabic ? 'تم تحديث التذكرة' : 'Ticket updated',
          detail: isArabic ? `تم تحديث ${values.id} بنجاح.` : `${values.id} was updated successfully.`,
        });
        toast.success('Ticket updated successfully');
      }
      setModal({ open: false, mode: 'add', row: null });
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
          <h1 className="text-[30px] font-extrabold text-[#1d2341] dark:text-[#e5e7eb]">{t('support.title')}</h1>
          <p className="text-sm text-[#96a0b7] dark:text-[#94a3b8]">{t('support.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={openAddModal} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white">{t('support.add_ticket')}</button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-sm border border-[#e6e8ef] bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center dark:border-[#283247] dark:bg-[#111827]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isArabic ? 'ابحث عن رقم التذكرة أو الموضوع أو المسؤول...' : 'Search ticket id, subject, or assignee...'}
          className="h-10 w-full min-w-0 flex-1 rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] sm:min-w-[220px] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0]"
        />
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="select-field h-10 w-full min-w-0 rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] sm:min-w-[180px] sm:w-auto dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0]"
        >
          <option value="all">{isArabic ? 'جميع الأولويات' : 'All Priority'}</option>
          <option value="high">{isArabic ? 'مرتفع' : 'High'}</option>
          <option value="medium">{isArabic ? 'متوسط' : 'Medium'}</option>
          <option value="low">{isArabic ? 'منخفض' : 'Low'}</option>
        </select>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-sm border border-[#e6e8ef] bg-white p-4 sm:p-5 xl:col-span-2 dark:border-[#283247] dark:bg-[#111827]">
          <h2 className="mb-3 text-lg font-bold text-[#1f2440] dark:text-[#e5e7eb]">{t('support.open_tickets')}</h2>
          <div className="space-y-3">
            {isLoading
              ? Array.from({ length: PAGE_SIZE }, (_, index) => <SkeletonCard key={`ticket-skeleton-${index}`} />)
              : rows.map((ticket) => (
              <div key={ticket.id} className="rounded-md border border-[#edf0f7] p-4 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-[#2b364d]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[#293151] dark:text-[#e2e8f0]">{ticket.subject}</p>
                  <span className="text-xs font-semibold text-[#6070da]">{ticket.id}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#7d87a2] dark:text-[#94a3b8]">
                  <span>{t('support.priority')}: {isArabic ? (ticket.priority === 'high' ? 'مرتفع' : ticket.priority === 'medium' ? 'متوسط' : 'منخفض') : ticket.priority[0].toUpperCase() + ticket.priority.slice(1)}</span>
                  <span>{t('support.assignee')}: {ticket.assignee}</span>
                  <span>{t('support.status')}: {t(`support.${ticket.status}`)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#9aa3b8] dark:text-[#94a3b8]">
              {isArabic ? 'عرض' : 'Showing'} {filteredTickets.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredTickets.length)} {t('orders.of')} {filteredTickets.length}
            </p>
            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
          </div>
        </article>

        <article className="rounded-sm border border-[#e6e8ef] bg-white p-4 sm:p-5 dark:border-[#283247] dark:bg-[#111827]">
          <h2 className="mb-3 text-lg font-bold text-[#1f2440] dark:text-[#e5e7eb]">{t('support.knowledge_base')}</h2>
          <ul className="space-y-2 text-sm text-[#5f6987] dark:text-[#c7d2e4]">
            <li className="rounded-md border border-[#edf0f7] p-3 dark:border-[#2b364d]">How to process refunds</li>
            <li className="rounded-md border border-[#edf0f7] p-3 dark:border-[#2b364d]">Managing delivery partners</li>
            <li className="rounded-md border border-[#edf0f7] p-3 dark:border-[#2b364d]">Optimizing checkout flow</li>
            <li className="rounded-md border border-[#edf0f7] p-3 dark:border-[#2b364d]">Promo and discount policies</li>
          </ul>
        </article>
      </div>

      <Modal
        isOpen={modal.open}
        onClose={() => !isSubmitting && setModal({ open: false, mode: 'add', row: null })}
        title={`${modal.mode === 'add' ? t('common.add') : t('common.update')} ${t('support.title')}`}
        subtitle={t('support.subtitle')}
      >
        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <label className="block text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
            ID
            <input {...register('id', { required: 'Ticket ID is required' })} className={`mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.id ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`} />
            {errors.id ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.id.message}</p> : null}
          </label>
          <label className="block text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
            {t('support.open_tickets')}
            <input {...register('subject', { required: 'Subject is required' })} className={`mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.subject ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`} />
            {errors.subject ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.subject.message}</p> : null}
          </label>
          <label className="block text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
            {t('support.priority')}
              <select {...register('priority', { required: 'Priority is required' })} className={`select-field mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.priority ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`}>
              <option value="high">{isArabic ? 'مرتفع' : 'High'}</option>
              <option value="medium">{isArabic ? 'متوسط' : 'Medium'}</option>
              <option value="low">{isArabic ? 'منخفض' : 'Low'}</option>
            </select>
            {errors.priority ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.priority.message}</p> : null}
          </label>
          <label className="block text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
            {t('support.assignee')}
            <input {...register('assignee', { required: 'Assignee is required' })} className={`mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.assignee ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`} />
            {errors.assignee ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.assignee.message}</p> : null}
          </label>
          <label className="block text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
            {t('support.status')}
              <select {...register('status', { required: 'Status is required' })} className={`select-field mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.status ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`}>
              <option value="open">{t('support.open')}</option>
              <option value="in_progress">{t('support.in_progress')}</option>
            </select>
            {errors.status ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.status.message}</p> : null}
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" disabled={isSubmitting} onClick={() => setModal({ open: false, mode: 'add', row: null })} className="rounded-md border border-[#e7ebf5] px-4 py-2 text-xs font-bold text-[#6f7a96] dark:border-[#2f3b54] dark:text-[#c7d2e4]">{isArabic ? 'إلغاء' : 'Cancel'}</button>
            <button type="submit" disabled={isSubmitting} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white disabled:opacity-70">{isSubmitting ? (isArabic ? 'جاري الحفظ...' : 'Saving...') : (isArabic ? 'حفظ' : 'Save')}</button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

export default HelpPage;
