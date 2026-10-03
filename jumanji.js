Absolutely 😂. One file. One dumb game. Brick by brick.
For this version, you lose when the Jumanji song ends and there are still animals on screen. Then it flashes:
YOU GOT JUMANJI'D
If you manage to tap every animal before the song ends, you escape the chaos.
Paste this into a new GitHub file named jumanji.js:
Writing
/* =========================================================
   JUMANJI CHAOS
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

  const MIN_SPAWN_INTERVAL = 220;
  const MAX_SPAWN_INTERVAL = 2600;

  const MAX_ANIMALS = 180;

  const OVERLAY_ID = "jumanji-chaos-overlay";


  // =========================================================
  // STATE
  // =========================================================

  let active = false;

  let animals = [];

  let spawnTimer = null;

  let animationFrame = null;

  let lastTime = 0;

  let lastProgressCheck = 0;

  let gameFinished = false;


  // =========================================================
  // CREATE OVERLAY
  // =========================================================

  function createOverlay() {

    if (
      document.getElementById(
        OVERLAY_ID
      )
    ) {
      return;
    }

    const overlay =
      document.createElement("div");

    overlay.id =
      OVERLAY_ID;

    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      overflow: hidden;
      z-index: 2000;
    `;

    document.body.appendChild(
      overlay
    );
  }


  // =========================================================
  // REMOVE OVERLAY
  // =========================================================

  function removeOverlay() {

    const overlay =
      document.getElementById(
        OVERLAY_ID
      );

    if (overlay) {
      overlay.remove();
    }
  }


  // =========================================================
  // CLEAR ANIMALS
  // =========================================================

  function clearAnimals() {

    animals.forEach(animal => {

      if (animal.element) {
        animal.element.remove();
      }

    });

    animals = [];
  }


  // =========================================================
  // RANDOM NUMBER
  // =========================================================

  function random(min, max) {

    return (
      Math.random() *
      (max - min) +
      min
    );
  }


  // =========================================================
  // SPAWN INTERVAL
  //
  // Starts slow.
  // Gets ridiculous near the end.
  // =========================================================

  function getSpawnInterval(progress) {

    /*
      progress = 0 → beginning
      progress = 1 → end
    */

    const eased =
      Math.pow(progress, 1.7);

    return (
      MAX_SPAWN_INTERVAL -
      (
        MAX_SPAWN_INTERVAL -
        MIN_SPAWN_INTERVAL
      ) *
      eased
    );
  }


  // =========================================================
  // SPAWN ANIMAL
  // =========================================================

  function spawnAnimal(progress) {

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
      document.createElement("button");

    animal.type =
      "button";

    animal.textContent =
      ANIMALS[
        Math.floor(
          Math.random() *
          ANIMALS.length
        )
      ];


    animal.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      padding: 0;
      margin: 0;
      border: none;
      background: transparent;
      cursor: pointer;
      pointer-events: auto;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      font-size: ${Math.round(
        random(28, 58)
      )}px;
      line-height: 1;
      transform-origin: center center;
    `;


    /*
      Random starting position.
    */

    const width =
      window.innerWidth;

    const height =
      window.innerHeight;

    const x =
      random(
        0,
        Math.max(1, width - 60)
      );

    const y =
      random(
        0,
        Math.max(1, height - 60)
      );


    /*
      Movement becomes more ridiculous
      as the song progresses.
    */

    const speed =
      0.15 +
      progress * 0.9;


    const vx =
      random(-0.45, 0.45) *
      speed;

    const vy =
      random(-0.45, 0.45) *
      speed;


    const wobble =
      random(0.5, 2.5);

    const wobbleSpeed =
      random(0.001, 0.004);

    const rotationSpeed =
      random(-0.08, 0.08);


    const record = {

      element: animal,

      x,

      y,

      vx,

      vy,

      wobble,

      wobbleSpeed,

      rotation:
        random(0, 360),

      rotationSpeed,

      phase:
        random(0, Math.PI * 2)

    };


    /*
      Tapping an animal removes it.
    */

    animal.addEventListener(
      "click",
      event => {

        event.preventDefault();
        event.stopPropagation();

        animal.remove();

        animals =
          animals.filter(
            item =>
              item !== record
          );

      }
    );


    overlay.appendChild(
      animal
    );

    animals.push(
      record
    );
  }


  // =========================================================
  // SPAWN LOGIC
  // =========================================================

  function scheduleSpawn(progress) {

    clearTimeout(
      spawnTimer
    );

    if (!active) {
      return;
    }


    const interval =
      getSpawnInterval(
        progress
      );


    spawnTimer =
      setTimeout(
        () => {

          if (!active) {
            return;
          }


          /*
            Near the end, occasionally
            throw out little animal bursts.
          */

          if (
            progress > 0.75 &&
            Math.random() < 0.35
          ) {

            const burst =
              Math.min(
                3,
                MAX_ANIMALS -
                animals.length
              );


            for (
              let i = 0;
              i < burst;
              i++
            ) {

              spawnAnimal(
                progress
              );

            }

          } else {

            spawnAnimal(
              progress
            );

          }


          scheduleSpawn(
            progress
          );

        },
        interval
      );
  }


  // =========================================================
  // ANIMATION
  // =========================================================

  function animate(timestamp) {

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


        /*
          Weird floating motion.
        */

        const wobbleX =
          Math.sin(
            animal.phase
          ) *
          animal.wobble;


        const wobbleY =
          Math.cos(
            animal.phase * 0.8
          ) *
          animal.wobble;


        animal.rotation +=
          animal.rotationSpeed *
          delta;


        /*
          Bounce off the edges.
        */

        if (
          animal.x < -60 ||
          animal.x > width + 20
        ) {

          animal.vx *= -1;

        }


        if (
          animal.y < -60 ||
          animal.y > height + 20
        ) {

          animal.vy *= -1;

        }


        animal.x =
          Math.max(
            -60,
            Math.min(
              width + 20,
              animal.x
            )
          );


        animal.y =
          Math.max(
            -60,
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
  // YOU GOT JUMANJI'D
  // =========================================================

  function showJumanjiLoss() {

    gameFinished =
      true;

    active =
      false;


    clearTimeout(
      spawnTimer
    );


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

    if (!overlay) {
      return;
    }


    /*
      Make the remaining animals
      disappear behind the message.
    */

    const message =
      document.createElement("div");

    message.style.cssText = `
      position: fixed;
      inset: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      pointer-events: none;
      font-family: Impact, Arial Black, sans-serif;
      font-size: clamp(3rem, 11vw, 8rem);
      font-weight: 900;
      color: #f5d76e;
      text-shadow:
        5px 5px 0 #c084fc,
        10px 10px 0 #120b18,
        0 0 25px rgba(255,255,255,0.8);
      transform: rotate(-5deg);
      z-index: 9999;
      animation: jumanjiShake 0.12s infinite alternate;
    `;


    message.textContent =
      "YOU GOT JUMANJI'D";


    overlay.appendChild(
      message
    );


    /*
      Keep the message up for
      a few seconds, then clean up.
    */

    setTimeout(
      () => {

        removeOverlay();

        clearAnimals();

        gameFinished =
          false;

      },
      5000
    );
  }


  // =========================================================
  // YOU ESCAPED
  // =========================================================

  function showEscapeMessage() {

    gameFinished =
      true;

    active =
      false;


    clearTimeout(
      spawnTimer
    );


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

    if (!overlay) {
      return;
    }


    const message =
      document.createElement("div");

    message.style.cssText = `
      position: fixed;
      inset: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      pointer-events: none;
      font-family: Georgia, serif;
      font-size: clamp(2.5rem, 9vw, 6rem);
      font-weight: bold;
      color: #51cf66;
      text-shadow:
        4px 4px 0 #120b18,
        0 0 25px rgba(81,207,102,0.8);
      z-index: 9999;
    `;


    message.textContent =
      "YOU ESCAPED JUMANJI";


    overlay.appendChild(
      message
    );


    setTimeout(
      () => {

        removeOverlay();

        gameFinished =
          false;

      },
      3000
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

    gameFinished =
      false;

    animals =
      [];

    lastTime =
      0;


    createOverlay();


    /*
      Start with just one animal.
    */

    spawnAnimal(0);


    /*
      Begin the gradual escalation.
    */

    scheduleSpawn(0);


    animationFrame =
      requestAnimationFrame(
        animate
      );
  }


  // =========================================================
  // STOP GAME
  // =========================================================

  function stopGame() {

    active =
      false;


    clearTimeout(
      spawnTimer
    );


    spawnTimer =
      null;


    if (animationFrame) {

      cancelAnimationFrame(
        animationFrame
      );

      animationFrame =
        null;
    }


    clearAnimals();

    removeOverlay();


    gameFinished =
      false;
  }


  // =========================================================
  // CHECK PLAYER / SONG
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
            data.video_id || ""
          );

      }

    } catch (e) {

      return;
    }


    /*
      Not Jumanji.
    */

    if (
      videoId !==
      JUMANJI_VIDEO_ID
    ) {

      if (active) {
        stopGame();
      }

      return;
    }


    /*
      Start the game.
    */

    if (
      !active &&
      !gameFinished
    ) {

      startGame();

    }


    if (!active) {
      return;
    }


    /*
      Get song progress.
    */

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

    } catch (e) {

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


    /*
      Re-schedule the spawn rate
      based on actual song progress.
    */

    if (
      Date.now() -
        lastProgressCheck >
      1000
    ) {

      lastProgressCheck =
        Date.now();


      scheduleSpawn(
        progress
      );


      /*
        Extra madness near the end.
      */

      if (
        progress > 0.90 &&
        animals.length <
          MAX_ANIMALS
      ) {

        spawnAnimal(
          progress
        );

      }

    }


    /*
      SONG IS OVER.
      If there are animals remaining,
      YOU GOT JUMANJI'D.
    */

    if (
      currentTime >=
        duration - 0.5
    ) {

      if (
        animals.length > 0
      ) {

        showJumanjiLoss();

      } else {

        showEscapeMessage();

      }

    }

  }


  // =========================================================
  // CSS ANIMATION
  // =========================================================

  function injectStyles() {

    if (
      document.getElementById(
        "jumanji-chaos-styles"
      )
    ) {

      return;
    }


    const style =
      document.createElement("style");


    style.id =
      "jumanji-chaos-styles";


    style.textContent = `
      @keyframes jumanjiShake {

        from {
          transform:
            rotate(-5deg)
            scale(1);
        }

        to {
          transform:
            rotate(5deg)
            scale(1.04);
        }

      }
    `;


    document.head.appendChild(
      style
    );
  }


  // =========================================================
  // INITIALIZATION
  // =========================================================

  function init() {

    injectStyles();


    /*
      Check frequently so the game
      follows whatever song is playing.
    */

    setInterval(
      checkJumanji,
      500
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
And that's the whole damn game. 😂
Your index.html only needs this at the bottom:
<script src="./main.js"></script>
<script src="./singles.js"></script>
<script src="./whack-a-track.js"></script>
<script src="./jumanji.js"></script>
So the flow is:
Jumanji starts → 🐒 → 🐍 → 🦁 → 🐘 → more → MORE → OH GOD → ANIMALS EVERYWHERE → song ends →
YOU GOT JUMANJI'D
And if you somehow clear the whole screen before the song finishes:
YOU ESCAPED JUMANJI
No cookies. No storage. No scoring system. No bullshit. 😸
