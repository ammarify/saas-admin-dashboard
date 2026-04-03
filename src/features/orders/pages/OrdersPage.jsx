import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';

const ORDERS = [
  { id: 'ORD-10231', customer: 'Ava Johnson', item: 'Wireless Earbuds', total: '$125.00', status: 'status_delivered', date: '2026-12-01' },
  { id: 'ORD-10232', customer: 'Noah Carter', item: 'Smart Watch Pro', total: '$210.00', status: 'status_processing', date: '2026-12-01' },
  { id: 'ORD-10233', customer: 'Liam Smith', item: 'Gaming Headset', total: '$145.00', status: 'status_pending', date: '2026-12-02' },
  { id: 'ORD-10234', customer: 'Mia Brown', item: 'Portable Speaker', total: '$89.00', status: 'status_delivered', date: '2026-12-02' },
  { id: 'ORD-10235', customer: 'Ethan Hall', item: '4K Action Camera', total: '$330.00', status: 'status_cancelled', date: '2026-12-03' },
  { id: 'ORD-10236', customer: 'Olivia Davis', item: 'Laptop Stand', total: '$59.00', status: 'status_delivered', date: '2026-12-03' },
  { id: 'ORD-10237', customer: 'James Moore', item: 'Mechanical Keyboard', total: '$175.00', status: 'status_processing', date: '2026-12-04' },
  { id: 'ORD-10238', customer: 'Sophia Wilson', item: 'USB-C Hub', total: '$65.00', status: 'status_pending', date: '2026-12-04' },
  { id: 'ORD-10239', customer: 'Henry Lee', item: 'Monitor Light Bar', total: '$99.00', status: 'status_delivered', date: '2026-12-05' },
];

const PAGE_SIZE = 5;

function OrdersPage() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState({ open: false, mode: 'add', row: null });
  const totalPages = Math.ceil(ORDERS.length / PAGE_SIZE);

  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return ORDERS.slice(start, start + PAGE_SIZE);
  }, [page]);

  function openAddModal() {
    setModal({ open: true, mode: 'add', row: null });
  }

  function openUpdateModal(row) {
    setModal({ open: true, mode: 'update', row });
  }

  function closeModal() {
    setModal((prev) => ({ ...prev, open: false }));
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[30px] font-extrabold text-[#1d2341] dark:text-[#e5e7eb]">{t('orders.title')}</h1>
          <p className="text-sm text-[#96a0b7] dark:text-[#94a3b8]">{t('orders.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openUpdateModal(rows[0] || ORDERS[0])} className="rounded-md border border-[#e7eaf4] bg-white px-4 py-2 text-xs font-bold text-[#6170da] dark:border-[#2f3b54] dark:bg-[#111827] dark:text-[#9eb0ff]">{t('orders.update_order')}</button>
          <button onClick={openAddModal} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white">{t('orders.add_order')}</button>
        </div>
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
              {rows.map((order) => (
                <tr key={order.id} className="border-b border-[#f0f2f8] text-sm text-[#4c5674] dark:border-[#1f2a3d] dark:text-[#c7d2e4]">
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
                    <button onClick={() => openUpdateModal(order)} className="rounded-md border border-[#e6e9f4] px-3 py-1.5 text-xs font-semibold text-[#6070da] dark:border-[#2f3b54] dark:text-[#9eb0ff]">{t('common.update')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-xs text-[#9aa3b8] dark:text-[#94a3b8]">{t('orders.showing')} {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, ORDERS.length)} {t('orders.of')} {ORDERS.length}</p>
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </div>

      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        title={`${modal.mode === 'add' ? t('common.add') : t('common.update')} ${t('orders.title')}`}
        subtitle={t('orders.subtitle')}
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            closeModal();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('orders.col_customer')}
              <input
                defaultValue={modal.row?.customer || ''}
                className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm text-[#364152] outline-none focus:border-[#96a4da] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#e5e7eb]"
              />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('orders.col_item')}
              <input
                defaultValue={modal.row?.item || ''}
                className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm text-[#364152] outline-none focus:border-[#96a4da] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#e5e7eb]"
              />
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={closeModal} className="rounded-md border border-[#e7ebf5] px-4 py-2 text-xs font-bold text-[#6f7a96] dark:border-[#2f3b54] dark:text-[#c7d2e4]">
              Cancel
            </button>
            <button type="submit" className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white">
              Save
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

export default OrdersPage;
