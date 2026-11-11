/* ==========================================================================
   Eduardo · Desenvolvedor Web Front-end — main.js
   JavaScript puro, sem dependências. Funciona na home e nas páginas de serviço.
   ========================================================================== */

/* -------------------------------------------------------------------------
   CONFIG — edite aqui
   ------------------------------------------------------------------------- */
const CONFIG = {
  // TODO: número do WhatsApp com DDI + DDD, só dígitos. Ex.: "5511999999999"
  whatsappNumber: "5511999999999",
  // Mensagem padrão (usada em todos os botões que não têm mensagem própria)
  whatsappMessage: "Olá, Eduardo! Vim pelo seu site e gostaria de conversar sobre um projeto.",
  // TODO: chave de acesso do Web3Forms (https://web3forms.com). Deixe vazio até configurar.
  web3formsKey: "",
};

/* -------------------------------------------------------------------------
   PORTFÓLIO — lista fácil de editar. Para adicionar um projeto, copie um item.
   A imagem deve ser um print da página inteira, ~1000px de largura, em WebP.
   O caminho da imagem é relativo ao index.html.
   ------------------------------------------------------------------------- */
const PORTFOLIO = [
  {
    name: "Pet Shop Palmira",
    domain: "petshoppalmira.com.br",
    url: "https://petshoppalmira.com.br",
    type: "Site institucional",
    city: "Guarulhos, SP",
    image: "assets/img/portfolio/petshop-palmira.webp",
    description: "Pet shop de bairro com produtos para vários tipos de animais, banho e tosa e contato direto pelo WhatsApp.",
  },
  {
    name: "Visani Acessórios",
    domain: "visaniacessorios.com.br",
    url: "https://visaniacessorios.com.br",
    type: "Loja de semijoias",
    city: "Guarulhos, SP",
    image: "assets/img/portfolio/visani-acessorios.webp",
    description: "Vitrine de anéis, brincos, colares e pulseiras, pensada para destacar cada peça e facilitar a compra pelo WhatsApp.",
  },
  {
    name: "Tec Rental",
    domain: "tecrentalplataformas.com.br",
    url: "https://tecrentalplataformas.com.br",
    type: "Locação de plataformas",
    city: "Osasco, SP",
    image: "assets/img/portfolio/tec-rental.webp",
    description: "Locadora de plataformas elevatórias, com equipamentos disponíveis, manutenção e treinamento de operadores.",
  },
  {
    name: "Empretec Soluções",
    domain: "empretecsolucoes.com.br",
    url: "https://empretecsolucoes.com.br",
    type: "Construção e reformas",
    city: "São Paulo, SP",
    image: "assets/img/portfolio/empretec.webp",
    description: "Reformas e obras comerciais, industriais e corporativas, com portfólio de projetos entregues.",
  },
  {
    name: "Haskell Portugal",
    domain: "haskellportugal.pt",
    url: "https://haskellportugal.pt",
    type: "Cosméticos capilares",
    city: "Portugal",
    image: "assets/img/portfolio/haskell-portugal.webp",
    description: "Linhas de produtos para cuidados com o cabelo e contato com consultores.",
  },
  {
    name: "Nereg Engenharia",
    domain: "nereg.com.br",
    url: "https://nereg.com.br",
    type: "Engenharia e construções",
    city: "São Paulo, SP",
    image: "assets/img/portfolio/nereg.webp",
    description: "Construtora com construção e reforma residencial e comercial, portfólio de obras e pedido de orçamento.",
  },
];

/* ========================================================================== */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  /* ---- WhatsApp ---------------------------------------------------------- */
  const waLink = (msg) =>
    `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg || CONFIG.whatsappMessage)}`;

  function initWhatsApp() {
    $$("[data-wa]").forEach((a) => {
      a.href = waLink(a.dataset.waMsg);
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  /* ---- Header: fundo ao rolar + menu mobile ----------------------------- */
  function initHeader() {
    const header = $(".header");
    const burger = $(".burger");
    const nav = $(".nav");
    if (!header) return;

    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (!burger || !nav) return;
    const close = () => {
      burger.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.style.overflow = "";
    };
    burger.addEventListener("click", () => {
      const open = burger.getAttribute("aria-expanded") !== "true";
      burger.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$("a", nav).forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => e.key === "Escape" && close());
  }

  /* ---- Barra de XP (progresso de leitura) -------------------------------- */
  function initXp() {
    const bar = $(".xp-bar");
    if (!bar) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ---- Brilho ambiente + brilho dentro dos cards de vidro --------------- */
  function initGlow() {
    if (!finePointer || reducedMotion) return;
    const ambient = $(".ambient");
    let raf = null;
    document.addEventListener("mousemove", (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        if (ambient) {
          ambient.style.setProperty("--mx", `${e.clientX}px`);
          ambient.style.setProperty("--my", `${e.clientY}px`);
        }
      });
    });
    $$(".glass").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--gx", `${e.clientX - r.left}px`);
        card.style.setProperty("--gy", `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---- Cursor customizado em anel --------------------------------------- */
  function initCursor() {
    if (!finePointer || reducedMotion) return;
    const cur = $(".cursor");
    if (!cur) return;
    document.body.classList.add("has-cursor");
    let x = 0, y = 0, cx = 0, cy = 0;
    document.addEventListener("mousemove", (e) => {
      x = e.clientX; y = e.clientY;
      cur.classList.add("is-visible");
    });
    document.addEventListener("mouseleave", () => cur.classList.remove("is-visible"));
    const loop = () => {
      cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
      cur.style.left = `${cx}px`; cur.style.top = `${cy}px`;
      requestAnimationFrame(loop);
    };
    loop();
    const hoverables = "a, button, [role=button], input, textarea, label";
    document.addEventListener("mouseover", (e) => cur.classList.toggle("is-hover", !!e.target.closest(hoverables)));
  }

  /* ---- Animações de entrada no scroll ----------------------------------- */
  function initReveal() {
    const items = $$("[data-reveal]");
    if (!items.length) return;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    // Atraso escalonado entre irmãos com data-reveal
    $$("[data-stagger]").forEach((parent) => {
      $$(":scope > [data-reveal]", parent).forEach((el, i) => el.style.setProperty("--d", `${i * 0.09}s`));
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    items.forEach((el) => io.observe(el));
  }

  /* ---- Parallax suave no hero ------------------------------------------- */
  function initParallax() {
    const content = $(".hero__content");
    if (!content || reducedMotion) return;
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          content.style.transform = `translateY(${y * 0.25}px)`;
          content.style.opacity = String(Math.max(1 - y / (window.innerHeight * 0.9), 0));
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---- Botões magnéticos ------------------------------------------------- */
  function initMagnetic() {
    if (!finePointer || reducedMotion) return;
    $$(".btn--primary").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.25}px)`;
      });
      btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
    });
  }

  /* ---- Barras de nível das skills --------------------------------------- */
  function initSkills() {
    const levels = $$(".level");
    if (!levels.length) return;
    levels.forEach((l) => {
      const n = parseInt(l.dataset.level || "0", 10);
      l.innerHTML = Array.from({ length: 5 }, (_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("");
      l.setAttribute("role", "img");
      l.setAttribute("aria-label", `Nível ${n} de 5`);
    });
    if (reducedMotion || !("IntersectionObserver" in window)) {
      levels.forEach((l) => l.classList.add("is-filled"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-filled"); io.unobserve(en.target); } });
    }, { threshold: 0.5 });
    levels.forEach((l) => io.observe(l));
  }

  /* ---- Conquista desbloqueada (uma vez por visita) ----------------------- */
  function initAchievement() {
    const target = $("#cta");
    const toast = $(".toast");
    if (!target || !toast || !("IntersectionObserver" in window)) return;
    const KEY = "eduardo_achievement";
    if (sessionStorage.getItem(KEY)) return;
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      sessionStorage.setItem(KEY, "1");
      toast.classList.add("is-open");
      setTimeout(() => toast.classList.remove("is-open"), 5500);
    }, { threshold: 0.4 });
    io.observe(target);
  }

  /* ---- Portfólio: render + interações ----------------------------------- */
  function initPortfolio() {
    const grid = $("#portfolio-grid");
    if (!grid) return;

    grid.innerHTML = PORTFOLIO.map((p) => `
      <article class="work glass" data-reveal="up">
        <div class="browser" aria-hidden="true">
          <div class="browser__dots"><i></i><i></i><i></i></div>
          <div class="browser__url">${p.domain}</div>
        </div>
        <a class="preview" href="${p.url}" target="_blank" rel="noopener" aria-label="Visitar o site ${p.name} (abre em nova aba)">
          <img src="${p.image}" alt="Print da página inicial do site ${p.name}" loading="lazy" decoding="async" width="1000">
          <span class="preview__badge">Visitar site ↗</span>
        </a>
        <div class="work__body">
          <div class="work__meta">${p.type} · ${p.city}</div>
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <div class="work__actions">
            <a class="btn btn--primary btn--sm" data-wa data-wa-msg="Olá, Eduardo! Vim pelo seu portfólio e quero um site tipo: ${p.name}" href="#">
              <svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg>Quero um site assim
            </a>
            <a class="btn btn--ghost btn--sm" href="${p.url}" target="_blank" rel="noopener">Visitar site<svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></a>
          </div>
        </div>
      </article>`).join("");

    if (!finePointer || reducedMotion) return;

    $$(".work", grid).forEach((card) => {
      const img = $("img", card);
      const preview = $(".preview", card);

      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseenter", () => {
        const dist = img.offsetHeight - preview.offsetHeight;
        if (dist > 0) {
          img.style.transitionDuration = `${Math.max(dist / 90, 2)}s`;
          img.style.transform = `translateY(-${dist}px)`;
        }
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        img.style.transitionDuration = "0.8s";
        img.style.transform = "translateY(0)";
      });
    });
  }

  /* ---- Formulário de contato (Web3Forms) -------------------------------- */
  function initForm() {
    const form = $("#contact-form");
    if (!form) return;
    const status = $(".form__status", form);
    const submit = $("button[type=submit]", form);

    const rules = {
      name: (v) => (v.trim().length >= 2 ? "" : "Me diga pelo menos o seu primeiro nome."),
      phone: (v) => (v.replace(/\D/g, "").length >= 10 ? "" : "Informe o WhatsApp com DDD, ex.: (11) 99999-9999."),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Esse e-mail não parece válido."),
      message: (v) => (v.trim().length >= 10 ? "" : "Conte um pouco mais: pelo menos 10 caracteres."),
    };

    const validate = (input) => {
      const field = input.closest(".field");
      const err = $(".field__error", field);
      const msg = rules[input.name] ? rules[input.name](input.value) : "";
      field.classList.toggle("is-invalid", !!msg);
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      err.textContent = msg;
      return !msg;
    };

    $$("input, textarea", form).forEach((i) => {
      if (!rules[i.name]) return;
      i.addEventListener("blur", () => validate(i));
      i.addEventListener("input", () => { if (i.closest(".field").classList.contains("is-invalid")) validate(i); });
    });

    const setStatus = (type, html) => {
      status.className = `form__status is-${type}`;
      status.innerHTML = html;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const inputs = $$("input, textarea", form).filter((i) => rules[i.name]);
      const firstBad = inputs.map((i) => (validate(i) ? null : i)).find(Boolean);
      if (firstBad) { firstBad.focus(); return; }

      if (!CONFIG.web3formsKey) {
        setStatus("info", `O formulário ainda não está configurado. Enquanto isso, me chame pelo <a href="${waLink()}" target="_blank" rel="noopener">WhatsApp</a>.`);
        return;
      }

      const data = new FormData(form);
      data.append("access_key", CONFIG.web3formsKey);
      data.append("subject", `Novo contato pelo site: ${data.get("name")}`);
      data.append("from_name", "Site Eduardo Dev");

      submit.disabled = true;
      const label = submit.innerHTML;
      submit.textContent = "Enviando…";
      try {
        const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data, headers: { Accept: "application/json" } });
        const json = await res.json();
        if (json.success) {
          setStatus("success", "Mensagem enviada! Respondo em breve por e-mail ou WhatsApp.");
          form.reset();
        } else throw new Error(json.message || "erro");
      } catch {
        setStatus("error", `Não consegui enviar agora. Tente de novo ou me chame no <a href="${waLink()}" target="_blank" rel="noopener">WhatsApp</a>.`);
      } finally {
        submit.disabled = false;
        submit.innerHTML = label;
      }
    });
  }

  /* ---- Ano automático no rodapé ----------------------------------------- */
  function initYear() {
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  /* ---- Hero: malha de pontos em perspectiva (canvas 2D) ------------------ */
  function initMesh() {
    const canvas = $(".hero__canvas");
    if (!canvas || reducedMotion) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const COLS = isMobile ? 22 : 44;
    const ROWS = isMobile ? 14 : 22;
    let w = 0, h = 0, t = 0, raf = null, running = false;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      t += 0.012;
      mouse.x += (mouse.tx - mouse.x) * 0.1;
      mouse.y += (mouse.ty - mouse.y) * 0.1;
      ctx.clearRect(0, 0, w, h);
      const horizon = h * 0.42;
      for (let r = 0; r < ROWS; r++) {
        const depth = r / (ROWS - 1);                 // 0 longe, 1 perto
        const persp = 0.25 + depth * depth * 1.6;    // espalhamento em perspectiva
        const y0 = horizon + depth * depth * (h - horizon) * 1.05;
        for (let c = 0; c < COLS; c++) {
          const nx = (c / (COLS - 1) - 0.5) * persp;
          const x = w / 2 + nx * w;
          if (x < -20 || x > w + 20) continue;
          const wave = Math.sin(c * 0.45 + t) * Math.cos(r * 0.5 - t * 0.8) * 10 * depth;
          const dx = x - mouse.x, dy = y0 - mouse.y;
          const d = Math.hypot(dx, dy);
          const lift = d < 220 ? (1 - d / 220) * 42 : 0;
          const y = y0 + wave - lift;
          const size = 0.8 + depth * 1.8 + (lift > 0 ? lift / 18 : 0);
          const alpha = 0.12 + depth * 0.5 + (lift > 0 ? lift / 60 : 0);
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = lift > 6 ? `rgba(167,139,250,${Math.min(alpha, 1)})` : `rgba(124,58,237,${Math.min(alpha, 0.8)})`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };

    const start = () => { if (!running) { running = true; draw(); } };
    const stop = () => { running = false; if (raf) cancelAnimationFrame(raf); raf = null; };

    resize();
    window.addEventListener("resize", resize);
    canvas.parentElement.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener("mouseleave", () => { mouse.tx = -9999; mouse.ty = -9999; });

    // Pausa fora da tela e com a aba oculta
    const io = new IntersectionObserver(([en]) => (en.isIntersecting && !document.hidden ? start() : stop()));
    io.observe(canvas);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  }

  /* ---- Boot -------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initPortfolio();   // antes do WhatsApp e do reveal, pois gera elementos
    initWhatsApp();
    initHeader();
    initXp();
    initGlow();
    // initCursor();   // cursor em anel desativado: usa o cursor padrão
    initReveal();
    initParallax();
    initMagnetic();
    initSkills();
    initAchievement();
    initForm();
    initYear();
    initMesh();
  });
})();
