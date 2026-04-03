import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';

const PAGE_SIZE = 4;

function HelpPage() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState({ open: false, mode: 'add', row: null });
  const tickets = [
    { id: 'SUP-8801', subject: 'Payment gateway timeout', priority: 'High', assignee: 'Michael', status: 'open' },
    { id: 'SUP-8802', subject: 'Order sync delayed', priority: 'Medium', assignee: 'Sophia', status: 'in_progress' },
    { id: 'SUP-8803', subject: 'Coupon code not applied', priority: 'Low', assignee: 'Olivia', status: 'open' },
    { id: 'SUP-8804', subject: 'Tax settings mismatch', priority: 'Medium', assignee: 'Ethan', status: 'open' },
    { id: 'SUP-8805', subject: 'Inventory sync conflict', priority: 'High', assignee: 'Emma', status: 'in_progress' },
    { id: 'SUP-8806', subject: 'Customer invoice missing', priority: 'Low', assignee: 'Daniel', status: 'open' },
    { id: 'SUP-8807', subject: 'Coupon usage report issue', priority: 'Medium', assignee: 'Ava', status: 'in_progress' },
  ];
  const totalPages = Math.ceil(tickets.length / PAGE_SIZE);
  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return tickets.slice(start, start + PAGE_SIZE);
  }, [page, tickets]);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[30px] font-extrabold text-[#1d2341] dark:text-[#e5e7eb]">{t('support.title')}</h1>
          <p className="text-sm text-[#96a0b7] dark:text-[#94a3b8]">{t('support.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setModal({ open: true, mode: 'update', row: rows[0] || tickets[0] })} className="rounded-md border border-[#e7eaf4] bg-white px-4 py-2 text-xs font-bold text-[#6170da] dark:border-[#2f3b54] dark:bg-[#111827] dark:text-[#9eb0ff]">{t('support.update_ticket')}</button>
          <button onClick={() => setModal({ open: true, mode: 'add', row: null })} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white">{t('support.add_ticket')}</button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-sm border border-[#e6e8ef] bg-white p-5 xl:col-span-2 dark:border-[#283247] dark:bg-[#111827]">
          <h2 className="mb-3 text-lg font-bold text-[#1f2440] dark:text-[#e5e7eb]">{t('support.open_tickets')}</h2>
          <div className="space-y-3">
            {rows.map((ticket) => (
              <div key={ticket.id} className="rounded-md border border-[#edf0f7] p-4 dark:border-[#2b364d]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[#293151] dark:text-[#e2e8f0]">{ticket.subject}</p>
                  <span className="text-xs font-semibold text-[#6070da]">{ticket.id}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#7d87a2] dark:text-[#94a3b8]">
                  <span>{t('support.priority')}: {ticket.priority}</span>
                  <span>{t('support.assignee')}: {ticket.assignee}</span>
                  <span>{t('support.status')}: {t(`support.${ticket.status}`)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
          </div>
        </article>

        <article className="rounded-sm border border-[#e6e8ef] bg-white p-5 dark:border-[#283247] dark:bg-[#111827]">
          <h2 className="mb-3 text-lg font-bold text-[#1f2440] dark:text-[#e5e7eb]">{t('support.knowledge_base')}</h2>
          <ul className="space-y-2 text-sm text-[#5f6987] dark:text-[#c7d2e4]">
            <li className="rounded-md border border-[#edf0f7] p-3 dark:border-[#2b364d]">How to process refunds</li>
            <li className="rounded-md border border-[#edf0f7] p-3 dark:border-[#2b364d]">Managing delivery partners</li>
            <li className="rounded-md border border-[#edf0f7] p-3 dark:border-[#2b364d]">Optimizing checkout flow</li>
            <li className="rounded-md border border-[#edf0f7] p-3 dark:border-[#2b364d]">Promo and discount policies</li>
          </ul>
        </article>
      </div>

      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, mode: 'add', row: null })}
        title={`${modal.mode === 'add' ? t('common.add') : t('common.update')} ${t('support.title')}`}
        subtitle={t('support.subtitle')}
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setModal({ open: false, mode: 'add', row: null });
          }}
        >
          <label className="block text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
            {t('support.open_tickets')}
            <input defaultValue={modal.row?.subject || ''} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
          </label>
          <label className="block text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
            {t('support.assignee')}
            <input defaultValue={modal.row?.assignee || ''} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModal({ open: false, mode: 'add', row: null })} className="rounded-md border border-[#e7ebf5] px-4 py-2 text-xs font-bold text-[#6f7a96] dark:border-[#2f3b54] dark:text-[#c7d2e4]">Cancel</button>
            <button type="submit" className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white">Save</button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

export default HelpPage;
