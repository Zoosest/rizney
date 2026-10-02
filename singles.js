/* =========================================================
   SINGLES — You Don't Know Track (standalone)
   Track #114 — Monkey Judge 🐒⚖
   YouTube ID: SHhsdD5viWs

   Requirements satisfied:
   - Sticky arcade-style banner beneath .controls
   - Clickable interactive banner (hover/active/keyboard)
   - Centered modal trivia with correct/incorrect feedback
   - Score & Quarter ledger persisted in localStorage
   - Safe DOM selectors, defensive error handling, polling
   - 100% standalone inside this file
   ========================================================= */

(() => {
  "use strict";

  const SINGLE_TRACK_NUMBER = 114;
  const SINGLE_VIDEO_ID = "SHhsdD5viWs";
  const BANNER_ID = "singles-banner";
  const MODAL_ID = "singles-trivia-modal";
  const STORAGE_KEY = "singles::ledger_v1";

  const POINTS_PER_CORRECT = 100;
  const POINTS_PER_INCORRECT = -10;
  const QUARTERS_PER_CORRECT = 1;

  let singlesWasActive = false;
  let escapeHandler = null;

  const $ = selector => {
    try {
      return document.querySelector(selector);
    } catch (e) {
      return null;
    }
  };

  /* -------------------------
     Trivia content
     ------------------------- */
  const TRIVIA_DATA = {
    track: SINGLE_TRACK_NUMBER,
    title: "Monkey Judge",
    question: "In the courtroom of the jungle, what is the Monkey Judge's strict penalty for unauthorized banana trading?",
    options: [
      { text: "Mandatory community service peeling potatoes.", correct: false },
      { text: "Ten years hard time in the coconut cooler.", correct: false },
      { text: "A stern look, a loud screech, and forfeiture of the peel.", correct: true },
      { text: "Immediate exile to the corporate spreadsheet salt mines.", correct: false }
    ]
  };

  /* -------------------------
     Ledger (localStorage wrapper)
     ------------------------- */

  function loadLedger() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { score: 0, quarters: 0 };
      const parsed = JSON.parse(raw);
      return {
        score: typeof parsed.score === "number" ? parsed.score : 0,
        quarters: typeof parsed.quarters === "number" ? parsed.quarters : 0
      };
    } catch (e) {
      return { score: 0, quarters: 0 };
    }
  }

  function saveLedger(ledger) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        score: Math.max(0, Math.round(ledger.score || 0)),
        quarters: Math.max(0, Math.round(ledger.quarters || 0))
      }));
    } catch (e) {}
  }

  function adjustLedger(deltaScore = 0, deltaQuarters = 0) {
    const ledger = loadLedger();
    ledger.score = Math.max(0, ledger.score + deltaScore);
    ledger.quarters = Math.max(0, ledger.quarters + deltaQuarters);
    saveLedger(ledger);
    updateBannerLedgerDisplay(ledger);
    return ledger;
  }

  /* -------------------------
     Modal creation & management
     ------------------------- */

  function createTriviaModal() {
    if ($(`#${MODAL_ID}`)) return;

    const modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.style.display = "none";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";

    modal.innerHTML = `
      <div class="singles-modal-content" role="document">
        <div class="singles-modal-header">
          <div class="singles-modal-title">⚖️ YOU DON'T KNOW TRACK — ${escapeHtml(TRIVIA_DATA.title)}</div>
        </div>
        <div id="singles-question-container"></div>
        <div class="singles-modal-footer">
          <button class="singles-close-btn" type="button">Close Challenge</button>
        </div>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      #${MODAL_ID} {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.85);
        z-index: 99999;
        display: none;
        font-family: Georgia, "Times New Roman", serif;
      }
      .singles-modal-content {
        width: min(92%, 520px);
        background: #160c1a;
        border: 2px solid #d4af37;
        color: #f5d76e;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 8px 28px rgba(0,0,0,0.8);
        text-align: center;
      }
      .singles-modal-title {
        color: #c084fc;
        font-weight: bold;
        margin-bottom: 12px;
        letter-spacing: 0.06em;
      }
      .singles-modal-question {
        font-size: 1rem;
        color: #e0aaff;
        margin: 12px 0 18px;
        line-height: 1.4;
      }
      .singles-option-btn {
        display: block;
        width: 100%;
        background: #21102e;
        color: #e0aaff;
        border: 1px solid #d4af37;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 10px;
        text-align: left;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 0.95rem;
        cursor: pointer;
        transition: background .12s ease, color .12s ease, transform .06s ease;
      }
      .singles-option-btn:hover, .singles-option-btn:focus {
        background: #d4af37;
        color: #000;
        outline: none;
        font-weight: bold;
      }
      .singles-feedback {
        font-weight: bold;
        font-size: 1.05rem;
        margin: 16px 0;
      }
      .singles-feedback.correct {
        color: #51cf66;
      }
      .singles-feedback.incorrect {
        color: #ff6b6b;
      }
      .singles-close-btn {
        margin-top: 8px;
        background: transparent;
        border: none;
        color: #b9a8c5;
        font-size: 0.9rem;
        cursor: pointer;
        text-decoration: underline;
      }
      @media (max-width: 520px) {
        .singles-modal-content { padding: 16px; }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    modal.querySelector(".singles-close-btn").addEventListener("click", closeTriviaModal);
  }

  function openTriviaModal() {
    const modal = $(`#${MODAL_ID}`);
    const container = $("#singles-question-container");
    if (!modal || !container) return;

    container.innerHTML = `<div class="singles-modal-question">${escapeHtml(TRIVIA_DATA.question)}</div>`;
    TRIVIA_DATA.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "singles-option-btn";
      btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt.text}`;
      btn.dataset.idx = String(idx);
      btn.addEventListener("click", () => handleOptionSelected(opt, btn));
      container.appendChild(btn);
    });

    modal.style.display = "flex";
    const firstBtn = modal.querySelector(".singles-option-btn");
    if (firstBtn) firstBtn.focus();

    escapeHandler = (ev) => {
      if (ev.key === "Escape") closeTriviaModal();
    };
    document.addEventListener("keydown", escapeHandler);
  }

  function handleOptionSelected(option, btn) {
    const modal = $(`#${MODAL_ID}`);
    const container = $("#singles-question-container");
    if (!modal || !container) return;

    modal.querySelectorAll(".singles-option-btn").forEach(b => b.disabled = true);

    if (option.correct) {
      container.innerHTML = `<div class="singles-feedback correct">🎉 CORRECT! THE JUDGE HAS SPOKEN: WELL PLAYED!</div>`;
      adjustLedger(POINTS_PER_CORRECT, QUARTERS_PER_CORRECT);
    } else {
      container.innerHTML = `<div class="singles-feedback incorrect">❌ OBJECTION OVERRULED! WRONG — THE COURT DEMANDS BETTER!</div>`;
      adjustLedger(POINTS_PER_INCORRECT, 0);
    }

    setTimeout(() => {
      closeTriviaModal();
    }, 1400);
  }

  function closeTriviaModal() {
    const modal = $(`#${MODAL_ID}`);
    if (!modal) return;
    modal.style.display = "none";

    if (escapeHandler) {
      document.removeEventListener("keydown", escapeHandler);
      escapeHandler = null;
    }

    const banner = $(`#${BANNER_ID}`);
    if (banner) banner.focus();
  }

  /* -------------------------
     Banner creation & display
     ------------------------- */

  function createBanner() {
    const existing = $(`#${BANNER_ID}`);
    if (existing) return existing;

    const banner = document.createElement("section");
    banner.id = BANNER_ID;
    banner.setAttribute("aria-label", "Singles — You Don't Know Track");
    banner.setAttribute("tabindex", "0");

    banner.innerHTML = `
      <div class="singles-inner">
        <div class="singles-left">
          <div class="singles-title">YOU DON'T KNOW TRACK (CLICK TO PLAY)</div>
          <div class="singles-sub">#${SINGLE_TRACK_NUMBER} — ${escapeHtml(TRIVIA_DATA.title)}</div>
        </div>
        <div class="singles-right">
          <div class="singles-ledger">
            <span class="singles-score" aria-live="polite">Score: 0</span>
            <span class="singles-quarters" aria-live="polite">Quarters: 0</span>
          </div>
        </div>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      #${BANNER_ID} {
        display: none;
        width: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 10px 14px;
        color: #f5d76e;
        background: #120b18;
        border-top: 1px solid #d4af37;
        border-bottom: 1px solid #d4af37;
        font-family: Georgia, "Times New Roman", serif;
        box-shadow: 0 4px 14px rgba(0,0,0,.45);
        position: sticky;
        top: var(--singles-top, 0px);
        z-index: 80;
        cursor: pointer;
        transition: background 0.12s ease, transform 0.06s ease;
      }
      #${BANNER_ID}:hover { background: #241433; color: #ffe680; transform: translateY(-1px); }
      #${BANNER_ID}:active { transform: translateY(0); }

      #${BANNER_ID} .singles-inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }
      #${BANNER_ID} .singles-left { text-align: left; }
      #${BANNER_ID} .singles-title {
        font-weight: bold;
        letter-spacing: .12em;
        font-size: 0.98rem;
      }
      #${BANNER_ID} .singles-sub {
        margin-top: 2px;
        color: #c084fc;
        font-size: 0.76rem;
        letter-spacing: .08em;
      }
      #${BANNER_ID} .singles-right { text-align: right; min-width: 140px; }
      #${BANNER_ID} .singles-ledger {
        display: inline-flex;
        gap: 10px;
        align-items: center;
      }
      #${BANNER_ID} .singles-score,
      #${BANNER_ID} .singles-quarters {
        background: rgba(0,0,0,0.25);
        border: 1px solid rgba(212,175,55,0.18);
        padding: 6px 8px;
        border-radius: 8px;
        font-size: 0.82rem;
        color: #ffeaa7;
      }

      @media (max-width: 520px) {
        #${BANNER_ID} { padding: 8px 10px; }
        #${BANNER_ID} .singles-inner { flex-direction: column; align-items: flex-start; gap: 6px; }
        #${BANNER_ID} .singles-right { width: 100%; text-align: left; }
      }
    `;

    document.head.appendChild(style);

    banner.addEventListener("click", () => openTriviaModal());
    banner.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        openTriviaModal();
      }
    });

    const controls = $(".controls");
    if (controls && controls.parentElement) {
      try {
        controls.insertAdjacentElement("afterend", banner);
      } catch (e) {
        document.body.prepend(banner);
      }
    } else {
      document.body.prepend(banner);
    }

    createTriviaModal();
    updateBannerLedgerDisplay(loadLedger());

    const updateTop = () => {
      const tb = $(".controls");
      if (tb) {
        const rect = tb.getBoundingClientRect();
        document.documentElement.style.setProperty("--singles-top", `${Math.round(rect.height)}px`);
      } else {
        document.documentElement.style.setProperty("--singles-top", `0px`);
      }
    };
    updateTop();
    window.addEventListener("resize", updateTop);

    const toolbar = $(".controls");
    if (toolbar && typeof ResizeObserver === "function") {
      try {
        const ro = new ResizeObserver(updateTop);
        ro.observe(toolbar);
      } catch (e) {}
    }

    return banner;
  }

  function updateBannerLedgerDisplay(ledger) {
    const banner = $(`#${BANNER_ID}`);
    if (!banner) return;
    const scoreSpan = banner.querySelector(".singles-score");
    const qSpan = banner.querySelector(".singles-quarters");
    if (scoreSpan) scoreSpan.textContent = `Score: ${ledger.score}`;
    if (qSpan) qSpan.textContent = `Quarters: ${ledger.quarters}`;
  }

  /* -------------------------
     Player detection (polling)
     ------------------------- */

  function isMonkeyJudgePlaying() {
    try {
      // 1. Check YouTube player API object directly
      const player = window.rizneyPlayer;
      if (player && typeof player.getVideoData === "function") {
        try {
          const data = player.getVideoData();
          if (data && data.video_id) {
            return String(data.video_id) === SINGLE_VIDEO_ID;
          }
        } catch (e) {}
      }

      // 2. Fallback: Check #now-playing text content for title or ID
      const nowPlaying = $("#now-playing");
      if (!nowPlaying) return false;
      const text = nowPlaying.textContent;
      return text.includes("Monkey Judge") || text.includes(SINGLE_VIDEO_ID);
    } catch (e) {
      return false;
    }
  }

  function updateBannerVisibility() {
    const banner = $(`#${BANNER_ID}`);
    if (!banner) return;

    const active = isMonkeyJudgePlaying();

    if (active) {
      banner.style.display = "block";

      if (!singlesWasActive) {
        singlesWasActive = true;
        setTimeout(() => {
          try {
            banner.scrollIntoView({ behavior: "smooth", block: "start" });
          } catch (e) {}
        }, 120);
      }
    } else {
      singlesWasActive = false;
      banner.style.display = "none";
      const modal = $(`#${MODAL_ID}`);
      if (modal) modal.style.display = "none";
    }
  }

  /* -------------------------
     Utility
     ------------------------- */
  function escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str.replace(/[&<>"']/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));
  }

  /* -------------------------
     Start watching / init
     ------------------------- */

  function startWatching() {
    createBanner();
    updateBannerVisibility();
    window.setInterval(updateBannerVisibility, 500);
  }

  function init() {
    startWatching();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

})();
