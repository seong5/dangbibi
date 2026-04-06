# PRD — 당비비 (dangbibi)

> 소방공무원·경찰공무원의 근무 패턴을 확인하는 모바일 최적화 웹 서비스

---

## 1. 서비스 핵심 목적

소방공무원·경찰공무원이 **근무 패턴을 달력/주간 뷰로 빠르게 확인**하고, 연차·반차 등 개인 일정을 반영할 수 있는 모바일 최적화 웹 서비스.

---

## 2. 타겟 유저

| 유저       | 설명                                                         |
| ---------- | ------------------------------------------------------------ |
| 소방공무원 | 당직→비번→비번 3일 사이클 패턴                               |
| 경찰공무원 | 주간→야간→비번→휴무 4일 사이클 패턴                          |
| 공통       | 스마트폰으로 오늘/이번 주 근무를 빠르게 확인하고 싶은 사용자 |

---

## 3. 근무 패턴 정의

| 직종 | 패턴                      | 사이클   |
| ---- | ------------------------- | -------- |
| 소방 | 당직 → 비번 → 비번        | 3일 반복 |
| 경찰 | 주간 → 야간 → 비번 → 휴무 | 4일 반복 |

---

## 4. MVP 기능

- 직종(소방/경찰) 및 소속 조 선택
- 기준일 설정 (특정 날짜 기점으로 패턴 자동 계산)
- **오늘 근무 상태 카드** (홈 상단)
- **주간 뷰** — 이번 주 7일 근무 상태 확인, 이전·다음 주 이동
- **월간 달력 뷰** — 당직/비번/주간/야간/휴무 색상 구분, 이전·다음 월 이동
- **연차·반차·병가·특근 입력/수정/삭제** — 날짜 클릭 시 오버라이드
- 설정 로컬 저장 (브라우저 `localStorage`)

## 추후 확장

- 로그인/회원가입 (서버 동기화)
- 근무 일정 알림 (로컬 노티)
- 동료와 일정 공유
- 공휴일 연동

---

## 5. 핵심 유저 플로우

```
첫 진입 (온보딩)
  └─ 직종 선택 (소방 / 경찰)
       └─ 소속 조 선택 (1조 / 2조 / 3조)
            └─ 기준일 설정 (이 날짜에 어떤 근무였는지)
                 └─ 홈 화면
                      ├─ 오늘 근무 상태 카드
                      ├─ 주간 뷰 (이번 주 7일)
                      └─ 월간 달력 뷰
                           └─ 날짜 클릭 → 연차 등 오버라이드 입력
```

---

## 6. 기술 스택

| 영역      | 기술                            |
| --------- | ------------------------------- |
| 번들러    | Vite                            |
| UI        | React + TypeScript              |
| 라우팅    | React Router v7                 |
| 스타일    | Tailwind CSS v4                 |
| 패키지    | pnpm                            |
| 상태 관리 | useState / useReducer + Context |
| 영속성    | localStorage                    |
| 날짜 계산 | date-fns                        |

---

## 7. FSD 디렉터리 구조

```
src/
├── app/
│   ├── App.tsx
│   ├── providers/
│   └── styles/
│
├── pages/
│   ├── home/
│   │   ├── ui/HomePage.tsx       # 오늘 카드 + 주간 뷰
│   │   └── index.ts
│   ├── calendar/
│   │   ├── ui/CalendarPage.tsx   # 월간 달력 뷰
│   │   └── index.ts
│   └── onboarding/
│       ├── ui/OnboardingPage.tsx # 직종·조·기준일 설정
│       └── index.ts
│
├── widgets/
│   ├── week-view/
│   └── month-calendar/
│
├── features/
│   ├── schedule-setup/           # 직종·조·기준일 입력 폼
│   ├── shift-navigation/         # 월/주 이동
│   └── override-edit/            # 연차 등 입력·수정·삭제 모달
│
├── entities/
│   ├── shift/
│   │   ├── model/
│   │   │   ├── shiftTypes.ts
│   │   │   └── shiftCalculator.ts
│   │   └── index.ts
│   └── user-setting/
│       ├── model/userSetting.ts
│       └── index.ts
│
└── shared/
    ├── ui/
    ├── lib/
    │   ├── date.ts
    │   └── storage.ts
    └── config/
        └── shiftPatterns.ts
```

---

## 8. 라우팅

| 경로          | 페이지                   |
| ------------- | ------------------------ |
| `/`           | 홈 (오늘 카드 + 주간 뷰) |
| `/calendar`   | 월간 달력                |
| `/onboarding` | 첫 설정 (직종·조·기준일) |
| `/settings`   | 설정 변경 (추후)         |

---

## 9. 데이터 모델

### UserSetting (localStorage)

```ts
interface UserSetting {
  jobType: 'fire' | 'police'
  teamName: string // '1조' | '2조' | ...
  baseDate: string // 'YYYY-MM-DD'
  baseShiftIndex: number // 기준일의 cycle 내 인덱스
}
```

### ShiftPatterns

```ts
const SHIFT_PATTERNS = {
  fire: { cycle: ['당직', '비번', '비번'] },
  police: { cycle: ['주간', '야간', '비번', '휴무'] },
}
```

### ShiftOverride (localStorage)

```ts
type OverrideType = '연차' | '반차(오전)' | '반차(오후)' | '병가' | '특근'

interface ShiftOverride {
  date: string
  overrideType: OverrideType
  memo?: string
}
// 저장 형태: Record<string, ShiftOverride>  (key = 'YYYY-MM-DD')
```

### 근무 계산 공식

```
index = ((날짜 - baseDate)의 일수 + baseShiftIndex) % cycle.length
shiftType = cycle[index]

// 오버라이드가 있으면 패턴 계산 결과보다 우선 적용
```

### UI 색상

| 근무 타입       | 색상            |
| --------------- | --------------- |
| 당직            | `bg-red-400`    |
| 비번            | `bg-blue-300`   |
| 주간            | `bg-yellow-400` |
| 야간            | `bg-indigo-400` |
| 휴무            | `bg-gray-300`   |
| 연차            | `bg-green-400`  |
| 반차(오전/오후) | `bg-green-200`  |
| 병가            | `bg-orange-300` |
| 특근            | `bg-purple-400` |

---

## 10. 마일스톤

| 페이즈   | 내용                           | 기간      |
| -------- | ------------------------------ | --------- |
| Phase 1  | 기반 세팅 + 온보딩 + 계산 로직 | 1~2주     |
| Phase 2  | 홈 + 주간 뷰                   | 1~2주     |
| Phase 3  | 월간 달력 + 연차 오버라이드    | 2주       |
| Phase 4  | Polish + 배포                  | 1주       |
| **합계** |                                | **5~7주** |

### Phase 1 — 기반 세팅 & 온보딩

- Vite + React + TypeScript + Tailwind CSS v4 초기 세팅
- FSD 디렉터리 구조 세팅
- `shiftCalculator` 핵심 계산 로직 구현
- `localStorage` 유틸 구현
- 온보딩 페이지 (직종·조·기준일 입력)

### Phase 2 — 홈 & 주간 뷰

- 오늘 근무 상태 카드
- 주간 뷰 위젯 (7일, 이전·다음 주 이동)
- 근무 타입별 색상 배지
- 온보딩 미완료 시 리다이렉트

### Phase 3 — 월간 달력 & 연차 오버라이드

- 월간 달력 위젯 (이전·다음 월 이동)
- 날짜 클릭 → 오버라이드 입력 모달
- 오버라이드 저장·삭제 및 뷰 즉시 반영

### Phase 4 — Polish & 배포

- 모바일 UI 전체 점검
- 설정 변경 페이지
- `pnpm lint` + `pnpm build` 통과
- Vercel / GitHub Pages 배포
