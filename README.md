# RHOPE Marketing

Projeto Next.js com as abas:

- `/` Pipeline (**protegido por senha**)
- `/ads` Relatórios de anúncios (**protegido por senha**)
- `/cadastro` Cadastro de empresas e vendedores (**protegido por senha**)
- `/diagnostico` Landing page pública de captação de leads (**aberta a todos, sem senha**)

## Proteção por senha do CRM

As páginas internas (`/`, `/cadastro`, `/ads` e a API) exigem usuário e senha
(autenticação HTTP básica) — o navegador mostra uma caixinha de login. Isso
existe para que o CRM possa ficar no mesmo domínio/subdomínio da página
pública de diagnóstico sem expor dados de clientes.

**Sem essas duas variáveis configuradas, o acesso ao CRM fica bloqueado por
padrão** (erro 503) — é proposital, para nunca ficar aberto por esquecimento.

## Variáveis de ambiente na Vercel

Adicione no projeto da Vercel (Settings → Environment Variables):

```txt
ANTHROPIC_API_KEY=sua_chave_da_anthropic
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_publica_do_supabase
CRM_BASIC_USER=usuario_de_acesso_ao_crm
CRM_BASIC_PASS=senha_forte_de_acesso_ao_crm
```

Depois de adicionar/alterar `CRM_BASIC_USER`/`CRM_BASIC_PASS`, é preciso
fazer um novo deploy (Redeploy) para o valor entrar em vigor.

Não suba chaves secretas no GitHub.

## Rodar localmente

```bash
npm install
npm run dev
```

## Deploy

Importe este repositório na Vercel e faça o deploy.
