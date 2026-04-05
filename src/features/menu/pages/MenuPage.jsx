import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import { SkeletonCard, SkeletonRow } from '../../../shared/components/ui/Skeleton';
import { toast } from 'react-toastify';
import { addProduct, getProducts, updateProduct } from '../../../services/api/dummyJsonApi';
import { useNotifications } from '../../../shared/notifications/notificationsContext';

const PAGE_SIZE = 5;

function mapProduct(product) {
  return {
    id: product.id,
    name: product.title,
    sku: product.sku || `PRD-${1000 + product.id}`,
    stock: Number(product.stock || 0),
    price: `$${Number(product.price || 0).toFixed(2)}`,
    category: product.category || 'general',
  };
}

function parsePrice(value) {
  const cleaned = String(value || '').replace(/[^\d.]/g, '');
  return Number(cleaned || 0);
}

function MenuPage() {
  const { t, language } = useI18n();
  const { addNotification } = useNotifications();
  const isArabic = language === 'ar';
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ open: false, mode: 'add', row: null });
  const [products, setProducts] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', sku: '', price: '', stock: '' },
  });

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    getProducts()
      .then((response) => {
        if (!ignore) {
          setProducts(response.map(mapProduct));
        }
      })
      .catch(() => {
        if (!ignore) {
          setProducts([]);
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
  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q);
      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'low' && product.stock < 50) ||
        (stockFilter === 'high' && product.stock >= 50);
      return matchesQuery && matchesStock;
    });
  }, [products, query, stockFilter]);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [page, filteredProducts]);

  useEffect(() => {
    setPage(1);
  }, [query, stockFilter]);

  function openAddModal() {
    reset({ name: '', sku: `PRD-${1000 + products.length + 1}`, price: '', stock: '' });
    setModal({ open: true, mode: 'add', row: null });
  }

  function openUpdateModal(row) {
    if (!row) return;
    reset({
      name: row.name || '',
      sku: row.sku || '',
      price: String(parsePrice(row.price)),
      stock: String(row.stock || 0),
    });
    setModal({ open: true, mode: 'update', row });
  }

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      const payload = {
        title: values.name.trim(),
        price: parsePrice(values.price),
        stock: Number(values.stock),
        category: modal.row?.category || 'general',
      };

      if (modal.mode === 'add') {
        const created = await addProduct(payload);
        setProducts((prev) => [mapProduct(created), ...prev]);
        addNotification({
          title: isArabic ? 'تمت إضافة منتج' : 'Product added',
          detail: isArabic ? `تمت إضافة ${values.name.trim()} إلى الكتالوج.` : `${values.name.trim()} was added to the catalog.`,
        });
        toast.success('Product added');
      } else if (modal.row?.id) {
        const updated = await updateProduct(modal.row.id, payload);
        setProducts((prev) =>
          prev.map((product) =>
            product.id === modal.row.id
              ? { ...product, ...mapProduct({ ...modal.row, ...updated }), sku: values.sku }
              : product
          )
        );
        addNotification({
          title: isArabic ? 'تم تحديث المنتج' : 'Product updated',
          detail: isArabic ? `تم تحديث ${values.name.trim()} بنجاح.` : `${values.name.trim()} was updated successfully.`,
        });
        toast.success('Product updated successfully');
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
          <h1 className="text-[30px] font-extrabold text-[#1d2341] dark:text-[#e5e7eb]">{t('products.title')}</h1>
          <p className="text-sm text-[#96a0b7] dark:text-[#94a3b8]">{t('products.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={openAddModal} className="rounded-md bg-[#5468d8] px-4 py-2 text-xs font-bold text-white">{t('products.add_product')}</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-sm border border-[#e6e8ef] bg-white p-4 dark:border-[#283247] dark:bg-[#111827]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isArabic ? 'ابحث باسم المنتج أو SKU...' : 'Search product name or SKU...'}
          className="h-10 min-w-[220px] flex-1 rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0]"
        />
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="select-field h-10 min-w-[180px] rounded-md border border-[#e7ebf5] bg-[#f9faff] px-3 text-sm text-[#4c5674] outline-none transition focus:border-[#9aa8dd] dark:border-[#2f3b54] dark:bg-[#0f172a] dark:text-[#dbe4f0]"
        >
          <option value="all">{isArabic ? 'جميع المخزون' : 'All Stock'}</option>
          <option value="low">{isArabic ? 'مخزون منخفض' : 'Low Stock'}</option>
          <option value="high">{isArabic ? 'مخزون جيد' : 'Healthy Stock'}</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }, (_, index) => <SkeletonCard key={`product-card-skeleton-${index}`} />)
          : [
              [t('products.total_products'), String(products.length)],
              [t('products.low_stock'), String(products.filter((item) => item.stock < 25).length)],
              [t('products.out_of_stock'), String(products.filter((item) => item.stock <= 0).length)],
              [t('products.drafts'), String(new Set(products.map((item) => item.category)).size)],
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
              <th className="px-5 py-3">{t('products.col_product')}</th>
              <th className="px-5 py-3">{t('products.col_sku')}</th>
              <th className="px-5 py-3">{t('products.col_stock')}</th>
              <th className="px-5 py-3">{t('products.col_price')}</th>
              <th className="px-5 py-3">{t('products.col_action')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: PAGE_SIZE }, (_, index) => <SkeletonRow key={`product-skeleton-${index}`} columns={5} />)
              : rows.map((product) => (
              <tr key={product.sku} className="border-b border-[#f0f2f8] text-sm text-[#4c5674] transition hover:bg-[#fafbff] dark:border-[#1f2a3d] dark:text-[#c7d2e4] dark:hover:bg-[#182235]">
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

        <div className="flex items-center justify-between border-t border-[#edf0f7] px-5 py-4 dark:border-[#283247]">
          <p className="text-xs text-[#9aa3b8] dark:text-[#94a3b8]">
            {isArabic ? 'عرض' : 'Showing'} {filteredProducts.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredProducts.length)} {t('orders.of')} {filteredProducts.length}
          </p>
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </div>

      <Modal
        isOpen={modal.open}
        onClose={() => setModal((prev) => ({ ...prev, open: false }))}
        title={`${modal.mode === 'add' ? t('common.add') : t('common.update')} ${t('products.title')}`}
        subtitle={t('products.subtitle')}
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('products.col_product')}
              <input {...register('name', { required: 'Product name is required' })} className={`mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.name ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`} />
              {errors.name ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.name.message}</p> : null}
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('products.col_price')}
              <input type="number" min="0.01" step="0.01" {...register('price', { required: 'Price is required', min: { value: 0.01, message: 'Price must be greater than 0' } })} className={`mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.price ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`} />
              {errors.price ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.price.message}</p> : null}
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('products.col_sku')}
              <input {...register('sku', { required: 'SKU is required' })} className={`mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.sku ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`} />
              {errors.sku ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.sku.message}</p> : null}
            </label>
            <label className="text-xs font-semibold text-[#8f99b0] dark:text-[#94a3b8]">
              {t('products.col_stock')}
              <input type="number" min="0" {...register('stock', { required: 'Stock is required', min: { value: 0, message: 'Stock cannot be negative' } })} className={`mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm dark:bg-[#0f172a] ${errors.stock ? 'border-[#d45555] dark:border-[#a54a4a]' : 'border-[#e7ebf5] dark:border-[#2f3b54]'}`} />
              {errors.stock ? <p className="mt-1 text-[11px] font-semibold text-[#d45555]">{errors.stock.message}</p> : null}
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

export default MenuPage;
