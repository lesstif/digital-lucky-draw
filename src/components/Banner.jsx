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
          const isEmpty = prize.remain === 0;
          const isLow   = !isEmpty && prize.remain <= Math.ceil(prize.total * 0.2);
          const countColor = isEmpty ? '#888' : isLow ? '#e74c3c' : '#4ade80';

          return (
            <div
              key={prize.id}
              style={{
                ...styles.card,
                borderColor: isEmpty ? '#444' : 'rgba(247,201,72,0.4)',
                opacity: isEmpty ? 0.45 : 1,
              }}
            >
              <div style={styles.cardName}>{prize.name}</div>
              <div style={{ ...styles.cardCount, color: countColor }}>
                {prize.remain}
                <span style={styles.cardTotal}> / {prize.total}</span>
              </div>
              {isEmpty && <div style={styles.soldOut}>소진</div>}
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
    borderRadius: '16px',
    padding: '16px 20px',
    backdropFilter: 'blur(10px)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  label: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
  },
  totalBadge: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#f7c948',
  },
  grid: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  card: {
    flex: '1 1 120px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid',
    borderRadius: '12px',
    padding: '12px 16px',
    textAlign: 'center',
    position: 'relative',
    transition: 'opacity 0.3s ease',
  },
  cardName: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.75)',
    marginBottom: '6px',
  },
  cardCount: {
    fontSize: '26px',
    fontWeight: '700',
    lineHeight: 1,
  },
  cardTotal: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '400',
  },
  soldOut: {
    position: 'absolute',
    top: '6px',
    right: '8px',
    fontSize: '10px',
    color: '#888',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '4px',
    padding: '2px 5px',
    letterSpacing: '0.5px',
  },
};
