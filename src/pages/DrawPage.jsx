import Banner from '../components/Banner';
import DrawArea from '../components/DrawArea';

export default function DrawPage({ prizes, displayName, winner, isDrawing, totalRemain, onDraw, showConfetti }) {
  return (
    <div style={styles.page}>
      {/* 벤더 로고 — public/logo.png 에 이미지 파일을 추가하면 자동으로 표시됩니다 */}
      <div style={styles.logoWrap}>
        <img
          src="/logo.png"
          alt="logo"
          style={styles.logo}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>

      <Banner prizes={prizes} />
      <DrawArea
        displayName={displayName}
        winner={winner}
        isDrawing={isDrawing}
        totalRemain={totalRemain}
        onDraw={onDraw}
        showConfetti={showConfetti}
      />
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    padding: '16px 20px 12px',
    gap: '12px',
    overflow: 'hidden',
  },
  logoWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    minHeight: '48px',
    animation: 'float 4s ease-in-out infinite',
  },
  logo: {
    maxHeight: '52px',
    maxWidth: '220px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 0 12px rgba(247,201,72,0.35))',
  },
};
