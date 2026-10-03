
/* =========================================================
   JUMANJI'D — JUMANJI CHAOS
   One-song stupid minigame.
   No points. No health. No cookies. No unlocks.
   ========================================================= */

(() => {
  "use strict";

  const JUMANJI_VIDEO_ID = "FOeZaZRRRZ0";

  const GAME_ID = "jumanji-chaos";

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
    "🐊",
    "🐢",
    "🐸",
    "🦅",
    "🦉",
    "🦜",
    "🐙",
    "🦈",
    "🐳",
    "🐬",
    "🦀",
    "🦋",
    "🐝",
    "🐞",
    "🐌",
    "🕷️",
    "🦂",
    "🦘",
    "🦥",
    "🦦",
    "🦔",
    "🦨",
    "🦩",
    "🐧",
    "🐪",
    "🐫",
    "🐿️"
  ];

  let game = null;
  let animals = [];
  let animationFrame = null;
  let lastFrameTime = 0;
  let lastSpawnTime = 0;
  let playerIsPlaying = false;


  // =========================================================
  // CREATE GAME
  // =========================================================

  function createGame() {

    if (document.getElementById(GAME_ID)) {
      game = document.getElementById(GAME_ID);
      return;
    }

    game = document.createElement("div");

    game.id = GAME_ID;

    game.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      pointer-events: none;
      z-index: 50000;
    `;

    document.body.appendChild(game);
  }


  // =========================================================
  // SPAWN ANIMAL
  // =========================================================

  function spawnAnimal(progress) {

    if (!game) return;

    /*
      Keep the browser from getting absolutely murdered.
      180 animals is already plenty stupid.
    */

    if (animals.length >= 180) {
      return;
    }

    const animal =
      document.createElement("button");

    animal.type = "button";

    animal.textContent =
      ANIMALS[
        Math.floor(
          Math.random() * ANIMALS.length
        )
      ];

    const size =
      28 +
      Math.random() * 34;

    const maxX =
      Math.max(
        10,
        window.innerWidth - size
      );

    const maxY =
      Math.max(
        10,
        window.innerHeight - size
      );

    const x =
      Math.random() * maxX;

    const y =
      Math.random() * maxY;


    /*
      Faster movement as the song progresses.
    */

    const speed =
      0.25 +
      progress * 1.8;


    const angle =
      Math.random() *
      Math.PI *
      2;


    const velocity =
      speed *
      (0.6 + Math.random() * 1.4);


    const animalData = {

      element: animal,

      x,
      y,

      vx:
        Math.cos(angle) *
        velocity,

      vy:
        Math.sin(angle) *
        velocity,

      size,

      rotation:
        Math.random() * 360,

      rotationSpeed:
        -2 +
        Math.random() * 4,

      wobble:
        10 +
        Math.random() * 30,

      wobbleSpeed:
        0.001 +
        Math.random() * 0.003,

      phase:
        Math.random() *
        Math.PI *
        2

    };


    animal.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;

      width: ${size}px;
      height: ${size}px;

      padding: 0;
      margin: 0;

      border: none;
      background: transparent;

      font-size: ${size}px;
      line-height: 1;

      cursor: pointer;

      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;

      pointer-events: auto;

      transform:
        translate3d(
          ${x}px,
          ${y}px,
          0
        )
        rotate(${animalData.rotation}deg);
    `;


    // =======================================================
    // TAP / CLICK
    // =======================================================

    animal.addEventListener(
      "click",
      () => {

        animal.remove();

        animals =
          animals.filter(
            item =>
              item !== animalData
          );
      }
    );


    game.appendChild(animal);

    animals.push(animalData);
  }


  // =========================================================
  // REMOVE EVERYTHING
  // =========================================================

  function clearAnimals() {

    animals.forEach(item => {

      if (item.element) {
        item.element.remove();
      }

    });

    animals = [];
  }


  // =========================================================
  // DESTROY GAME
  // =========================================================

  function destroyGame() {

    if (animationFrame) {

      cancelAnimationFrame(
        animationFrame
      );

      animationFrame =
        null;
    }

    clearAnimals();

    if (game) {

      game.remove();

      game =
        null;
    }

    lastFrameTime = 0;
    lastSpawnTime = 0;
    playerIsPlaying = false;
  }


  // =========================================================
  // ANIMATION
  // =========================================================

  function animate(timestamp) {

    if (!game) {
      return;
    }

    if (!lastFrameTime) {
      lastFrameTime = timestamp;
    }

    const delta =
      Math.min(
        timestamp - lastFrameTime,
        40
      );

    lastFrameTime =
      timestamp;


    const player =
      window.rizneyPlayer;


    let currentTime = 0;
    let duration = 300;


    if (
      player &&
      typeof player.getCurrentTime ===
        "function"
    ) {

      try {

        currentTime =
          player.getCurrentTime();

        duration =
          player.getDuration() ||
          300;

      } catch (e) {}

    }


    const progress =
      Math.max(
        0,
        Math.min(
          1,
          currentTime / duration
        )
      );


    // =======================================================
    // SPAWN RATE
    // =======================================================

    /*
      Beginning:
        roughly one animal every 2.5 seconds.

      End:
        roughly one animal every 0.2 seconds.

      The closer we get to the end,
      the dumber everything gets.
    */

    const spawnInterval =
      2500 -
      (
        2300 *
        Math.pow(
          progress,
          1.5
        )
      );


    if (
      playerIsPlaying &&
      timestamp - lastSpawnTime >=
        spawnInterval
    ) {

      lastSpawnTime =
        timestamp;


      /*
        Near the end, sometimes throw
        multiple animals into the madness.
      */

      let spawnCount = 1;

      if (progress > 0.75) {
        spawnCount = 2;
      }

      if (progress > 0.9) {
        spawnCount = 3;
      }

      if (progress > 0.97) {
        spawnCount = 5;
      }


      for (
        let i = 0;
        i < spawnCount;
        i++
      ) {

        spawnAnimal(progress);
      }
    }


    // =======================================================
    // MOVE ANIMALS
    // =======================================================

    if (playerIsPlaying) {

      const movementMultiplier =
        0.6 +
        progress * 2.0;


      animals.forEach(item => {

        item.x +=
          item.vx *
          delta *
          movementMultiplier;

        item.y +=
          item.vy *
          delta *
          movementMultiplier;


        /*
          Weird little wobble.
        */

        const wobble =
          Math.sin(
            timestamp *
              item.wobbleSpeed +
              item.phase
          ) *
          item.wobble *
          0.02;


        item.x +=
          wobble;


        item.y +=
          Math.cos(
            timestamp *
              item.wobbleSpeed +
              item.phase
          ) *
          0.02;


        /*
          Spin faster as the song approaches
          complete JUMANJI insanity.
        */

        item.rotation +=
          item.rotationSpeed *
          movementMultiplier;


        const size =
          item.size;


        /*
          Bounce around the screen.
        */

        if (
          item.x <= 0 ||
          item.x >=
            window.innerWidth - size
        ) {

          item.vx *= -1;

          item.x =
            Math.max(
              0,
              Math.min(
                item.x,
                window.innerWidth - size
              )
            );
        }


        if (
          item.y <= 0 ||
          item.y >=
            window.innerHeight - size
        ) {

          item.vy *= -1;

          item.y =
            Math.max(
              0,
              Math.min(
                item.y,
                window.innerHeight - size
              )
            );
        }


        item.element.style.transform =
          `
          translate3d(
            ${item.x}px,
            ${item.y}px,
            0
          )
          rotate(
            ${item.rotation}deg
          )
          `;
      });
    }


    animationFrame =
      requestAnimationFrame(
        animate
      );
  }


  // =========================================================
  // CHECK YOUTUBE
  // =========================================================

  function checkPlayer() {

    const player =
      window.rizneyPlayer;


    if (
      !player ||
      typeof player.getVideoData !==
        "function"
    ) {

      return;
    }


    let videoId = "";


    try {

      const data =
        player.getVideoData();

      videoId =
        data &&
        data.video_id
          ? String(data.video_id)
          : "";

    } catch (e) {

      return;
    }


    let state = -1;


    if (
      typeof player.getPlayerState ===
        "function"
    ) {

      try {

        state =
          player.getPlayerState();

      } catch (e) {}
    }


    const isJumanji =
      videoId ===
      JUMANJI_VIDEO_ID;


    const isPlaying =
      typeof YT !== "undefined" &&
      YT.PlayerState &&
      state ===
        YT.PlayerState.PLAYING;


    // =======================================================
    // NOT JUMANJI
    // =======================================================

    if (!isJumanji) {

      if (game) {
        destroyGame();
      }

      return;
    }


    // =======================================================
    // JUMANJI
    // =======================================================

    if (!game) {

      createGame();

      lastFrameTime = 0;
      lastSpawnTime = 0;

      /*
        A tiny starting delay so the first animal
        doesn't appear instantly.
      */

      setTimeout(() => {

        if (game) {
          spawnAnimal(0);
        }

      }, 1200);


      animationFrame =
        requestAnimationFrame(
          animate
        );
    }


    playerIsPlaying =
      isPlaying;


    // =======================================================
    // SONG ENDED
    // =======================================================

    if (
      typeof YT !== "undefined" &&
      YT.PlayerState &&
      state ===
        YT.PlayerState.ENDED
    ) {

      destroyGame();
    }
  }


  // =========================================================
  // START MONITOR
  // =========================================================

  function init() {

    setInterval(
      checkPlayer,
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
