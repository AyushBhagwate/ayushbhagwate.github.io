/* =========================================================
   Ayush Bhagwate — ML Portfolio · interactions
   - Neural network canvas (hero)
   - Drifting "machine code" layer
   - Typed role text
   - Scroll reveal, active nav, stat counters
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    const setPressed = () =>
      themeToggle.setAttribute(
        "aria-pressed",
        document.documentElement.getAttribute("data-theme") === "dark" ? "true" : "false"
      );
    setPressed();
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      setPressed();
    });
    // follow OS changes only if the user hasn't set a preference
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener && mq.addEventListener("change", (e) => {
      let hasSaved = false;
      try { hasSaved = !!localStorage.getItem("theme"); } catch (err) {}
      if (!hasSaved) {
        document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
        setPressed();
      }
    });
  }

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById("burger");
  const links = document.querySelector(".nav__links");
  if (burger && links) {
    burger.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Nav shadow on scroll ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Certificate lightbox preview ---------- */
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const stage = document.getElementById("lightboxStage");
    const titleEl = document.getElementById("lightboxTitle");
    const openLink = document.getElementById("lightboxOpen");
    let lastFocused = null;

    const openLightbox = (href, title) => {
      if (!href || href === "#") return;
      const isPdf = /\.pdf(\?|#|$)/i.test(href);
      stage.innerHTML = "";
      if (isPdf) {
        const frame = document.createElement("iframe");
        frame.src = href;
        frame.title = title || "Certificate";
        stage.appendChild(frame);
      } else {
        const img = document.createElement("img");
        img.src = href;
        img.alt = title || "Certificate";
        stage.appendChild(img);
      }
      titleEl.textContent = title || "";
      openLink.href = href;
      lastFocused = document.activeElement;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      // clear after the fade so iframes stop loading
      setTimeout(() => { stage.innerHTML = ""; }, 300);
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    };

    // intercept clicks on certificate links -> open in modal (href stays as fallback)
    document.querySelectorAll("#certifications .cert-card a[href]").forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || href === "#") return;
        e.preventDefault();
        const card = a.closest(".cert-card");
        const t = card ? (card.querySelector("h3") || {}).textContent : "";
        openLightbox(href, t);
      });
    });

    lightbox.querySelectorAll("[data-close]").forEach((el) =>
      el.addEventListener("click", closeLightbox)
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
    });
  }

  /* ---------- Typed role ---------- */
  const typed = document.getElementById("typed");
  if (typed) {
    const phrases = [
      "AI / ML Engineer",
      "Artificial Intelligence & Machine Learning",
      "Deep Learning Practitioner",
      "Data Science Enthusiast",
      "Python Developer",
    ];
    if (prefersReduced) {
      typed.textContent = phrases[0];
    } else {
      let pi = 0, ci = 0, deleting = false;
      const tick = () => {
        const word = phrases[pi];
        ci += deleting ? -1 : 1;
        typed.textContent = word.slice(0, ci);
        let delay = deleting ? 45 : 85;
        if (!deleting && ci === word.length) { delay = 1600; deleting = true; }
        else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 350; }
        setTimeout(tick, delay);
      };
      setTimeout(tick, 600);
    }
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Active nav link ---------- */
  const navLinks = document.querySelectorAll(".nav__links a");
  const sections = [...navLinks].map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.id;
            navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
          }
        });
      },
      { threshold: 0, rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Stat counters ---------- */
  const nums = document.querySelectorAll(".stat__num");
  if (nums.length) {
    const animate = (el) => {
      const target = +el.dataset.count;
      if (prefersReduced) { el.textContent = target; return; }
      const dur = 1200;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const so = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { animate(e.target); so.unobserve(e.target); } }),
      { threshold: 0.6 }
    );
    nums.forEach((n) => so.observe(n));
  }

  /* =========================================================
     "Machine code" drifting layer
     ========================================================= */
  const codeLayer = document.getElementById("codeLayer");
  if (codeLayer && !prefersReduced) {
    const glyphs = "01</>{}[]=+*np.arraymodel.fit()tensorlayerReLUΣθ∇wxby";
    const cols = Math.min(14, Math.floor(window.innerWidth / 90));
    for (let i = 0; i < cols; i++) {
      const col = document.createElement("div");
      col.className = "code-col";
      let text = "";
      const len = 22 + Math.floor(Math.random() * 18);
      for (let j = 0; j < len; j++) text += glyphs[Math.floor(Math.random() * glyphs.length)] + "\n";
      col.textContent = text;
      col.style.left = (i / cols) * 100 + Math.random() * 4 + "%";
      col.style.animationDuration = 16 + Math.random() * 18 + "s";
      col.style.animationDelay = -Math.random() * 20 + "s";
      col.style.opacity = 0.4 + Math.random() * 0.5;
      codeLayer.appendChild(col);
    }
  }

  /* =========================================================
     Neural network canvas
     ========================================================= */
  const canvas = document.getElementById("neuralCanvas");
  if (!canvas || prefersReduced) return;
  const ctx = canvas.getContext("2d");
  let W, H, dpr, nodes = [], raf, mouse = { x: -9999, y: -9999 };

  // theme-aware colours (read rgb triplets from CSS variables)
  let lineRGB = "79,70,229", nodeRGB = "14,165,233";
  function readThemeColors() {
    const cs = getComputedStyle(document.documentElement);
    lineRGB = (cs.getPropertyValue("--net-line") || lineRGB).trim();
    nodeRGB = (cs.getPropertyValue("--net-node") || nodeRGB).trim();
  }
  readThemeColors();
  new MutationObserver(readThemeColors).observe(document.documentElement, {
    attributes: true, attributeFilter: ["data-theme"],
  });

  const NODE_COUNT = () => Math.round(Math.min(70, (window.innerWidth * window.innerHeight) / 20000));
  const LINK_DIST = 150;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildNodes();
  }

  function buildNodes() {
    const n = NODE_COUNT();
    nodes = [];
    for (let i = 0; i < n; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.6 + Math.random() * 2.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // links
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < LINK_DIST) {
          const alpha = (1 - d / LINK_DIST) * 0.28;
          ctx.strokeStyle = `rgba(${lineRGB},${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // nodes
    const t = performance.now() / 900;
    for (const p of nodes) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // gentle mouse repulsion
      const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
      const md = Math.hypot(mdx, mdy);
      if (md < 120) {
        const f = (1 - md / 120) * 0.9;
        p.x += (mdx / (md || 1)) * f;
        p.y += (mdy / (md || 1)) * f;
      }

      const glow = 0.55 + 0.45 * Math.sin(t + p.pulse);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${nodeRGB},${0.35 + glow * 0.45})`;
      ctx.shadowColor = `rgba(${lineRGB},.5)`;
      ctx.shadowBlur = 6 * glow;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    raf = requestAnimationFrame(draw);
  }

  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  window.addEventListener("mouseleave", () => { mouse.x = mouse.y = -9999; });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 180);
  });

  // pause when hero out of view (perf)
  const heroEl = document.getElementById("hero");
  if (heroEl && "IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { if (!raf) draw(); }
        else { cancelAnimationFrame(raf); raf = null; }
      });
    }, { threshold: 0.02 }).observe(heroEl);
  }

  resize();
  draw();
})();
