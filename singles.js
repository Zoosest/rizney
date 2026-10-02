/* =========================================================
   "YOU DON'T KNOW TRACK" - OPT-IN FLOW
   ========================================================= */

(() => {
  "use strict";

  const TARGET_VIDEO_ID = "SHhsdD5viWs";
  const TARGET_TITLE = "Monkey Judge";
  const CONTAINER_ID = "simple-quiz-container";

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

  // 1. Inject the container that will hold either the prompt button OR the quiz
  function injectContainer() {
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

    // Try to insert it below controls or at top of body
    const targetAnchor = document.querySelector(".controls") || document.body.firstElementChild;
    if (targetAnchor) {
      targetAnchor.insertAdjacentElement("afterend", wrapper);
    } else {
      document.body.prepend(wrapper);
    }

    showPromptState();
  }

  // 2. Show the initial "Do you want to play?" prompt
  function showPromptState() {
    const wrapper = document.getElementById(CONTAINER_ID);
    if (!wrapper) return;

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

    document.getElementById("start-quiz-optin").onclick = showQuizState;
  }

  // 3. Switch to the actual multiple choice quiz when "Yes" is clicked
  function showQuizState() {
    const wrapper = document.getElementById(CONTAINER_ID);
    if (!wrapper) return;

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
      <h3 style="color: #c084fc; margin-top: 0;">🎤 YOU DON'T KNOW TRACK</h3>
      <p style="font-size: 1.1rem; margin: 15px 0;">${QUIZ.question}</p>
      <div id="quiz-options-list" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
        ${optionsHtml}
      </div>
      <div id="quiz-feedback" style="font-weight: bold; font-size: 1.1rem; min-height: 24px;"></div>
    `;

    // Hook up option buttons
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

  // 4. Handle right/wrong choice
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
  }

  // 5. Monitor if the song is playing
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
      // Only force show/reset if it was completely hidden before
      if (wrapper.style.display === "none") {
        showPromptState();
        wrapper.style.display = "block";
      }
    } else {
      wrapper.style.display = "none";
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
