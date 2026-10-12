# PhilMission WebApp

안드로이드 `PhilMission`의 최종 소스와 동일한 선교 자료를 사용하는 설치형 웹앱(PWA)입니다. **Flutter나 React Native가 아니라 HTML/CSS/JavaScript 웹앱**이며, Chrome과 Safari에서 같은 앱을 사용합니다.

## 휴대폰에서 사용

HTTPS로 배포한 주소를 휴대폰에서 엽니다.

- **안드로이드:** Chrome → 메뉴(⋮) → 앱 설치 / 홈 화면에 추가.
- **아이폰:** Safari → 공유 → 홈 화면에 추가.
- 처음에는 인터넷에 연결하고, 더보기 → 설치·오프라인에서 “기본 자료가 저장되었습니다”를 확인합니다. 이후 기본 예배·회화·전도 자료와 등록한 PDF·사진을 오프라인으로 읽을 수 있습니다.
- 별도의 APK/IPA, Mac, Apple 개발자 계정은 필요하지 않습니다. 설치 대상은 웹 주소입니다.

## 포함 기능

예배문·기도문 4종, 찬양 2곡과 코드·YouTube, 회화 50문장과 검색·분류·즐겨찾기·크게 보기, 복음 카드 5장과 연결 성경·영접 기도, 가정심방 말씀, 사용자 찬양·말씀·선교 일정·예배 순서, 연락처 수정·추가·전화·복사, 글자 크기 3단계와 화면 유지, 파일을 포함한 JSON 백업·복원.

PDF는 앱 안에서 페이지 이동·확대할 수 있습니다. 일정은 PDF, 나머지 자료는 PDF/JPG/PNG를 등록합니다. 일정과 예배 순서는 사용자가 직접 등록하며, 기본 파일을 끼워 넣지 않습니다. 파일은 한 개당 최대 50MB입니다. 비밀번호가 걸린 PDF는 등록 전에 해제해야 합니다.

## 웹에서 달라지는 기능

**음성 통역은 Android ML Kit와 동일하지 않습니다.** 브라우저 음성 인식은 기기·브라우저·언어 지원에 따라 달라지고 보통 인터넷이 필요합니다. 인식 불가 시 문장을 직접 입력할 수 있습니다. 내장 문장과 정확히 일치하면 오프라인 번역합니다. 임의 문장은 Google 번역 열기로 연결하거나 아래의 선택적 번역 서버를 설정합니다. 기본 정적 배포에는 자동 번역 서버가 없습니다.

화면 켜짐 유지는 Screen Wake Lock을 지원하는 브라우저에서만 동작합니다. 화면이 꺼지거나 앱이 백그라운드로 이동하면 해제될 수 있습니다. 파일·설정은 이 브라우저의 IndexedDB에 저장되며 다른 폰과 자동 동기화되지 않습니다. 브라우저 데이터 삭제/저장 공간 정리로 지워질 수 있으므로 설정 → 백업 저장을 사용하세요. 홈 화면 앱과 일반 브라우저 사이에도 저장소가 다를 수 있습니다.

## 개발 실행 (Windows 가능)

Node.js 20 이상과 Python 3을 사용합니다.

```powershell
cd C:\Claude\PRJ\PhilMission_WebApp
npm ci
python tools/sync-content.py
npm run build
npm run dev
```

PC 브라우저: `http://localhost:4173`. `dist/index.html`을 더블클릭해서 여는 방식은 지원하지 않습니다. 개발 서버는 기본적으로 PC에서만 접속할 수 있습니다. **휴대폰에서 설치·마이크·오프라인 기능까지 확인하려면 HTTPS 배포 주소를 사용하세요.**

`public/content.json`은 Android 자산을 그대로 복사하며, 개인 자료이므로 Git에서는 제외합니다. 이 파일이 없으면 빌드할 수 없습니다. Android 폴더가 없는 PC에서는 해당 파일을 안전하게 별도로 전달받아 같은 위치에 넣습니다. 공개 Git 저장소에 선교 문서·연락처를 무심코 올리지 않도록 주의하세요. 배포물에는 실제 내용이 포함되므로 배포 주소의 접근 범위도 확인해야 합니다.

## 안드로이드·아이폰 공통 배포

`npm run build` 후 **dist 폴더 전체**를 HTTPS 정적 호스팅에 배포합니다. Netlify 수동 업로드 등에서 dist를 업로드할 수 있고, Vercel은 프로젝트 루트에서 CLI로 배포하거나 연결한 저장소에 비공개 content.json을 안전하게 공급하여 빌드합니다. `vendor`와 `sw.js`를 제외하면 오프라인 PDF 기능이 깨집니다. `vercel.json`에 빌드 설정이 포함되어 있습니다. `tools/package.mjs`는 공유 가능한 ZIP을 만듭니다.

```powershell
npm run build
node tools/package.mjs
```

결과: `PhilMission_WebApp-dist.zip`. APK/IPA 설치 파일이 아닌 HTTPS 호스팅용 배포 파일입니다. 업데이트는 새 dist를 같은 주소에 덮어씌운 뒤 앱 → 설치·오프라인 → 업데이트 확인에서 적용합니다. IndexedDB 자료는 앱 업데이트 시 유지됩니다.

## 선택적 자동 번역 서버

`tools/server.mjs`는 같은 주소의 `/api/translate`를 제공합니다. Google Cloud Translation Basic API를 활성화하고 서버 환경변수 `GOOGLE_TRANSLATE_API_KEY`를 설정하면 임의 문장 번역이 연결됩니다. 키를 public/src/dist 또는 Git에 넣지 마세요. 환경변수는 서비스를 실행하는 서버에만 설정합니다. API 사용 비용이 발생할 수 있으므로 Google Cloud에서 키의 API 제한과 할당량을 설정해야 합니다.

서버는 요청당 3,000자, IP별 분당 20회, 프로세스 전체 기본 200회 제한이 있습니다. `TRANSLATE_REQUEST_LIMIT`로 프로세스 한도를 바꿀 수 있습니다. 재시작하면 한도가 초기화되므로 제공자 측 할당량을 함께 사용하세요. 정적 호스팅에 이 Node 서버가 자동 배포되지는 않습니다. 번역 서버를 사용할 경우 HTTPS 리버스 프록시 뒤에서 정적 파일과 API를 동일 출처로 제공합니다. 단순 정적 배포도 기본 자료와 Google 번역 연결은 동작합니다.

## 검증

```powershell
npm test
npx playwright install chromium webkit
npm run dev
# 다른 터미널
npm run test:e2e
```

Android Chrome 크기와 iPhone WebKit 크기의 자동 테스트에서 자료 열기, 언어 전환, 즐겨찾기/연락처 유지, 이미지·2페이지 PDF 등록/열기, 백업·복원을 검증합니다. Android Chrome에서는 오프라인 재접속도 통과했습니다. Windows Playwright WebKit은 네트워크 단절 후 재시작 시 엔진 내부 오류가 있어 Safari에서는 캐시 준비와 로컬 자료 열기까지 검증했습니다. 실제 아이폰의 오프라인 재시작은 추가 확인이 필요합니다. 이는 실제 아이폰의 설치·마이크 검증을 대신하지 않습니다. 세부 범위는 FEATURE_PARITY.md를 참고하세요.
