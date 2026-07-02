'use client';

import React, { useState, useEffect, useMemo } from 'react';
import NavBar from '../components/NavBar';
import { useTheme } from '../components/ThemeContext';
import { sbFetch, sbPatch, fmt, fmtShort, themeVars } from '../lib/rhope';

const STAGES = [
  { key: 'lead_capturado', label: 'Lead Capturado', phase: 'Comercial', color: '#D96A32' },
  { key: 'diagnostico_agendado', label: 'Diagnóstico Agendado', phase: 'Comercial', color: '#D96A32' },
  { key: 'proposta_enviada', label: 'Proposta Enviada', phase: 'Comercial', color: '#D96A32' },
  { key: 'negociacao', label: 'Negociação', phase: 'Comercial', color: '#D96A32' },
  { key: 'fechado_onboarding', label: 'Fechado — Onboarding', phase: 'Onboarding', color: '#2DD4BF' },
  { key: 'em_operacao', label: 'Em Operação', phase: 'Operação', color: '#4ADE80' },
  { key: 'em_risco', label: 'Em Risco', phase: 'Retenção', color: '#FBBF24' },
  { key: 'perdido_cancelado', label: 'Perdido/Cancelado', phase: '—', color: '#F87171' },
];
const STAGE_MAP = Object.fromEntries(STAGES.map(s => [s.key, s]));

export default function PipelinePage() {
  const { theme, toggleTheme } = useTheme();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [filterStage, setFilterStage] = useState('ALL');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sbFetch(
        'deals?select=id,title,stage,value,payment_day,expected_close,notes,updated_at,created_at,contacts(id,name,company,phone,email,segment,source)&order=payment_day.asc.nullslast'
      );
      setDeals(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const kpis = useMemo(() => {
    const ativos = deals.filter(d => d.stage === 'em_operacao');
    const risco = deals.filter(d => d.stage === 'em_risco');
    const comercial = deals.filter(d => ['lead_capturado', 'diagnostico_agendado', 'proposta_enviada', 'negociacao'].includes(d.stage));
    const mrr = ativos.reduce((s, d) => s + Number(d.value || 0), 0);
    const mrrRisco = risco.reduce((s, d) => s + Number(d.value || 0), 0);
    const pipelineValue = comercial.reduce((s, d) => s + Number(d.value || 0), 0);
    return { mrr, mrrRisco, pipelineValue, countAtivos: ativos.length, countRisco: risco.length, countComercial: comercial.length, countTotal: deals.length };
  }, [deals]);

  const byStage = useMemo(() => {
    const map = {};
    STAGES.forEach(s => { map[s.key] = []; });
    deals.forEach(d => { if (map[d.stage]) map[d.stage].push(d); });
    return map;
  }, [deals]);

  const filteredDeals = useMemo(() => {
    let f = deals;
    if (filterStage !== 'ALL') f = f.filter(d => d.stage === filterStage);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      f = f.filter(d => (d.contacts?.company || '').toLowerCase().includes(q) || (d.title || '').toLowerCase().includes(q));
    }
    return f;
  }, [deals, filterStage, search]);

  const paymentCalendar = useMemo(() => {
    const days = {};
    deals.filter(d => d.stage === 'em_operacao' && d.payment_day).forEach(d => {
      const day = d.payment_day;
      if (!days[day]) days[day] = { total: 0, clients: [] };
      days[day].total += Number(d.value || 0);
      days[day].clients.push(d.contacts?.company || d.title);
    });
    return Object.entries(days).sort((a, b) => Number(a[0]) - Number(b[0]));
  }, [deals]);

  const moveStage = async (deal, newStage) => {
    setSaving(true);
    try {
      await sbPatch(`deals?id=eq.${deal.id}`, { stage: newStage });
      setDeals(prev => prev.map(d => d.id === deal.id ? { ...d, stage: newStage } : d));
      setToast({ type: 'success', msg: `${deal.contacts?.company || deal.title} movido para ${STAGE_MAP[newStage].label}` });
      setSelectedDeal(prev => prev && prev.id === deal.id ? { ...prev, stage: newStage } : prev);
    } catch (e) {
      setToast({ type: 'error', msg: 'Erro ao mover: ' + e.message });
    } finally {
      setSaving(false);
    }
  };

  const isDark = theme === 'dark';
  const vars = themeVars(isDark);

  const styles = {
    app: { minHeight: '100vh', background: vars.bg, color: vars.text, fontFamily: "'Inter', sans-serif", transition: 'background .3s,color .3s' },
    main: { padding: '24px 28px 60px', maxWidth: 1400, margin: '0 auto' },
    sectionLabel: { fontFamily: "'Space Mono', monospace", fontSize: 10, color: vars.orange, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 },
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 13, marginBottom: 26 },
    kpiCard: { borderRadius: 12, padding: '18px 17px', background: vars.surface, border: `1px solid ${vars.border}`, backdropFilter: 'blur(6px)', boxShadow: `0 2px 0 ${vars.sh1}, 0 8px 26px ${vars.shl}`, position: 'relative', overflow: 'hidden' },
    kpiLabel: { fontFamily: "'Space Mono', monospace", fontSize: 9, color: vars.textMuted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 7 },
    kpiDelta: { fontFamily: "'Space Mono', monospace", fontSize: 9, color: vars.textMuted, marginTop: 5 },
    boardWrap: { display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12, marginBottom: 28 },
    stageCol: { minWidth: 240, flex: '0 0 240px' },
    stageHead: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '8px 12px', background: vars.surface, borderRadius: 8, border: `1px solid ${vars.border}` },
    stageDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
    stageTitle: { fontFamily: "'Oswald', sans-serif", fontWeight: 500, fontSize: 12, letterSpacing: 1, flex: 1, color: vars.text },
    stageCount: { fontFamily: "'Space Mono', monospace", fontSize: 10, color: vars.textMuted },
    dealCard: { background: vars.surface, border: `1px solid ${vars.border}`, borderRadius: 10, padding: '12px 14px', marginBottom: 8, cursor: 'pointer', transition: 'all .2s', boxShadow: `0 2px 0 ${vars.sh1}, 0 4px 14px ${vars.shl}` },
    dealName: { fontFamily: "'Oswald', sans-serif", fontWeight: 500, fontSize: 13, color: vars.text, marginBottom: 4 },
    dealValue: { fontFamily: "'Space Mono', monospace", fontSize: 12, color: vars.orange },
    filtersRow: { display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' },
    chip: { padding: '6px 14px', borderRadius: 100, cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 1, border: `1px solid ${vars.border}`, background: vars.surface, color: vars.textMuted, transition: 'all .2s' },
    chipActive: { color: vars.orange, borderColor: vars.borderH, background: 'rgba(217,106,50,0.08)' },
    searchInput: { flex: 1, minWidth: 200, padding: '9px 14px', borderRadius: 8, border: `1px solid ${vars.border}`, background: vars.surface, color: vars.text, fontFamily: "'Inter', sans-serif", fontSize: 13, outline: 'none' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', fontFamily: "'Space Mono', monospace", fontSize: 9, color: vars.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', padding: '10px 14px', borderBottom: `1px solid ${vars.border}` },
    td: { padding: '13px 14px', borderBottom: `1px solid ${vars.border}`, fontSize: 13, color: vars.textDim },
    tableCard: { background: vars.surface, border: `1px solid ${vars.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: `0 2px 0 ${vars.sh1}, 0 10px 30px ${vars.shl}` },
    stageBadge: { display: 'inline-block', padding: '3px 10px', borderRadius: 100, fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 0.5 },
    calendarGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 10, marginBottom: 28 },
    calDay: { background: vars.surface, border: `1px solid ${vars.border}`, borderRadius: 10, padding: '14px 14px', boxShadow: `0 2px 0 ${vars.sh1}, 0 6px 18px ${vars.shl}` },
    calDayNum: { fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 22, color: vars.orange },
    calDayVal: { fontFamily: "'Space Mono', monospace", fontSize: 12, color: vars.text, marginTop: 4 },
    calDayClients: { fontSize: 10, color: vars.textMuted, marginTop: 6, lineHeight: 1.5 },
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 },
    modal: { background: isDark ? '#0F0F0F' : '#FBFAF7', border: `1px solid ${vars.borderH}`, borderRadius: 16, padding: 28, maxWidth: 440, width: '100%', boxShadow: `0 30px 80px ${vars.shl}` },
    modalTitle: { fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 20, color: vars.text, marginBottom: 4 },
    modalSub: { fontSize: 12, color: vars.textMuted, marginBottom: 20 },
    stageOption: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', marginBottom: 6, border: `1px solid ${vars.border}`, background: vars.surface, fontSize: 13, transition: 'all .15s' },
    toast: { position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 300, padding: '12px 22px', borderRadius: 10, fontSize: 13, fontFamily: "'Inter', sans-serif", boxShadow: `0 8px 26px ${vars.shl}`, border: `1px solid ${vars.border}`, background: isDark ? 'rgba(8,8,8,0.97)' : 'rgba(255,255,255,0.97)' },
  };

  return (
    <div style={styles.app}>
      <NavBar theme={theme} toggleTheme={toggleTheme} />

      <main style={styles.main}>
        {loading && <div style={{ textAlign: 'center', padding: 60, fontFamily: "'Space Mono', monospace", fontSize: 12, color: vars.orange, letterSpacing: 2 }}>CARREGANDO DADOS DO CRM...</div>}
        {error && <div style={{ textAlign: 'center', padding: 40, color: vars.red, fontSize: 13 }}>Erro ao carregar: {error}<br /><button style={{ ...styles.chip, marginTop: 12 }} onClick={load}>Tentar novamente</button></div>}

        {!loading && !error && (
          <>
            <div style={styles.sectionLabel}>Visão Geral</div>
            <div style={styles.kpiGrid}>
              <div style={styles.kpiCard}>
                <div style={styles.kpiLabel}>MRR Ativo</div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 25, color: vars.green }}>{fmtShort(kpis.mrr)}</div>
                <div style={styles.kpiDelta}>{kpis.countAtivos} clientes em operação</div>
              </div>
              <div style={styles.kpiCard}>
                <div style={styles.kpiLabel}>Pipeline Comercial</div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 25, color: vars.orange }}>{fmtShort(kpis.pipelineValue)}</div>
                <div style={styles.kpiDelta}>{kpis.countComercial} negócios em andamento</div>
              </div>
              <div style={styles.kpiCard}>
                <div style={styles.kpiLabel}>Em Risco</div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 25, color: vars.yellow }}>{fmtShort(kpis.mrrRisco)}</div>
                <div style={styles.kpiDelta}>{kpis.countRisco} clientes precisam atenção</div>
              </div>
              <div style={styles.kpiCard}>
                <div style={styles.kpiLabel}>Total de Negócios</div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 25, color: vars.text }}>{kpis.countTotal}</div>
                <div style={styles.kpiDelta}>Em todas as etapas</div>
              </div>
            </div>

            {paymentCalendar.length > 0 && (
              <>
                <div style={styles.sectionLabel}>Calendário de Pagamentos</div>
                <div style={styles.calendarGrid}>
                  {paymentCalendar.map(([day, info]) => (
                    <div key={day} style={styles.calDay}>
                      <div style={styles.calDayNum}>Dia {day}</div>
                      <div style={styles.calDayVal}>{fmtShort(info.total)}</div>
                      <div style={styles.calDayClients}>{info.clients.join(' · ')}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div style={styles.sectionLabel}>Funil — Clique num Card para Mover de Etapa</div>
            <div style={styles.boardWrap}>
              {STAGES.map(stage => (
                <div key={stage.key} style={styles.stageCol}>
                  <div style={styles.stageHead}>
                    <div style={{ ...styles.stageDot, background: stage.color }} />
                    <div style={styles.stageTitle}>{stage.label}</div>
                    <div style={styles.stageCount}>{byStage[stage.key]?.length || 0}</div>
                  </div>
                  {(byStage[stage.key] || []).map(deal => (
                    <div key={deal.id} style={styles.dealCard} onClick={() => setSelectedDeal(deal)}>
                      <div style={styles.dealName}>{deal.contacts?.company || deal.title}</div>
                      <div style={styles.dealValue}>{fmtShort(deal.value)}{deal.payment_day ? ` · dia ${deal.payment_day}` : ''}</div>
                    </div>
                  ))}
                  {(byStage[stage.key] || []).length === 0 && <div style={{ fontSize: 11, color: vars.textMuted, padding: '10px 4px', fontFamily: "'Space Mono', monospace" }}>vazio</div>}
                </div>
              ))}
            </div>

            <div style={styles.sectionLabel}>Todos os Negócios</div>
            <div style={styles.filtersRow}>
              <div style={{ ...styles.chip, ...(filterStage === 'ALL' ? styles.chipActive : {}) }} onClick={() => setFilterStage('ALL')}>TODOS</div>
              {STAGES.map(s => <div key={s.key} style={{ ...styles.chip, ...(filterStage === s.key ? styles.chipActive : {}) }} onClick={() => setFilterStage(s.key)}>{s.label.toUpperCase()}</div>)}
              <input style={styles.searchInput} placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead><tr><th style={styles.th}>Cliente</th><th style={styles.th}>Etapa</th><th style={styles.th}>Valor</th><th style={styles.th}>Dia Pgto.</th></tr></thead>
                <tbody>
                  {filteredDeals.map(deal => {
                    const st = STAGE_MAP[deal.stage];
                    return (
                      <tr key={deal.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedDeal(deal)}>
                        <td style={{ ...styles.td, color: vars.text, fontFamily: "'Oswald', sans-serif" }}>{deal.contacts?.company || deal.title}</td>
                        <td style={styles.td}><span style={{ ...styles.stageBadge, color: st.color, background: st.color + '18', border: `1px solid ${st.color}44` }}>{st.label}</span></td>
                        <td style={{ ...styles.td, fontFamily: "'Space Mono', monospace", color: vars.orange }}>{fmt(deal.value)}</td>
                        <td style={{ ...styles.td, fontFamily: "'Space Mono', monospace" }}>{deal.payment_day ? `Dia ${deal.payment_day}` : '—'}</td>
                      </tr>
                    );
                  })}
                  {filteredDeals.length === 0 && <tr><td colSpan={4} style={{ ...styles.td, textAlign: 'center', padding: 30 }}>Nenhum negócio encontrado.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {selectedDeal && (
        <div style={styles.modalOverlay} onClick={() => setSelectedDeal(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalTitle}>{selectedDeal.contacts?.company || selectedDeal.title}</div>
            <div style={styles.modalSub}>{fmt(selectedDeal.value)} / mês{selectedDeal.payment_day ? ` · vence dia ${selectedDeal.payment_day}` : ''}</div>
            <div style={{ ...styles.sectionLabel, marginBottom: 10, fontSize: 9 }}>Mover para etapa</div>
            {STAGES.map(s => (
              <div key={s.key} style={{ ...styles.stageOption, ...(selectedDeal.stage === s.key ? { borderColor: s.color, background: s.color + '14' } : {}), opacity: saving ? 0.5 : 1, pointerEvents: saving ? 'none' : 'auto' }} onClick={() => moveStage(selectedDeal, s.key)}>
                <div style={{ ...styles.stageDot, background: s.color }} />
                <span style={{ color: vars.text }}>{s.label}</span>
                {selectedDeal.stage === s.key && <span style={{ marginLeft: 'auto', color: s.color }}>✓</span>}
              </div>
            ))}
            <button style={{ ...styles.chip, width: '100%', textAlign: 'center', marginTop: 14, padding: '10px' }} onClick={() => setSelectedDeal(null)}>FECHAR</button>
          </div>
        </div>
      )}

      {toast && <div style={{ ...styles.toast, color: toast.type === 'error' ? vars.red : vars.green }}>{toast.msg}</div>}
    </div>
  );
}
