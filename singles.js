/* Singles — first test: Monkey Judge.
 *
 * Standalone file.
 * Does not modify main.js or whack-a-track.js.
 */

(() => {
  "use strict";

  /* =========================================================
     SINGLE #1
     ========================================================= */

  const SINGLE_TRACK_NUMBER = 114;
  const SINGLE_VIDEO_ID = "SHhsdD5viWs";

  const BANNER_ID = "singles-banner";


  /* =========================================================
     HELPERS
     ========================================================= */

  const $ = selector =>
    document.querySelector(selector);


  /* =========================================================
     CREATE THE BANNER
     ========================================================= */

  function createBanner() {

    if ($(`#${BANNER_ID}`)) {
      return $(`#${BANNER_ID}`);
    }

    const banner =
      document.createElement("section");

    banner.id = BANNER_ID;

    banner.setAttribute(
      "aria-label",
      "Singles"
    );

    banner.innerHTML = `
      <div class="singles-banner-text">
        YOU DON'T KNOW TRACK
      </div>

      <div class="singles-banner-subtitle">
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

        font-family:
          Georgia,
          "Times New Roman",
          serif;

        box-shadow:
          0 4px 14px rgba(0,0,0,.45);

        position: relative;
        z-index: 80;
      }


      #${BANNER_ID}
      .singles-banner-text {

        font-size: 1rem;

        font-weight: bold;

        letter-spacing: .12em;

      }


      #${BANNER_ID}
      .singles-banner-subtitle {

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
        .singles-banner-text {

          font-size: .85rem;

        }

      }

    `;

    document.head.appendChild(style);


    /*
     * Put the banner directly underneath
     * the existing music toolbar.
     */

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

    /*
     * First try the YouTube player.
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
            String(data.video_id) ===
            SINGLE_VIDEO_ID
          );

        }

      } catch (error) {

        /* Player may not be ready yet. */

      }

    }


    /*
     * Fallback: inspect the now-playing
     * display on the page.
     */

    const nowPlaying =
      $("#now-playing");

    if (!nowPlaying) {
      return false;
    }

    return /Song\s+114/i.test(
      nowPlaying.textContent
    );
  }


  /* =========================================================
     SHOW / HIDE
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
     * The existing player code changes the
     * current song internally, so we don't
     * touch it.
     *
     * We simply watch it from the outside.
     */

    setInterval(
      updateBanner,
      500
    );
  }


  /* =========================================================
     START
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
