(function () {
  "use strict";

  const btn = document.getElementById("copy-button");
  if (!btn) return;

  // prevent double bind
  if (btn.dataset.copyMounted === "1") return;
  btn.dataset.copyMounted = "1";

  btn.addEventListener("click", async function () {
    const currentUrl = window.location.href;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const tempInput = document.createElement("input");
        tempInput.value = currentUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      // optional feedback
      btn.classList.add("copied");
      setTimeout(() => btn.classList.remove("copied"), 1500);

    } catch (err) {
      console.warn("Copy failed:", err);
    }
  });
})();