# 📖 TravelAlbum (트래블 앨범)

> **당신의 소중한 여행 기억을 한 권의 감성 포토북으로 엮어보세요.**  
> Next.js 16 (Turbopack) & React 19 기반의 반응형 디지털 여행 앨범 제작 서비스입니다.

---

## ✨ 주요 기능 (Key Features)

### 1. 🎨 3가지 무드의 감성 표지 템플릿
- **미니멀 에디토리얼 (Minimal Editorial)**: 정제된 세리프 타이포그래피와 여백의 미가 돋보이는 모던 감성
- **시티 매거진 (City Magazine)**: 생동감 넘치는 볼드 헤드라인과 메인 와이드 비주얼 레이아웃
- **소프트 다이어리 (Soft Diary)**: 따뜻하고 아기자기한 여행 일기장 감성의 필기체 디자인

### 2. ⚡ Canvas 기반 고효율 실시간 이미지 압축
- 장당 3~5MB의 고화질 스마트폰 사진도 브라우저 Canvas를 통해 실시간으로 1200px 리사이징 및 0.78 JPEG 품질로 자동 최적화
- 장당 80~150KB 수준으로 경량화하여 브라우저 LocalStorage 한도(5MB) 초과 없이 수십 장의 사진을 안전하게 저장

### 3. 📸 사진 수별 반응형 스마트 콜라주 그리드
- 업로드된 사진 수에 맞춰 최적의 레이아웃을 자동 구성:
  - **1장**: 여백을 살린 시선 집중 풀 프레임
  - **2장**: 좌우 균형 잡힌 2열 세로 대칭 레이아웃
  - **3장**: 상단 와이드 하이라이트 + 하단 2열 정방형 배치
  - **4장**: 정갈한 2x2 정방형 그리드
  - **5장 이상**: 2x2 정방형 그리드 + 4번째 사진에 반투명 딤 & `+N` 오버레이 배지 노출

### 4. ✍️ 텍스트 전용 에세이 페이지
- 사진을 업로드하지 않은 글 중심의 기록(순간)은 표지 사진을 중복 렌더링하지 않고, 따뜻한 종이 질감 배경과 큰따옴표 장식이 가미된 감성 에세이 템플릿으로 자동 변환

### 5. 📖 몰입감 넘치는 앨범 북 뷰어 (Book Viewer)
- 실제 종이 책을 넘기는 듯한 부드러운 페이지 전환 애니메이션
- 키보드 방향키(`←`, `→`), 하단 내비게이션, 모바일 터치 스와이프 제스처 전면 지원
- 전체화면 토글 기능 제공

### 6. 🔗 무서버 URL 독립 공유 (Serverless Share)
- 서버나 데이터베이스 없이도 현재 앨범 데이터(표지 템플릿, 제목, 여행 순간들)를 안전한 Base64 URI로 압축 인코딩
- 생성된 공유 링크(`?share=...`)를 다른 사람에게 전달하면, 받는 사람의 브라우저에서 동일한 앨범을 즉시 열람 가능

---

## 🛠️ 기술 스택 (Tech Stack)

- **Framework**: [Next.js 16.3.3](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React 19.2.8](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Testing**: [Playwright 1.62](https://playwright.dev/) (E2E & Persona Stress Test)
- **Icons**: Lucide React Icons
- **Language**: TypeScript 5

---

## 🚀 시작하기 (Getting Started)

### 1. 패키지 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.

### 3. 프로덕션 빌드
```bash
npm run build
npm run start
```

---

## 🧪 테스트 실행 (Testing)

### 정적 분석 (Lint)
```bash
npm run lint
```

### 전체 E2E 및 페르소나 테스트 실행
```bash
# 기본 E2E 테스트
npx playwright test

# 5가지 여행자 페르소나 심층 테스트 (제주, 유럽, 다낭, 뉴욕, 교토)
npx playwright test "persona" --project=chromium

# 5회 연속 반복 스트레스 테스트 (25회 전수 통과)
npx playwright test "persona_[1-5]" --project=chromium --repeat-each=5
```

---

## 📁 프로젝트 구조 (Directory Structure)

```
travelalbum/
├── .github/workflows/       # CI 워크플로우 (Playwright 자동화)
├── src/
│   ├── app/
│   │   ├── album/           # 앨범 북 뷰어 페이지 (/album)
│   │   ├── record/          # 여행 타임라인 기록 페이지 (/record)
│   │   ├── layout.tsx       # 글로벌 레이아웃 & TravelProvider
│   │   └── page.tsx         # 표지 에디터 메인 홈 (/)
│   ├── components/
│   │   ├── album/           # 북 뷰어, 콜라주, 에세이, 인트로/아웃트로 컴포넌트
│   │   ├── cover/           # 표지 미리보기 및 실시간 편집 패널
│   │   └── record/          # 타임라인 대시보드 및 순간 등록/수정 모달
│   ├── context/
│   │   └── TravelContext.tsx # 전역 상태 관리 & LocalStorage/공유 URL 동기화
│   ├── types/               # TypeScript 인터페이스 정의
│   └── utils/
│       └── imageCompressor.ts # Canvas 기반 이미지 리사이징 & 압축 엔진
└── tests/                   # Playwright E2E & 페르소나 테스트 스위트
    └── fixtures/images/     # 테스트용 실제 이미지 파일 세트
```

---

## 📄 라이선스 (License)

This project is licensed under the MIT License.
