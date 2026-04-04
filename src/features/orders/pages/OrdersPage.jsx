import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import { SkeletonRow } from '../../../shared/components/ui/Skeleton';
import { toast } from 'react-toastify';
import { addOrder, getCarts, updateOrder } from '../../../services/api/dummyJsonApi';

const PAGE_SIZE = 5;
const STATUS_SEQUENCE = ['status_delivered', 'status_processing', 'status_pending', 'status_cancelled'];

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function buildOrderRow(cart, index) {
  const firstItem = cart.products?.[0];
  const day = String((cart.id % 28) + 1).padStart(2, '0');

  return {
    id: `ORD-${10200 + cart.id}`,
    rawId: cart.id,
    customer: `Customer #${cart.userId || 1}`,
    item: `Item #${firstItem?.id || 1}`,
    total: formatCurrency(cart.total),
    status: STATUS_SEQUENCE[index % STATUS_SEQUENCE.length],
    date: `2026-12-${day}`,
  };
}

function OrdersPage() {
  const { t } = useI18n();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ open: false, mode: 'add', row: null });
  const [form, setForm] = useState({ id: '', customer: '', item: '', date: '', total: '', status: 'status_pending' });

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    getCarts()
      .then((carts) => {
        if (!ignore) {
          setOrders(carts.map((cart, index) => buildOrderRow(cart, index)));
        }
      })
      .catch(() => {
        if (!ignore) {
          setOrders([]);
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

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesQuery =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q) ||
        order.item.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [orders, query, statusFilter]);
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [page, filteredOrders]);

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter]);

  function openAddModal() {
    setForm({
      id: `ORD-${10300 + orders.length + 1}`,
      customer: '',
      item: '',
      date: new Date().toISOString().slice(0, 10),
      total: '0.00',
      status: 'status_pending',
    });
    setModal({ open: true, mode: 'add', row: null });
  }

  function openUpdateModal(row) {
    if (!row) return;
    setForm({
      id: row.id || '',
      customer: row.customer || '',
      item: row.item || '',
      date: row.date || '',
      total: String(row.total || '').replace(/[^\d.]/g, ''),
      status: row.status || 'status_pending',
    });
    setModal({ open: true, mode: 'update', row });
  }

  function closeModal() {
    if (isSubmitting) return;
    setModal((prev) => ({ ...prev, open: false }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        userId: modal.row?.rawId ? Number((form.customer || '').replace(/[^\d]/g, '')) || 1 : 1,
        products: [{ id: Number((form.item || '').replace(/[^\d]/g, '')) || 1, quantity: 1 }],
      };

      if (modal.mode === 'add') {
        const created = await addOrder(payload);
        const mapped = buildOrderRow({ ...created, total: created.total || 0, products: payload.products }, 2);
        setOrders((prev) => [
          {
            ...mapped,
            id: form.id || mapped.id,
            customer: form.customer.trim() || mapped.customer,
            item: form.item.trim() || mapped.item,
            date: form.date || new Date().toISOString().slice(0, 10),
            total: formatCurrency(form.total),
            status: form.status || 'status_pending',
          },
          ...prev,
        ]);
        toast.success('Order added successfully');
      } else if (modal.row?.rawId) {
        await updateOrder(modal.row.rawId, payload);
        setOrders((prev) =>
          prev.map((order) =>
            order.rawId === modal.row.rawId
              ? {
                  ...order,
                  id: form.id || order.id,
                  customer: form.customer.trim() || order.customer,
                  item: form.item.trim() || order.item,
                  date: form.date || order.date,
                  total: formatCurrency(form.total),
                  status: form.status || 'status_processing',
                }
              : order
          )
        );
        toast.success('Order updated successfully');
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
          <h1 className="text-[30px] font-extrabold text-[#1d2341] dark:text-[#e5e7eb]">{t('orders.title')}</h1>
          <p className="text-sm text-[#96a0b7] dark:text-[#94a3b8]">{t('orders.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={openAddModal} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white">{t('orders.add_order')}</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-sm border border-[#e6e8ef] bg-white p-4 dark:border-[#283247] dark:bg-[#111827]">
        <div className="relative min-w-[220px] flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders, customer, item..."
            className="h-10 w-full rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 min-w-[180px] rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0]"
        >
          <option value="all">All Status</option>
          <option value="status_delivered">{t('orders.status_delivered')}</option>
          <option value="status_processing">{t('orders.status_processing')}</option>
          <option value="status_pending">{t('orders.status_pending')}</option>
          <option value="status_cancelled">{t('orders.status_cancelled')}</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-sm border border-[#e6e8ef] bg-white dark:border-[#283247] dark:bg-[#111827]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-[#edf0f7] bg-[#f9faff] text-xs uppercase tracking-wider text-[#a0a9bf] dark:border-[#283247] dark:bg-[#0f172a] dark:text-[#94a3b8]">
              <tr>
                <th className="px-5 py-3">{t('orders.col_order_id')}</th>
                <th className="px-5 py-3">{t('orders.col_customer')}</th>
                <th className="px-5 py-3">{t('orders.col_item')}</th>
                <th className="px-5 py-3">{t('orders.col_date')}</th>
                <th className="px-5 py-3">{t('orders.col_total')}</th>
                <th className="px-5 py-3">{t('orders.col_status')}</th>
                <th className="px-5 py-3">{t('orders.col_action')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: PAGE_SIZE }, (_, index) => <SkeletonRow key={`order-skeleton-${index}`} columns={7} />)
                : rows.map((order) => (
                  <tr key={order.id} className="border-b border-[#f0f2f8] text-sm text-[#4c5674] transition hover:bg-[#fafbff] dark:border-[#1f2a3d] dark:text-[#c7d2e4] dark:hover:bg-[#182235]">
                    <td className="px-5 py-3 font-semibold text-[#2a3150] dark:text-[#e2e8f0]">{order.id}</td>
                    <td className="px-5 py-3">{order.customer}</td>
                    <td className="px-5 py-3">{order.item}</td>
                    <td className="px-5 py-3">{order.date}</td>
                    <td className="px-5 py-3 font-semibold">{order.total}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          order.status === 'status_delivered'
                            ? 'bg-[#e9f8f0] text-[#1e9c67]'
                            : order.status === 'status_processing'
                              ? 'bg-[#edf0ff] text-[#5368d8]'
                              : order.status === 'status_pending'
                                ? 'bg-[#fff8e9] text-[#c58d1b]'
                                : 'bg-[#fdeeee] text-[#d45555]'
                        }`}
                      >
                        {t(`orders.${order.status}`)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => openUpdateModal(order)} className="rounded-md border border-[#e6e9f4] px-3 py-1.5 text-xs font-semibold text-[#6070da] transition hover:shadow-sm dark:border-[#2f3b54] dark:text-[#9eb0ff]">{t('common.update')}</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-xs text-[#9aa3b8] dark:text-[#94a3b8]">{t('orders.showing')} {filteredOrders.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredOrders.length)} {t('orders.of')} {filteredOrders.length}</p>
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </div>

      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        title={`${modal.mode === 'add' ? t('common.add') : t('common.update')} ${t('orders.title')}`}
        subtitle={t('orders.subtitle')}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('orders.col_order_id')}
              <input
                value={form.id}
                onChange={(event) => setForm((prev) => ({ ...prev, id: event.target.value }))}
                className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm text-[#364152] outline-none focus:border-[#96a4da] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#e5e7eb]"
              />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('orders.col_customer')}
              <input
                value={form.customer}
                onChange={(event) => setForm((prev) => ({ ...prev, customer: event.target.value }))}
                className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm text-[#364152] outline-none focus:border-[#96a4da] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#e5e7eb]"
              />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('orders.col_item')}
              <input
                value={form.item}
                onChange={(event) => setForm((prev) => ({ ...prev, item: event.target.value }))}
                className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm text-[#364152] outline-none focus:border-[#96a4da] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#e5e7eb]"
              />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('orders.col_date')}
              <input
                value={form.date}
                onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm text-[#364152] outline-none focus:border-[#96a4da] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#e5e7eb]"
              />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('orders.col_total')}
              <input
                value={form.total}
                onChange={(event) => setForm((prev) => ({ ...prev, total: event.target.value }))}
                className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm text-[#364152] outline-none focus:border-[#96a4da] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#e5e7eb]"
              />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('orders.col_status')}
              <select
                value={form.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm text-[#364152] outline-none focus:border-[#96a4da] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#e5e7eb]"
              >
                <option value="status_delivered">{t('orders.status_delivered')}</option>
                <option value="status_processing">{t('orders.status_processing')}</option>
                <option value="status_pending">{t('orders.status_pending')}</option>
                <option value="status_cancelled">{t('orders.status_cancelled')}</option>
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={closeModal} disabled={isSubmitting} className="rounded-md border border-[#e7ebf5] px-4 py-2 text-xs font-bold text-[#6f7a96] dark:border-[#2f3b54] dark:text-[#c7d2e4]">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white disabled:opacity-70">
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

export default OrdersPage;
