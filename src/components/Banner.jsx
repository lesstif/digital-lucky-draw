export default function Banner({ prizes }) {
  const totalRemain = prizes.reduce((sum, p) => sum + p.remain, 0);
  const totalAll    = prizes.reduce((sum, p) => sum + p.total, 0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.label}>남은 경품</span>
        <span style={styles.totalBadge}>{totalRemain} / {totalAll}</span>
      </div>
      <div style={styles.grid}>
        {prizes.map((prize) => {
          const isEmpty    = prize.remain === 0;
          const isLow      = !isEmpty && prize.remain <= Math.ceil(prize.total * 0.2);
          const countColor = isEmpty ? '#555' : isLow ? '#e74c3c' : '#4ade80';

          return (
            <div
              key={prize.id}
              style={{
                ...styles.card,
                borderColor: isEmpty ? '#333' : 'rgba(247,201,72,0.45)',
                opacity: isEmpty ? 0.4 : 1,
              }}
            >
              {isEmpty && <div style={styles.soldOut}>소진</div>}
              <div style={styles.cardName}>{prize.name}</div>
              <div style={{ ...styles.cardCount, color: countColor }}>
                {prize.remain}
                <span style={styles.cardTotal}> / {prize.total}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '20px 24px',
    backdropFilter: 'blur(10px)',
    flexShrink: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  label: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  totalBadge: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#f7c948',
  },
  grid: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  card: {
    flex: '1 1 140px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid',
    borderRadius: '16px',
    padding: '18px 20px',
    textAlign: 'center',
    position: 'relative',
    transition: 'opacity 0.3s ease',
  },
  cardName: {
    fontSize: 'clamp(15px, 2vw, 20px)',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '10px',
    fontWeight: '500',
  },
  cardCount: {
    fontSize: 'clamp(42px, 7vw, 64px)',
    fontWeight: '800',
    lineHeight: 1,
  },
  cardTotal: {
    fontSize: 'clamp(18px, 2.5vw, 26px)',
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '400',
  },
  soldOut: {
    position: 'absolute',
    top: '8px',
    right: '10px',
    fontSize: '11px',
    color: '#666',
    background: 'rgba(0,0,0,0.4)',
    borderRadius: '4px',
    padding: '2px 6px',
    letterSpacing: '0.5px',
  },
};
