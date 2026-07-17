# RHOPE — Landing page com transições de scroll

Projeto separado (HTML/CSS/JS puro, sem build e sem dependências externas) que reproduz o efeito de **rolagem contínua com transição suave entre seções** — vídeo/imagem de uma dobra dissolve na próxima conforme o usuário rola, dando a sensação de uma experiência única e não de páginas separadas.

## Como rodar

Não precisa de `npm install`. Basta servir a pasta como estático:

```bash
npx serve marketing-landing
# ou
python3 -m http.server --directory marketing-landing 8080
```

Depois abra `http://localhost:PORTA`.

## Como funciona

- `index.html` — 5 seções de exemplo (Hero, Problema, Solução, Prova social, CTA final), cada uma com uma camada de fundo correspondente em `.bg-stack`.
- `styles.css` — layout em tela cheia, `scroll-snap` para cada seção "grudar" na rolagem, camadas de fundo fixas empilhadas por `z-index`.
- `script.js` — a cada frame de scroll, calcula o quanto cada seção está "centralizada" na tela (0 a 1) e usa isso como opacidade da camada de fundo correspondente. Como duas seções vizinhas sempre somam ~1 durante a transição, uma dissolve na outra sem corte perceptível. Também aplica um leve zoom (Ken Burns) e pausa/reproduz vídeos fora de vista para economizar recursos.

## Trocar os placeholders pelos assets reais

Os fundos atuais são gradientes SVG em `assets/placeholders/section-N.svg`, só para servir de estrutura visual.

**Para usar uma imagem em alta resolução**, troque o `src` do `<img class="bg-media">` correspondente em `index.html`.

**Para usar vídeo**, substitua o `<img class="bg-media">` pelo bloco comentado logo abaixo dele no próprio `index.html`, por exemplo:

```html
<video class="bg-media" autoplay muted loop playsinline preload="none"
       poster="assets/placeholders/section-1.svg" data-video>
  <source src="assets/videos/section-1.mp4" type="video/mp4">
</video>
```

Coloque o arquivo de vídeo em `assets/videos/`. Recomenda-se:
- MP4 (H.264) comprimido, idealmente < 8–10MB por vídeo para não pesar o carregamento;
- 1920×1080 ou 2560×1440, sem áudio (o atributo `muted` é obrigatório para autoplay funcionar em todos os navegadores);
- Um `poster` (imagem) sempre definido, para mobile e para o instante antes do vídeo carregar.

O `script.js` já detecta automaticamente qualquer `<video data-video>` dentro de `.bg-layer` e cuida de tocar/pausar conforme a seção entra/sai de foco — não precisa mexer no JS.

## Conteúdo

Todos os textos em `index.html` estão marcados com `[Substitua pelo texto real]` — é só editar os títulos, parágrafos e o link do botão final (`Falar com a equipe`).

## Acessibilidade

Usuários com `prefers-reduced-motion` ativado recebem uma versão sem zoom/parallax, apenas com fade simples.
