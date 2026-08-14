'use client';

import React, { useEffect, useRef, useState } from 'react';
import './style.css';

const WHATS = '5535991211213';

const TICKER_ITEMS = [
  'ESTRATÉGIA COM FOCO',
  'MARKETING COM PROPÓSITO',
  'CRESCIMENTO CONTÍNUO',
  'RESULTADOS REAIS',
  '+R$3M EM VENDAS GERADAS',
  '+60 EMPRESAS TRANSFORMADAS',
];

const STACK_CARDS = [
  {
    img: '/diagnostico/rhope-plate.jpg',
    tag: '01 · IDENTIDADE',
    title: 'MARCA COM PESO.',
    d: 'Não escondemos a cara. Presença real, física, construída pra durar — não é filtro de story que some em 24h.',
  },
  {
    img: '/diagnostico/funil-marketing.jpg',
    tag: '02 · MÉTODO',
    title: 'UM FUNIL. CINCO ETAPAS.',
    d: 'Atrair, conectar, converter, encantar, escalar. Cada etapa medida, cada etapa otimizada — nada roda no escuro.',
  },
  {
    img: '/diagnostico/crescimento-acidente.jpg',
    tag: '03 · FILOSOFIA',
    title: 'CRESCIMENTO NÃO ACONTECE POR ACIDENTE.',
    d: 'Planejar. Executar. Medir. Otimizar. Escalar. Repetir. É processo, não sorte.',
  },
  {
    img: '/diagnostico/rhope-collage.jpg',
    tag: '04 · APLICAÇÃO',
    title: 'REAL NA PRÁTICA, NÃO SÓ NO PAPEL.',
    d: 'Da parede do escritório ao cartão de visita — cada ponto de contato da sua marca fala a mesma língua.',
  },
];

const PILLARS = [
  { t: 'Transparência', d: 'Clareza total em cada entrega, relatório e decisão compartilhada.' },
  { t: 'Prazos', d: 'Combinado é compromisso. Entregamos no tempo certo, sempre.' },
  { t: 'Resolução', d: 'Erramos? Resolvemos. Sem enrolação, sem desculpa, sem braços curtos.' },
  { t: 'Comunicação', d: 'O cliente nunca fica sem resposta. Presença constante e proativa.' },
  { t: 'Foco em Vendas', d: 'Cada ação tem um objetivo: gerar receita e crescimento real.' },
  { t: 'Sem Limites', d: 'Fazemos o necessário para entregar o resultado prometido.' },
];

const TESTIMONIALS = [
  {
    txt: 'Fiz o diagnóstico achando que era só mais um pitch de agência. Em 1 hora o Gian mostrou exatamente onde eu tava jogando dinheiro fora. Em 4 meses parei de recorrer ao cheque especial pela primeira vez em anos.',
    nm: 'Mariana Costa', rl: 'CEO — TechFlow SaaS',
  },
  {
    txt: 'Fomos de R$80k pra R$350k de faturamento mensal depois de aplicar o que saiu daquela primeira conversa gratuita. Direto, sem enrolação, sem venda forçada.',
    nm: 'Rafael Mendes', rl: 'Diretor — Estúdio Forma',
  },
  {
    txt: 'O diagnóstico da Rhope é o raio-x mais honesto que já recebi sobre meu próprio negócio. Zero achismo, tudo baseado em número.',
    nm: 'Juliana Prado', rl: 'Fundadora — Clínica Viva',
  },
];

const FAQS = [
  { q: 'O diagnóstico é mesmo gratuito?', a: 'Sim, 100%. 1 hora de conversa direta com o Gian, sem custo e sem letra miúda. Você só paga se decidir contratar a Rhope depois — e isso é totalmente opcional.' },
  { q: 'Vocês vão me empurrar uma venda?', a: 'Não é esse o jogo. Você sai da chamada com um diagnóstico real da sua estrutura de marketing. Contratar a Rhope é escolha sua, não pré-requisito para o diagnóstico.' },
  { q: 'Preciso já ter marketing rodando pra participar?', a: 'Não. Atendemos desde quem está começando do zero até quem já fatura alto mas sente que o marketing está "morno" e sem direção.' },
  { q: 'Quanto tempo até eu ser chamado no WhatsApp?', a: 'Em até algumas horas úteis depois do cadastro, alguém do time confirma seu horário direto com o Gian.' },
  { q: 'Como funciona a análise dos 3 pilares?', a: 'Olhamos estratégia e posicionamento, execução (tráfego, conteúdo, funil) e dados — as três frentes que decidem se seu marketing dá lucro ou só dá curtida.' },
  { q: 'É online ou presencial?', a: '100% online, por vídeo chamada. Você participa de onde estiver, sem perder o dia de trabalho.' },
];

function waLink(text) {
  return `https://wa.me/${WHATS}?text=${encodeURIComponent(text)}`;
}

function trackPixel(event, params) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', event, params);
  }
}

export default function DiagnosticoPage() {
  const [stuck, setStuck] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [form, setForm] = useState({ empresa: '', whats: '', email: '' });
  const stackRefs = useRef([]);

  // nav stuck state
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // reveal on scroll
  useEffect(() => {
    const els = document.querySelectorAll('.dg-rv');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // CD-stack overlap effect: cards dim/scale as the next one climbs over them
  useEffect(() => {
    let raf;
    const cards = stackRefs.current.filter(Boolean);
    const update = () => {
      for (let i = 0; i < cards.length - 1; i++) {
        const cur = cards[i];
        const next = cards[i + 1];
        if (!cur || !next) continue;
        const curRect = cur.getBoundingClientRect();
        const nextRect = next.getBoundingClientRect();
        const overlap = curRect.bottom - nextRect.top;
        const progress = Math.max(0, Math.min(1, overlap / curRect.height));
        const dir = i % 2 === 0 ? -1 : 1;
        cur.style.transform = `scale(${1 - progress * 0.05}) translateY(${-progress * 14}px) rotate(${dir * progress * 1.1}deg)`;
        cur.style.filter = `brightness(${1 - progress * 0.4})`;
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  function submitHero(e) {
    e.preventDefault();
    if (!form.empresa.trim() || !form.whats.trim()) {
      alert('Por favor, preencha o nome da empresa e o WhatsApp.');
      return;
    }
    const msg =
      `Olá Gian! Quero fazer o diagnóstico gratuito da Rhope.\n\n` +
      `Empresa: ${form.empresa}\n` +
      `E-mail: ${form.email || 'Não informado'}\n` +
      `WhatsApp: ${form.whats}`;
    trackPixel('Lead', { content_name: 'diagnostico_hero_form' });
    window.open(waLink(msg), '_blank');
  }

  function indicarAmigo() {
    const msg =
      `Vi esse diagnóstico gratuito de marketing da Rhope e lembrei de você. ` +
      `1 hora, grátis, sem compromisso de compra — eles já ajudaram +60 empresas a virar a chave no digital. Dá uma olhada: ${typeof window !== 'undefined' ? window.location.href : 'https://rhope.com.br/diagnostico'}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <div className="dg">
      <div className="dg-grain" />

      {/* NAV */}
      <nav className={`dg-nav${stuck ? ' stuck' : ''}`}>
        <a href="#topo" className="dg-nav-brand">
          <img src="/diagnostico/rhope-mark.png" alt="Rhope" className="dg-nav-mark" />
          <span className="dg-nav-word">RHOPE</span>
        </a>
        <a href={waLink('Olá! Quero fazer o diagnóstico gratuito da Rhope.')} target="_blank" rel="noreferrer" className="dg-nav-cta"
          onClick={() => trackPixel('Contact', { content_name: 'nav_cta' })}>
          Diagnóstico gratuito
        </a>
      </nav>

      {/* HERO */}
      <header id="topo" className="dg-hero">
        <img src="/diagnostico/crescimento-acidente.jpg" alt="" className="dg-hero-bg" />
        <div className="dg-hero-ov" />
        <div className="dg-hero-in">
          <div>
            <div className="dg-eyebrow">1 hora · Diagnóstico gratuito · Zero obrigação de compra</div>
            <h1 className="dg-h1">
              <span className="dg-hw" style={{ animationDelay: '.1s' }}><span style={{ animationDelay: '.15s' }}>Eu aposto que</span></span><br />
              <span className="dg-hw"><span style={{ animationDelay: '.3s' }}>seu marketing</span></span><br />
              <span className="dg-hw o"><span style={{ animationDelay: '.45s' }}>não passa</span></span>{' '}
              <span className="dg-hw"><span style={{ animationDelay: '.6s' }}>nesse teste.</span></span>
            </h1>
            <p className="dg-sub">
              Vou abrir a estrutura do seu marketing e te mostrar, na cara, se seu time joga <strong>pra ganhar</strong> — ou só pra não quebrar. Em 1 hora, sem te vender nada.
            </p>
            <p className="dg-sub">
              É o mesmo raio-x que já ajudou <strong>+60 empresas</strong> a pararem de pagar boleto no cheque especial. Mais de <span className="o">R$3 milhões</span> em resultado real pra provar.
            </p>
            <div className="dg-hero-proof">
              <div className="dg-proof-item"><div className="dg-proof-v">R$3M+</div><div className="dg-proof-l">Em vendas geradas</div></div>
              <div className="dg-proof-item"><div className="dg-proof-v">60+</div><div className="dg-proof-l">Empresas transformadas</div></div>
              <div className="dg-proof-item"><div className="dg-proof-v">1H</div><div className="dg-proof-l">Sem custo, sem enrolação</div></div>
            </div>
          </div>

          <form className="dg-form-card" onSubmit={submitHero}>
            <div className="dg-form-tag">Quero meu diagnóstico</div>
            <p className="dg-form-tagline">Preencha e receba a confirmação do seu horário no WhatsApp.</p>
            <div className="dg-field">
              <label htmlFor="empresa">Nome da empresa</label>
              <input id="empresa" placeholder="Ex: Clínica Exemplo" value={form.empresa}
                onChange={e => setForm(f => ({ ...f, empresa: e.target.value }))} />
            </div>
            <div className="dg-field">
              <label htmlFor="whats">Seu WhatsApp</label>
              <input id="whats" type="tel" placeholder="(35) 9 9999-9999" value={form.whats}
                onChange={e => setForm(f => ({ ...f, whats: e.target.value }))} />
            </div>
            <div className="dg-field">
              <label htmlFor="email">Seu e-mail</label>
              <input id="email" type="email" placeholder="voce@empresa.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <button type="submit" className="dg-form-btn">Garantir meu horário →</button>
            <p className="dg-form-note">Sem spam. Sem obrigação de compra. 100% gratuito.</p>
          </form>
        </div>

        <div className="dg-scr"><span>Role para ver</span><div className="dg-scr-line" /></div>
      </header>

      {/* TICKER */}
      <div className="dg-ticker">
        <div className="dg-ticker-t">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <React.Fragment key={i}>
              <span className="dg-t-item">{t}</span><span className="dg-t-item dg-t-sep">·</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* TEASER */}
      <section className="dg-teaser dg-section">
        <div className="dg-teaser-hd dg-rv">
          <div className="dg-eyebrow2">Por que isso é diferente</div>
          <h2 className="dg-h2">O segredo que a gente<br />guarda <span className="o">a sete chaves.</span></h2>
          <p>Não é pitch de vendas disfarçado de diagnóstico. É a mesma auditoria que aplicamos com nossos parceiros comerciais de alto nível — aberta pra você, por 1 hora, sem custo.</p>
        </div>
        <div className="dg-teaser-grid dg-rv d2">
          <div className="dg-teaser-card">
            <div className="dg-teaser-num">01</div>
            <h3 className="dg-teaser-t">Raio-X real</h3>
            <p className="dg-teaser-d">Analisamos os 3 pilares que decidem se seu marketing dá lucro ou só dá curtida: estratégia, execução e dados.</p>
          </div>
          <div className="dg-teaser-card">
            <div className="dg-teaser-num">02</div>
            <h3 className="dg-teaser-t">Sem achismo</h3>
            <p className="dg-teaser-d">Nada de opinião solta. Mostramos com número onde seu dinheiro está vazando — e onde ele pode voltar multiplicado.</p>
          </div>
          <div className="dg-teaser-card">
            <div className="dg-teaser-num">03</div>
            <h3 className="dg-teaser-t">Zero compromisso</h3>
            <p className="dg-teaser-d">Você sai da chamada com um plano claro. Contratar a Rhope é escolha sua — não é condição do diagnóstico.</p>
          </div>
        </div>
      </section>

      {/* STACK — pilha estilo capas de CD */}
      <section className="dg-stack-section">
        <div className="dg-stack-hd dg-rv">
          <div className="dg-eyebrow2">Como a Rhope pensa</div>
          <h2 className="dg-h2">Método. <span className="o">Não palpite.</span></h2>
          <p>Quatro princípios que sustentam cada estratégia que colocamos de pé — role para ver.</p>
        </div>
        <div className="dg-stack-wrap">
          {STACK_CARDS.map((c, i) => (
            <div className="dg-stack-card" key={i} ref={el => (stackRefs.current[i] = el)}>
              <div className="dg-stack-media">
                <img src={c.img} alt={c.title} loading="lazy" />
                <div className="dg-stack-grad" />
                <div className="dg-stack-num">{c.tag}</div>
                <div className="dg-stack-txt">
                  <h3 className="dg-stack-t">{c.title}</h3>
                  <p className="dg-stack-d">{c.d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="dg-stack-spacer" />
      </section>

      {/* MANIFESTO */}
      <div className="dg-manifesto dg-rv">
        <div className="dg-manifesto-in">
          <div className="dg-manifesto-eyebrow">O manifesto Rhope</div>
          <div className="dg-manifesto-txt">
            Marketing pequeno é para quem aceita <span className="o">resultado pequeno.</span><br />
            <span className="d">A Rhope não veio para ajustar campanhas.</span><br />
            Veio para <span className="o">dominar mercados.</span>
          </div>
          <p className="dg-manifesto-foot">Não temos braços curtos. Não damos desculpa. Não aceitamos o mediano. Nossa marca não é só visual — é postura.</p>
        </div>
      </div>

      {/* STATS */}
      <section className="dg-stats">
        <div className="dg-stats-grid dg-rv">
          <div className="dg-stat">
            <div className="dg-stat-v">R$3M+</div>
            <div className="dg-stat-l">Em vendas geradas</div>
            <div className="dg-stat-d">Faturamento documentado gerado para clientes Rhope</div>
          </div>
          <div className="dg-stat">
            <div className="dg-stat-v">60+</div>
            <div className="dg-stat-l">Empresas transformadas</div>
            <div className="dg-stat-d">Já viraram a chave no digital com o nosso método</div>
          </div>
          <div className="dg-stat">
            <div className="dg-stat-v">1H</div>
            <div className="dg-stat-l">Diagnóstico gratuito</div>
            <div className="dg-stat-d">Sem custo, sem obrigação de compra</div>
          </div>
          <div className="dg-stat">
            <div className="dg-stat-v">0</div>
            <div className="dg-stat-l">Enrolação</div>
            <div className="dg-stat-d">Direto ao ponto, sempre</div>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="dg-founder">
        <div className="dg-founder-wrap">
          <div className="dg-founder-card dg-rv">
            <img src="/diagnostico/gian-portrait.jpg" alt="Gian Esperança" className="dg-founder-photo" />
            <div className="dg-founder-grid" />
            <div className="dg-founder-glow" />
            <div className="dg-founder-badge">Estrategista Digital · Fundador</div>
          </div>
          <div className="dg-rv d2">
            <div className="dg-eyebrow2">Quem faz o diagnóstico</div>
            <h2 className="dg-h2">Gian <span className="o">Esperança.</span></h2>
            <div className="dg-founder-line" />
            <p className="dg-founder-bio">Já abriu a estrutura de <strong>+60 empresas</strong> e ajudou a virar a chave no digital — com método, dado e sem achismo. Pessoalmente, ele conduz o diagnóstico gratuito de 1 hora e mostra, sem filtro, onde seu marketing está deixando dinheiro na mesa.</p>
            <p className="dg-founder-bio">Nada de vendedor de curso. É quem constrói a estratégia, olha o número e assume o resultado junto com você.</p>
            <div className="dg-founder-stats">
              <div><div className="dg-fstat-v">+60</div><div className="dg-fstat-l">Empresas atendidas</div></div>
              <div><div className="dg-fstat-v">R$3M+</div><div className="dg-fstat-l">Em vendas geradas</div></div>
              <div><div className="dg-fstat-v">1H</div><div className="dg-fstat-l">Diagnóstico gratuito</div></div>
            </div>
            <a href={waLink('Olá Gian! Quero agendar meu diagnóstico gratuito.')} target="_blank" rel="noreferrer" className="dg-btn-p"
              onClick={() => trackPixel('Contact', { content_name: 'founder_cta' })}>
              Falar com o Gian agora →
            </a>
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section className="dg-pillars">
        <div className="dg-pillars-hd dg-rv">
          <div className="dg-eyebrow2">Cultura</div>
          <h2 className="dg-h2">Os pilares que<br />nos <span className="o">guiam.</span></h2>
          <p>Nossa marca não é só visual — é postura.</p>
        </div>
        <div className="dg-pillars-grid dg-rv d2">
          {PILLARS.map((p, i) => (
            <div className="dg-pillar" key={i}>
              <div className="dg-pillar-ic">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="dg-pillar-t">{p.t}</h3>
              <p className="dg-pillar-d">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTEMUNHOS */}
      <section className="dg-testi">
        <div className="dg-rv">
          <div className="dg-eyebrow2">Depoimentos</div>
          <h2 className="dg-h2">Quem já fez o<br /><span className="o">diagnóstico.</span></h2>
        </div>
        <div className="dg-testi-grid dg-rv d2">
          {TESTIMONIALS.map((t, i) => (
            <div className="dg-ti-card" key={i}>
              <div className="dg-ti-qm">&ldquo;</div>
              <p className="dg-ti-txt">{t.txt}</p>
              <div className="dg-ti-auth">
                <div className="dg-ti-av">{t.nm[0]}</div>
                <div><div className="dg-ti-nm">{t.nm}</div><div className="dg-ti-rl">{t.rl}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="dg-faq">
        <div className="dg-rv">
          <div className="dg-eyebrow2">Dúvidas frequentes</div>
          <h2 className="dg-h2">Antes de você<br /><span className="o">clicar no botão.</span></h2>
        </div>
        <div className="dg-faq-grid dg-rv d2">
          <div>
            {FAQS.slice(0, 3).map((f, i) => (
              <div className={`dg-fi${openFaq === i ? ' open' : ''}`} key={i}>
                <button className="dg-fi-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  {f.q}<span className="dg-fi-tg">+</span>
                </button>
                <div className="dg-fi-a">{f.a}</div>
              </div>
            ))}
          </div>
          <div>
            {FAQS.slice(3).map((f, i) => {
              const idx = i + 3;
              return (
                <div className={`dg-fi${openFaq === idx ? ' open' : ''}`} key={idx}>
                  <button className="dg-fi-q" onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}>
                    {f.q}<span className="dg-fi-tg">+</span>
                  </button>
                  <div className="dg-fi-a">{f.a}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="dg-final">
        <div className="dg-final-bg" />
        <div className="dg-final-in dg-rv">
          <h2 className="dg-final-h2">Sua empresa vai virar a chave<br /><span className="o">— ou vai ficar pra trás?</span></h2>
          <p className="dg-final-sub">1 hora. Grátis. Sem comprar nada. Escolha um dos botões abaixo: ajude o seu negócio, ajude o de um amigo empresário — ou os dois.</p>
          <div className="dg-final-btns">
            <a href={waLink('Olá Gian! Quero fazer o diagnóstico gratuito da Rhope.')} target="_blank" rel="noreferrer" className="dg-btn-p"
              onClick={() => trackPixel('Contact', { content_name: 'final_cta' })}>
              Quero meu diagnóstico gratuito →
            </a>
            <button onClick={indicarAmigo} className="dg-btn-g" style={{ cursor: 'pointer' }}>
              Indicar um amigo empresário
            </button>
          </div>
          <div className="dg-final-note">Vagas limitadas por semana — o Gian conduz pessoalmente cada diagnóstico.</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="dg-footer">
        <div className="dg-footer-in">
          <div className="dg-footer-brand">
            <img src="/diagnostico/rhope-mark.png" alt="Rhope" className="dg-footer-mark" />
            <span className="dg-footer-word">RHOPE</span>
          </div>
          <div className="dg-footer-copy">© 2025 Rhope Assessoria de Marketing. Todos os direitos reservados.</div>
          <div className="dg-footer-lnks">
            <a href="https://instagram.com/rhope.marketing" target="_blank" rel="noreferrer">Instagram</a>
            <a href={waLink('Olá!')} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href="mailto:contato@rhope.com.br">E-mail</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
