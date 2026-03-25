import { useState, useEffect } from 'react';

export default function AdminPage({ onReset, onPrizesUpdate }) {
  const [password, setPassword]     = useState('');
  const [rows, setRows]             = useState([]);           // 편집 중인 경품 행
  const [editStatus, setEditStatus] = useState('idle');       // idle | loading | success | error
  const [editMsg, setEditMsg]       = useState('');
  const [resetStatus, setResetStatus] = useState('idle');
  const [resetMsg, setResetMsg]       = useState('');

  // 서버에서 현재 경품 목록 로드
  useEffect(() => {
    fetch('/api/prizes')
      .then((r) => r.json())
      .then((data) => setRows(data.map(({ id, name, total }) => ({ id, name, total }))));
  }, []);

  const updateRow = (idx, field, value) => {
    setRows((prev) => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
    setEditStatus('idle');
    setEditMsg('');
  };

  const addRow = () => {
    const maxId = rows.reduce((m, r) => Math.max(m, r.id), 0);
    setRows((prev) => [...prev, { id: maxId + 1, name: '', total: 10 }]);
  };

  const removeRow = (idx) => {
    setRows((prev) => prev.filter((_, i) => i !== idx));
    setEditStatus('idle');
    setEditMsg('');
  };

  const handleSavePrizes = async () => {
    if (!password) { setEditStatus('error'); setEditMsg('비밀번호를 입력하세요.'); return; }
    const invalid = rows.find((r) => !r.name.trim() || r.total < 1);
    if (invalid) { setEditStatus('error'); setEditMsg('이름과 수량(1 이상)을 모두 입력하세요.'); return; }

    setEditStatus('loading');
    setEditMsg('');
    try {
      const res  = await fetch('/api/prizes/update', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password, prizes: rows.map((r) => ({ ...r, total: Number(r.total) })) }),
      });
      const data = await res.json();
      if (!res.ok) { setEditStatus('error'); setEditMsg(data.error || '오류가 발생했습니다.'); return; }

      onPrizesUpdate(data.prizes);
      setRows(data.prizes.map(({ id, name, total }) => ({ id, name, total })));
      setEditStatus('success');
      setEditMsg('경품 목록이 저장되었습니다.');
    } catch {
      setEditStatus('error');
      setEditMsg('서버에 연결할 수 없습니다.');
    }
  };

  const handleReset = async () => {
    if (!password) { setResetStatus('error'); setResetMsg('비밀번호를 입력하세요.'); return; }
    setResetStatus('loading');
    setResetMsg('');
    try {
      const res  = await fetch('/api/reset', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) { setResetStatus('error'); setResetMsg(data.error || '오류가 발생했습니다.'); return; }

      const [prizes, history] = await Promise.all([
        fetch('/api/prizes').then((r) => r.json()),
        fetch('/api/history').then((r) => r.json()),
      ]);
      onReset(prizes, history);
      setRows(prizes.map(({ id, name, total }) => ({ id, name, total })));
      setResetStatus('success');
      setResetMsg('초기화 완료! 모든 경품과 이력이 리셋되었습니다.');
    } catch {
      setResetStatus('error');
      setResetMsg('서버에 연결할 수 없습니다.');
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>관리자</h2>

      {/* 비밀번호 */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>관리자 비밀번호</h3>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setEditStatus('idle'); setEditMsg(''); setResetStatus('idle'); setResetMsg(''); }}
          placeholder="비밀번호 입력 후 아래 작업을 수행하세요"
          style={styles.input}
          autoComplete="current-password"
        />
      </div>

      {/* 경품 목록 편집 */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>경품 목록 편집</h3>
        <p style={styles.desc}>
          변경 후 <strong style={{ color: '#f7c948' }}>저장</strong>하면 <code style={styles.code}>data/prizes.json</code>에 즉시 반영됩니다.
        </p>

        <div style={styles.tableHeader}>
          <span style={{ ...styles.colId }}>ID</span>
          <span style={{ ...styles.colName }}>경품 이름</span>
          <span style={{ ...styles.colTotal }}>수량</span>
          <span style={{ ...styles.colDel }} />
        </div>

        {rows.map((row, idx) => (
          <div key={row.id} style={styles.tableRow}>
            <span style={styles.colId}>{row.id}</span>
            <input
              style={{ ...styles.cellInput, ...styles.colName }}
              value={row.name}
              onChange={(e) => updateRow(idx, 'name', e.target.value)}
              placeholder="경품 이름"
            />
            <input
              style={{ ...styles.cellInput, ...styles.colTotal }}
              type="number"
              min="1"
              value={row.total}
              onChange={(e) => updateRow(idx, 'total', e.target.value)}
            />
            <button style={styles.delBtn} onClick={() => removeRow(idx)}>✕</button>
          </div>
        ))}

        <button style={styles.addBtn} onClick={addRow}>+ 경품 추가</button>

        <button
          style={{
            ...styles.btn,
            ...styles.btnBlue,
            opacity: editStatus === 'loading' ? 0.6 : 1,
            cursor:  editStatus === 'loading' ? 'not-allowed' : 'pointer',
          }}
          onClick={handleSavePrizes}
          disabled={editStatus === 'loading'}
        >
          {editStatus === 'loading' ? '저장 중...' : '저장'}
        </button>

        {editMsg && (
          <p style={{ ...styles.message, color: editStatus === 'success' ? '#4ade80' : '#e74c3c' }}>
            {editMsg}
          </p>
        )}
      </div>

      {/* 재고 초기화 */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>경품 재고 초기화</h3>
        <p style={styles.desc}>
          모든 경품 수량을 <code style={styles.code}>prizes.json</code> 기준으로 되돌리고 당첨 이력을 삭제합니다.
        </p>

        <button
          style={{
            ...styles.btn,
            ...styles.btnRed,
            opacity: resetStatus === 'loading' ? 0.6 : 1,
            cursor:  resetStatus === 'loading' ? 'not-allowed' : 'pointer',
          }}
          onClick={handleReset}
          disabled={resetStatus === 'loading'}
        >
          {resetStatus === 'loading' ? '초기화 중...' : '전체 초기화'}
        </button>

        {resetMsg && (
          <p style={{ ...styles.message, color: resetStatus === 'success' ? '#4ade80' : '#e74c3c' }}>
            {resetMsg}
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
    overflowY: 'auto',
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
    boxSizing: 'border-box',
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.35)',
    paddingBottom: '4px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  tableRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  colId: {
    flex: '0 0 32px',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.3)',
    fontSize: '13px',
  },
  colName: {
    flex: '1 1 auto',
  },
  colTotal: {
    flex: '0 0 72px',
    textAlign: 'center',
  },
  colDel: {
    flex: '0 0 32px',
  },
  cellInput: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '15px',
    padding: '8px 10px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  delBtn: {
    flex: '0 0 32px',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.3)',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '4px',
    lineHeight: 1,
  },
  addBtn: {
    background: 'none',
    border: '1px dashed rgba(255,255,255,0.2)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.45)',
    fontSize: '14px',
    padding: '10px',
    cursor: 'pointer',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
  },
  btn: {
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    padding: '14px',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    transition: 'opacity 0.2s',
    cursor: 'pointer',
  },
  btnBlue: {
    background: 'rgba(52,152,219,0.2)',
    border: '1px solid rgba(52,152,219,0.5)',
    color: '#3498db',
  },
  btnRed: {
    background: 'rgba(231,76,60,0.2)',
    border: '1px solid rgba(231,76,60,0.5)',
    color: '#e74c3c',
  },
  message: {
    fontSize: '14px',
    textAlign: 'center',
  },
};
