(() => {
  const panels = Array.from(document.querySelectorAll(".panel"));
  const layers = Array.from(document.querySelectorAll(".bg-layer"));
  const dots = Array.from(document.querySelectorAll(".dot"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let ticking = false;

  // Progresso 0→1 de um painel: 0 = a uma tela de distância, 1 = centralizado na viewport.
  function panelProgress(panel) {
    const rect = panel.getBoundingClientRect();
    const vh = window.innerHeight;
    return 1 - Math.min(Math.abs(rect.top) / vh, 1);
  }

  function updateScroll() {
    let activeIndex = 0;
    let activeProgress = -1;

    panels.forEach((panel, i) => {
      const progress = panelProgress(panel);
      const layer = layers[i];

      if (layer) {
        layer.style.opacity = progress.toFixed(3);
        if (!reduceMotion) {
          const scale = 1.06 - progress * 0.06;
          layer.style.transform = `scale(${scale.toFixed(4)})`;
        }
        const video = layer.querySelector("video[data-video]");
        if (video) {
          if (progress > 0.05 && video.paused) video.play().catch(() => {});
          if (progress <= 0.05 && !video.paused) video.pause();
        }
      }

      panel.classList.toggle("is-active", progress > 0.4);

      if (progress > activeProgress) {
        activeProgress = progress;
        activeIndex = i;
      }
    });

    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === activeIndex));

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = panels[Number(dot.dataset.target)];
      if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  updateScroll();
})();
