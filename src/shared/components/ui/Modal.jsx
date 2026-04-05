import { useEffect } from 'react';

function Modal({ isOpen, title, subtitle, children, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 cursor-pointer bg-[#0f172a]/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl rounded-2xl border border-[#e8ebf5] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.24)] dark:border-[#2f3b54] dark:bg-[#111827]">
        <div className="flex items-start justify-between border-b border-[#edf0f7] px-6 py-5 dark:border-[#283247]">
          <div>
            <h3 className="text-xl font-extrabold text-[#1f2440] dark:text-[#e5e7eb]">{title}</h3>
            {subtitle ? (
              <p className="mt-1 text-sm text-[#8f99b0] dark:text-[#94a3b8]">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-md border border-[#e7ebf5] text-[#7a86a4] hover:bg-[#f8f9fd] dark:border-[#2f3b54] dark:text-[#9eb0cf] dark:hover:bg-[#182235]"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
