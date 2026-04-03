import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';

const PAGE_SIZE = 5;

function PaymentsPage() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState({ open: false, mode: 'add', row: null });
  const payments = [
    { id: 'PAY-5501', method: 'Stripe', amount: '$210.00', status: 'status_paid', date: '2026-12-04' },
    { id: 'PAY-5502', method: 'PayPal', amount: '$89.00', status: 'status_pending', date: '2026-12-04' },
    { id: 'PAY-5503', method: 'Card', amount: '$145.00', status: 'status_paid', date: '2026-12-05' },
    { id: 'PAY-5504', method: 'Card', amount: '$330.00', status: 'status_refunded', date: '2026-12-05' },
    { id: 'PAY-5505', method: 'Stripe', amount: '$59.00', status: 'status_paid', date: '2026-12-06' },
    { id: 'PAY-5506', method: 'PayPal', amount: '$175.00', status: 'status_pending', date: '2026-12-06' },
    { id: 'PAY-5507', method: 'Card', amount: '$65.00', status: 'status_paid', date: '2026-12-07' },
    { id: 'PAY-5508', method: 'Stripe', amount: '$79.00', status: 'status_refunded', date: '2026-12-07' },
  ];
  const totalPages = Math.ceil(payments.length / PAGE_SIZE);
  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return payments.slice(start, start + PAGE_SIZE);
  }, [page, payments]);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[30px] font-extrabold text-[#1d2341] dark:text-[#e5e7eb]">{t('payments.title')}</h1>
          <p className="text-sm text-[#96a0b7] dark:text-[#94a3b8]">{t('payments.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setModal({ open: true, mode: 'update', row: rows[0] || payments[0] })} className="rounded-md border border-[#e7eaf4] bg-white px-4 py-2 text-xs font-bold text-[#6170da] dark:border-[#2f3b54] dark:bg-[#111827] dark:text-[#9eb0ff]">{t('payments.update_payment')}</button>
          <button onClick={() => setModal({ open: true, mode: 'add', row: null })} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white">{t('payments.add_payment')}</button>
        </div>
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
            {rows.map((payment) => (
              <tr key={payment.id} className="border-b border-[#f0f2f8] text-sm text-[#4c5674] dark:border-[#1f2a3d] dark:text-[#c7d2e4]">
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
                  <button onClick={() => setModal({ open: true, mode: 'update', row: payment })} className="rounded-md border border-[#e6e9f4] px-3 py-1.5 text-xs font-semibold text-[#6070da] dark:border-[#2f3b54] dark:text-[#9eb0ff]">{t('common.update')}</button>
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
        title={`${modal.mode === 'add' ? t('common.add') : t('common.update')} ${t('payments.title')}`}
        subtitle={t('payments.subtitle')}
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setModal((p) => ({ ...p, open: false })); }}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('payments.col_method')}
              <input defaultValue={modal.row?.method || ''} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('payments.col_amount')}
              <input defaultValue={modal.row?.amount || ''} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
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

export default PaymentsPage;
