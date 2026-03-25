import { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { playTick, playFanfare, playGrandFanfare } from './utils/sound';
import NavBar from './components/NavBar';
import DrawPage from './pages/DrawPage';
import HistoryPage from './pages/HistoryPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [prizes, setPrizes]       = useState([]);
  const [history, setHistory]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [winner, setWinner]       = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const timerRef = useRef(null);

  // 앱 시작 시 서버에서 상태 로드
  useEffect(() => {
    Promise.all([
      fetch('/api/prizes').then((r) => r.json()),
      fetch('/api/history').then((r) => r.json()),
    ])
      .then(([p, h]) => {
        setPrizes(p);
        setHistory(h);
      })
      .catch(() => alert('서버에 연결할 수 없습니다.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const totalRemain = prizes.reduce((sum, p) => sum + p.remain, 0);

  const handleDraw = () => {
    if (isDrawing || totalRemain === 0) return;

    setIsDrawing(true);
    setWinner(null);
    setShowConfetti(false);

    const available  = prizes.filter((p) => p.remain > 0);
    let count        = 0;
    const TOTAL_CYCLES = 20;

    const tick = () => {
      // 슬롯머신 애니메이션 (로컬에서 표시용으로만 순환)
      const rand = available[Math.floor(Math.random() * available.length)];
      setDisplayName(rand.name);
      playTick();
      count++;

      if (count < TOTAL_CYCLES) {
        let delay;
        if      (count < 6)  delay = 75;
        else if (count < 14) delay = 60;
        else                 delay = 75 + (count - 14) * 45;
        timerRef.current = setTimeout(tick, delay);
      } else {
        // 애니메이션 종료 → 서버에서 실제 추첨 결과 수신
        fetch('/api/draw', { method: 'POST' })
          .then((r) => r.json())
          .then(({ winner: w, entry }) => {
            setDisplayName(w.name);
            setWinner(w);
            setPrizes((prev) =>
              prev.map((p) => (p.id === w.id ? { ...p, remain: p.remain - 1 } : p))
            );
            setHistory((prev) => [entry, ...prev]);
            setShowConfetti(true);
            w.id === 1 ? playGrandFanfare() : playFanfare();
          })
          .catch(() => alert('추첨 중 오류가 발생했습니다.'))
          .finally(() => setIsDrawing(false));
      }
    };

    timerRef.current = setTimeout(tick, 80);
  };

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingText}>서버에 연결 중...</div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <div style={styles.content}>
        <Routes>
          <Route
            path="/"
            element={
              <DrawPage
                prizes={prizes}
                displayName={displayName}
                winner={winner}
                isDrawing={isDrawing}
                totalRemain={totalRemain}
                onDraw={handleDraw}
                showConfetti={showConfetti}
              />
            }
          />
          <Route
            path="/history"
            element={<HistoryPage history={history} />}
          />
          <Route
            path="/admin"
            element={
              <AdminPage
                onReset={(prizes, history) => {
                  setPrizes(prizes);
                  setHistory(history);
                  setWinner(null);
                  setDisplayName('');
                  setShowConfetti(false);
                }}
                onPrizesUpdate={(prizes) => {
                  setPrizes(prizes);
                  setWinner(null);
                  setDisplayName('');
                  setShowConfetti(false);
                }}
              />
            }
          />
        </Routes>
      </div>
      <NavBar />
    </div>
  );
}

const styles = {
  loadingWrap: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.5)',
  },
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxWidth: '1024px',
    margin: '0 auto',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
};
