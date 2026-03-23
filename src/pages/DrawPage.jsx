import Banner from '../components/Banner';
import DrawArea from '../components/DrawArea';

export default function DrawPage({ prizes, displayName, winner, isDrawing, totalRemain, onDraw, showConfetti }) {
  return (
    <div style={styles.page}>
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
    padding: '16px',
    gap: '14px',
    overflow: 'hidden',
  },
};
