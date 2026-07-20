'use client';

import React, { useEffect, useRef, useState } from 'react';

const ORANGE = '#D96A32';
const CREAM = '#EFEBE0';
const TEAL = '#143A3D';
const BG = '#0A0A0A';

const EVENT_DATE = new Date('2026-07-24T19:30:00-03:00');
const WHATSAPP_LINK = 'https://wa.me/message';

// Opacity/position tracks scroll continuously (no on/off snap) — same mechanic measured
// in the omni.chat reference: elements fade in gradually as they approach viewport-center,
// scrubbed frame-by-frame off scroll position instead of toggling once via IntersectionObserver.
function useScrollProgress(startVH = 0.88, endVH = 0.55) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * startVH;
      const end = vh * endVH;
      const p = (start - rect.top) / (start - end);
      setProgress(Math.max(0, Math.min(1, p)));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(compute);
      }
    };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [startVH, endVH]);
  return [ref, progress];
}

function ScrollFade({ as: Tag = 'div', offset = 0, className = '', style = {}, children }) {
  const [ref, progress] = useScrollProgress(0.9 - offset, 0.52 - offset);
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: progress,
        transform: `translateY(${(1 - progress) * 26}px)`,
      }}
    >
      {children}
    </Tag>
  );
}

// Starts/stops a timer only while the ref is on screen — drives the pinned carousel below.
function useAutoAdvance(count, intervalMs = 1800) {
  const ref = useRef(null);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let id = null;
    const start = () => {
      if (id) return;
      id = setInterval(() => setIndex(i => (i + 1) % count), intervalMs);
    };
    const stop = () => {
      if (id) clearInterval(id);
      id = null;
    };
    const obs = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0.4 });
    obs.observe(el);
    return () => {
      stop();
      obs.disconnect();
    };
  }, [count, intervalMs]);
  return [ref, index, setIndex];
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
    title: 'PERGUNTAR',
    text: 'Foi a primeira fase, e você já sabe fazer isso. O problema é que perguntar sozinho não escala mais.',
  },
  {
    title: 'DELEGAR',
    text: 'A IA pesquisa, compara, organiza e monitora por você — em tempo real, sem você acompanhar cada passo.',
  },
  {
    title: 'AUTOMATIZAR',
    text: 'Ela executa a tarefa inteira sozinha. É isso que separa quem usa IA de quem só conversa com ela.',
  },
];

const ORBIT_ITEMS = ['PESQUISAR', 'COMPARAR', 'ORGANIZAR', 'MONITORAR', 'EXECUTAR'];

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
              <p style={styles.kicker}>Tá na hora da IA ajudar você. Não só as empresas.</p>
            </div>

            <div className={`fadeUp ${heroIn ? 'in' : ''}`} style={{ transitionDelay: '90ms' }}>
              <div style={styles.eyebrow}>
                <span style={styles.eyebrowDot} />
                MOVEAI · INTENSIVÃO AO VIVO
              </div>
            </div>

            <h1 style={styles.h1}>
              <span className={`fadeUp ${heroIn ? 'in' : ''}`} style={{ transitionDelay: '180ms' }}>
                <span style={{ color: CREAM }}>INTENSIVÃO DE</span>
              </span>
              <span className={`fadeUp ${heroIn ? 'in' : ''}`} style={{ transitionDelay: '270ms' }}>
                <span style={{ color: CREAM }}>PRODUTIVIDADE</span>
              </span>
              <span className={`fadeUp ${heroIn ? 'in' : ''}`} style={{ transitionDelay: '360ms' }}>
                <span style={{ color: ORANGE }}>COM IA</span>
              </span>
            </h1>

            <div className={`fadeUp ${heroIn ? 'in' : ''}`} style={{ transitionDelay: '450ms' }}>
              <p style={styles.subhead}>
                Pare de perguntar. Comece a delegar e automatizar. Não é uma aula sobre ChatGPT —
                é uma nova forma de trabalhar com IA.
              </p>
            </div>

            <div className={`fadeUp ${heroIn ? 'in' : ''}`} style={{ transitionDelay: '540ms' }}>
              <div style={styles.dateBadge}>
                <div style={styles.dateBadgeMain}>24, 25 E 26 DE JULHO</div>
                <div style={styles.dateBadgeSub}>3 DIAS AO VIVO · 19H30</div>
              </div>
            </div>

            <div className={`fadeUp ${heroIn ? 'in' : ''}`} style={{ transitionDelay: '630ms' }}>
              <div style={styles.priceBlock}>
                <div style={styles.priceLabel}>POR APENAS</div>
                <div style={styles.priceValue}>R$ 2,00</div>
                <div style={styles.priceTag}>O mercado não espera. Ele substitui.</div>
              </div>
            </div>

            <div className={`fadeUp ${heroIn ? 'in' : ''}`} style={{ transitionDelay: '720ms' }}>
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

      {/* VALUE PROPS — pinned, auto-advancing carousel (mirrors the sticky card-swap found in the reference) */}
      <section style={styles.section}>
        <ScrollFade>
          <div style={styles.sectionLabel}>A DIFERENÇA QUE MUDA TUDO</div>
          <h2 style={styles.h2}>
            <span style={{ color: CREAM }}>VOCÊ VAI ENTENDER A DIFERENÇA ENTRE </span>
            <span style={{ color: ORANGE }}>PERGUNTAR, DELEGAR E AUTOMATIZAR</span>
          </h2>
        </ScrollFade>

        <ValueCarousel />

        <ScrollFade offset={0.1}>
          <div style={styles.bonusBox}>
            <div style={styles.bonusLabel}>// BÔNUS · CERTIFICADO</div>
            <div style={styles.bonusText}>
              Cada um dos 3 dias libera uma palavra-chave. Junte as três e destrave seu{' '}
              <strong style={{ color: CREAM }}>certificado de participação</strong> no dia 29/07.
            </div>
          </div>
        </ScrollFade>
      </section>

      {/* ORBIT — always-on rotation, independent of scroll (mirrors the integrations orbit found in the reference) */}
      <section style={{ ...styles.section, paddingTop: 20, paddingBottom: 40 }}>
        <ScrollFade style={{ textAlign: 'center' }}>
          <div style={{ ...styles.sectionLabel, justifyContent: 'center', display: 'flex' }}>O QUE A IA VAI FAZER POR VOCÊ</div>
        </ScrollFade>
        <OrbitDiagram />
      </section>

      {/* COUNTDOWN */}
      <section style={{ ...styles.section, ...styles.countdownSection }}>
        <ScrollFade>
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
          <div style={styles.countdownNote}>
            Vagas limitadas · valor de <strong style={{ color: CREAM }}>R$ 2,00</strong> só até o início do Intensivão.
          </div>
        </ScrollFade>
      </section>

      {/* CONVITE / SHARE */}
      <section style={styles.section}>
        <div className="inviteGrid" style={styles.inviteGrid}>
          <ScrollFade>
            <div style={styles.sectionLabel}>O CONVITE</div>
            <h2 style={styles.h2}>
              <span style={{ color: CREAM }}>ESSE É O CONVITE QUE </span>
              <span style={{ color: ORANGE }}>CIRCULA NO GRUPO</span>
            </h2>
            <p style={styles.bodyText}>
              Print, encaminhe ou mostre pra quem ainda tá adiando a decisão de usar IA no dia a dia.
              Todo mundo que chegar até o <strong style={{ color: CREAM, fontWeight: 700 }}>grupo secreto do WhatsApp</strong> entra
              com o mesmo acesso: <strong style={{ color: CREAM, fontWeight: 700 }}>R$ 2,00</strong> pelos 3 dias ao vivo.
            </p>
            <a href={WHATSAPP_LINK} style={{ ...styles.ctaButton, marginTop: 8 }}>ENTRAR NO GRUPO →</a>
          </ScrollFade>
          <ScrollFade offset={0.08} style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={styles.phoneFrame}>
              <div style={styles.phoneNotch} />
              <img src="/moveai/flyer-original.png" alt="Convite Intensivão MoveAI" style={styles.phoneImg} />
            </div>
          </ScrollFade>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={styles.finalSection}>
        <ScrollFade style={{ textAlign: 'center' }}>
          <h2 style={{ ...styles.h2, textAlign: 'center' }}>
            <span style={{ color: CREAM }}>O MERCADO NÃO ESPERA. </span>
            <span style={{ color: ORANGE }}>ELE SUBSTITUI.</span>
          </h2>
          <div style={styles.finalPrice}>R$ 2,00</div>
          <a href={WHATSAPP_LINK} style={{ ...styles.ctaButton, ...styles.ctaButtonLg }}>GARANTA SUA VAGA →</a>
          <div style={styles.ctaSub}>24, 25 e 26 de julho · 19h30 · ao vivo no grupo secreto do WhatsApp</div>
        </ScrollFade>
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
        .inviteGrid { grid-template-columns: 1fr 1fr; }

        @media (max-width: 860px) {
          .heroGrid { grid-template-columns: 1fr; }
          .heroGrid > div:last-child { order: -1; }
          .inviteGrid { grid-template-columns: 1fr; }
          .inviteGrid > div:last-child { order: -1; }
        }

        @media (max-width: 480px) {
          .countdownGrid { gap: 8px; }
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        .orbitRing { --orbit-r: 128px; animation: spin 32s linear infinite; }
        .orbitLabel { animation: spin-reverse 32s linear infinite; }
        @media (max-width: 560px) {
          .orbitRing { --orbit-r: 90px; }
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

// Pinned card that swaps content on its own timer, sliding the incoming slide in from the
// right while the outgoing one exits left — same mechanic as the sticky insight-card carousel
// found in the reference (pin + timed auto-advance, not a plain grid).
function ValueCarousel() {
  const [wrapRef, active, setActive] = useAutoAdvance(VALUE_PROPS.length, 2200);
  const n = VALUE_PROPS.length;

  return (
    <div style={styles.carouselWrap}>
      <div ref={wrapRef} style={styles.carouselSticky}>
        <div style={styles.carouselCardOuter}>
          {VALUE_PROPS.map((v, i) => {
            const rel = (i - active + n) % n;
            const x = rel === 0 ? 0 : rel === 1 ? 100 : -100;
            return (
              <div
                key={v.title}
                style={{
                  ...styles.carouselSlide,
                  transform: `translateX(${x}%)`,
                  opacity: rel === 0 ? 1 : 0,
                }}
              >
                <div style={styles.cardIndex}>{pad(i + 1)}</div>
                <div style={styles.cardTitle}>{v.title}</div>
                <div style={styles.cardText}>{v.text}</div>
              </div>
            );
          })}
        </div>
        <div style={styles.carouselDots}>
          {VALUE_PROPS.map((v, i) => (
            <button
              key={v.title}
              aria-label={v.title}
              onClick={() => setActive(i)}
              style={{ ...styles.carouselDot, ...(i === active ? styles.carouselDotActive : {}) }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Central MoveAI mark with the 5 capability labels revolving around it — a continuous CSS
// rotation that plays regardless of scroll, mirroring the always-on partner-logo orbit found
// in the reference. The ring spins; each label counter-spins so the text stays upright.
function OrbitDiagram() {
  const n = ORBIT_ITEMS.length;
  return (
    <div style={styles.orbitWrap}>
      <div className="orbitRing" style={styles.orbitRing}>
        {ORBIT_ITEMS.map((label, i) => {
          const angle = (360 / n) * i;
          return (
            <div
              key={label}
              style={{ ...styles.orbitNode, transform: `rotate(${angle}deg) translate(var(--orbit-r)) rotate(${-angle}deg)` }}
            >
              <div className="orbitLabel" style={styles.orbitLabel}>{label}</div>
            </div>
          );
        })}
      </div>
      <img src="/moveai/logo-icon.png" alt="MoveAI" style={styles.orbitCenter} />
    </div>
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
  kicker: {
    fontFamily: "'Oswald', sans-serif", fontWeight: 500, fontSize: 'clamp(16px, 1.6vw, 20px)',
    color: CREAM, opacity: 0.9, marginBottom: 16, maxWidth: 480, lineHeight: 1.3,
  },
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

  cardIndex: { fontFamily: "'Space Mono', monospace", fontSize: 12, color: ORANGE, marginBottom: 18, letterSpacing: 1 },
  cardTitle: { fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 22, color: CREAM, marginBottom: 10, letterSpacing: 0.5 },
  cardText: { fontSize: 14.5, lineHeight: 1.6, color: CREAM, opacity: 0.72 },

  carouselWrap: { position: 'relative', minHeight: '110vh' },
  carouselSticky: { position: 'sticky', top: '16vh', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  carouselCardOuter: {
    position: 'relative', width: '100%', maxWidth: 640, minHeight: 230, overflow: 'hidden',
    background: 'rgba(239,235,224,0.03)', border: '1px solid rgba(239,235,224,0.1)', borderRadius: 16,
  },
  carouselSlide: {
    position: 'absolute', inset: 0, padding: '30px 28px', display: 'flex', flexDirection: 'column',
    justifyContent: 'center', boxSizing: 'border-box',
    transition: 'transform .6s cubic-bezier(.65,0,.35,1), opacity .5s ease',
  },
  carouselDots: { display: 'flex', gap: 10, marginTop: 22 },
  carouselDot: {
    width: 9, height: 9, borderRadius: '50%', border: 'none', cursor: 'pointer',
    background: 'rgba(239,235,224,0.25)', padding: 0,
  },
  carouselDotActive: { background: ORANGE, boxShadow: `0 0 10px ${ORANGE}` },

  orbitWrap: { position: 'relative', width: 300, height: 300, margin: '30px auto 0' },
  orbitRing: { position: 'absolute', inset: 0 },
  orbitNode: {
    position: 'absolute', top: '50%', left: '50%', width: 118, height: 40, marginTop: -20, marginLeft: -59,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  orbitLabel: {
    fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 1.5, color: ORANGE,
    background: 'rgba(217,106,50,0.1)', border: `1px solid ${ORANGE}55`, borderRadius: 100,
    padding: '7px 14px', whiteSpace: 'nowrap',
  },
  orbitCenter: {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    height: 54, width: 'auto', filter: `drop-shadow(0 0 16px ${ORANGE}88)`,
  },

  bonusBox: {
    marginTop: 20, background: 'rgba(20,58,61,0.35)', border: `1px solid ${TEAL}`, borderRadius: 14,
    padding: '22px 26px',
  },
  bonusLabel: { fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 1.5, color: '#5FBFC4', marginBottom: 8 },
  bonusText: { fontSize: 15, lineHeight: 1.6, color: CREAM, opacity: 0.88, maxWidth: 620 },

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
