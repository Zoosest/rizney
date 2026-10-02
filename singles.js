/* =========================================================
   "YOU DON'T KNOW TRACK" - BOTTOM HEADER SCOREBOARD & COMPLETION BONUS
   ========================================================= */

(() => {
  "use strict";

  const TARGET_VIDEO_ID = "SHhsdD5viWs";
  const TARGET_TITLE = "Monkey Judge";
  const CONTAINER_ID = "simple-quiz-container";
  const SCORE_STORAGE_KEY = "ydkt_player_score";
  
  const AUDIO_PATH = "./assets/You-dont-know-track.mp3";

  const QUIZ = {
    question: "Fill in the blank: 'Monkey judge, monkey jury, ____.'",
    options: [
      "Everyone in such a hurry",
      "Monkeys are always so dirty",
      "Everything is getting blurry",
      "Getting so worried"
    ],
    correctIndex: 0
  };

  let currentState = "hidden"; // "hidden", "prompt", "dismissed", "listening", "quiz"
  let hasAwardedCompletionBonus = false; // Tracks if +5 was already given for this playback session

  function getScore() {
    let score = localStorage.getItem(SCORE_STORAGE_KEY);
    if (score === null) {
      score = 100;
      localStorage.setItem(SCORE_STORAGE_KEY, score);
    }
    return parseInt(score, 10);
  }

  function updateScore(delta) {
    let currentScore = getScore();
    currentScore += delta;
    localStorage.setItem(SCORE_STORAGE_KEY, currentScore);
    renderScoreboard();
  }

  // Render score badge at the bottom of the header
  function renderScoreboard() {
    let scoreEl = document.getElementById("ydkt-score-display");
    
    if (!scoreEl) {
      scoreEl = document.createElement("div");
      scoreEl.id = "ydkt-score-display";
      scoreEl.style.cssText = `
        font-family: Georgia, serif;
        font-size: 0.95rem;
        color: #f5d76e;
        background: #1a1420;
        border: 1px solid #d4af37;
        padding: 6px 14px;
        border-radius: 6px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        margin: 10px auto;
      `;

      // Places it at the bottom of the header if found, otherwise centers it near the top
      const headerAnchor = document.querySelector("header");
      if (headerAnchor) {
        headerAnchor.appendChild(scoreEl);
      } else {
        scoreEl.style.position = "fixed";
        scoreEl.style.top = "15px";
        scoreEl.style.left = "50%";
        scoreEl.style.transform = "translateX(-50%)";
        scoreEl.style.zIndex = "99999";
        document.body.appendChild(scoreEl);
      }
    }

    scoreEl.innerHTML = `🏆 Score: <strong style="color: #c084fc;">${getScore()}</strong>`;
  }

  function injectContainer() {
    if (document.getElementById(CONTAINER_ID)) return;

    const wrapper = document.createElement("div");
    wrapper.id = CONTAINER_ID;
    wrapper.style.cssText = `
      position: fixed;
      bottom: 25px;
      left: 50%;
      transform: translateX(-50%) translateY(150%);
      opacity: 0;
      pointer-events: none;
      width: 90%;
      max-width: 550px;
      background: #1a1420;
      border: 2px solid #d4af37;
      color: #f5d76e;
      padding: 20px;
      border-radius: 10px;
      font-family: Georgia, serif;
      box-shadow: 0 8px 30px rgba(0,0,0,0.8);
      text-align: center;
      z-index: 99999;
      transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
    `;

    document.body.appendChild(wrapper);
  }

  function showContainer() {
    const wrapper = document.getElementById(CONTAINER_ID);
    if (!wrapper) return;
    wrapper.style.transform = "translateX(-50%) translateY(0)";
    wrapper.style.opacity = "1";
    wrapper.style.pointerEvents = "auto";
  }

  function hideContainer() {
    const wrapper = document.getElementById(CONTAINER_ID);
    if (!wrapper) return;
    wrapper.style.transform = "translateX(-50%) translateY(150%)";
    wrapper.style.opacity = "0";
    wrapper.style.pointerEvents = "none";
  }

  function showPromptState() {
    const wrapper = document.getElementById(CONTAINER_ID);
    if (!wrapper) return;
    currentState = "prompt";
    hasAwardedCompletionBonus = false; // Reset bonus tracker for new playback

    wrapper.innerHTML = `
      <div style="font-size: 1.1rem; font-weight: bold; color: #c084fc; margin-bottom: 12px;">
        🎤 YOU DON'T KNOW TRACK: Monkey Judge
      </div>
      <p style="margin-bottom: 15px;">Want to test your knowledge for bonus points?</p>
      <div style="display: flex; gap: 12px; justify-content: center; align-items: center;">
        <button id="start-quiz-optin" style="
          padding: 10px 24px;
          background: #c084fc;
          color: #120b18;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          font-family: Georgia, serif;
          font-size: 1rem;
        ">Yes!</button>
        <button id="dismiss-quiz-optin" style="
          padding: 10px 18px;
          background: transparent;
          color: #a78bfa;
          border: 1px solid #7c3aed;
          border-radius: 4px;
          cursor: pointer;
          font-family: Georgia, serif;
          font-size: 0.95rem;
        ">No thanks</button>
      </div>
    `;

    showContainer();

    document.getElementById("start-quiz-optin").onclick = () => {
      playVoiceClip();
      showListeningState();
    };

    document.getElementById("dismiss-quiz-optin").onclick = () => {
      currentState = "dismissed";
      // Give +5 completion bonus for listening if they dismiss and finish the song
      awardCompletionBonus();
      hideContainer();
    };
  }

  function playVoiceClip() {
    try {
      const audio = new Audio(AUDIO_PATH);
      audio.volume = 1.0;
      audio.play().catch(err => {
        console.log("Audio play blocked or file path issue:", err);
      });
    } catch (e) {
      console.log("Could not initialize audio:", e);
    }
  }

  function stopSong() {
    if (window.rizneyPlayer && typeof window.rizneyPlayer.pauseVideo === "function") {
      try {
        window.rizneyPlayer.pauseVideo();
      } catch (e) {
        console.log("Could not pause player:", e);
      }
    }
  }

  function skipToNextTrack() {
    const toolbarNextBtn = document.querySelector(".controls button:last-child, .controls [data-action='next'], .controls .next-btn, button[title*='Next'], button[aria-label*='Next']");
    
    if (toolbarNextBtn) {
      toolbarNextBtn.click();
    } else if (window.rizneyPlayer && typeof window.rizneyPlayer.nextVideo === "function") {
      try {
        window.rizneyPlayer.nextVideo();
      } catch (e) {
        console.log("Could not skip to next video:", e);
      }
    }
  }

  function awardCompletionBonus() {
    if (!hasAwardedCompletionBonus) {
      hasAwardedCompletionBonus = true;
      updateScore(5);
    }
  }

  function showListeningState() {
    const wrapper = document.getElementById(CONTAINER_ID);
    if (!wrapper) return;
    currentState = "listening";

    wrapper.innerHTML = `
      <div style="font-size: 1.1rem; font-weight: bold; color: #c084fc; margin-bottom: 12px;">
        🎧 GET READY...
      </div>
      <p style="font-size: 1.05rem; margin: 15px 0; line-height: 1.5;">
        Pay attention to the song!<br>
        <span style="color: #f5d76e; font-style: italic; font-size: 0.95rem;">The question is coming up near the end...</span>
      </p>
    `;
    showContainer();
  }

  function showQuizState() {
    const wrapper = document.getElementById(CONTAINER_ID);
    if (!wrapper) return;
    currentState = "quiz";

    stopSong();

    const optionsHtml = QUIZ.options.map((opt, index) => {
      const letter = String.fromCharCode(65 + index);
      return `
        <button class="quiz-opt-btn" data-index="${index}" style="
          padding: 10px;
          background: #0f0a13;
          border: 1px solid #c084fc;
          color: #f5d76e;
          border-radius: 4px;
          cursor: pointer;
          text-align: left;
          font-family: Georgia, serif;
          font-size: 1rem;
        ">${letter}. ${opt}</button>
      `;
    }).join("");

    wrapper.innerHTML = `
      <h3 style="color: #c084fc; margin-top: 0;">🎤 YOU DON'T KNOW TRACK: Time's Up!</h3>
      <p style="font-size: 1.1rem; margin: 15px 0;">${QUIZ.question}</p>
      <div id="quiz-options-list" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
        ${optionsHtml}
      </div>
      <div id="quiz-feedback" style="font-weight: bold; font-size: 1.1rem; min-height: 24px;"></div>
    `;

    showContainer();

    const buttons = wrapper.querySelectorAll(".quiz-opt-btn");
    buttons.forEach(btn => {
      btn.onmouseover = () => { if (!btn.disabled) btn.style.background = "#2a1f35"; };
      btn.onmouseout = () => { if (!btn.disabled) btn.style.background = "#0f0a13"; };
      
      btn.onclick = () => {
        const selectedIndex = parseInt(btn.dataset.index, 10);
        handleAnswer(selectedIndex, buttons);
      };
    });
  }

  function handleAnswer(selectedIndex, buttons) {
    const feedback = document.getElementById("quiz-feedback");
    buttons.forEach(b => b.disabled = true);

    if (selectedIndex === QUIZ.correctIndex) {
      feedback.style.color = "#51cf66";
      feedback.textContent = "🎉 Correct! +25 Points!";
      updateScore(25);
    } else {
      feedback.style.color = "#ff6b6b";
      feedback.textContent = `❌ Not quite (-25 pts). Correct: ${QUIZ.options[QUIZ.correctIndex]}`;
      updateScore(-25);
    }

    // Award completion bonus (+5) for finishing the song journey
    awardCompletionBonus();

    setTimeout(() => {
      hideContainer();
      setTimeout(skipToNextTrack, 300);
    }, 2500);
  }

  function checkSongStatus() {
    const nowPlaying = document.querySelector("#now-playing");
    const text = nowPlaying ? nowPlaying.textContent : "";

    let videoMatch = false;
    if (window.rizneyPlayer && typeof window.rizneyPlayer.getVideoData === "function") {
      try {
        const data = window.rizneyPlayer.getVideoData();
        if (data && String(data.video_id) === TARGET_VIDEO_ID) {
          videoMatch = true;
        }
      } catch (e) {}
    }

    const isPlayingTarget = videoMatch || text.includes(TARGET_TITLE) || text.includes(TARGET_VIDEO_ID);

    if (isPlayingTarget) {
      if (currentState === "hidden") {
        showPromptState();
      }

      if (currentState === "listening" && window.rizneyPlayer) {
        try {
          if (
            typeof window.rizneyPlayer.getCurrentTime === "function" &&
            typeof window.rizneyPlayer.getDuration === "function"
          ) {
            const currentTime = window.rizneyPlayer.getCurrentTime();
            const duration = window.rizneyPlayer.getDuration();

            if (duration > 0 && (duration - currentTime <= 3)) {
              showQuizState();
            }
          }
        } catch (e) {}
      }

    } else {
      if (currentState !== "hidden") {
        // If they listened all the way through without answering or dismissing before song end
        if (currentState === "dismissed") {
          awardCompletionBonus();
        }
        hideContainer();
        currentState = "hidden";
      }
    }
  }

  function init() {
    renderScoreboard();
    injectContainer();
    setInterval(checkSongStatus, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
