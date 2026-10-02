/* =========================================================
   "YOU DON'T KNOW TRACK" - FIXED BOTTOM POPUP VERSION
   ========================================================= */

(() => {
  "use strict";

  const TARGET_VIDEO_ID = "SHhsdD5viWs";
  const TARGET_TITLE = "Monkey Judge";
  const CONTAINER_ID = "simple-quiz-container";
  
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

  let currentState = "hidden"; // "hidden", "prompt", "listening", "quiz"

  function injectContainer() {
    if (document.getElementById(CONTAINER_ID)) return;

    const wrapper = document.createElement("div");
    wrapper.id = CONTAINER_ID;
    // Pinned to the bottom center of the screen so it floats over everything without scrolling
    wrapper.style.cssText = `
      display: none;
      position: fixed;
      bottom: 25px;
      left: 50%;
      transform: translateX(-50%);
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
    `;

    document.body.appendChild(wrapper);
  }

  // State 1: The initial opt-in banner
  function showPromptState() {
    const wrapper = document.getElementById(CONTAINER_ID);
    if (!wrapper) return;
    currentState = "prompt";
    wrapper.style.display = "block";

    wrapper.innerHTML = `
      <div style="font-size: 1.1rem; font-weight: bold; color: #c084fc; margin-bottom: 12px;">
        🎤 YOU DON'T KNOW TRACK: Monkey Judge
      </div>
      <p style="margin-bottom: 15px;">Want to test your knowledge for bonus points?</p>
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
    `;

    document.getElementById("start-quiz-optin").onclick = () => {
      playVoiceClip();
      showListeningState();
    };
  }

  // Play your custom voice mp3
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

  // Stop the YouTube music player
  function stopSong() {
    if (window.rizneyPlayer && typeof window.rizneyPlayer.pauseVideo === "function") {
      try {
        window.rizneyPlayer.pauseVideo();
      } catch (e) {
        console.log("Could not pause player:", e);
      }
    }
  }

  // Advance to the next track in your playlist
  function skipToNextTrack() {
    if (window.rizneyPlayer && typeof window.rizneyPlayer.nextVideo === "function") {
      try {
        window.rizneyPlayer.nextVideo();
      } catch (e) {
        console.log("Could not skip to next video:", e);
      }
    }
  }

  // State 2: "Pay attention" mode after clicking Yes
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
  }

  // State 3: The actual multiple choice quiz
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
      feedback.textContent = "🎉 Correct! Great job!";
    } else {
      feedback.style.color = "#ff6b6b";
      feedback.textContent = `❌ Not quite! The correct answer was: ${QUIZ.options[QUIZ.correctIndex]}`;
    }

    // Wait 2.5 seconds to read the feedback, then skip to the next track and hide the box
    setTimeout(() => {
      skipToNextTrack();
    }, 2500);
  }

  // Monitor song status and playback time
  function checkSongStatus() {
    const wrapper = document.getElementById(CONTAINER_ID);
    if (!wrapper) return;

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
        wrapper.style.display = "none";
        currentState = "hidden";
      }
    }
  }

  function init() {
    injectContainer();
    setInterval(checkSongStatus, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
