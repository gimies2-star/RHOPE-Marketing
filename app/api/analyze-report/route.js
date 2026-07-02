// Rota server-side — a chave da API NUNCA fica exposta no navegador.
// Configure ANTHROPIC_API_KEY nas variáveis de ambiente do projeto na Vercel.

const SYSTEM_PROMPT = `Analista de mídia paga expert. Analise e extraia métricas. APENAS JSON válido sem markdown.
{"periodo":"","plataformas":[],"investimento_total":0,"receita_total":0,"roi":0,"roas":0,"leads_total":0,"cpl":0,"cpa":0,"impressoes":0,"cliques":0,"ctr":0,"cpc":0,"cpm":0,"conversoes":0,"taxa_conversao":0,
"por_plataforma":[{"nome":"","investimento":0,"leads":0,"cliques":0,"impressoes":0,"ctr":0,"cpl":0,"roas":0,"cpc":0}],
"campanhas":[],"leads_campanha":[],"insights":[""]}
Use 0 para ausentes. Insights em português simples.`;

export async function POST(req) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'ANTHROPIC_API_KEY não configurada no servidor.' }, { status: 500 });
    }

    const body = await req.json();
    const { type, data, mediaType, text } = body;

    let content;
    if (type === 'image') {
      content = [
        { type: 'image', source: { type: 'base64', media_type: mediaType, data } },
        { type: 'text', text: 'Analise este relatório de anúncios.' },
      ];
    } else if (type === 'pdf') {
      content = [
        { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data } },
        { type: 'text', text: 'Analise este relatório de anúncios.' },
      ];
    } else {
      content = [{ type: 'text', text: `Relatório:\n\n${text}\n\nExtraia métricas de ads.` }];
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1200,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({ error: `Erro na API Anthropic: ${res.status} ${errText}` }, { status: 502 });
    }

    const resp = await res.json();
    let raw = (resp.content || [])
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')
      .trim()
      .replace(/```json|```/g, '')
      .trim();

    const jsonStart = raw.indexOf('{');
    if (jsonStart > 0) raw = raw.slice(jsonStart);

    const parsed = JSON.parse(raw);
    return Response.json(parsed);
  } catch (e) {
    return Response.json({ error: e.message || 'Erro desconhecido ao analisar relatório.' }, { status: 500 });
  }
}
