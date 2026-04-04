import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import { SkeletonRow } from '../../../shared/components/ui/Skeleton';
import { toast } from 'react-toastify';
import { addUser, getUsers, updateUser } from '../../../services/api/dummyJsonApi';
import { mapAccounts } from '../../../services/api/fakeStoreMappers';

const PAGE_SIZE = 5;

function AccountsPage() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ open: false, mode: 'add', row: null });
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ name: '', role: '', email: '', status: 'status_active' });

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
    setForm({ name: '', role: '', email: '', status: 'status_active' });
    setModal({ open: true, mode: 'add', row: null });
  }

  function openUpdateModal(row) {
    if (!row) return;
    setForm({ name: row.name || '', role: row.role || '', email: row.email || '', status: row.status || 'status_active' });
    setModal({ open: true, mode: 'update', row });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    const [firstName, ...rest] = form.name.trim().split(' ');
    const lastName = rest.join(' ') || 'Member';
    const payload = {
      firstName: firstName || 'New',
      lastName,
      company: { title: form.role.trim() || 'Staff' },
    };
    try {
      if (modal.mode === 'add') {
        const created = await addUser(payload);
        setAccounts((prev) => [
          {
            ...mapAccounts([created])[0],
            role: form.role || 'Staff',
            email: form.email || `${(form.name || 'new').toLowerCase().replace(/\s+/g, '.')}@company.com`,
            status: form.status || 'status_active',
          },
          ...prev,
        ]);
        toast.success('Account added successfully');
      } else if (modal.row?.id) {
        await updateUser(modal.row.id, payload);
        setAccounts((prev) => prev.map((item) => (item.id === modal.row.id ? { ...item, name: form.name || item.name, role: form.role || item.role, email: form.email || item.email, status: form.status || item.status } : item)));
        toast.success('Account updated successfully');
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
          <h1 className="text-[30px] font-extrabold text-[#1d2341] dark:text-[#e5e7eb]">{t('accounts.title')}</h1>
          <p className="text-sm text-[#96a0b7] dark:text-[#94a3b8]">{t('accounts.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={openAddModal} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white">{t('accounts.add_account')}</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-sm border border-[#e6e8ef] bg-white p-4 dark:border-[#283247] dark:bg-[#111827]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, role, or email..."
          className="h-10 min-w-[220px] flex-1 rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 min-w-[180px] rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0]"
        >
          <option value="all">All Status</option>
          <option value="status_active">{t('accounts.status_active')}</option>
          <option value="status_invited">{t('accounts.status_invited')}</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-sm border border-[#e6e8ef] bg-white dark:border-[#283247] dark:bg-[#111827]">
        <table className="min-w-full text-left">
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
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    account.status === 'status_active' ? 'bg-[#e9f8f0] text-[#1e9c67]' : 'bg-[#edf0ff] text-[#5368d8]'
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

        <div className="flex items-center justify-between border-t border-[#edf0f7] px-5 py-4 dark:border-[#283247]">
          <p className="text-xs text-[#9aa3b8] dark:text-[#94a3b8]">
            Showing {filteredAccounts.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredAccounts.length)} of {filteredAccounts.length}
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
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('accounts.col_name')}
              <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('accounts.col_role')}
              <input value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('accounts.col_email')}
              <input value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('accounts.col_status')}
              <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]">
                <option value="status_active">{t('accounts.status_active')}</option>
                <option value="status_invited">{t('accounts.status_invited')}</option>
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

export default AccountsPage;
