import Confetti from './Confetti';

export default function DrawArea({ displayName, winner, isDrawing, totalRemain, onDraw, showConfetti }) {
  const isExhausted = totalRemain === 0;
  const isDisabled  = isDrawing || isExhausted;

  const buttonLabel = isExhausted ? '재고 소진' : '추첨하기';

  return (
    <div style={styles.container}>
      <Confetti active={showConfetti} />

      {/* 결과 표시 영역 */}
      <div style={{
        ...styles.displayBox,
        borderColor: winner && !isDrawing
          ? 'rgba(247,201,72,0.6)'
          : 'rgba(255,255,255,0.08)',
        boxShadow: winner && !isDrawing
          ? '0 0 40px rgba(247,201,72,0.15), inset 0 0 40px rgba(247,201,72,0.05)'
          : 'inset 0 0 30px rgba(0,0,0,0.2)',
      }}>
        {isDrawing && (
          <div style={{ ...styles.cycleText, animation: 'cycle-flash 0.12s ease-in-out infinite' }}>
            {displayName}
          </div>
        )}
        {!isDrawing && winner && (
          <div style={{ textAlign: 'center', animation: 'winner-pop 0.55s cubic-bezier(0.175,0.885,0.32,1.275) forwards' }}>
            <div style={styles.winnerLabel}>🎉 당첨!</div>
            <div style={{ ...styles.winnerName, animation: 'winner-glow 2s ease-in-out infinite' }}>
              {winner.name}
            </div>
          </div>
        )}
        {!isDrawing && !winner && !isExhausted && (
          <div style={styles.hint}>버튼을 눌러 추첨하세요</div>
        )}
        {!isDrawing && isExhausted && (
          <div style={styles.exhausted}>🎊 모든 경품이 소진되었습니다</div>
        )}
      </div>

      {/* 추첨 버튼 — 궤도 링 포함 */}
      <div style={styles.buttonWrap}>
        {/* 외부 궤도 링 (active 상태에서만) */}
        {!isDisabled && (
          <>
            <div style={styles.orbitRing1} />
            <div style={styles.orbitRing2} />
          </>
        )}
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
      </div>

      <div style={styles.remainNote}>
        남은 경품 <strong style={styles.remainCount}>{totalRemain}</strong>개
      </div>
    </div>
  );
}

const BTN_SIZE = 'clamp(160px, 23vw, 220px)';

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '28px',
    position: 'relative',
  },
  displayBox: {
    width: '100%',
    maxWidth: '600px',
    minHeight: '120px',
    background: 'rgba(255,255,255,0.04)',
    border: '1.5px solid',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 32px',
    backdropFilter: 'blur(12px)',
    transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
  },
  cycleText: {
    fontSize: 'clamp(26px, 5.5vw, 52px)',
    fontWeight: '700',
    color: '#f7c948',
    textAlign: 'center',
    letterSpacing: '1px',
  },
  winnerLabel: {
    fontSize: 'clamp(14px, 2.2vw, 20px)',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: '5px',
    textTransform: 'uppercase',
    marginBottom: '6px',
    fontWeight: '600',
  },
  winnerName: {
    fontSize: 'clamp(34px, 8vw, 72px)',
    fontWeight: '900',
    color: '#f7c948',
    lineHeight: 1.1,
    textAlign: 'center',
  },
  hint: {
    fontSize: 'clamp(14px, 2.2vw, 18px)',
    color: 'rgba(255,255,255,0.22)',
    letterSpacing: '0.5px',
  },
  exhausted: {
    fontSize: 'clamp(14px, 2.2vw, 18px)',
    color: 'rgba(248,113,113,0.75)',
  },
  buttonWrap: {
    position: 'relative',
    width: BTN_SIZE,
    height: BTN_SIZE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitRing1: {
    position: 'absolute',
    inset: '-14px',
    borderRadius: '50%',
    border: '2.5px solid transparent',
    borderTopColor: '#f7c948',
    borderRightColor: 'rgba(247,201,72,0.4)',
    animation: 'orbit 2.4s linear infinite',
    pointerEvents: 'none',
    boxShadow: '0 0 8px rgba(247,201,72,0.4)',
  },
  orbitRing2: {
    position: 'absolute',
    inset: '-24px',
    borderRadius: '50%',
    border: '1.5px solid transparent',
    borderBottomColor: 'rgba(247,201,72,0.25)',
    borderLeftColor:   'rgba(247,201,72,0.1)',
    animation: 'orbit 4s linear infinite reverse',
    pointerEvents: 'none',
  },
  button: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    touchAction: 'manipulation',
    transition: 'transform 0.12s ease, opacity 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
    position: 'relative',
    zIndex: 1,
  },
  buttonOn: {
    background: 'radial-gradient(circle at 32% 32%, #fff0a0, #f7c948 45%, #c9900a 80%)',
    animation: 'pulse-glow 2.2s ease-in-out infinite',
  },
  buttonOff: {
    background: 'rgba(60,60,80,0.4)',
    cursor: 'not-allowed',
    opacity: 0.45,
  },
  buttonText: {
    fontSize: 'clamp(17px, 3.2vw, 28px)',
    fontWeight: '800',
    color: '#1a1030',
    letterSpacing: '1.5px',
    pointerEvents: 'none',
  },
  spinner: {
    width: '46px',
    height: '46px',
    border: '5px solid rgba(26,16,48,0.2)',
    borderTop: '5px solid #1a1030',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  remainNote: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: '0.5px',
  },
  remainCount: {
    color: '#f7c948',
    fontSize: '16px',
    fontWeight: '700',
  },
};
