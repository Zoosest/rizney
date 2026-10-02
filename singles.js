/* =========================================================
   SINGLES
   YOU DON'T KNOW TRACK

   First test:
   #114 — Monkey Judge 🐒⚖
   YouTube ID: SHhsdD5viWs

   This file is intentionally standalone.
   It does not modify main.js.
   It does not modify whack-a-track.js.
   ========================================================= */

(() => {
  "use strict";

  const SINGLE_TRACK_NUMBER = 114;
  const SINGLE_VIDEO_ID = "SHhsdD5viWs";
  const BANNER_ID = "singles-banner";
  const MODAL_ID = "singles-trivia-modal";

  /*
   * Remembers whether we've already scrolled
   * for the current appearance of the Single.
   */
  let singlesWasActive = false;

  const $ = selector =>
    document.querySelector(selector);


  /* =========================================================
     TRIVIA DATA & MODAL
     ========================================================= */

  const TRIVIA_DATA = {
    track: 114,
    title: "Monkey Judge",
    question: "In the courtroom of the jungle, what is the Monkey Judge's strict penalty for unauthorized banana trading?",
    options: [
      { text: "Mandatory community service peeling potatoes.", correct: false },
      { text: "Ten years hard time in the coconut cooler.", correct: false },
      { text: "A stern look, a loud screech, and forfeiture of the peel.", correct: true },
      { text: "Immediate exile to the corporate spreadsheet salt mines.", correct: false }
    ]
  };

  let escapeHandler = null;

  function createTriviaModal() {
    if ($(`#${MODAL_ID}`)) return;

    const modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", `${MODAL_ID}-title`);
    modal.innerHTML = `
      <div class="singles-modal-content" role="document">
        <div id="${MODAL_ID}-title" style="font-size: 1.1rem; letter-spacing: 0.1em; color: #c084fc; font-weight: bold; margin-bottom: 8px;">⚖️ YOU DON'T KNOW TRACK</div>
        <div id="singles-question-container"></div>
        <button class="singles-close-btn" type="button">Close Challenge</button>
      </div>
    `;

    const modalStyle = document.createElement("style");
    modalStyle.textContent = `
      #${MODAL_ID} {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        z-index: 99999;
        justify-content: center;
        align-items: center;
        font-family: Georgia, "Times New Roman", serif;
      }

      .singles-modal-content {
        background: #160c1a;
        border: 2px solid #d4af37;
        border-radius: 12px;
        width: min(90%, 480px);
        padding: 24px;
        box-sizing: border-box;
        box-shadow: 0 8px 24px rgba(0,0,0,0.8);
        color: #f5d76e;
        text-align: center;
      }

      .singles-modal-question {
        font-size: 1rem;
        color: #e0aaff;
        margin: 16px 0 20px;
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
        font-family: Georgia, "Times New Roman", serif;
        font-size: 0.9rem;
        cursor: pointer;
        text-align: left;
        transition: background 0.15s ease, color 0.15s ease, transform 0.06s ease;
      }

      .singles-option-btn:hover,
      .singles-option-btn:focus {
        background: #d4af37;
        color: #000;
        font-weight: bold;
        outline: none;
      }

      .singles-option-btn:active {
        transform: translateY(1px);
      }

      .singles-close-btn {
        margin-top: 12px;
        background: transparent;
        border: none;
        color: #b9a8c5;
        font-size: 0.8rem;
        cursor: pointer;
        text-decoration: underline;
      }
    `;
    document.head.appendChild(modalStyle);
    document.body.appendChild(modal);

    modal.querySelector(".singles-close-btn").addEventListener("click", () => {
      closeTriviaModal();
    });
  }

  function openTriviaModal() {
    const modal = $(`#${MODAL_ID}`);
    const container = $("#singles-question-container");
    if (!modal || !container) return;

    container.innerHTML = `
      <div class="singles-modal-question">${TRIVIA_DATA.question}</div>
    `;

    // Create option buttons
    TRIVIA_DATA.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "singles-option-btn";
      btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt.text}`;
      btn.dataset.correct = opt.correct ? "1" : "0";
      btn.addEventListener("click", () => {
        if (opt.correct) {
          container.innerHTML = `<div style="color: #51cf66; font-weight: bold; font-size: 1.1rem; margin: 20px 0;">🎉 CORRECT! THE JUDGE HAS SPOKEN!</div>`;
        } else {
          container.innerHTML = `<div style="color: #ff6b6b; font-weight: bold; font-size: 1.1rem; margin: 20px 0;">❌ OBJECTION OVERRULED! WRONG!</div>`;
        }
        // Auto-close after a short delay and restore focus to banner
        setTimeout(() => { closeTriviaModal(); }, 1500);
      });
      container.appendChild(btn);
    });

    // Show
    modal.style.display = "flex";

    // Focus management: focus first option
    const firstBtn = modal.querySelector(".singles-option-btn");
    if (firstBtn) firstBtn.focus();

    // Escape key closes modal
    escapeHandler = (ev) => {
      if (ev.key === "Escape") {
        closeTriviaModal();
      }
    };
    document.addEventListener("keydown", escapeHandler);
  }

  function closeTriviaModal() {
    const modal = $(`#${MODAL_ID}`);
    if (!modal) return;
    modal.style.display = "none";

    // Remove escape listener
    if (escapeHandler) {
      document.removeEventListener("keydown", escapeHandler);
      escapeHandler = null;
    }

    // Return focus to the banner if present
    const banner = $(`#${BANNER_ID}`);
    if (banner) banner.focus();
  }


  /* =========================================================
     CREATE BANNER
     ========================================================= */

  function createBanner() {

    const existing = $(`#${BANNER_ID}`);

    if (existing) {
      return existing;
    }

    const banner = document.createElement("section");
    banner.id = BANNER_ID;
    banner.setAttribute("aria-label", "Singles");
    banner.setAttribute("tabindex", "0"); // make focusable so keyboard users can open it
    banner.innerHTML = `
      <div class="singles-banner-main">
        YOU DON'T KNOW TRACK (CLICK TO PLAY)
      </div>

      <div class="singles-banner-label">
        🎤 SINGLES
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      /* --singles-top is set dynamically (JS) so the banner sits below the toolbar if present */
      #${BANNER_ID} {
        display: none;
        width: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 10px 12px;
        text-align: center;
        color: #f5d76e;
        background: #120b18;
        border-top: 1px solid #d4af37;
        border-bottom: 1px solid #d4af37;
        font-family: Georgia, "Times New Roman", serif;
        box-shadow: 0 4px 14px rgba(0,0,0,.45);

        /* Sticky positioning right under your toolbar.
           top uses a CSS variable so JS can adjust it without touching other layouts. */
        position: sticky;
        top: var(--singles-top, 0px);
        z-index: 80;

        /* Interactive look */
        cursor: pointer;
        transition: background 0.15s ease, transform 0.06s ease;
      }

      #${BANNER_ID}:hover {
        background: #241433;
        color: #ffe680;
        transform: translateY(-1px);
      }

      #${BANNER_ID}:active {
        transform: translateY(0);
      }

      #${BANNER_ID} .singles-banner-main {
        font-size: 1rem;
        font-weight: bold;
        letter-spacing: .12em;
        pointer-events: none;
      }

      #${BANNER_ID} .singles-banner-label {
        margin-top: 3px;
        color: #c084fc;
        font-size: .7rem;
        letter-spacing: .16em;
        pointer-events: none;
      }

      @media (max-width: 500px) {
        #${BANNER_ID} {
          padding: 8px 10px;
        }

        #${BANNER_ID} .singles-banner-main {
          font-size: .85rem;
        }
      }
    `;

    document.head.appendChild(style);

    // Click and keyboard activation to open the trivia modal
    banner.addEventListener("click", () => {
      openTriviaModal();
    });
    banner.addEventListener("keydown", (ev) => {
      // Enter or Space opens modal
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        openTriviaModal();
      }
    });

    const controls = $(".controls");

    if (controls) {
      // Insert immediately after the controls container so the banner naturally sits below it
      controls.insertAdjacentElement("afterend", banner);
    } else {
      // If controls aren't present, prefer the body top so sticky still works
      document.body.prepend(banner);
    }

    createTriviaModal();

    // Ensure the banner sits below the controls toolbar by setting a CSS variable
    const updateTop = () => {
      const toolbar = $(".controls");
      if (toolbar) {
        // Prefer the toolbar's computed height. Use getBoundingClientRect to include transforms.
        const rect = toolbar.getBoundingClientRect();
        // If the toolbar is fixed/sticky at the top, its rect.top may be 0; we just need its height.
        document.documentElement.style.setProperty("--singles-top", `${Math.round(rect.height)}px`);
      } else {
        // no toolbar found: reset to 0
        document.documentElement.style.setProperty("--singles-top", `0px`);
      }
    };

    // Run initially and on resize; a ResizeObserver on the toolbar keeps things robust if available.
    updateTop();
    window.addEventListener("resize", updateTop);

    const toolbar = $(".controls");
    if (toolbar && typeof ResizeObserver === "function") {
      try {
        const ro = new ResizeObserver(updateTop);
        ro.observe(toolbar);
      } catch (e) {
        // ignore failures; fallback to resize event
      }
    }

    return banner;
  }


  /* =========================================================
     DETECT MONKEY JUDGE
     ========================================================= */

  function isMonkeyJudgePlaying() {

    const player = window.rizneyPlayer;

    if (player && typeof player.getVideoData === "function") {
      try {
        const data = player.getVideoData();
        if (data && data.video_id) {
          return String(data.video_id) === SINGLE_VIDEO_ID;
        }
      } catch (error) {
        // ignore
      }
    }

    const nowPlaying = $("#now-playing");
    if (!nowPlaying) {
      return false;
    }

    return nowPlaying.textContent.includes(`Song ${SINGLE_TRACK_NUMBER}`);
  }


  /* =========================================================
     UPDATE BANNER
     ========================================================= */

  function updateBanner() {
    const banner = $(`#${BANNER_ID}`);
    if (!banner) return;

    const singlesActive = isMonkeyJudgePlaying();

    if (singlesActive) {
      banner.style.display = "block";

      /*
       * We just arrived at the Single.
       *
       * Scroll the page up to the
       * Singles area exactly once.
       */
      if (!singlesWasActive) {
        singlesWasActive = true;
        window.setTimeout(() => {
          banner.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 100);
      }

    } else {
      /*
       * The Single is no longer active.
       *
       * Reset the flag so the next time
       * Monkey Judge comes around,
       * we scroll again.
       */
      singlesWasActive = false;
      banner.style.display = "none";

      const modal = $(`#${MODAL_ID}`);
      if (modal) modal.style.display = "none";
    }
  }


  /* =========================================================
     WATCH THE PLAYER
     ========================================================= */

  function startWatching() {
    createBanner();
    updateBanner();
    window.setInterval(updateBanner, 500);
  }


  /* =========================================================
     INIT
     ========================================================= */

  function init() {
    startWatching();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

})();
