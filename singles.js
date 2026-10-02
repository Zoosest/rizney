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

  /*
    Keeps track of whether the player chose
    to play POTTY TIME from the victory screen.
  */
  let pottyTimeChosen = false;

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

  // =========================================================
  // POTTY TIME PLAY BUTTON
  // =========================================================

  function playPottyTime() {
    pottyTimeChosen = true;

    const rows = Array.from(
      document.querySelectorAll("#song-list .song")
    );

    const pottyRow = rows.find(row => {
      const title = row.querySelector(".song-title");

      return (
        title &&
        title.textContent.includes("POTTY TIME")
      );
    });

    if (!pottyRow) {
      console.log("Could not find POTTY TIME in the playlist.");
      return;
    }

    /*
      Scroll POTTY TIME into view first.
    */
    pottyRow.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    /*
      Give the scroll a moment to begin,
      then use the existing row-play system.
    */
    setTimeout(() => {
      const title =
        pottyRow.querySelector(".song-title");

      if (title) {
        title.click();
        return;
      }

      const playButton =
        pottyRow.querySelector(".play");

      if (playButton) {
        playButton.click();
      }
    }, 350);

    hideContainer();
  }

  // =========================================================
  // STATE 1 — INITIAL PROMPT
  // =========================================================

  function showPromptState() {
    const wrapper = document.getElementById(CONTAINER_ID);
    if (!wrapper) return;

    currentState = "prompt"; 

    wrapper.innerHTML = `
      <div style="width: 100%; max-height: 260px; overflow: hidden; border-radius: 6px; border: 1px solid #d4af37; margin-bottom: 15px; background: #0c0810; display: flex; justify-content: center; align-items: center;">
        <img src="./assets/black-bear.png" alt="Captain Black Bear" style="
          width: 100%;
          height: auto;
          max-height: 260px;
          object-fit: contain;
          display: block;
          image-rendering: pixelated;
        ">
      </div>

      <div style="font-size: 1.15rem; font-weight: bold; color: #f5d76e; margin-bottom: 15px; line-height: 1.4;">
        Captain Black Bear called you a scurvy sea dog.<br>
        <span style="color: #c084fc; font-size: 1.25rem;">Duel?</span>
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

  // =========================================================
  // VOICE CLIP
  // =========================================================

  function playVoiceClip() {
    try {
      const audio = new Audio(AUDIO_PATH);
      audio.volume = 1.0;

      audio.play().catch(err => {
        console.log(
          "Audio play blocked or file path issue:",
          err
        );
      });
    } catch (e) {
      console.log(
        "Could not initialize audio:",
        e
      );
    }
  } 

  // =========================================================
  // STOP YOUTUBE
  // =========================================================

  function stopSong() {
    if (
      window.rizneyPlayer &&
      typeof window.rizneyPlayer.pauseVideo === "function"
    ) {
      try {
        window.rizneyPlayer.pauseVideo();
      } catch (e) {
        console.log(
          "Could not pause player:",
          e
        );
      }
    }
  } 

  // =========================================================
  // NEXT TRACK
  // =========================================================

  function skipToNextTrack() {
    const toolbarNextBtn =
      document.querySelector(
        ".controls button:last-child, .controls [data-action='next'], .controls .next-btn, button[title*='Next'], button[aria-label*='Next']"
      );
    
    if (toolbarNextBtn) {
      toolbarNextBtn.click();

    } else if (
      window.rizneyPlayer &&
      typeof window.rizneyPlayer.nextVideo === "function"
    ) {
      try {
        window.rizneyPlayer.nextVideo();
      } catch (e) {
        console.log(
          "Could not skip to next video:",
          e
        );
      }
    }
  } 

  // =========================================================
  // STATE 2 — LISTENING
  // =========================================================

  function showListeningState() {
    const wrapper =
      document.getElementById(
        CONTAINER_ID
      );

    if (!wrapper) return;

    currentState = "listening"; 

    wrapper.innerHTML = `
      <div style="font-size: 1.1rem; font-weight: bold; color: #c084fc; margin-bottom: 12px;">
        PAY ATTENTION...<br>
        YOU'RE BEING TESTED.
      </div>

      <p style="font-size: 1.05rem; margin: 15px 0; line-height: 1.5;">
        Listen closely to the song!<br>
        <span style="color: #f5d76e; font-style: italic; font-size: 0.95rem;">
          The lyrical riposte approaches near the end...
        </span>
      </p>
    `;

    showContainer();
  } 

  // =========================================================
  // STATE 3 — QUIZ
  // =========================================================

  function showQuizState() {
    const wrapper =
      document.getElementById(
        CONTAINER_ID
      );

    if (!wrapper) return;

    currentState = "quiz"; 

    stopSong(); 

    const optionsHtml =
      QUIZ.options
        .map((opt, index) => {
          const letter =
            String.fromCharCode(
              65 + index
            );

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
        })
        .join(""); 

    wrapper.innerHTML = `
      <h3 style="color: #c084fc; margin-top: 0;">
        ⚔️ SWASHBUCKLING STANDOFF
      </h3>

      <p style="font-size: 1.1rem; margin: 15px 0;">
        ${QUIZ.question}
      </p>

      <div id="quiz-options-list" style="
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 15px;
      ">
        ${optionsHtml}
      </div>

      <div id="quiz-feedback" style="
        font-weight: bold;
        font-size: 1.05rem;
        min-height: 36px;
        line-height: 1.4;
      "></div>
    `; 

    showContainer(); 

    const buttons =
      wrapper.querySelectorAll(
        ".quiz-opt-btn"
      );

    buttons.forEach(btn => {
      btn.onmouseover = () => {
        if (!btn.disabled) {
          btn.style.background =
            "#2a1f35";
        }
      };

      btn.onmouseout = () => {
        if (!btn.disabled) {
          btn.style.background =
            "#0f0a13";
        }
      };
      
      btn.onclick = () => {
        const selectedIndex =
          parseInt(
            btn.dataset.index,
            10
          );

        handleAnswer(
          selectedIndex,
          buttons
        );
      };
    });
  } 

  // =========================================================
  // HANDLE ANSWER
  // =========================================================

  function handleAnswer(
    selectedIndex,
    buttons
  ) {
    const feedback =
      document.getElementById(
        "quiz-feedback"
      );

    buttons.forEach(b => {
      b.disabled = true;
    }); 

    if (
      selectedIndex ===
      QUIZ.correctIndex
    ) {

      /*
        🏴‍☠️ POTTY TIME UNLOCKED!
      */
      localStorage.setItem(
        "pottyTimeUnlocked",
        "true"
      );

      /*
        🔔 Tell main.js immediately.
      */
      window.dispatchEvent(
        new CustomEvent(
          "pottyTimeUnlocked"
        )
      );

      playerBooty += 50;

      pottyTimeChosen = false;

      feedback.style.color =
        "#51cf66";

      feedback.innerHTML = `
        <div style="
          font-size: 1.15rem;
          line-height: 1.5;
          margin-bottom: 12px;
        ">
          🎉 <strong>YOU'VE UNLOCKED<br>
          "POTTY TIME" IN THE PLAYLIST!</strong>
        </div>

        <div style="
          color: #f5d76e;
          font-size: 1rem;
          margin-bottom: 14px;
        ">
          🪙 Booty Secured:
          <strong>+50 Gold</strong>
          (Total: ${playerBooty})
        </div>

        <button id="play-potty-time" style="
          padding: 11px 22px;
          background: #c084fc;
          color: #120b18;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
          font-family: Georgia, serif;
          font-size: 1rem;
          box-shadow: 0 3px 10px rgba(0,0,0,0.4);
        ">
          🚽 PLAY POTTY TIME
        </button>
      `;

      const pottyButton =
        document.getElementById(
          "play-potty-time"
        );

      if (pottyButton) {
        pottyButton.onclick =
          playPottyTime;
      }

    } else {

      playerBooty = 0;

      feedback.style.color =
        "#ff6b6b";

      feedback.innerHTML = `
        💥 Oof! You stumbled:
        "${QUIZ.options[QUIZ.correctIndex]}"<br>

        <span style="color: #f5d76e; font-size: 0.95rem;">
          🌊 Argh! They plundered your pockets!
          Booty: <strong>0 Gold</strong>
        </span>
      `;
    } 

    /*
      Give the player a few seconds to read
      the victory message.

      If they choose PLAY POTTY TIME,
      that button takes over and the automatic
      next-track action is cancelled.
    */
    setTimeout(() => {

      if (pottyTimeChosen) {
        return;
      }

      hideContainer();

      setTimeout(
        skipToNextTrack,
        300
      );

    }, 5000);
  } 

  // =========================================================
  // MONITOR SONG STATUS
  // =========================================================

  function checkSongStatus() {
    const nowPlaying =
      document.querySelector(
        "#now-playing"
      );

    const text =
      nowPlaying
        ? nowPlaying.textContent
        : ""; 

    let videoMatch = false;

    if (
      window.rizneyPlayer &&
      typeof window.rizneyPlayer.getVideoData ===
        "function"
    ) {
      try {
        const data =
          window.rizneyPlayer.getVideoData();

        if (
          data &&
          String(data.video_id) ===
            TARGET_VIDEO_ID
        ) {
          videoMatch = true;
        }

      } catch (e) {}
    } 

    const isPlayingTarget =
      videoMatch ||
      text.includes(TARGET_TITLE) ||
      text.includes(TARGET_VIDEO_ID); 

    if (isPlayingTarget) {

      if (
        currentState ===
        "hidden"
      ) {
        showPromptState();
      } 

      if (
        currentState ===
          "listening" &&
        window.rizneyPlayer
      ) {
        try {

          if (
            typeof window.rizneyPlayer.getCurrentTime ===
              "function" &&
            typeof window.rizneyPlayer.getDuration ===
              "function"
          ) {

            const currentTime =
              window.rizneyPlayer
                .getCurrentTime();

            const duration =
              window.rizneyPlayer
                .getDuration(); 

            if (
              duration > 0 &&
              duration -
                currentTime <=
                3
            ) {
              showQuizState();
            }

          }

        } catch (e) {}
      } 

    } else {

      if (
        currentState !==
        "hidden"
      ) {
        hideContainer();
        currentState =
          "hidden";
      }
    }
  } 

  // =========================================================
  // INITIALIZATION
  // =========================================================

  function init() {
    injectContainer();
    setInterval(
      checkSongStatus,
      1000
    );
  } 

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  } 

})();
