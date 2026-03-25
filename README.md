# 디지털 추첨기

컨퍼런스 벤더 부스용 재고 관리형 디지털 추첨 시스템.
방문객이 버튼을 클릭하면 경품 재고 내에서 랜덤하게 당첨 결과가 표시되고, 실시간으로 잔여 수량이 차감됩니다.

## 시작하기

**1. 의존성 설치**
```bash
npm install
```

**2. 환경 변수 설정**
```bash
cp .env.example .env
```
`.env` 파일을 열어 `ADMIN_PASSWORD`를 원하는 비밀번호로 변경합니다.

**3. 경품 목록 설정**
```bash
cp public/prizes.json.example data/prizes.json
```
`data/prizes.json` 파일을 열어 실제 경품 목록을 설정합니다. (아래 [경품 목록 설정](#경품-목록-설정) 참고)

**4. 개발 서버 실행**
```bash
npm run dev
```

터미널에 출력되는 네트워크 IP(예: `http://192.168.x.x:5173`)로 iPad 등 동일 Wi-Fi 기기에서 접근할 수 있습니다.

## 데이터 파일 구조

| 파일 | git 추적 | 설명 |
|------|----------|------|
| `public/prizes.json.example` | ✅ | 경품 설정 템플릿 (수정 후 `data/prizes.json`으로 복사) |
| `.env.example` | ✅ | 환경변수 템플릿 |
| `data/prizes.json` | ❌ | **실제 경품 설정** — 현장마다 별도 관리 |
| `data/state.json` | ❌ | 추첨 진행 상태 (잔여 수량, 당첨 이력) — 서버가 자동 생성 |
| `.env` | ❌ | 실제 환경변수 (비밀번호 등) |

`data/` 폴더 전체가 gitignore 대상이므로 Railway 배포 시 **볼륨 1개(`/app/data`)** 만 마운트하면 두 파일이 모두 유지됩니다.

## 경품 목록 설정

`data/prizes.json`은 **git에서 제외**되어 있습니다. 이벤트 장소마다 독립적으로 관리하기 위해서입니다.
예제 파일을 복사한 뒤 수정하세요.

```bash
cp public/prizes.json.example data/prizes.json
```

파일이 없으면 서버 시작 시 `prizes.json.example`을 자동으로 복사합니다. 수정 후 서버를 재시작하면 반영됩니다.

```json
[
  { "id": 1, "name": "1등 경품", "total": 2  },
  { "id": 2, "name": "2등 경품", "total": 5  },
  { "id": 3, "name": "3등 경품", "total": 10 },
  { "id": 4, "name": "참가상",   "total": 30 },
  { "id": 5, "name": "그냥줌",   "total": 50 }
]
```

### 필드 설명

| 필드 | 설명 |
|------|------|
| `id` | 고유 번호. 각 항목마다 달라야 하며 변경하지 않는 것을 권장 |
| `name` | 화면에 표시될 경품 이름 |
| `total` | 준비된 총 수량. 수량이 많을수록 당첨 확률이 높아짐 |

### 당첨 확률

가중치는 `total` 값으로 자동 계산됩니다.
예) 위 설정의 전체 합계 = 97

| 경품 | 수량 | 당첨 확률 |
|------|-----:|----------:|
| 1등 경품 | 2 | 2/97 ≈ 2% |
| 2등 경품 | 5 | 5/97 ≈ 5% |
| 3등 경품 | 10 | 10/97 ≈ 10% |
| 참가상 | 30 | 30/97 ≈ 31% |
| 그냥줌 | 50 | 50/97 ≈ 52% |

### 주의사항

- `id: 1` 항목이 1등으로 인식되어 **그랜드 팡파르**가 재생됩니다.
- 경품 목록을 완전히 초기화하려면 `/admin` 페이지의 **전체 초기화** 버튼을 사용하세요.

## 관리자 인증

관리자 비밀번호는 코드에 하드코딩되지 않고 **`.env` 파일**에서 읽어옵니다.

```
# .env
ADMIN_PASSWORD=your_password_here
```

- `.env` 파일은 `.gitignore`에 포함되어 있어 저장소에 커밋되지 않습니다.
- `.env.example`을 참고해 `.env`를 직접 생성하세요.
- `ADMIN_PASSWORD`가 설정되지 않으면 서버 시작 시 경고가 출력되고 관리자 기능이 비활성화됩니다.

## 배포

### 빌드

```bash
npm run build              # React 앱을 dist/ 폴더로 빌드
NODE_ENV=production npm start  # Express가 dist/ 정적 파일 + API를 함께 서빙
```

프로덕션에서는 Vite dev server 없이 Express 단독으로 실행됩니다.

### 권장 배포 플랫폼

Express + 파일 시스템을 수정 없이 그대로 배포할 수 있는 플랫폼입니다.

| 플랫폼 | 특징 | 무료 티어 |
|--------|------|-----------|
| **Railway** | git push 시 자동 배포, 설정 최소 | 있음 |
| **Render** | Railway와 유사, 무료 시 15분 후 슬립 | 있음 |
| **Fly.io** | 글로벌 엣지 배포, CLI 기반 | 있음 |
| **Linux 서버 (VPS)** | 직접 제어, PM2로 프로세스 관리 | — |

#### Railway 상세 배포 절차

##### 사전 준비

- GitHub 저장소에 코드 push 완료
- [railway.app](https://railway.app) 계정 생성 (GitHub 계정으로 로그인 가능)

##### 1단계 — GitHub 저장소 연결

1. Railway 대시보드 → **New Project**
2. **Deploy from GitHub repo** 선택
3. 저장소 검색 후 선택 → **Deploy Now**

Railway가 `railway.toml`을 감지해 자동으로 아래 순서로 실행합니다:
```
npm install  →  npm run build  →  npm start
```

##### 2단계 — 환경 변수 설정

서비스 클릭 → **Variables** 탭 → **New Variable**

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `ADMIN_PASSWORD` | 실제 비밀번호 | 관리자 페이지 인증 |
| `NODE_ENV` | `production` | 프로덕션 모드 활성화 |

##### 3단계 — 볼륨 마운트 (데이터 영속성)

볼륨 없이 배포하면 **재배포할 때마다** 경품 잔여 수량과 당첨 이력이 초기화됩니다.

서비스 클릭 → **Volumes** 탭 → **Create Volume** → 마운트 경로 입력:

| 마운트 경로 | 보존되는 데이터 |
|-------------|----------------|
| `/app/data` | `prizes.json` (경품 설정) + `state.json` (잔여 수량, 당첨 이력) |

볼륨 **1개**로 두 파일을 모두 관리합니다.

##### 4단계 — prizes.json 설정

볼륨을 마운트한 뒤, 서비스의 **Deploy** 탭에서 **Shell** 버튼으로 컨테이너에 접속합니다.

```bash
# prizes.json.example 내용 확인
cat public/prizes.json.example

# data/prizes.json 으로 복사
cp public/prizes.json.example data/prizes.json

# 실제 경품 목록으로 편집
vi data/prizes.json
```

> `data/prizes.json`이 없으면 서버 시작 시 `prizes.json.example`을 자동으로 복사합니다.
> 볼륨 없이는 재배포 시 초기화되므로 반드시 `/app/data` 볼륨을 마운트한 뒤 수정하세요.

##### 5단계 — 도메인 확인 및 접속

서비스 → **Settings** 탭 → **Networking** → **Generate Domain** 으로 공개 URL을 발급합니다.

발급된 URL(예: `https://digital-lucky-draw.railway.app`)로 접속해 동작을 확인합니다.

```bash
# API 정상 동작 확인
curl https://your-app.railway.app/api/prizes
```

##### Railway CLI로 배포하는 경우

```bash
# CLI 설치 및 로그인
npm install -g @railway/cli
railway login

# 프로젝트 연결 (저장소 루트에서 실행)
railway link

# 환경 변수 설정
railway variables --set "ADMIN_PASSWORD=your_password_here"
railway variables --set "NODE_ENV=production"

# 배포
railway up
```

##### 환경 변수 설정 (다른 플랫폼)

| 플랫폼 | 설정 방법 |
|--------|-----------|
| **Render** | 대시보드 → Environment Variables |
| **Fly.io** | `fly secrets set ADMIN_PASSWORD=...` |
| **Linux + PM2** | `ecosystem.config.js` 의 `env.ADMIN_PASSWORD` |
| **Linux + systemd** | 서비스 파일의 `Environment=ADMIN_PASSWORD=...` |
| **Docker** | `docker run -e ADMIN_PASSWORD=...` 또는 `docker-compose.yml` 의 `environment:` |
