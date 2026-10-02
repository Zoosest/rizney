/* =========================================================
   SIMPLIFIED "YOU DON'T KNOW TRACK"
   Triggers a dropdown quiz when Monkey Judge plays.
   ========================================================= */

(() => {
  "use strict";

  const TARGET_VIDEO_ID = "SHhsdD5viWs";
  const TARGET_TITLE = "Monkey Judge";
  const CONTAINER_ID = "simple-quiz-container";

  // 1. Define your question
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

  // 2. Create and inject the quiz HTML into the page once on load
  function injectQuizUI() {
    if (document.getElementById(CONTAINER_ID)) return;

    const wrapper = document.createElement("div");
    wrapper.id = CONTAINER_ID;
    wrapper.style.cssText = `
      display: none;
      background: #1a1420;
      border: 2px solid #d4af37;
      color: #f5d76e;
      padding: 20px;
      margin: 15px auto;
      max-width: 600px;
      border-radius: 8px;
      font-family: Georgia, serif;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      text-align: center;
      z-index: 999;
      position: relative;
    `;

    wrapper.innerHTML = `
      <h3 style="color: #c084fc; margin-top: 0;">🎤 YOU DON'T KNOW TRACK: Monkey Judge</h3>
      <p style="font-size: 1.1rem; margin: 15px 0;">${QUIZ.question}</p>
      <div id="quiz-options-list" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;"></div>
      <div id="quiz-feedback" style="font-weight: bold; font-size: 1.1rem; min-height: 24px;"></div>
    `;

    // Try to insert it right below your controls or header, fallback to top of body
    const targetAnchor = document.querySelector(".controls") || document.body.firstElementChild;
    if (targetAnchor) {
      targetAnchor.insertAdjacentElement("afterend", wrapper);
    } else {
      document.body.prepend(wrapper);
    }

    renderOptions();
  }

  // Render the multiple choice buttons
  function renderOptions() {
    const list = document.getElementById("quiz-options-list");
    if (!list) return;

    list.innerHTML = "";
    QUIZ.options.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.textContent = `${String.fromCharCode(65 + index)}. ${opt}`;
      btn.style.cssText = `
        padding: 10px;
        background: #0f0a13;
        border: 1px solid #c084fc;
        color: #f5d76e;
        border-radius: 4px;
        cursor: pointer;
        text-align: left;
        font-family: Georgia, serif;
        font-size: 1rem;
      `;
      
      btn.onmouseover = () => btn.style.background = "#2a1f35";
      btn.onmouseout = () => btn.style.background = "#0f0a13";

      btn.onclick = () => handleAnswer(index);
      list.appendChild(btn);
    });
  }

  // Handle user clicking an option
  function handleAnswer(selectedIndex) {
    const feedback = document.getElementById("quiz-feedback");
    const buttons = document.querySelectorAll("#quiz-options-list button");

    // Disable all buttons after answering
    buttons.forEach(b => b.disabled = true);

    if (selectedIndex === QUIZ.correctIndex) {
      feedback.style.color = "#51cf66";
      feedback.textContent = "🎉 Correct! Great job!";
    } else {
      feedback.style.color = "#ff6b6b";
      feedback.textContent = `❌ Not quite! The correct answer was: ${QUIZ.options[QUIZ.correctIndex]}`;
    }
  }

  // 3. Check if the song is playing
  function checkSongStatus() {
    const quizBox = document.getElementById(CONTAINER_ID);
    if (!quizBox) return;

    // Look at your page's current playing text
    const nowPlaying = document.querySelector("#now-playing");
    const text = nowPlaying ? nowPlaying.textContent : "";

    // Also check window player if available
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
      quizBox.style.display = "block";
    } else {
      quizBox.style.display = "none";
    }
  }

  // Initialize
  function init() {
    injectQuizUI();
    // Check every second
    setInterval(checkSongStatus, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
