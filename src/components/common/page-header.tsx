export const PageHeader = () => (
  <header className="mx-auto flex h-[11.5625rem] w-full max-w-[30.3125rem] flex-col items-center justify-center gap-[0.9375rem] px-4 pt-12 text-center">
    <div className="inline-flex items-center justify-start gap-3">
      <span aria-hidden className="text-brand-blue-600">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2.75 20.5 7.5v9L12 21.25 3.5 16.5v-9L12 2.75Zm0 2.04L5.5 8.44l6.5 3.63 6.5-3.63L12 4.79Zm-7 5.28v5.27l6 3.35v-5.27l-6-3.35Zm8 8.62 6-3.35v-5.27l-6 3.35v5.27Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <h1 className="bg-[image:var(--gradient-brand)] bg-clip-text text-center text-4xl font-bold leading-10 tracking-tight text-black/0 font-['Noto_Sans_KR']">
        언제올까?
      </h1>
    </div>
    <p className="self-stretch text-center text-lg font-normal leading-7 text-gray-600 font-['Noto_Sans_KR']">
      AI 택배 예언가가
      <br />
      예상 도착 시간을 알려드려요.
    </p>
  </header>
);
