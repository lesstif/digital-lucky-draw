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
cp public/prizes.json.example public/prizes.json
```
`public/prizes.json` 파일을 열어 실제 경품 목록을 설정합니다. (아래 [경품 목록 설정](#경품-목록-설정) 참고)

**4. 개발 서버 실행**
```bash
npm run dev
```

터미널에 출력되는 네트워크 IP(예: `http://192.168.x.x:5173`)로 iPad 등 동일 Wi-Fi 기기에서 접근할 수 있습니다.

## 경품 목록 설정

`public/prizes.json`은 **git에서 제외**되어 있습니다. 이벤트 장소마다 독립적으로 관리하기 위해서입니다.
예제 파일을 복사한 뒤 수정하세요.

```bash
cp public/prizes.json.example public/prizes.json
```

파일 저장 후 서버를 재시작하면 반영됩니다. (`prizes.json`이 없으면 서버가 시작되지 않습니다.)

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
npm run build        # React 앱을 dist/ 폴더로 빌드
NODE_ENV=production npm start  # Express가 dist/ 정적 파일 + API를 함께 서빙
```

프로덕션에서는 Vite dev server 없이 Express 단독으로 실행됩니다.

### 환경 변수 설정 (서버 배포 시)

`.env` 파일을 서버에 직접 올리는 대신, 플랫폼의 환경 변수 설정을 사용하세요.

| 플랫폼 | 설정 방법 |
|--------|-----------|
| **Linux 서버 (systemd)** | `/etc/systemd/system/lucky-draw.service` 의 `Environment=ADMIN_PASSWORD=...` |
| **PM2** | `ecosystem.config.js` 의 `env.ADMIN_PASSWORD` 또는 `pm2 start server.js --env production` |
| **Railway / Render** | 대시보드 → Environment Variables |
| **Fly.io** | `fly secrets set ADMIN_PASSWORD=...` |
| **Docker** | `docker run -e ADMIN_PASSWORD=... ` 또는 `docker-compose.yml` 의 `environment:` |

### PM2 예시

```bash
npm run build
pm2 start server.js --name lucky-draw -- --env NODE_ENV=production
pm2 set lucky-draw ADMIN_PASSWORD=your_password_here
```
