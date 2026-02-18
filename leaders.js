
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

  function raf2(cb) {
    requestAnimationFrame(() => requestAnimationFrame(cb));
  }

  function mountWhenReady(fn, opts) {
    const tries = (opts && opts.tries) || 80;   // ~8s
    const every = (opts && opts.every) || 100;  // 100ms
    let n = 0;

    const t = setInterval(() => {
      n++;
      const ok = fn();
      if (ok || n >= tries) clearInterval(t);
    }, every);
  }

  // ---------------------------------------------------------------------------
  // 1) Splide Slider (.splide.is-team)
  // ---------------------------------------------------------------------------
  function initSplideTeam() {
    const root = document.querySelector(".splide.is-team");
    if (!root) return false;

    // avoid double init
    if (root.dataset.splideMounted === "1") return true;

    // wait until Splide is available + markup exists
    const hasSplide = typeof window.Splide !== "undefined";
    const hasMarkup =
      !!root.querySelector(".splide__track") &&
      !!root.querySelector(".splide__list") &&
      !!root.querySelector(".splide__slide");

    if (!hasSplide || !hasMarkup) return false;

    const splide = new window.Splide(root, {
      type: "loop",
      perPage: 3,
      perMove: 1,
      focus: "left",
      speed: 500,
      drag: false,
      gap: "4rem",
      autoplay: false,
      interval: 2000,
      arrows: true,
      pauseOnHover: true,
      keyboard: true,
      rewind: false,
      pagination: true,

      reducedMotion: {
        speed: 0,
        rewindSpeed: 0,
      },

      breakpoints: {
        991: { perPage: 1, gap: "1rem" },
        767: { perPage: 1, gap: "1rem" },
      },
    });

    splide.mount();
    root.dataset.splideMounted = "1";
    return true;
  }

  // ---------------------------------------------------------------------------
  // 2) Pane-arrow → next tab
  // ---------------------------------------------------------------------------
  function initPaneArrows() {
    const paneArrows = document.querySelectorAll(".pane-arrow");
    if (!paneArrows.length) return;

    paneArrows.forEach((arrow) => {
      arrow.addEventListener("click", () => {
        const currentTab = document.querySelector(".rotation-tabs-menu .w--current");
        if (!currentTab) return;

        const nextTab = currentTab.nextElementSibling;
        if (nextTab && typeof nextTab.click === "function") {
          nextTab.click();
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 3) Rotating tabs → scroll active tab into view (mobile)
  // ---------------------------------------------------------------------------
  function initRotatingTabsScroll() {
    const rotatingTabs = document.querySelector(".rotation-tabs");
    const menu = document.querySelector(".rotation-tabs-menu");
    if (!rotatingTabs || !menu) return;

    function scrollToActiveTab() {
      const activeTabLink = document.querySelector(".rotating-tab-link.w--current");
      if (!activeTabLink) return;

      const activeTabRect = activeTabLink.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();

      // place active tab as close as possible to the left edge of the menu
      const scrollAmount = activeTabRect.left - menuRect.left + menu.scrollLeft;

      menu.scrollTo({
        left: Math.max(0, scrollAmount),
        behavior: "smooth",
      });
    }

    // When user clicks a tab OR arrows change tabs, wait a tick then scroll
    rotatingTabs.addEventListener("click", () => raf2(scrollToActiveTab));

    // Also scroll on load (useful when a tab is preselected)
    raf2(scrollToActiveTab);
  }

  // ---------------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------------
  onReady(() => {
    // Splide might load after DOM via external script -> poll until ready
    mountWhenReady(initSplideTeam, { tries: 120, every: 100 });

    initPaneArrows();
    initRotatingTabsScroll();
  });
})();
