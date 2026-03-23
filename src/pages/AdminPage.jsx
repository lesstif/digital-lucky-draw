import { useState } from 'react';

export default function AdminPage({ onReset }) {
  const [password, setPassword]   = useState('');
  const [status, setStatus]       = useState('idle'); // idle | loading | success | error
  const [message, setMessage]     = useState('');

  const handleReset = async () => {
    if (!password) return;
    setStatus('loading');
    setMessage('');

    try {
      const res  = await fetch('/api/reset', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || '오류가 발생했습니다.');
        return;
      }

      // 초기화 후 최신 상태를 서버에서 다시 받아 App 상태 동기화
      const [prizes, history] = await Promise.all([
        fetch('/api/prizes').then((r) => r.json()),
        fetch('/api/history').then((r) => r.json()),
      ]);
      onReset(prizes, history);

      setStatus('success');
      setMessage('초기화 완료! 모든 경품과 이력이 리셋되었습니다.');
      setPassword('');
    } catch {
      setStatus('error');
      setMessage('서버에 연결할 수 없습니다.');
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>관리자</h2>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>경품 재고 초기화</h3>
        <p style={styles.desc}>
          모든 경품 수량을 <code style={styles.code}>prizes.json</code> 기준으로 되돌리고 당첨 이력을 삭제합니다.
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setStatus('idle'); setMessage(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleReset()}
          placeholder="관리자 비밀번호"
          style={styles.input}
          autoComplete="current-password"
        />

        <button
          style={{
            ...styles.btn,
            opacity: status === 'loading' ? 0.6 : 1,
            cursor:  status === 'loading' ? 'not-allowed' : 'pointer',
          }}
          onClick={handleReset}
          disabled={status === 'loading' || !password}
        >
          {status === 'loading' ? '초기화 중...' : '전체 초기화'}
        </button>

        {message && (
          <p style={{ ...styles.message, color: status === 'success' ? '#4ade80' : '#e74c3c' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    padding: '24px 20px',
    gap: '20px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  desc: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.6,
  },
  code: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '4px',
    padding: '1px 6px',
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#f7c948',
  },
  input: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '16px',
    padding: '12px 16px',
    outline: 'none',
    width: '100%',
  },
  btn: {
    background: 'rgba(231,76,60,0.2)',
    border: '1px solid rgba(231,76,60,0.5)',
    borderRadius: '10px',
    color: '#e74c3c',
    fontSize: '15px',
    fontWeight: '600',
    padding: '14px',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    transition: 'opacity 0.2s',
  },
  message: {
    fontSize: '14px',
    textAlign: 'center',
  },
};
