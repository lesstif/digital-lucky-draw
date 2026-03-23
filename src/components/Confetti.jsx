import { useMemo } from 'react';

const COLORS = ['#f7c948', '#e74c3c', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c', '#f39c12'];

export default function Confetti({ active }) {
  // useMemo로 파티클 배열 고정 (active 변경 시 재생성 방지)
  const particles = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        left:     `${Math.random() * 100}%`,
        width:    `${7 + Math.random() * 9}px`,
        height:   `${7 + Math.random() * 9}px`,
        color:    COLORS[Math.floor(Math.random() * COLORS.length)],
        isCircle: Math.random() > 0.5,
        duration: `${1.4 + Math.random() * 1.6}s`,
        delay:    `${Math.random() * 0.7}s`,
      })),
    []
  );

  if (!active) return null;

  return (
    <div style={styles.overlay} aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position:        'absolute',
            left:            p.left,
            top:             '-10px',
            width:           p.width,
            height:          p.height,
            backgroundColor: p.color,
            borderRadius:    p.isCircle ? '50%' : '2px',
            animation:       `fall ${p.duration} ease-in ${p.delay} forwards`,
          }}
        />
      ))}
    </div>
  );
}

const styles = {
  overlay: {
    position:      'fixed',
    top:           0,
    left:          0,
    width:         '100%',
    height:        '100%',
    pointerEvents: 'none',
    zIndex:        100,
    overflow:      'hidden',
  },
};
