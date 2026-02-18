// =========================
// Prefill contact form from URL (?message=...)
// =========================
function initPrefillContactFromURL() {

  function getQueryParams() {
    const params = {};
    const queryString = window.location.search.slice(1);
    if (!queryString) return params;

    queryString.split("&").forEach((pair) => {
      const [key, value] = pair.split("=");
      if (!key) return;
      params[decodeURIComponent(key)] = decodeURIComponent(value || "");
    });

    return params;
  }

  function populateForm(params) {
    const formWrapper = document.querySelector(".solutions-contact-wrapper");
    if (!formWrapper) return;

    const field = formWrapper.querySelector(".contact-text-field");
    if (field && params.message) {
      field.value = params.message;
    }
  }

  const queryParams = getQueryParams();
  populateForm(queryParams);
}
