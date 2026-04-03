import { useI18n } from '../../i18n/I18nProvider';

function buildPaginationItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  const sorted = [...pages].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  const items = [];

  for (let i = 0; i < sorted.length; i += 1) {
    items.push(sorted[i]);
    if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) {
      items.push('...');
    }
  }

  return items;
}

function Pagination({ page, setPage, totalPages }) {
  const { t } = useI18n();

  if (totalPages <= 1) return null;

  const items = buildPaginationItems(page, totalPages);

  return (
    <div className="flex flex-wrap items-center gap-1">
      <button
        type="button"
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
        className="rounded-md border border-[#e7ebf5] bg-white px-3 py-1.5 text-xs font-semibold text-[#6e7895] transition hover:bg-[#f7f9fe] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#2f3b54] dark:bg-[#111827] dark:text-[#c7d2e4] dark:hover:bg-[#182235]"
      >
        {t('common.prev')}
      </button>

      {items.map((item, index) =>
        item === '...' ? (
          <span key={`dots-${index}`} className="px-2 text-xs text-[#9aa4bb] dark:text-[#7f8da8]">
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => setPage(item)}
            className={`h-8 min-w-8 rounded-md px-2 text-xs font-bold transition ${
              page === item
                ? 'bg-[#5468d8] text-white shadow-[0_6px_16px_rgba(84,104,216,0.25)]'
                : 'border border-[#e7ebf5] bg-white text-[#6e7895] hover:bg-[#f7f9fe] dark:border-[#2f3b54] dark:bg-[#111827] dark:text-[#c7d2e4] dark:hover:bg-[#182235]'
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        disabled={page === totalPages}
        className="rounded-md border border-[#e7ebf5] bg-white px-3 py-1.5 text-xs font-semibold text-[#6e7895] transition hover:bg-[#f7f9fe] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#2f3b54] dark:bg-[#111827] dark:text-[#c7d2e4] dark:hover:bg-[#182235]"
      >
        {t('common.next')}
      </button>
    </div>
  );
}

export default Pagination;
