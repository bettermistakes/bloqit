(function () {
  "use strict";

  const btn = document.getElementById("copy-button");
  if (!btn) return;

  // éviter double binding
  if (btn.dataset.copyMounted === "1") return;
  btn.dataset.copyMounted = "1";

  btn.addEventListener("click", async function () {
    const url = window.location.href;

    try {
      // Méthode moderne
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } 
      // Fallback
      else {
        const input = document.createElement("input");
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }

      // feedback optionnel
      btn.classList.add("is-copied");
      setTimeout(() => btn.classList.remove("is-copied"), 1200);

    } catch (e) {
      console.warn("Copy failed:", e);
    }
  });
})();