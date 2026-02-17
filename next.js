
(() => {
  const onReady = (cb) => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", cb);
    else cb();
  };

  // ---------------------------
  // 1) POWER TABS (scoped per .section-hardware-power, excluding engineered)
  // ---------------------------
  function initPowerTabsGlobal($) {
    const $sections = $(".section-hardware-power").filter(function () {
      return !$(this).closest(".section-hardware-engineered").length;
    });
    if (!$sections.length) return;

    $sections.each(function () {
      const $section = $(this);

      const $container = $section.find(".power-container").first();
      const $tabs = $container.find(".power-tab");

      // States are in .power-parent (NOT inside power-container)
      const $statesWrap = $section.find(".power-parent").first();
      const $states = $statesWrap.find(".power-state");
      const $state1 = $statesWrap.find(".power-state.is-1");
      const $state2 = $statesWrap.find(".power-state.is-2");

      if (!$container.length || !$tabs.length || !$states.length) return;

      const firstKey = $tabs.filter("#tab-1").length
        ? "tab-1"
        : ($tabs.first().attr("id") || "tab-1");

      let lastClickedKey = firstKey;
      let hoverRevertTimer = null;

      // Preload images in states (avoid flash)
      $states.find("img, source").each(function () {
        const el = this;
        const src = el.currentSrc || el.src || el.getAttribute("srcset");
        if (!src) return;
        const url = typeof src === "string" ? src.split(" ")[0] : null;
        if (!url) return;
        const i = new Image();
        i.src = url;
      });

      function getTabByKey(key) {
        try {
          return $tabs.filter("#" + CSS.escape(key)).first();
        } catch (e) {
          return $tabs.filter("#" + key.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|\/@])/g, "\\$1")).first();
        }
      }

      function showStateByKey(key) {
        if (!getTabByKey(key).length) key = firstKey;

        // Tabs UI (scoped to section)
        $section.find(".power-tab, .power-title, .power-text").removeClass("active");
        const $activeTab = getTabByKey(key).addClass("active");
        $activeTab.find(".power-title, .power-text").addClass("active");

        // Visuals (scoped to states wrap)
        $states.stop(true, true).hide();
        if (key === "tab-1") $state1.stop(true, true).fadeIn(180);
        else $state2.stop(true, true).fadeIn(180);
      }

      // Click
      $tabs.off(".tabsGlobal").on("click.tabsGlobal", function () {
        const key = this.id || firstKey;
        lastClickedKey = key;
        clearTimeout(hoverRevertTimer);
        showStateByKey(key);
      });

      // Focus keyboard
      $tabs.off(".tabsGlobalFocus").on("focusin.tabsGlobalFocus", function () {
        clearTimeout(hoverRevertTimer);
        showStateByKey(this.id || firstKey);
      });

      // When leaving the tabs container (tabbing out)
      $container.off(".tabsGlobalOut").on("focusout.tabsGlobalOut", function (e) {
        if (!$container[0].contains(e.relatedTarget)) {
          clearTimeout(hoverRevertTimer);
          hoverRevertTimer = setTimeout(() => showStateByKey(lastClickedKey), 80);
        }
      });

      // Hover desktop only, responsive to breakpoint changes
      function bindHover(enable) {
        if (enable) {
          $tabs.off(".tabsGlobalHover").on("mouseenter.tabsGlobalHover", function () {
            clearTimeout(hoverRevertTimer);
            showStateByKey(this.id || firstKey);
          });
          $container.off(".tabsGlobalHoverLeave").on("mouseleave.tabsGlobalHoverLeave", function () {
            clearTimeout(hoverRevertTimer);
            hoverRevertTimer = setTimeout(() => showStateByKey(lastClickedKey), 80);
          });
        } else {
          $tabs.off(".tabsGlobalHover");
          $container.off(".tabsGlobalHoverLeave");
        }
      }

      const mq = window.matchMedia("(min-width: 992px)");
      bindHover(mq.matches);
      mq.addEventListener("change", (e) => bindHover(e.matches));

      // Init
      $states.hide();
      showStateByKey(lastClickedKey);
    });
  }

  // ---------------------------
  // 2) MARKET TABS TIMER
  // ---------------------------
  function initMarketTabsTimer() {
    const tabContainer = document.querySelector(".layout28_tabs");
    const tabLinks = Array.from(document.querySelectorAll(".layout28_tabs-link"));
    const panes = Array.from(document.querySelectorAll(".market-tab-pane"));
    if (!tabContainer || !tabLinks.length || !panes.length) return;

    const delay = 7000;
    let currentIndex = Math.max(0, tabLinks.findIndex((a) => a.classList.contains("w--current")));
    let autoplayTimer;
    let isActive = false;

    function resetTimerBars() {
      tabLinks.forEach((link) => {
        const bar = link.querySelector(".tab-timer-market");
        if (!bar) return;
        bar.style.transition = "none";
        bar.style.transform = "scaleY(0)";
        bar.offsetHeight;
      });
    }

    function animateActiveTimer(index) {
      const bar = tabLinks[index]?.querySelector(".tab-timer-market");
      if (!bar) return;
      bar.style.transition = `transform ${delay}ms linear`;
      bar.style.transform = "scaleY(1)";
    }

    function updateActiveTextTab(index) {
      tabLinks.forEach((link, i) => {
        const textTab = link.querySelector(".text-tab");
        if (textTab) textTab.classList.toggle("is-active", i === index);
      });
    }

    function switchTo(index) {
      if (!tabLinks[index] || !panes[index]) return;

      tabLinks.forEach((a, i) => {
        a.classList.toggle("w--current", i === index);
        a.setAttribute("aria-selected", i === index ? "true" : "false");
        a.tabIndex = i === index ? 0 : -1;
      });

      panes.forEach((p, i) => {
        const active = i === index;
        p.classList.toggle("w--tab-active", active);
        p.style.opacity = active ? "1" : "0";
        p.style.transition = "opacity 400ms";
        if (active) p.removeAttribute("hidden");
        else p.setAttribute("hidden", "hidden");
      });

      currentIndex = index;
      resetTimerBars();
      animateActiveTimer(index);
      updateActiveTextTab(index);
    }

    function nextTab() {
      switchTo((currentIndex + 1) % tabLinks.length);
    }

    function startAutoplay() {
      if (!isActive) return;
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(nextTab, delay);
    }

    function stopAutoplay() {
      clearInterval(autoplayTimer);
    }

    tabLinks.forEach((tab, index) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const { scrollX, scrollY } = window;
        switchTo(index);
        requestAnimationFrame(() => window.scrollTo(scrollX, scrollY));
        startAutoplay();
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isActive = true;
            switchTo(currentIndex || 0);
            startAutoplay();
          } else {
            isActive = false;
            stopAutoplay();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(tabContainer);
  }

  // ---------------------------
  // 3) SPLIDE
  // ---------------------------
  function initSplide() {
    if (typeof window.Splide === "undefined") return;
    if (!document.querySelector(".splide.is-certif")) return;

    const splide = new window.Splide(".splide.is-certif", {
      type: "slider",
      perPage: 2,
      perMove: 1,
      focus: "left",
      speed: 500,
      drag: true,
      gap: "1.25rem",
      autoplay: false,
      interval: 2000,
      pauseOnHover: true,
      keyboard: true,
      rewind: false,
      pagination: false,
      reducedMotion: { speed: 0, rewindSpeed: 0, autoplay: "pause" },
      breakpoints: {
        991: { gap: "1rem", perPage: 1 },
        767: { gap: "1rem", perPage: 1 },
      },
    });

    splide.mount();
  }

  // ---------------------------
  // 4) FAQ A11Y (jQuery)
  // ---------------------------
  function initFaqA11y($) {
    const $items = $(".faq-container_item");
    if (!$items.length) return;

    $.fn.toggleAttrVal = function (attr, val1, val2) {
      const test = $(this).attr(attr);
      if (test === val1) return $(this).attr(attr, val2);
      if (test === val2) return $(this).attr(attr, val1);
      return $(this).attr(attr, val1);
    };

    $items.off(".faqA11y").on("keydown.faqA11y", function (e) {
      if (e.which !== 13 && e.which !== 32) return;
      e.preventDefault();

      const evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      $(this).get(0).dispatchEvent(evt);
    });

    $items.off(".faqAria").on("click.faqAria touchend.faqAria", function () {
      $(this).toggleAttrVal("aria-expanded", "false", "true");
      $(this).parent().find(".faq-answer").toggleAttrVal("aria-hidden", "true", "false");
    });
  }

  // ---------------------------
  // 5) HARDWARE ENGINEERED (isolated tabs only) — unchanged
  // ---------------------------
  function initHardwareEngineeredTabs($) {
    const $sections = $(".section-hardware-engineered");
    if (!$sections.length) return;

    $sections.each(function () {
      const $root = $(this);
      const $tabs = $root.find(".power-tab");
      const $container = $root.find(".power-container");
      const $states = $root.find(".power-state");
      const $state1 = $root.find(".power-state.is-1");
      const $state2 = $root.find(".power-state.is-2");
      if (!$tabs.length || !$container.length || !$states.length) return;

      const firstId = $tabs.filter("#tab-1").length ? "#tab-1" : ("#" + ($tabs.first().attr("id") || ""));
      let lastClickedTab = firstId || "#tab-1";
      let hoverRevertTimer = null;
      let hoverBound = false;

      function showStateById(id) {
        if (!id || !$root.find(id).length) id = firstId;
        $root.find(".power-tab, .power-title, .power-text").removeClass("active");
        const $tab = $root.find(id);
        $tab.addClass("active");
        $tab.find(".power-title, .power-text").addClass("active");

        $states.stop(true, true).fadeOut(220);
        if (id === "#tab-1") $state1.fadeIn(220);
        else $state2.fadeIn(220);
      }

      function ensureActive() {
        if (!$root.find(".power-tab.active").length) showStateById(lastClickedTab || firstId);
      }

      $tabs.on("click.engineered", function () {
        const id = "#" + this.id;
        lastClickedTab = id;
        clearTimeout(hoverRevertTimer);
        showStateById(id);
      });

      $tabs.on("focusin.engineered", function () {
        clearTimeout(hoverRevertTimer);
        showStateById("#" + this.id);
      });

      $container.on("focusout.engineered", function (e) {
        if (!$container[0].contains(e.relatedTarget)) {
          clearTimeout(hoverRevertTimer);
          hoverRevertTimer = setTimeout(() => showStateById(lastClickedTab), 80);
        }
      });

      function toggleHoverBindings(enable) {
        if (enable && !hoverBound) {
          $tabs.on("mouseenter.engineeredHover", function () {
            clearTimeout(hoverRevertTimer);
            showStateById("#" + this.id);
          });
          $container.on("mouseleave.engineeredHover", function () {
            clearTimeout(hoverRevertTimer);
            hoverRevertTimer = setTimeout(() => showStateById(lastClickedTab), 80);
          });
          hoverBound = true;
        } else if (!enable && hoverBound) {
          $tabs.off(".engineeredHover");
          $container.off(".engineeredHover");
          hoverBound = false;
          ensureActive();
        }
      }

      const mq = window.matchMedia("(min-width: 992px)");
      toggleHoverBindings(mq.matches);
      mq.addEventListener("change", (e) => {
        toggleHoverBindings(e.matches);
        ensureActive();
      });

      showStateById(firstId);
    });
  }

  // ---------------------------
  // Boot
  // ---------------------------
  onReady(() => {
    const hasJQ = typeof window.jQuery !== "undefined";
    const $ = hasJQ ? window.jQuery : null;

    if (hasJQ) {
      initPowerTabsGlobal($);
      initFaqA11y($);
      initHardwareEngineeredTabs($);
    }

    initMarketTabsTimer();
    initSplide();
  });
})();

