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


  /* =========================================================
     SINGLE #1
     ========================================================= */

  const SINGLE_TRACK_NUMBER = 114;

  const SINGLE_VIDEO_ID =
    "SHhsdD5viWs";

  const BANNER_ID =
    "singles-banner";


  /* =========================================================
     HELPER
     ========================================================= */

  const $ = selector =>
    document.querySelector(selector);


  /* =========================================================
     CREATE THE BANNER
     ========================================================= */

  function createBanner() {

    /*
     * Don't create it twice.
     */

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


    /* =======================================================
       SINGLES BANNER STYLE
       ======================================================= */

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

        border-top:
          1px solid #d4af37;

        border-bottom:
          1px solid #d4af37;

        font-family:
          Georgia,
          "Times New Roman",
          serif;

        box-shadow:
          0 4px 14px
          rgba(0,0,0,.45);

        position: relative;

        z-index: 80;

      }


      #${BANNER_ID}
      .singles-banner-main {

        font-size: 1rem;

        font-weight: bold;

        letter-spacing: .12em;

      }


      #${BANNER_ID}
      .singles-banner-label {

        margin-top: 3px;

        color: #c084fc;

        font-size: .7rem;

        letter-spacing: .16em;

      }


      @media (max-width: 500px) {

        #${BANNER_ID} {

          padding: 8px 10px;

        }


        #${BANNER_ID}
        .singles-banner-main {

          font-size: .85rem;

        }

      }

    `;


    document.head.appendChild(
      style
    );


    /* =======================================================
       PLACE BANNER UNDER THE MUSIC TOOLBAR
       ======================================================= */

    const controls =
      $(".controls");


    if (controls) {

      controls.insertAdjacentElement(
        "afterend",
        banner
      );

    } else {

      /*
       * Fallback in case the toolbar
       * hasn't appeared yet.
       */

      document.body.prepend(
        banner
      );

    }


    return banner;
  }


  /* =========================================================
     CHECK CURRENT SONG
     ========================================================= */

  function isMonkeyJudgePlaying() {

    /*
     * The main player exposes itself as:
     *
     * window.rizneyPlayer
     *
     * We use that instead of touching
     * main.js's private variables.
     */

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
            String(
              data.video_id
            ) ===
            SINGLE_VIDEO_ID
          );

        }

      } catch (error) {

        /*
         * Player may not be ready yet.
         */

      }

    }


    /* =======================================================
       FALLBACK

       If the YouTube player isn't ready,
       look at the Now Playing display.
       ======================================================= */

    const nowPlaying =
      $("#now-playing");


    if (!nowPlaying) {
      return false;
    }


    return (
      nowPlaying.textContent
        .includes(
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


    if (
      isMonkeyJudgePlaying()
    ) {

      banner.style.display =
        "block";

    } else {

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


    /*
     * main.js owns the actual YouTube
     * player events.
     *
     * We don't interfere with them.
     *
     * We simply check periodically which
     * video is currently loaded.
     */

    window.setInterval(
      updateBanner,
      500
    );

  }


  /* =========================================================
     INITIALIZE
     ========================================================= */

  function init() {

    startWatching();

  }


  /* =========================================================
     START SAFELY
     * ========================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );

  } else {

    init();

  }


})();
