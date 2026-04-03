import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';

const PAGE_SIZE = 5;

function MenuPage() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState({ open: false, mode: 'add', row: null });
  const products = [
    { name: 'Wireless Earbuds', sku: 'PRD-1001', stock: 84, price: '$125.00' },
    { name: 'Smart Watch Pro', sku: 'PRD-1002', stock: 42, price: '$210.00' },
    { name: 'Portable Speaker', sku: 'PRD-1003', stock: 110, price: '$89.00' },
    { name: 'Gaming Headset', sku: 'PRD-1004', stock: 56, price: '$145.00' },
    { name: 'Laptop Stand', sku: 'PRD-1005', stock: 73, price: '$59.00' },
    { name: '4K Action Camera', sku: 'PRD-1006', stock: 18, price: '$330.00' },
    { name: 'Mechanical Keyboard', sku: 'PRD-1007', stock: 45, price: '$175.00' },
    { name: 'USB-C Hub', sku: 'PRD-1008', stock: 90, price: '$65.00' },
    { name: 'Webcam HD', sku: 'PRD-1009', stock: 38, price: '$79.00' },
    { name: 'Smart Desk Lamp', sku: 'PRD-1010', stock: 67, price: '$92.00' },
  ];
  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return products.slice(start, start + PAGE_SIZE);
  }, [page, products]);

  function openAddModal() {
    setModal({ open: true, mode: 'add', row: null });
  }

  function openUpdateModal(row) {
    setModal({ open: true, mode: 'update', row });
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[30px] font-extrabold text-[#1d2341] dark:text-[#e5e7eb]">{t('products.title')}</h1>
          <p className="text-sm text-[#96a0b7] dark:text-[#94a3b8]">{t('products.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openUpdateModal(rows[0] || products[0])} className="rounded-md border border-[#e7eaf4] bg-white px-4 py-2 text-xs font-bold text-[#6170da] dark:border-[#2f3b54] dark:bg-[#111827] dark:text-[#9eb0ff]">{t('products.update_product')}</button>
          <button onClick={openAddModal} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white">{t('products.add_product')}</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [t('products.total_products'), '1,248'],
          [t('products.low_stock'), '36'],
          [t('products.out_of_stock'), '9'],
          [t('products.drafts'), '14'],
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
              <th className="px-5 py-3">{t('products.col_product')}</th>
              <th className="px-5 py-3">{t('products.col_sku')}</th>
              <th className="px-5 py-3">{t('products.col_stock')}</th>
              <th className="px-5 py-3">{t('products.col_price')}</th>
              <th className="px-5 py-3">{t('products.col_action')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((product) => (
              <tr key={product.sku} className="border-b border-[#f0f2f8] text-sm text-[#4c5674] dark:border-[#1f2a3d] dark:text-[#c7d2e4]">
                <td className="px-5 py-3 font-semibold text-[#2a3150] dark:text-[#e2e8f0]">{product.name}</td>
                <td className="px-5 py-3">{product.sku}</td>
                <td className="px-5 py-3">{product.stock}</td>
                <td className="px-5 py-3 font-semibold">{product.price}</td>
                <td className="px-5 py-3">
                  <button onClick={() => openUpdateModal(product)} className="rounded-md border border-[#e6e9f4] px-3 py-1.5 text-xs font-semibold text-[#6070da] dark:border-[#2f3b54] dark:text-[#9eb0ff]">{t('common.update')}</button>
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
        title={`${modal.mode === 'add' ? t('common.add') : t('common.update')} ${t('products.title')}`}
        subtitle={t('products.subtitle')}
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setModal((p) => ({ ...p, open: false })); }}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('products.col_product')}
              <input defaultValue={modal.row?.name || ''} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('products.col_price')}
              <input defaultValue={modal.row?.price || ''} className="mt-1 h-10 w-full rounded-md border border-[#e7ebf5] bg-white px-3 text-sm dark:border-[#2f3b54] dark:bg-[#0f172a]" />
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

export default MenuPage;
