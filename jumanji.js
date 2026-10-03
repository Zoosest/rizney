/* =========================================================
   JUMANJI CHAOS
   "YOU GOT JUMANJI'D!"
   "JUNGLE MADNESS"
   ========================================================= */

(() => {
  "use strict";

  // =========================================================
  // JUMANJI VIDEO
  // =========================================================

  const JUMANJI_VIDEO_ID =
    "FOeZaZRRRZ0";


  // =========================================================
  // SOUND EFFECTS
  // =========================================================

  const JUMANJI_SOUND =
    "./assets/jumanji.mp3";

  const BOOM_SOUND =
    "./assets/boom.mp3";

  const F_N_BOOM_SOUND =
    "./assets/f-n-boom.mp3";


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
  // COMPLETELY UNNECESSARY INTRUDERS
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

  const JUMANJI_SOUND_DELAY =
    3000;


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

  let jumanjiSoundTimer =
    null;


  // =========================================================
  // AUDIO
  // =========================================================

  function playSound(
    path
  ) {

    try {

      const sound =
        new Audio(path);

      sound.volume =
        1.0;

      sound.currentTime =
        0;

      sound.play().catch(
        error => {

          console.log(
            "Jumanji sound could not play:",
            error
          );

        }
      );

    } catch (error) {

      console.log(
        "Could not create Jumanji sound:",
        error
      );
    }
  }


  // =========================================================
  // JUMANJI INTRO VOICE
  // =========================================================

  function playJumanjiVoice() {

    if (!active) {
      return;
    }

    playSound(
      JUMANJI_SOUND
    );
  }


  // =========================================================
  // HIT SOUND
  // =========================================================

  function playHitSound() {

    const roll =
      Math.random();


    /*
      10% = FUCKING BOOM
      25% = regular BOOM
      65% = silence
    */

    if (
      roll < 0.10
    ) {

      playSound(
        F_N_BOOM_SOUND
      );

      return;
    }


    if (
      roll < 0.35
    ) {

      playSound(
        BOOM_SOUND
      );

      return;
    }

    // The remaining 65% intentionally
    // makes absolutely no sound.
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

      @keyframes jumanji-pulse {

        0% {
          transform: scale(1);
        }

        100% {
          transform: scale(1.04);
        }

      }


      @keyframes jumanji-shake {

        0% {
          transform: rotate(-4deg);
        }

        100% {
          transform: rotate(4deg);
        }

      }


      @keyframes jumanji-boom {

        0% {
          transform:
            translate(-50%, -50%)
            scale(.4)
            rotate(-8deg);

          opacity: 0;
        }

        20% {
          transform:
            translate(-50%, -50%)
            scale(1.35)
            rotate(5deg);

          opacity: 1;
        }

        100% {
          transform:
            translate(-50%, -50%)
            scale(1)
            rotate(0deg);

          opacity: 0;
        }

      }


      #jumanji-chaos-overlay button {
        -webkit-tap-highlight-color:
          transparent;
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
      THE WEBSITE IS NOW GONE.

      Nothing underneath can be touched.
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
      Eat background clicks.
    */

    overlay.addEventListener(
      "click",
      event => {

        event.preventDefault();
        event.stopPropagation();

      },
      true
    );


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
  // TOP TITLE
  // =========================================================

  function createTopTitle(
    overlay
  ) {

    const title =
      document.createElement(
        "div"
      );


    title.textContent =
      "YOU GOT JUMANJI'D!";


    title.style.cssText = `
      position: absolute;

      top: 10px;
      left: 0;

      width: 100%;

      text-align: center;

      color: #228b22;

      font-family:
        Impact,
        "Arial Black",
        sans-serif;

      font-size:
        clamp(1.8rem, 7vw, 5rem);

      font-weight: 900;

      letter-spacing:
        0.06em;

      line-height: 1;

      pointer-events: none;

      z-index: 100000;

      text-shadow:
        3px 3px 0 #063d06,
        0 0 15px #228b22;

      animation:
        jumanji-pulse
        .4s
        infinite
        alternate;
    `;


    overlay.appendChild(
      title
    );
  }


  // =========================================================
  // BOTTOM TITLE
  // =========================================================

  function createBottomTitle(
    overlay
  ) {

    const title =
      document.createElement(
        "div"
      );


    title.textContent =
      "JUNGLE MADNESS";


    title.style.cssText = `
      position: absolute;

      bottom: 12px;
      left: 0;

      width: 100%;

      text-align: center;

      color: #228b22;

      font-family:
        Impact,
        "Arial Black",
        sans-serif;

      font-size:
        clamp(1.8rem, 7vw, 5rem);

      font-weight: 900;

      letter-spacing:
        0.08em;

      line-height: 1;

      pointer-events: none;

      z-index: 100000;

      text-shadow:
        3px 3px 0 #063d06,
        0 0 15px #228b22;

      animation:
        jumanji-pulse
        .35s
        infinite
        alternate;
    `;


    overlay.appendChild(
      title
    );
  }


  // =========================================================
  // BOOM TEXT
  // =========================================================

  function showBoom(
    x,
    y
  ) {

    const overlay =
      document.getElementById(
        OVERLAY_ID
      );


    if (!overlay) {
      return;
    }


    const boom =
      document.createElement(
        "div"
      );


    boom.textContent =
      "BOOM";


    boom.style.cssText = `
      position: absolute;

      left:
        ${x}px;

      top:
        ${y}px;

      color:
        #228b22;

      font-family:
        Impact,
        "Arial Black",
        sans-serif;

      font-size:
        clamp(2.5rem, 10vw, 7rem);

      font-weight:
        900;

      line-height:
        1;

      pointer-events:
        none;

      z-index:
        150000;

      white-space:
        nowrap;

      text-shadow:
        5px 5px 0 #063d06,
        0 0 20px #228b22;

      animation:
        jumanji-boom
        .55s
        ease-out
        forwards;
    `;


    overlay.appendChild(
      boom
    );


    setTimeout(
      () => {

        boom.remove();

      },
      600
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
  // SPAWN ANIMAL
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


    // -------------------------------------------------------
    // OCCASIONAL GIANT ANIMAL
    // -------------------------------------------------------

    let size =
      Math.round(
        random(
          30,
          65
        )
      );


    if (
      Math.random() <
      0.045
    ) {

      size =
        Math.round(
          random(
            100,
            180
          )
        );
    }


    animal.style.cssText = `
      position:
        absolute;

      left:
        0;

      top:
        0;

      padding:
        0;

      margin:
        0;

      border:
        0;

      background:
        transparent;

      color:
        inherit;

      font-size:
        ${size}px;

      line-height:
        1;

      cursor:
        crosshair;

      pointer-events:
        auto;

      user-select:
        none;

      -webkit-user-select:
        none;

      touch-action:
        none;

      z-index:
        50000;

      -webkit-tap-highlight-color:
        transparent;
    `;


    const weird =
      Math.random() <
      0.12;


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
        ),

      weird:
        weird,

      weirdPhase:
        random(
          0,
          Math.PI * 2
        )
    };


    // =======================================================
    // HIT ANIMAL
    // =======================================================

    animal.addEventListener(
      "pointerdown",
      event => {

        event.preventDefault();
        event.stopPropagation();


        /*
          Capture the position BEFORE
          removing the animal.
        */

        const boomX =
          record.x +
          20;

        const boomY =
          record.y +
          20;


        animal.remove();


        animals =
          animals.filter(
            item =>
              item !== record
          );


        /*
          Every successful hit gets
          the visual BOOM.
        */

        showBoom(
          boomX,
          boomY
        );


        /*
          Sound is randomized separately.
        */

        playHitSound();

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
  // RANDOM INTRUDER
  // =========================================================

  function spawnIntruder() {

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
      INTRUDERS[
        Math.floor(
          Math.random() *
          INTRUDERS.length
        )
      ];


    const size =
      Math.round(
        random(
          45,
          95
        )
      );


    animal.style.cssText = `
      position:
        absolute;

      left:
        0;

      top:
        0;

      padding:
        0;

      margin:
        0;

      border:
        0;

      background:
        transparent;

      font-size:
        ${size}px;

      line-height:
        1;

      pointer-events:
        auto;

      touch-action:
        none;

      user-select:
        none;

      -webkit-user-select:
        none;

      cursor:
        crosshair;

      z-index:
        60000;
    `;


    const record = {

      element:
        animal,

      x:
        random(
          0,
          window.innerWidth - 60
        ),

      y:
        random(
          70,
          window.innerHeight - 100
        ),

      vx:
        random(
          -0.7,
          0.7
        ),

      vy:
        random(
          -0.7,
          0.7
        ),

      rotation:
        random(
          0,
          360
        ),

      rotationSpeed:
        random(
          -0.2,
          0.2
        ),

      wobble:
        random(
          2,
          7
        ),

      phase:
        random(
          0,
          Math.PI * 2
        ),

      wobbleSpeed:
        random(
          0.004,
          0.01
        )
    };


    animal.addEventListener(
      "pointerdown",
      event => {

        event.preventDefault();
        event.stopPropagation();


        const boomX =
          record.x +
          20;

        const boomY =
          record.y +
          20;


        animal.remove();


        animals =
          animals.filter(
            item =>
              item !== record
          );


        showBoom(
          boomX,
          boomY
        );


        playHitSound();

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


    // -------------------------------------------------------
    // MORE CHAOS
    // -------------------------------------------------------

    if (
      progress > 0.65 &&
      Math.random() < 0.25
    ) {

      spawnAnimal(
        progress
      );
    }


    if (
      progress > 0.80 &&
      Math.random() < 0.45
    ) {

      spawnAnimal(
        progress
      );
    }


    if (
      progress > 0.90 &&
      Math.random() < 0.65
    ) {

      spawnAnimal(
        progress
      );
    }


    // -------------------------------------------------------
    // RANDOM STUPID INTRUDER
    // -------------------------------------------------------

    if (
      progress > 0.55 &&
      Math.random() < 0.08
    ) {

      spawnIntruder();
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


    /*
      The final part of the song
      gets increasingly ridiculous.
    */

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


        // ---------------------------------------------------
        // WEIRD MOVEMENT
        // ---------------------------------------------------

        if (
          animal.weird
        ) {

          animal.weirdPhase +=
            0.01 *
            delta;


          animal.x +=
            Math.sin(
              animal.weirdPhase
            ) *
            1.5;


          animal.y +=
            Math.cos(
              animal.weirdPhase *
              1.7
            ) *
            1.5;
        }


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
          animal.x < -60 ||
          animal.x > width + 20
        ) {

          animal.vx *= -1;
        }


        if (
          animal.y < 55 ||
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
            55,
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
  // BIG END MESSAGE
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


    message.textContent =
      text;


    message.style.cssText = `
      position:
        fixed;

      inset:
        0;

      display:
        flex;

      align-items:
        center;

      justify-content:
        center;

      text-align:
        center;

      pointer-events:
        none;

      padding:
        20px;

      font-family:
        Impact,
        "Arial Black",
        sans-serif;

      font-size:
        clamp(
          3rem,
          11vw,
          8rem
        );

      font-weight:
        900;

      line-height:
        .95;

      color:
        #228b22;

      text-shadow:
        5px 5px 0 #063d06,
        10px 10px 0 #000000,
        0 0 30px #228b22;

      z-index:
        200000;

      animation:
        jumanji-shake
        .12s
        infinite
        alternate;
    `;


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


    createTopTitle(
      overlay
    );


    createBottomTitle(
      overlay
    );


    /*
      One lonely animal.

      It has no idea what's coming.
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


    /*
      Three seconds into the game:

      "haha you got JUMANJI'D"

      Your voice.
    */

    clearTimeout(
      jumanjiSoundTimer
    );


    jumanjiSoundTimer =
      setTimeout(
        playJumanjiVoice,
        JUMANJI_SOUND_DELAY
      );
  }


  // =========================================================
  // STOP
  // =========================================================

  function stopGame() {

    active =
      false;


    clearTimeout(
      jumanjiSoundTimer
    );


    jumanjiSoundTimer =
      null;


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
  // FINISH
  // =========================================================

  function finishGame() {

    if (finished) {
      return;
    }


    finished =
      true;

    active =
      false;


    clearTimeout(
      jumanjiSoundTimer
    );


    jumanjiSoundTimer =
      null;


    if (animationFrame) {

      cancelAnimationFrame(
        animationFrame
      );

      animationFrame =
        null;
    }


    /*
      If ANY animals remain...

      YOU GOT JUMANJI'D!
    */

    if (
      animals.length > 0
    ) {

      showMessage(
        "YOU GOT JUMANJI'D!",
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
    // PLAYER TIME
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
    // SPAWN
    // =======================================================

    processSpawning(
      progress
    );


    // =======================================================
    // SONG END
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
