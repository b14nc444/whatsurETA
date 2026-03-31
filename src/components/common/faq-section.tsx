export const FAQSection = () => (
  <div className="inline-flex w-full flex-col items-start justify-start gap-3 px-9">
    <div className="relative h-5 w-full">
      <h2 className="absolute left-0 top-[0.5px] text-sm font-bold leading-5 text-gray-900 font-['Noto_Sans_KR']">
        *자주 묻는 질문
      </h2>
    </div>
    <p className="relative w-full pl-4 text-base font-normal text-neutral-950/50 font-['Noto_Sans_KR'] before:absolute before:left-0 before:top-[0.62rem] before:h-1.5 before:w-1.5 before:rounded-full before:bg-neutral-950/40 before:content-['']">
      도착지는 ETA 계산에 필요해요.
    </p>
    <p className="relative w-full pl-4 text-base font-normal text-neutral-950/50 font-['Noto_Sans_KR'] before:absolute before:left-0 before:top-[0.62rem] before:h-1.5 before:w-1.5 before:rounded-full before:bg-neutral-950/40 before:content-['']">
      송장번호 형식이 틀리면 조회가 차단돼요.
    </p>
    <p className="relative w-full pl-4 text-base font-normal text-neutral-950/50 font-['Noto_Sans_KR'] before:absolute before:left-0 before:top-[0.62rem] before:h-1.5 before:w-1.5 before:rounded-full before:bg-neutral-950/40 before:content-['']">
      예측 실패 시 배송 현황은 그대로 확인할 수 있어요.
    </p>
  </div>
);
