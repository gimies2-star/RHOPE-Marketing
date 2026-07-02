'use client';

import React, { useEffect, useMemo, useState } from 'react';
import NavBar from '../../components/NavBar';
import { useTheme } from '../../components/ThemeContext';
import { sbFetch, sbPost, fmt, themeVars } from '../../lib/rhope';

const emptyContact = { name: '', company: '', phone: '', email: '', source: '', segment: '', value: '', payment_day: '' };
const emptySeller = { name: '', phone: '', email: '', role: '', commission_rate: '' };

export default function CadastroPage() {
  const { theme, toggleTheme } = useTheme();
  const vars = themeVars(theme === 'dark');
  const [tab, setTab] = useState('cliente');
  const [contact, setContact] = useState(emptyContact);
  const [seller, setSeller] = useState(emptySeller);
  const [contacts, setContacts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [contactsData, dealsData, sellersData] = await Promise.all([
        sbFetch('contacts?select=id,name,company,phone,email,source,segment,created_at&order=created_at.desc'),
        sbFetch('deals?select=id,contact_id,title,value,payment_day,stage,created_at&order=created_at.desc'),
        sbFetch('sellers?select=*&order=created_at.desc'),
      ]);
      setContacts(contactsData || []);
      setDeals(dealsData || []);
      setSellers(sellersData || []);
    } catch (e) {
      setError(e.message || 'Erro ao carregar cadastros.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const contactsWithDeals = useMemo(() => {
    return contacts.map(c => ({ ...c, deal: deals.find(d => d.contact_id === c.id) }));
  }, [contacts, deals]);

  const saveContact = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const [newContact] = await sbPost('contacts', [{
        name: contact.name || contact.company,
        company: contact.company,
        phone: contact.phone,
        email: contact.email,
        source: contact.source,
        segment: contact.segment,
      }]);

      if (contact.value || contact.payment_day) {
        await sbPost('deals', [{
          contact_id: newContact.id,
          title: contact.company || contact.name,
          value: Number(contact.value || 0),
          payment_day: contact.payment_day ? Number(contact.payment_day) : null,
          stage: 'lead_capturado',
        }]);
      }

      setContact(emptyContact);
      setMessage('Cliente cadastrado com sucesso.');
      await load();
    } catch (e) {
      setError(e.message || 'Erro ao cadastrar cliente.');
    } finally {
      setLoading(false);
    }
  };

  const saveSeller = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await sbPost('sellers', [{
        name: seller.name,
        phone: seller.phone,
        email: seller.email,
        role: seller.role,
        commission_rate: seller.commission_rate ? Number(seller.commission_rate) : null,
      }]);
      setSeller(emptySeller);
      setMessage('Vendedor cadastrado com sucesso.');
      await load();
    } catch (e) {
      setError(e.message || 'Erro ao cadastrar vendedor.');
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
    padding: 12,
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
  };

  const label = { display: 'block', fontFamily: "'Space Mono', monospace", color: vars.textMuted, fontSize: 10, letterSpacing: 2, marginBottom: 6, textTransform: 'uppercase' };
  const field = { display: 'grid', gap: 6 };

  return (
    <div style={{ minHeight: '100vh', background: vars.bg, color: vars.text, fontFamily: "'Inter', sans-serif" }}>
      <NavBar theme={theme} toggleTheme={toggleTheme} />
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '28px 28px 70px' }}>
        <div style={{ fontFamily: "'Space Mono', monospace", color: vars.orange, letterSpacing: 3, textTransform: 'uppercase', fontSize: 11, marginBottom: 12 }}>Cadastro Operacional</div>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 42, margin: '0 0 8px' }}>Clientes e vendedores</h1>
        <p style={{ color: vars.textDim, margin: '0 0 24px' }}>Cadastre empresas no CRM e vendedores responsáveis pela operação comercial.</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          <button onClick={() => setTab('cliente')} style={{ padding: '10px 18px', borderRadius: 100, border: `1px solid ${tab === 'cliente' ? vars.borderH : vars.border}`, background: tab === 'cliente' ? 'rgba(217,106,50,0.12)' : vars.surface, color: tab === 'cliente' ? vars.orange : vars.textDim, fontFamily: "'Oswald', sans-serif", letterSpacing: 1, cursor: 'pointer' }}>CLIENTE</button>
          <button onClick={() => setTab('vendedor')} style={{ padding: '10px 18px', borderRadius: 100, border: `1px solid ${tab === 'vendedor' ? vars.borderH : vars.border}`, background: tab === 'vendedor' ? 'rgba(217,106,50,0.12)' : vars.surface, color: tab === 'vendedor' ? vars.orange : vars.textDim, fontFamily: "'Oswald', sans-serif", letterSpacing: 1, cursor: 'pointer' }}>VENDEDOR</button>
        </div>

        {(message || error) && <div style={{ ...card, marginBottom: 18, color: error ? vars.red : vars.green }}>{error || message}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 18 }}>
          {tab === 'cliente' ? (
            <form onSubmit={saveContact} style={card}>
              <h2 style={{ fontFamily: "'Oswald', sans-serif", marginTop: 0 }}>Novo cliente</h2>
              <div style={{ display: 'grid', gap: 14 }}>
                <div style={field}><label style={label}>Empresa</label><input required value={contact.company} onChange={e => setContact({ ...contact, company: e.target.value })} style={input} /></div>
                <div style={field}><label style={label}>Contato</label><input value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} style={input} /></div>
                <div style={field}><label style={label}>Telefone</label><input value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} style={input} /></div>
                <div style={field}><label style={label}>E-mail</label><input type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} style={input} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={field}><label style={label}>Origem</label><input value={contact.source} onChange={e => setContact({ ...contact, source: e.target.value })} style={input} /></div>
                  <div style={field}><label style={label}>Segmento</label><input value={contact.segment} onChange={e => setContact({ ...contact, segment: e.target.value })} style={input} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={field}><label style={label}>Valor mensal</label><input type="number" value={contact.value} onChange={e => setContact({ ...contact, value: e.target.value })} style={input} /></div>
                  <div style={field}><label style={label}>Dia pagamento</label><input type="number" min="1" max="31" value={contact.payment_day} onChange={e => setContact({ ...contact, payment_day: e.target.value })} style={input} /></div>
                </div>
              </div>
              <button disabled={loading} style={{ marginTop: 18, width: '100%', padding: 14, borderRadius: 12, border: `1px solid ${vars.borderH}`, background: vars.orange, color: '#fff', fontFamily: "'Oswald', sans-serif", letterSpacing: 1.5, cursor: 'pointer' }}>{loading ? 'SALVANDO...' : 'CADASTRAR CLIENTE'}</button>
            </form>
          ) : (
            <form onSubmit={saveSeller} style={card}>
              <h2 style={{ fontFamily: "'Oswald', sans-serif", marginTop: 0 }}>Novo vendedor</h2>
              <div style={{ display: 'grid', gap: 14 }}>
                <div style={field}><label style={label}>Nome</label><input required value={seller.name} onChange={e => setSeller({ ...seller, name: e.target.value })} style={input} /></div>
                <div style={field}><label style={label}>Telefone</label><input value={seller.phone} onChange={e => setSeller({ ...seller, phone: e.target.value })} style={input} /></div>
                <div style={field}><label style={label}>E-mail</label><input type="email" value={seller.email} onChange={e => setSeller({ ...seller, email: e.target.value })} style={input} /></div>
                <div style={field}><label style={label}>Função</label><input value={seller.role} onChange={e => setSeller({ ...seller, role: e.target.value })} style={input} /></div>
                <div style={field}><label style={label}>Comissão %</label><input type="number" value={seller.commission_rate} onChange={e => setSeller({ ...seller, commission_rate: e.target.value })} style={input} /></div>
              </div>
              <button disabled={loading} style={{ marginTop: 18, width: '100%', padding: 14, borderRadius: 12, border: `1px solid ${vars.borderH}`, background: vars.orange, color: '#fff', fontFamily: "'Oswald', sans-serif", letterSpacing: 1.5, cursor: 'pointer' }}>{loading ? 'SALVANDO...' : 'CADASTRAR VENDEDOR'}</button>
            </form>
          )}

          <section style={card}>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", marginTop: 0 }}>{tab === 'cliente' ? 'Clientes cadastrados' : 'Vendedores cadastrados'}</h2>
            {loading && <p style={{ color: vars.textMuted }}>Carregando...</p>}
            {tab === 'cliente' ? (
              <div style={{ display: 'grid', gap: 10 }}>
                {contactsWithDeals.map(c => (
                  <div key={c.id} style={{ border: `1px solid ${vars.border}`, borderRadius: 12, padding: 14, background: vars.surfaceH }}>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18 }}>{c.company || c.name}</div>
                    <div style={{ color: vars.textMuted, fontSize: 13 }}>{c.name} · {c.phone || 'sem telefone'} · {c.email || 'sem e-mail'}</div>
                    <div style={{ color: vars.orange, fontFamily: "'Space Mono', monospace", fontSize: 12, marginTop: 6 }}>{c.deal ? `${fmt(c.deal.value)} · ${c.deal.stage}` : 'sem negócio vinculado'}</div>
                  </div>
                ))}
                {!contactsWithDeals.length && <p style={{ color: vars.textMuted }}>Nenhum cliente cadastrado.</p>}
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {sellers.map(s => (
                  <div key={s.id} style={{ border: `1px solid ${vars.border}`, borderRadius: 12, padding: 14, background: vars.surfaceH }}>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18 }}>{s.name}</div>
                    <div style={{ color: vars.textMuted, fontSize: 13 }}>{s.role || 'Vendedor'} · {s.phone || 'sem telefone'} · {s.email || 'sem e-mail'}</div>
                    <div style={{ color: vars.orange, fontFamily: "'Space Mono', monospace", fontSize: 12, marginTop: 6 }}>{s.commission_rate ? `${s.commission_rate}% comissão` : 'comissão não definida'}</div>
                  </div>
                ))}
                {!sellers.length && <p style={{ color: vars.textMuted }}>Nenhum vendedor cadastrado.</p>}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
