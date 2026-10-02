/* =========================================================
   RIZNEY TRIVIA GAME
   Fill-in-the-blank song lyric quiz
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     TRIVIA DATA STRUCTURE
     ========================================================= */

  const TRIVIA_DATA = {
    // "Monkey Judge 🐒⚖" - Song index 144
    144: {
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
    // More trivia can be added here following the same structure
  };

  /* =========================================================
     GAME STATE
     ========================================================= */

  let gameState = {
    score: 0,
    currentSongIndex: null,
    isQuizActive: false,
    isLocked: false,
    hasAnswered: false
  };

  /* =========================================================
     INITIALIZE SCORE FROM LOCALSTORAGE
     ========================================================= */

  function initializeScore() {
    try {
      const saved = localStorage.getItem("rizneyTriviaScore");
      gameState.score = saved ? parseInt(saved, 10) : 0;
    } catch (error) {
      gameState.score = 0;
    }
    updateScoreDisplay();
  }

  function saveScore() {
    try {
      localStorage.setItem("rizneyTriviaScore", String(gameState.score));
    } catch (error) {
      console.error("Failed to save score:", error);
    }
  }

  /* =========================================================
     UI STYLING
     ========================================================= */

  function addTriviaStyles() {
    if (document.getElementById("trivia-game-styles")) return;

    const style = document.createElement("style");
    style.id = "trivia-game-styles";

    style.textContent = `
      /* Trivia Banner */
      #trivia-banner {
        position: sticky;
        top: 0;
        z-index: 50;
        background: linear-gradient(145deg, #2b1540, #100817);
        border-bottom: 2px solid var(--bright-gold, #f5d76e);
        padding: 12px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        box-sizing: border-box;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
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
        color: var(--bright-gold, #f5d76e);
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .trivia-banner-message {
        color: var(--bright-purple, #e0aaff);
        font-size: 0.95rem;
      }

      .trivia-score {
        color: var(--bright-gold, #f5d76e);
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
        box-shadow: 0 4px 12px rgba(245, 215, 110, 0.4);
      }

      #play-trivia-btn:active:not(:disabled) {
        transform: translateY(0);
      }

      #play-trivia-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      /* Quiz Modal Overlay */
      #trivia-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
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
        border: 2px solid var(--bright-gold, #f5d76e);
        border-radius: 16px;
        padding: 32px;
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
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
        color: var(--bright-gold, #f5d76e);
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
      }

      .trivia-modal-question {
        color: var(--bright-purple, #e0aaff);
        font-size: 1.3rem;
        font-weight: 700;
        line-height: 1.4;
        margin-bottom: 12px;
      }

      .trivia-modal-hint {
        color: rgba(224, 170, 255, 0.7);
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
        padding: 12px 16px;
        background: transparent;
        border: 2px solid rgba(224, 170, 255, 0.3);
        border-radius: 12px;
        color: var(--bright-purple, #e0aaff);
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: left;
        width: 100%;
        font-family: inherit;
        gap: 12px;
      }

      .trivia-option:hover:not(:disabled) {
        border-color: var(--bright-gold, #f5d76e);
        background: rgba(212, 175, 55, 0.1);
        transform: translateX(4px);
      }

      .trivia-option:disabled {
        cursor: not-allowed;
      }

      .trivia-option-letter {
        font-weight: 700;
        color: var(--bright-gold, #f5d76e);
        min-width: 24px;
        flex-shrink: 0;
      }

      .trivia-option.selected {
        border-color: var(--bright-gold, #f5d76e);
        background: rgba(212, 175, 55, 0.2);
      }

      .trivia-option.correct {
        border-color: #4ade80;
        background: rgba(74, 222, 128, 0.15);
      }

      .trivia-option.correct .trivia-option-letter {
        color: #4ade80;
      }

      .trivia-option.incorrect {
        border-color: #ff6b6b;
        background: rgba(255, 107, 107, 0.15);
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
        background: rgba(74, 222, 128, 0.15);
        border: 2px solid #4ade80;
        color: #4ade80;
      }

      .trivia-result-message.incorrect {
        background: rgba(255, 107, 107, 0.15);
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
        border: 2px solid var(--bright-gold, #f5d76e);
        border-radius: 8px;
        color: var(--bright-gold, #f5d76e);
        font-weight: 700;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
      }

      .trivia-close-btn:hover {
        background: var(--bright-gold, #f5d76e);
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
        box-shadow: 0 4px 12px rgba(245, 215, 110, 0.4);
      }

      .trivia-submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .trivia-loading {
        color: var(--bright-purple, #e0aaff);
        text-align: center;
        padding: 24px;
        font-size: 1rem;
      }

      /* Scrollbar styling for modal */
      #trivia-modal::-webkit-scrollbar {
        width: 8px;
      }

      #trivia-modal::-webkit-scrollbar-track {
        background: transparent;
      }

      #trivia-modal::-webkit-scrollbar-thumb {
        background: var(--bright-gold, #f5d76e);
        border-radius: 4px;
      }

      #trivia-modal::-webkit-scrollbar-thumb:hover {
        background: #f5d76e;
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
     CREATE BANNER UI
     ========================================================= */

  function createBanner() {
    if (document.getElementById("trivia-banner")) return;

    const banner = document.createElement("div");
    banner.id = "trivia-banner";
    banner.className = "hidden";

    banner.innerHTML = `
      <div class="trivia-banner-content">
        <div class="trivia-banner-text">
          <div class="trivia-banner-label">🎮 Trivia Challenge</div>
          <div class="trivia-banner-message">Listen closely to the lyrics...</div>
        </div>
      </div>
      <div class="trivia-score">Score: <span id="trivia-score-display">0</span></div>
      <button id="play-trivia-btn">Play Quiz</button>
    `;

    document.body.insertBefore(banner, document.body.firstChild);

    document
      .getElementById("play-trivia-btn")
      .addEventListener("click", startQuiz);
  }

  /* =========================================================
     CREATE MODAL UI
     ========================================================= */

  function createModal() {
    if (document.getElementById("trivia-modal-overlay")) return;

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
        <button class="trivia-close-btn" id="trivia-close-btn">Close</button>
        <button class="trivia-submit-btn" id="trivia-submit-btn" disabled>Submit Answer</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document
      .getElementById("trivia-close-btn")
      .addEventListener("click", closeQuiz);

    document
      .getElementById("trivia-submit-btn")
      .addEventListener("click", submitAnswer);

    document
      .getElementById("trivia-modal-overlay")
      .addEventListener("click", event => {
        if (event.target.id === "trivia-modal-overlay") {
          // Don't close if locked or has answered
          if (!gameState.isLocked && !gameState.hasAnswered) {
            closeQuiz();
          }
        }
      });
  }

  /* =========================================================
     UPDATE SCORE DISPLAY
     ========================================================= */

  function updateScoreDisplay() {
    const scoreDisplay = document.getElementById("trivia-score-display");
    if (scoreDisplay) {
      scoreDisplay.textContent = String(gameState.score);
    }
  }

  /* =========================================================
     LOCK PAGE DURING GAMEPLAY
     ========================================================= */

  function lockPage() {
    gameState.isLocked = true;
    document.body.style.overflow = "hidden";
    document.body.style.pointerEvents = "none";

    // Make modal interactive
    const modal = document.getElementById("trivia-modal-overlay");
    if (modal) {
      modal.style.pointerEvents = "auto";
    }
  }

  function unlockPage() {
    gameState.isLocked = false;
    document.body.style.overflow = "";
    document.body.style.pointerEvents = "";
  }

  /* =========================================================
     START QUIZ
     ========================================================= */

  function startQuiz() {
    const songIndex = gameState.currentSongIndex;
    const trivia = TRIVIA_DATA[songIndex];

    if (!trivia) {
      console.error("No trivia data for song index:", songIndex);
      return;
    }

    gameState.isQuizActive = true;
    gameState.hasAnswered = false;
    gameState.selectedAnswer = null;

    lockPage();

    const overlay = document.getElementById("trivia-modal-overlay");
    overlay.classList.add("active");

    // Populate modal
    document.getElementById("trivia-modal-song-title").textContent =
      trivia.songTitle;
    document.getElementById("trivia-modal-question").textContent =
      trivia.question;
    document.getElementById("trivia-modal-hint").textContent =
      `The next word is: "${trivia.lyric}"`;

    const optionsContainer = document.getElementById("trivia-options");
    optionsContainer.innerHTML = "";

    trivia.options.forEach(option => {
      const button = document.createElement("button");
      button.className = "trivia-option";
      button.dataset.answer = option.letter;

      button.innerHTML = `
        <span class="trivia-option-letter">${option.letter}</span>
        <span>${option.text}</span>
      `;

      button.addEventListener("click", () => selectAnswer(button, option.letter));

      optionsContainer.appendChild(button);
    });

    // Reset result message
    const resultMsg = document.getElementById("trivia-result-message");
    resultMsg.className = "";
    resultMsg.textContent = "";
    resultMsg.classList.remove("show");

    // Disable submit button
    document.getElementById("trivia-submit-btn").disabled = true;
  }

  /* =========================================================
     SELECT ANSWER
     ========================================================= */

  function selectAnswer(buttonElement, answerLetter) {
    if (gameState.hasAnswered) return;

    // Remove previous selection
    document.querySelectorAll(".trivia-option").forEach(btn => {
      btn.classList.remove("selected");
    });

    // Add selection to clicked button
    buttonElement.classList.add("selected");
    gameState.selectedAnswer = answerLetter;

    // Enable submit button
    document.getElementById("trivia-submit-btn").disabled = false;
  }

  /* =========================================================
     SUBMIT ANSWER
     ========================================================= */

  function submitAnswer() {
    if (gameState.hasAnswered || !gameState.selectedAnswer) return;

    gameState.hasAnswered = true;

    const songIndex = gameState.currentSongIndex;
    const trivia = TRIVIA_DATA[songIndex];
    const isCorrect = gameState.selectedAnswer === trivia.correctAnswer;

    // Show all options and highlight correct/incorrect
    document.querySelectorAll(".trivia-option").forEach(btn => {
      btn.disabled = true;
      const answer = btn.dataset.answer;

      if (answer === trivia.correctAnswer) {
        btn.classList.add("correct");
      } else if (btn.classList.contains("selected") && !isCorrect) {
        btn.classList.add("incorrect");
      }
    });

    // Update score
    const pointsEarned = isCorrect ? 10 : -5;
    gameState.score += pointsEarned;
    saveScore();
    updateScoreDisplay();

    // Show result message
    const resultMsg = document.getElementById("trivia-result-message");
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

    // Change submit button to done
    const submitBtn = document.getElementById("trivia-submit-btn");
    submitBtn.textContent = "Done";
    submitBtn.disabled = false;
    submitBtn.onclick = closeQuiz;
  }

  /* =========================================================
     CLOSE QUIZ
     ========================================================= */

  function closeQuiz() {
    gameState.isQuizActive = false;
    gameState.hasAnswered = false;
    gameState.selectedAnswer = null;

    const overlay = document.getElementById("trivia-modal-overlay");
    overlay.classList.remove("active");

    // Restore submit button
    const submitBtn = document.getElementById("trivia-submit-btn");
    submitBtn.textContent = "Submit Answer";
    submitBtn.disabled = true;
    submitBtn.onclick = null;

    unlockPage();
  }

  /* =========================================================
     DETECT SONG PLAYBACK & SHOW BANNER
     ========================================================= */

  function watchForSongPlayback() {
    // This watches for changes in the currently playing song
    const observer = new MutationObserver(() => {
      const playingSong = document.querySelector("#song-list .song.playing");

      if (playingSong) {
        const songIndex = parseInt(playingSong.dataset.songIndex, 10);

        // Check if this song has trivia
        if (TRIVIA_DATA[songIndex] && gameState.currentSongIndex !== songIndex) {
          gameState.currentSongIndex = songIndex;
          showBanner();
        }
      } else {
        // No song playing
        hideBanner();
        gameState.currentSongIndex = null;
      }
    });

    const songList = document.getElementById("song-list");
    if (songList) {
      observer.observe(songList, {
        attributes: true,
        attributeFilter: ["class"],
        subtree: true,
        attributeOldValue: true
      });
    }
  }

  function showBanner() {
    const banner = document.getElementById("trivia-banner");
    if (banner) {
      banner.classList.remove("hidden");
    }
  }

  function hideBanner() {
    const banner = document.getElementById("trivia-banner");
    if (banner) {
      banner.classList.add("hidden");
    }
  }

  /* =========================================================
     INITIALIZATION
     ========================================================= */

  function init() {
    addTriviaStyles();
    createBanner();
    createModal();
    initializeScore();
    watchForSongPlayback();
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
