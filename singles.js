/* =========================================================
   SINGLES: YOU DON'T KNOW TRACK
   Fixed Positioning & True Button Styling
   ========================================================= */

(() => {
  "use strict";

  const BANNER_ID = "singles-game-banner";
  const MODAL_ID = "singles-trivia-modal";

  const $ = (selector) => document.querySelector(selector);

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

  function initSingles() {
    if ($(`#${BANNER_ID}`)) return;

    // 1. Create Banner Button
    const banner = document.createElement("button");
    banner.id = BANNER_ID;
    banner.type = "button";
    banner.innerHTML = `
      <span class="singles-inner">
        <span class="singles-icon">🎤</span>
        <span class="singles-text">PLAY "YOU DON'T KNOW TRACK"</span>
      </span>
    `;

    // 2. Create Styles
    const style = document.createElement("style");
    style.textContent = `
      #${BANNER_ID} {
        display: block !important;
        width: 100%;
        background: #120b18;
        color: #f5d76e;
        border: none;
        border-top: 1px solid #d4af37;
        border-bottom: 2px solid #d4af37;
        padding: 12px 16px;
        text-align: center;
        font-family: Georgia, serif;
        box-sizing: border-box;
        box-shadow: 0 4px 14px rgba(0,0,0,0.6);
        
        /* Bulletproof sticky/fixed lock right under your toolbar */
        position: sticky;
        top: 0; /* Adjust if your sticky toolbar has a height offset like top: 48px */
        z-index: 9999;
        
        /* Make it explicitly act like an interactive button */
        cursor: pointer;
        transition: background 0.15s ease, transform 0.1s ease;
      }

      #${BANNER_ID}:hover {
        background: #241433;
        color: #ffe680;
      }

      #${BANNER_ID}:active {
        transform: scale(0.99);
      }

      #${BANNER_ID} .singles-inner {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        pointer-events: none; /* Let clicks pass straight to the button element */
      }

      #${BANNER_ID} .singles-text {
        font-weight: bold;
        letter-spacing: 0.14em;
        font-size: 0.95rem;
      }

      #${BANNER_ID} .singles-icon {
        font-size: 1.1rem;
      }

      /* Trivia Modal */
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
    document.head.appendChild(style);

    // 3. Create Modal
    const modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.innerHTML = `
      <div class="singles-modal-content">
        <div style="font-size: 1.1rem; letter-spacing: 0.1em; color: #c084fc;">⚖️ YOU DON'T KNOW TRACK</div>
        <div id="singles-question-container"></div>
        <button class="singles-close-btn" type="button">Close Challenge</button>
      </div>
    `;
    document.body.appendChild(modal);

    // 4. Click Handlers
    banner.addEventListener("click", () => {
      const container = $("#singles-question-container");
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
    });

    modal.querySelector(".singles-close-btn").addEventListener("click", () => {
      modal.style.display = "none";
    });

    // 5. Insert Banner right under toolbar
    const toolbar = $(".controls") \vert{}\vert{} $("header") || document.body.firstElementChild;
    if (toolbar && toolbar !== document.body) {
      toolbar.insertAdjacentElement("afterend", banner);
    } else {
      document.body.prepend(banner);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSingles, { once: true });
  } else {
    initSingles();
  }

})();
