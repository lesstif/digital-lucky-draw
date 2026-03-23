import { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { initialPrizes } from './data/prizes';
import { weightedRandom } from './utils/draw';
import NavBar from './components/NavBar';
import DrawPage from './pages/DrawPage';
import HistoryPage from './pages/HistoryPage';

const PRIZES_KEY  = 'lucky-draw-prizes';
const HISTORY_KEY = 'lucky-draw-history';
const ADMIN_PASSWORD = 'admin1234'; // 실제 운영 전 변경하세요

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [prizes, setPrizes] = useState(() => loadFromStorage(PRIZES_KEY, initialPrizes));
  const [history, setHistory] = useState(() => loadFromStorage(HISTORY_KEY, []));
  const [displayName, setDisplayName] = useState('');
  const [winner, setWinner] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(PRIZES_KEY, JSON.stringify(prizes));
  }, [prizes]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const totalRemain = prizes.reduce((sum, p) => sum + p.remain, 0);

  const handleDraw = () => {
    if (isDrawing || totalRemain === 0) return;

    setIsDrawing(true);
    setWinner(null);
    setShowConfetti(false);

    const available = prizes.filter((p) => p.remain > 0);
    let count = 0;
    const TOTAL_CYCLES = 28;

    const tick = () => {
      // 슬롯머신 효과: 처음엔 빠르게, 마지막엔 천천히
      const rand = available[Math.floor(Math.random() * available.length)];
      setDisplayName(rand.name);
      count++;

      if (count < TOTAL_CYCLES) {
        let delay;
        if      (count < 8)  delay = 80;
        else if (count < 18) delay = 60;
        else                 delay = 80 + (count - 18) * 50;

        timerRef.current = setTimeout(tick, delay);
      } else {
        // 최종 당첨자 결정
        const result = weightedRandom(prizes);
        setDisplayName(result.name);
        setWinner(result);
        setPrizes((prev) =>
          prev.map((p) => (p.id === result.id ? { ...p, remain: p.remain - 1 } : p))
        );
        setHistory((prev) => [
          { id: Date.now(), prize: result.name, time: new Date().toLocaleTimeString('ko-KR') },
          ...prev.slice(0, 49),
        ]);
        setShowConfetti(true);
        setIsDrawing(false);
      }
    };

    timerRef.current = setTimeout(tick, 80);
  };

  const handleReset = () => {
    const pw = window.prompt('관리자 비밀번호를 입력하세요:');
    if (pw === null) return; // 취소
    if (pw === ADMIN_PASSWORD) {
      clearTimeout(timerRef.current);
      setPrizes(initialPrizes);
      setHistory([]);
      setWinner(null);
      setDisplayName('');
      setShowConfetti(false);
      setIsDrawing(false);
    } else {
      window.alert('비밀번호가 틀렸습니다.');
    }
  };

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
            element={<HistoryPage history={history} onReset={handleReset} />}
          />
        </Routes>
      </div>
      <NavBar />
    </div>
  );
}

const styles = {
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
