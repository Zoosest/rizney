/* YOU DON'T KNOW TRACK — PIRATE DUEL EDITION (WITH BOOTY) */
(() => {
  "use strict";

  const TARGET_VIDEO_ID = "SHhsdD5viWs";
  const TARGET_TITLE = "Monkey Judge";

  const CONTAINER_ID = "simple-quiz-container";
  const AUDIO_PATH = "./assets/You-dont-know-track.mp3";

  let state = "hidden";
  let playerBooty = 0;
  let listeningTimer = null;
  let quizShown = false;
  let pottyTimeChosen = false;

  const question = {
    text: "Complete the pirate's lyric line: 'Monkey judge, monkey jury, ____.'",

    options: [
      "Everyone in such a hurry",
      "Monkeys are always so dirty",
      "Everything is getting blurry",
      "Getting so worried"
    ],

    correctIndex: 0
  };

  function getPlayer() {
    return window.player || null;
  }

  function getContainer() {
    return document.getElementById(CONTAINER_ID);
  }

  function showContainer(html) {
    const container = getContainer();

    if (!container) return;

    container.innerHTML = html;
    container.style.display = "flex";
  }

  function hideContainer() {
    const container = getContainer();

    if (!container) return;

    container.style.display = "none";
    container.innerHTML = "";
  }

  function isMonkeyJudgePlaying() {
    const player = getPlayer();

    if (!player || typeof player.getVideoData !== "function") {
      return false;
    }

    try {
      const data = player.getVideoData();

      return data && data.video_id === TARGET_VIDEO_ID;
    } catch (error) {
      return false;
    }
  }

  function resetGame() {
    clearInterval(listeningTimer);
    listeningTimer = null;

    state = "hidden";
    quizShown = false;
    pottyTimeChosen = false;

    hideContainer();
  }

  function showPiratePrompt() {
    state = "prompt";

    showContainer(`
      <div class="pirate-box">

        <img
          src="./assets/black-bear.png"
          alt="Black Bear"
          class="pirate-bear"
        >

        <div class="pirate-buttons">

          <button id="pirate-en-garde">
            ⚔️ EN GARDE
          </button>

          <button id="pirate-flee">
            🏃 FLEE IN TERROR
          </button>

        </div>
      </div>
    `);

    const enGarde = document.getElementById("pirate-en-garde");
    const flee = document.getElementById("pirate-flee");

    if (enGarde) {
      enGarde.addEventListener("click", beginListening);
    }

    if (flee) {
      flee.addEventListener("click", () => {
        hideContainer();
        state = "dismissed";
      });
    }
  }

  function beginListening() {
    state = "listening";

    showContainer(`
      <div class="pirate-box">

        <div class="pirate-message">
          <strong>PAY ATTENTION...</strong><br>
          <strong>YOU'RE BEING TESTED.</strong>
        </div>

      </div>
    `);

    const player = getPlayer();

    if (player && typeof player.playVideo === "function") {
      try {
        player.playVideo();
      } catch (error) {}
    }

    clearInterval(listeningTimer);

    listeningTimer = setInterval(() => {
      checkForQuizTime();
    }, 250);
  }

  function checkForQuizTime() {
    if (state !== "listening") return;
    if (quizShown) return;

    const player = getPlayer();

    if (!player) return;

    try {
      const duration = player.getDuration();
      const current = player.getCurrentTime();

      if (!duration || !current) return;

      const remaining = duration - current;

      if (remaining <= 3) {
        showQuiz();
      }
    } catch (error) {}
  }

  function showQuiz() {
    if (quizShown) return;

    quizShown = true;
    state = "quiz";

    clearInterval(listeningTimer);
    listeningTimer = null;

    const player = getPlayer();

    if (player && typeof player.pauseVideo === "function") {
      try {
        player.pauseVideo();
      } catch (error) {}
    }

    showContainer(`
      <div class="pirate-box">

        <div class="pirate-question">
          ${question.text}
        </div>

        <div class="pirate-options">

          ${question.options
            .map(
              (option, index) => `
                <button
                  class="pirate-answer"
                  data-index="${index}"
                >
                  ${option}
                </button>
              `
            )
            .join("")}

        </div>

      </div>
    `);

    document.querySelectorAll(".pirate-answer").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);

        handleAnswer(index);
      });
    });
  }

  function handleAnswer(index) {
    if (index === question.correctIndex) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }
  }

  function handleCorrectAnswer() {
    playerBooty += 50;

    /*
      UNLOCK POTTY TIME
    */
    localStorage.setItem(
      "pottyTimeUnlocked",
      "true"
    );

    window.dispatchEvent(
      new CustomEvent("pottyTimeUnlocked")
    );

    showContainer(`
      <div class="pirate-box">

        <div class="pirate-result pirate-correct">

          🎉 <strong>YOU'VE UNLOCKED<br>
          "POTTY TIME" IN THE PLAYLIST!</strong>

          <br><br>

          🪙 Booty Secured:
          <strong>+50 Gold</strong>

          <br>

          Total Booty:
          <strong>${playerBooty} Gold</strong>

          <br><br>

          <button id="play-potty-time">
            🚽 PLAY POTTY TIME
          </button>

        </div>

      </div>
    `);

    const playButton = document.getElementById("play-potty-time");

    if (playButton) {
      playButton.addEventListener("click", playPottyTime);
    }

    setTimeout(() => {
      if (pottyTimeChosen) return;

      hideContainer();

      setTimeout(() => {
        skipToNextTrack();
      }, 300);

    }, 5000);
  }

  function handleWrongAnswer() {
    playerBooty = 0;

    showContainer(`
      <div class="pirate-box">

        <div class="pirate-result pirate-wrong">

          ☠️ <strong>WRONG!</strong>

          <br><br>

          🪙 Booty Lost!

          <br><br>

          <button id="pirate-continue">
            CONTINUE
          </button>

        </div>

      </div>
    `);

    const continueButton =
      document.getElementById("pirate-continue");

    if (continueButton) {
      continueButton.addEventListener("click", () => {
        hideContainer();

        setTimeout(() => {
          skipToNextTrack();
        }, 300);
      });
    }
  }

  function playPottyTime() {
    const rows = document.querySelectorAll("#song-list .song");

    let pottyRow = null;

    rows.forEach((row) => {
      if (pottyRow) return;

      const title = row.querySelector(".song-title");

      if (!title) return;

      if (
        title.textContent
          .trim()
          .toUpperCase()
          .includes("POTTY TIME")
      ) {
        pottyRow = row;
      }
    });

    if (!pottyRow) return;

    pottyTimeChosen = true;

    pottyRow.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    setTimeout(() => {
      const title = pottyRow.querySelector(".song-title");
      const playButton = pottyRow.querySelector(".play");

      if (title) {
        title.click();
      } else if (playButton) {
        playButton.click();
      }

      hideContainer();
    }, 350);
  }

  function skipToNextTrack() {
    const nextButton = document.getElementById("next-song");

    if (nextButton) {
      nextButton.click();
    }
  }

  function watchForMonkeyJudge() {
    const player = getPlayer();

    if (!player) return;

    let lastVideoId = null;

    setInterval(() => {
      if (!player || typeof player.getVideoData !== "function") {
        return;
      }

      try {
        const data = player.getVideoData();

        if (!data) return;

        const videoId = data.video_id;

        if (videoId !== lastVideoId) {
          lastVideoId = videoId;

          if (videoId === TARGET_VIDEO_ID) {
            resetGame();

            setTimeout(() => {
              if (isMonkeyJudgePlaying()) {
                showPiratePrompt();
              }
            }, 500);

          } else {
            resetGame();
          }
        }

      } catch (error) {}
    }, 500);
  }

  function waitForPlayer() {
    if (getPlayer()) {
      watchForMonkeyJudge();
      return;
    }

    setTimeout(waitForPlayer, 500);
  }

  /*
    Inject the game's basic styling.
    Only add it once.
  */
  function addStyles() {
    if (document.getElementById("pirate-duel-styles")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "pirate-duel-styles";

    style.textContent = `
      #${CONTAINER_ID} {
        position: fixed;
        inset: 0;
        z-index: 999999;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
        background: rgba(0, 0, 0, 0.88);
      }

      .pirate-box {
        width: min(92vw, 500px);
        max-height: 90vh;
        overflow-y: auto;
        box-sizing: border-box;
        padding: 28px;
        text-align: center;
        border: 2px solid #d4af37;
        border-radius: 18px;
        background: #120b18;
        color: #f5d76e;
        box-shadow:
          0 0 30px rgba(212, 175, 55, 0.35);
      }

      .pirate-bear {
        display: block;
        width: min(260px, 70vw);
        height: auto;
        margin: 0 auto 24px;
      }

      .pirate-message {
        font-size: 25px;
        line-height: 1.45;
        margin: 10px 0 25px;
        letter-spacing: 1px;
      }

      .pirate-question {
        font-size: 22px;
        line-height: 1.4;
        margin-bottom: 25px;
      }

      .pirate-buttons,
      .pirate-options {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .pirate-box button {
        width: 100%;
        padding: 14px 18px;
        border: 2px solid #d4af37;
        border-radius: 12px;
        background: #1d1028;
        color: #f5d76e;
        font-size: 17px;
        font-weight: bold;
        cursor: pointer;
      }

      .pirate-box button:hover {
        background: #2b163a;
      }

      .pirate-result {
        font-size: 20px;
        line-height: 1.5;
      }

      .pirate-correct {
        color: #f5d76e;
      }

      .pirate-wrong {
        color: #e0aaff;
      }

      #play-potty-time {
        margin-top: 8px;
      }
    `;

    document.head.appendChild(style);
  }

  function init() {
    addStyles();

    if (!document.getElementById(CONTAINER_ID)) {
      const container = document.createElement("div");

      container.id = CONTAINER_ID;

      document.body.appendChild(container);
    }

    waitForPlayer();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
