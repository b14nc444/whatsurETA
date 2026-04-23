export const PageHeader = () => (
  <header className="mx-auto flex h-[11.5625rem] w-full max-w-[30.3125rem] flex-col items-center justify-center gap-[0.9375rem] px-4 pt-12 text-center">
    <img src="/icons/logo-eta.svg" alt="언제올까 로고" className="h-10 w-auto" />
    <p className="self-stretch text-center text-lg font-normal leading-7 text-gray-600">
      AI 택배 예언가가
      <br />
      예상 도착 시간을 알려드려요.
    </p>
  </header>
);
