# PhilMission WebApp

안드로이드 `PhilMission`의 최종 소스의 선교 자료를 사용하는 설치형 웹앱(PWA)입니다. **Flutter나 React Native가 아니라 HTML/CSS/JavaScript 웹앱**이며, Chrome과 Safari에서 같은 앱을 사용합니다.

## 휴대폰에서 사용

**GitHub Pages:** https://genej-itc.github.io/PhilMission_WebApp/

**기존 주소:** https://philmission-webapp.goodlake6.chatgpt.site

위 주소 중 하나를 휴대폰에서 엽니다. 기본 연락처를 삭제한 일반 선교 자료를 로그인 없이 공개합니다. 카카오톡·ChatGPT 안의 브라우저 대신 Android는 Chrome, iPhone은 Safari를 직접 실행해 주소를 붙여 넣으세요.

- **안드로이드:** Chrome 앱 직접 실행 → 메뉴(⋮) → 설치 및 바로가기 만들기 → 설치. 버전에 따라 앱 설치 / 홈 화면에 추가로 표시됩니다.
- **아이폰:** Safari → 공유 → 홈 화면에 추가.
- 처음에는 인터넷에 연결하고, 더보기 → 설치·오프라인에서 “기본 자료가 저장되었습니다”를 확인합니다. 이후 기본 예배·회화·전도 자료와 등록한 PDF·사진을 오프라인으로 읽을 수 있습니다.
- 별도의 APK/IPA, Mac, Apple 개발자 계정은 필요하지 않습니다. 설치 대상은 웹 주소입니다.

## 포함 기능

예배문·기도문 4종, 찬양 2곡과 코드·YouTube, 회화 50문장과 검색·분류·즐겨찾기·크게 보기, 복음 카드 5장과 연결 성경·영접 기도, 가정심방 말씀, 사용자 찬양·말씀·선교 일정·예배 순서, 연락처 수정·추가·전화·복사, 글자 크기 3단계와 화면 유지, 파일을 포함한 JSON 백업·복원.

PDF는 앱 안에서 페이지 이동·확대할 수 있습니다. 일정은 PDF, 나머지 자료는 PDF/JPG/PNG를 등록합니다. 일정과 예배 순서는 사용자가 직접 등록하며, 기본 파일을 끼워 넣지 않습니다. 파일은 한 개당 최대 50MB입니다. 비밀번호가 걸린 PDF는 등록 전에 해제해야 합니다.

## 웹에서 달라지는 기능

회화 탭의 **Google 번역 열기**를 누르면 한국어 → 현재 선택한 따갈로그어 또는 영어로 Google 번역 웹페이지가 새 창으로 열립니다. Android·iPhone 모두 번역 앱을 설치하지 않아도 브라우저에서 사용할 수 있으며 인터넷 연결이 필요합니다. Android APK의 ML Kit 기기 내 번역과는 다른 방식이며, 기본 정적 배포에는 앱 내부 자동 번역 서버가 없습니다.

화면 켜짐 유지는 Screen Wake Lock을 지원하는 브라우저에서만 동작합니다. 화면이 꺼지거나 앱이 백그라운드로 이동하면 해제될 수 있습니다. 파일·설정은 이 브라우저의 IndexedDB에 저장되며 다른 폰과 자동 동기화되지 않습니다. 브라우저 데이터 삭제/저장 공간 정리로 지워질 수 있으므로 설정 → 백업 저장을 사용하세요. 홈 화면 앱과 일반 브라우저 사이에도 저장소가 다를 수 있습니다.

## 개발 실행 (Windows 가능)

Node.js 20 이상과 Python 3을 사용합니다.

```powershell
cd C:\Claude\PRJ\PhilMission_WebApp
npm ci
npm run build
npm run dev
```

PC 브라우저: `http://localhost:4173`. `dist/index.html`을 더블클릭해서 여는 방식은 지원하지 않습니다. 개발 서버는 기본적으로 PC에서만 접속할 수 있습니다. **휴대폰에서 설치·마이크·오프라인 기능까지 확인하려면 HTTPS 배포 주소를 사용하세요.**

`public/content.json`은 기본 연락처를 삭제한 공개용 선교 자료이며 저장소에 포함됩니다. 새 PC에서도 Android 폴더 없이 빌드할 수 있습니다. `tools/sync-content.py`로 Android 자료를 갱신할 때와 빌드할 때 모두 기본 연락처를 제거하여 재포함을 방지합니다. 개인 연락처와 사용자가 등록한 파일은 각 브라우저에만 저장됩니다.

## 안드로이드·아이폰 공통 배포

`npm run build` 후 **dist 폴더 전체**를 HTTPS 정적 호스팅에 배포합니다. Netlify 수동 업로드 등에서 dist를 업로드할 수 있고, Vercel은 프로젝트 루트에서 CLI로 배포하거나 연결한 저장소의 공개용 content.json을 함께 빌드합니다. `vendor`와 `sw.js`를 제외하면 오프라인 PDF 기능이 깨집니다. `vercel.json`에 빌드 설정이 포함되어 있습니다. `tools/package.mjs`는 공유 가능한 ZIP을 만듭니다.

```powershell
npm run build
node tools/package.mjs
```

결과: `PhilMission_WebApp-dist.zip`. APK/IPA 설치 파일이 아닌 HTTPS 호스팅용 배포 파일입니다. 업데이트는 새 dist를 같은 주소에 덮어씌운 뒤 앱을 온라인으로 다시 열면 새 오프라인 캐시 준비 후 자동 적용합니다. 설치·오프라인 → 업데이트 확인에서도 확인할 수 있습니다. IndexedDB 자료는 앱 업데이트 시 유지됩니다.

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

## 설치 아이콘 재실행 오류 수정

`index.html`을 첫 화면 `/`로 이동시키는 호스팅에서 이동 응답을 캐시했다가 반환하면 Chrome이 `ERR_FAILED`를 발생시킵니다. 정규 첫 화면을 캐시하고 이동 응답을 정규화하도록 수정했습니다. 서비스 워커 코드가 바뀌면 캐시 버전도 바뀌고 새 캐시 준비 후 즉시 활성화되어 이전 캐시를 정리합니다. 브라우저 자료 삭제 없이 업데이트할 수 있습니다.

## GitHub Pages 자동 배포

`.github/workflows/pages.yml`이 main 브랜치 푸시 때마다 의존성 설치 → 자료 검증 → dist 빌드 → GitHub Pages 배포를 수행합니다. 저장소 Settings → Pages의 Source는 GitHub Actions입니다. Actions 탭에서 수동 실행도 가능합니다. GitHub Pages는 별도 로그인 없이 사용할 수 있는 정적 호스팅 주소입니다.

설치 안내는 주소에 맞춰 `설치안내_기존배포.txt` 또는 `설치안내_GitHub배포.txt`를 전달하면 됩니다. TXT는 앱을 담은 설치 파일이 아니라 접속 주소와 설치 방법을 안내합니다. 저장소의 소스 열람 주소와 실제 앱 주소는 서로 다릅니다.

두 배포 주소의 개인 자료는 브라우저에서 서로 다른 저장 공간을 사용합니다. 주소를 바꾸면 기존 앱에서 설정 → 백업 저장을 한 뒤 새 앱에서 백업 복원으로 자료를 옮기세요. 기존 주소도 계속 사용할 수 있습니다. 어느 주소도 영구 가동을 보장하지는 않으며, GitHub Pages는 기존 호스팅과 별도로 제공하는 대체 접속 경로입니다.
