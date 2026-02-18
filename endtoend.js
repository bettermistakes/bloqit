/**
 * Netlify-safe bundle
 * - CounterUp: one config only (your "fast" one had wrong keys: delai/duree)
 * - Stack cards: fixed querySelector strings + selector fallback
 */
(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  function onReady(cb) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", cb, { once: true });
    } else {
      cb();
    }
  }

  function mountWhenReady(fn, opts) {
    const tries = (opts && opts.tries) || 80;
    const every = (opts && opts.every) || 100;
    let n = 0;

    const t = setInterval(() => {
      n++;
      const ok = fn();
      if (ok || n >= tries) clearInterval(t);
    }, every);
  }

  // ---------------------------------------------------------------------------
  // 1) CounterUp (.counterfast)
  // ---------------------------------------------------------------------------
  function initCounterUp() {
    if (!window.jQuery) return false;
    const $ = window.jQuery;

    if (!$.fn.counterUp) return false;

    const $els = $(".counterfast");
    if (!$els.length) return true;

    // avoid double init
    if ($els.first().data("counterMounted") === 1) return true;

    // ✅ keep your working settings (delay/time)
    $els.counterUp({ delay: 5, time: 2000 });

    // keep your classes (use either animated/anime, not both)
    $els.addClass("animated fadeInDownBig");
    $("h3").addClass("animated fadeIn");

    $els.first().data("counterMounted", 1);
    return true;
  }

  // ---------------------------------------------------------------------------
  // 2) Stack cards animation (checkbox logic)
  // ---------------------------------------------------------------------------
  function initStackCards() {
    // ✅ FIX: your HTML uses .stack--parent, not .section-end-to-stack
    const section =
      document.querySelector(".stack--parent") ||
      document.querySelector(".section-end-to-stack");

    if (!section) return false;

    // avoid double init
    if (section.dataset.stackMounted === "1") return true;
    section.dataset.stackMounted = "1";

    // Elements
    const allInsides = Array.from(section.querySelectorAll(".stack-item_inside[stack]"));
    const allLogos   = Array.from(section.querySelectorAll(".active-card-logo"));
    const solTexts   = Array.from(section.querySelectorAll(".solution-text"));

    const stack2Wrap1 = section.querySelector(".stack-2items");
    const stack2Wrap2 = section.querySelector(".stack-2items_inside");

    const stack3Wrap1 = section.querySelector(".stack-3items");
    const stack3Wrap2 = section.querySelector(".stack-3items_intern");

    // wrappers for 2 + 3
    const stack23Wrap1 = section.querySelector(".stack-2-3items");
    const stack23Wrap2 = section.querySelector(".stack-2-3items_inside");

    const insideByStack = (n) => section.querySelector(`.stack-item_inside[stack="${n}"]`);
    const logoByStack   = (n) => insideByStack(n)?.querySelector(".active-card-logo");

    const parentBorderOfInside = (inside) => inside?.closest(".stack-item_border");
    const parentItemOfInside   = (inside) => inside?.closest(".stack-item");

    const solTextByStack = (n) => section.querySelector(`.solution-text.is-${n}`);
    const solTextByClass = (cls) => section.querySelector(`.solution-text.${cls}`);

    // Checkbox state
    const selected = new Set(); // 1,2,3
    let userInteracted = false;

    // Helpers
    const removeActiveEverywhere = () => {
      allInsides.forEach(el => el.classList.remove("is-active"));
      allLogos.forEach(el => el.classList.remove("is-active"));
      solTexts.forEach(el => el.classList.remove("is-active"));

      section.querySelectorAll(".stack-item_border.is-active").forEach(el => el.classList.remove("is-active"));
      section.querySelectorAll(".stack-item.is-active").forEach(el => el.classList.remove("is-active"));

      stack2Wrap1?.classList.remove("is-active");
      stack2Wrap2?.classList.remove("is-active");
      stack3Wrap1?.classList.remove("is-active");
      stack3Wrap2?.classList.remove("is-active");
      stack23Wrap1?.classList.remove("is-active");
      stack23Wrap2?.classList.remove("is-active");
    };

    const activateChain = (n) => {
      const inside = insideByStack(n);
      if (!inside) return;
      inside.classList.add("is-active");
      parentBorderOfInside(inside)?.classList.add("is-active");
      parentItemOfInside(inside)?.classList.add("is-active");
    };

    const activateInsideOnly = (n) => insideByStack(n)?.classList.add("is-active");
    const activateLogo = (n) => logoByStack(n)?.classList.add("is-active");

    // RENDER RULES
    const render = () => {
      removeActiveEverywhere();

      const has1 = selected.has(1);
      const has2 = selected.has(2);
      const has3 = selected.has(3);
      const count = selected.size;

      // 1 + 2 + 3
      if (count === 3) {
        allInsides.forEach(el => el.classList.add("is-active"));
        allLogos.forEach(el => el.classList.add("is-active"));
        stack3Wrap1?.classList.add("is-active");
        stack3Wrap2?.classList.add("is-active");
        solTextByStack(3)?.classList.add("is-active");
        return;
      }

      // pairs
      if (count === 2 && has1 && has2) {
        stack2Wrap1?.classList.add("is-active");
        stack2Wrap2?.classList.add("is-active");
        activateInsideOnly(1);
        activateInsideOnly(2);
        activateLogo(1);
        activateLogo(2);
        solTextByClass("is-5")?.classList.add("is-active");
        return;
      }

      if (count === 2 && has1 && has3) {
        activateChain(1);
        activateChain(3);
        activateLogo(1);
        activateLogo(3);
        solTextByClass("is-1-3")?.classList.add("is-active");
        return;
      }

      if (count === 2 && has2 && has3) {
        stack23Wrap1?.classList.add("is-active");
        stack23Wrap2?.classList.add("is-active");
        activateInsideOnly(2);
        activateInsideOnly(3);
        activateLogo(2);
        activateLogo(3);
        solTextByClass("is-7")?.classList.add("is-active");
        return;
      }

      // singles
      if (count === 1 && has1) {
        activateChain(1);
        activateLogo(1);
        solTextByStack(1)?.classList.add("is-active");
        return;
      }

      if (count === 1 && has2) {
        activateChain(2);
        activateLogo(2);
        solTextByClass("is-6")?.classList.add("is-active");
        return;
      }

      if (count === 1 && has3) {
        activateChain(3);
        activateLogo(3);
        solTextByClass("is-4")?.classList.add("is-active");
        return;
      }
    };

    const toggleStack = (n) => {
      selected.has(n) ? selected.delete(n) : selected.add(n);
      render();
    };

    // Click delegation
    section.addEventListener("click", (e) => {
      const inside = e.target.closest(".stack-item_inside[stack]");
      if (!inside || !section.contains(inside)) return;

      e.preventDefault();
      userInteracted = true;

      const n = Number(inside.getAttribute("stack"));
      if (n === 1 || n === 2 || n === 3) toggleStack(n);
    });

    // Default activation (only before interaction)
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !userInteracted && selected.size === 0) {
          selected.add(1);
          render();
        }
      });
    }, { threshold: 0.35 });

    io.observe(section);

    // safety fallback
    setTimeout(() => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const visible = rect.top < vh * 0.65 && rect.bottom > vh * 0.35;
      if (visible && !userInteracted && selected.size === 0) {
        selected.add(1);
        render();
      }
    }, 50);

    return true;
  }

  // ---------------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------------
  onReady(() => {
    mountWhenReady(initCounterUp, { tries: 120, every: 100 });
    mountWhenReady(initStackCards, { tries: 120, every: 100 });
  });
})();