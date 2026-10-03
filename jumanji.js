/* =========================================================
   JUMANJI CHAOS
   "JUNGLE MADNESS"
   "YOU GOT JUMANJI'D"
   ========================================================= */

(() => {
  "use strict";

  // =========================================================
  // JUMANJI VIDEO
  // =========================================================

  const JUMANJI_VIDEO_ID = "FOeZaZRRRZ0";


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
  // SETTINGS
  // =========================================================

  const OVERLAY_ID =
    "jumanji-chaos-overlay";

  const STYLE_ID =
    "jumanji-chaos-styles";

  const MAX_ANIMALS =
    180;

  const START_INTERVAL =
    2500;

  const END_INTERVAL =
    180;


  // =========================================================
  // STATE
  // =========================================================

  let active =
    false;

  let finished =
    false;

  let animals =
    [];

  let animationFrame =
    null;

  let nextSpawnAt =
    0;

  let lastTime =
    0;


  // =========================================================
  // CREATE STYLES
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
      @keyframes jumanji-chaos-shake {

        0% {
          transform: rotate(-5deg) scale(1);
        }

        100% {
          transform: rotate(5deg) scale(1.04);
        }

      }

      @keyframes jumanji-title-pulse {

        0% {
          transform: scale(1);
        }

        100% {
          transform: scale(1.04);
        }

      }

      #jumanji-chaos-overlay button {
        -webkit-tap-highlight-color: transparent;
      }
    `;

    document.head.appendChild(
      style
    );
  }


  // =========================================================
  // CREATE FULL SCREEN OVERLAY
  // =========================================================

  function createOverlay() {

    let overlay =
      document.getElementById(
        OVERLAY_ID
      );

    if (overlay) {
      return overlay;
    }

    overlay =
      document.createElement(
        "div"
      );

    overlay.id =
      OVERLAY_ID;


    /*
      THIS IS THE IMPORTANT PART.

      The overlay covers the ENTIRE browser window.
      It receives pointer events so nothing underneath
      can accidentally be pressed.
    */

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
      Swallow clicks/taps that happen on the
      black background instead of allowing them
      to reach the website underneath.
    */

    overlay.addEventListener(
      "click",
      event => {

        event.preventDefault();

        event.stopPropagation();

      },
      true
    );


    /*
      Also swallow pointer events on the
      background itself.
    */

    overlay.addEventListener(
      "pointerdown",
      event => {

        if (
          event.target ===
          overlay
        ) {

          event.preventDefault();

          event.stopPropagation();
        }

      },
      true
    );


    document.body.appendChild(
      overlay
    );


    return overlay;
  }


  // =========================================================
  // JUNGLE MADNESS TITLE
  // =========================================================

  function createTitle(
    overlay
  ) {

    const title =
      document.createElement(
        "div"
      );

    title.id =
      "jumanji-madness-title";

    title.textContent =
      "JUNGLE MADNESS";

    title.style.cssText = `
      position: absolute;

      top: 12px;
      left: 0;
      width: 100%;

      text-align: center;

      color: #ffffff;

      font-family:
        Impact,
        "Arial Black",
        sans-serif;

      font-size:
        clamp(2rem, 8vw, 5rem);

      font-weight: 900;

      letter-spacing:
        0.08em;

      line-height: 1;

      pointer-events: none;

      user-select: none;
      -webkit-user-select: none;

      text-shadow:
        4px 4px 0 #222,
        0 0 15px rgba(255,255,255,.35);

      animation:
        jumanji-title-pulse
        .35s
        infinite
        alternate;

      z-index: 100000;
    `;

    overlay.appendChild(
      title
    );
  }


  // =========================================================
  // RANDOM NUMBER
  // =========================================================

  function random(
    min,
    max
  ) {

    return (
      Math.random() *
      (max - min) +
      min
    );
  }


  // =========================================================
  // SPAWN SPEED
  // =========================================================

  function getSpawnInterval(
    progress
  ) {

    const eased =
      Math.pow(
        progress,
        1.8
      );

    return (
      START_INTERVAL -
      (
        START_INTERVAL -
        END_INTERVAL
      ) *
      eased
    );
  }


  // =========================================================
  // SPAWN ONE ANIMAL
  // =========================================================

  function spawnAnimal(
    progress
  ) {

    if (!active) {
      return;
    }

    if (
      animals.length >=
      MAX_ANIMALS
    ) {
      return;
    }

    const overlay =
      document.getElementById(
        OVERLAY_ID
      );

    if (!overlay) {
      return;
    }


    const animal =
      document.createElement(
        "button"
      );

    animal.type =
      "button";

    animal.textContent =
      ANIMALS[
        Math.floor(
          Math.random() *
          ANIMALS.length
        )
      ];


    const size =
      Math.round(
        random(30, 65)
      );


    animal.style.cssText = `
      position: absolute;

      left: 0;
      top: 0;

      padding: 0;
      margin: 0;

      border: 0;

      background:
        transparent;

      color: inherit;

      font-size:
        ${size}px;

      line-height: 1;

      cursor: crosshair;

      pointer-events: auto;

      user-select: none;
      -webkit-user-select: none;

      touch-action: none;

      z-index: 50000;

      -webkit-tap-highlight-color:
        transparent;
    `;


    const record = {

      element:
        animal,

      x:
        random(
          0,
          Math.max(
            1,
            window.innerWidth - 70
          )
        ),

      y:
        random(
          70,
          Math.max(
            71,
            window.innerHeight - 70
          )
        ),

      vx:
        random(
          -0.18,
          0.18
        ) *
        (1 + progress * 3),

      vy:
        random(
          -0.18,
          0.18
        ) *
        (1 + progress * 3),

      rotation:
        random(
          0,
          360
        ),

      rotationSpeed:
        random(
          -0.08,
          0.08
        ),

      wobble:
        random(
          1,
          4
        ),

      phase:
        random(
          0,
          Math.PI * 2
        ),

      wobbleSpeed:
        random(
          0.001,
          0.004
        )
    };


    // =======================================================
    // TAP ANIMAL = REMOVE IT
    // =======================================================

    animal.addEventListener(
      "pointerdown",
      event => {

        event.preventDefault();

        event.stopPropagation();

        animal.remove();

        animals =
          animals.filter(
            item =>
              item !== record
          );
      },
      true
    );


    animal.addEventListener(
      "click",
      event => {

        event.preventDefault();

        event.stopPropagation();

      },
      true
    );


    overlay.appendChild(
      animal
    );

    animals.push(
      record
    );
  }


  // =========================================================
  // SCHEDULE NEXT SPAWN
  // =========================================================

  function scheduleNextSpawn(
    progress
  ) {

    if (!active) {
      return;
    }

    const interval =
      getSpawnInterval(
        progress
      );

    nextSpawnAt =
      Date.now() +
      interval;
  }


  // =========================================================
  // PROCESS SPAWNING
  // =========================================================

  function processSpawning(
    progress
  ) {

    if (!active) {
      return;
    }

    const now =
      Date.now();

    if (
      now <
      nextSpawnAt
    ) {
      return;
    }


    spawnAnimal(
      progress
    );


    /*
      Starts getting ridiculous
      around the final quarter.
    */

    if (
      progress > 0.75 &&
      Math.random() < 0.35
    ) {

      spawnAnimal(
        progress
      );
    }


    if (
      progress > 0.90 &&
      Math.random() < 0.45
    ) {

      spawnAnimal(
        progress
      );
    }


    scheduleNextSpawn(
      progress
    );
  }


  // =========================================================
  // ANIMATE
  // =========================================================

  function animate(
    timestamp
  ) {

    if (!active) {
      return;
    }

    if (!lastTime) {

      lastTime =
        timestamp;
    }

    const delta =
      Math.min(
        timestamp -
        lastTime,
        40
      );

    lastTime =
      timestamp;


    const width =
      window.innerWidth;

    const height =
      window.innerHeight;


    animals.forEach(
      animal => {

        animal.phase +=
          animal.wobbleSpeed *
          delta;

        animal.x +=
          animal.vx *
          delta;

        animal.y +=
          animal.vy *
          delta;


        const wobbleX =
          Math.sin(
            animal.phase
          ) *
          animal.wobble;

        const wobbleY =
          Math.cos(
            animal.phase *
            0.8
          ) *
          animal.wobble;


        animal.rotation +=
          animal.rotationSpeed *
          delta;


        // ---------------------------------------------------
        // BOUNCE
        // ---------------------------------------------------

        if (
          animal.x < -50 ||
          animal.x > width + 20
        ) {

          animal.vx *= -1;
        }


        if (
          animal.y < 50 ||
          animal.y > height + 20
        ) {

          animal.vy *= -1;
        }


        animal.x =
          Math.max(
            -50,
            Math.min(
              width + 20,
              animal.x
            )
          );

        animal.y =
          Math.max(
            50,
            Math.min(
              height + 20,
              animal.y
            )
          );


        animal.element.style.transform =
          `
            translate(
              ${animal.x + wobbleX}px,
              ${animal.y + wobbleY}px
            )
            rotate(
              ${animal.rotation}deg
            )
          `;
      }
    );


    animationFrame =
      requestAnimationFrame(
        animate
      );
  }


  // =========================================================
  // BIG MESSAGE
  // =========================================================

  function showMessage(
    text,
    isLoss
  ) {

    const overlay =
      document.getElementById(
        OVERLAY_ID
      );

    if (!overlay) {
      return;
    }


    const message =
      document.createElement(
        "div"
      );

    message.style.cssText = `
      position: fixed;

      inset: 0;

      display: flex;

      align-items: center;
      justify-content: center;

      text-align: center;

      pointer-events: none;

      padding: 20px;

      font-family:
        Impact,
        "Arial Black",
        sans-serif;

      font-size:
        clamp(3rem, 11vw, 8rem);

      font-weight: 900;

      line-height: .95;

      color: #f5d76e;

      text-shadow:
        5px 5px 0 #c084fc,
        10px 10px 0 #120b18,
        0 0 30px rgba(255,255,255,.8);

      z-index: 200000;

      animation:
        jumanji-chaos-shake
        .12s
        infinite
        alternate;
    `;

    message.textContent =
      text;

    overlay.appendChild(
      message
    );


    if (isLoss) {

      setTimeout(
        stopGame,
        5000
      );

    } else {

      setTimeout(
        stopGame,
        3000
      );
    }
  }


  // =========================================================
  // START
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

    lastTime =
      0;


    injectStyles();


    const overlay =
      createOverlay();


    overlay.innerHTML =
      "";


    /*
      JUNGLE MADNESS
      appears immediately.
    */

    createTitle(
      overlay
    );


    /*
      One lonely animal
      begins the madness.
    */

    spawnAnimal(
      0
    );


    scheduleNextSpawn(
      0
    );


    animationFrame =
      requestAnimationFrame(
        animate
      );
  }


  // =========================================================
  // STOP
  // =========================================================

  function stopGame() {

    active =
      false;


    if (animationFrame) {

      cancelAnimationFrame(
        animationFrame
      );

      animationFrame =
        null;
    }


    const overlay =
      document.getElementById(
        OVERLAY_ID
      );

    if (overlay) {

      overlay.remove();
    }


    animals =
      [];

    finished =
      false;

    lastTime =
      0;
  }


  // =========================================================
  // GAME OVER
  // =========================================================

  function finishGame() {

    if (finished) {
      return;
    }

    finished =
      true;

    active =
      false;


    if (animationFrame) {

      cancelAnimationFrame(
        animationFrame
      );

      animationFrame =
        null;
    }


    /*
      If even ONE animal survives:
      YOU GOT JUMANJI'D.
    */

    if (
      animals.length > 0
    ) {

      showMessage(
        "YOU GOT JUMANJI'D",
        true
      );

    } else {

      showMessage(
        "YOU ESCAPED JUMANJI",
        false
      );

    }
  }


  // =========================================================
  // CHECK PLAYER
  // =========================================================

  function checkJumanji() {

    const player =
      window.rizneyPlayer;


    if (
      !player ||
      typeof player.getVideoData !==
        "function"
    ) {

      return;
    }


    let videoId =
      "";


    try {

      const data =
        player.getVideoData();

      if (data) {

        videoId =
          String(
            data.video_id ||
            ""
          );
      }

    } catch (error) {

      return;
    }


    // =======================================================
    // NOT JUMANJI
    // =======================================================

    if (
      videoId !==
      JUMANJI_VIDEO_ID
    ) {

      if (active) {

        stopGame();
      }

      return;
    }


    // =======================================================
    // START
    // =======================================================

    if (
      !active &&
      !finished
    ) {

      startGame();
    }


    if (!active) {
      return;
    }


    // =======================================================
    // GET TIME
    // =======================================================

    let currentTime =
      0;

    let duration =
      0;


    try {

      if (
        typeof player.getCurrentTime ===
          "function"
      ) {

        currentTime =
          player.getCurrentTime();
      }


      if (
        typeof player.getDuration ===
          "function"
      ) {

        duration =
          player.getDuration();
      }

    } catch (error) {

      return;
    }


    if (
      !duration ||
      duration <= 0
    ) {

      return;
    }


    const progress =
      Math.max(
        0,
        Math.min(
          1,
          currentTime /
          duration
        )
      );


    // =======================================================
    // SPAWN ANIMALS
    // =======================================================

    processSpawning(
      progress
    );


    // =======================================================
    // SONG FINISHED
    // =======================================================

    if (
      currentTime >=
      duration - 0.7
    ) {

      finishGame();
    }
  }


  // =========================================================
  // INITIALIZE
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
