import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';

const PAGE_SIZE = 5;

function AccountsPage() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState({ open: false, mode: 'add', row: null });
  const accounts = [
    { name: 'Michael Carter', role: 'Admin', email: 'michael@shopsync.com', status: 'status_active' },
    { name: 'Sophia Morgan', role: 'Operations', email: 'sophia.m@shopsync.com', status: 'status_active' },
    { name: 'Daniel Brooks', role: 'Support', email: 'daniel.b@shopsync.com', status: 'status_invited' },
    { name: 'Olivia Bennett', role: 'Marketing', email: 'olivia.b@shopsync.com', status: 'status_active' },
    { name: 'Ethan Walker', role: 'Finance', email: 'ethan.w@shopsync.com', status: 'status_active' },
    { name: 'Emma Reed', role: 'HR', email: 'emma.r@shopsync.com', status: 'status_invited' },
    { name: 'James Turner', role: 'Sales', email: 'james.t@shopsync.com', status: 'status_active' },
    { name: 'Ava Collins', role: 'Designer', email: 'ava.c@shopsync.com', status: 'status_active' },
  ];
  const totalPages = Math.ceil(accounts.length / PAGE_SIZE);
  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return accounts.slice(start, start + PAGE_SIZE);
  }, [page, accounts]);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[30px] font-extrabold text-[#1d2341] dark:text-[#e5e7eb]">{t('accounts.title')}</h1>
          <p className="text-sm text-[#96a0b7] dark:text-[#94a3b8]">{t('accounts.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setModal({ open: true, mode: 'update', row: rows[0] || accounts[0] })} className="rounded-md border border-[#e7eaf4] bg-white px-4 py-2 text-xs font-bold text-[#6170da] dark:border-[#2f3b54] dark:bg-[#111827] dark:text-[#9eb0ff]">{t('accounts.update_role')}</button>
          <button onClick={() => setModal({ open: true, mode: 'add', row: null })} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white">{t('accounts.add_account')}</button>
        </div>
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
            {rows.map((account) => (
              <tr key={account.email} className="border-b border-[#f0f2f8] text-sm text-[#4c5674] dark:border-[#1f2a3d] dark:text-[#c7d2e4]">
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
                  <button onClick={() => setModal({ open: true, mode: 'update', row: account })} className="rounded-md border border-[#e6e9f4] px-3 py-1.5 text-xs font-semibold text-[#6070da] dark:border-[#2f3b54] dark:text-[#9eb0ff]">{t('common.update')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-end border-t border-[#edf0f7] px-5 py-4 dark:border-[#283247]">
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </div>

      <Modal
        isOpen={modal.open}
        onClose={() => setModal((prev) => ({ ...prev, open: false }))}
        title={`${modal.mode === 'add' ? t('common.add') : t('common.update')} ${t('accounts.title')}`}
        subtitle={t('accounts.subtitle')}
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setModal((p) => ({ ...p, open: false })); }}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('accounts.col_name')}
              <input defaultValue={modal.row?.name || ''} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('accounts.col_role')}
              <input defaultValue={modal.row?.role || ''} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModal((p) => ({ ...p, open: false }))} className="rounded-md border border-[#e7ebf5] px-4 py-2 text-xs font-bold text-[#6f7a96] dark:border-[#2f3b54] dark:text-[#c7d2e4]">Cancel</button>
            <button type="submit" className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white">Save</button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

export default AccountsPage;
