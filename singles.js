/* =========================================================
   SINGLES: YOU DON'T KNOW TRACK
   Brick 3: Adding the Trivia Modal & Question Layer for #114
   ========================================================= */

(() => {
  "use strict";

  const TRACK_NUMBER = 114;
  const VIDEO_ID = "SHhsdD5viWs";
  const BANNER_ID = "singles-game-banner";
  const MODAL_ID = "singles-trivia-modal";

  const $ = (selector) => document.querySelector(selector);

  /* =========================================================
     TRIVIA DATA (MONKEY JUDGE)
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


  /* =========================================================
     CREATE THE BANNER
     ========================================================= */

  function createBanner() {
    let banner = $(`#${BANNER_ID}`);
    if (banner) return banner;

    banner = document.createElement("div");
    banner.id = BANNER_ID;
    banner.innerHTML = `
      <div class="singles-inner">
        <span class="singles-icon">🎤</span>
        <span class="singles-text">PLAY "YOU DON'T KNOW TRACK"</span>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      #${BANNER_ID} {
        display: none;
        width: 100%;
        background: #120b18;
        color: #f5d76e;
        border-bottom: 2px solid #d4af37;
        padding: 10px 16px;
        text-align: center;
        font-family: Georgia, serif;
        box-sizing: border-box;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        position: sticky;
        top: 55px;
        z-index: 1000;
      }

      #${BANNER_ID} .singles-inner {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        cursor: pointer;
      }

      #${BANNER_ID} .singles-text {
        font-weight: bold;
        letter-spacing: 0.12em;
        font-size: 0.95rem;
      }

      #${BANNER_ID} .singles-icon {
        font-size: 1.1rem;
      }

      #${BANNER_ID}:hover {
        background: #1e122b;
      }

      /* TRIVIA MODAL STYLES */
      #${MODAL_ID} {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 2000;
        justify-content: center;
        align-items: center;
        font-family: Georgia, serif;
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

      .singles-modal-title {
        font-size: 1.1rem;
        letter-spacing: 0.1em;
        margin-bottom: 8px;
        color: #c084fc;
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
        font-family: Georgia, serif;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background 0.15s ease, color 0.15s ease;
        text-align: left;
      }

      .singles-option-btn:hover {
        background: #d4af37;
        color: #000;
        font-weight: bold;
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
    document.head.appendChild(style);

    // Create modal container in DOM
    const modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.innerHTML = `
      <div class="singles-modal-content">
        <div class="singles-modal-title">⚖️ YOU DON'T KNOW TRACK</div>
        <div id="singles-question-container"></div>
        <button class="singles-close-btn" type="button">Close Challenge</button>
      </div>
    `;
    document.body.appendChild(modal);

    // Event listeners
    banner.addEventListener("click", openTriviaModal);
    modal.querySelector(".singles-close-btn").addEventListener("click", closeTriviaModal);

    const toolbar = $(".controls") \vert{}\vert{} $("header") || document.body.firstElementChild;
    if (toolbar && toolbar !== document.body) {
      toolbar.insertAdjacentElement("afterend", banner);
    } else {
      document.body.prepend(banner);
    }

    return banner;
  }


  /* =========================================================
     MODAL CONTROLS
     ========================================================= */

  function openTriviaModal() {
    const modal = $(`#${MODAL_ID}`);
    const container = $("#singles-question-container");
    if (!modal || !container) return;

    // Render question and options
    container.innerHTML = `
      <div class="singles-modal-question">${TRIVIA_DATA.question}</div>
    `;

    TRIVIA_DATA.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "singles-option-btn";
      btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt.text}`;
      
      btn.addEventListener("click", () => handleAnswer(opt.correct));
      container.appendChild(btn);
    });

    modal.style.display = "flex";
  }

  function closeTriviaModal() {
    const modal = $(`#${MODAL_ID}`);
    if (modal) modal.style.display = "none";
  }

  function handleAnswer(isCorrect) {
    const container = $("#singles-question-container");
    if (!container) return;

    if (isCorrect) {
      container.innerHTML = `
        <div style="color: #51cf66; font-weight: bold; font-size: 1.1rem; margin: 20px 0;">
          🎉 CORRECT! THE JUDGE HAS SPOKEN!
        </div>
        <p style="color: #e0aaff; font-size: 0.9rem;">You earned arcade bragging rights for this track.</p>
      `;
    } else {
      container.innerHTML = `
        <div style="color: #ff6b6b; font-weight: bold; font-size: 1.1rem; margin: 20px 0;">
          ❌ OBJECTION OVERRULED! WRONG!
        </div>
        <p style="color: #e0aaff; font-size: 0.9rem;">The Monkey Judge bangs his gavel in profound disappointment.</p>
      `;
    }

    window.setTimeout(closeTriviaModal, 2500);
  }


  /* =========================================================
     DETECTION & UPDATE LOOP
     ========================================================= */

  function isSinglePlaying() {
    const player = window.rizneyPlayer;
    if (player && typeof player.getVideoData === "function") {
      try {
        const data = player.getVideoData();
        if (data && data.video_id) {
          return String(data.video_id) === VIDEO_ID;
        }
      } catch (e) {}
    }

    const nowPlaying = $("#now-playing");
    if (!nowPlaying) return false;

    const text = nowPlaying.textContent;
    return text.includes(`Song ${TRACK_NUMBER}`) || text.includes("Monkey Judge");
  }

  function updateBannerState() {
    const banner = createBanner();
    if (!banner) return;

    const active = isSinglePlaying();
    const targetDisplay = active ? "block" : "none";

    if (banner.style.display !== targetDisplay) {
      banner.style.display = targetDisplay;
      // If song stops playing, close modal automatically
      if (!active) closeTriviaModal();
    }
  }


  /* =========================================================
     INIT
     ========================================================= */

  function init() {
    createBanner();
    updateBannerState();
    window.setInterval(updateBannerState, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

})();
