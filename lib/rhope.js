export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function assertSupabaseEnv() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel.');
  }
}

export async function sbFetch(path) {
  assertSupabaseEnv();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar ${path}`);
  return res.json();
}

export async function sbPatch(path, body) {
  assertSupabaseEnv();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json', Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Erro ${res.status} ao atualizar`);
  return res.json();
}

export async function sbPost(path, body) {
  assertSupabaseEnv();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json', Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Erro ${res.status}: ${errBody}`);
  }
  return res.json();
}

export function fmt(v) {
  const n = Number(v || 0);
  return 'R$' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
export function fmtShort(v) {
  const n = Number(v || 0);
  if (n >= 1000) return 'R$' + n.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  return fmt(n);
}

export function themeVars(isDark) {
  return isDark ? {
    bg: '#0A0A0A', surface: 'rgba(255,255,255,0.03)', surfaceH: 'rgba(255,255,255,0.06)',
    border: 'rgba(217,106,50,0.16)', borderH: 'rgba(217,106,50,0.42)',
    text: '#EFEBE0', textDim: 'rgba(239,235,224,0.5)', textMuted: 'rgba(239,235,224,0.24)',
    orange: '#D96A32', orange2: '#E8621A', green: '#4ADE80', red: '#F87171', teal: '#2DD4BF', yellow: '#FBBF24',
    shl: 'rgba(0,0,0,0.85)', sh1: 'rgba(0,0,0,0.6)', sh2: 'rgba(0,0,0,0.4)',
  } : {
    bg: '#F5F3EF', surface: 'rgba(255,255,255,0.72)', surfaceH: 'rgba(255,255,255,0.92)',
    border: 'rgba(196,88,24,0.25)', borderH: 'rgba(196,88,24,0.55)',
    text: '#1A1410', textDim: 'rgba(26,20,16,0.62)', textMuted: 'rgba(26,20,16,0.38)',
    orange: '#C45818', orange2: '#D96A32', green: '#15803D', red: '#DC2626', teal: '#0D9488', yellow: '#B45309',
    shl: 'rgba(0,0,0,0.12)', sh1: 'rgba(0,0,0,0.08)', sh2: 'rgba(0,0,0,0.05)',
  };
}
