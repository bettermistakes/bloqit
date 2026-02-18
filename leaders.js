// =========================
// Splide: Team slider (.splide.is-team)
// =========================
function initSplideTeam() {
  if (typeof window.Splide === "undefined") return;

  const el = document.querySelector(".splide.is-team");
  if (!el) return;

  const splide = new window.Splide(".splide.is-team", {
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

    reducedMotion: { speed: 0, rewindSpeed: 0 },

    breakpoints: {
      991: { perPage: 1, gap: "1rem" },
      767: { perPage: 1, gap: "1rem" },
    },
  });

  splide.mount();
}

// =========================
// Pane-arrow -> next tab in .rotation-tabs-menu
// =========================
function initPaneArrowNextTab() {
  const paneArrows = Array.from(document.querySelectorAll(".pane-arrow"));
  if (!paneArrows.length) return;

  paneArrows.forEach((arrow) => {
    arrow.addEventListener("click", () => {
      const currentTab = document.querySelector(".rotation-tabs-menu .w--current");
      const nextTab = currentTab?.nextElementSibling;
      if (nextTab) nextTab.click();
    });
  });
}

// =========================
// Rotating Tabs: scroll active tab into view (mobile-friendly)
// =========================
function initRotatingTabsScrollActive() {
  const rotatingTabs = document.querySelector(".rotation-tabs");
  const menu = document.querySelector(".rotation-tabs-menu");
  if (!rotatingTabs || !menu) return;

  const scrollToActiveTab = () => {
    const activeTabLink = document.querySelector(".rotating-tab-link.w--current");
    if (!activeTabLink) return;

    const activeRect = activeTabLink.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();

    const scrollAmount = activeRect.left - menuRect.left + menu.scrollLeft;

    menu.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  // Click anywhere in tabs component (works with Webflow tab clicks)
  rotatingTabs.addEventListener("click", scrollToActiveTab);

  // Also run once at init (in case a tab is already active)
  scrollToActiveTab();
}

// =========================
// BOOT (use your onReady helper)
// =========================
onReady(() => {
  initSplideTeam();
  initPaneArrowNextTab();
  initRotatingTabsScrollActive();
});
