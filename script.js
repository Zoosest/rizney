(() => {
  const STORAGE_KEY = 'rizneyYouDontKnowTrackPoints';
  const STARTING_POINTS = 100;
  const ENTRY_COST = 25;
  const WIN_REWARD = 100;

  const SONG_MATCHERS = [
    /monkey judge/i,
    /monkey judge 🐒⚖/i,
    /monkey judge monkey jury/i,
    /song.*monkey.*judge/i
  ];

  const QUESTION = {
    prompt: "Fill in the blank: \"monkey judge monkey jury, ____\"",
    answers: [
      'Everyone in such a hurry.',
      'Monkeys are always so dirty.',
      'Everything is getting blurry.',
      'Getting so worried.'
    ],
    correctIndex: 0,
    title: 'Monkey Judge 🐒⚖'
  };

  const readPoints = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null || raw === '') {
        localStorage.setItem(STORAGE_KEY, String(STARTING_POINTS));
        return STARTING_POINTS;
      }

      const parsed = Number(raw);
      if (Number.isNaN(parsed)) {
        localStorage.setItem(STORAGE_KEY, String(STARTING_POINTS));
        return STARTING_POINTS;
      }

      return parsed;
    } catch (error) {
      return STARTING_POINTS;
    }
  };

  const writePoints = (value) => {
    const nextValue = Math.max(0, Number(value) || 0);
    try {
      localStorage.setItem(STORAGE_KEY, String(nextValue));
    } catch (error) {
      // no-op in private mode or blocked storage
    }
    updatePointsLabels();
    return nextValue;
  };

  const addPoints = (amount) => writePoints(readPoints() + amount);

  const currentNowPlayingText = () => {
    const nowPlaying = document.querySelector('#now-playing');
    if (!nowPlaying) return '';
    return (nowPlaying.textContent || '').replace(/\s+/g, ' ').trim();
  };

  const songIsActive = () => {
    const text = currentNowPlayingText();
    return SONG_MATCHERS.some((matcher) => matcher.test(text)) ||
      !!document.querySelector('.song.playing .song-title') &&
      SONG_MATCHERS.some((matcher) => matcher.test(document.querySelector('.song.playing .song-title').textContent || ''));
  };

  const updatePointsLabels = () => {
    const points = readPoints();
    document.querySelectorAll('[data-ydkt-points]').forEach((el) => {
      el.textContent = `Points: ${points}`;
    });
    document.querySelectorAll('[data-ydkt-score]').forEach((el) => {
      el.textContent = String(points);
    });
  };

  const injectStyles = () => {
    if (document.getElementById('ydkt-styles')) return;

    const style = document.createElement('style');
    style.id = 'ydkt-styles';
    style.textContent = `
      #ydkt-banner {
        position: sticky;
        top: 124px;
        z-index: 90;
        display: none;
        width: 100%;
        background: linear-gradient(180deg, rgba(17,9,22,1), rgba(32,17,44,1));
        border-top: 1px solid #d4af37;
        border-bottom: 1px solid #d4af37;
        box-shadow: 0 8px 20px rgba(0,0,0,0.5);
        color: #f5d76e;
        font-family: Georgia, "Times New Roman", serif;
        padding: 10px 16px;
      }

      #ydkt-banner.visible {
        display: block;
      }

      .ydkt-banner-inner {
        max-width: 980px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        flex-wrap: wrap;
      }

      .ydkt-banner-title {
        font-size: 0.82rem;
        letter-spacing: 0.14em;
        color: #c084fc;
        font-weight: 700;
      }

      .ydkt-banner-copy {
        font-size: 0.8rem;
        color: #f5d76e;
      }

      .ydkt-banner-button {
        border: 1px solid #d4af37;
        border-radius: 999px;
        padding: 8px 14px;
        background: #c084fc;
        color: #120b18;
        font-weight: 700;
        font-size: 0.78rem;
        cursor: pointer;
      }

      .ydkt-banner-button:hover {
        background: #dcabff;
      }

      .ydkt-points {
        font-size: 0.78rem;
        font-weight: 700;
        color: #f5d76e;
      }

      #ydkt-floating-btn {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 200;
        border: 2px solid #d4af37;
        border-radius: 999px;
        padding: 12px 18px;
        background: #c084fc;
        color: #120b18;
        font-weight: 700;
        font-family: Georgia, "Times New Roman", serif;
        box-shadow: 0 10px 24px rgba(192,132,252,0.45);
        cursor: pointer;
      }

      #ydkt-floating-btn:hover {
        background: #dcaeff;
      }

      #ydkt-modal {
        position: fixed;
        inset: 0;
        z-index: 300;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 18px;
        background: rgba(0,0,0,0.8);
      }

      #ydkt-modal.visible {
        display: flex;
      }

      .ydkt-modal-card {
        width: min(680px, 92vw);
        border: 2px solid #d4af37;
        border-radius: 16px;
        background: linear-gradient(180deg, #201120, #0e0912);
        box-shadow: 0 20px 50px rgba(0,0,0,0.7);
        padding: 20px 22px 18px;
        color: #f5d76e;
        font-family: Georgia, "Times New Roman", serif;
      }

      .ydkt-modal-card h3 {
        margin: 0 0 10px;
        text-align: center;
        color: #c084fc;
        letter-spacing: 0.12em;
      }

      .ydkt-modal-song {
        text-align: center;
        margin-bottom: 14px;
        font-weight: 700;
      }

      .ydkt-question {
        text-align: center;
        font-size: 1.05rem;
        line-height: 1.5;
        margin: 14px 0;
      }

      .ydkt-options {
        display: grid;
        gap: 10px;
      }

      .ydkt-option {
        border: 1px solid #c084fc;
        border-radius: 10px;
        background: #120b18;
        color: #f5d76e;
        padding: 12px 14px;
        text-align: left;
        cursor: pointer;
      }

      .ydkt-option:hover {
        background: #1d1222;
      }

      .ydkt-option.selected {
        background: #c084fc;
        color: #120b18;
      }

      .ydkt-option.correct {
        background: #2d9b53;
        border-color: #2d9b53;
        color: white;
      }

      .ydkt-option.incorrect {
        background: #b23a3a;
        border-color: #b23a3a;
        color: white;
      }

      .ydkt-actions {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 18px;
      }

      .ydkt-btn {
        border: 1px solid #d4af37;
        border-radius: 999px;
        background: #55208a;
        color: white;
        padding: 10px 16px;
        font-weight: 700;
        cursor: pointer;
      }

      .ydkt-btn.secondary {
        background: #1a1a1a;
      }

      .ydkt-result {
        display: none;
        margin-top: 14px;
        padding: 12px 14px;
        border-radius: 10px;
        text-align: center;
        font-weight: 700;
      }

      .ydkt-result.visible {
        display: block;
      }

      .ydkt-result.win {
        background: rgba(45,155,83,0.25);
        color: #a9f5bd;
      }

      .ydkt-result.lose {
        background: rgba(178,58,58,0.2);
        color: #ffc5c5;
      }

      .ydkt-not-enough {
        font-weight: 700;
        text-align: center;
        color: #ffd7d7;
      }
    `;
    document.head.appendChild(style);
  };

  const buildBanner = () => {
    if (document.getElementById('ydkt-banner')) return;

    const banner = document.createElement('section');
    banner.id = 'ydkt-banner';
    banner.innerHTML = `
      <div class="ydkt-banner-inner">
        <div class="ydkt-banner-title">YOU DON'T KNOW TRACK</div>
        <div class="ydkt-banner-copy">Monkey Judge lyric challenge is live.</div>
        <button class="ydkt-banner-button" type="button">Play for 25 pts</button>
        <div class="ydkt-points" data-ydkt-points>Points: ${readPoints()}</div>
      </div>
    `;

    const anchor = document.querySelector('.player-dock') || document.querySelector('.top-area') || document.body.firstChild;
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(banner, anchor.nextSibling);
    } else {
      document.body.prepend(banner);
    }

    banner.querySelector('.ydkt-banner-button').addEventListener('click', openQuiz);
  };

  const buildFloatingButton = () => {
    if (document.getElementById('ydkt-floating-btn')) return;

    const button = document.createElement('button');
    button.id = 'ydkt-floating-btn';
    button.type = 'button';
    button.textContent = '🎮 You Don’t Know Track';
    button.addEventListener('click', openQuiz);
    document.body.appendChild(button);
  };

  const buildModal = () => {
    if (document.getElementById('ydkt-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'ydkt-modal';
    modal.innerHTML = `
      <div class="ydkt-modal-card">
        <h3>YOU DON'T KNOW TRACK</h3>
        <div class="ydkt-modal-song">${QUESTION.title}</div>
        <div class="ydkt-question"></div>
        <div class="ydkt-options"></div>
        <div class="ydkt-result"></div>
        <div class="ydkt-actions">
          <button class="ydkt-btn" type="button" id="ydkt-submit">Submit</button>
          <button class="ydkt-btn secondary" type="button" id="ydkt-close">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) modal.classList.remove('visible');
    });

    document.getElementById('ydkt-close').addEventListener('click', () => modal.classList.remove('visible'));
  };

  const openQuiz = () => {
    buildModal();

    const modal = document.getElementById('ydkt-modal');
    const questionText = modal.querySelector('.ydkt-question');
    const optionsWrap = modal.querySelector('.ydkt-options');
    const result = modal.querySelector('.ydkt-result');
    const submit = modal.querySelector('#ydkt-submit');

    const currentPoints = readPoints();
    if (currentPoints < ENTRY_COST) {
      questionText.textContent = `You need ${ENTRY_COST} points to play. You currently have ${currentPoints}.`;
      optionsWrap.innerHTML = `<div class="ydkt-not-enough">Start with 100 points and try again.</div>`;
      result.className = 'ydkt-result';
      result.textContent = '';
      submit.disabled = true;
      modal.classList.add('visible');
      return;
    }

    submit.disabled = false;
    questionText.textContent = QUESTION.prompt;
    optionsWrap.innerHTML = '';

    QUESTION.answers.forEach((answer, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ydkt-option';
      button.textContent = `${String.fromCharCode(65 + index)} — ${answer}`;
      button.dataset.index = String(index);
      button.addEventListener('click', () => {
        optionsWrap.querySelectorAll('.ydkt-option').forEach((option) => option.classList.remove('selected'));
        button.classList.add('selected');
      });
      optionsWrap.appendChild(button);
    });

    result.className = 'ydkt-result';
    result.textContent = '';

    submit.onclick = () => {
      const selected = optionsWrap.querySelector('.ydkt-option.selected');
      const selectedIndex = selected ? Number(selected.dataset.index) : -1;
      const isCorrect = selectedIndex === QUESTION.correctIndex;

      optionsWrap.querySelectorAll('.ydkt-option').forEach((option, index) => {
        option.classList.remove('selected');
        if (index === QUESTION.correctIndex) option.classList.add('correct');
        if (index === selectedIndex && index !== QUESTION.correctIndex) option.classList.add('incorrect');
      });

      const before = readPoints();
      let after = before;
      if (isCorrect) {
        after = writePoints(before - ENTRY_COST + WIN_REWARD);
        result.className = 'ydkt-result visible win';
        result.textContent = `Correct! +${WIN_REWARD} points. Total: ${after}`;
      } else {
        after = writePoints(before - ENTRY_COST);
        result.className = 'ydkt-result visible lose';
        result.textContent = `Incorrect. -${ENTRY_COST} points. Total: ${after}`;
      }

      submit.disabled = true;
      setTimeout(() => {
        modal.classList.remove('visible');
      }, 1500);
    };

    modal.classList.add('visible');
  };

  const syncBanner = () => {
    const banner = document.getElementById('ydkt-banner');
    if (!banner) return;

    if (songIsActive()) {
      banner.classList.add('visible');
    } else {
      banner.classList.remove('visible');
    }
  };

  const init = () => {
    injectStyles();
    buildBanner();
    buildFloatingButton();
    buildModal();
    updatePointsLabels();
    syncBanner();

    const observer = new MutationObserver(() => {
      syncBanner();
      updatePointsLabels();
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    window.addEventListener('load', () => syncBanner());
    setInterval(syncBanner, 600);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
