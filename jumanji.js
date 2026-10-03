/* =========================================================
   "JUMANJI CHAOS" — STUPID EDITION
   ========================================================= */

(() => {
  "use strict";

  // =========================================================
  // CONSTANTS
  // =========================================================

  const JUMANJI_VIDEO_ID =
    "FOeZaZRRRZ0";

  const JUMANJI_SOUND =
    "./assets/jumanji.mp3";

  const BOOM_SOUND =
    "./assets/boom.mp3";

  const F_N_BOOM_SOUND =
    "./assets/f-n-boom.mp3";

  const OVERLAY_ID =
    "jumanji-chaos-overlay";

  const STYLE_ID =
    "jumanji-chaos-styles";

  const MAX_ANIMALS =
    180;


  // =========================================================
  // ANIMALS
  // =========================================================

  const ANIMALS = [
    "🐒",
    "🐍",
    "🦁",
    "🐘",
    "🦒",
    "🦓",
    "🦍",
    "🦛",
    "🐅",
    "🦏",
    "🐢",
    "🐸",
    "🐊",
    "🦅",
    "🐟",
    "🦀",
    "🦋",
    "🐙",
    "🐳",
    "🐬",
    "🦈",
    "🐪",
    "🦘",
    "🦥",
    "🦦",
    "🦔",
    "🐿️",
    "🦉",
    "🐧",
    "🦩",
    "🦜",
    "🐝",
    "🐞",
    "🐌",
    "🐜",
    "🕷️",
    "🦂"
  ];


  // =========================================================
  // RANDOM INTRUDERS
  // =========================================================

  const INTRUDERS = [
    "🦆",
    "🐔",
    "🐖",
    "🐐",
    "🦃",
    "🐓",
    "🐈",
    "🐕",
    "🦄"
  ];


  // =========================================================
  // STATE
  // =========================================================

  let active =
    false;

  let finished =
    false;

  let animationFrame =
    null;

  let spawnTimer =
    null;

  let jumanjiSoundTimer =
    null;

  let overlay =
    null;

  let animals =
    [];

  let gameStartTime =
    0;

  let gameDuration =
    300000;


  // =========================================================
  // SIMPLE SOUND SYSTEM
  // =========================================================

  /*
    Sound playback stays completely separate
    from the animal tapping system.
  */

  function playSound(
    path,
    volume = 1.0
  ) {

    try {

      const audio =
        new Audio(path);

      audio.volume =
        Math.min(
          1.0,
          volume
        );

      audio.currentTime =
        0;

      audio.play().catch(err => {

        console.log(
          "Sound playback blocked:",
          err
        );

      });

    } catch (e) {

      console.log(
        "Could not play sound:",
        e
      );

    }

  }


  // =========================================================
  // JUMANJI VOICE
  // =========================================================

  function playJumanjiVoice() {

    playSound(
      JUMANJI_SOUND,
      1.0
    );

  }


  // =========================================================
  // HIT SOUND
  // =========================================================

  function playHitSound() {

    const roll =
      Math.random();


    /*
      10% — FUCKING BOOM
      25% — boom
      65% — silence
    */

    if (
      roll < 0.10
    ) {

      playSound(
        F_N_BOOM_SOUND,
        1.0
      );

    } else if (
      roll < 0.35
    ) {

      playSound(
        BOOM_SOUND,
        1.0
      );

    }

  }


  // =========================================================
  // STYLES
  // =========================================================

  function injectStyles() {

    if (
      document.getElementById(
        STYLE_ID
      )
    ) {

      return;

    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      @keyframes jumanji-title-pulse {

        0% {
          transform:
            translateX(-50%)
            scale(1);
        }

        50% {
          transform:
            translateX(-50%)
            scale(1.04);
        }

        100% {
          transform:
            translateX(-50%)
            scale(1);
        }

      }


      @keyframes jumanji-boom {

        0% {

          transform:
            translate(-50%, -50%)
            scale(0.8);

          opacity: 0;

        }

        25% {

          transform:
            translate(-50%, -50%)
            scale(1);

          opacity: 1;

        }

        100% {

          transform:
            translate(-50%, -50%)
            scale(1);

          opacity: 0;

        }

      }


      .jumanji-animal {

        position: absolute;

        display: flex;

        align-items: center;

        justify-content: center;

        line-height: 1;

        cursor: crosshair;

        user-select: none;

        -webkit-user-select: none;

        pointer-events: auto;

        will-change:
          transform,
          left,
          top;

      }


      /*
        Tiny, boring little white boom.
      */

      .jumanji-boom-text {

        position: absolute;

        pointer-events: none;

        color: #ffffff;

        font-family:
          Arial,
          Helvetica,
          sans-serif;

        font-size: 1.15rem;

        font-weight: normal;

        letter-spacing: 0;

        text-shadow:
          0 1px 3px #000000;

        animation:
          jumanji-boom
          0.55s
          ease-out
          forwards;

        z-index: 999999;

      }

    `;


    document.head.appendChild(
      style
    );

  }


  // =========================================================
  // CREATE OVERLAY
  // =========================================================

  function createOverlay() {

    if (overlay) {

      return;

    }


    overlay =
      document.createElement(
        "div"
      );


    overlay.id =
      OVERLAY_ID;


    overlay.style.cssText = `

      position: fixed;

      inset: 0;

      width: 100vw;

      height: 100vh;

      background: #000000;

      overflow: hidden;

      pointer-events: auto;

      z-index: 2147483647;

      touch-action: none;

      user-select: none;

      -webkit-user-select: none;

      cursor: crosshair;

    `;


    /*
      IMPORTANT:

      DO NOT put a pointerdown listener
      on the overlay in capture mode.

      Doing that would intercept the tap
      BEFORE the animal receives it.

      The overlay is already above the
      entire website, so the website
      underneath cannot be tapped anyway.
    */


    document.body.appendChild(
      overlay
    );

  }


  // =========================================================
  // TITLES
  // =========================================================

  function createTitles() {

    if (!overlay) {

      return;

    }


    const top =
      document.createElement(
        "div"
      );


    top.textContent =
      "YOU GOT JUMANJI'D!";


    top.style.cssText = `

      position: absolute;

      top: 20px;

      left: 50%;

      transform:
        translateX(-50%);

      width: 100%;

      text-align: center;

      color: #228b22;

      font-family:
        Georgia,
        serif;

      font-size:
        clamp(
          1.4rem,
          5vw,
          2.5rem
        );

      font-weight: bold;

      letter-spacing: 2px;

      text-shadow:
        0 2px 5px black,
        0 0 10px #228b22;

      pointer-events: none;

      z-index: 999998;

      animation:
        jumanji-title-pulse
        2s
        ease-in-out
        infinite;

    `;


    overlay.appendChild(
      top
    );


    const bottom =
      document.createElement(
        "div"
      );


    bottom.textContent =
      "JUNGLE MADNESS";


    bottom.style.cssText = `

      position: absolute;

      bottom: 20px;

      left: 50%;

      transform:
        translateX(-50%);

      width: 100%;

      text-align: center;

      color: #228b22;

      font-family:
        Georgia,
        serif;

      font-size:
        clamp(
          1.3rem,
          4vw,
          2rem
        );

      font-weight: bold;

      letter-spacing: 3px;

      text-shadow:
        0 2px 5px black,
        0 0 10px #228b22;

      pointer-events: none;

      z-index: 999998;

    `;


    overlay.appendChild(
      bottom
    );

  }


  // =========================================================
  // BOOM TEXT
  // =========================================================

  function showBoom(
    x,
    y
  ) {

    if (!overlay) {

      return;

    }


    const boom =
      document.createElement(
        "div"
      );


    boom.className =
      "jumanji-boom-text";


    boom.textContent =
      "boom";


    boom.style.left =
      `${x}px`;


    boom.style.top =
      `${y}px`;


    overlay.appendChild(
      boom
    );


    setTimeout(() => {

      boom.remove();

    }, 600);

  }


  // =========================================================
  // RANDOM ANIMAL
  // =========================================================

  function randomAnimal() {

    const progress =
      getProgress();


    /*
      Random inappropriate intruders
      begin appearing later.
    */

    if (
      progress > 0.55 &&
      Math.random() < 0.08
    ) {

      return {

        emoji:
          INTRUDERS[
            Math.floor(
              Math.random() *
              INTRUDERS.length
            )
          ],

        intruder:
          true

      };

    }


    return {

      emoji:
        ANIMALS[
          Math.floor(
            Math.random() *
            ANIMALS.length
          )
        ],

      intruder:
        false

    };

  }


  // =========================================================
  // PROGRESS
  // =========================================================

  function getProgress() {

    if (!gameStartTime) {

      return 0;

    }


    const elapsed =
      Date.now() -
      gameStartTime;


    return Math.max(
      0,
      Math.min(
        1,
        elapsed /
          gameDuration
      )
    );

  }


  // =========================================================
  // SPAWN ANIMAL
  // =========================================================

  function spawnAnimal() {

    if (
      !active ||
      !overlay
    ) {

      return;

    }


    if (
      animals.length >=
      MAX_ANIMALS
    ) {

      return;

    }


    const animalData =
      randomAnimal();


    const animal =
      document.createElement(
        "div"
      );


    animal.className =
      "jumanji-animal";


    animal.textContent =
      animalData.emoji;


    /*
      Occasionally spawn something
      ridiculously huge.
    */

    const huge =
      Math.random() <
      0.045;


    let size;


    if (huge) {

      size =
        100 +
        Math.random() *
        80;

    } else {

      size =
        30 +
        Math.random() *
        42;

    }


    animal.style.fontSize =
      `${size}px`;


    // =====================================================
    // RANDOM START POSITION
    // =====================================================

    const width =
      window.innerWidth;

    const height =
      window.innerHeight;


    const x =
      Math.random() *
      Math.max(
        20,
        width -
          size
      );


    const y =
      Math.random() *
      Math.max(
        20,
        height -
          size
      );


    animal.style.left =
      `${x}px`;


    animal.style.top =
      `${y}px`;


    // =====================================================
    // MOVEMENT
    // =====================================================

    const progress =
      getProgress();


    const speedMultiplier =
      0.6 +
      progress *
        2.2;


    let vx =
      (
        Math.random() *
        2 -
        1
      ) *
      speedMultiplier;


    let vy =
      (
        Math.random() *
        2 -
        1
      ) *
      speedMultiplier;


    /*
      Some animals move weirdly.
    */

    const weird =
      Math.random() <
      0.12;


    const wobble =
      weird
        ? 0.08 +
          Math.random() *
          0.18
        : 0;


    let rotation =
      Math.random() *
      360;


    let rotationSpeed =
      (
        Math.random() *
        4 -
        2
      );


    const animalObject = {

      element:
        animal,

      x,

      y,

      vx,

      vy,

      size,

      rotation,

      rotationSpeed,

      wobble,

      weird,

      phase:
        Math.random() *
        Math.PI *
        2

    };


    // =====================================================
    // TAP / CLICK ANIMAL
    // =====================================================

    animal.addEventListener(
      "pointerdown",
      e => {

        e.preventDefault();

        e.stopPropagation();


        if (!active) {

          return;

        }


        const rect =
          animal.getBoundingClientRect();


        const boomX =
          rect.left +
          rect.width /
            2;


        const boomY =
          rect.top +
          rect.height /
            2;


        /*
          Every animal gets the
          little white "boom".
        */

        showBoom(
          boomX,
          boomY
        );


        /*
          Occasionally make noise.
        */

        playHitSound();


        /*
          Remove the animal.
        */

        animal.remove();


        const index =
          animals.indexOf(
            animalObject
          );


        if (
          index !== -1
        ) {

          animals.splice(
            index,
            1
          );

        }

      },
      false
    );


    /*
      Add the animal AFTER its event
      handler has been attached.
    */

    overlay.appendChild(
      animal
    );


    animals.push(
      animalObject
    );

  }


  // =========================================================
  // SPAWN SPEED
  // =========================================================

  function getSpawnInterval() {

    const progress =
      getProgress();


    const accelerated =
      Math.pow(
        progress,
        1.8
      );


    return (
      2500 -
      (
        2500 -
        180
      ) *
      accelerated
    );

  }


  // =========================================================
  // SCHEDULE SPAWNING
  // =========================================================

  function scheduleNextSpawn() {

    if (!active) {

      return;

    }


    const interval =
      getSpawnInterval();


    spawnTimer =
      setTimeout(
        () => {

          if (!active) {

            return;

          }


          spawnAnimal();


          const progress =
            getProgress();


          /*
            Extra animals after 65%.
          */

          if (
            progress >
            0.65
          ) {

            spawnAnimal();

          }


          /*
            More animals after 80%.
          */

          if (
            progress >
              0.80 &&
            Math.random() <
              0.65
          ) {

            spawnAnimal();

          }


          /*
            Absolute nonsense after 90%.
          */

          if (
            progress >
            0.90
          ) {

            spawnAnimal();


            if (
              Math.random() <
              0.7
            ) {

              spawnAnimal();

            }

          }


          scheduleNextSpawn();

        },
        interval
      );

  }


  // =========================================================
  // ANIMATION
  // =========================================================

  function animate() {

    if (!active) {

      return;

    }


    const width =
      window.innerWidth;

    const height =
      window.innerHeight;


    const progress =
      getProgress();


    /*
      Animals gradually get faster.
    */

    const speedBoost =
      1 +
      progress *
        2.5;


    animals.forEach(
      animal => {

        /*
          Weird animals wobble around.
        */

        if (
          animal.weird
        ) {

          animal.phase +=
            animal.wobble;


          animal.vx +=
            Math.sin(
              animal.phase
            ) *
            0.04;


          animal.vy +=
            Math.cos(
              animal.phase *
              1.3
            ) *
            0.04;

        }


        animal.x +=
          animal.vx *
          speedBoost;


        animal.y +=
          animal.vy *
          speedBoost;


        // =================================================
        // BOUNCE
        // =================================================

        if (
          animal.x <= 0
        ) {

          animal.x =
            0;

          animal.vx =
            Math.abs(
              animal.vx
            );

        }


        if (
          animal.x +
            animal.size >=
          width
        ) {

          animal.x =
            width -
            animal.size;

          animal.vx =
            -Math.abs(
              animal.vx
            );

        }


        if (
          animal.y <= 0
        ) {

          animal.y =
            0;

          animal.vy =
            Math.abs(
              animal.vy
            );

        }


        if (
          animal.y +
            animal.size >=
          height
        ) {

          animal.y =
            height -
            animal.size;

          animal.vy =
            -Math.abs(
              animal.vy
            );

        }


        // =================================================
        // ROTATION
        // =================================================

        animal.rotation +=
          animal.rotationSpeed *
          speedBoost;


        animal.element.style.left =
          `${animal.x}px`;


        animal.element.style.top =
          `${animal.y}px`;


        animal.element.style.transform =
          `rotate(${animal.rotation}deg)`;

      }
    );


    /*
      Final 10% becomes increasingly stupid.
    */

    if (
      progress >
        0.90 &&
      Math.random() <
        0.035
    ) {

      spawnAnimal();

    }


    animationFrame =
      requestAnimationFrame(
        animate
      );

  }


  // =========================================================
  // START GAME
  // =========================================================

  function startGame() {

    if (active) {

      return;

    }


    active =
      true;

    finished =
      false;


    animals =
      [];


    gameStartTime =
      Date.now();


    /*
      Get actual YouTube duration.
    */

    try {

      if (
        window.rizneyPlayer &&
        typeof
          window.rizneyPlayer
            .getDuration ===
          "function"
      ) {

        const duration =
          window.rizneyPlayer
            .getDuration();


        if (
          duration > 0
        ) {

          gameDuration =
            duration *
            1000;

        }

      }

    } catch (e) {}


    injectStyles();

    createOverlay();

    createTitles();


    /*
      One lonely animal.
    */

    spawnAnimal();


    /*
      Start the jungle invasion.
    */

    scheduleNextSpawn();


    /*
      Start movement.
    */

    animate();


    /*
      Jumanji voice after three seconds.
    */

    jumanjiSoundTimer =
      setTimeout(
        playJumanjiVoice,
        3000
      );

  }


  // =========================================================
  // END MESSAGE
  // =========================================================

  function showMessage(
    message
  ) {

    if (!overlay) {

      return;

    }


    const messageBox =
      document.createElement(
        "div"
      );


    messageBox.textContent =
      message;


    messageBox.style.cssText = `

      position: absolute;

      left: 50%;

      top: 50%;

      transform:
        translate(-50%, -50%);

      width: 90%;

      text-align: center;

      color: #228b22;

      font-family:
        Georgia,
        serif;

      font-size:
        clamp(
          1.7rem,
          7vw,
          4rem
        );

      font-weight: bold;

      letter-spacing: 2px;

      text-shadow:
        0 3px 8px black,
        0 0 15px #228b22;

      pointer-events: none;

      z-index: 1000000;

    `;


    overlay.appendChild(
      messageBox
    );

  }


  // =========================================================
  // STOP GAME
  // =========================================================

  function stopGame() {

    active =
      false;


    if (
      animationFrame
    ) {

      cancelAnimationFrame(
        animationFrame
      );

      animationFrame =
        null;

    }


    if (
      spawnTimer
    ) {

      clearTimeout(
        spawnTimer
      );

      spawnTimer =
        null;

    }


    if (
      jumanjiSoundTimer
    ) {

      clearTimeout(
        jumanjiSoundTimer
      );

      jumanjiSoundTimer =
        null;

    }


    if (overlay) {

      overlay.remove();

      overlay =
        null;

    }


    animals =
      [];

  }


  // =========================================================
  // FINISH GAME
  // =========================================================

  function finishGame() {

    if (finished) {

      return;

    }


    finished =
      true;

    active =
      false;


    if (
      animationFrame
    ) {

      cancelAnimationFrame(
        animationFrame
      );

      animationFrame =
        null;

    }


    if (
      spawnTimer
    ) {

      clearTimeout(
        spawnTimer
      );

      spawnTimer =
        null;

    }


    if (
      jumanjiSoundTimer
    ) {

      clearTimeout(
        jumanjiSoundTimer
      );

      jumanjiSoundTimer =
        null;

    }


    if (
      animals.length > 0
    ) {

      showMessage(
        "YOU GOT JUMANJI'D!"
      );

    } else {

      showMessage(
        "YOU ESCAPED JUMANJI"
      );

    }

  }


  // =========================================================
  // CHECK JUMANJI
  // =========================================================

  function checkJumanji() {

    if (
      !window.rizneyPlayer ||
      typeof
        window.rizneyPlayer
          .getVideoData !==
        "function"
    ) {

      return;

    }


    try {

      const data =
        window.rizneyPlayer
          .getVideoData();


      const videoId =
        data &&
        data.video_id
          ? String(
              data.video_id
            )
          : "";


      if (
        videoId ===
        JUMANJI_VIDEO_ID
      ) {

        /*
          Start the game.
        */

        if (
          !active &&
          !finished
        ) {

          startGame();

        }


        /*
          Synchronize with the actual
          YouTube duration.
        */

        if (
          window.rizneyPlayer &&
          typeof
            window.rizneyPlayer
              .getDuration ===
            "function"
        ) {

          const duration =
            window.rizneyPlayer
              .getDuration();


          if (
            duration > 0
          ) {

            gameDuration =
              duration *
              1000;

          }

        }


        /*
          Finish just before YouTube
          advances to the next track.
        */

        if (
          active
        ) {

          const currentTime =
            typeof
              window.rizneyPlayer
                .getCurrentTime ===
              "function"
              ? window.rizneyPlayer
                  .getCurrentTime()
              : 0;


          const duration =
            typeof
              window.rizneyPlayer
                .getDuration ===
              "function"
              ? window.rizneyPlayer
                  .getDuration()
              : 0;


          if (
            duration > 0 &&
            duration -
              currentTime <=
              0.7
          ) {

            finishGame();

          }

        }

      } else {

        /*
          We left Jumanji.
        */

        if (
          active ||
          overlay
        ) {

          stopGame();

        }


        finished =
          false;

      }

    } catch (e) {

      /*
        Ignore temporary YouTube API errors.
      */

    }

  }


  // =========================================================
  // INITIALIZATION
  // =========================================================

  function init() {

    injectStyles();


    setInterval(
      checkJumanji,
      250
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
