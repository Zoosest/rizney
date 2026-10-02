/* =========================================================
   "YOU DON'T KNOW TRACK" - PIRATE DUEL EDITION (WITH BOOTY)
   ========================================================= */

(() => {
  "use strict";

  // =========================================================
  // DUEL DEFINITIONS
  // =========================================================

  const MONKEY_JUDGE = {
    videoId: "SHhsdD5viWs",
    title: "Monkey Judge",
    image: "./assets/black-bear.png",
    imageAlt: "Captain Black Bear",

    quiz: [
      {
        question:
          "Complete the pirate's lyric line: 'Monkey judge, monkey jury, ____.'",

        options: [
          "Everyone in such a hurry",
          "Monkeys are always so dirty",
          "Everything is getting blurry",
          "Getting so worried"
        ],

        correctIndex: 0
      },

      {
        question:
          "What did the monkey steal?",

        options: [
          "Her keys",
          "Her money",
          "Her hat",
          "Her case"
        ],

        correctIndex: 2
      },

      {
        question:
          "What is the name of the Monkey Judge?",

        options: [
          "Bubbles",
          "Matt",
          "Tango",
          "Tom"
        ],

        correctIndex: 2
      }
    ],

    unlocksPottyTime: true
  };


  const DELAWARE = {
    videoId: "",
    title: "Delaware (Under The Sea)",
    image: "./assets/fox-pirate.png",
    imageAlt: "Pirate Fox",

    quiz: [
      {
        question:
          "What's the capital of Delaware?",

        options: [
          "Wilmington",
          "Dover",
          "Newark",
          "Rehoboth Beach"
        ],

        correctIndex: 1
      },

      {
        question:
          "What band are the couple talking about?",

        options: [
          "Led Zeppelin",
          "The Beatles",
          "The Police",
          "Rush"
        ],

        correctIndex: 3
      },

      {
        question:
          "Fill in the lyrics: \"Hella scared on some welfare about some _____\"",

        options: [
          "Fresh Air",
          "Dental Health Care",
          "Impaired",
          "Derrieres"
        ],

        correctIndex: 1
      }
    ],

    unlocksPottyTime: false
  };


  const YOHO = {
    videoId: "",
    title: "YOHO (Davy Jones)",
    image: "./assets/possum-pirate.png",
    imageAlt: "Pirate Possum",

    quiz: [
      {
        question:
          "What were the last lyrics spoken in the song?",

        options: [
          "Its Game Over",
          "YOHO",
          "I gotta fix my front tooth",
          "some dont even notice"
        ],

        correctIndex: 2
      },

      {
        question:
          'When Davy Jones asks Will Turner "what is your purpose here?" What is his response?',

        options: [
          "To challenge Davy Jones",
          "Jack Sparrow sent me to settle his debt",
          "Never shall we die",
          "Don't listen to him"
        ],

        correctIndex: 1
      },

      {
        question:
          "What Ace Of Base song was sampled in this track?",

        options: [
          "The Sign",
          "All That She Wants",
          "Don't Turn Around",
          "None"
        ],

        correctIndex: 1
      }
    ],

    unlocksPottyTime: false
  };


  // =========================================================
  // ACTIVE DUEL
  // =========================================================

  let activeDuel = null;

  function getActiveDuel() {

    const nowPlaying =
      document.querySelector("#now-playing");

    const text =
      nowPlaying
        ? nowPlaying.textContent
        : "";


    /*
      =======================================================
      COMPLETED DUELS
      =======================================================

      Once a duel has been successfully completed,
      it will never appear again for that song.
    */

    const monkeyJudgeCompleted =
      localStorage.getItem(
        "monkeyJudgeCompleted"
      ) === "true";

    const delawareCompleted =
      localStorage.getItem(
        "delawareCompleted"
      ) === "true";

    const yohoCompleted =
      localStorage.getItem(
        "yohoCompleted"
      ) === "true";


    /*
      Check YouTube video ID first.
    */

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
            MONKEY_JUDGE.videoId
        ) {

          if (!monkeyJudgeCompleted) {
            return MONKEY_JUDGE;
          }

          return null;
        }

      } catch (e) {}
    }


    /*
      Fall back to title matching.
      Case-insensitive so capitalization
      differences won't break the trigger.
    */

    const lowerText =
      text.toLowerCase();


    if (
      lowerText.includes(
        MONKEY_JUDGE.title.toLowerCase()
      )
    ) {

      if (!monkeyJudgeCompleted) {
        return MONKEY_JUDGE;
      }

      return null;
    }


    if (
      lowerText.includes(
        DELAWARE.title.toLowerCase()
      )
    ) {

      if (!delawareCompleted) {
        return DELAWARE;
      }

      return null;
    }


    if (
      lowerText.includes(
        YOHO.title.toLowerCase()
      )
    ) {

      if (!yohoCompleted) {
        return YOHO;
      }

      return null;
    }


    return null;
  }


  // =========================================================
  // CONSTANTS
  // =========================================================

  const CONTAINER_ID =
    "simple-quiz-container";

  const AUDIO_PATH =
    "./assets/You-dont-know-track.mp3";


  // =========================================================
  // PLAYER BOOTY
  // =========================================================

  let playerBooty = 0;


  // =========================================================
  // CURRENT QUESTION
  // =========================================================

  let currentQuestionIndex = 0;


  // =========================================================
  // STATE
  // =========================================================

  let currentState = "hidden";

  /*
    "hidden"
    "prompt"
    "dismissed"
    "listening"
    "quiz"
  */


  let pottyTimeChosen = false;


  let niceAndSlowChosen = false;


  let rollingStoneChosen = false;


  // =========================================================
  // CONTAINER
  // =========================================================

  function injectContainer() {

    if (
      document.getElementById(
        CONTAINER_ID
      )
    ) {
      return;
    }

    const wrapper =
      document.createElement("div");

    wrapper.id =
      CONTAINER_ID;

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
      transition:
        transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275),
        opacity 0.3s ease;
    `;

    document.body.appendChild(
      wrapper
    );
  }


  function showContainer() {

    const wrapper =
      document.getElementById(
        CONTAINER_ID
      );

    if (!wrapper) return;

    wrapper.style.transform =
      "translateX(-50%) translateY(0)";

    wrapper.style.opacity =
      "1";

    wrapper.style.pointerEvents =
      "auto";
  }


  function hideContainer() {

    const wrapper =
      document.getElementById(
        CONTAINER_ID
      );

    if (!wrapper) return;

    wrapper.style.transform =
      "translateX(-50%) translateY(150%)";

    wrapper.style.opacity =
      "0";

    wrapper.style.pointerEvents =
      "none";
  }


  // =========================================================
  // POTTY TIME PLAY BUTTON
  // =========================================================

  function playPottyTime() {

    const rows =
      Array.from(
        document.querySelectorAll(
          "#song-list .song"
        )
      );

    const pottyRow =
      rows.find(row => {

        const title =
          row.querySelector(
            ".song-title"
          );

        return (
          title &&
          title.textContent.includes(
            "POTTY TIME"
          )
        );
      });

    if (!pottyRow) {

      console.log(
        "Could not find POTTY TIME in the playlist."
      );

      return;
    }

    pottyTimeChosen =
      true;

    pottyRow.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });


    setTimeout(() => {

      const title =
        pottyRow.querySelector(
          ".song-title"
        );

      if (title) {

        title.click();

        return;
      }


      const playButton =
        pottyRow.querySelector(
          ".play"
        );

      if (playButton) {

        playButton.click();
      }

    }, 350);


    hideContainer();
  }


  // =========================================================
  // NICE & SLOW PLAY BUTTON
  // =========================================================

  function playNiceAndSlow() {

    const rows =
      Array.from(
        document.querySelectorAll(
          "#song-list .song"
        )
      );

    const niceAndSlowRow =
      rows.find(row => {

        const title =
          row.querySelector(
            ".song-title"
          );

        return (
          title &&
          title.textContent.includes(
            "Nice & Slow"
          )
        );
      });

    if (!niceAndSlowRow) {

      console.log(
        "Could not find Nice & Slow in the playlist."
      );

      return;
    }

    niceAndSlowChosen =
      true;

    niceAndSlowRow.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });


    setTimeout(() => {

      const title =
        niceAndSlowRow.querySelector(
          ".song-title"
        );

      if (title) {

        title.click();

        return;
      }


      const playButton =
        niceAndSlowRow.querySelector(
          ".play"
        );

      if (playButton) {

        playButton.click();
      }

    }, 350);


    hideContainer();
  }


  // =========================================================
  // ROLLING STONE PLAY BUTTON
  // =========================================================

  function playRollingStone() {

    const rows =
      Array.from(
        document.querySelectorAll(
          "#song-list .song"
        )
      );

    const rollingStoneRow =
      rows.find(row => {

        const title =
          row.querySelector(
            ".song-title"
          );

        return (
          title &&
          title.textContent.includes(
            "A Rolling Stone Gathers NO MAS"
          )
        );
      });

    if (!rollingStoneRow) {

      console.log(
        "Could not find A Rolling Stone Gathers NO MAS in the playlist."
      );

      return;
    }

    rollingStoneChosen =
      true;

    rollingStoneRow.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });


    setTimeout(() => {

      const title =
        rollingStoneRow.querySelector(
          ".song-title"
        );

      if (title) {

        title.click();

        return;
      }


      const playButton =
        rollingStoneRow.querySelector(
          ".play"
        );

      if (playButton) {

        playButton.click();
      }

    }, 350);


    hideContainer();
  }


  // =========================================================
  // CONTINUE ALBUM
  // =========================================================

  function continueAlbum() {

    hideContainer();

    setTimeout(
      skipToNextTrack,
      300
    );
  }


  // =========================================================
  // STATE 1 — INITIAL PROMPT
  // =========================================================

  function showPromptState() {

    const wrapper =
      document.getElementById(
        CONTAINER_ID
      );

    if (!wrapper) return;

    currentState =
      "prompt";


    currentQuestionIndex =
      0;

    playerBooty =
      0;

    pottyTimeChosen =
      false;

    niceAndSlowChosen =
      false;

    rollingStoneChosen =
      false;


    const duel =
      activeDuel ||
      MONKEY_JUDGE;


    wrapper.innerHTML = `
      <div style="
        width: 100%;
        max-height: 260px;
        overflow: hidden;
        border-radius: 6px;
        border: 1px solid #d4af37;
        margin-bottom: 15px;
        background: #0c0810;
        display: flex;
        justify-content: center;
        align-items: center;
      ">
        <img
          src="${duel.image}"
          alt="${duel.imageAlt}"
          style="
            width: 100%;
            height: auto;
            max-height: 260px;
            object-fit: contain;
            display: block;
            image-rendering: pixelated;
          "
        >
      </div>

      <div style="
        font-size: 1.15rem;
        font-weight: bold;
        color: #f5d76e;
        margin-bottom: 15px;
        line-height: 1.4;
      ">
        ${duel === DELAWARE
          ? "Pirate Fox has challenged you."
          : duel === YOHO
            ? "Pirate Possum has challenged you."
            : "Captain Black Bear has challenged you."
        }<br>

        <span style="
          color: #c084fc;
          font-size: 1.25rem;
        ">
          Duel?
        </span>
      </div>

      <div style="
        display: flex;
        gap: 12px;
        justify-content: center;
        align-items: center;
      ">

        <button
          id="start-quiz-optin"
          style="
            padding: 10px 24px;
            background: #c084fc;
            color: #120b18;
            border: none;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            font-family: Georgia, serif;
            font-size: 1rem;
          "
        >
          En Garde!
        </button>

        <button
          id="dismiss-quiz-optin"
          style="
            padding: 10px 18px;
            background: transparent;
            color: #a78bfa;
            border: 1px solid #7c3aed;
            border-radius: 4px;
            cursor: pointer;
            font-family: Georgia, serif;
            font-size: 0.95rem;
          "
        >
          Flee in Terror
        </button>

      </div>
    `;


    showContainer();


    document.getElementById(
      "start-quiz-optin"
    ).onclick = () => {

      playVoiceClip();

      showListeningState();
    };


    document.getElementById(
      "dismiss-quiz-optin"
    ).onclick = () => {

      currentState =
        "dismissed";

      hideContainer();
    };
  }


  // =========================================================
  // VOICE CLIP
  // =========================================================

  function playVoiceClip() {

    try {

      const audio =
        new Audio(
          AUDIO_PATH
        );

      audio.volume =
        1.0;

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
      typeof window.rizneyPlayer.pauseVideo ===
        "function"
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
      typeof window.rizneyPlayer.nextVideo ===
        "function"
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

    currentState =
      "listening";


    wrapper.innerHTML = `
      <div style="
        font-size: 1.1rem;
        font-weight: bold;
        color: #c084fc;
      ">
        PAY ATTENTION...<br>
        YOU'RE BEING TESTED.
      </div>
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

    currentState =
      "quiz";


    stopSong();


    const duel =
      activeDuel ||
      MONKEY_JUDGE;


    const quiz =
      duel.quiz[
        currentQuestionIndex
      ];


    if (!quiz) {

      return;
    }


    const questionNumber =
      currentQuestionIndex + 1;


    const totalQuestions =
      duel.quiz.length;


    const optionsHtml =
      quiz.options
        .map(
          (opt, index) => {

            const letter =
              String.fromCharCode(
                65 + index
              );

            return `
              <button
                class="quiz-opt-btn"
                data-index="${index}"
                style="
                  padding: 10px;
                  background: #0f0a13;
                  border: 1px solid #c084fc;
                  color: #f5d76e;
                  border-radius: 4px;
                  cursor: pointer;
                  text-align: left;
                  font-family: Georgia, serif;
                  font-size: 1rem;
                "
              >
                ${letter}. ${opt}
              </button>
            `;
          }
        )
        .join("");


    wrapper.innerHTML = `
      <div style="
        color: #d4af37;
        font-size: 0.9rem;
        font-weight: bold;
        margin-bottom: 6px;
      ">
        QUESTION
        ${questionNumber}
        OF
        ${totalQuestions}
      </div>

      <p style="
        font-size: 1.1rem;
        margin: 15px 0;
      ">
        ${quiz.question}
      </p>

      <div
        id="quiz-options-list"
        style="
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 15px;
        "
      >
        ${optionsHtml}
      </div>

      <div
        id="quiz-feedback"
        style="
          font-weight: bold;
          font-size: 1.05rem;
          min-height: 36px;
          line-height: 1.4;
        "
      ></div>
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

    if (!feedback) return;


    buttons.forEach(b => {

      b.disabled =
        true;
    });


    const duel =
      activeDuel ||
      MONKEY_JUDGE;


    const quiz =
      duel.quiz[
        currentQuestionIndex
      ];


    // =======================================================
    // CORRECT ANSWER
    // =======================================================

    if (
      selectedIndex ===
      quiz.correctIndex
    ) {

      playerBooty += 50;


      /*
        If there are still questions remaining,
        move to the next question.
      */

      if (
        currentQuestionIndex <
        duel.quiz.length - 1
      ) {

        feedback.style.color =
          "#51cf66";

        feedback.innerHTML = `
          YARRRR!
          <span style="
            color: #f5d76e;
            font-size: 0.95rem;
          ">
            &nbsp; +50 Gold
          </span>
        `;


        setTimeout(() => {

          currentQuestionIndex++;

          showQuizState();

        }, 1000);


        return;
      }


      // =====================================================
      // DUEL COMPLETE
      // =====================================================

      /*
        Mark this duel as permanently completed.

        Once this is true, getActiveDuel()
        will no longer return this duel.
      */

      if (
        duel === MONKEY_JUDGE
      ) {

        localStorage.setItem(
          "monkeyJudgeCompleted",
          "true"
        );

      }


      if (
        duel === DELAWARE
      ) {

        localStorage.setItem(
          "delawareCompleted",
          "true"
        );

      }


      if (
        duel === YOHO
      ) {

        localStorage.setItem(
          "yohoCompleted",
          "true"
        );

      }


      /*
        ONLY MONKEY JUDGE unlocks POTTY TIME.
      */

      if (
        duel.unlocksPottyTime
      ) {

        localStorage.setItem(
          "pottyTimeUnlocked",
          "true"
        );


        window.dispatchEvent(
          new CustomEvent(
            "pottyTimeUnlocked"
          )
        );


        pottyTimeChosen =
          false;


        feedback.style.color =
          "#51cf66";


        feedback.innerHTML = `
          <div style="
            font-size: 1.15rem;
            line-height: 1.5;
            margin-bottom: 12px;
          ">
            POTTY TIME UNLOCKED!
          </div>

          <div style="
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
          ">
            <button
              id="play-potty-time"
              style="
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
              "
            >
              🚽 PLAY POTTY TIME
            </button>

            <button
              id="continue-album"
              style="
                padding: 11px 22px;
                background: transparent;
                color: #a78bfa;
                border: 1px solid #7c3aed;
                border-radius: 5px;
                font-weight: bold;
                cursor: pointer;
                font-family: Georgia, serif;
                font-size: 1rem;
              "
            >
              CONTINUE ALBUM
            </button>
          </div>
        `;


        const pottyButton =
          document.getElementById(
            "play-potty-time"
          );


        if (pottyButton) {

          pottyButton.onclick =
            playPottyTime;
        }


        const continueButton =
          document.getElementById(
            "continue-album"
          );


        if (continueButton) {

          continueButton.onclick =
            continueAlbum;
        }


        return;
      }


      // =====================================================
      // DELAWARE / NICE & SLOW UNLOCK
      // =====================================================

      if (
        duel === DELAWARE
      ) {

        localStorage.setItem(
          "niceAndSlowUnlocked",
          "true"
        );


        window.dispatchEvent(
          new CustomEvent(
            "niceAndSlowUnlocked"
          )
        );


        niceAndSlowChosen =
          false;


        feedback.style.color =
          "#51cf66";


        feedback.innerHTML = `
          <div style="
            font-size: 1.15rem;
            line-height: 1.5;
            margin-bottom: 12px;
          ">
            NICE & SLOW UNLOCKED!
          </div>

          <div style="
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
          ">
            <button
              id="play-nice-and-slow"
              style="
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
              "
            >
              🐌 PLAY NICE & SLOW
            </button>

            <button
              id="continue-album"
              style="
                padding: 11px 22px;
                background: transparent;
                color: #a78bfa;
                border: 1px solid #7c3aed;
                border-radius: 5px;
                font-weight: bold;
                cursor: pointer;
                font-family: Georgia, serif;
                font-size: 1rem;
              "
            >
              CONTINUE ALBUM
            </button>
          </div>
        `;


        const niceAndSlowButton =
          document.getElementById(
            "play-nice-and-slow"
          );


        if (niceAndSlowButton) {

          niceAndSlowButton.onclick =
            playNiceAndSlow;
        }


        const continueButton =
          document.getElementById(
            "continue-album"
          );


        if (continueButton) {

          continueButton.onclick =
            continueAlbum;
        }


        return;
      }


      // =====================================================
      // YOHO / ROLLING STONE UNLOCK
      // =====================================================

      if (
        duel === YOHO
      ) {

        localStorage.setItem(
          "rollingStoneUnlocked",
          "true"
        );


        window.dispatchEvent(
          new CustomEvent(
            "rollingStoneUnlocked"
          )
        );


        rollingStoneChosen =
          false;


        feedback.style.color =
          "#51cf66";


        feedback.innerHTML = `
          <div style="
            font-size: 1.15rem;
            line-height: 1.5;
            margin-bottom: 12px;
          ">
            A ROLLING STONE GATHERS NO MAS UNLOCKED!
          </div>

          <div style="
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
          ">
            <button
              id="play-rolling-stone"
              style="
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
              "
            >
              💀 PLAY A ROLLING STONE GATHERS NO MAS
            </button>

            <button
              id="continue-album"
              style="
                padding: 11px 22px;
                background: transparent;
                color: #a78bfa;
                border: 1px solid #7c3aed;
                border-radius: 5px;
                font-weight: bold;
                cursor: pointer;
                font-family: Georgia, serif;
                font-size: 1rem;
              "
            >
              CONTINUE ALBUM
            </button>
          </div>
        `;


        const rollingStoneButton =
          document.getElementById(
            "play-rolling-stone"
          );


        if (rollingStoneButton) {

          rollingStoneButton.onclick =
            playRollingStone;
        }


        const continueButton =
          document.getElementById(
            "continue-album"
          );


        if (continueButton) {

          continueButton.onclick =
            continueAlbum;
        }


        return;
      }


      // =====================================================
      // FALLBACK VICTORY
      // =====================================================

      feedback.style.color =
        "#51cf66";


      feedback.innerHTML = `
        <strong>DUEL COMPLETE!</strong>
      `;


      return;
    }


    // =======================================================
    // WRONG ANSWER
    // =======================================================

    playerBooty =
      0;


    feedback.style.color =
      "#ff6b6b";


    feedback.innerHTML = `
      <div style="
        font-size: 1.25rem;
        font-weight: bold;
      ">
        WALK THE PLANK!
      </div>

      <div style="
        color: #f5d76e;
        font-size: 1rem;
        margin-top: 8px;
      ">
        You lost all your booty.
      </div>
    `;


    setTimeout(() => {

      hideContainer();


      setTimeout(
        skipToNextTrack,
        300
      );

    }, 3000);
  }


  // =========================================================
  // MONITOR SONG STATUS
  // =========================================================

  function checkSongStatus() {

    const duel =
      getActiveDuel();


    if (duel) {

      /*
        If this is a NEW duel,
        remember which duel is active.
      */

      if (
        activeDuel !== duel
      ) {

        activeDuel =
          duel;

        currentState =
          "hidden";
      }


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


      activeDuel =
        null;
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
