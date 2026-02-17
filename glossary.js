// =========================
// Helpers
// =========================
const onReady = (cb) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cb, { once: true });
  } else {
    cb();
  }
};

// =========================
// 1) Glossary: add .tag if opacity-80 is empty
// =========================
function initGlossaryEmptyTag() {
  const glossaryItems = document.querySelectorAll(".glossary-item");
  if (!glossaryItems.length) return;

  glossaryItems.forEach((item) => {
    const isOpacity80 = item.querySelector(".body-medium.is-opacity-80");
    if (isOpacity80 && isOpacity80.textContent.trim() === "") {
      item.classList.add("tag");
    }
  });
}

// =========================
// 2) Glossary: disable tags + hide items if count < 3
//    (MutationObserver-safe with raf throttle)
// =========================
function initGlossaryTagsFilter() {
  const root = document.body;
  if (!root) return;

  let scheduled = false;

  function updateGlossaryTags() {
    scheduled = false;

    const glossaryTags = document.querySelectorAll(".glossary-tag");
    const glossaryItems = document.querySelectorAll(".glossary-item");
    if (!glossaryTags.length && !glossaryItems.length) return;

    const letterCount = {};

    glossaryTags.forEach((tag) => {
      const d = tag.querySelector("div");
      const letter = (d?.textContent || "").trim().charAt(0).toUpperCase();
      if (!letter) return;
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    });

    glossaryItems.forEach((item) => {
      const t = item.querySelector(".glossary-title");
      const letter = (t?.textContent || "").trim().charAt(0).toUpperCase();
      if (!letter) return;
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    });

    glossaryTags.forEach((tag) => {
      const d = tag.querySelector("div");
      const letter = (d?.textContent || "").trim().charAt(0).toUpperCase();
      if (!letter) return;

      if ((letterCount[letter] || 0) < 3) {
        tag.style.opacity = "0.24";
        tag.style.pointerEvents = "none";
      } else {
        tag.style.opacity = "1";
        tag.style.pointerEvents = "auto";
      }
    });

    glossaryItems.forEach((item) => {
      const t = item.querySelector(".glossary-title");
      const letter = (t?.textContent || "").trim().charAt(0).toUpperCase();
      if (!letter) return;

      item.style.display = (letterCount[letter] || 0) < 3 ? "none" : "block";
    });
  }

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateGlossaryTags);
  }

  // first run
  updateGlossaryTags();

  // observe changes
  const observer = new MutationObserver(scheduleUpdate);
  observer.observe(root, { childList: true, subtree: true });
}

// =========================
// 3) Banner spacing (safe if elements missing)
// =========================
function initBannerSpacing() {
  const navbarBanner = document.querySelector(".navbar_banner");
  const bannerSpacing = document.querySelector(".banner-spacing");
  if (!navbarBanner || !bannerSpacing) return;

  const rect = navbarBanner.getBoundingClientRect();
  const visible = rect.width > 0 || rect.height > 0;

  bannerSpacing.style.display = visible ? "block" : "none";
}

// =========================
// 4) Filter reset radio: add inactive when any radio selected
// =========================
function initFilterResetInactive() {
  const resetElement = document.querySelector(".filter-item-reset.w-radio");
  if (!resetElement) return;

  const radios = document.querySelectorAll('.filter-item.w-radio input[type="radio"]');
  if (!radios.length) return;

  function update() {
    const anyChecked = Array.from(radios).some((r) => r.checked);
    resetElement.classList.toggle("inactive", anyChecked);
  }

  radios.forEach((radio) => radio.addEventListener("change", update));
  update();
}

// =========================
// 5) Hide empty CMS items (height 0)
// =========================
function initHideEmptyDynItems() {
  const items = document.querySelectorAll(".w-dyn-item");
  if (!items.length) return;

  items.forEach((item) => {
    if (item.clientHeight === 0) item.style.display = "none";
  });
}

// =========================
// Boot (ONE ready)
// =========================
onReady(() => {
  initGlossaryEmptyTag();
  initGlossaryTagsFilter();
  initBannerSpacing();
  initFilterResetInactive();
  initHideEmptyDynItems();
});
