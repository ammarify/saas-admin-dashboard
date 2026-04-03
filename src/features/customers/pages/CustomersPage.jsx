import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';

const PAGE_SIZE = 5;

function CustomersPage() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState({ open: false, mode: 'add', row: null });
  const customers = [
    { name: 'Ava Johnson', email: 'ava@email.com', orders: 16, spent: '$1,258' },
    { name: 'Noah Carter', email: 'noah@email.com', orders: 12, spent: '$980' },
    { name: 'Mia Brown', email: 'mia@email.com', orders: 21, spent: '$1,720' },
    { name: 'Ethan Hall', email: 'ethan@email.com', orders: 7, spent: '$545' },
    { name: 'Olivia Davis', email: 'olivia@email.com', orders: 28, spent: '$2,105' },
    { name: 'James Moore', email: 'james@email.com', orders: 9, spent: '$612' },
    { name: 'Sophia Wilson', email: 'sophia@email.com', orders: 13, spent: '$1,046' },
    { name: 'Henry Lee', email: 'henry@email.com', orders: 17, spent: '$1,332' },
    { name: 'Emma Clark', email: 'emma@email.com', orders: 6, spent: '$420' },
    { name: 'Daniel Adams', email: 'daniel@email.com', orders: 15, spent: '$1,118' },
  ];
  const totalPages = Math.ceil(customers.length / PAGE_SIZE);
  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return customers.slice(start, start + PAGE_SIZE);
  }, [page, customers]);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[30px] font-extrabold text-[#1d2341] dark:text-[#e5e7eb]">{t('customers.title')}</h1>
          <p className="text-sm text-[#96a0b7] dark:text-[#94a3b8]">{t('customers.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setModal({ open: true, mode: 'update', row: rows[0] || customers[0] })} className="rounded-md border border-[#e7eaf4] bg-white px-4 py-2 text-xs font-bold text-[#6170da] dark:border-[#2f3b54] dark:bg-[#111827] dark:text-[#9eb0ff]">{t('customers.update_customer')}</button>
          <button onClick={() => setModal({ open: true, mode: 'add', row: null })} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white">{t('customers.add_customer')}</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [t('customers.total_customers'), '3,482'],
          [t('customers.new_week'), '124'],
          [t('customers.returning'), '68%'],
          [t('customers.vip'), '92'],
        ].map(([label, value]) => (
          <article key={label} className="rounded-sm border border-[#e6e8ef] bg-white px-5 py-4 dark:border-[#283247] dark:bg-[#111827]">
            <p className="text-xs uppercase tracking-wide text-[#9ba4b9]">{label}</p>
            <p className="mt-1 text-2xl font-extrabold text-[#1f2440] dark:text-[#e5e7eb]">{value}</p>
          </article>
        ))}
      </div>

      <div className="overflow-hidden rounded-sm border border-[#e6e8ef] bg-white dark:border-[#283247] dark:bg-[#111827]">
        <table className="min-w-full text-left">
          <thead className="border-b border-[#edf0f7] bg-[#f9faff] text-xs uppercase tracking-wider text-[#a0a9bf] dark:border-[#283247] dark:bg-[#0f172a] dark:text-[#94a3b8]">
            <tr>
              <th className="px-5 py-3">{t('customers.col_name')}</th>
              <th className="px-5 py-3">{t('customers.col_email')}</th>
              <th className="px-5 py-3">{t('customers.col_orders')}</th>
              <th className="px-5 py-3">{t('customers.col_spent')}</th>
              <th className="px-5 py-3">{t('customers.col_action')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((customer) => (
              <tr key={customer.email} className="border-b border-[#f0f2f8] text-sm text-[#4c5674] dark:border-[#1f2a3d] dark:text-[#c7d2e4]">
                <td className="px-5 py-3 font-semibold text-[#2a3150] dark:text-[#e2e8f0]">{customer.name}</td>
                <td className="px-5 py-3">{customer.email}</td>
                <td className="px-5 py-3">{customer.orders}</td>
                <td className="px-5 py-3 font-semibold">{customer.spent}</td>
                <td className="px-5 py-3">
                  <button onClick={() => setModal({ open: true, mode: 'update', row: customer })} className="rounded-md border border-[#e6e9f4] px-3 py-1.5 text-xs font-semibold text-[#6070da] dark:border-[#2f3b54] dark:text-[#9eb0ff]">{t('common.update')}</button>
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
        title={`${modal.mode === 'add' ? t('common.add') : t('common.update')} ${t('customers.title')}`}
        subtitle={t('customers.subtitle')}
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setModal((p) => ({ ...p, open: false })); }}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('customers.col_name')}
              <input defaultValue={modal.row?.name || ''} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('customers.col_email')}
              <input defaultValue={modal.row?.email || ''} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
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

export default CustomersPage;
