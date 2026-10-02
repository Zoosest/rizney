/* =========================================================
   SINGLES: YOU DON'T KNOW TRACK
   Fresh start implementation for Track #114 (Monkey Judge)
   ========================================================= */

(() => {
  "use strict";

  const TRACK_NUMBER = 114;
  const VIDEO_ID = "SHhsdD5viWs";
  const BANNER_ID = "singles-game-banner";

  const $ = (selector) => document.querySelector(selector);

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

    // Clean, self-contained styling for the sticky banner
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
        
        /* Sticky positioning directly under your main toolbar */
        position: sticky;
        top: 55px; /* Adjust this value if your sticky toolbar height differs */
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
    `;
    document.head.appendChild(style);

    // Anchor right below your sticky controls/toolbar
    const toolbar = $(".controls") \vert{}\vert{} $("header") || document.body.firstElementChild;
    if (toolbar && toolbar !== document.body) {
      toolbar.insertAdjacentElement("afterend", banner);
    } else {
      document.body.prepend(banner);
    }

    // Optional click action stub for when you add the minigame interaction later
    banner.addEventListener("click", () => {
      console.log("Singles banner clicked! Ready for minigame questions.");
    });

    return banner;
  }


  /* =========================================================
     DETECT "MONKEY JUDGE" PLAYING
     ========================================================= */

  function isSinglePlaying() {
    // 1. Check the active YouTube player state
    const player = window.rizneyPlayer;
    if (player && typeof player.getVideoData === "function") {
      try {
        const data = player.getVideoData();
        if (data && data.video_id) {
          return String(data.video_id) === VIDEO_ID;
        }
      } catch (e) {}
    }

    // 2. Fallback check on #now-playing text
    const nowPlaying = $("#now-playing");
    if (!nowPlaying) return false;

    const text = nowPlaying.textContent;
    return text.includes(`Song ${TRACK_NUMBER}`) || text.includes("Monkey Judge");
  }


  /* =========================================================
     UPDATE BANNER STATE (NO PAGE JUMPS)
     ========================================================= */

  function updateBannerState() {
    const banner = createBanner();
    if (!banner) return;

    const active = isSinglePlaying();
    const targetDisplay = active ? "block" : "none";

    if (banner.style.display !== targetDisplay) {
      banner.style.display = targetDisplay;
    }
  }


  /* =========================================================
     INITIALIZE
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
