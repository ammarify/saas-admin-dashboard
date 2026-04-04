import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import { SkeletonCard } from '../../../shared/components/ui/Skeleton';
import { toast } from 'react-toastify';
import { addPost, getPosts, updatePost } from '../../../services/api/dummyJsonApi';

const PAGE_SIZE = 4;

function HelpPage() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ open: false, mode: 'add', row: null });
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ id: '', subject: '', priority: 'medium', assignee: '', status: 'open' });

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
    setForm({ id: `SUP-${8800 + tickets.length + 1}`, subject: '', priority: 'medium', assignee: '', status: 'open' });
    setModal({ open: true, mode: 'add', row: null });
  }

  function openUpdateModal(row) {
    if (!row) return;
    setForm({ id: row.id || '', subject: row.subject || '', priority: row.priority || 'medium', assignee: row.assignee || '', status: row.status || 'open' });
    setModal({ open: true, mode: 'update', row });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (modal.mode === 'add') {
        const created = await addPost({ title: form.subject || 'New Support Ticket', body: 'Created from dashboard', userId: 1 });
        setTickets((prev) => [
          {
            id: form.id || `SUP-${8800 + created.id}`,
            rawId: created.id,
            subject: form.subject || created.title,
            priority: form.priority || 'medium',
            assignee: form.assignee || 'Agent #1',
            status: form.status || 'open',
          },
          ...prev,
        ]);
        toast.success('Ticket added successfully');
      } else if (modal.row?.rawId) {
        await updatePost(modal.row.rawId, { title: form.subject || modal.row.subject, body: 'Updated from dashboard' });
        setTickets((prev) => prev.map((item) => (item.rawId === modal.row.rawId ? { ...item, id: form.id || item.id, subject: form.subject || item.subject, priority: form.priority || item.priority, assignee: form.assignee || item.assignee, status: form.status || item.status } : item)));
        toast.success('Ticket updated successfully');
      }
      setModal({ open: false, mode: 'add', row: null });
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

      <div className="flex flex-wrap items-center gap-3 rounded-sm border border-[#e6e8ef] bg-white p-4 dark:border-[#283247] dark:bg-[#111827]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ticket id, subject, or assignee..."
          className="h-10 min-w-[220px] flex-1 rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0]"
        />
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="h-10 min-w-[180px] rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0]"
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-sm border border-[#e6e8ef] bg-white p-5 xl:col-span-2 dark:border-[#283247] dark:bg-[#111827]">
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
                  <span>{t('support.priority')}: {ticket.priority[0].toUpperCase() + ticket.priority.slice(1)}</span>
                  <span>{t('support.assignee')}: {ticket.assignee}</span>
                  <span>{t('support.status')}: {t(`support.${ticket.status}`)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-[#9aa3b8] dark:text-[#94a3b8]">
              Showing {filteredTickets.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredTickets.length)} of {filteredTickets.length}
            </p>
            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
          </div>
        </article>

        <article className="rounded-sm border border-[#e6e8ef] bg-white p-5 dark:border-[#283247] dark:bg-[#111827]">
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
          onSubmit={handleSubmit}
        >
          <label className="block text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
            ID
            <input value={form.id} onChange={(e) => setForm((prev) => ({ ...prev, id: e.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
          </label>
          <label className="block text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
            {t('support.open_tickets')}
            <input value={form.subject} onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
          </label>
          <label className="block text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
            {t('support.priority')}
            <select value={form.priority} onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label className="block text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
            {t('support.assignee')}
            <input value={form.assignee} onChange={(e) => setForm((prev) => ({ ...prev, assignee: e.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
          </label>
          <label className="block text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
            {t('support.status')}
            <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]">
              <option value="open">{t('support.open')}</option>
              <option value="in_progress">{t('support.in_progress')}</option>
            </select>
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" disabled={isSubmitting} onClick={() => setModal({ open: false, mode: 'add', row: null })} className="rounded-md border border-[#e7ebf5] px-4 py-2 text-xs font-bold text-[#6f7a96] dark:border-[#2f3b54] dark:text-[#c7d2e4]">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white disabled:opacity-70">{isSubmitting ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

export default HelpPage;
