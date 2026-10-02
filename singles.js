/* =========================================================
   SINGLES
   YOU DON'T KNOW TRACK

   Best version:
   - listens for actual song changes
   - detects player/video state without polling
   - triggers only when Monkey Judge is active
   - includes score + quiz modal
   - safe for your current site setup

   Track:
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

  const $ = selector => document.querySelector(selector);

  let singlesWasActive = false;
  let lastKnownSongId = null;
  let lastKnownSongNumber = null;

  /* =========================================================
     TRIVIA DATA & STATE
     ========================================================= */

  const TRIVIA_DATA = {
    114: {
      songTitle: "Monkey Judge 🐒⚖",
      question: "Fill in the blank: Monkey judge, monkey jury, then...",
      lyric: "everyone in such a hurry",
      options: [
        { letter: "A", text: "everything is getting blurry" },
        { letter: "B", text: "everyone in such a hurry" },
        { letter: "C", text: "monkeys always dirty" },
        { letter: "D", text: "everyone so worried" }
      ],
      correctAnswer: "B"
    }
  };

  let triviaState = {
    score: 0,
    isQuizActive: false,
    isLocked: false,
    hasAnswered: false,
    selectedAnswer: null
  };

  function initTriviaScore() {
    try {
      const saved = localStorage.getItem("rizneyTriviaScore");
      triviaState.score = saved ? parseInt(saved, 10) : 0;
    } catch (error) {
      triviaState.score = 0;
    }
    updateTriviaScoreDisplay();
  }

  function saveTriviaScore() {
    try {
      localStorage.setItem("rizneyTriviaScore", String(triviaState.score));
    } catch (error) {
      console.error("Failed to save score:", error);
    }
  }

  function updateTriviaScoreDisplay() {
    const display = $("#trivia-score-display");
    if (display) {
      display.textContent = String(triviaState.score);
    }
  }

  /* =========================================================
     CREATE TRIVIA UI
     ========================================================= */

  function createTriviaBanner() {
    if ($("#trivia-banner")) return;

    const banner = document.createElement("div");
    banner.id = "trivia-banner";

    banner.innerHTML = `
      <div class="trivia-banner-content">
        <div class="trivia-banner-text">
          <div class="trivia-banner-label">🎮 Trivia Challenge</div>
          <div class="trivia-banner-message">Listen closely to the lyrics...</div>
        </div>
      </div>
      <div class="trivia-score">Score: <span id="trivia-score-display">0</span></div>
      <button id="play-trivia-btn" type="button">Play Quiz</button>
    `;

    const singlesSection = $(`#${BANNER_ID}`);
    if (singlesSection && singlesSection.parentNode) {
      singlesSection.parentNode.insertBefore(banner, singlesSection.nextSibling);
    } else {
      document.body.insertBefore(banner, document.body.firstChild);
    }

    $("#play-trivia-btn").addEventListener("click", startTrivia);
  }

  function createTriviaModal() {
    if ($("#trivia-modal-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "trivia-modal-overlay";

    const modal = document.createElement("div");
    modal.id = "trivia-modal";

    modal.innerHTML = `
      <div class="trivia-modal-header">
        <div class="trivia-modal-song-title" id="trivia-modal-song-title"></div>
        <div class="trivia-modal-question" id="trivia-modal-question"></div>
        <div class="trivia-modal-hint" id="trivia-modal-hint"></div>
      </div>

      <div class="trivia-result-message" id="trivia-result-message"></div>

      <div class="trivia-options" id="trivia-options"></div>

      <div class="trivia-modal-actions">
        <button class="trivia-close-btn" id="trivia-close-btn" type="button">Close</button>
        <button class="trivia-submit-btn" id="trivia-submit-btn" type="button" disabled>Submit Answer</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    $("#trivia-close-btn").addEventListener("click", closeTrivia);
    $("#trivia-submit-btn").addEventListener("click", submitTriviaAnswer);

    overlay.addEventListener("click", event => {
      if (event.target.id === "trivia-modal-overlay") {
        if (!triviaState.isLocked && !triviaState.hasAnswered) {
          closeTrivia();
        }
      }
    });
  }

  function addTriviaStyles() {
    if ($("#trivia-styles")) return;

    const style = document.createElement("style");
    style.id = "trivia-styles";

    style.textContent = `
      /* Trivia Banner */
      #trivia-banner {
        position: sticky;
        top: 0;
        z-index: 50;
        background: linear-gradient(145deg, #2b1540, #100817);
        border-bottom: 2px solid #f5d76e;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        box-sizing: border-box;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      }

      #trivia-banner.hidden {
        display: none;
      }

      .trivia-banner-content {
        display: flex;
        align-items: center;
        gap: 16px;
        flex: 1;
        min-width: 0;
      }

      .trivia-banner-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
      }

      .trivia-banner-label {
        color: #f5d76e;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .trivia-banner-message {
        color: #e0aaff;
        font-size: 0.95rem;
      }

      .trivia-score {
        color: #f5d76e;
        font-weight: 700;
        font-size: 1rem;
        white-space: nowrap;
      }

      #play-trivia-btn {
        padding: 8px 16px;
        background: linear-gradient(135deg, #d4af37, #f5d76e);
        border: 0;
        border-radius: 8px;
        color: #000;
        font-weight: 700;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
        flex-shrink: 0;
      }

      #play-trivia-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(245,215,110,0.4);
      }

      #play-trivia-btn:active:not(:disabled) {
        transform: translateY(0);
      }

      #play-trivia-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      /* Modal */
      #trivia-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.85);
        z-index: 1000;
        display: none;
        align-items: center;
        justify-content: center;
      }

      #trivia-modal-overlay.active {
        display: flex;
      }

      #trivia-modal {
        background: linear-gradient(145deg, #21102e, #090509);
        border: 2px solid #f5d76e;
        border-radius: 16px;
        padding: 32px;
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.8);
        animation: slideUp 0.3s ease;
      }

      @keyframes slideUp {
        from {
          transform: translateY(40px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .trivia-modal-header {
        margin-bottom: 24px;
        text-align: center;
      }

      .trivia-modal-song-title {
        color: #f5d76e;
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
      }

      .trivia-modal-question {
        color: #e0aaff;
        font-size: 1.3rem;
        font-weight: 700;
        line-height: 1.4;
        margin-bottom: 12px;
      }

      .trivia-modal-hint {
        color: rgba(224,170,255,0.7);
        font-size: 0.9rem;
        font-style: italic;
      }

      .trivia-options {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 24px;
      }

      .trivia-option {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 12px 16px;
        border: 2px solid rgba(224,170,255,0.3);
        border-radius: 12px;
        background: transparent;
        color: #e0aaff;
        font-size: 0.95rem;
        font-family: inherit;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s ease;
      }

      .trivia-option:hover:not(:disabled) {
        border-color: #f5d76e;
        background: rgba(212,175,55,0.1);
        transform: translateX(4px);
      }

      .trivia-option-letter {
        color: #f5d76e;
        font-weight: 700;
        min-width: 24px;
      }

      .trivia-option.selected {
        border-color: #f5d76e;
        background: rgba(212,175,55,0.2);
      }

      .trivia-option.correct {
        border-color: #4ade80;
        background: rgba(74,222,128,0.15);
      }

      .trivia-option.correct .trivia-option-letter {
        color: #4ade80;
      }

      .trivia-option.incorrect {
        border-color: #ff6b6b;
        background: rgba(255,107,107,0.15);
      }

      .trivia-option.incorrect .trivia-option-letter {
        color: #ff6b6b;
      }

      .trivia-result-message {
        padding: 16px;
        border-radius: 12px;
        text-align: center;
        font-weight: 700;
        margin-bottom: 24px;
        display: none;
        font-size: 1.1rem;
      }

      .trivia-result-message.show {
        display: block;
      }

      .trivia-result-message.correct {
        background: rgba(74,222,128,0.15);
        border: 2px solid #4ade80;
        color: #4ade80;
      }

      .trivia-result-message.incorrect {
        background: rgba(255,107,107,0.15);
        border: 2px solid #ff6b6b;
        color: #ff6b6b;
      }

      .trivia-points-change {
        font-size: 0.9rem;
        opacity: 0.9;
        margin-top: 6px;
      }

      .trivia-modal-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
      }

      .trivia-close-btn {
        padding: 10px 24px;
        background: transparent;
        border: 2px solid #f5d76e;
        border-radius: 8px;
        color: #f5d76e;
        font-weight: 700;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
      }

      .trivia-close-btn:hover {
        background: #f5d76e;
        color: #000;
      }

      .trivia-submit-btn {
        padding: 10px 24px;
        background: linear-gradient(135deg, #d4af37, #f5d76e);
        border: 0;
        border-radius: 8px;
        color: #000;
        font-weight: 700;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
      }

      .trivia-submit-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(245,215,110,0.4);
      }

      .trivia-submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      #trivia-modal::-webkit-scrollbar {
        width: 8px;
      }

      #trivia-modal::-webkit-scrollbar-track {
        background: transparent;
      }

      #trivia-modal::-webkit-scrollbar-thumb {
        background: #f5d76e;
        border-radius: 4px;
      }

      @media (max-width: 600px) {
        #trivia-banner {
          flex-direction: column;
          gap: 12px;
          padding: 10px 12px;
        }

        .trivia-banner-content {
          width: 100%;
        }

        #play-trivia-btn {
          width: 100%;
          padding: 10px 12px;
        }

        #trivia-modal {
          padding: 24px;
          width: 95%;
        }

        .trivia-modal-question {
          font-size: 1.1rem;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =========================================================
     TRIVIA GAME FUNCTIONS
     ========================================================= */

  function lockPage() {
    triviaState.isLocked = true;
    document.body.style.overflow = "hidden";
    document.body.style.pointerEvents = "none";

    const overlay = $("#trivia-modal-overlay");
    if (overlay) overlay.style.pointerEvents = "auto";
  }

  function unlockPage() {
    triviaState.isLocked = false;
    document.body.style.overflow = "";
    document.body.style.pointerEvents = "";
  }

  function startTrivia() {
    const trivia = TRIVIA_DATA[SINGLE_TRACK_NUMBER];
    if (!trivia) return;

    triviaState.isQuizActive = true;
    triviaState.hasAnswered = false;
    triviaState.selectedAnswer = null;

    lockPage();

    const overlay = $("#trivia-modal-overlay");
    if (!overlay) return;

    overlay.classList.add("active");

    $("#trivia-modal-song-title").textContent = trivia.songTitle;
    $("#trivia-modal-question").textContent = trivia.question;
    $("#trivia-modal-hint").textContent = `The next word is: "${trivia.lyric}"`;

    const optionsContainer = $("#trivia-options");
    optionsContainer.innerHTML = "";

    trivia.options.forEach(option => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "trivia-option";
      button.dataset.answer = option.letter;
      button.innerHTML = `
        <span class="trivia-option-letter">${option.letter}</span>
        <span>${option.text}</span>
      `;

      button.addEventListener("click", () => selectTriviaAnswer(button, option.letter));
      optionsContainer.appendChild(button);
    });

    const resultMsg = $("#trivia-result-message");
    resultMsg.className = "";
    resultMsg.textContent = "";
    resultMsg.classList.remove("show");

    $("#trivia-submit-btn").disabled = true;
  }

  function selectTriviaAnswer(buttonElement, answerLetter) {
    if (triviaState.hasAnswered) return;

    document.querySelectorAll(".trivia-option").forEach(btn => {
      btn.classList.remove("selected");
    });

    buttonElement.classList.add("selected");
    triviaState.selectedAnswer = answerLetter;

    $("#trivia-submit-btn").disabled = false;
  }

  function submitTriviaAnswer() {
    if (triviaState.hasAnswered || !triviaState.selectedAnswer) return;

    triviaState.hasAnswered = true;

    const trivia = TRIVIA_DATA[SINGLE_TRACK_NUMBER];
    const isCorrect = triviaState.selectedAnswer === trivia.correctAnswer;

    document.querySelectorAll(".trivia-option").forEach(btn => {
      btn.disabled = true;

      const answer = btn.dataset.answer;

      if (answer === trivia.correctAnswer) {
        btn.classList.add("correct");
      } else if (btn.classList.contains("selected") && !isCorrect) {
        btn.classList.add("incorrect");
      }
    });

    const pointsEarned = isCorrect ? 10 : -5;
    triviaState.score += pointsEarned;
    saveTriviaScore();
    updateTriviaScoreDisplay();

    const resultMsg = $("#trivia-result-message");
    resultMsg.classList.add("show");

    if (isCorrect) {
      resultMsg.classList.add("correct");
      resultMsg.innerHTML = `
        ✅ Correct!<br>
        <span class="trivia-points-change">+10 points</span>
      `;
    } else {
      resultMsg.classList.add("incorrect");
      resultMsg.innerHTML = `
        ❌ Incorrect!<br>
        <span class="trivia-points-change">-5 points</span>
      `;
    }

    const submitBtn = $("#trivia-submit-btn");
    submitBtn.textContent = "Done";
    submitBtn.disabled = false;
    submitBtn.onclick = closeTrivia;
  }

  function closeTrivia() {
    triviaState.isQuizActive = false;
    triviaState.hasAnswered = false;
    triviaState.selectedAnswer = null;

    const overlay = $("#trivia-modal-overlay");
    if (overlay) {
      overlay.classList.remove("active");
    }

    const submitBtn = $("#trivia-submit-btn");
    if (submitBtn) {
      submitBtn.textContent = "Submit Answer";
      submitBtn.disabled = true;
      submitBtn.onclick = null;
    }

    unlockPage();
  }

  function showTriviaBanner() {
    const banner = $("#trivia-banner");
    if (banner) banner.classList.remove("hidden");
  }

  function hideTriviaBanner() {
    const banner = $("#trivia-banner");
    if (banner) banner.classList.add("hidden");
  }

  /* =========================================================
     CREATE SINGLES BANNER
     ========================================================= */

  function createBanner() {
    const existing = $(`#${BANNER_ID}`);

    if (existing) {
      return existing;
    }

    const banner = document.createElement("section");

    banner.id = BANNER_ID;

    banner.setAttribute("aria-label", "Singles");

    banner.innerHTML = `
      <div class="singles-banner-main">
        YOU DON'T KNOW TRACK
      </div>

      <div class="singles-banner-label">
        🎤 SINGLES
      </div>
    `;

    const style = document.createElement("style");

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

    const controls = $(".controls");

    if (controls) {
      controls.insertAdjacentElement("afterend", banner);
    } else {
      document.body.prepend(banner);
    }

    return banner;
  }

  /* =========================================================
     PLAYER / SONG DETECTION
     ========================================================= */

  function getCurrentVideoId() {
    const player = window.rizneyPlayer;

    if (player && typeof player.getVideoData === "function") {
      try {
        const data = player.getVideoData();
        if (data && data.video_id) {
          return String(data.video_id);
        }
      } catch (error) {}
    }

    const nowPlaying = $("#now-playing");
    if (!nowPlaying) return null;

    const text = (nowPlaying.textContent || "").trim();
    const match = text.match(/Song\s+(\d+)/i);
    if (match) {
      return null;
    }

    const ytMatch = text.match(/[A-Za-z0-9_-]{11}/);
    if (ytMatch) {
      return ytMatch[0];
    }

    return null;
  }

  function getCurrentSongNumber() {
    const nowPlaying = $("#now-playing");
    if (!nowPlaying) return null;

    const text = (nowPlaying.textContent || "").trim();
    const match = text.match(/Song\s+(\d+)/i);
    if (match) return Number(match[1]);

    return null;
  }

  function isMonkeyJudgePlaying() {
    const currentId = getCurrentVideoId();

    if (currentId) {
      return currentId === SINGLE_VIDEO_ID;
    }

    const currentNumber = getCurrentSongNumber();
    if (currentNumber !== null) {
      return currentNumber === SINGLE_TRACK_NUMBER;
    }

    return false;
  }

  function onSongChange() {
    const active = isMonkeyJudgePlaying();
    const currentId = getCurrentVideoId();
    const currentNumber = getCurrentSongNumber();

    if (active) {
      if (currentId && lastKnownSongId !== currentId) {
        lastKnownSongId = currentId;
        showTriviaBanner();

        const banner = $(`#${BANNER_ID}`);
        if (banner) {
          setTimeout(() => {
            if (document.body.contains(banner)) {
              banner.scrollIntoView({
                behavior: "smooth",
                block: "start"
              });
            }
          }, 120);
        }
      }

      if (currentNumber !== null && lastKnownSongNumber !== currentNumber) {
        lastKnownSongNumber = currentNumber;
      }

      const banner = $(`#${BANNER_ID}`);
      if (banner) {
        banner.style.display = "block";
      }

      return;
    }

    if (lastKnownSongId !== null) {
      lastKnownSongId = null;
    }

    if (lastKnownSongNumber !== null) {
      lastKnownSongNumber = null;
    }

    const banner = $(`#${BANNER_ID}`);
    if (banner) {
      banner.style.display = "none";
    }

    hideTriviaBanner();
  }

  /* =========================================================
     OBSERVE CHANGES
     ========================================================= */

  function startWatching() {
    createBanner();
    addTriviaStyles();
    createTriviaBanner();
    createTriviaModal();
    initTriviaScore();

    const observeTarget = document.body;

    const observer = new MutationObserver(() => {
      onSongChange();
    });

    observer.observe(observeTarget, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "src", "title", "textContent"]
    });

    // First check immediately
    onSongChange();
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
