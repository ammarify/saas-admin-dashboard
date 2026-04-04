import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import { SkeletonRow } from '../../../shared/components/ui/Skeleton';
import { toast } from 'react-toastify';
import { addTodo, getTodos, updateTodo } from '../../../services/api/dummyJsonApi';

const PAGE_SIZE = 5;

function PaymentsPage() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ open: false, mode: 'add', row: null });
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ id: '', method: '', amount: '', date: '', status: 'status_pending' });

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    getTodos()
      .then((todos) => {
        if (!ignore) {
          setPayments(
            todos.map((todo, index) => ({
              id: `PAY-${5500 + todo.id}`,
              rawId: todo.id,
              method: index % 3 === 0 ? 'Stripe' : index % 3 === 1 ? 'Card' : 'PayPal',
              amount: `$${(40 + todo.id * 3.2).toFixed(2)}`,
              status: todo.completed ? 'status_paid' : index % 2 ? 'status_pending' : 'status_refunded',
              date: `2026-12-${String((todo.id % 28) + 1).padStart(2, '0')}`,
            }))
          );
        }
      })
      .catch(() => {
        if (!ignore) {
          setPayments([]);
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
  const filteredPayments = useMemo(() => {
    const q = query.trim().toLowerCase();
    return payments.filter((payment) => {
      const matchesQuery =
        !q ||
        payment.id.toLowerCase().includes(q) ||
        payment.method.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [payments, query, statusFilter]);
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / PAGE_SIZE));
  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredPayments.slice(start, start + PAGE_SIZE);
  }, [page, filteredPayments]);

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter]);

  function openAddModal() {
    setForm({ id: `PAY-${5500 + payments.length + 1}`, method: '', amount: '', date: new Date().toISOString().slice(0, 10), status: 'status_pending' });
    setModal({ open: true, mode: 'add', row: null });
  }

  function openUpdateModal(row) {
    if (!row) return;
    setForm({ id: row.id || '', method: row.method || '', amount: String(row.amount).replace(/[^\d.]/g, ''), date: row.date || '', status: row.status || 'status_pending' });
    setModal({ open: true, mode: 'update', row });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    const numericAmount = Number(String(form.amount || '').replace(/[^\d.]/g, '')) || 0;
    try {
      if (modal.mode === 'add') {
        const created = await addTodo({ todo: form.method || 'Payment', completed: false, userId: 1 });
        setPayments((prev) => [
          {
            id: form.id || `PAY-${5500 + created.id}`,
            rawId: created.id,
            method: form.method || 'Card',
            amount: `$${numericAmount.toFixed(2)}`,
            status: form.status || 'status_pending',
            date: form.date || new Date().toISOString().slice(0, 10),
          },
          ...prev,
        ]);
        toast.success('Payment added successfully');
      } else if (modal.row?.rawId) {
        await updateTodo(modal.row.rawId, { completed: true });
        setPayments((prev) => prev.map((item) => (item.rawId === modal.row.rawId ? { ...item, id: form.id || item.id, method: form.method || item.method, amount: `$${numericAmount.toFixed(2)}`, date: form.date || item.date, status: form.status || 'status_paid' } : item)));
        toast.success('Payment updated successfully');
      }
      setModal((prev) => ({ ...prev, open: false }));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[30px] font-extrabold text-[#1d2341] dark:text-[#e5e7eb]">{t('payments.title')}</h1>
          <p className="text-sm text-[#96a0b7] dark:text-[#94a3b8]">{t('payments.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={openAddModal} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white">{t('payments.add_payment')}</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-sm border border-[#e6e8ef] bg-white p-4 dark:border-[#283247] dark:bg-[#111827]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search payment id or method..."
          className="h-10 min-w-[220px] flex-1 rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 min-w-[180px] rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0]"
        >
          <option value="all">All Status</option>
          <option value="status_paid">{t('payments.status_paid')}</option>
          <option value="status_pending">{t('payments.status_pending')}</option>
          <option value="status_refunded">{t('payments.status_refunded')}</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-sm border border-[#e6e8ef] bg-white dark:border-[#283247] dark:bg-[#111827]">
        <table className="min-w-full text-left">
          <thead className="border-b border-[#edf0f7] bg-[#f9faff] text-xs uppercase tracking-wider text-[#a0a9bf] dark:border-[#283247] dark:bg-[#0f172a] dark:text-[#94a3b8]">
            <tr>
              <th className="px-5 py-3">{t('payments.col_id')}</th>
              <th className="px-5 py-3">{t('payments.col_method')}</th>
              <th className="px-5 py-3">{t('payments.col_amount')}</th>
              <th className="px-5 py-3">{t('payments.col_date')}</th>
              <th className="px-5 py-3">{t('payments.col_status')}</th>
              <th className="px-5 py-3">{t('payments.col_action')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: PAGE_SIZE }, (_, index) => <SkeletonRow key={`payment-skeleton-${index}`} columns={6} />)
              : rows.map((payment) => (
              <tr key={payment.id} className="border-b border-[#f0f2f8] text-sm text-[#4c5674] transition hover:bg-[#fafbff] dark:border-[#1f2a3d] dark:text-[#c7d2e4] dark:hover:bg-[#182235]">
                <td className="px-5 py-3 font-semibold text-[#2a3150] dark:text-[#e2e8f0]">{payment.id}</td>
                <td className="px-5 py-3">{payment.method}</td>
                <td className="px-5 py-3 font-semibold">{payment.amount}</td>
                <td className="px-5 py-3">{payment.date}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    payment.status === 'status_paid'
                      ? 'bg-[#e9f8f0] text-[#1e9c67]'
                      : payment.status === 'status_pending'
                        ? 'bg-[#fff8e9] text-[#c58d1b]'
                        : 'bg-[#fdeeee] text-[#d45555]'
                  }`}>
                    {t(`payments.${payment.status}`)}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => openUpdateModal(payment)} className="rounded-md border border-[#e6e9f4] px-3 py-1.5 text-xs font-semibold text-[#6070da] dark:border-[#2f3b54] dark:text-[#9eb0ff]">{t('common.update')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-[#edf0f7] px-5 py-4 dark:border-[#283247]">
          <p className="text-xs text-[#9aa3b8] dark:text-[#94a3b8]">
            Showing {filteredPayments.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredPayments.length)} of {filteredPayments.length}
          </p>
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </div>

      <Modal
        isOpen={modal.open}
        onClose={() => !isSubmitting && setModal((prev) => ({ ...prev, open: false }))}
        title={`${modal.mode === 'add' ? t('common.add') : t('common.update')} ${t('payments.title')}`}
        subtitle={t('payments.subtitle')}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('payments.col_id')}
              <input value={form.id} onChange={(e) => setForm((prev) => ({ ...prev, id: e.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('payments.col_method')}
              <input value={form.method} onChange={(e) => setForm((prev) => ({ ...prev, method: e.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('payments.col_amount')}
              <input value={form.amount} onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('payments.col_date')}
              <input value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('payments.col_status')}
              <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]">
                <option value="status_paid">{t('payments.status_paid')}</option>
                <option value="status_pending">{t('payments.status_pending')}</option>
                <option value="status_refunded">{t('payments.status_refunded')}</option>
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" disabled={isSubmitting} onClick={() => setModal((p) => ({ ...p, open: false }))} className="rounded-md border border-[#e7ebf5] px-4 py-2 text-xs font-bold text-[#6f7a96] dark:border-[#2f3b54] dark:text-[#c7d2e4]">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white disabled:opacity-70">{isSubmitting ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

export default PaymentsPage;
