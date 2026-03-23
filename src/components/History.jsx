export default function History({ history, onReset }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.label}>당첨 이력 ({history.length})</span>
        <button style={styles.resetBtn} onClick={onReset}>
          관리자 리셋
        </button>
      </div>

      {history.length === 0 ? (
        <p style={styles.empty}>아직 당첨자가 없습니다.</p>
      ) : (
        <div style={styles.list}>
          {history.slice(0, 8).map((item, idx) => (
            <div key={item.id} style={styles.item}>
              <span style={styles.rank}>#{history.length - idx}</span>
              <span style={styles.prize}>{item.prize}</span>
              <span style={styles.time}>{item.time}</span>
            </div>
          ))}
          {history.length > 8 && (
            <p style={styles.more}>외 {history.length - 8}건 더...</p>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '14px 20px',
    maxHeight: '210px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  label: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
  },
  resetBtn: {
    background: 'rgba(231,76,60,0.15)',
    border: '1px solid rgba(231,76,60,0.4)',
    borderRadius: '8px',
    color: '#e74c3c',
    fontSize: '13px',
    padding: '6px 16px',
    cursor: 'pointer',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
  },
  empty: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.25)',
    textAlign: 'center',
    padding: '12px 0',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    overflowY: 'auto',
    maxHeight: '145px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '7px 10px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '8px',
    fontSize: '14px',
  },
  rank: {
    color: '#f7c948',
    fontWeight: '700',
    minWidth: '38px',
    fontSize: '13px',
  },
  prize: {
    flex: 1,
    color: 'rgba(255,255,255,0.88)',
  },
  time: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: '12px',
  },
  more: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    paddingTop: '4px',
  },
};
