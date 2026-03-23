import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/',        label: '추첨하기' },
  { to: '/history', label: '당첨 이력' },
];

export default function NavBar() {
  return (
    <nav style={styles.nav}>
      {tabs.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end
          style={({ isActive }) => ({
            ...styles.tab,
            ...(isActive ? styles.tabActive : styles.tabInactive),
          })}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(13,13,43,0.95)',
    backdropFilter: 'blur(12px)',
    flexShrink: 0,
  },
  tab: {
    flex: 1,
    padding: '16px 0',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    letterSpacing: '0.5px',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    transition: 'color 0.2s ease, border-color 0.2s ease',
    borderTop: '3px solid transparent',
  },
  tabActive: {
    color: '#f7c948',
    borderTopColor: '#f7c948',
  },
  tabInactive: {
    color: 'rgba(255,255,255,0.4)',
  },
};
