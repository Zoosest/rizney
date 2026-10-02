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
  const QUIZ_MODAL_ID = "you-dont-know-track-quiz";
  const POINTS_STORAGE_KEY = "youDontKnowTrackPoints";
  
  // Quiz configuration
  const ENTRY_COST = 25;
  const WIN_REWARD = 100;
  const LOSE_PENALTY = 25;
  const STARTING_POINTS = 100;

  /*
   * Remembers whether we've already scrolled
   * for the current appearance of the Single.
   */
  let singlesWasActive = false;

  const $ = selector =>
    document.querySelector(selector);

  const $$ = selector =>
    document.querySelectorAll(selector);


  /* =========================================================
     QUIZ QUESTIONS DATABASE
     ========================================================= */

  const QUIZ_QUESTIONS = [
    {
      id: 1,
      song: "Monkey Judge 🐒⚖",
      trackNumber: 114,
      videoId: "SHhsdD5viWs",
      question: "Fill in the blank: 'Monkey judge, monkey jury, ____.'",
      options: [
        "Everyone in such a hurry",
        "Monkeys are always so dirty",
        "Everything is getting blurry",
        "Getting so worried"
      ],
      correctAnswer: 0
    }
    // Add more songs here in the future:
    // {
    //   id: 2,
    //   song: "Song Title",
    //   trackNumber: 115,
    //   videoId: "xxxxx",
    //   question: "Question text",
    //   options: ["A", "B", "C", "D"],
    //   correctAnswer: 0
    // }
  ];


  /* =========================================================
     POINTS MANAGEMENT
     ========================================================= */

  function getPlayerPoints() {
    const stored = localStorage.getItem(POINTS_STORAGE_KEY);
    if (stored === null) {
      localStorage.setItem(POINTS_STORAGE_KEY, STARTING_POINTS);
      return STARTING_POINTS;
    }
    return parseInt(stored, 10);
  }

  function setPlayerPoints(points) {
    const newPoints = Math.max(0, points);
    localStorage.setItem(POINTS_STORAGE_KEY, newPoints);
    updatePointsDisplay();
    return newPoints;
  }

  function addPoints(amount) {
    const current = getPlayerPoints();
    return setPlayerPoints(current + amount);
  }

  function subtractPoints(amount) {
    return addPoints(-amount);
  }

  function updatePointsDisplay() {
    const displays = $$(`#${BANNER_ID} .points-display`);
    const points = getPlayerPoints();
    displays.forEach(display => {
      display.textContent = `Points: ${points}`;
    });
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

    const currentPoints = getPlayerPoints();

    banner.innerHTML = `
      <div class="singles-banner-main">
        YOU DON'T KNOW TRACK
      </div>

      <div class="singles-banner-label">
        🎤 SINGLES
      </div>

      <div class="singles-banner-controls">
        <button class="quiz-button" id="open-quiz-button">
          ❓ Test Your Knowledge
        </button>
        <span class="points-display">Points: ${currentPoints}</span>
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
        margin-bottom: 10px;
      }

      #${BANNER_ID} .singles-banner-controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;
        flex-wrap: wrap;
      }

      #${BANNER_ID} .quiz-button {
        padding: 8px 16px;
        background: #c084fc;
        color: #120b18;
        border: none;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 0.9rem;
        transition: all 0.2s ease;
      }

      #${BANNER_ID} .quiz-button:hover {
        background: #d4a5ff;
        transform: scale(1.05);
      }

      #${BANNER_ID} .quiz-button:active {
        transform: scale(0.98);
      }

      #${BANNER_ID} .points-display {
        font-size: 0.9rem;
        color: #f5d76e;
        font-weight: bold;
      }

      @media (max-width: 500px) {
        #${BANNER_ID} {
          padding: 8px 10px;
        }

        #${BANNER_ID} .singles-banner-main {
          font-size: .85rem;
        }

        #${BANNER_ID} .singles-banner-controls {
          gap: 10px;
        }

        #${BANNER_ID} .quiz-button {
          padding: 6px 12px;
          font-size: 0.8rem;
        }

        #${BANNER_ID} .points-display {
          font-size: 0.8rem;
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
     CREATE QUIZ MODAL
     ========================================================= */

  function createQuizModal() {
    const existing = $(`#${QUIZ_MODAL_ID}`);
    if (existing) {
      return existing;
    }

    const modal = document.createElement("div");
    modal.id = QUIZ_MODAL_ID;

    const style = document.createElement("style");
    style.textContent = `
      #${QUIZ_MODAL_ID} {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1000;
        justify-content: center;
        align-items: center;
        overflow-y: auto;
      }

      #${QUIZ_MODAL_ID}.active {
        display: flex;
      }

      .quiz-modal-content {
        background: #1a1420;
        border: 2px solid #d4af37;
        border-radius: 8px;
        padding: 30px;
        max-width: 600px;
        width: 90%;
        margin: 20px;
        color: #f5d76e;
        font-family: Georgia, "Times New Roman", serif;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
      }

      .quiz-header {
        text-align: center;
        margin-bottom: 25px;
        border-bottom: 1px solid #d4af37;
        padding-bottom: 15px;
      }

      .quiz-header h2 {
        margin: 0 0 5px 0;
        font-size: 1.5rem;
        color: #c084fc;
      }

      .quiz-song-title {
        font-size: 1.1rem;
        color: #f5d76e;
        margin-bottom: 10px;
      }

      .quiz-cost {
        font-size: 0.9rem;
        color: #ff6b6b;
        font-weight: bold;
      }

      .quiz-question {
        font-size: 1.1rem;
        margin: 20px 0;
        text-align: center;
        color: #f5d76e;
        line-height: 1.6;
      }

      .quiz-options {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin: 25px 0;
      }

      .quiz-option {
        padding: 12px;
        background: #0f0a13;
        border: 2px solid #c084fc;
        border-radius: 4px;
        color: #f5d76e;
        cursor: pointer;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 1rem;
        transition: all 0.2s ease;
        text-align: left;
      }

      .quiz-option:hover {
        background: #1a1520;
        border-color: #d4a5ff;
      }

      .quiz-option.selected {
        background: #c084fc;
        color: #120b18;
        border-color: #c084fc;
      }

      .quiz-option.correct {
        background: #51cf66;
        color: #fff;
        border-color: #51cf66;
      }

      .quiz-option.incorrect {
        background: #ff6b6b;
        color: #fff;
        border-color: #ff6b6b;
      }

      .quiz-option:disabled {
        cursor: not-allowed;
      }

      .quiz-button-group {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 25px;
        flex-wrap: wrap;
      }

      .quiz-action-button {
        padding: 10px 20px;
        background: #c084fc;
        color: #120b18;
        border: none;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 1rem;
        transition: all 0.2s ease;
      }

      .quiz-action-button:hover {
        background: #d4a5ff;
      }

      .quiz-action-button:disabled {
        background: #888;
        cursor: not-allowed;
      }

      .quiz-action-button.cancel {
        background: #666;
      }

      .quiz-action-button.cancel:hover {
        background: #777;
      }

      .quiz-result {
        margin-top: 20px;
        padding: 15px;
        border-radius: 4px;
        text-align: center;
        font-weight: bold;
        display: none;
      }

      .quiz-result.show {
        display: block;
      }

      .quiz-result.win {
        background: #51cf66;
        color: #fff;
      }

      .quiz-result.lose {
        background: #ff6b6b;
        color: #fff;
      }

      .quiz-result-message {
        font-size: 1.2rem;
        margin-bottom: 10px;
      }

      .quiz-result-points {
        font-size: 1rem;
      }

      .quiz-insufficient-points {
        background: #ff6b6b;
        color: #fff;
        padding: 15px;
        border-radius: 4px;
        text-align: center;
        font-weight: bold;
      }

      @media (max-width: 500px) {
        .quiz-modal-content {
          padding: 20px;
        }

        .quiz-header h2 {
          font-size: 1.2rem;
        }

        .quiz-question {
          font-size: 1rem;
        }

        .quiz-option {
          padding: 10px;
          font-size: 0.95rem;
        }

        .quiz-action-button {
          padding: 8px 16px;
          font-size: 0.9rem;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    return modal;
  }


  /* =========================================================
     QUIZ LOGIC
     ========================================================= */

  function startQuiz() {
    const points = getPlayerPoints();
    const modal = createQuizModal();

    // Check if player has enough points
    if (points < ENTRY_COST) {
      modal.innerHTML = `
        <div class="quiz-modal-content">
          <div class="quiz-header">
            <h2>YOU DON'T KNOW TRACK</h2>
          </div>
          <div class="quiz-insufficient-points">
            <div>Not Enough Points!</div>
            <div style="margin-top: 10px; font-size: 1rem;">
              You need ${ENTRY_COST} points to play.
              <br>
              You currently have ${points} points.
            </div>
          </div>
          <div class="quiz-button-group">
            <button class="quiz-action-button cancel" onclick="document.getElementById('${QUIZ_MODAL_ID}').classList.remove('active')">
              Close
            </button>
          </div>
        </div>
      `;
      modal.classList.add("active");
      return;
    }

    // Get current playing song's quiz question
    const currentQuestion = getCurrentQuestion();

    if (!currentQuestion) {
      modal.innerHTML = `
        <div class="quiz-modal-content">
          <div class="quiz-header">
            <h2>YOU DON'T KNOW TRACK</h2>
          </div>
          <div style="text-align: center; padding: 20px; color: #f5d76e;">
            No quiz available for this song yet.
          </div>
          <div class="quiz-button-group">
            <button class="quiz-action-button cancel" onclick="document.getElementById('${QUIZ_MODAL_ID}').classList.remove('active')">
              Close
            </button>
          </div>
        </div>
      `;
      modal.classList.add("active");
      return;
    }

    let selectedAnswer = null;
    let answered = false;

    const optionsHtml = currentQuestion.options
      .map((option, index) => {
        const letter = String.fromCharCode(65 + index);
        return `
          <button class="quiz-option" data-index="${index}" onclick="event.stopPropagation()">
            <strong>${letter}</strong> — ${option}
          </button>
        `;
      })
      .join("");

    modal.innerHTML = `
      <div class="quiz-modal-content">
        <div class="quiz-header">
          <h2>YOU DON'T KNOW TRACK</h2>
          <div class="quiz-song-title">${currentQuestion.song}</div>
          <div class="quiz-cost">Entry Cost: ${ENTRY_COST} points</div>
          <div style="color: #c084fc; margin-top: 8px;">Your Points: ${points}</div>
        </div>

        <div class="quiz-question">
          ${currentQuestion.question}
        </div>

        <div class="quiz-options">
          ${optionsHtml}
        </div>

        <div class="quiz-result"></div>

        <div class="quiz-button-group">
          <button class="quiz-action-button" id="submit-answer-btn" disabled>
            Submit Answer
          </button>
          <button class="quiz-action-button cancel" id="cancel-quiz-btn">
            Cancel
          </button>
        </div>
      </div>
    `;

    modal.classList.add("active");

    // Event listeners
    const optionButtons = $$(`#${QUIZ_MODAL_ID} .quiz-option`);
    const submitBtn = $(`#${QUIZ_MODAL_ID} #submit-answer-btn`);
    const cancelBtn = $(`#${QUIZ_MODAL_ID} #cancel-quiz-btn`);
    const resultDiv = $(`#${QUIZ_MODAL_ID} .quiz-result`);

    optionButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        if (answered) return;

        optionButtons.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedAnswer = parseInt(btn.dataset.index, 10);
        submitBtn.disabled = false;
      });
    });

    submitBtn.addEventListener("click", () => {
      if (selectedAnswer === null || answered) return;

      answered = true;
      submitBtn.disabled = true;

      // Disable option buttons
      optionButtons.forEach(btn => btn.disabled = true);

      // Check answer
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

      // Show correct/incorrect on options
      optionButtons.forEach((btn, index) => {
        btn.classList.remove("selected");
        if (index === currentQuestion.correctAnswer) {
          btn.classList.add("correct");
        } else if (index === selectedAnswer && !isCorrect) {
          btn.classList.add("incorrect");
        }
      });

      // Calculate points
      let newPoints;
      if (isCorrect) {
        newPoints = addPoints(WIN_REWARD - ENTRY_COST);
        resultDiv.classList.add("show", "win");
        resultDiv.innerHTML = `
          <div class="quiz-result-message">🎉 Correct!</div>
          <div class="quiz-result-points">+${WIN_REWARD - ENTRY_COST} Points</div>
          <div class="quiz-result-points" style="margin-top: 8px; font-size: 0.9rem;">Total: ${newPoints}</div>
        `;
      } else {
        newPoints = subtractPoints(ENTRY_COST);
        resultDiv.classList.add("show", "lose");
        resultDiv.innerHTML = `
          <div class="quiz-result-message">❌ Incorrect</div>
          <div class="quiz-result-points">-${ENTRY_COST} Points</div>
          <div class="quiz-result-points" style="margin-top: 8px; font-size: 0.9rem;">Total: ${newPoints}</div>
        `;
      }

      // Change submit button to "Play Again" or "Close"
      setTimeout(() => {
        submitBtn.textContent = "Play Again";
        submitBtn.disabled = false;
        submitBtn.addEventListener("click", startQuiz);
      }, 1500);
    });

    cancelBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });

    // Close modal on outside click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  }

  function getCurrentQuestion() {
    // Check if Monkey Judge is currently playing
    if (isMonkeyJudgePlaying()) {
      return QUIZ_QUESTIONS.find(q => q.videoId === SINGLE_VIDEO_ID);
    }
    return null;
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
    createQuizModal();

    updateBanner();


    window.setInterval(
      updateBanner,
      500
    );

    // Add click handler to quiz button
    const openQuizBtn = $(`#${BANNER_ID} #open-quiz-button`);
    if (openQuizBtn) {
      openQuizBtn.addEventListener("click", startQuiz);
    }
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