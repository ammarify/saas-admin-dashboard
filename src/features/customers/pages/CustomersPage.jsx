import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import { SkeletonCard, SkeletonRow } from '../../../shared/components/ui/Skeleton';
import { toast } from 'react-toastify';
import { addUser, getUsers, updateUser } from '../../../services/api/dummyJsonApi';

const PAGE_SIZE = 5;

function mapCustomer(user) {
  return {
    id: user.id,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    email: user.email,
    orders: Number(user.age || 0) % 20 + 1,
    spent: `$${((Number(user.age || 18) * 37.5) % 1800 + 120).toFixed(0)}`,
  };
}

function CustomersPage() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ open: false, mode: 'add', row: null });
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', orders: '', spent: '' });

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    getUsers()
      .then((users) => {
        if (!ignore) {
          setCustomers(users.map(mapCustomer));
        }
      })
      .catch(() => {
        if (!ignore) {
          setCustomers([]);
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
  const filteredCustomers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((customer) => {
      const matchesQuery =
        !q ||
        customer.name.toLowerCase().includes(q) ||
        customer.email.toLowerCase().includes(q);
      const matchesOrders =
        orderFilter === 'all' ||
        (orderFilter === 'high' && customer.orders >= 15) ||
        (orderFilter === 'low' && customer.orders < 15);
      return matchesQuery && matchesOrders;
    });
  }, [customers, query, orderFilter]);
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredCustomers.slice(start, start + PAGE_SIZE);
  }, [page, filteredCustomers]);

  useEffect(() => {
    setPage(1);
  }, [query, orderFilter]);

  function openAddModal() {
    setForm({ name: '', email: '', orders: '1', spent: '100' });
    setModal({ open: true, mode: 'add', row: null });
  }

  function openUpdateModal(row) {
    if (!row) return;
    setForm({ name: row.name || '', email: row.email || '', orders: String(row.orders || ''), spent: String(row.spent || '').replace(/[^\d.]/g, '') });
    setModal({ open: true, mode: 'update', row });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    const [firstName, ...rest] = form.name.trim().split(' ');
    const lastName = rest.join(' ') || 'Customer';
    const payload = {
      firstName: firstName || 'New',
      lastName,
      email: form.email.trim() || 'customer@email.com',
    };

    try {
      if (modal.mode === 'add') {
        const created = await addUser(payload);
        setCustomers((prev) => [{ ...mapCustomer(created), orders: Number(form.orders || 1), spent: `$${Number(form.spent || 0).toFixed(0)}` }, ...prev]);
        toast.success('Customer added successfully');
      } else if (modal.row?.id) {
        const updated = await updateUser(modal.row.id, payload);
        setCustomers((prev) => prev.map((item) => (item.id === modal.row.id ? { ...mapCustomer({ ...modal.row, ...updated }), orders: Number(form.orders || item.orders), spent: `$${Number(form.spent || String(item.spent).replace(/[^\d.]/g, '')).toFixed(0)}` } : item)));
        toast.success('Customer updated successfully');
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
          <h1 className="text-[30px] font-extrabold text-[#1d2341] dark:text-[#e5e7eb]">{t('customers.title')}</h1>
          <p className="text-sm text-[#96a0b7] dark:text-[#94a3b8]">{t('customers.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={openAddModal} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white">{t('customers.add_customer')}</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-sm border border-[#e6e8ef] bg-white p-4 dark:border-[#283247] dark:bg-[#111827]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customer by name or email..."
          className="h-10 min-w-[220px] flex-1 rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0]"
        />
        <select
          value={orderFilter}
          onChange={(e) => setOrderFilter(e.target.value)}
          className="h-10 min-w-[180px] rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0]"
        >
          <option value="all">All Customers</option>
          <option value="high">High Activity</option>
          <option value="low">Low Activity</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }, (_, index) => <SkeletonCard key={`customer-card-skeleton-${index}`} />)
          : [
              [t('customers.total_customers'), String(customers.length)],
              [t('customers.new_week'), String(customers.slice(0, 4).length)],
              [t('customers.returning'), `${Math.round((customers.filter((item) => item.orders > 1).length / Math.max(customers.length, 1)) * 100)}%`],
              [t('customers.vip'), String(customers.filter((item) => item.orders >= 3).length)],
            ].map(([label, value]) => (
              <article key={label} className="rounded-sm border border-[#e6e8ef] bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-[#283247] dark:bg-[#111827]">
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
            {isLoading
              ? Array.from({ length: PAGE_SIZE }, (_, index) => <SkeletonRow key={`customer-skeleton-${index}`} columns={5} />)
              : rows.map((customer) => (
              <tr key={customer.email} className="border-b border-[#f0f2f8] text-sm text-[#4c5674] transition hover:bg-[#fafbff] dark:border-[#1f2a3d] dark:text-[#c7d2e4] dark:hover:bg-[#182235]">
                <td className="px-5 py-3 font-semibold text-[#2a3150] dark:text-[#e2e8f0]">{customer.name}</td>
                <td className="px-5 py-3">{customer.email}</td>
                <td className="px-5 py-3">{customer.orders}</td>
                <td className="px-5 py-3 font-semibold">{customer.spent}</td>
                <td className="px-5 py-3">
                  <button onClick={() => openUpdateModal(customer)} className="rounded-md border border-[#e6e9f4] px-3 py-1.5 text-xs font-semibold text-[#6070da] dark:border-[#2f3b54] dark:text-[#9eb0ff]">{t('common.update')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-[#edf0f7] px-5 py-4 dark:border-[#283247]">
          <p className="text-xs text-[#9aa3b8] dark:text-[#94a3b8]">
            Showing {filteredCustomers.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredCustomers.length)} of {filteredCustomers.length}
          </p>
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </div>

      <Modal
        isOpen={modal.open}
        onClose={() => !isSubmitting && setModal((prev) => ({ ...prev, open: false }))}
        title={`${modal.mode === 'add' ? t('common.add') : t('common.update')} ${t('customers.title')}`}
        subtitle={t('customers.subtitle')}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('customers.col_name')}
              <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('customers.col_email')}
              <input value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('customers.col_orders')}
              <input value={form.orders} onChange={(e) => setForm((prev) => ({ ...prev, orders: e.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('customers.col_spent')}
              <input value={form.spent} onChange={(e) => setForm((prev) => ({ ...prev, spent: e.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
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

export default CustomersPage;
