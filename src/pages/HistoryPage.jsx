export default function HistoryPage({ history, onReset }) {
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>당첨 이력</h2>
        <button style={styles.resetBtn} onClick={onReset}>
          관리자 리셋
        </button>
      </div>

      {history.length === 0 ? (
        <div style={styles.emptyWrap}>
          <p style={styles.empty}>아직 당첨자가 없습니다.</p>
        </div>
      ) : (
        <div style={styles.list}>
          {history.map((item, idx) => (
            <div key={item.id} style={styles.item}>
              <span style={styles.rank}>#{history.length - idx}</span>
              <span style={styles.prize}>{item.prize}</span>
              <span style={styles.time}>{item.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    padding: '20px',
    gap: '16px',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff',
  },
  resetBtn: {
    background: 'rgba(231,76,60,0.15)',
    border: '1px solid rgba(231,76,60,0.4)',
    borderRadius: '10px',
    color: '#e74c3c',
    fontSize: '14px',
    padding: '8px 20px',
    cursor: 'pointer',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
  },
  emptyWrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.25)',
  },
  list: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    fontSize: '16px',
    flexShrink: 0,
  },
  rank: {
    color: '#f7c948',
    fontWeight: '700',
    minWidth: '45px',
    fontSize: '15px',
  },
  prize: {
    flex: 1,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  time: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: '13px',
  },
};
