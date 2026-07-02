'use client';

import React, { useState } from 'react';
import NavBar from '../../components/NavBar';
import { useTheme } from '../../components/ThemeContext';
import { fmt, themeVars } from '../../lib/rhope';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdsPage() {
  const { theme, toggleTheme } = useTheme();
  const vars = themeVars(theme === 'dark');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const analyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      let payload = { type: 'text', text };
      if (file) {
        const data = await fileToBase64(file);
        if (file.type === 'application/pdf') {
          payload = { type: 'pdf', data };
        } else if (file.type.startsWith('image/')) {
          payload = { type: 'image', data, mediaType: file.type };
        }
      }

      const res = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao analisar relatório.');
      setResult(data);
    } catch (e) {
      setError(e.message || 'Erro desconhecido.');
    } finally {
      setLoading(false);
    }
  };

  const card = {
    background: vars.surface,
    border: `1px solid ${vars.border}`,
    borderRadius: 16,
    padding: 22,
    boxShadow: `0 2px 0 ${vars.sh1}, 0 10px 30px ${vars.shl}`,
  };

  const input = {
    width: '100%',
    boxSizing: 'border-box',
    background: vars.surfaceH,
    color: vars.text,
    border: `1px solid ${vars.border}`,
    borderRadius: 12,
    padding: 14,
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
  };

  const metric = (label, value) => (
    <div style={card}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: vars.textMuted, letterSpacing: 2, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 28, fontWeight: 700, color: vars.orange, marginTop: 8 }}>{value}</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: vars.bg, color: vars.text, fontFamily: "'Inter', sans-serif" }}>
      <NavBar theme={theme} toggleTheme={toggleTheme} />
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '28px 28px 70px' }}>
        <div style={{ fontFamily: "'Space Mono', monospace", color: vars.orange, letterSpacing: 3, textTransform: 'uppercase', fontSize: 11, marginBottom: 12 }}>Ads Intelligence</div>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 42, margin: '0 0 8px' }}>Análise de relatório de anúncios</h1>
        <p style={{ color: vars.textDim, margin: '0 0 24px' }}>Envie um PDF, print ou texto de relatório para a IA extrair métricas e insights.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 18 }}>
          <section style={card}>
            <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", color: vars.textMuted, fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>ARQUIVO DO RELATÓRIO</label>
            <input type="file" accept="image/*,application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} style={{ ...input, marginBottom: 16 }} />

            <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", color: vars.textMuted, fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>OU COLE O TEXTO</label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={12} placeholder="Cole aqui os dados do relatório: investimento, cliques, leads, vendas, CTR, CPC, CPM..." style={{ ...input, resize: 'vertical' }} />

            <button onClick={analyze} disabled={loading || (!file && !text.trim())} style={{ marginTop: 16, width: '100%', padding: '14px 18px', borderRadius: 12, border: `1px solid ${vars.borderH}`, background: vars.orange, color: '#fff', fontFamily: "'Oswald', sans-serif", letterSpacing: 1.5, cursor: 'pointer', opacity: loading ? .65 : 1 }}>
              {loading ? 'ANALISANDO...' : 'ANALISAR RELATÓRIO'}
            </button>

            {error && <div style={{ marginTop: 14, color: vars.red, fontSize: 13 }}>{error}</div>}
          </section>

          <section style={card}>
            <div style={{ fontFamily: "'Space Mono', monospace", color: vars.orange, letterSpacing: 3, textTransform: 'uppercase', fontSize: 10, marginBottom: 10 }}>Resumo</div>
            {!result && <p style={{ color: vars.textMuted, lineHeight: 1.6 }}>O resultado aparecerá aqui após a análise. Configure `ANTHROPIC_API_KEY` na Vercel para essa aba funcionar em produção.</p>}
            {result && (
              <div style={{ display: 'grid', gap: 12 }}>
                {metric('Investimento', fmt(result.investimento_total))}
                {metric('Receita', fmt(result.receita_total))}
                {metric('Leads', result.leads_total || 0)}
                {metric('ROAS', Number(result.roas || 0).toFixed(2))}
              </div>
            )}
          </section>
        </div>

        {result && (
          <section style={{ ...card, marginTop: 18 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", color: vars.orange, letterSpacing: 3, textTransform: 'uppercase', fontSize: 10, marginBottom: 10 }}>Insights da IA</div>
            <ul style={{ color: vars.textDim, lineHeight: 1.7 }}>
              {(result.insights || []).map((insight, i) => <li key={i}>{insight}</li>)}
            </ul>
            <pre style={{ overflowX: 'auto', background: vars.surfaceH, border: `1px solid ${vars.border}`, borderRadius: 12, padding: 14, color: vars.textDim }}>{JSON.stringify(result, null, 2)}</pre>
          </section>
        )}
      </main>
    </div>
  );
}
