/* Flavour Fusion — shared behaviour (Tastebud-inspired redesign) */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Scroll-reveal targets. Keep in sync with the pre-hide block in css/style.css. */
  var REVEAL = [
    ".section-head",
    ".product-card",
    ".healthy-card",
    ".range-filter",
    ".gift-option",
    ".reason-item",
    ".spec-card",
    ".contact-card",
    ".cta-banner",
    ".showcase-copy",
    ".occasion-pill",
    ".footer-brand",
    ".footer-col",
    ".marquee",
    "form.enquiry",
    ".showcase > img",
    ".gift-hero > img",
    ".gift-media img",
    ".about-collage",
    ".about-copy",
    ".about-flavour__main",
    ".about-flavour__secondary",
    ".about-flavour__badge",
    ".about-feature",
    ".stat-item",
    ".experience-badge"
  ].join(",");

  var STAGGER_PARENTS =
    ".product-track, .product-grid, .healthy-grid, .range-filters, .about-flavour__features, .gift-options, .reason-list, .contact-info, .footer-grid, .occasion-row, .stats-strip";

  /* Headings that get per-word reveal. Hero heading reveals on load;
     other headings reveal on scroll. */
  var HEADING_SELECTORS =
    ".hero-copy h1:not(.main-slider__title), .gift-hero .hero-copy h1:not(.main-slider__title), .section-head h1:not(.main-slider__title), .section-head h2:not(.main-slider__title):not(.has-mark), .showcase-copy h2:not(.main-slider__title)";

  /* Kept as an empty stub for now — mask reveal is handled inside the
     standard scroll-reveal path via ff-in-mask animation. */
  var MASK_SELECTORS = "";

  function each(list, fn) {
    Array.prototype.forEach.call(list, fn);
  }

  /* ---------- Mobile nav ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    each(links.querySelectorAll("a"), function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    /* Close menu when clicking outside on mobile */
    document.addEventListener("click", function (e) {
      if (!links.classList.contains("is-open")) return;
      if (toggle.contains(e.target) || links.contains(e.target)) return;
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Enquiry form — front-end demo only ---------- */
  function initForm() {
    var form = document.getElementById("enquiry-form");
    if (!form) return;

    var status = document.getElementById("form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var name = form.querySelector("#name").value.trim();

      status.textContent =
        "Thank you, " + name + ". Your enquiry has been noted. Our export team will " +
        "get back to you within 1–2 business days.";
      status.classList.remove("error");
      status.classList.add("success", "is-visible");
      form.reset();

      status.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    });
  }

  /* ---------- Page entrance ---------- */
  function initPageEntrance() {
    var header = document.querySelector(".site-header");
    if (header && !reduced) header.classList.add("is-entered");
  }

  /* ---------- Heading word reveal ---------- */
  function wrapWords(heading) {
    if (heading.querySelector(".word")) return;
    var words = heading.textContent.trim().split(/\s+/);
    heading.textContent = "";
    words.forEach(function (word, i) {
      var span = document.createElement("span");
      span.className = "word";
      span.style.setProperty("--wi", i);
      span.textContent = word;
      heading.appendChild(span);
      if (i < words.length - 1) {
        heading.appendChild(document.createTextNode(" "));
      }
    });
  }

  function playHeadingReveal(h) {
    h.classList.add("is-words-revealed");
    var total = h.querySelectorAll(".word").length;
    window.setTimeout(function () {
      h.classList.remove("is-words-revealed");
      h.classList.add("reveal-done");
    }, 800 + total * 50);
  }

  function initHeadingReveal() {
    var headings = document.querySelectorAll(HEADING_SELECTORS);
    if (!headings.length) return;

    each(headings, wrapWords);

    if (reduced || !("IntersectionObserver" in window)) {
      each(headings, function (h) { h.classList.add("reveal-done"); });
      return;
    }

    /* Hero headings play on load — they're already above the fold. */
    var heroHeadings = document.querySelectorAll(
      ".hero-copy h1, .gift-hero .hero-copy h1"
    );
    each(heroHeadings, function (h) {
      window.setTimeout(function () { playHeadingReveal(h); }, 350);
    });

    /* Other headings play on scroll. */
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          observer.unobserve(el);
          playHeadingReveal(el);
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" }
    );

    each(headings, function (h) {
      if (h.closest(".hero-copy") || h.closest(".gift-hero")) return;
      observer.observe(h);
    });
  }

  /* Image mask reveal is now merged into initReveal via CSS animation. */
  function initImageMaskReveal() { /* no-op */ }

  /* ---------- Stagger index (CSS reads --i) ---------- */
  function initStagger() {
    each(document.querySelectorAll(STAGGER_PARENTS), function (parent) {
      each(parent.children, function (child, i) {
        child.style.setProperty("--i", i);
      });
    });

    each(document.querySelectorAll("#spices .spec-card, #dry-fruits .spec-card"), function (card, i) {
      card.style.setProperty("--i", i);
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var targets = document.querySelectorAll(REVEAL);
    if (!targets.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      each(targets, function (el) { el.classList.add("reveal-done"); });
      return;
    }

    function settle(el) {
      el.classList.remove("is-revealed");
      el.classList.add("reveal-done");
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          observer.unobserve(el);
          el.addEventListener(
            "animationend",
            function () { settle(el); },
            { once: true }
          );
          el.classList.add("is-revealed");
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );

    each(targets, function (el) { observer.observe(el); });
  }

  /* ---------- Header state, progress bar, back to top ---------- */
  function initScrollEffects() {
    var header = document.querySelector(".site-header");

    var progress = document.createElement("div");
    progress.className = "scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    progress.appendChild(document.createElement("span"));
    document.body.appendChild(progress);
    var fill = progress.firstChild;

    var toTop = document.createElement("button");
    toTop.type = "button";
    toTop.className = "to-top";
    toTop.setAttribute("aria-label", "Back to top");
    toTop.innerHTML = "&uarr;";
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    });
    document.body.appendChild(toTop);

    var ticking = false;
    function update() {
      var y = window.pageYOffset;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
      if (header) header.classList.toggle("is-stuck", y > 12);
      toTop.classList.toggle("is-visible", y > 520);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  /* ---------- Count up ---------- */
  function initCounters() {
    each(document.querySelectorAll("[data-count]"), function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      if (isNaN(target)) return;

      if (reduced) { el.textContent = target; return; }

      var started = false;
      function run() {
        if (started) return;
        started = true;
        var begin = window.performance.now();
        var duration = 1600;
        function step(now) {
          var p = Math.min((now - begin) / duration, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
      }

      if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(
          function (entries) {
            if (!entries[0].isIntersecting) return;
            run();
            observer.disconnect();
          },
          { threshold: 0.4 }
        );
        observer.observe(el);
      } else {
        run();
      }
    });
  }

  /* ---------- Hero slider ---------- */
  function initHeroSlider() {
    var root = document.querySelector(".hero-slider");
    if (!root) return;

    var slides = root.querySelectorAll(".hero-slide");
    var prevBtn = root.querySelector(".hero-nav--prev");
    var nextBtn = root.querySelector(".hero-nav--next");
    if (slides.length < 2) return;

    var index = 0;
    var timer = null;
    var locked = false;
    var AUTO_MS = 6500;

    function goTo(next) {
      if (locked) return;
      next = (next + slides.length) % slides.length;
      if (next === index) return;

      locked = true;
      var current = slides[index];
      var incoming = slides[next];

      current.classList.remove("is-active");
      current.classList.add("is-leaving");
      current.setAttribute("aria-hidden", "true");

      incoming.classList.add("is-active");
      incoming.setAttribute("aria-hidden", "false");

      /* Restart Ken Burns + text entrance on the new slide */
      var mediaImg = incoming.querySelector(".hero-slide__media img");
      if (mediaImg && !reduced) {
        mediaImg.style.animation = "none";
        void mediaImg.offsetWidth;
        mediaImg.style.animation = "";
      }
      each(incoming.querySelectorAll(".hero-copy > *"), function (el) {
        el.style.animation = "none";
        void el.offsetWidth;
        el.style.animation = "";
      });

      window.setTimeout(function () {
        current.classList.remove("is-leaving");
        locked = false;
      }, 850);

      index = next;
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      if (reduced) return;
      stop();
      timer = window.setInterval(next, AUTO_MS);
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); start(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { next(); start(); });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", function (e) {
      if (!root.contains(e.relatedTarget)) start();
    });

    document.addEventListener("keydown", function (e) {
      if (!root.matches(":hover") && document.activeElement && !root.contains(document.activeElement)) return;
      if (e.key === "ArrowLeft") { prev(); start(); }
      if (e.key === "ArrowRight") { next(); start(); }
    });

    start();
  }

  /* ---------- Product collection carousel ---------- */
  function initProductCarousel() {
    var root = document.querySelector("[data-product-carousel]");
    if (!root) return;

    var track = root.querySelector(".product-track");
    var cards = root.querySelectorAll(".product-card");
    var prevBtn = root.querySelector(".product-nav--prev");
    var nextBtn = root.querySelector(".product-nav--next");
    if (!track || !cards.length) return;

    var index = 0;

    function perView() {
      if (window.matchMedia("(max-width: 620px)").matches) return 1;
      if (window.matchMedia("(max-width: 980px)").matches) return 2;
      return 3;
    }

    function maxIndex() {
      return Math.max(0, cards.length - perView());
    }

    function update() {
      var card = cards[0];
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap) || 0;
      var step = card.getBoundingClientRect().width + gap;
      var max = maxIndex();
      if (index > max) index = max;
      track.style.transform = "translateX(" + (-index * step) + "px)";
      if (prevBtn) prevBtn.disabled = index <= 0;
      if (nextBtn) nextBtn.disabled = index >= max;
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        index = Math.max(0, index - 1);
        update();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        index = Math.min(maxIndex(), index + 1);
        update();
      });
    }

    window.addEventListener("resize", update);
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(update);
      ro.observe(root);
    }
    update();
  }

  /* ---------- Hero pointer parallax (legacy art hero) ---------- */
  function initHeroParallax() {
    var art = document.querySelector(".hero-art");
    if (!art || reduced) return;
    if (window.matchMedia("(max-width: 860px)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    var hero = art.closest(".hero");
    if (!hero) return;

    hero.addEventListener("mousemove", function (e) {
      var box = hero.getBoundingClientRect();
      var dx = (e.clientX - (box.left + box.width / 2)) / box.width;
      var dy = (e.clientY - (box.top + box.height / 2)) / box.height;
      art.style.translate = (dx * -8).toFixed(2) + "px " + (dy * -8).toFixed(2) + "px";
    });

    hero.addEventListener("mouseleave", function () {
      art.style.translate = "";
    });
  }

  /* ---------- Healthy range category filter ---------- */
  function initRangeFilter() {
    var filters = document.querySelectorAll(".range-filter");
    var cards = document.querySelectorAll(".healthy-card[data-category]");
    if (!filters.length || !cards.length) return;

    each(filters, function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter") || "all";

        each(filters, function (other) {
          var active = other === btn;
          other.classList.toggle("is-active", active);
          other.setAttribute("aria-selected", active ? "true" : "false");
        });

        each(cards, function (card) {
          var category = card.getAttribute("data-category");
          var show = filter === "all" || category === filter;
          card.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initPageEntrance();
    initNav();
    initYear();
    initForm();
    initHeadingReveal();
    initImageMaskReveal();
    initStagger();
    initReveal();
    initScrollEffects();
    initCounters();
    initHeroSlider();
    initHeroParallax();
    initProductCarousel();
    initRangeFilter();
  });
})();
