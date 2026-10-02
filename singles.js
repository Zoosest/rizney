
/* =========================================================
   "YOU DON'T KNOW TRACK" - PIRATE DUEL EDITION (WITH BOOTY)
   ========================================================= */ 

(() => {
  "use strict"; 

  const TARGET_VIDEO_ID = "SHhsdD5viWs";
  const TARGET_TITLE = "Monkey Judge";
  const CONTAINER_ID = "simple-quiz-container";
  
  const AUDIO_PATH = "./assets/You-dont-know-track.mp3"; 

  // Player booty stash
  let playerBooty = 0;

  const QUIZ = {
    question: "Complete the pirate's lyric line: 'Monkey judge, monkey jury, ____.'",
    options: [
      "Everyone in such a hurry",
      "Monkeys are always so dirty",
      "Everything is getting blurry",
      "Getting so worried"
    ],
    correctIndex: 0
  }; 

  let currentState = "hidden"; // "hidden", "prompt", "dismissed", "listening", "quiz" 

  function injectContainer() {
    if (document.getElementById(CONTAINER_ID)) return; 

    const wrapper = document.createElement("div");
    wrapper.id = CONTAINER_ID;
    // Styled for smooth slide-up animation using transform and opacity
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

  // Helper to show the container with the slide-up animation
  function showContainer() {
    const wrapper = document.getElementById(CONTAINER_ID);
    if (!wrapper) return;
    wrapper.style.transform = "translateX(-50%) translateY(0)";
    wrapper.style.opacity = "1";
    wrapper.style.pointerEvents = "auto";
  } 

  // Helper to hide the container with a slide-down animation
  function hideContainer() {
    const wrapper = document.getElementById(CONTAINER_ID);
    if (!wrapper) return;
    wrapper.style.transform = "translateX(-50%) translateY(150%)";
    wrapper.style.opacity = "0";
    wrapper.style.pointerEvents = "none";
  } 

  // State 1: The initial opt-in banner with Captain Black Bear
  function showPromptState() {
    const wrapper = document.getElementById(CONTAINER_ID);
    if (!wrapper) return;
    currentState = "prompt"; 

    wrapper.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; margin-bottom: 15px;">
        <img src="./assets/black-bear.png" alt="Captain Black Bear" style="
          width: 90px;
          height: 90px;
          object-fit: cover;
          border-radius: 50%;
          border: 2px solid #d4af37;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          image-rendering: pixelated;
        ">
        <div style="font-size: 1.15rem; font-weight: bold; color: #c084fc; line-height: 1.4;">
          Captain Black Bear called you a scurvy sea dog.<br>
          <span style="color: #f5d76e; font-size: 1.25rem;">Duel?</span>
        </div>
      </div>
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
        ">En Garde!</button>
        <button id="dismiss-quiz-optin" style="
          padding: 10px 18px;
          background: transparent;
          color: #a78bfa;
          border: 1px solid #7c3aed;
          border-radius: 4px;
          cursor: pointer;
          font-family: Georgia, serif;
          font-size: 0.95rem;
        ">Flee in Terror</button>
      </div>
    `; 

    showContainer(); 

    document.getElementById("start-quiz-optin").onclick = () => {
      playVoiceClip();
      showListeningState();
    }; 

    document.getElementById("dismiss-quiz-optin").onclick = () => {
      currentState = "dismissed";
      hideContainer();
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

  // Trigger next track exactly like your toolbar button
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

  // State 2: "Pay attention" mode after clicking Yes
  function showListeningState() {
    const wrapper = document.getElementById(CONTAINER_ID);
    if (!wrapper) return;
    currentState = "listening"; 

    wrapper.innerHTML = `
      <div style="font-size: 1.1rem; font-weight: bold; color: #c084fc; margin-bottom: 12px;">
        🗡️ DRAW YOUR BLADE...
      </div>
      <p style="font-size: 1.05rem; margin: 15px 0; line-height: 1.5;">
        Listen closely to the song!<br>
        <span style="color: #f5d76e; font-style: italic; font-size: 0.95rem;">The lyrical riposte approaches near the end...</span>
      </p>
    `;
    showContainer();
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
      <h3 style="color: #c084fc; margin-top: 0;">⚔️ SWASHBUCKLING STANDOFF</h3>
      <p style="font-size: 1.1rem; margin: 15px 0;">${QUIZ.question}</p>
      <div id="quiz-options-list" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
        ${optionsHtml}
      </div>
      <div id="quiz-feedback" style="font-weight: bold; font-size: 1.05rem; min-height: 36px; line-height: 1.4;"></div>
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
      playerBooty += 50; // Add plunder
      feedback.style.color = "#51cf66";
      feedback.innerHTML = `⚔️ Touche! Flawless comeback!<br><span style="color: #f5d76e; font-size: 1rem;">🪙 Booty Secured: <strong>+50 Gold</strong> (Total: ${playerBooty})</span>`;
    } else {
      playerBooty = 0; // Wiped clean
      feedback.style.color = "#ff6b6b";
      feedback.innerHTML = `💥 Oof! You stumbled: "${QUIZ.options[QUIZ.correctIndex]}"<br><span style="color: #f5d76e; font-size: 0.95rem;">🌊 Argh! They plundered your pockets! Booty: <strong>0 Gold</strong></span>`;
    } 

    // Wait 3 seconds to read feedback, slide box down, then trigger the next track
    setTimeout(() => {
      hideContainer();
      setTimeout(skipToNextTrack, 300); // slight delay to let slide-down finish before track skips
    }, 3000);
  } 

  // Monitor song status and playback time
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
      // If song just started and we haven't shown or dismissed it yet, show prompt
      if (currentState === "hidden") {
        showPromptState();
      } 

      // If user clicked "Yes" and we are in listening mode, check progress
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
      // If song changes away from Monkey Judge, reset everything back to hidden
      if (currentState !== "hidden") {
        hideContainer();
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
