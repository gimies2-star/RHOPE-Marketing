# RHOPE Marketing

Projeto Next.js com as abas:

- `/` Pipeline
- `/ads` Relatórios de anúncios
- `/cadastro` Cadastro de empresas e vendedores

## Variáveis de ambiente na Vercel

Adicione no projeto da Vercel:

```txt
ANTHROPIC_API_KEY=sua_chave_da_anthropic
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_publica_do_supabase
```

Não suba chaves secretas no GitHub.

## Rodar localmente

```bash
npm install
npm run dev
```

## Deploy

Importe este repositório na Vercel e faça o deploy.
