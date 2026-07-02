'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/', label: 'Pipeline', icon: '◈' },
  { href: '/ads', label: 'Ads', icon: '▲' },
  { href: '/cadastro', label: 'Cadastro', icon: '＋' },
];

export default function NavBar({ theme, toggleTheme }) {
  const pathname = usePathname();
  const isDark = theme === 'dark';

  const vars = isDark ? {
    bg: 'rgba(8,8,8,0.9)', border: 'rgba(217,106,50,0.16)', borderH: 'rgba(217,106,50,0.42)',
    text: '#EFEBE0', textMuted: 'rgba(239,235,224,0.4)', orange: '#D96A32', orange2: '#E8621A',
    surface: 'rgba(255,255,255,0.03)', shl: 'rgba(0,0,0,0.85)',
  } : {
    bg: 'rgba(255,255,255,0.85)', border: 'rgba(196,88,24,0.25)', borderH: 'rgba(196,88,24,0.55)',
    text: '#1A1410', textMuted: 'rgba(26,20,16,0.5)', orange: '#C45818', orange2: '#D96A32',
    surface: 'rgba(255,255,255,0.72)', shl: 'rgba(0,0,0,0.12)',
  };

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 28px',
      background: vars.bg, backdropFilter: 'blur(22px) saturate(1.3)', borderBottom: `1px solid ${vars.border}`,
      position: 'sticky', top: 0, zIndex: 200, boxShadow: `0 4px 24px ${vars.shl}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: `linear-gradient(145deg, ${vars.orange2}, ${vars.orange})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 17, color: '#fff',
            boxShadow: `0 2px 0 rgba(0,0,0,0.5), 0 4px 12px ${vars.shl}`, flexShrink: 0,
          }}>R</div>
          <div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: 3, color: vars.text, lineHeight: 1.1 }}>RHOPE</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: vars.textMuted, letterSpacing: 2.5, textTransform: 'uppercase' }}>Sistema Interno</div>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: 6 }}>
          {TABS.map(tab => {
            const active = pathname === tab.href;
            return (
              <Link key={tab.href} href={tab.href} style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8,
                textDecoration: 'none', fontFamily: "'Oswald', sans-serif", fontWeight: 500, fontSize: 12.5,
                letterSpacing: 1.5, transition: 'all .2s',
                color: active ? vars.text : vars.textMuted,
                background: active ? 'rgba(217,106,50,0.12)' : vars.surface,
                border: `1px solid ${active ? vars.borderH : vars.border}`,
              }}>
                <span style={{ fontSize: 11, color: active ? vars.orange : vars.textMuted }}>{tab.icon}</span>
                {tab.label.toUpperCase()}
              </Link>
            );
          })}
        </nav>
      </div>

      <button onClick={toggleTheme} style={{
        width: 36, height: 36, borderRadius: '50%', background: vars.surface, border: `1px solid ${vars.border}`,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
        boxShadow: `0 2px 8px ${vars.shl}`, color: vars.text,
      }}>
        {isDark ? '🌙' : '☀️'}
      </button>
    </header>
  );
}
