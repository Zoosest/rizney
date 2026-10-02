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
     TRIVIA MODAL SETUP
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

  function createTriviaModal() {
    if ($(`#${MODAL_ID}`)) return;

    const modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.innerHTML = `
      <div class="singles-modal-content">
        <div style="font-size: 1.1rem; letter-spacing: 0.1em; color: #c084fc; font-weight: bold; margin-bottom: 8px;">⚖️ YOU DON'T KNOW TRACK</div>
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
        transition: background 0.15s ease, color 0.15s ease;
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
    document.head.appendChild(modalStyle);
    document.body.appendChild(modal);

    modal.querySelector(".singles-close-btn").addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  function openTriviaModal() {
    const modal = $(`#${MODAL_ID}`);
    const container = $("#singles-question-container");
    if (!modal || !container) return;

    container.innerHTML = `<div class="singles-modal-question">${TRIVIA_DATA.question}</div>`;

    TRIVIA_DATA.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "singles-option-btn";
      btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt.text}`;
      btn.addEventListener("click", () => {
        if (opt.correct) {
          container.innerHTML = `<div style="color: #51cf66; font-weight: bold; font-size: 1.1rem; margin: 20px 0;">🎉 CORRECT! THE JUDGE HAS SPOKEN!</div>`;
        } else {
          container.innerHTML = `<div style="color: #ff6b6b; font-weight: bold; font-size: 1.1rem; margin: 20px 0;">❌ OBJECTION OVERRULED! WRONG!</div>`;
        }
        setTimeout(() => { modal.style.display = "none"; }, 2000);
      });
      container.appendChild(btn);
    });

    modal.style.display = "flex";
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
        YOU DON'T KNOW TRACK (CLICK TO PLAY)
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
        
        /* Sticky positioning right under your toolbar */
        position: sticky;
        top: 0; /* Adjust if your toolbar has height (e.g., top: 48px;) */
        z-index: 80;
        
        /* Make it interactive like a button */
        cursor: pointer;
        transition: background 0.15s ease;
      }

      #${BANNER_ID}:hover {
        background: #241433;
        color: #ffe680;
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

    // Attach click handler to open the trivia challenge
    banner.addEventListener("click", () => {
      openTriviaModal();
    });


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

    createTriviaModal();

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
