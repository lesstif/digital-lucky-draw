import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const tabs = [
  { to: '/',        label: '추첨하기' },
  { to: '/history', label: '당첨 이력' },
  { to: '/admin',   label: '관리자',   subtle: true },
];

export default function NavBar() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  // 페이지 이동 시 자동으로 접기
  useEffect(() => {
    setExpanded(false);
  }, [location.pathname]);

  return (
    <div
      style={styles.wrapper}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* 항상 보이는 핸들 — 터치 기기에서 탭으로 토글 */}
      <div
        style={styles.handle}
        onClick={() => setExpanded((v) => !v)}
      >
        <div style={{
          ...styles.handleBar,
          background: expanded
            ? 'rgba(247,201,72,0.7)'
            : 'rgba(255,255,255,0.2)',
          width: expanded ? '48px' : '32px',
        }} />
      </div>

      {/* 탭 메뉴 — hover/탭 시 슬라이드 다운 */}
      <nav style={{
        ...styles.nav,
        maxHeight: expanded ? '70px' : '0px',
        opacity:   expanded ? 1 : 0,
        pointerEvents: expanded ? 'auto' : 'none',
      }}>
        {tabs.map(({ to, label, subtle }) => (
          <NavLink
            key={to}
            to={to}
            end
            style={({ isActive }) => ({
              ...styles.tab,
              ...(subtle ? styles.tabSubtle : {}),
              ...(isActive ? styles.tabActive : styles.tabInactive),
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

const styles = {
  wrapper: {
    flexShrink: 0,
    background: 'rgba(13,13,43,0.95)',
    backdropFilter: 'blur(12px)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  handle: {
    height: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
  },
  handleBar: {
    height: '4px',
    borderRadius: '2px',
    transition: 'width 0.2s ease, background 0.2s ease',
  },
  nav: {
    display: 'flex',
    overflow: 'hidden',
    transition: 'max-height 0.25s ease, opacity 0.2s ease',
  },
  tab: {
    flex: 1,
    padding: '14px 0',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    letterSpacing: '0.5px',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    transition: 'color 0.2s ease',
    borderTop: '2px solid transparent',
  },
  tabActive: {
    color: '#f7c948',
    borderTopColor: '#f7c948',
  },
  tabInactive: {
    color: 'rgba(255,255,255,0.45)',
  },
  tabSubtle: {
    fontSize: '13px',
    fontWeight: '400',
    flex: '0 0 72px',
  },
};
