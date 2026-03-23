import Confetti from './Confetti';

export default function DrawArea({ displayName, winner, isDrawing, totalRemain, onDraw, showConfetti }) {
  const isExhausted = totalRemain === 0;
  const isDisabled  = isDrawing || isExhausted;

  const buttonLabel = isExhausted ? '재고 소진' : isDrawing ? '추첨 중...' : '추첨하기';

  return (
    <div style={styles.container}>
      <Confetti active={showConfetti} />

      {/* 결과 표시 영역 */}
      <div style={styles.displayBox}>
        {isDrawing && (
          <div style={{ ...styles.text, animation: 'cycle-flash 0.12s ease-in-out infinite' }}>
            {displayName}
          </div>
        )}
        {!isDrawing && winner && (
          <div style={{ textAlign: 'center', animation: 'winner-pop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards' }}>
            <div style={styles.winnerLabel}>당첨!</div>
            <div style={styles.winnerName}>{winner.name}</div>
          </div>
        )}
        {!isDrawing && !winner && !isExhausted && (
          <div style={styles.hint}>버튼을 눌러 추첨하세요</div>
        )}
        {!isDrawing && isExhausted && (
          <div style={styles.exhausted}>모든 경품이 소진되었습니다</div>
        )}
      </div>

      {/* 추첨 버튼 */}
      <button
        style={{
          ...styles.button,
          ...(isDisabled ? styles.buttonOff : styles.buttonOn),
        }}
        onClick={onDraw}
        disabled={isDisabled}
      >
        {isDrawing
          ? <div style={styles.spinner} />
          : <span style={styles.buttonText}>{buttonLabel}</span>
        }
      </button>

      <div style={styles.remainNote}>
        남은 경품: <strong>{totalRemain}개</strong>
      </div>
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '32px',
    position: 'relative',
  },
  displayBox: {
    width: '100%',
    maxWidth: '640px',
    minHeight: '130px',
    background: 'rgba(255,255,255,0.05)',
    border: '2px solid rgba(247,201,72,0.25)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  text: {
    fontSize: 'clamp(28px, 6vw, 54px)',
    fontWeight: '700',
    color: '#f7c948',
    textAlign: 'center',
  },
  winnerLabel: {
    fontSize: 'clamp(14px, 2.5vw, 22px)',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: '6px',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  winnerName: {
    fontSize: 'clamp(38px, 9vw, 80px)',
    fontWeight: '900',
    color: '#f7c948',
    textShadow: '0 0 40px rgba(247,201,72,0.9)',
    lineHeight: 1.1,
  },
  hint: {
    fontSize: 'clamp(15px, 2.5vw, 20px)',
    color: 'rgba(255,255,255,0.28)',
  },
  exhausted: {
    fontSize: 'clamp(15px, 2.5vw, 20px)',
    color: 'rgba(231,76,60,0.8)',
  },
  button: {
    width: 'clamp(160px, 24vw, 230px)',
    height: 'clamp(160px, 24vw, 230px)',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    touchAction: 'manipulation',
    transition: 'transform 0.1s ease, opacity 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
  },
  buttonOn: {
    background: 'radial-gradient(circle at 35% 35%, #ffe566, #f7c948 55%, #c9900a)',
    animation: 'pulse-glow 2s ease-in-out infinite',
  },
  buttonOff: {
    background: 'rgba(80,80,80,0.35)',
    cursor: 'not-allowed',
    opacity: 0.55,
  },
  buttonText: {
    fontSize: 'clamp(18px, 3.5vw, 30px)',
    fontWeight: '800',
    color: '#1a1a2e',
    letterSpacing: '1px',
    pointerEvents: 'none',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid rgba(26,26,46,0.25)',
    borderTop: '5px solid #1a1a2e',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  remainNote: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.45)',
  },
};
