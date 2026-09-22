# Namhoon Kim — academic website

Scholarly를 바탕으로 만든 Astro 정적 사이트입니다. 메뉴는 Home, Projects, CV 세 개이며 기본 공개 주소는 `https://etoilekim.github.io`로 설정되어 있습니다.

## 로컬 실행

Node.js 24와 pnpm을 사용합니다.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

터미널에 표시되는 로컬 주소를 여세요. 전체 검증 및 배포용 빌드:

```sh
pnpm verify
pnpm preview
```

## 내용 수정

| 내용 | 파일 |
| --- | --- |
| 이름, 소속, 이메일, 프로필 링크, 사이트 주소 | `site.config.ts` |
| Home 소개와 연구 방향 | `src/pages/index.astro` |
| 프로젝트 설명·저자·학회·외부 링크 | `src/data/projects.ts` |
| 사진과 연구 그림 | `public/images/` |
| CV 원본 | `public/files/CV_Namhoon_Kim.pdf` |
| 디자인 | `src/styles/personal.css` |

CV를 업데이트할 때는 같은 이름으로 PDF를 교체하면 됩니다. PDF.js가 원본을 렌더링하므로 HTML로 다시 작성할 필요가 없습니다. 텍스트 선택, 문서 내 링크, 확대/축소, 너비 맞춤, 다운로드를 지원합니다. Home과 Projects는 JavaScript 없이도 내용을 읽을 수 있습니다.

워크숍 버전은 관련 정규 논문과 같은 연구 항목에 표시합니다. 현재 4개 연구 항목에 1저자·공동 1저자 논문 6편을 반영했습니다. 새 항목을 `projects` 배열에 추가하면 Projects에 표시되며, 앞의 두 항목이 Home의 Selected projects에 표시됩니다.

## GitHub Pages 배포

공개 주소: **https://etoilekim.github.io/**

- `main`: Astro 소스
- `gh-pages`: 검증을 마친 정적 사이트
- Pages 설정: **Deploy from a branch → gh-pages → /(root)**

사이트의 일반 내용을 수정한 뒤 커밋·push하고 배포하세요.

```sh
git add <수정한-파일>
git commit -m "Update website"
git push origin main
pnpm deploy
```

`pnpm deploy`는 먼저 최신 `main`을 받아 `pnpm verify`를 실행하고, 임시 checkout에서 `gh-pages`를 갱신합니다. 강제 push를 하지 않습니다. 사이트 소스에 미커밋 변경이 있으면 중단하므로 먼저 검토·커밋하세요.

## iCloud CV 자동 업데이트

이 사이트 소유자의 Mac에서 Codex 자동화가 지정된 iCloud `CV_Namhoon_Kim.pdf`를 15분마다 확인합니다. **컴퓨터가 켜져 있고 Codex가 실행 중이며, iCloud 파일이 Mac에 동기화되어 있어야 합니다.** 같은 파일명·경로에 PDF를 교체하면 됩니다. 다른 파일이나 폴더는 업로드하지 않습니다.

`sync_cv.py`는 PDF 형식과 파일 저장 완료 여부를 확인한 뒤 GitHub의 원본/게시 브랜치 두 PDF만 비교·갱신합니다. 바뀌지 않았다면 커밋하지 않습니다. GitHub CLI의 기존 로그인을 사용하며 인증 토큰을 저장소에 보관하지 않습니다. Pages 반영과 캐시 갱신에는 추가로 몇 분이 걸릴 수 있습니다.

수동 확인과 실행:

```sh
python3 -m pip install -r scripts/requirements-cv.txt
python3 scripts/sync_cv.py --source "/path/to/CV_Namhoon_Kim.pdf"
python3 scripts/sync_cv.py --source "/path/to/CV_Namhoon_Kim.pdf" --apply
```

첫 명령은 확인만 하고, `--apply`를 붙였을 때 실제 게시합니다. `main`의 PDF도 원격에서 업데이트되므로 다음 로컬 편집 전 `git pull --ff-only`로 최신 상태를 받아오세요. 자동화는 Codex의 Scheduled/자동화 화면에서 중지할 수 있습니다.

동기화 코드 검증:

```sh
python3 -m unittest discover -s scripts -p 'test_sync_cv.py'
```

## 출처

- [Scholarly / astro-theme-scholars](https://github.com/jxpeng98/astro-theme-scholars): MIT. 원본 저작권 고지는 `LICENSE`에 보존했습니다.
- [PDF.js](https://mozilla.github.io/pdf.js/): Apache-2.0. 문서 렌더링에 사용합니다.
- 소개·논문·이미지의 근거는 [CONTENT_SOURCES.md](CONTENT_SOURCES.md)에 정리했습니다.
- GitHub Pages 설정은 [Astro 공식 가이드](https://docs.astro.build/en/guides/deploy/github/)를 따릅니다.

CV, 인물 사진, 연구 그림은 사이트 코드의 MIT 라이선스로 재허가하지 않습니다. 각 원저작물의 권리가 유지됩니다.
