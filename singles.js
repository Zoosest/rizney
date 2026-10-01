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

  const $ = selector =>
    document.querySelector(selector);


  /* =========================================================
     SCORE & QUARTER SYSTEM (LOCAL STORAGE)
     ========================================================= */

  function getScore() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? parseInt(saved, 10) : 0;
  }

  function updateScore(change) {
    const current = getScore();
    const newScore = current + change;
    localStorage.setItem(STORAGE_KEY, newScore);
    renderScoreDisplay();
    return newScore;
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

    const existing =
      $(`#${BANNER_ID}`);

    if (existing) {
      return existing;
    }

    const banner =
      document.createElement("section");

    banner.id =
      BANNER_ID;

    banner.setAttribute(
      "aria-label",
      "Singles"
    );

    banner.innerHTML = `
      <div class="singles-banner-main">
        YOU DON'T KNOW TRACK
      </div>

      <div class="singles-banner-label">
        🎤 SINGLES
      </div>
    `;


    const style =
      document.createElement("style");

    style.textContent = `
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
        
        /* Make the Singles banner sticky right under your toolbar */
        position: sticky;
        top: 48px; /* Adjust this number if your toolbar height is taller/shorter */
        z-index: 80;
      }

      #${BANNER_ID} .singles-banner-main {
        font-size: 1rem;
        font-weight: bold;
        letter-spacing: .12em;
      }

      #${BANNER_ID} .singles-banner-label {
        margin-top: 3px;
        color: #c084fc;
        font-size: .7rem;
        letter-spacing: .16em;
      }

      #${BANNER_ID}-score {
        margin-top: 6px;
        color: #f5d76e;
        font-size: .85rem;
        letter-spacing: .1em;
        font-weight: bold;
      }

      @media (max-width: 500px) {
        #${BANNER_ID} {
          padding: 8px 10px;
          top: 40px;
        }

        #${BANNER_ID} .singles-banner-main {
          font-size: .85rem;
        }
      }
    `;

    document.head.appendChild(style);


    const controls =
      $(".controls");

    if (controls) {

      controls.insertAdjacentElement(
        "afterend",
        banner
      );

    } else {

      document.body.prepend(
        banner
      );
    }

    renderScoreDisplay();

    return banner;
  }


  /* =========================================================
     DETECT MONKEY JUDGE
     ========================================================= */

  function isMonkeyJudgePlaying() {

    const player =
      window.rizneyPlayer;

    if (
      player &&
      typeof player.getVideoData ===
        "function"
    ) {

      try {

        const data =
          player.getVideoData();

        if (
          data &&
          data.video_id
        ) {
          const isMatch = String(data.video_id) === SINGLE_VIDEO_ID;
          console.log("[Singles] YouTube Player Video ID:", data.video_id, "Match:", isMatch);
          return isMatch;
        }

      } catch (error) {}
    }


    const nowPlaying =
      $("#now-playing");

    if (!nowPlaying) {
      return false;
    }

    const textMatch = nowPlaying.textContent.includes(`Song ${SINGLE_TRACK_NUMBER}`);
    console.log("[Singles] #now-playing text:", nowPlaying.textContent, "Match:", textMatch);
    
    return textMatch;
  }


  /* =========================================================
     UPDATE BANNER
     ========================================================= */

  function updateBanner() {

    const banner =
      $(`#${BANNER_ID}`);

    if (!banner) {
      return;
    }

    const singlesActive =
      isMonkeyJudgePlaying();

    if (singlesActive) {
      banner.style.display = "block";
    } else {
      banner.style.display = "none";
    }
  }


  /* =========================================================
     WATCH THE PLAYER
     ========================================================= */

  function startWatching() {

    createBanner();

    updateBanner();

    window.setInterval(
      updateBanner,
      500
    );
  }


  /* =========================================================
     INIT
     ========================================================= */

  function init() {
    startWatching();
  }


  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
