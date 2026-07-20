'use client';

import React, { useEffect, useRef, useState } from 'react';

const ORANGE = '#D96A32';
const CREAM = '#EFEBE0';
const TEAL = '#143A3D';
const BG = '#0A0A0A';

const EVENT_DATE = new Date('2026-07-24T19:30:00-03:00');
const WHATSAPP_LINK = 'https://wa.me/message';

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ as: Tag = 'div', delay = 0, className = '', style = {}, children }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'reveal--visible' : ''} ${className}`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

function useCountdown(target) {
  // Starts null so server and first client render match; real value fills in after mount.
  const [left, setLeft] = useState(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, target.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  const s = Math.floor((left ?? 0) / 1000);
  return {
    dias: Math.floor(s / 86400),
    horas: Math.floor((s % 86400) / 3600),
    min: Math.floor((s % 3600) / 60),
    seg: s % 60,
    ended: left !== null && left <= 0,
    ready: left !== null,
  };
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return y;
}

const VALUE_PROPS = [
  {
    title: 'DELEGUE',
    text: 'Pare de fazer tudo sozinho. Aprenda a transferir tarefas repetitivas para a IA hoje mesmo.',
  },
  {
    title: 'AUTOMATIZE',
    text: 'Monte fluxos que trabalham por você, todos os dias, sem depender da sua atenção.',
  },
  {
    title: 'MULTIPLIQUE',
    text: 'Escale sua produtividade sem precisar contratar mais gente para operar.',
  },
];

const pad = n => String(n).padStart(2, '0');

export default function MoveAIPage() {
  const scrollY = useScrollY();
  const cd = useCountdown(EVENT_DATE);
  const [navSolid, setNavSolid] = useState(false);

  useEffect(() => {
    setNavSolid(scrollY > 40);
  }, [scrollY]);

  const [heroIn, setHeroIn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroIn(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={styles.page}>
      {/* NAV */}
      <nav style={{ ...styles.nav, ...(navSolid ? styles.navSolid : {}) }}>
        <img src="/moveai/logo.png" alt="MoveAI" style={styles.navLogo} />
        <div style={styles.navRight}>
          <span style={styles.navDate}>24–26 JUL</span>
          <a href={WHATSAPP_LINK} style={styles.navCta}>GARANTA SUA VAGA</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroGlow} />
        <div className="heroGrid" style={styles.heroGrid}>
          <div style={styles.heroLeft}>
            <div className={`fadeUp ${heroIn ? 'in' : ''}`} style={{ transitionDelay: '0ms' }}>
              <div style={styles.eyebrow}>
                <span style={styles.eyebrowDot} />
                MOVEAI · INTENSIVÃO AO VIVO
              </div>
            </div>

            <h1 style={styles.h1}>
              <span className={`fadeUp ${heroIn ? 'in' : ''}`} style={{ transitionDelay: '90ms' }}>
                <span style={{ color: CREAM }}>INTENSIVÃO DE</span>
              </span>
              <span className={`fadeUp ${heroIn ? 'in' : ''}`} style={{ transitionDelay: '180ms' }}>
                <span style={{ color: CREAM }}>PRODUTIVIDADE</span>
              </span>
              <span className={`fadeUp ${heroIn ? 'in' : ''}`} style={{ transitionDelay: '270ms' }}>
                <span style={{ color: ORANGE }}>COM IA</span>
              </span>
            </h1>

            <div className={`fadeUp ${heroIn ? 'in' : ''}`} style={{ transitionDelay: '360ms' }}>
              <p style={styles.subhead}>Pare de perguntar. Comece a delegar e automatizar.</p>
            </div>

            <div className={`fadeUp ${heroIn ? 'in' : ''}`} style={{ transitionDelay: '450ms' }}>
              <div style={styles.dateBadge}>
                <div style={styles.dateBadgeMain}>24, 25 E 26 DE JULHO</div>
                <div style={styles.dateBadgeSub}>3 DIAS AO VIVO · 19H30</div>
              </div>
            </div>

            <div className={`fadeUp ${heroIn ? 'in' : ''}`} style={{ transitionDelay: '540ms' }}>
              <div style={styles.priceBlock}>
                <div style={styles.priceLabel}>POR APENAS</div>
                <div style={styles.priceValue}>R$ 2,00</div>
                <div style={styles.priceTag}>O mercado não espera. Ele substitui.</div>
              </div>
            </div>

            <div className={`fadeUp ${heroIn ? 'in' : ''}`} style={{ transitionDelay: '630ms' }}>
              <a href={WHATSAPP_LINK} style={styles.ctaButton}>GARANTA SUA VAGA →</a>
              <div style={styles.ctaSub}>Vagas limitadas para o grupo secreto no WhatsApp</div>
            </div>
          </div>

          <div
            className={`fadeIn ${heroIn ? 'in' : ''}`}
            style={{ ...styles.heroRight, transitionDelay: '300ms', transform: `translateY(${scrollY * 0.06}px)` }}
          >
            <div style={styles.portraitMask}>
              <img src="/moveai/portrait.png" alt="Mentor MoveAI" style={styles.portraitImg} />
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div style={styles.ticker}>
        <div style={styles.tickerTrack}>
          <TickerContent />
          <TickerContent />
        </div>
      </div>

      {/* VALUE PROPS */}
      <section style={styles.section}>
        <Reveal className="revealBlock">
          <div style={styles.sectionLabel}>POR QUE ISSO IMPORTA AGORA</div>
          <h2 style={styles.h2}>
            <span style={{ color: CREAM }}>3 DIAS PARA MUDAR </span>
            <span style={{ color: ORANGE }}>COMO VOCÊ TRABALHA</span>
          </h2>
        </Reveal>

        <div className="cardsGrid" style={styles.cardsGrid}>
          {VALUE_PROPS.map((v, i) => (
            <Reveal key={v.title} delay={i * 110} className="card">
              <div style={styles.card}>
                <div style={styles.cardIndex}>{pad(i + 1)}</div>
                <div style={styles.cardTitle}>{v.title}</div>
                <div style={styles.cardText}>{v.text}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* COUNTDOWN */}
      <section style={{ ...styles.section, ...styles.countdownSection }}>
        <Reveal className="revealBlock">
          <div style={styles.sectionLabel}>{cd.ended ? 'AO VIVO AGORA' : 'A JANELA FECHA EM'}</div>
          <div className="countdownGrid" style={styles.countdownGrid}>
            {[
              ['DIAS', cd.dias],
              ['HORAS', cd.horas],
              ['MIN', cd.min],
              ['SEG', cd.seg],
            ].map(([label, val]) => (
              <div key={label} style={styles.countdownCell}>
                <div key={val} className="countdownNum" style={styles.countdownNum}>{pad(val)}</div>
                <div style={styles.countdownLabel}>{label}</div>
              </div>
            ))}
          </div>
          <div style={styles.countdownNote}>Vagas limitadas · valor de R$ 2,00 só até o início do Intensivão.</div>
        </Reveal>
      </section>

      {/* CONVITE / SHARE */}
      <section style={styles.section}>
        <div className="inviteGrid" style={styles.inviteGrid}>
          <Reveal className="revealBlock">
            <div style={styles.sectionLabel}>O CONVITE</div>
            <h2 style={styles.h2}>
              <span style={{ color: CREAM }}>ESSE É O CONVITE QUE </span>
              <span style={{ color: ORANGE }}>CIRCULA NO GRUPO</span>
            </h2>
            <p style={styles.bodyText}>
              Print, encaminhe ou mostre pra quem ainda tá adiando a decisão de usar IA no dia a dia.
              Todo mundo que chegar até o grupo secreto do WhatsApp entra com o mesmo acesso: R$ 2,00 pelos 3 dias ao vivo.
            </p>
            <a href={WHATSAPP_LINK} style={{ ...styles.ctaButton, marginTop: 8 }}>ENTRAR NO GRUPO →</a>
          </Reveal>
          <Reveal delay={150} className="revealBlock" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={styles.phoneFrame}>
              <div style={styles.phoneNotch} />
              <img src="/moveai/flyer-original.png" alt="Convite Intensivão MoveAI" style={styles.phoneImg} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={styles.finalSection}>
        <Reveal className="revealBlock" style={{ textAlign: 'center' }}>
          <h2 style={{ ...styles.h2, textAlign: 'center' }}>
            <span style={{ color: CREAM }}>O MERCADO NÃO ESPERA. </span>
            <span style={{ color: ORANGE }}>ELE SUBSTITUI.</span>
          </h2>
          <div style={styles.finalPrice}>R$ 2,00</div>
          <a href={WHATSAPP_LINK} style={{ ...styles.ctaButton, ...styles.ctaButtonLg }}>GARANTA SUA VAGA →</a>
          <div style={styles.ctaSub}>24, 25 e 26 de julho · 19h30 · ao vivo no grupo secreto do WhatsApp</div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <img src="/moveai/logo-icon.png" alt="MoveAI" style={styles.footerIcon} />
        <div style={styles.footerText}>MOVEAI · Intensivão de Produtividade com IA</div>
      </footer>

      <style jsx global>{`
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        .fadeUp, .fadeIn {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity .7s cubic-bezier(.22,.61,.36,1), transform .7s cubic-bezier(.22,.61,.36,1);
        }
        .fadeIn { transform: translateY(0) scale(0.96); }
        .fadeUp.in, .fadeIn.in { opacity: 1; transform: translateY(0) scale(1); }

        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .7s cubic-bezier(.22,.61,.36,1), transform .7s cubic-bezier(.22,.61,.36,1);
        }
        .reveal--visible { opacity: 1; transform: translateY(0); }

        a[href] { text-decoration: none; }
        a[href]:hover { filter: brightness(1.08); }

        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes tick-pop {
          0% { transform: scale(1.18); opacity: .55; }
          100% { transform: scale(1); opacity: 1; }
        }
        .countdownNum { animation: tick-pop .4s ease-out; }

        .heroGrid { grid-template-columns: 1.05fr 0.95fr; }
        .cardsGrid { grid-template-columns: repeat(3, 1fr); }
        .inviteGrid { grid-template-columns: 1fr 1fr; }

        @media (max-width: 860px) {
          .heroGrid { grid-template-columns: 1fr; }
          .heroGrid > div:last-child { order: -1; }
          .cardsGrid { grid-template-columns: 1fr; }
          .inviteGrid { grid-template-columns: 1fr; }
          .inviteGrid > div:last-child { order: -1; }
        }

        @media (max-width: 480px) {
          .countdownGrid { gap: 8px; }
        }
      `}</style>
    </div>
  );
}

function TickerContent() {
  return (
    <span style={styles.tickerSpan}>
      VAGAS LIMITADAS&nbsp;&nbsp;•&nbsp;&nbsp;24–26 DE JULHO&nbsp;&nbsp;•&nbsp;&nbsp;R$ 2,00&nbsp;&nbsp;•&nbsp;&nbsp;AO VIVO ÀS 19H30&nbsp;&nbsp;•&nbsp;&nbsp;
    </span>
  );
}

const maxW = 1180;

const styles = {
  page: {
    background: BG,
    color: CREAM,
    fontFamily: "'Oswald', sans-serif",
    overflowX: 'hidden',
    minHeight: '100vh',
  },
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 28px',
    background: 'transparent',
    borderBottom: '1px solid transparent',
    transition: 'background .3s, border-color .3s, backdrop-filter .3s',
  },
  navSolid: {
    background: 'rgba(10,10,10,0.85)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(239,235,224,0.1)',
  },
  navLogo: { height: 26, width: 'auto', display: 'block' },
  navRight: { display: 'flex', alignItems: 'center', gap: 16 },
  navDate: { fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: CREAM, opacity: 0.7, display: 'none' },
  navCta: {
    fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: 1,
    color: '#0A0A0A', background: ORANGE, padding: '10px 18px', borderRadius: 100,
  },

  hero: { position: 'relative', padding: '48px 28px 90px', maxWidth: maxW + 80, margin: '0 auto', overflow: 'hidden' },
  heroGlow: {
    position: 'absolute', top: '-10%', right: '-10%', width: 560, height: 560, borderRadius: '50%',
    background: `radial-gradient(circle, ${ORANGE}33 0%, transparent 70%)`, filter: 'blur(10px)', pointerEvents: 'none',
  },
  heroGrid: { display: 'grid', gap: 40, alignItems: 'center', position: 'relative' },
  heroLeft: {},
  eyebrow: {
    fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 3, color: ORANGE,
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, textTransform: 'uppercase',
  },
  eyebrowDot: { width: 7, height: 7, borderRadius: '50%', background: ORANGE, boxShadow: `0 0 12px ${ORANGE}` },
  h1: {
    fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 'clamp(40px, 6vw, 76px)',
    lineHeight: 1.02, letterSpacing: -0.5, margin: '0 0 22px', display: 'flex', flexDirection: 'column',
  },
  subhead: { fontFamily: "'Oswald', sans-serif", fontWeight: 400, fontSize: 'clamp(17px, 2vw, 22px)', color: CREAM, opacity: 0.82, margin: '0 0 26px', maxWidth: 480 },
  dateBadge: {
    display: 'inline-block', background: 'rgba(217,106,50,0.12)', border: `1px solid ${ORANGE}66`,
    borderRadius: 10, padding: '12px 18px', marginBottom: 26,
  },
  dateBadgeMain: { fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 15, letterSpacing: 1, color: CREAM },
  dateBadgeSub: { fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 1, color: ORANGE, marginTop: 3 },
  priceBlock: { marginBottom: 30 },
  priceLabel: { fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 2, color: CREAM, opacity: 0.6 },
  priceValue: { fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 'clamp(56px, 8vw, 96px)', color: ORANGE, lineHeight: 1, margin: '4px 0' },
  priceTag: { fontFamily: "'Oswald', sans-serif", fontWeight: 500, fontSize: 15, color: CREAM, opacity: 0.85 },
  ctaButton: {
    display: 'inline-block', fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 15, letterSpacing: 1,
    color: '#0A0A0A', background: ORANGE, padding: '17px 30px', borderRadius: 10,
    boxShadow: `0 0 0 rgba(217,106,50,0.5)`, animation: 'none',
  },
  ctaButtonLg: { fontSize: 17, padding: '20px 40px' },
  ctaSub: { fontFamily: "'Space Mono', monospace", fontSize: 11, color: CREAM, opacity: 0.55, marginTop: 12, letterSpacing: 0.5 },

  heroRight: { position: 'relative', display: 'flex', justifyContent: 'center' },
  portraitMask: {
    width: '100%', maxWidth: 420, aspectRatio: '470 / 560', borderRadius: 20, overflow: 'hidden',
    position: 'relative', boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(239,235,224,0.06)`,
  },
  portraitImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },

  ticker: { borderTop: `1px solid rgba(239,235,224,0.1)`, borderBottom: `1px solid rgba(239,235,224,0.1)`, overflow: 'hidden', background: TEAL, padding: '11px 0' },
  tickerTrack: { display: 'flex', width: 'max-content', animation: 'ticker-scroll 22s linear infinite' },
  tickerSpan: { fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 2, color: CREAM, whiteSpace: 'nowrap', paddingRight: 0 },

  section: { padding: '90px 28px', maxWidth: maxW, margin: '0 auto' },
  sectionLabel: { fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 3, color: ORANGE, textTransform: 'uppercase', marginBottom: 14 },
  h2: { fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 'clamp(28px, 4vw, 46px)', lineHeight: 1.12, margin: '0 0 40px', maxWidth: 760 },
  bodyText: { fontSize: 16, lineHeight: 1.7, color: CREAM, opacity: 0.82, maxWidth: 460, marginBottom: 24 },

  cardsGrid: { display: 'grid', gap: 20 },
  card: {
    background: 'rgba(239,235,224,0.03)', border: '1px solid rgba(239,235,224,0.1)', borderRadius: 16,
    padding: '28px 24px', height: '100%', boxSizing: 'border-box',
  },
  cardIndex: { fontFamily: "'Space Mono', monospace", fontSize: 12, color: ORANGE, marginBottom: 18, letterSpacing: 1 },
  cardTitle: { fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 22, color: CREAM, marginBottom: 10, letterSpacing: 0.5 },
  cardText: { fontSize: 14.5, lineHeight: 1.6, color: CREAM, opacity: 0.72 },

  countdownSection: { background: 'rgba(20,58,61,0.18)', borderTop: '1px solid rgba(239,235,224,0.08)', borderBottom: '1px solid rgba(239,235,224,0.08)' },
  countdownGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, maxWidth: 520, margin: '0 auto' },
  countdownCell: {
    background: BG, border: `1px solid ${TEAL}`, borderRadius: 12, padding: '18px 8px', textAlign: 'center',
  },
  countdownNum: { fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 'clamp(28px, 4vw, 40px)', color: ORANGE },
  countdownLabel: { fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: CREAM, opacity: 0.6, marginTop: 6 },
  countdownNote: { fontFamily: "'Oswald', sans-serif", fontSize: 14, color: CREAM, opacity: 0.7, marginTop: 22 },

  inviteGrid: { display: 'grid', gap: 50, alignItems: 'center' },
  phoneFrame: {
    width: 240, aspectRatio: '1080/1440', borderRadius: 28, overflow: 'hidden', position: 'relative',
    border: '6px solid #1a1a1a', boxShadow: '0 30px 70px rgba(0,0,0,0.55)', transform: 'rotate(-3deg)',
    background: '#000',
  },
  phoneNotch: {
    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '38%', height: 16,
    background: '#1a1a1a', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, zIndex: 2,
  },
  phoneImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },

  finalSection: { padding: '110px 28px 130px', maxWidth: maxW, margin: '0 auto', textAlign: 'center' },
  finalPrice: { fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 'clamp(60px, 10vw, 110px)', color: ORANGE, margin: '18px 0' },

  footer: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '40px 28px 60px', borderTop: '1px solid rgba(239,235,224,0.08)' },
  footerIcon: { height: 30, width: 'auto', opacity: 0.85 },
  footerText: { fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: CREAM, opacity: 0.45, textTransform: 'uppercase' },
};
