export default function Banner({ prizes }) {
  const totalRemain = prizes.reduce((sum, p) => sum + p.remain, 0);
  const totalAll    = prizes.reduce((sum, p) => sum + p.total, 0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.label}>🎁 남은 경품</span>
        <span style={styles.totalBadge}>
          <span style={styles.totalRemain}>{totalRemain}</span>
          <span style={styles.totalSep}> / {totalAll}</span>
        </span>
      </div>
      <div style={styles.grid}>
        {prizes.map((prize) => {
          const isEmpty    = prize.remain === 0;
          const pct        = prize.total > 0 ? (prize.remain / prize.total) : 0;
          const isLow      = !isEmpty && pct <= 0.2;
          const countColor = isEmpty ? '#444' : isLow ? '#f87171' : '#4ade80';
          const barColor   = isEmpty ? '#333' : isLow ? '#f87171' : '#4ade80';
          const glowColor  = isEmpty ? 'none'
            : isLow ? '0 0 0 1px rgba(248,113,113,0.35), 0 4px 20px rgba(248,113,113,0.12)'
            : '0 0 0 1px rgba(247,201,72,0.3), 0 4px 20px rgba(247,201,72,0.08)';

          return (
            <div
              key={prize.id}
              style={{
                ...styles.card,
                opacity: isEmpty ? 0.38 : 1,
                boxShadow: glowColor,
              }}
            >
              {isEmpty && <div style={styles.soldOutBadge}>소진</div>}
              {isLow && !isEmpty && (
                <div style={styles.lowBadge}>잔여↓</div>
              )}
              <div style={styles.cardName}>{prize.name}</div>
              <div style={{ ...styles.cardCount, color: countColor }}>
                {prize.remain}
                <span style={styles.cardTotal}> / {prize.total}</span>
              </div>
              {/* 진행률 바 */}
              <div style={styles.progressBg}>
                <div style={{
                  ...styles.progressFill,
                  width: `${pct * 100}%`,
                  background: barColor,
                  boxShadow: isEmpty ? 'none' : `0 0 6px ${barColor}`,
                  animation: 'progress-fill 0.6s ease-out',
                }} />
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
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '22px',
    padding: '18px 20px 16px',
    backdropFilter: 'blur(16px)',
    flexShrink: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  label: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '2.5px',
    fontWeight: '600',
  },
  totalBadge: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '2px',
  },
  totalRemain: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#f7c948',
    textShadow: '0 0 16px rgba(247,201,72,0.6)',
  },
  totalSep: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '400',
  },
  grid: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  card: {
    flex: '1 1 130px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    padding: '14px 16px 12px',
    textAlign: 'center',
    position: 'relative',
    transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
  },
  cardName: {
    fontSize: 'clamp(13px, 1.8vw, 17px)',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '6px',
    fontWeight: '500',
    letterSpacing: '0.3px',
  },
  cardCount: {
    fontSize: 'clamp(36px, 6vw, 56px)',
    fontWeight: '800',
    lineHeight: 1,
    marginBottom: '10px',
  },
  cardTotal: {
    fontSize: 'clamp(15px, 2vw, 22px)',
    color: 'rgba(255,255,255,0.28)',
    fontWeight: '400',
  },
  progressBg: {
    height: '3px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '99px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '99px',
    transition: 'width 0.5s ease',
  },
  soldOutBadge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    fontSize: '10px',
    color: '#555',
    background: 'rgba(0,0,0,0.5)',
    borderRadius: '4px',
    padding: '2px 6px',
    letterSpacing: '0.5px',
    fontWeight: '600',
  },
  lowBadge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    fontSize: '10px',
    color: '#f87171',
    background: 'rgba(248,113,113,0.12)',
    border: '1px solid rgba(248,113,113,0.3)',
    borderRadius: '4px',
    padding: '2px 6px',
    letterSpacing: '0.3px',
    fontWeight: '600',
    animation: 'badge-appear 0.3s ease',
  },
};
