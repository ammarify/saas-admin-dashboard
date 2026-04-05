import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import { SkeletonRow } from '../../../shared/components/ui/Skeleton';
import { toast } from 'react-toastify';
import { addUser, getUsers, updateUser } from '../../../services/api/dummyJsonApi';
import { mapAccounts } from '../../../services/api/fakeStoreMappers';
import { useNotifications } from '../../../shared/notifications/notificationsContext';

const PAGE_SIZE = 5;

function AccountsPage() {
  const { t, language } = useI18n();
  const { addNotification } = useNotifications();
  const isArabic = language === 'ar';
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ open: false, mode: 'add', row: null });
  const [accounts, setAccounts] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', role: '', email: '', status: 'status_active' },
  });

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    getUsers()
      .then((users) => {
        if (!ignore) {
          setAccounts(mapAccounts(users));
        }
      })
      .catch(() => {
        if (!ignore) {
          setAccounts([]);
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
  const filteredAccounts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return accounts.filter((account) => {
      const matchesQuery =
        !q ||
        account.name.toLowerCase().includes(q) ||
        account.email.toLowerCase().includes(q) ||
        account.role.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [accounts, query, statusFilter]);
  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / PAGE_SIZE));
  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredAccounts.slice(start, start + PAGE_SIZE);
  }, [page, filteredAccounts]);

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter]);

  function openAddModal() {
    reset({ name: '', role: '', email: '', status: 'status_active' });
    setModal({ open: true, mode: 'add', row: null });
  }

  function openUpdateModal(row) {
    if (!row) return;
    reset({ name: row.name || '', role: row.role || '', email: row.email || '', status: row.status || 'status_active' });
    setModal({ open: true, mode: 'update', row });
  }

  async function onSubmit(values) {
    setIsSubmitting(true);
    const [firstName, ...rest] = values.name.trim().split(' ');
    const lastName = rest.join(' ') || 'Member';
    const payload = {
      firstName: firstName || 'New',
      lastName,
      company: { title: values.role.trim() },
    };
    try {
      if (modal.mode === 'add') {
        const created = await addUser(payload);
        setAccounts((prev) => [
          {
            ...mapAccounts([created])[0],
            name: values.name,
            role: values.role,
            email: values.email,
            status: values.status,
          },
          ...prev,
        ]);
        addNotification({
          title: isArabic ? 'تمت إضافة حساب' : 'Account added',
          detail: isArabic ? `انضم ${values.name.trim()} بدور ${values.role.trim()}.` : `${values.name.trim()} joined as ${values.role.trim()}.`,
        });
        toast.success('Account added successfully');
      } else if (modal.row?.id) {
        await updateUser(modal.row.id, payload);
        setAccounts((prev) => prev.map((item) => (item.id === modal.row.id ? { ...item, name: values.name, role: values.role, email: values.email, status: values.status } : item)));
        addNotification({
          title: isArabic ? 'تم تحديث الحساب' : 'Account updated',
          detail: isArabic ? `تم تحديث ${values.name.trim()} بنجاح.` : `${values.name.trim()} was updated successfully.`,
        });
        toast.success('Account updated successfully');
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
          <h1 className="text-[30px] font-extrabold text-[#1d2341] dark:text-[#e5e7eb]">{t('accounts.title')}</h1>
          <p className="text-sm text-[#96a0b7] dark:text-[#94a3b8]">{t('accounts.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={openAddModal} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white">{t('accounts.add_account')}</button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-sm border border-[#e6e8ef] bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center dark:border-[#283247] dark:bg-[#111827]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isArabic ? 'ابحث بالاسم أو الدور أو البريد...' : 'Search name, role, or email...'}
          className="h-10 w-full min-w-0 flex-1 rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] sm:min-w-[220px] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select-field h-10 w-full min-w-0 rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] sm:min-w-[180px] sm:w-auto dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0]"
        >
          <option value="all">{isArabic ? 'جميع الحالات' : 'All Status'}</option>
          <option value="status_active">{t('accounts.status_active')}</option>
          <option value="status_invited">{t('accounts.status_invited')}</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-sm border border-[#e6e8ef] bg-white dark:border-[#283247] dark:bg-[#111827]">
        <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full text-left">
          <thead className="border-b border-[#edf0f7] bg-[#f9faff] text-xs uppercase tracking-wider text-[#a0a9bf] dark:border-[#283247] dark:bg-[#0f172a] dark:text-[#94a3b8]">
            <tr>
              <th className="px-5 py-3">{t('accounts.col_name')}</th>
              <th className="px-5 py-3">{t('accounts.col_role')}</th>
              <th className="px-5 py-3">{t('accounts.col_email')}</th>
              <th className="px-5 py-3">{t('accounts.col_status')}</th>
              <th className="px-5 py-3">{t('accounts.col_action')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: PAGE_SIZE }, (_, index) => <SkeletonRow key={`account-skeleton-${index}`} columns={5} />)
              : rows.map((account) => (
              <tr key={account.email} className="border-b border-[#f0f2f8] text-sm text-[#4c5674] transition hover:bg-[#fafbff] dark:border-[#1f2a3d] dark:text-[#c7d2e4] dark:hover:bg-[#182235]">
                <td className="px-5 py-3 font-semibold text-[#2a3150] dark:text-[#e2e8f0]">{account.name}</td>
                <td className="px-5 py-3">{account.role}</td>
                <td className="px-5 py-3">{account.email}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] dark:shadow-none ${
                    account.status === 'status_active'
                      ? 'border-[#cdebdc] bg-[#eefaf4] text-[#1e9c67] dark:border-[#1f5f4a] dark:bg-[#102c24] dark:text-[#7ee2b8]'
                      : 'border-[#d7defb] bg-[#eef1ff] text-[#5368d8] dark:border-[#354a8a] dark:bg-[#16233f] dark:text-[#a9bbff]'
                  }`}>
                    {t(`accounts.${account.status}`)}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => openUpdateModal(account)} className="rounded-md border border-[#e6e9f4] px-3 py-1.5 text-xs font-semibold text-[#6070da] dark:border-[#2f3b54] dark:text-[#9eb0ff]">{t('common.update')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#edf0f7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-[#283247]">
          <p className="text-xs text-[#9aa3b8] dark:text-[#94a3b8]">
            {isArabic ? 'عرض' : 'Showing'} {filteredAccounts.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredAccounts.length)} {t('orders.of')} {filteredAccounts.length}
          </p>
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </div>

      <Modal
        isOpen={modal.open}
        onClose={() => !isSubmitting && setModal((prev) => ({ ...prev, open: false }))}
        title={`${modal.mode === 'add' ? t('common.add') : t('common.update')} ${t('accounts.title')}`}
        subtitle={t('accounts.subtitle')}
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('accounts.col_name')}
              <input {...register('name', { required: 'Name is required' })} className={`mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.name ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`} />
              {errors.name ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.name.message}</p> : null}
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('accounts.col_role')}
              <input {...register('role', { required: 'Role is required' })} className={`mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.role ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`} />
              {errors.role ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.role.message}</p> : null}
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('accounts.col_email')}
              <input {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' } })} className={`mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.email ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`} />
              {errors.email ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.email.message}</p> : null}
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('accounts.col_status')}
              <select {...register('status', { required: 'Status is required' })} className={`select-field mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.status ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`}>
                <option value="status_active">{t('accounts.status_active')}</option>
                <option value="status_invited">{t('accounts.status_invited')}</option>
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

export default AccountsPage;
