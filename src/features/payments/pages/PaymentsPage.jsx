import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import { SkeletonRow } from '../../../shared/components/ui/Skeleton';
import { toast } from 'react-toastify';
import { addTodo, getTodos, updateTodo } from '../../../services/api/dummyJsonApi';
import { useNotifications } from '../../../shared/notifications/notificationsContext';

const PAGE_SIZE = 5;

function PaymentsPage() {
  const { t, language } = useI18n();
  const { addNotification } = useNotifications();
  const isArabic = language === 'ar';
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ open: false, mode: 'add', row: null });
  const [payments, setPayments] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { id: '', method: '', amount: '', date: '', status: 'status_pending' },
  });

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
    reset({ id: `PAY-${5500 + payments.length + 1}`, method: '', amount: '', date: new Date().toISOString().slice(0, 10), status: 'status_pending' });
    setModal({ open: true, mode: 'add', row: null });
  }

  function openUpdateModal(row) {
    if (!row) return;
    reset({ id: row.id || '', method: row.method || '', amount: String(row.amount).replace(/[^\d.]/g, ''), date: row.date || '', status: row.status || 'status_pending' });
    setModal({ open: true, mode: 'update', row });
  }

  async function onSubmit(values) {
    setIsSubmitting(true);
    const numericAmount = Number(String(values.amount || '').replace(/[^\d.]/g, '')) || 0;
    try {
      if (modal.mode === 'add') {
        const created = await addTodo({ todo: values.method, completed: false, userId: 1 });
        setPayments((prev) => [
          {
            id: values.id,
            rawId: created.id,
            method: values.method,
            amount: `$${numericAmount.toFixed(2)}`,
            status: values.status,
            date: values.date,
          },
          ...prev,
        ]);
        addNotification({
          title: isArabic ? 'تمت إضافة دفعة' : 'Payment added',
          detail: isArabic ? `تمت إضافة ${values.id} باستخدام ${values.method}.` : `${values.id} using ${values.method} was added.`,
        });
        toast.success('Payment added successfully');
      } else if (modal.row?.rawId) {
        await updateTodo(modal.row.rawId, { completed: true });
        setPayments((prev) => prev.map((item) => (item.rawId === modal.row.rawId ? { ...item, id: values.id, method: values.method, amount: `$${numericAmount.toFixed(2)}`, date: values.date, status: values.status } : item)));
        addNotification({
          title: isArabic ? 'تم تحديث الدفعة' : 'Payment updated',
          detail: isArabic ? `تم تحديث ${values.id} إلى ${values.method}.` : `${values.id} was updated to ${values.method}.`,
        });
        toast.success('Payment updated successfully');
      }
      setModal((prev) => ({ ...prev, open: false }));
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
          <h1 className="text-[30px] font-extrabold text-[#1d2341] dark:text-[#e5e7eb]">{t('payments.title')}</h1>
          <p className="text-sm text-[#96a0b7] dark:text-[#94a3b8]">{t('payments.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={openAddModal} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white">{t('payments.add_payment')}</button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-sm border border-[#e6e8ef] bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center dark:border-[#283247] dark:bg-[#111827]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isArabic ? 'ابحث عن رقم الدفعة أو الطريقة...' : 'Search payment id or method...'}
          className="h-10 w-full min-w-0 flex-1 rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] sm:min-w-[220px] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select-field h-10 w-full min-w-0 rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] sm:min-w-[180px] sm:w-auto dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0]"
        >
          <option value="all">{isArabic ? 'جميع الحالات' : 'All Status'}</option>
          <option value="status_paid">{t('payments.status_paid')}</option>
          <option value="status_pending">{t('payments.status_pending')}</option>
          <option value="status_refunded">{t('payments.status_refunded')}</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-sm border border-[#e6e8ef] bg-white dark:border-[#283247] dark:bg-[#111827]">
        <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full text-left">
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
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] dark:shadow-none ${
                    payment.status === 'status_paid'
                      ? 'border-[#cdebdc] bg-[#eefaf4] text-[#1e9c67] dark:border-[#1f5f4a] dark:bg-[#102c24] dark:text-[#7ee2b8]'
                      : payment.status === 'status_pending'
                        ? 'border-[#f4e1b4] bg-[#fff8e9] text-[#c58d1b] dark:border-[#6b5320] dark:bg-[#31250e] dark:text-[#f3ca74]'
                        : 'border-[#f0cfd3] bg-[#fdeeee] text-[#d45555] dark:border-[#6f3041] dark:bg-[#30111a] dark:text-[#ff9cab]'
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
        </div>

        <div className="flex flex-col gap-3 border-t border-[#edf0f7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-[#283247]">
          <p className="text-xs text-[#9aa3b8] dark:text-[#94a3b8]">
            {isArabic ? 'عرض' : 'Showing'} {filteredPayments.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredPayments.length)} {t('orders.of')} {filteredPayments.length}
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
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('payments.col_id')}
              <input {...register('id', { required: 'Payment ID is required' })} className={`mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.id ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`} />
              {errors.id ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.id.message}</p> : null}
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('payments.col_method')}
              <input {...register('method', { required: 'Payment method is required' })} className={`mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.method ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`} />
              {errors.method ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.method.message}</p> : null}
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('payments.col_amount')}
              <input type="number" min="0.01" step="0.01" {...register('amount', { required: 'Amount is required', min: { value: 0.01, message: 'Amount must be greater than 0' } })} className={`mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.amount ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`} />
              {errors.amount ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.amount.message}</p> : null}
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('payments.col_date')}
              <input type="date" {...register('date', { required: 'Date is required' })} className={`mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.date ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`} />
              {errors.date ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.date.message}</p> : null}
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('payments.col_status')}
              <select {...register('status', { required: 'Status is required' })} className={`select-field mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.status ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`}>
                <option value="status_paid">{t('payments.status_paid')}</option>
                <option value="status_pending">{t('payments.status_pending')}</option>
                <option value="status_refunded">{t('payments.status_refunded')}</option>
              </select>
              {errors.status ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.status.message}</p> : null}
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" disabled={isSubmitting} onClick={() => setModal((p) => ({ ...p, open: false }))} className="rounded-md border border-[#e7ebf5] px-4 py-2 text-xs font-bold text-[#6f7a96] dark:border-[#2f3b54] dark:text-[#c7d2e4]">{isArabic ? 'إلغاء' : 'Cancel'}</button>
            <button type="submit" disabled={isSubmitting} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white disabled:opacity-70">{isSubmitting ? (isArabic ? 'جاري الحفظ...' : 'Saving...') : (isArabic ? 'حفظ' : 'Save')}</button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

export default PaymentsPage;
