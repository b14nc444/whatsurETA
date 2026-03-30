export const FloatingHelpButton = () => (
  <button
    type="button"
    aria-label="도움말 열기"
    className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] text-neutral-0 shadow-token-md transition-transform duration-base ease-standard hover:scale-105 active:scale-95"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M9.4 9.3A2.6 2.6 0 0 1 12 7.3c1.45 0 2.6.98 2.6 2.35 0 1.06-.58 1.72-1.62 2.35-.83.49-1.14.83-1.14 1.56v.22"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.9" r="1.1" fill="currentColor" />
    </svg>
  </button>
);
