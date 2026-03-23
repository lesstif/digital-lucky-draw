import 'dotenv/config';
import express from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

const PRIZES_FILE    = join(__dirname, 'public', 'prizes.json');
const DATA_DIR       = join(__dirname, 'data');
const STATE_FILE     = join(__dirname, 'data', 'state.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.warn('[경고] .env 파일에 ADMIN_PASSWORD가 설정되지 않았습니다. 관리자 기능이 비활성화됩니다.');
}

mkdirSync(DATA_DIR, { recursive: true });

// ── 상태 관리 ────────────────────────────────────────────────

function loadMasterPrizes() {
  const data = JSON.parse(readFileSync(PRIZES_FILE, 'utf-8'));
  return data.map((p) => ({ ...p, remain: p.total }));
}

function loadState() {
  if (existsSync(STATE_FILE)) {
    try {
      return JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
    } catch {
      // 파일 손상 시 초기화
    }
  }
  return { prizes: loadMasterPrizes(), history: [] };
}

function saveState(state) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

function weightedRandom(prizes) {
  const available   = prizes.filter((p) => p.remain > 0);
  if (available.length === 0) return null;
  const totalWeight = available.reduce((sum, p) => sum + p.total, 0);
  let rand = Math.random() * totalWeight;
  for (const prize of available) {
    rand -= prize.total;
    if (rand <= 0) return prize;
  }
  return available[available.length - 1];
}

let state = loadState();

// ── API ──────────────────────────────────────────────────────

// 현재 경품 목록 (잔여 수량 포함)
app.get('/api/prizes', (req, res) => {
  res.json(state.prizes);
});

// 당첨 이력
app.get('/api/history', (req, res) => {
  res.json(state.history);
});

// 추첨 실행
app.post('/api/draw', (req, res) => {
  const winner = weightedRandom(state.prizes);
  if (!winner) {
    return res.status(400).json({ error: '재고 없음' });
  }

  state.prizes = state.prizes.map((p) =>
    p.id === winner.id ? { ...p, remain: p.remain - 1 } : p
  );

  const entry = {
    id:    Date.now(),
    prize: winner.name,
    time:  new Date().toLocaleTimeString('ko-KR'),
  };
  state.history = [entry, ...state.history.slice(0, 99)];
  saveState(state);

  res.json({ winner, entry });
});

// 초기화 (관리자)
app.post('/api/reset', (req, res) => {
  if (!ADMIN_PASSWORD) {
    return res.status(503).json({ error: '서버에 ADMIN_PASSWORD가 설정되지 않았습니다.' });
  }
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: '비밀번호가 틀렸습니다.' });
  }
  state = { prizes: loadMasterPrizes(), history: [] };
  saveState(state);
  res.json({ ok: true });
});

// ── 프로덕션: 빌드된 정적 파일 서빙 ────────────────────────
if (process.env.NODE_ENV === 'production') {
  const distDir = join(__dirname, 'dist');
  app.use(express.static(distDir));
  app.get('*', (req, res) => res.sendFile(join(distDir, 'index.html')));
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server → http://localhost:${PORT}`);
});
