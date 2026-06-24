# 부산 축제 정보 웹사이트 구현 계획 (Next.js & Tailwind CSS v4)

이 프로젝트는 부산광역시 축제 서비스 API를 기반으로, 사용자들에게 부산의 다채롭고 활기찬 축제 정보를 한눈에 보여주는 인터랙티브 가이드를 구축하는 것을 목표로 합니다. 

Next.js의 App Router와 최신 Tailwind CSS v4를 활용하여 뛰어난 속도, 애니메이션, SEO 최적화를 특징으로 하는 모던하고 고급스러운 디자인의 단일 페이지 애플리케이션(SPA)으로 개발합니다.

## User Review Required

> [!IMPORTANT]
> **시스템 환경 설치**
> - 현재 작업 시스템에 Node.js 및 npm이 설치되어 있지 않습니다.
> - 따라서 `scoop install nodejs-lts` 명령어를 통해 최신 LTS 버전을 설치한 후 Next.js 프로젝트 개발을 진행합니다.
> - 사용자 동의 후 이 환경 구축 및 개발 작업을 진행하도록 하겠습니다.

> [!NOTE]
> **지도 라이브러리 선택**
> - 축제 위치(위도, 경도)를 시각화하기 위해 별도의 상용 API 키(카카오, 네이버) 발급 절차가 필요 없는 **Leaflet**(React-Leaflet) 라이브러리를 사용합니다.
> - 오픈스트리트맵(OSM) 타일을 활용하여 무료로 구동되므로 추가 키 발급 절차가 없어 편리합니다.

## Proposed Changes

### 1. 환경 및 라이브러리 셋업
- Node.js 설치 (`scoop install nodejs-lts`)
- Next.js 프로젝트 생성 (`npx create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`)
- 의존성 라이브러리 설치:
  - Lucide React (`lucide-react`): 아름다운 아이콘 사용
  - Framer Motion (`framer-motion`): 고급스러운 마이크로 인터랙션 및 카드 슬라이드 효과
  - Leaflet / React Leaflet (`leaflet`, `react-leaflet`, `@types/leaflet`): 인터랙티브 지도 구현

---

### 2. 컴포넌트 설계 및 구현

#### [NEW] [src/types/festival.ts](file:///c:/Users/김정섭/Documents/work/src/types/festival.ts)
- API 데이터 타입을 정의합니다 (`FestivalItem` 인터페이스 설계).
- 응답 구조인 `getFestivalKr` 래퍼 타입을 포함합니다.

#### [NEW] [src/components/Header.tsx](file:///c:/Users/김정섭/Documents/work/src/components/Header.tsx)
- 헤더 컴포넌트: 네비게이션, 서비스 타이틀, 라이트/다크 모드 또는 고정 테마 토글.
- 부산의 바다와 빛을 형상화한 유리 모피즘(Glassmorphism)과 그라디언트 텍스트 스타일 적용.

#### [NEW] [src/components/FestivalCard.tsx](file:///c:/Users/김정섭/Documents/work/src/components/FestivalCard.tsx)
- 축제 카드 컴포넌트: 이미지 썸네일, 타이틀(한글 정제), 구군(지역), 일시, 요금 정보를 축약하여 보여주는 카드형 UI.
- 마우스 오버 시 미세한 줌인 효과와 은은한 그림자(glow) 트랜지션 추가.

#### [NEW] [src/components/FestivalDetail.tsx](file:///c:/Users/김정섭/Documents/work/src/components/FestivalDetail.tsx)
- 축제 상세 정보 모달: 카드 클릭 시 표시.
- 전체 설명 (`ITEMCNTNTS`), 교통수단 정보 (`TRFC_INFO`), 문의처 (`CNTCT_TEL`), 공식 사이트 연결 링크 (`HOMEPAGE_URL`), 휠체어 접근 여부 등 상세 편의 정보 제공.

#### [NEW] [src/components/FestivalMap.tsx](file:///c:/Users/김정섭/Documents/work/src/components/FestivalMap.tsx)
- 축제의 위치를 보여주는 인터랙티브 지도 컴포넌트.
- 현재 선택되거나 필터링된 축제들의 핀(Marker)을 지도에 꽂아 보여주고, 마커 클릭 시 간략 정보 팝업 제공.
- SSR로 인한 Leaflet 로딩 에러 방지를 위해 `dynamic` import(SSR: false) 적용.

#### [NEW] [src/components/FilterSection.tsx](file:///c:/Users/김정섭/Documents/work/src/components/FilterSection.tsx)
- 축제 검색어 입력창.
- 구군별(예: 수영구, 해운대구, 영도구 등) 필터 드롭다운/버튼 그룹.
- 개최 월별 필터링 기능.

#### [MODIFY] [src/app/page.tsx](file:///c:/Users/김정섭/Documents/work/src/app/page.tsx)
- 메인 대시보드 페이지.
- 서버 사이드에서 부산 축제 API 데이터를 페칭하여 하위 클라이언트 컴포넌트로 전달하거나, NextJS Route Handler를 구축하여 동적 검색/필터링을 부드럽게 구현.
- SEO 메타데이터와 페이지 구조화 완료.

#### [MODIFY] [src/app/globals.css](file:///c:/Users/김정섭/Documents/work/src/app/globals.css)
- Tailwind CSS v4 스타일 토큰 정의.
- 백그라운드 애니메이션, 스크롤바 디자인, 맵 컴포넌트 기본 스타일 적용.

---

### 3. Vercel 배포 준비
- `vercel.json` 및 빌드 설정을 위한 Next.js 구성 파일 (`next.config.ts` 등) 점검.
- API 호출 시 타임아웃 및 SSL 오류 방지를 위해 캐싱 정책(fetch cache) 설정.

## Verification Plan

### Automated Tests
- `npm run build`를 실행하여 Next.js 빌드가 오류 없이 통과하는지 확인.
- ESLint 검사를 통해 타입오류 및 안티패턴 제거.

### Manual Verification
- 브라우저 서브에이전트 또는 로컬 호스트 테스트를 통해 다음 사항 검증:
  - 축제 리스트 카드 렌더링 및 클릭 시 상세 정보 모달 열림 검증.
  - 검색어 입력, 구군 필터링, 월 필터링 작동 여부 검증.
  - 지도 컴포넌트에 축제 위치 마커들이 올바르게 렌더링되고 작동하는지 검증.
  - Vercel 배포 환경과 동일한 프로덕션 빌드 실행 후 렌더링 확인.
