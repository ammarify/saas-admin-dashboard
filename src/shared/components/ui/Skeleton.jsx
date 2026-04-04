function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-md bg-[#edf1f7] dark:bg-[#1f2a3d] ${className}`} />;
}

export function SkeletonRow({ columns = 6 }) {
  return (
    <tr className="border-b border-[#f0f2f8] dark:border-[#1f2a3d]">
      {Array.from({ length: columns }, (_, index) => (
        <td key={`skeleton-cell-${index}`} className="px-5 py-3">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-sm border border-[#e6e8ef] bg-white px-5 py-4 dark:border-[#283247] dark:bg-[#111827]">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-8 w-16" />
    </div>
  );
}

export default Skeleton;
