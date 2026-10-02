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
  const STORAGE_KEY = "singles_arcade_score";

  const $ = selector => document.querySelector(selector);

  /* =========================================================
     SCORE SYSTEM (LOCAL STORAGE)
     ========================================================= */

  function getScore() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? parseInt(saved, 10) : 0;
  }

  function renderScoreDisplay() {
    let scoreEl = $(`#${BANNER_ID}-score`);
    const banner = $(`#${BANNER_ID}`);
    
    if (!banner) return;

    if (!scoreEl) {
      scoreEl = document.createElement("div");
      scoreEl.id = `${BANNER_ID}-score`;
      banner.appendChild(scoreEl);
    }

    scoreEl.textContent = `SCORE: ${getScore()}`;
  }

  /* =========================================================
     CREATE BANNER
     ========================================================= */

  function createBanner() {
    const existing = $(`#${BANNER_ID}`);
    if (existing) return existing;

    const banner = document.createElement("section");
    banner.id = BANNER_ID;
    banner.setAttribute("aria-label", "Singles Arcade Banner");

    banner.innerHTML = `
      <div class="singles-banner-main">
        YOU DON'T KNOW TRACK
      </div>
      <div class="singles-banner-label">
        🎤 SINGLES MODE ACTIVE
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      #${BANNER_ID} {
        display: none; /* Hidden by default until Monkey Judge plays */
        width: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 8px 12px;
        text-align: center;
        color: #f5d76e;
        background: #120b18;
        border-top: 1px solid #d4af37;
        border-bottom: 1px solid #d4af37;
        font-family: Georgia, "Times New Roman", serif;
        box-shadow: 0 4px 14px rgba(0,0,0,.45);
        
        /* Sticky anchor right under your main toolbar */
        position: sticky;
        top: 50px; /* Adjust if your toolbar height differs slightly */
        z-index: 999;
      }

      #${BANNER_ID} .singles-banner-main {
        font-size: 0.95rem;
        font-weight: bold;
        letter-spacing: .12em;
      }

      #${BANNER_ID} .singles-banner-label {
        margin-top: 2px;
        color: #c084fc;
        font-size: .65rem;
        letter-spacing: .16em;
      }

      #${BANNER_ID}-score {
        margin-top: 4px;
        color: #f5d76e;
        font-size: 0.8rem;
        letter-spacing: .1em;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);

    // Find the sticky toolbar or header to place the banner right below it
    const toolbar = $(".controls") \vert{}\vert{} $("header") || document.body.firstElementChild;

    if (toolbar && toolbar !== document.body) {
      toolbar.insertAdjacentElement("afterend", banner);
    } else {
      document.body.prepend(banner);
    }

    renderScoreDisplay();
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
      } catch (error) {}
    }

    const nowPlaying = $("#now-playing");
    if (!nowPlaying) return false;

    return nowPlaying.textContent.includes(`Song ${SINGLE_TRACK_NUMBER}`);
  }

  /* =========================================================
     UPDATE BANNER VISIBILITY (IN-PLACE, NO SCROLL)
     ========================================================= */

  function updateBanner() {
    const banner = createBanner(); // Ensures it exists in the DOM
    if (!banner) return;

    const singlesActive = isMonkeyJudgePlaying();

    // Toggle display without triggering any scroll behaviors
    const targetDisplay = singlesActive ? "block" : "none";
    if (banner.style.display !== targetDisplay) {
      banner.style.display = targetDisplay;
    }
  }

  /* =========================================================
     INIT
     ========================================================= */

  function init() {
    createBanner();
    updateBanner();
    window.setInterval(updateBanner, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

})();
