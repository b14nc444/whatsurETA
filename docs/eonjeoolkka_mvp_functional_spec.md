# 언제올까? MVP 기능명세서 v1.0

- 문서 목적: MVP 기획/디자인/프론트엔드/백엔드 개발이 즉시 착수 가능하도록 기능 범위, 화면 동작, 내부 API, 데이터 구조, 예외 처리, 완료 기준을 정의한다.
- 대상 서비스: 언제올까?
- 작성 기준일: 2026-03-12
- 문서 상태: 개발 착수용 초안

---

## 1. 서비스 개요

### 1.1 서비스명
언제올까?

### 1.2 서비스 목적
배송출발 연락이 오기 전에 사용자가 택배 도착 예상 시점을 미리 파악할 수 있도록 돕는다.

### 1.3 MVP 핵심 가치
- 택배사/송장번호 기반으로 현재 배송 현황을 빠르게 조회한다.
- 도착지를 함께 입력받아 도착 예상 범위를 더 구체화한다.
- `빠르면 ( ) 시`, `늦으면 ( ) 시` 형태로 실사용 가능한 시간 범위를 보여준다.
- 예측 근거를 한 줄로 설명해 결과 신뢰감을 높인다.

### 1.4 MVP 한 줄 정의
택배사, 송장번호, 도착지를 입력하면 배송 현황과 도착 예상 시간 범위 및 예측 근거를 제공하는 광고 기반 반응형 웹서비스

---

## 2. MVP 범위

## 2.1 포함 범위

### 입력
- 택배사 선택
- 송장번호 입력
- 도착지 검색 및 선택
- 상세주소 입력(선택)

### 출력
- 배달 현황 테이블
- 현재 배송 상태 요약
- 빠르면 도착 시각
- 늦으면 도착 시각
- 예측 근거 한 줄 설명
- 에러/예외 화면
- 광고 슬롯

### 시스템
- 외부 택배 조회 API 연동
- 카카오 우편번호 서비스 연동
- GPT 기반 ETA 생성
- 결과 캐시
- 기본 로그/분석 이벤트 수집
- rate limit

## 2.2 제외 범위
- 회원가입/로그인
- 다건 송장 조회
- 자동 택배사 판별
- 푸시/카카오/이메일 알림
- 앱 출시
- 지도 시각화
- 실시간 자동 새로고침
- 관리자 웹 UI
- ML 전용 학습 파이프라인

---

## 3. 외부 연동 정의

## 3.1 택배 조회 API
- 사용처: 택배사 목록 조회, 배송 상태 조회
- 호출 주체: 백엔드만 호출
- 프론트 직접 호출: 금지
- 목적:
  - 택배사 목록 로딩
  - 배송 상태 및 진행 이력 조회
  - 배달 현황 테이블 데이터 생성

## 3.2 카카오 우편번호 서비스
- 사용처: 도착지 검색/선택
- 호출 주체: 프론트엔드
- 목적:
  - 사용자가 도착지를 빠르게 입력하도록 보조
  - 주소 입력 오타 감소
  - ETA 예측에 사용할 기본 주소/우편번호 확보

## 3.3 GPT API
- 사용처: ETA 시간 범위 생성, 예측 근거 한 줄 생성
- 호출 주체: 백엔드만 호출
- 프론트 직접 호출: 금지
- 목적:
  - 배송 상태와 도착지 정보를 바탕으로 earliest/latest ETA 추정
  - 사용자가 이해하기 쉬운 한 줄 설명 생성

---

## 4. 사용자 역할

## 4.1 일반 사용자
- 택배가 언제 올지 알고 싶다.
- 오늘 올지, 몇 시쯤 올지 알고 싶다.
- 배송조회 원본 정보를 표로 확인하고 싶다.
- 회원가입 없이 바로 사용하고 싶다.

## 4.2 운영자
- 조회 성공률과 오류율을 모니터링한다.
- 캐시 적중률과 외부 API 비용을 관리한다.
- GPT 예측 실패율을 확인한다.
- 광고 노출/클릭 이벤트를 점검한다.

---

## 5. 핵심 사용자 플로우

## 5.1 최초 조회 플로우
1. 사용자가 홈 화면 진입
2. 택배사 선택
3. 송장번호 입력
4. 도착지 검색 버튼 클릭
5. 카카오 우편번호 팝업에서 주소 선택
6. 필요 시 상세주소 입력
7. 조회 버튼 클릭
8. 프론트엔드 1차 입력 검증
9. 백엔드 `POST /api/v1/track` 호출
10. 백엔드에서 캐시 확인
11. 캐시 miss면 외부 택배조회 API 호출
12. 응답 정규화
13. 배송상태가 ETA 산출 가능 상태면 GPT API 호출
14. 배송 현황 + ETA + 근거를 합쳐 응답 반환
15. 결과 화면 렌더링
16. 분석/광고 이벤트 기록

## 5.2 재조회 플로우
1. 동일 조건으로 재조회
2. 백엔드가 `courierCode + trackingHash + destinationHash + latestProgressHash` 조합으로 캐시 확인
3. 유효 캐시가 있으면 캐시 결과 반환
4. 캐시가 없거나 만료되었으면 live 재조회

## 5.3 오류 플로우
1. 입력 오류는 프론트/서버에서 즉시 차단
2. 외부 API 조회 실패 시 에러 코드 매핑
3. 필요 시 이전 캐시 fallback
4. GPT 파싱 실패 시 ETA 영역만 fallback 표시

---

## 6. 화면별 기능명세

## 6.1 화면 S01: 홈 / 입력 화면

### 목적
사용자가 조회에 필요한 최소 입력값을 빠르게 입력하도록 한다.

### 구성 요소
- 서비스 타이틀
- 서비스 설명 문구
- 택배사 선택 드롭다운
- 송장번호 입력창
- 도착지 검색 버튼
- 도착지 입력 결과 표시 영역
- 상세주소 입력칸
- 조회 버튼
- FAQ 영역
- 광고 슬롯 A(페이지 하단)

### 기능 목록

#### F-INPUT-01 택배사 조회 및 선택
- 페이지 진입 시 내부 API `GET /api/v1/couriers` 호출
- 성공 시 택배사 목록을 드롭다운으로 노출
- 비활성 택배사는 숨기거나 선택 불가 처리
- 마지막 선택 택배사는 `sessionStorage`에 저장 가능

**입력 규칙**
- 택배사 선택은 필수
- 자유 입력 불가
- 드롭다운 기본값은 `택배사를 선택해주세요`

**예외 처리**
- 목록 로딩 실패 시 `택배사 목록을 불러오지 못했습니다` 메시지 표시
- 재시도 버튼 제공

**완료 기준**
- 택배사 목록이 정상 로딩된다.
- 택배사 미선택 시 조회 불가 상태가 유지된다.

#### F-INPUT-02 송장번호 입력
- 입력 타입: `text`
- 붙여넣기 허용
- 공백 제거
- 하이픈 제거
- 영문/숫자 조합 허용

**프론트 검증 규칙**
- 빈 값 불가
- sanitize 후 길이 8~20자 범위 권장
- 허용 문자 외 입력 시 오류 표시

**서버 검증 규칙**
- 최종 sanitize 수행
- 빈 값 여부 확인
- provider별 형식 룰 테이블 적용 가능
- 형식 오류 시 외부 API 호출 금지

**완료 기준**
- 조회 전에 공백과 하이픈이 제거된다.
- 잘못된 형식은 inline error로 표시된다.
- 형식 오류 시 외부 API가 호출되지 않는다.

#### F-INPUT-03 도착지 입력
- `도착지 검색` 버튼 클릭 시 카카오 우편번호 서비스 호출
- 사용자가 주소 선택 시 아래 값 반영
  - `zonecode`
  - `address`
  - `roadAddress`
  - `jibunAddress`
- 화면에는 기본적으로 도로명주소를 우선 표시
- 상세주소는 별도 입력칸에 수동 입력

**저장 권장값**
- `postalCode`
- `baseAddress`
- `detailAddress`

**입력 규칙**
- ETA 예측에는 `postalCode`와 `baseAddress`가 필수
- 상세주소는 선택 입력
- GPT 전달 시 상세주소 전체는 기본적으로 제외

**완료 기준**
- 주소 선택 시 우편번호와 기본주소가 자동 채워진다.
- 도착지 미입력 시 ETA 예측을 수행하지 않는다.

#### F-INPUT-04 조회 버튼
- 입력값이 유효할 때만 활성화
- 클릭 또는 Enter 키로 제출 가능
- 중복 클릭 방지
- 클릭 후 로딩 화면 전환

**완료 기준**
- 필수값 누락 시 버튼 비활성 또는 에러 표시
- 중복 submit이 발생하지 않는다.

---

## 6.2 화면 S02: 로딩 화면

### 목적
조회 진행 상태를 사용자에게 명확히 전달한다.

### 구성 요소
- 로딩 스피너 또는 스켈레톤
- 안내 문구 1: `배송 정보를 확인하고 있어요`
- 안내 문구 2: `도착 예상 시간을 계산하고 있어요`

### 동작 규칙
- 0~3초: 기본 로딩 문구 노출
- 3초 초과: `조회가 조금 지연되고 있어요` 문구 추가
- 8초 초과: 재시도 안내 표시
- 20초 초과: 일반 오류 처리

**완료 기준**
- 로딩 중 중복 submit이 발생하지 않는다.
- 장시간 대기 시 사용자에게 현재 상태가 설명된다.

---

## 6.3 화면 S03: 결과 화면

### 목적
배송 원본 정보와 ETA 예측 결과를 한 화면에서 이해 가능하게 제공한다.

### 구성 요소
1. 배송 요약 카드
2. 배달 현황 테이블
3. ETA 카드
4. 예측 근거 카드
5. 마지막 갱신 정보
6. 재조회 안내
7. 광고 슬롯 B/C

### 기능 목록

#### F-OUTPUT-01 배송 요약 카드
표시 항목:
- 택배사명
- 마스킹된 송장번호
- 현재 배송 상태
- 마지막 처리 시각
- 마지막 위치
- 데이터 기준 시각

**완료 기준**
- 조회 성공 시 최소 1개의 상태 정보가 노출된다.
- 송장번호 원문 전체가 노출되지 않는다.

#### F-OUTPUT-02 배달 현황 테이블
데이터 소스:
- 외부 택배조회 API 응답의 진행 이력

컬럼 정의:
- 시간
- 위치
- 상태
- 상세설명

표시 규칙:
- 기본 정렬은 최신순
- 배열 길이가 길면 최근 8개 우선 표시 후 `더보기`
- 위치/설명이 없는 값은 `-` 처리
- 진행 이력이 없으면 요약 카드만 표시

상태별 처리:
- `DELIVERED`: 테이블은 유지, ETA 카드 대신 배송완료 강조
- `FAILED`, `RETURNED`, `CANCELLED`, `HOLD`: 테이블은 유지, ETA 카드 숨김 가능

**완료 기준**
- 이력이 존재하면 테이블이 렌더링된다.
- 각 행은 시간/위치/상태/상세설명 규격으로 표시된다.

#### F-OUTPUT-03 빠르면 ( ) 시 / 늦으면 ( ) 시
데이터 소스:
- GPT API 결과

표시 항목:
- 빠르면: earliest ETA
- 늦으면: latest ETA

표시 형식 규칙:
- 내부 데이터는 `datetime`으로 저장
- UI는 `오늘 17시`, `내일 14시` 형태로 가공
- 같은 날짜면 `빠르면 오늘 17시 / 늦으면 오늘 21시`
- 날짜가 다르면 날짜 라벨을 각각 분리

노출 조건:
- 배송조회 성공
- ETA 산출 가능 상태
- GPT 응답이 정상 파싱됨

비노출 조건:
- `NOT_FOUND`
- `INVALID_TRACKING_NUMBER`
- `SYSTEM_ERROR`
- `DELIVERED`
- `FAILED`, `RETURNED`, `CANCELLED`, `HOLD`

fallback:
- GPT 실패 시 `도착 시간 예측이 어려워요` 문구 표시

**완료 기준**
- earliest/latest ETA가 모두 렌더링된다.
- 날짜가 다르면 오늘/내일 등 날짜 정보가 함께 노출된다.
- GPT 실패 시 화면 전체가 깨지지 않고 ETA 영역만 fallback 처리된다.

#### F-OUTPUT-04 예측 근거 한 줄 설명
데이터 소스:
- GPT API 결과

표시 규칙:
- 1문장만 사용
- 80자 이내 권장
- 단정형 금지
- 설명형/확률형 문장 사용

좋은 예:
- `현재 배송중이고 최근 이동 이력이 있어 오늘 저녁 도착 가능성이 높습니다.`
- `아직 집화 초기 단계라 오늘보다 내일 도착 가능성이 더 높습니다.`

나쁜 예:
- `오늘 7시에 도착합니다.`
- `무조건 오늘 옵니다.`

fallback:
- GPT reason이 없으면 서버에서 템플릿 문구로 대체 가능

**완료 기준**
- ETA가 노출되면 근거 문구도 함께 노출된다.
- 지나치게 긴 응답은 서버 또는 프론트에서 1문장으로 제한된다.

#### F-OUTPUT-05 마지막 갱신 정보
표시 항목:
- 데이터 출처: live / cache
- 마지막 조회 시각
- stale 여부

**완료 기준**
- 캐시 응답 여부를 사용자에게 표시할 수 있다.

#### F-OUTPUT-06 재조회 안내
표시 문구 예시:
- `새 배송 이력이 반영되면 예측도 바뀔 수 있어요.`
- 상태별 권장 재조회 시간 안내

권장 규칙:
- 집화/초기 상태: 3시간 뒤
- 배송중: 1시간 뒤
- 배송출발: 15분 뒤

---

## 6.4 화면 S04: 오류/예외 화면

### 기능 목록

#### F-ERROR-01 입력 형식 오류
표시 문구:
- `송장번호 형식을 다시 확인해주세요.`
- `도착지를 선택해주세요.`

동작:
- 입력 화면에 inline error 노출
- 서버 요청 또는 외부 API 호출 금지

#### F-ERROR-02 조회 결과 없음
표시 문구:
- `아직 택배사 시스템에 반영되지 않았거나 송장번호가 일치하지 않아요.`
- `1~3시간 뒤 다시 확인해보세요.`

동작:
- 배송 현황/ETA 미노출
- 오류 결과 화면 표시
- 일정 TTL로 캐시 가능

#### F-ERROR-03 외부 시스템 오류
표시 문구:
- `택배사 응답이 일시적으로 지연되고 있어요.`

동작:
- 최근 캐시가 있으면 stale 결과 + 안내 배지 표시
- 캐시가 없으면 일반 오류 화면 표시

#### F-ERROR-04 GPT 예측 실패
표시 문구:
- `도착 시간 예측이 어려워요.`

동작:
- 배송 현황은 그대로 노출
- ETA 카드만 fallback

#### F-ERROR-05 Rate Limit
표시 문구:
- `조회가 너무 많아요. 잠시 후 다시 시도해주세요.`

동작:
- HTTP 429 반환
- 재시도 문구 제공

---

## 7. 백엔드 기능명세

## 7.1 모듈 B01: 택배사 마스터 동기화

### 목적
프론트에서 사용할 택배사 목록을 관리한다.

### 기능
- 일정 주기로 외부 택배사 목록 동기화
- 내부 `couriers` 테이블 업데이트
- 운영상 비활성 택배사 관리

### 내부 규칙
- 동기화 실패 시 마지막 성공 데이터 사용
- 프론트는 외부 API가 아니라 내부 API만 호출

**완료 기준**
- 택배사 목록이 내부 DB 또는 캐시에서 안정적으로 제공된다.

---

## 7.2 모듈 B02: 배송조회 어댑터

### 목적
외부 택배조회 API 응답을 내부 표준 구조로 정규화한다.

### 기능
- 인증 헤더 생성
- 배송조회 요청 전송
- 응답 정규화
- 외부 상태코드를 내부 enum으로 매핑
- raw payload와 normalized payload 분리 저장

### 내부 상태 enum
- `PENDING`
- `REGISTERED`
- `PICKUP_READY`
- `PICKED_UP`
- `IN_TRANSIT`
- `OUT_FOR_DELIVERY`
- `DELIVERED`
- `FAILED`
- `RETURNED`
- `CANCELLED`
- `HOLD`
- `UNKNOWN`

### 정규화 규칙
- 상태값은 대소문자 무시 후 내부 enum으로 변환
- 미정의 상태는 `UNKNOWN`
- 위치 누락 시 `null`
- 설명 누락 시 빈 문자열 대신 `null`
- 시간값은 KST 기준 ISO string으로 저장

**완료 기준**
- 프론트/GPT 모듈은 외부 원형 응답을 직접 사용하지 않는다.

---

## 7.3 모듈 B03: 도착지 정규화

### 목적
카카오 우편번호 서비스에서 선택한 주소를 서버 저장/예측에 사용할 형태로 정리한다.

### 입력값
- `postalCode`
- `baseAddress`
- `roadAddress`
- `jibunAddress`
- `detailAddress`

### 저장 규칙
- 기본 저장값은 `postalCode`, `baseAddress`, `detailAddress`
- GPT 전달 기본값은 `postalCode`, `baseAddress`
- `detailAddress`는 기본적으로 GPT 입력 제외

**완료 기준**
- 예측에 필요한 최소 주소 정보만 정규화 저장된다.

---

## 7.4 모듈 B04: GPT 예측 서비스

### 목적
배송 상태와 도착지를 바탕으로 earliest/latest ETA와 한 줄 설명을 생성한다.

### 입력 데이터
- 택배사명
- 현재 배송 상태
- 마지막 처리 시각
- 마지막 위치
- 최근 진행 이력 3~5건
- 조회 시각(KST)
- 도착지 우편번호
- 도착지 기본주소
- 배송 완료 여부

### 출력 데이터
- `earliestEta`
- `latestEta`
- `reason`

### 출력 스키마
```json
{
  "earliest_eta": "2026-03-12T17:00:00+09:00",
  "latest_eta": "2026-03-12T21:00:00+09:00",
  "reason": "현재 배송중이며 최근 허브 이동이 확인되어 오늘 저녁 도착 가능성이 높습니다."
}
```

### 호출 조건
- 배송조회 성공 시에만 호출
- 상태가 ETA 산출 가능할 때만 호출
- 아래 경우 호출하지 않음
  - `INVALID_TRACKING_NUMBER`
  - `NOT_FOUND`
  - `SYSTEM_ERROR`
  - `DELIVERED`
  - `FAILED`
  - `RETURNED`
  - `CANCELLED`
  - `HOLD`

### 캐시 키 권장
`eta:{courierCode}:{trackingHash}:{destinationHash}:{latestProgressHash}`

### 프롬프트 설계 원칙
- 확정형 표현 금지
- 추론 근거는 1문장으로 생성
- 실제 사용자 표시값은 JSON 파싱 결과만 사용
- 자유 텍스트 파싱에 의존하지 않음

### GPT 실패 대응
- JSON 파싱 실패 시 fallback
- earliest/latest 누락 시 ETA 미노출
- reason 누락 시 템플릿 이유 문구 사용 가능

**완료 기준**
- 예측 성공 시 earliest/latest/reason이 구조화되어 반환된다.
- GPT 오류가 나더라도 배송현황 응답은 유지된다.

---

## 7.5 모듈 B05: 캐시

### 목적
외부 API 비용을 줄이고 응답 속도를 개선한다.

### 캐시 구분
1. 배송조회 캐시
2. ETA 예측 캐시

### 배송조회 캐시 키
`trace:{courierCode}:{trackingHash}`

### ETA 캐시 키
`eta:{courierCode}:{trackingHash}:{destinationHash}:{latestProgressHash}`

### 권장 TTL
- `PENDING`, `REGISTERED`, `PICKED_UP`: 180분
- `IN_TRANSIT`: 60분
- `OUT_FOR_DELIVERY`: 15분
- `DELIVERED`: 1440분
- `NOT_FOUND`: 60분
- `SYSTEM_ERROR`: 캐시 저장 안 함
- `INVALID_TRACKING_NUMBER`: 캐시 저장 안 함

### 동작 규칙
- 유효 캐시가 있으면 외부 호출 생략
- live 조회 실패 + stale 캐시 존재 시 stale 반환 가능
- ETA 캐시는 latest progress 기준으로 무효화

**완료 기준**
- 동일 조회 반복 시 외부 API 호출 수가 감소한다.
- stale fallback 여부를 응답에 표시할 수 있다.

---

## 7.6 모듈 B06: 광고

### 목적
MVP 수익화를 위한 디스플레이 광고를 제공한다.

### 슬롯 위치
- A: 홈 하단
- B: 결과 요약 카드 하단
- C: 배달 현황 테이블 하단

### 배치 규칙
- 입력 폼 위 광고 금지
- 결과 핵심 정보 위 광고 금지
- 오류 화면에서는 광고 1개 이하 권장
- 메인 콘텐츠 렌더링 후 광고 로드 권장

**완료 기준**
- 광고가 정보 가독성을 해치지 않는다.
- 광고 노출/클릭 이벤트가 기록된다.

---

## 7.7 모듈 B07: 로그/분석

### 목적
사용자 행동과 시스템 품질을 측정한다.

### 수집 이벤트
- `home_view`
- `courier_select`
- `tracking_input`
- `destination_select`
- `search_submit`
- `search_success`
- `search_error`
- `result_view`
- `eta_success`
- `eta_fallback`
- `ad_impression`
- `ad_click`

### 필수 속성
- `courierCode`
- `normalizedStatus`
- `dataSource`
- `isStale`
- `errorCode`
- `cacheHit`
- `gptUsed`
- `gptFallback`

### 저장 원칙
- 송장번호 원문 저장 금지
- `trackingHash` 사용
- IP, UA는 hash 저장 권장

---

## 8. 내부 API 명세

## 8.1 `GET /api/v1/couriers`

### 목적
프론트의 택배사 선택 목록 제공

### 응답 예시
```json
{
  "couriers": [
    { "code": "cj", "name": "CJ대한통운", "enabled": true },
    { "code": "lotte", "name": "롯데택배", "enabled": true }
  ],
  "updatedAt": "2026-03-12T09:00:00+09:00"
}
```

---

## 8.2 `POST /api/v1/track`

### 목적
배송조회 + ETA 예측 + 근거를 통합 반환

### 요청 예시
```json
{
  "courierCode": "cj",
  "trackingNumber": "123456789012",
  "destination": {
    "postalCode": "06236",
    "baseAddress": "서울특별시 강남구 테헤란로 123",
    "detailAddress": "10층"
  }
}
```

### 성공 응답 예시
```json
{
  "queryId": "q_x8K92mP4yN",
  "dataSource": "live",
  "isStale": false,
  "tracking": {
    "courierCode": "cj",
    "courierName": "CJ대한통운",
    "trackingNumberMasked": "1234******12",
    "deliveryStatus": "IN_TRANSIT",
    "deliveryStatusText": "배송중",
    "isDelivered": false,
    "lastProgressAt": "2026-03-12T14:30:00+09:00",
    "lastLocation": "서울 강남구",
    "progresses": [
      {
        "dateTime": "2026-03-12T14:30:00+09:00",
        "location": "서울 강남구",
        "status": "배송중",
        "statusCode": "IN_TRANSIT",
        "description": "배송중"
      }
    ]
  },
  "prediction": {
    "earliestEta": "2026-03-12T17:00:00+09:00",
    "latestEta": "2026-03-12T21:00:00+09:00",
    "reason": "현재 배송중이고 최근 이동 이력이 있어 오늘 저녁 도착 가능성이 높습니다.",
    "source": "gpt",
    "fallback": false
  },
  "meta": {
    "queriedAt": "2026-03-12T15:00:00+09:00",
    "recommendedRefreshAfterMin": 60
  }
}
```

### ETA fallback 응답 예시
```json
{
  "queryId": "q_x8K92mP4yN",
  "dataSource": "cache",
  "isStale": false,
  "tracking": {
    "courierCode": "cj",
    "courierName": "CJ대한통운",
    "trackingNumberMasked": "1234******12",
    "deliveryStatus": "IN_TRANSIT",
    "deliveryStatusText": "배송중",
    "isDelivered": false,
    "lastProgressAt": "2026-03-12T14:30:00+09:00",
    "lastLocation": "서울 강남구",
    "progresses": []
  },
  "prediction": {
    "earliestEta": null,
    "latestEta": null,
    "reason": "도착 시간 예측이 어려워요.",
    "source": "fallback",
    "fallback": true
  },
  "meta": {
    "queriedAt": "2026-03-12T15:00:00+09:00",
    "recommendedRefreshAfterMin": 60
  }
}
```

### 오류 응답 예시
```json
{
  "error": {
    "code": "INVALID_TRACKING_NUMBER",
    "message": "송장번호 형식을 다시 확인해주세요."
  }
}
```

---

## 8.3 `GET /api/v1/results/{queryId}`

### 목적
결과 페이지 새로고침 대응

### 규칙
- `queryId`는 24시간 유효
- URL에 송장번호 원문 노출 금지
- 만료 시 재조회 유도

---

## 9. 데이터 모델

## 9.1 `couriers`
- `code`
- `name`
- `enabled`
- `syncedAt`

## 9.2 `parcels`
- `id`
- `courierCode`
- `trackingHash`
- `trackingMasked`
- `createdAt`
- `updatedAt`

유니크 키:
- `(courierCode, trackingHash)`

## 9.3 `parcel_snapshots`
- `id`
- `parcelId`
- `deliveryStatus`
- `deliveryStatusText`
- `isDelivered`
- `lastProgressAt`
- `lastLocation`
- `progressesJson`
- `rawPayloadJson`
- `queriedAt`
- `dataSource`
- `createdAt`

## 9.4 `destinations`
- `id`
- `postalCode`
- `baseAddress`
- `detailAddress`
- `destinationHash`
- `createdAt`

## 9.5 `predictions`
- `id`
- `parcelId`
- `destinationId`
- `snapshotId`
- `earliestEta`
- `latestEta`
- `reason`
- `source`
- `fallback`
- `modelVersion`
- `createdAt`

## 9.6 `query_logs`
- `id`
- `queryId`
- `parcelId`
- `destinationId`
- `ipHash`
- `userAgentHash`
- `cacheHit`
- `errorCode`
- `responseMs`
- `createdAt`

### 저장 원칙
- 송장번호 원문 저장 금지
- 이름/주소 전체 원문 장기 저장 최소화
- 필요 최소한의 주소 정보만 저장
- raw payload는 짧은 보관 기간 권장

---

## 10. 비즈니스 규칙

## 10.1 ETA 노출 가능 상태
ETA를 노출하는 상태:
- `PENDING`
- `REGISTERED`
- `PICKUP_READY`
- `PICKED_UP`
- `IN_TRANSIT`
- `OUT_FOR_DELIVERY`
- `UNKNOWN`(선택적으로 fallback 안내만)

ETA를 노출하지 않는 상태:
- `DELIVERED`
- `FAILED`
- `RETURNED`
- `CANCELLED`
- `HOLD`

## 10.2 도착지 필수 규칙
- 도착지 정보가 없으면 ETA 생성 불가
- 배송 현황 조회만 허용할지 여부는 제품 정책으로 결정 가능
- 본 MVP에서는 `도착지 입력 후 조회`를 기본 시나리오로 간주

## 10.3 ETA 출력 형식 규칙
- 내부 데이터는 반드시 datetime
- 프론트에서 `오늘/내일 + 시`로 렌더링
- 모호한 `빠르면 5시` 단독 표기는 금지

## 10.4 근거 문구 규칙
- 1문장
- 단정형 금지
- 과도한 기술적 용어 지양
- 사용자가 바로 이해 가능한 한국어 문장 사용

---

## 11. 에러 코드 매핑

| 내부 코드 | 사용자 메시지 | GPT 호출 여부 |
|---|---|---|
| `INVALID_TRACKING_NUMBER` | 송장번호 형식을 다시 확인해주세요. | N |
| `DESTINATION_REQUIRED` | 도착지를 선택해주세요. | N |
| `NOT_FOUND` | 아직 택배사 시스템에 반영되지 않았거나 송장번호가 일치하지 않아요. | N |
| `SYSTEM_ERROR` | 택배사 응답이 일시적으로 지연되고 있어요. | N |
| `ETA_UNAVAILABLE` | 도착 시간 예측이 어려워요. | N |
| `RATE_LIMITED` | 조회가 너무 많아요. 잠시 후 다시 시도해주세요. | N |

---

## 12. 비기능 요구사항

## 12.1 성능
- 캐시 hit 응답: p95 1.5초 이내 목표
- live 조회 응답: p95 4초 이내 목표
- 결과 화면 핵심 카드 우선 렌더링
- 광고는 주요 콘텐츠 렌더링 이후 로드 권장

## 12.2 보안
- 외부 API 키는 서버 환경변수 저장
- Secret/Key 프론트 노출 금지
- HTTPS 강제
- 결과 페이지는 `noindex` 권장
- rate limit 적용

## 12.3 개인정보
- 송장번호 URL 노출 금지
- 로그에 송장번호 원문 저장 금지
- 도착지 상세주소는 최소 저장
- GPT 전달 시 불필요한 상세주소/개인정보 제외

## 12.4 접근성
- 키보드만으로 조회 가능
- 오류 메시지는 텍스트로 명시
- 색상 외 텍스트/아이콘으로 상태 구분

---

## 13. QA 시나리오

### QA-01 정상 조회
- 택배사 선택
- 정상 송장번호 입력
- 도착지 선택
- 배송 현황과 ETA가 함께 표시된다.

### QA-02 도착지 누락
- 택배사/송장번호만 입력
- 도착지 미선택 상태로 제출
- 도착지 필요 오류 표시

### QA-03 형식 오류
- 잘못된 송장번호 입력
- 외부 API 호출 없이 inline error 표시

### QA-04 조회 결과 없음
- 미등록 송장 조회
- `NOT_FOUND` 메시지 표시
- ETA 미노출

### QA-05 배송완료 상태
- `DELIVERED`
- 배송완료 강조
- ETA 카드 미노출

### QA-06 배송중 상태
- `IN_TRANSIT`
- 배달 현황 테이블 노출
- earliest/latest ETA 노출
- 근거 문구 노출

### QA-07 GPT 실패
- 배송 현황은 표시
- ETA는 fallback 문구 표시
- 화면 전체는 정상 유지

### QA-08 캐시 hit
- 동일 조회 2회 수행
- 두 번째 요청에서 캐시 응답 반환
- `dataSource=cache`

### QA-09 stale fallback
- live 실패 + 기존 캐시 존재
- stale 안내와 함께 기존 결과 노출

### QA-10 광고 위치 검수
- 입력 폼 위 광고 없음
- ETA 카드 위 광고 없음

---

## 14. 개발 우선순위

## 14.1 1차 필수
- 내부 택배사 목록 API
- 송장번호 조회 API
- 카카오 우편번호 연동
- 홈/결과/오류 화면 기본 구현
- 배달 현황 테이블 렌더링

## 14.2 2차 필수
- GPT ETA JSON 출력
- 빠르면/늦으면 카드
- 근거 문구 카드
- 캐시
- 에러 코드 매핑

## 14.3 3차 마감 전
- rate limit
- stale fallback
- 광고 슬롯
- 로그/분석 이벤트
- 결과 `queryId` 복원

---

## 15. 팀별 작업 분리

## 15.1 프론트엔드
- 홈 입력 화면
- 카카오 우편번호 팝업 연동
- 배달 현황 테이블
- ETA 카드
- 오류 화면
- 광고 슬롯
- 분석 이벤트 트리거

## 15.2 백엔드
- 택배사 목록 동기화
- 배송조회 어댑터
- 내부 API 구현
- 캐시
- ETA GPT 호출
- rate limit
- queryId 저장/조회

## 15.3 PM/디자인
- 입력/오류/결과 카피
- 카드/테이블 정보 우선순위 정의
- 광고 위치 검수
- QA 기준 승인

---

## 16. 최종 결정 사항
- MVP는 단건 조회만 지원한다.
- 택배사 자동판별은 제외한다.
- 도착지 입력은 카카오 우편번호 서비스로 받는다.
- 배달 현황은 외부 택배조회 API 기반으로 보여준다.
- ETA와 한 줄 근거는 GPT API로 생성한다.
- ETA는 `빠르면`과 `늦으면` 두 시점으로 보여준다.
- 송장번호 원문은 URL과 로그에 남기지 않는다.
- 광고는 입력 폼과 핵심 결과 위에 배치하지 않는다.

