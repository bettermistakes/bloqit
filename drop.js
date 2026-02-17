
(() => {
  // ---------------------------
  // Helpers
  // ---------------------------
  const onReady = (cb) => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", cb);
    else cb();
  };

  // ---------------------------
  // 1) DROP POPUP close + unlock scroll
  // ---------------------------
  function initDropPopupClose() {
    const popup = document.querySelector(".drop-popup");
    const closeBtn = document.querySelector(".close-drop-popup");

    const unlockScroll = () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };

    function closePopup() {
      if (popup) popup.style.display = "none";
      unlockScroll();
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        closePopup();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" || e.key === "Esc") closePopup();
    });

    // Just in case scroll is stuck on load
    unlockScroll();
  }

  // ---------------------------
  // 2) Drop Form: professional email validation + controlled redirect
  // ---------------------------
  function initDropFormEmailGate() {
    const form =
      document.getElementById("wf-form-Drop-Form") ||
      document.querySelector("form.drop-form");
    if (!form) return;

    const emailInput =
      document.getElementById("Company-s-Email") ||
      form.querySelector('input[type="email"]');

    const submitBtn =
      form.querySelector('input[type="submit"], button[type="submit"]');

    if (!emailInput || !submitBtn) return;

    // Grab & disable Webflow redirect
    const redirectURL =
      form.getAttribute("data-redirect") || form.getAttribute("redirect") || "";
    form.removeAttribute("data-redirect");
    form.removeAttribute("redirect");
    form.noValidate = true;

    // Error UI
    const errId = (emailInput.id || "email") + "-error";
    let errEl = document.getElementById(errId);
    if (!errEl) {
      errEl = document.createElement("div");
      errEl.id = errId;
      errEl.style.cssText =
        "margin-top:6px;font-size:12px;line-height:1.3;color:#c62828;display:none;";
      emailInput.setAttribute("aria-describedby", errId);
      emailInput.insertAdjacentElement("afterend", errEl);
    }

    function setError(msg) {
      errEl.textContent = msg || "";
      errEl.style.display = msg ? "block" : "none";
      emailInput.setAttribute("aria-invalid", msg ? "true" : "false");
      submitBtn.disabled = !!msg;
    }

    // Rules
    const COMMON_TLDS = new Set([
      "com","net","org","io","co","ai","app","dev","cloud","tech","site","shop","store","biz",
      "info","me","name","pro","xyz","club","online","systems","company","email","digital",
      "consulting","solutions","group","agency","studio","design","works","global","services",
      "fr","ma","de","es","it","pt","uk","ie","ch","be","nl","se","no","dk","fi","ca","us","au",
      "in","sg","hk","jp","kr","ae","qa","sa","tr","pl","cz","sk","ro","bg","hu","gr","ru","ua"
    ]);

    const PUBLIC_DOMAINS = new Set([
      "gmail.com","googlemail.com","yahoo.com","hotmail.com","outlook.com","live.com","aol.com",
      "icloud.com","me.com","proton.me","protonmail.com","msn.com","gmx.com","yandex.com",
      "zoho.com","mail.com","pm.me"
    ]);

    const DISPOSABLE_RE =
      /(mailinator|10minutemail|guerrillamail|yopmail|trashmail|tempmail|moakt|getnada|sharklasers|maildrop|burnermail|linshiemail|throwaway|temp-mail)/i;

    const ROLE_ACCOUNTS = new Set([
      "admin","administrator","root","webmaster","postmaster","hostmaster","abuse",
      "noreply","no-reply","donotreply","do-not-reply","info","contact","sales",
      "support","help","billing","accounts","hello","team","jobs","career","hr",
      "office","marketing","newsletter"
    ]);

    const MSG = {
      invalid: "Please enter a valid professional email (e.g. name@company.com).",
      public:  "Please use your company email address (not Gmail/Yahoo/etc.).",
      dispo:   "Temporary or disposable email addresses are not allowed.",
      role:    "Please use a personal company mailbox (not a generic one like info@).",
      tld:     "Please check the domain extension (TLD). It seems incorrect."
    };

    function normalize(v){
      try { return v.trim().normalize("NFC").toLowerCase(); }
      catch { return v.trim().toLowerCase(); }
    }
    function isAscii(s){ return /^[\x20-\x7E]*$/.test(s); }

    function basicFormatOK(local, domain){
      const full = local + "@" + domain;
      if (full.length > 254) return false;
      if (local.length < 1 || local.length > 64) return false;
      if (!/^[a-z]/i.test(local)) return false;          // starts with letter
      if (local.includes("+")) return false;             // blocks +
      if (/(\.\.|^\.)|(\.$)/.test(local)) return false;  // .., .start/.end
      if (!/^[a-z0-9._%+-]+$/i.test(local)) return false;

      if (!domain || domain.endsWith(".")) return false;
      const labels = domain.split(".");
      if (labels.length < 2) return false;
      for (const lbl of labels){
        if (!/^[a-z0-9-]{1,63}$/i.test(lbl)) return false;
        if (/^-|-$/.test(lbl)) return false;
      }
      const tld = labels[labels.length - 1];
      if (!/^[a-z]{2,24}$/i.test(tld)) return false;
      if (/^\d+$/.test(tld)) return false;
      return true;
    }

    function classify(email){
      if (!email || !email.includes("@")) return {ok:false, reason:"invalid"};
      if (!isAscii(email)) return {ok:false, reason:"invalid"};
      const parts = email.split("@");
      if (parts.length !== 2) return {ok:false, reason:"invalid"};

      const [local, domain] = parts;
      if (!basicFormatOK(local, domain)) return {ok:false, reason:"invalid"};
      if (ROLE_ACCOUNTS.has(local)) return {ok:false, reason:"role"};
      if (PUBLIC_DOMAINS.has(domain)) return {ok:false, reason:"public"};
      if (DISPOSABLE_RE.test(domain)) return {ok:false, reason:"dispo"};
      const tld = domain.split(".").pop();
      if (!COMMON_TLDS.has(tld)) return {ok:false, reason:"tld"};
      return {ok:true};
    }

    function validateNow(){
      const email = normalize(emailInput.value);
      if (!email){ setError(""); return; }
      const res = classify(email);
      if (res.ok) setError("");
      else setError(MSG[res.reason] || MSG.invalid);
    }

    // Live validation
    submitBtn.disabled = true;
    emailInput.addEventListener("input", validateNow);
    emailInput.addEventListener("blur", validateNow);
    emailInput.addEventListener("paste", () => setTimeout(validateNow, 0));

    // Block submit if invalid (capture: before Webflow)
    form.addEventListener("submit", function (e) {
      const res = classify(normalize(emailInput.value));
      if (!res.ok) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        setError(MSG[res.reason] || MSG.invalid);
        emailInput.focus();
        emailInput.select?.();
        return false;
      }
      // Valid => let Webflow submit (AJAX). Redirect handled below.
    }, true);

    // Redirect after success box appears
    if (redirectURL) {
      const doneBox = form.parentElement?.querySelector(".w-form-done");
      if (doneBox) {
        const mo = new MutationObserver(() => {
          const visible = getComputedStyle(doneBox).display !== "none";
          if (visible) {
            window.location.href = redirectURL;
            mo.disconnect();
          }
        });
        mo.observe(doneBox, { attributes: true, attributeFilter: ["style","class"] });
      }
    }
  }

  // ---------------------------
  // 3) Hardware video: autoplay muted + user Mute/Unmute (jQuery)
  // ---------------------------
  function initHardwareVideos($) {
    const $wraps = $(".hardware-video_wrapper");
    if (!$wraps.length) return;

    $wraps.each(function (i) {
      const tag = `nv-video[${i + 1}]`;

      const $wrap = $(this);
      const $video = $wrap.find("video.nv-video");
      if (!$video.length) return;

      const video = $video[0];
      const $btn = $wrap.find(".controls-square");

      const $playUI = $wrap.find(".play-video, .play-text");
      const $pauseUI = $wrap.find(".pause-video, .pause-text");
      const $playText = $wrap.find(".play-text");
      const $pauseText = $wrap.find(".pause-text");
      const $playIcon = $wrap.find(".play-video");
      const $pauseIcon = $wrap.find(".pause-video");

      // Autoplay-friendly baseline
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.autoplay = false;

      // Start muted (reliable autoplay)
      video.muted = true;
      video.setAttribute("muted", "");

      let userRequestedUnmute = false;

      // Labels
      $playText.text("Unmute");
      $pauseText.text("Mute");

      // Icons (optional)
      try {
        $playIcon.html(
          '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M4 10h3l5-4v12l-5-4H4z" fill="currentColor"></path>' +
            '<path d="M16 9c1 .8 1.5 1.8 1.5 3s-.5 2.2-1.5 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>' +
            '<path d="M18.5 7c2 1.7 3 3.8 3 6s-1 4.3-3 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>' +
          "</svg>"
        );
        $pauseIcon.html(
          '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M4 10h3l5-4v12l-5-4H4z" fill="currentColor"></path>' +
            '<path d="M16 8l6 6M22 8l-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>' +
          "</svg>"
        );
      } catch (e) {}

      function setPlayStateUI(playing){
        if (playing) $wrap.addClass("is-playing").removeClass("is-paused");
        else $wrap.removeClass("is-playing").addClass("is-paused");
      }

      function updateMuteUI(isMuted){
        if (isMuted){
          $pauseUI.hide();
          $playUI.css("display","flex").show();
          $btn.attr("aria-label","Unmute").attr("title","Unmute");
        } else {
          $playUI.hide();
          $pauseUI.css("display","flex").show();
          $btn.attr("aria-label","Mute").attr("title","Mute");
        }
      }

      video.addEventListener("volumechange", () => {
        console.log(`[NV] ${tag} volumechange → muted:`, video.muted);
        updateMuteUI(video.muted);
      });

      // Button toggles mute/unmute
      $btn.off(`click.nvMute${i}`).on(`click.nvMute${i}`, function(){
        try {
          video.muted = !video.muted;

          if (video.muted) {
            video.setAttribute("muted", "");
            userRequestedUnmute = false;
            console.log(`[NV] ${tag} MUTE (user)`);
          } else {
            video.removeAttribute("muted");
            userRequestedUnmute = true;
            console.log(`[NV] ${tag} UNMUTE (user)`);
          }

          updateMuteUI(video.muted);
          if (video.paused) video.play().catch(()=>{});
        } catch(e){
          console.warn(`[NV] ${tag} mute/unmute error`, e);
        }
      });

      video.addEventListener("play",  () => setPlayStateUI(true));
      video.addEventListener("pause", () => setPlayStateUI(false));
      video.addEventListener("ended", () => setPlayStateUI(false));

      document.addEventListener("visibilitychange", () => {
        if (document.hidden && !video.paused) video.pause();
      });

      const tryPlayWithSound = async () => {
        video.muted = false;
        video.removeAttribute("muted");
        try { await video.play(); console.log(`[NV] ${tag} play with sound`); return true; }
        catch(e){ console.warn(`[NV] ${tag} play with sound blocked`, e); return false; }
      };

      const tryPlayMuted = async () => {
        video.muted = true;
        video.setAttribute("muted", "");
        try { await video.play(); console.log(`[NV] ${tag} autoplay muted`); return true; }
        catch(e){ console.warn(`[NV] ${tag} muted play failed`, e); return false; }
      };

      let firstAutoplayDone = false;
      const io = new IntersectionObserver((entries)=>{
        entries.forEach(async (entry)=>{
          if (entry.isIntersecting) {
            await new Promise(r => setTimeout(r, 50));

            if (!firstAutoplayDone) {
              await tryPlayMuted();
              firstAutoplayDone = true;
              updateMuteUI(video.muted);
              return;
            }

            if (userRequestedUnmute) {
              const ok = await tryPlayWithSound();
              if (!ok) await tryPlayMuted();
            } else {
              await tryPlayMuted();
            }

            updateMuteUI(video.muted);
          } else {
            if (!video.paused) {
              video.pause();
              console.log(`[NV] ${tag} pause (out of view)`);
            }
          }
        });
      }, { threshold: 0.25 });

      io.observe($wrap[0]);

      // Initial UI
      setPlayStateUI(false);
      updateMuteUI(video.muted);
    });
  }

  // ---------------------------
  // Boot
  // ---------------------------
  onReady(() => {
    initDropPopupClose();
    initDropFormEmailGate();

    const hasJQ = typeof window.jQuery !== "undefined";
    if (hasJQ) initHardwareVideos(window.jQuery);
  });
})();

