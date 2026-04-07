@AGENTS.md

## 커뮤니케이션

- 이 레포에서 작업할 때 **답변·설명·확인 질문은 모두 한국어**로 한다. 코드·명령어·라이브러리·API 이름 등 고유 명칭은 필요하면 영문 그대로 둔다.

## 프로젝트 개요

- **서비스:** 소방공무원·경찰공무원의 **근무 패턴을 확인**하는 웹 서비스.
- **플랫폼:** 브라우저 기반 **웹**이며, UI·레이아웃은 **모바일 뷰 최적화**를 기본으로 한다(반응형·터치·좁은 폭 우선).
- **스택:** **React** (Vite), React Router, pnpm, Tailwind CSS v4, TypeScript. **Next.js는 사용하지 않는다.**

## 아키텍처 (Feature-Sliced Design)

- **레이어 의존 방향:** `app` → `pages` → `widgets` → `features` → `entities` → `shared` (상위는 하위만 import; 역방향·같은 레이어 간 **슬라이스** 간 import는 지양하고, 필요하면 **public API**(`index.ts`)만 사용).
- **`app/`** — 앱 진입, 라우팅 조합(`App.tsx`), 전역 스타일·테마, 프로바이더.
- **`pages/`** — 라우트 단위 화면; 각 슬라이스는 `ui/` 등 세그먼트 + 슬라이스 루트 `index.ts`로 export.
- **`widgets/`** — 독립된 UI 블록(여러 feature 조합).
- **`features/`** — 사용자 시나리오·유즈케이스 단위.
- **`entities/`** — 도메인 엔티티·비즈니스 단위 UI·모델.
- **`shared/`** — `ui`, `lib`, `api` 등 공용 유틸·프리미티브 (도메인 무관).
- 새 코드는 위 슬라이스·세그먼트 이름을 맞추고, **한 슬라이스 바깥으로는 public export만** 노출하는 것을 원칙으로 한다. ([FSD 문서](https://feature-sliced.design/))

## 명령어 · PR 전 확인

- `pnpm dev` — 로컬 개발 서버(Vite, 기본 포트 3000)
- `pnpm build` — `tsc` 검사 후 프로덕션 번들
- `pnpm lint` — ESLint

**PR 올리기 전에** `pnpm lint`와 `pnpm build`는 통과한 상태로 올린다(가능하면 로컬에서 `pnpm dev`로 화면도 확인).

## 코딩 품질 (Red line)

- **`any` 남용 금지** — 구체 타입·`unknown`·좁히기(narrowing)·제네릭으로 표현한다.
- **`eslint-disable` / `@ts-expect-error` 등 남발 금지** — 피할 수 없을 때만 **최소 범위** 한 줄에 쓰고, **왜 필요한지** 짧은 주석을 붙인다.

## Git 커밋 컨벤션

- **제목은 한 줄**, 작업 내용을 짧게 쓴다.
- **형식:** `{prefix}/{범위}: {요약}`  
  - `prefix`: `feature` | `fix` | `chore` | `docs` | `refactor` | `test` 등  
  - `범위`(선택): 페이지·기능 단위 한 단어(예: `auth`, `home`, `api`)  
  - `요약`: 무엇을 했는지 명사형/간단한 문장으로

### 예시

- `feature/auth: 카카오 로그인 버튼 추가`
- `fix/header: 모바일에서 헤더 겹침 수정`
- `chore/deps: vite 메이저 업데이트`
- `docs/readme: 로컬 실행 방법 정리`

필요하면 **본문**에 이유·스크린샷·이슈 번호를 덧붙인다.

## Git 브랜치 (권장)

작업 브랜치도 같은 느낌으로 맞추려면 `prefix/짧은-설명` 형태(예: `feature/kakao-login`, `fix/header-overflow`).
