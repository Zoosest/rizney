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

  /*
   * Remembers whether we've already scrolled
   * for the current appearance of the Single.
   */
  let singlesWasActive = false;

  const $ = selector =>
    document.querySelector(selector);


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
        position: relative;
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

          return (
            String(data.video_id) ===
            SINGLE_VIDEO_ID
          );
        }

      } catch (error) {}
    }


    const nowPlaying =
      $("#now-playing");

    if (!nowPlaying) {
      return false;
    }


    return (
      nowPlaying.textContent.includes(
        `Song ${SINGLE_TRACK_NUMBER}`
      )
    );
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

      banner.style.display =
        "block";


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

      banner.style.display =
        "none";
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
