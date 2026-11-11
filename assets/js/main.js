/* ==========================================================================
   Edu Naka · Portfólio — script único (home + páginas de serviço)
   Sem dependências externas: tudo em JavaScript puro.
   ========================================================================== */

/* --------------------------------------------------------------------------
   CONFIGURAÇÃO — edite só aqui
   -------------------------------------------------------------------------- */
const CONFIG = {
  // Número do WhatsApp com DDI + DDD, só dígitos. Ex.: 5511912345678
  whatsapp: "5511946457048", // TODO: trocar pelo número real

  // Mensagem padrão que já vem escrita quando o visitante abre o WhatsApp
  whatsappMsg: "Olá, Edu Naka! Vim pelo seu site e gostaria de conversar sobre um projeto.",

  // Chave gratuita do Web3Forms (https://web3forms.com): informe seu e-mail lá,
  // receba a chave e cole aqui. As mensagens do formulário chegam nesse e-mail.
  web3formsKey: "2cadc14f-1f97-45f8-9245-d75b3846c006",

  // Prévia dos sites no portfólio: carrega o site ao vivo dentro do card quando
  // não existe um print em assets/img/portfolio/. Só no desktop, para não pesar no celular.
  livePreview: false,
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* --------------------------------------------------------------------------
   1. Links de WhatsApp
   Todo <a data-wa> recebe o link certo. Use data-wa-msg para mudar a mensagem.
   -------------------------------------------------------------------------- */
function initWhatsApp() {
  document.querySelectorAll("a[data-wa]").forEach((a) => {
    const msg = a.dataset.waMsg || CONFIG.whatsappMsg;
    a.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    a.target = "_blank";
    a.rel = "noopener";
  });
}

/* --------------------------------------------------------------------------
   2. Header: fundo ao rolar, menu mobile e barra de progresso
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  const root = document.documentElement;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const max = root.scrollHeight - window.innerHeight;
      header?.classList.toggle("is-scrolled", y > 24);
      root.style.setProperty("--progress", max > 0 ? (y / max).toFixed(4) : 0);
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && links) {
    const close = () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", (e) => e.target.closest("a") && close());
    document.addEventListener("keydown", (e) => e.key === "Escape" && close());
  }
}

/* --------------------------------------------------------------------------
   3. Entrada dos elementos no scroll ([data-reveal])
   -------------------------------------------------------------------------- */
function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  items.forEach((el) => io.observe(el));
}

/* --------------------------------------------------------------------------
   4. Brilhos que seguem o mouse (fundo da página e cards .glass)
   -------------------------------------------------------------------------- */
function initSpotlight() {
  if (!finePointer) return;
  const root = document.documentElement;
  let raf = null;
  window.addEventListener(
    "pointermove",
    (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        root.style.setProperty("--mx", e.clientX + "px");
        root.style.setProperty("--my", e.clientY + "px");
        raf = null;
      });
    },
    { passive: true }
  );
  document.querySelectorAll(".glass").forEach((card) => {
    card.addEventListener(
      "pointermove",
      (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--cx", e.clientX - r.left + "px");
        card.style.setProperty("--cy", e.clientY - r.top + "px");
      },
      { passive: true }
    );
  });
}

/* --------------------------------------------------------------------------
   5. Cursor customizado (apenas desktop com mouse)
   -------------------------------------------------------------------------- */
function initCursor() {
  if (!finePointer || reduceMotion) return;
  const ring = document.createElement("div");
  ring.className = "cursor";
  ring.setAttribute("aria-hidden", "true");
  document.body.appendChild(ring);

  let x = 0, y = 0, tx = 0, ty = 0, active = false;
  const loop = () => {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (active) requestAnimationFrame(loop);
  };
  window.addEventListener(
    "pointermove",
    (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!active) {
        active = true;
        x = tx;
        y = ty;
        ring.classList.add("is-on");
        requestAnimationFrame(loop);
      }
      ring.classList.toggle("is-hover", !!e.target.closest("a, button, .project"));
    },
    { passive: true }
  );
  document.addEventListener("pointerleave", () => {
    ring.classList.remove("is-on");
    active = false;
  });
}

/* --------------------------------------------------------------------------
   6. Botões magnéticos (.magnetic) e tilt 3D nos cards (.project)
   -------------------------------------------------------------------------- */
function initMagnetic() {
  if (!finePointer || reduceMotion) return;
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.3}px)`;
    });
    el.addEventListener("pointerleave", () => (el.style.transform = ""));
  });
}

function initTilt() {
  if (!finePointer || reduceMotion) return;
  const MAX = 7; // graus
  document.querySelectorAll(".project:not(.project--empty)").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.classList.add("is-tilting");
      card.style.setProperty("--ry", (px * MAX * 2).toFixed(2) + "deg");
      card.style.setProperty("--rx", (-py * MAX * 2).toFixed(2) + "deg");
    });
    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-tilting");
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--rx", "0deg");
    });
  });
}

/* --------------------------------------------------------------------------
   6b. Prévia dos sites nos cards do portfólio
   Ordem: 1) print em data-shot, se o arquivo existir; 2) site ao vivo em iframe;
   3) cartão com o nome do site (já está no HTML). No hover, a prévia rola a página.
   -------------------------------------------------------------------------- */
function initPreviews() {
  const thumbs = document.querySelectorAll(".project__thumb[data-preview-url]");
  if (!thumbs.length) return;
  const FRAME_W = 1280, FRAME_H = 2600;
  // Dentro de outra página (como a prévia do Claude), sites externos são bloqueados
  const framed = window.self !== window.top;
  const canLive = CONFIG.livePreview && !framed && finePointer && window.innerWidth >= 760;

  function measure(thumb, contentHeight) {
    const screen = thumb.querySelector(".project__screen");
    const pan = reduceMotion ? 0 : Math.max(0, contentHeight() - screen.clientHeight);
    thumb.style.setProperty("--pan", pan + "px");
    thumb.style.setProperty("--pan-time", Math.min(8, Math.max(1.5, pan / 110)).toFixed(1) + "s");
  }

  function watch(thumb, contentHeight) {
    const screen = thumb.querySelector(".project__screen");
    const update = () => {
      thumb.style.setProperty("--s", (screen.clientWidth / FRAME_W).toFixed(4));
      measure(thumb, contentHeight);
    };
    update();
    if ("ResizeObserver" in window) new ResizeObserver(update).observe(screen);
  }

  function load(thumb) {
    const screen = thumb.querySelector(".project__screen");
    const img = new Image();
    img.alt = "";
    img.onload = () => {
      screen.appendChild(img);
      watch(thumb, () => (screen.clientWidth * img.naturalHeight) / img.naturalWidth);
      thumb.classList.add("has-preview");
    };
    img.onerror = () => {
      if (!canLive) return; // fica o cartão com o nome
      const frame = document.createElement("iframe");
      frame.src = thumb.dataset.previewUrl;
      frame.title = "";
      frame.tabIndex = -1;
      frame.setAttribute("aria-hidden", "true");
      frame.setAttribute("scrolling", "no");
      frame.setAttribute("sandbox", "allow-scripts allow-same-origin");
      frame.referrerPolicy = "no-referrer";
      frame.addEventListener("load", () => thumb.classList.add("has-preview"), { once: true });
      screen.appendChild(frame);
      watch(thumb, () => (FRAME_H * screen.clientWidth) / FRAME_W);
    };
    img.src = thumb.dataset.shot;
  }

  // Só carrega cada prévia quando o card está perto de aparecer
  if (!("IntersectionObserver" in window)) return thumbs.forEach(load);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      load(entry.target);
    });
  }, { rootMargin: "400px 0px" });
  thumbs.forEach((t) => io.observe(t));
}

/* --------------------------------------------------------------------------
   7. Fundo do hero: malha de pontos em perspectiva que ondula e reage ao mouse
   Canvas 2D puro (leve). Pausa quando o hero sai da tela ou a aba fica oculta.
   -------------------------------------------------------------------------- */
function initHeroCanvas() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const hero = canvas.parentElement;

  let w = 0, h = 0, cols = 0, rows = 0, t = 0, visible = true, raf = null;
  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    w = r.width;
    h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Menos pontos no celular para manter a fluidez
    cols = w < 700 ? 38 : 84;
    rows = w < 700 ? 22 : 30;
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;

    const horizon = h * 0.36;
    const R2 = 2 * 150 * 150; // raio de influência do mouse

    for (let j = rows - 1; j >= 0; j--) {
      const z = 1 + (j / (rows - 1)) * 5.5; // profundidade: 1 (perto) a 6.5 (longe)
      const scale = 1 / z;
      for (let i = 0; i < cols; i++) {
        const x = (i / (cols - 1) - 0.5) * 20;
        const wave =
          Math.sin(x * 0.7 + t) * 0.2 +
          Math.cos(z * 1.4 + t * 0.8) * 0.2 +
          Math.sin((x + z) * 0.5 - t * 0.6) * 0.16;

        const sx = w / 2 + x * scale * w * 0.2;
        if (sx < -10 || sx > w + 10) continue;
        let sy = horizon + (1.15 + wave) * scale * h * 0.56;

        const dx = sx - mouse.x, dy = sy - mouse.y;
        const inf = Math.exp(-(dx * dx + dy * dy) / R2); // 0 a 1 perto do mouse
        sy -= inf * 70 * scale;

        const size = Math.max(1.1, 3.2 * scale + inf * 1.6);
        ctx.globalAlpha = Math.min(1, 0.28 + 0.85 * scale + inf * 0.6);
        ctx.fillStyle = inf > 0.12 ? "#ddd6fe" : "#a78bfa";
        ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
      }
    }
    ctx.globalAlpha = 1;
  }

  function loop() {
    t += 0.012;
    draw();
    raf = visible && !document.hidden ? requestAnimationFrame(loop) : null;
  }
  const start = () => { if (!raf && !reduceMotion) raf = requestAnimationFrame(loop); };

  resize();
  window.addEventListener("resize", () => { resize(); draw(); });

  hero.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.tx = e.clientX - r.left;
    mouse.ty = e.clientY - r.top;
  }, { passive: true });
  hero.addEventListener("pointerleave", () => { mouse.tx = mouse.ty = -9999; });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    }).observe(hero);
  }
  document.addEventListener("visibilitychange", () => !document.hidden && visible && start());

  // Com movimento reduzido, desenha um único quadro estático
  if (reduceMotion) { t = 1.2; draw(); } else { start(); }
}

/* --------------------------------------------------------------------------
   8. Parallax suave no conteúdo do hero
   -------------------------------------------------------------------------- */
function initParallax() {
  const el = document.querySelector("[data-parallax]");
  if (!el || reduceMotion) return;
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = Math.min(window.scrollY, window.innerHeight);
      el.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
      el.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.85)));
      ticking = false;
    });
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   9. Formulário de contato (Web3Forms) com validação e honeypot
   -------------------------------------------------------------------------- */
function initForm() {
  const form = document.getElementById("contato-form");
  if (!form) return;
  const status = form.querySelector(".form__status");
  const button = form.querySelector("button[type=submit]");

  const rules = {
    nome: (v) => (v.trim().length >= 2 ? "" : "Me diga seu nome."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Informe um e-mail válido, como nome@exemplo.com."),
    whatsapp: (v) => (v.replace(/\D/g, "").length >= 10 ? "" : "Informe o número com DDD."),
    mensagem: (v) => (v.trim().length >= 10 ? "" : "Conte um pouco mais sobre o projeto (mínimo de 10 caracteres)."),
  };

  function validateField(input) {
    const rule = rules[input.name];
    if (!rule) return true;
    const error = rule(input.value);
    const field = input.closest(".field");
    field.classList.toggle("has-error", !!error);
    field.querySelector(".field__error").textContent = error;
    input.setAttribute("aria-invalid", error ? "true" : "false");
    return !error;
  }

  function showStatus(type, text) {
    status.dataset.type = type;
    status.textContent = text;
    status.classList.remove("is-visible");
    void status.offsetWidth; // reinicia a animação
    status.classList.add("is-visible");
  }

  form.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => input.closest(".field")?.classList.contains("has-error") && validateField(input));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputs = [...form.querySelectorAll("[name=nome], [name=email], [name=whatsapp], [name=mensagem]")];
    const allValid = inputs.map(validateField).every(Boolean);
    if (!allValid) {
      form.querySelector(".has-error input, .has-error textarea")?.focus();
      return;
    }
    // Honeypot: se o campo escondido veio preenchido, é robô: não envia nada.
    if (form.querySelector("[name=botcheck]").checked) return;

    if (CONFIG.web3formsKey.startsWith("SUA_")) {
      showStatus("info", "O formulário ainda não está configurado (falta a chave do Web3Forms em assets/js/main.js). Por enquanto, fale comigo pelo WhatsApp.");
      return;
    }

    button.classList.add("is-loading");
    button.querySelector("span").textContent = "Enviando…";
    try {
      const data = Object.fromEntries(new FormData(form));
      data.access_key = CONFIG.web3formsKey;
      data.subject = `Novo contato pelo site: ${data.nome}`;
      data.from_name = "Site do Edu Naka";
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Falha no envio");
      form.reset();
      showStatus("ok", "Mensagem enviada! Respondo o quanto antes. Se tiver pressa, me chame no WhatsApp.");
    } catch (err) {
      showStatus("error", "Não consegui enviar sua mensagem agora. Tente de novo em instantes ou fale comigo pelo WhatsApp.");
    } finally {
      button.classList.remove("is-loading");
      button.querySelector("span").textContent = "Enviar mensagem";
    }
  });
}

/* --------------------------------------------------------------------------
   10. "Conquista desbloqueada" ao chegar no CTA final (uma vez por visita)
   -------------------------------------------------------------------------- */
function initAchievement() {
  const target = document.querySelector("[data-achievement]");
  const toast = document.querySelector(".toast");
  if (!target || !toast || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    io.disconnect();
    toast.classList.add("is-on");
    setTimeout(() => toast.classList.remove("is-on"), 6000);
  }, { threshold: 0.5 });
  io.observe(target);
}

/* --------------------------------------------------------------------------
   Inicialização
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initWhatsApp();
  initHeader();
  initReveal();
  initSpotlight();
  // initCursor();   // bolinha atrás do cursor desativada
  initMagnetic();
  initTilt();
  initPreviews();
  initHeroCanvas();
  initParallax();
  initForm();
  initAchievement();
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
});

/* Esconde selos fixos de terceiros (ex.: Netlify) no canto inferior direito */
(function hideBadges() {
  const run = () => {
    document.querySelectorAll("body > *:not(script):not(style)").forEach((el) => {
      if (el.classList.contains("wa-float") || el.closest(".wa-float")) return;
      const s = getComputedStyle(el);
      if (s.position !== "fixed") return;
      const r = el.getBoundingClientRect();
      const nearCorner = r.bottom > innerHeight - 120 && r.right > innerWidth - 300 && r.width < 400 && r.height < 150;
      const isBadge = /nl-badge|netlify/i.test(el.className + " " + el.id + " " + el.tagName);
      if (isBadge || (nearCorner && !el.matches("[data-keep], .toast, .cursor"))) el.style.setProperty("display", "none", "important");
    });
  };
  new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: false });
  new MutationObserver(run).observe(document.body || document.documentElement, { childList: true });
  window.addEventListener("load", () => { run(); setTimeout(run, 1500); setTimeout(run, 4000); });
})();

/* Mobile: botão "Rolar site" em cada card do portfólio */
document.addEventListener("DOMContentLoaded", () => {
  if (!matchMedia("(hover: none)").matches) return;
  document.querySelectorAll(".project").forEach((card) => {
    const inner = card.querySelector(".project__inner");
    const thumb = card.querySelector(".project__thumb");
    if (!inner || !thumb) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "project__scroll";
    btn.setAttribute("aria-label", "Rolar a prévia do site");
    btn.innerHTML = '<span>Rolar site</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>';
    const place = () => { btn.style.top = (thumb.offsetHeight - btn.offsetHeight - 12) + "px"; };
    btn.addEventListener("click", () => {
      card.classList.add("is-panning");
      btn.remove();
    });
    inner.appendChild(btn);
    place();
    addEventListener("resize", place);
  });
});
