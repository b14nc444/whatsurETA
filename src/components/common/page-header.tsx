export const PageHeader = () => (
  <header className="mx-auto max-w-xl space-y-4 py-12 text-center md:py-14">
    <h1 className="inline-flex items-center gap-2 text-heading-h2 font-bold">
      <span aria-hidden className="text-brand-blue-600">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2.75 20.5 7.5v9L12 21.25 3.5 16.5v-9L12 2.75Zm0 2.04L5.5 8.44l6.5 3.63 6.5-3.63L12 4.79Zm-7 5.28v5.27l6 3.35v-5.27l-6-3.35Zm8 8.62 6-3.35v-5.27l-6 3.35v5.27Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="bg-[image:var(--gradient-brand)] bg-clip-text text-transparent">언제올까?</span>
    </h1>
    <p className="text-body-lg text-neutral-700">
      택배사, 송장번호, 도착지를 입력하면
      <br />
      예상 도착 시간을 알려드려요.
    </p>
  </header>
);
