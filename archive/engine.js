// engine.js — The Divergence visual novel engine

const Engine = (() => {

  // ── STATE ──────────────────────────────────────────────────────────────────
  let currentNode      = null;
  let isTyping         = false;
  let typewriterTimer  = null;
  let typewriteEl      = null;   // element currently being typewritten into
  let typewriteText    = '';     // full text of current typewrite
  let typewriteCb      = null;   // callback when typewrite finishes

  const score = { jiho: 0, emeka: 0 };

  // ── DOM REFERENCES ─────────────────────────────────────────────────────────
  const el = {
    boxJiho:      document.getElementById('box-jiho'),
    boxPlayer:    document.getElementById('box-player'),
    boxEmeka:     document.getElementById('box-emeka'),
    textJiho:     document.getElementById('text-jiho'),
    textPlayer:   document.getElementById('text-player'),
    textEmeka:    document.getElementById('text-emeka'),
    contJiho:     document.getElementById('continue-jiho'),
    contEmeka:    document.getElementById('continue-emeka'),
    portJiho:     document.getElementById('portrait-jiho'),
    portEmeka:    document.getElementById('portrait-emeka'),
    jihoImg:      document.getElementById('jiho-img'),
    jihoThumb:    document.getElementById('jiho-thumb'),
    emekaImg:     document.getElementById('emeka-img'),
    emekaThumb:   document.getElementById('emeka-thumb'),
    chapterLabel: document.getElementById('chapter-label'),
    chartArea:    document.getElementById('chart-area'),
    chartTitle:   document.getElementById('chart-title'),
    chartCanvas:  document.getElementById('chart-canvas'),
  };

  // ── SPRITE MAP ─────────────────────────────────────────────────────────────
  const SPRITES = {
    jiho:  {
      neutral: 'assets/sprites/jiho_neutral.jpg',
      pleased: 'assets/sprites/jiho_pleased.jpg',
      quiet:   'assets/sprites/jiho_quiet.jpg',
    },
    emeka: {
      // Placeholder until Emeka portraits are generated
      amused:  null,
      sharp:   null,
      serious: null,
    },
  };

  // ── SHOW NODE ──────────────────────────────────────────────────────────────
  function showNode(node) {
    currentNode = node;
    stopTypewriter();
    hideIndicators();

    switch (node.speaker) {
      case 'jiho':     showJiho(node);     break;
      case 'emeka':    showEmeka(node);    break;
      case 'narrator': showNarrator(node); break;
      case 'choice':   showChoices(node);  break;
    }

    // Chart handling
    if (node.chart) {
      openChart(node.chart);
    } else {
      closeChart();
    }
  }

  // ── SPEAKER RENDERERS ──────────────────────────────────────────────────────
  function showJiho(node) {
    setPortrait('jiho',  'active');
    setPortrait('emeka', 'inactive');
    setExpression('jiho', node.expression || 'neutral');

    el.boxJiho.classList.add('is-active');
    el.boxJiho.classList.remove('is-inactive');
    el.boxEmeka.classList.remove('is-active');
    el.boxEmeka.classList.add('is-inactive');

    clearBox(el.textPlayer);

    const p = buildDialogueP(el.textJiho);
    typewrite(p, node.text, () => showIndicator(el.contJiho));
  }

  function showEmeka(node) {
    setPortrait('jiho',  'inactive');
    setPortrait('emeka', 'active');
    setExpression('emeka', node.expression || 'amused');

    el.boxEmeka.classList.add('is-active');
    el.boxEmeka.classList.remove('is-inactive');
    el.boxJiho.classList.remove('is-active');
    el.boxJiho.classList.add('is-inactive');

    clearBox(el.textPlayer);

    const p = buildDialogueP(el.textEmeka);
    typewrite(p, node.text, () => showIndicator(el.contEmeka));
  }

  function showNarrator(node) {
    setPortrait('jiho',  'inactive');
    setPortrait('emeka', 'inactive');
    el.boxJiho.classList.remove('is-active');
    el.boxJiho.classList.add('is-inactive');
    el.boxEmeka.classList.remove('is-active');
    el.boxEmeka.classList.add('is-inactive');

    clearBox(el.textJiho);
    clearBox(el.textEmeka);

    clearBox(el.textPlayer);
    const p = document.createElement('p');
    p.className = 'narrator-text';
    el.textPlayer.appendChild(p);
    typewrite(p, node.text, null);
  }

  function showChoices(node) {
    setPortrait('jiho',  'inactive');
    setPortrait('emeka', 'inactive');
    el.boxJiho.classList.remove('is-active');
    el.boxJiho.classList.add('is-inactive');
    el.boxEmeka.classList.remove('is-active');
    el.boxEmeka.classList.add('is-inactive');

    clearBox(el.textJiho);
    clearBox(el.textEmeka);

    const letters = ['A', 'B', 'C'];
    const frag = document.createDocumentFragment();

    node.choices.forEach((choice, i) => {
      const div = document.createElement('div');
      div.className = 'choice-option';
      div.innerHTML = `<span class="choice-letter">${letters[i]}</span>
                       <span class="choice-text">${choice.text}</span>`;
      div.addEventListener('click', () => pickChoice(choice));
      frag.appendChild(div);
    });

    clearBox(el.textPlayer);
    el.textPlayer.appendChild(frag);
  }

  function pickChoice(choice) {
    if (choice.score) {
      score[choice.score]++;
      updateScoreHUD();
    }
    advance(choice.next);
  }

  function updateScoreHUD() {
    const j = document.getElementById('score-jiho');
    const e = document.getElementById('score-emeka');
    if (j) j.textContent = score.jiho;
    if (e) e.textContent = score.emeka;
  }

  // ── TYPEWRITER ─────────────────────────────────────────────────────────────
  function typewrite(targetEl, text, onComplete) {
    isTyping       = true;
    typewriteEl    = targetEl;
    typewriteText  = text;
    typewriteCb    = onComplete;

    let i = 0;

    function tick() {
      if (i < text.length) {
        targetEl.textContent = text.slice(0, i + 1);
        i++;
        typewriterTimer = setTimeout(tick, 30);
      } else {
        isTyping = false;
        typewriterTimer = null;
        if (onComplete) onComplete();
      }
    }
    tick();
  }

  function skipTypewriter() {
    // Instantly complete the current text
    clearTimeout(typewriterTimer);
    typewriterTimer = null;
    if (typewriteEl) typewriteEl.textContent = typewriteText;
    isTyping = false;
    const cb = typewriteCb;
    typewriteCb = null;
    if (cb) cb();
  }

  function stopTypewriter() {
    clearTimeout(typewriterTimer);
    typewriterTimer = null;
    isTyping = false;
    typewriteEl   = null;
    typewriteText = '';
    typewriteCb   = null;
  }

  // ── CLICK HANDLER ──────────────────────────────────────────────────────────
  // Clicking anywhere in the scene or dialogue area drives the game forward.
  function handleClick(e) {
    // Choice clicks are handled by their own listeners
    if (e.target.closest('.choice-option')) return;
    // Ignore background clicks while waiting for a choice
    if (currentNode && currentNode.speaker === 'choice') return;

    if (isTyping) {
      skipTypewriter();
    } else {
      advance(currentNode && currentNode.next);
    }
  }

  document.getElementById('game-scene').addEventListener('click', handleClick);
  document.querySelector('.game-dialogue').addEventListener('click', handleClick);

  // ── ADVANCE ────────────────────────────────────────────────────────────────
  function advance(nextId) {
    if (!nextId) return;
    const nodeMap = window.STORY || TEST_NODES;
    const next = nodeMap[nextId];
    if (next) showNode(next);
  }

  // ── HELPERS ────────────────────────────────────────────────────────────────
  function buildDialogueP(container) {
    clearBox(container);
    const p = document.createElement('p');
    p.className = 'text-dialogue';
    container.appendChild(p);
    return p;
  }

  function clearBox(el) { el.innerHTML = ''; }

  function hideIndicators() {
    el.contJiho.classList.remove('is-visible');
    el.contEmeka.classList.remove('is-visible');
  }

  function showIndicator(ind) { ind.classList.add('is-visible'); }

  function setPortrait(char, state) {
    const p = char === 'jiho' ? el.portJiho : el.portEmeka;
    p.classList.remove('is-active', 'is-inactive', 'chart-mode');
    p.classList.add(`is-${state}`);
  }

  function setExpression(char, expr) {
    const map   = SPRITES[char];
    const src   = map[expr] || Object.values(map).find(v => v);
    const img   = char === 'jiho' ? el.jihoImg   : el.emekaImg;
    const thumb = char === 'jiho' ? el.jihoThumb : el.emekaThumb;
    if (img)   { if (src) { img.src = src; img.style.display = ''; } else img.style.display = 'none'; }
    if (thumb) { if (src) { thumb.src = src; thumb.style.display = ''; } else thumb.style.display = 'none'; }
  }

  function openChart(chartId) {
    setPortrait('jiho',  'chart-mode');
    setPortrait('emeka', 'chart-mode');
    el.chartArea.classList.add('is-visible');
    el.chartArea.setAttribute('aria-hidden', 'false');
    if (window.Charts && typeof window.Charts[chartId] === 'function') {
      window.Charts[chartId](el.chartCanvas, el.chartTitle);
    }
  }

  function closeChart() {
    el.chartArea.classList.remove('is-visible');
    el.chartArea.setAttribute('aria-hidden', 'true');
  }

  // ── TEST NODES (Steps 4 & 5 — replaced by STORY in Step 11) ───────────────
  const TEST_NODES = {
    'test-jiho-1': {
      id:         'test-jiho-1',
      speaker:    'jiho',
      expression: 'neutral',
      text:       "We grew up in countries with the same GDP per person in 1952. Within a single lifetime — our lifetime — Korea became eleven times richer than Nigeria. My people live thirty-two years longer than his people, on average.",
      chart:      null,
      next:       'test-emeka-1',
    },
    'test-emeka-1': {
      id:         'test-emeka-1',
      speaker:    'emeka',
      expression: 'amused',
      text:       "He's not wrong about the numbers. He's just... selective about which numbers he shows you.",
      chart:      null,
      next:       'test-narrator-1',
    },
    'test-narrator-1': {
      id:         'test-narrator-1',
      speaker:    'narrator',
      text:       "Davos, Switzerland. January 25th, 2007. 11:52 PM.",
      chart:      null,
      next:       'test-choice-1',
    },
    'test-choice-1': {
      id:      'test-choice-1',
      speaker: 'choice',
      choices: [
        { text: "They're basically the same dot. Same GDP, same starting point.",   score: null,    next: 'test-chart-1' },
        { text: "Nigeria had more people AND was richer. Nigeria should have won.", score: 'emeka', next: 'test-chart-1' },
        { text: "Both of you are near the bottom. Europe was already ahead.",       score: 'jiho',  next: 'test-chart-1' },
      ],
    },
    'test-chart-1': {
      id:         'test-chart-1',
      speaker:    'jiho',
      expression: 'pleased',
      text:       "Look at this. Korea crossed Nigeria before the oil. Before any natural resource story.",
      chart:      'P2-MAIN',
      next:       'test-jiho-1',
    },
  };

  // ── PUBLIC API ─────────────────────────────────────────────────────────────
  return {
    start() {
      const nodeMap  = window.STORY || TEST_NODES;
      const firstKey = Object.keys(nodeMap)[0];
      showNode(nodeMap[firstKey]);
    },
    showNode,
    getScore: () => ({ ...score }),
  };

})();

document.addEventListener('DOMContentLoaded', () => Engine.start());
