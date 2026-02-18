
(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // 1) Copy current URL on #copy-button
  // ---------------------------------------------------------------------------
  const copyBtn = document.getElementById("copy-button");
  if (copyBtn && copyBtn.dataset.copyMounted !== "1") {
    copyBtn.dataset.copyMounted = "1";

    copyBtn.addEventListener("click", async () => {
      const url = window.location.href;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(url);
        } else {
          const input = document.createElement("input");
          input.value = url;
          document.body.appendChild(input);
          input.select();
          document.execCommand("copy");
          document.body.removeChild(input);
        }

        // feedback optionnel
        copyBtn.classList.add("is-copied");
        setTimeout(() => copyBtn.classList.remove("is-copied"), 1200);
      } catch (e) {
        console.warn("Copy failed:", e);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 2) Sticky-ish table content height on scroll
  // ---------------------------------------------------------------------------
  const sectionBlogList = document.querySelector(".section-bloglist-list");
  const csTableContent  = document.querySelector(".cs-table-content");
  if (!sectionBlogList || !csTableContent) return;

  // éviter double init
  if (csTableContent.dataset.scrollMounted === "1") return;
  csTableContent.dataset.scrollMounted = "1";

  const THRESHOLD_PX = 72;
  const OPEN_HEIGHT  = 112;

  function handleScroll() {
    const rect = sectionBlogList.getBoundingClientRect();
    const shouldOpen = rect.top <= THRESHOLD_PX;

    csTableContent.style.height = shouldOpen ? (OPEN_HEIGHT + "px") : "0px";
  }

  // perf: passive + rAF throttle
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      handleScroll();
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  // initial state
  handleScroll();
})();

