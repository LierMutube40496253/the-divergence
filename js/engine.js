// js/engine.js — The Divergence visual novel engine

const Engine = (() => {

  // ── STATE ──────────────────────────────────────────────────────────────────
  let currentNode      = null;
  let isTyping         = false;
  let typewriterTimer  = null;
  let typewriteEl      = null;
  let typewriteText    = '';
  let typewriteCb      = null;
  let history          = [];
  let _skipHistory     = false;

  // ── DOM REFERENCES ─────────────────────────────────────────────────────────
  const el = {
    boxJiho:        document.getElementById('box-jiho'),
    boxPlayer:      document.getElementById('box-player'),
    boxEmeka:       document.getElementById('box-emeka'),
    textJiho:       document.getElementById('text-jiho'),
    textPlayer:     document.getElementById('text-player'),
    textEmeka:      document.getElementById('text-emeka'),
    contJiho:       document.getElementById('continue-jiho'),
    contEmeka:      document.getElementById('continue-emeka'),
    jihoImg:        document.getElementById('jiho-img'),
    jihoThumb:      document.getElementById('jiho-thumb'),
    emekaImg:       document.getElementById('emeka-img'),
    emekaThumb:     document.getElementById('emeka-thumb'),
    chapterLabel:   document.getElementById('chapter-label'),
    chartArea:      document.getElementById('chart-area'),
    chartFrameMain: document.getElementById('chart-frame-main'),
    chartTitle:     document.getElementById('chart-title'),
    chartCanvas:    document.getElementById('chart-canvas'),
    chartFrameExtra:document.getElementById('chart-frame-extra'),
    chartTitleExtra:document.getElementById('chart-title-extra'),
    chartCanvasExtra:document.getElementById('chart-canvas-extra'),
    portJiho:       document.getElementById('portrait-jiho'),
    portEmeka:      document.getElementById('portrait-emeka'),
  };

  // ── SPRITE MAP ─────────────────────────────────────────────────────────────
  const SPRITES = {
    jiho: {
      neutral: 'assets/sprites/jiho_neutral.jpg',
      pleased: 'assets/sprites/jiho_pleased.jpg',
      quiet:   'assets/sprites/jiho_quiet.jpg',
    },
    emeka: {
      // Single portrait reused for all expressions
      amused:  'assets/sprites/emeka_neutral.jpg',
      sharp:   'assets/sprites/emeka_neutral.jpg',
      serious: 'assets/sprites/emeka_neutral.jpg',
      neutral: 'assets/sprites/emeka_neutral.jpg',
    },
  };

  // ── CHAPTER LABELS ─────────────────────────────────────────────────────────
  const CHAPTER_LABELS = {
    prologue: 'Prologue · The Bar',
    ch1:      'I · The Divergence',
    ch2:      'II · The Structural Trap',
    ch3:      'III · The Demographic Dividend',
  };

  // ── SHOW NODE ──────────────────────────────────────────────────────────────
  function showNode(node) {
    // Handle navigation nodes (endings)
    if (node._navigate) {
      window.location.href = node._navigate;
      return;
    }

    // Push current node to history before overwriting (unless going back)
    if (!_skipHistory && currentNode && currentNode.id !== node.id) {
      history.push(currentNode.id);
      updateBackBtn();
    }
    _skipHistory = false;

    currentNode = node;
    stopTypewriter();
    hideIndicators();

    if (node.chapter) {
      setChapterLabel(node.chapter);
      markChapterDiamond(node.chapter);
    }

    switch (node.speaker) {
      case 'jiho':        showJiho(node);        break;
      case 'emeka':       showEmeka(node);       break;
      case 'narrator':    showNarrator(node);    break;
      case 'choice':      showChoices(node);     break;
      case 'prediction':  showPrediction(node);  break;
      case 'dissertation':showDissertation(node);break;
      case 'chart-only':  /* chart opens below; no dialogue change */ break;
    }

    if (node.chart) {
      openChart(node.chart, node.chartAutoAdvance ? () => advance(node.next) : null);
    } else if (node.chart === null) {
      closeChart();
    }
    // chart: undefined → leave current chart state unchanged
  }

  // ── SPEAKER RENDERERS ──────────────────────────────────────────────────────
  function showJiho(node) {
    setSprite('jiho', node.expression || 'neutral');
    activateBox('jiho');

    const p = buildDialogueP(el.textJiho);
    typewrite(p, node.text, () => showIndicator(el.contJiho));
  }

  function showEmeka(node) {
    setSprite('emeka', node.expression || 'amused');
    activateBox('emeka');

    const p = buildDialogueP(el.textEmeka);
    typewrite(p, node.text, () => showIndicator(el.contEmeka));
  }

  function showNarrator(node) {
    activateBox('narrator');

    const p = document.createElement('p');
    p.className = 'narrator-text';
    clearBox(el.textPlayer);
    el.textPlayer.appendChild(p);
    typewrite(p, node.text, null);
  }

  function showChoices(node) {
    activateBox('choice');

    if (node.prompt) {
      const prompt = document.createElement('p');
      prompt.className = 'choices-prompt';
      prompt.textContent = node.prompt;
      clearBox(el.textPlayer);
      el.textPlayer.appendChild(prompt);
    } else {
      clearBox(el.textPlayer);
    }

    const letters = ['A', 'B', 'C', 'D'];
    const frag = document.createDocumentFragment();

    node.choices.forEach((choice, i) => {
      const div = document.createElement('div');
      div.className = 'choice-option';
      div.dataset.choiceId = i;
      div.style.setProperty('--stagger-delay', (i * 80) + 'ms');
      div.innerHTML =
        `<span class="choice-letter">${letters[i]}</span>` +
        `<span class="choice-text">${choice.text}</span>`;
      div.addEventListener('click', () => pickChoice(choice, div, i));
      frag.appendChild(div);
    });

    el.textPlayer.appendChild(frag);

    // Show hint for the "continue to next chapter" option when it's not the first choice
    const contIdx = node.choices.findIndex((c, i) => c.isD && i > 0);
    if (contIdx > 0) {
      const hint = document.createElement('p');
      hint.className = 'choices-hint';
      hint.textContent = 'Select option ' + letters[contIdx] + ' to continue to the next chapter.';
      el.textPlayer.appendChild(hint);
    }
  }

  // ── PREDICTION PROMPT ─────────────────────────────────────────────────────
  // Two-button pre-chart prompt. Both options advance to node.next.
  function showPrediction(node) {
    activateBox('choice');

    const prompt = document.createElement('p');
    prompt.className = 'choices-prompt';
    prompt.textContent = node.prompt || 'What do you predict?';
    clearBox(el.textPlayer);
    el.textPlayer.appendChild(prompt);

    const frag = document.createDocumentFragment();
    (node.options || []).forEach((optText, i) => {
      const div = document.createElement('div');
      div.className = 'choice-option prediction-option';
      div.dataset.choiceId = i;
      div.style.setProperty('--stagger-delay', (i * 80) + 'ms');
      div.innerHTML = `<span class="choice-text">${optText}</span>`;
      div.addEventListener('click', () => {
        if (div.classList.contains('is-selected')) return;
        // Mark selected, disable both buttons
        el.textPlayer.querySelectorAll('.prediction-option').forEach(d => {
          d.classList.add('is-disabled');
        });
        div.classList.add('is-selected');
        setTimeout(() => advance(node.next), 600);
      });
      frag.appendChild(div);
    });
    el.textPlayer.appendChild(frag);
  }

  // ── FINAL DISSERTATION ────────────────────────────────────────────────────
  // Both boxes active simultaneously, both typewriters start together.
  function showDissertation(node) {
    // Both character boxes active
    el.boxJiho.classList.add('is-active');
    el.boxJiho.classList.remove('is-inactive');
    el.boxEmeka.classList.add('is-active');
    el.boxEmeka.classList.remove('is-inactive');
    el.portJiho.classList.remove('is-inactive', 'is-active', 'chart-mode');
    el.portJiho.classList.add('is-active');
    el.portEmeka.classList.remove('is-inactive', 'is-active', 'chart-mode');
    el.portEmeka.classList.add('is-active');
    setSprite('jiho', node.expressionJiho || 'pleased');
    setSprite('emeka', node.expressionEmeka || 'serious');

    el.boxPlayer.classList.remove('is-narrator');
    clearBox(el.textPlayer);

    const pJiho  = buildDialogueP(el.textJiho);
    const pEmeka = buildDialogueP(el.textEmeka);

    let jihoFinished  = false;
    let emekaFinished = false;

    function checkBothDone() {
      if (jihoFinished && emekaFinished) {
        setTimeout(() => {
          if (node.next) advance(node.next);
        }, 1500);
      }
    }

    // Typewrite both at once — we run them directly without going through
    // the single typewriterTimer lock; we need two parallel timers.
    typewriteParallel(pJiho, node.textJiho, () => { jihoFinished = true; checkBothDone(); });
    typewriteParallel(pEmeka, node.textEmeka, () => { emekaFinished = true; checkBothDone(); });
  }

  function typewriteParallel(targetEl, text, onComplete) {
    let i = 0;
    function tick() {
      if (i < text.length) {
        targetEl.textContent = text.slice(0, i + 1);
        i++;
        setTimeout(tick, 10);
      } else {
        if (onComplete) onComplete();
      }
    }
    tick();
  }

  // ── CHOICE HANDLING ───────────────────────────────────────────────────────
  function pickChoice(choice, divEl, idx) {
    const isOptionD = (idx === 3) || choice.isD;

    if (isOptionD) {
      // D always advances
      if (choice.chapter) localStorage.setItem('div_ch' + choice.chapter, 'done');
      advance(choice.next);
      return;
    }

    // A / B / C — additive, once selected stays selected
    if (divEl.classList.contains('is-selected')) return;
    divEl.classList.add('is-selected');

    if (choice.reaction) {
      // Show reaction sequence, then return to choices
      runReactionSequence(choice.reaction);
    }

    if (choice.chartUpdate && window.Charts) {
      window.Charts.update(choice.chartUpdate);
    }
  }

  // Run a linear sequence of reaction nodes, then stop (no advance).
  // Does NOT clear the player box so choices remain visible throughout.
  function runReactionSequence(nodes, idx) {
    if (!idx) idx = 0;

    if (idx >= nodes.length) {
      // Sequence done — clear reaction callback, leave choices visible
      delete el._reactionNext;
      return;
    }

    const node = nodes[idx];
    stopTypewriter();
    hideIndicators();

    function afterTyping(indicator) {
      showIndicator(indicator);
      el._reactionNext = () => {
        delete el._reactionNext;
        runReactionSequence(nodes, idx + 1);
      };
    }

    if (node.speaker === 'jiho') {
      setSprite('jiho', node.expression || 'neutral');
      // Activate ji-ho box without clearing player box
      el.boxJiho.classList.add('is-active');
      el.boxJiho.classList.remove('is-inactive');
      el.portJiho.classList.remove('is-inactive', 'chart-mode');
      el.portJiho.classList.add('is-active');
      // Leave emeka box as-is (don't clear it or change its state aggressively)

      clearBox(el.textJiho);
      const p = buildDialogueP(el.textJiho);
      typewrite(p, node.text, () => afterTyping(el.contJiho));

    } else if (node.speaker === 'emeka') {
      setSprite('emeka', node.expression || 'amused');
      el.boxEmeka.classList.add('is-active');
      el.boxEmeka.classList.remove('is-inactive');
      el.portEmeka.classList.remove('is-inactive', 'chart-mode');
      el.portEmeka.classList.add('is-active');

      clearBox(el.textEmeka);
      const p = buildDialogueP(el.textEmeka);
      typewrite(p, node.text, () => afterTyping(el.contEmeka));
    }
  }

  // ── BOX STATE MANAGEMENT ──────────────────────────────────────────────────
  function activateBox(who) {
    // who: 'jiho' | 'emeka' | 'narrator' | 'choice'
    const jihoActive   = who === 'jiho';
    const emekaActive  = who === 'emeka';
    const playerActive = who === 'narrator' || who === 'choice';

    el.boxJiho.classList.toggle('is-active',   jihoActive);
    el.boxJiho.classList.toggle('is-inactive', !jihoActive);
    el.boxEmeka.classList.toggle('is-active',  emekaActive);
    el.boxEmeka.classList.toggle('is-inactive',!emekaActive);
    el.boxPlayer.classList.toggle('is-narrator', who === 'narrator');

    // Portrait sprites
    el.portJiho.classList.remove('is-active', 'is-inactive', 'chart-mode');
    el.portEmeka.classList.remove('is-active', 'is-inactive', 'chart-mode');
    el.portJiho.classList.add(jihoActive ? 'is-active' : 'is-inactive');
    el.portEmeka.classList.add(emekaActive ? 'is-active' : 'is-inactive');

    if (who !== 'jiho')  clearBox(el.textJiho);
    if (who !== 'emeka') clearBox(el.textEmeka);
    if (playerActive)    {} // keep player box
    else                 clearBox(el.textPlayer);
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
        typewriterTimer = setTimeout(tick, 10);
      } else {
        isTyping = false;
        typewriterTimer = null;
        if (onComplete) onComplete();
      }
    }
    tick();
  }

  function skipTypewriter() {
    clearTimeout(typewriterTimer);
    typewriterTimer = null;
    if (typewriteEl) typewriteEl.textContent = typewriteText;
    isTyping = false;
    const cb = typewriteCb;
    typewriteCb = null;
    typewriteEl = null;
    if (cb) cb();
  }

  function stopTypewriter() {
    clearTimeout(typewriterTimer);
    typewriterTimer = null;
    isTyping      = false;
    typewriteEl   = null;
    typewriteText = '';
    typewriteCb   = null;
  }

  // ── CLICK HANDLER ─────────────────────────────────────────────────────────
  function handleClick(e) {
    if (e.target.closest('.choice-option')) return;

    // Reaction sequence click-through
    if (el._reactionNext) {
      if (isTyping) { skipTypewriter(); return; }
      el._reactionNext();
      return;
    }

    if (currentNode && (currentNode.speaker === 'choice' || currentNode.speaker === 'prediction')) return;

    if (isTyping) {
      skipTypewriter();
    } else {
      advance(currentNode && currentNode.next);
    }
  }

  document.getElementById('game-scene').addEventListener('click', handleClick);
  document.querySelector('.game-dialogue').addEventListener('click', handleClick);

  const _backBtn = document.getElementById('back-btn');
  if (_backBtn) _backBtn.addEventListener('click', function (e) { e.stopPropagation(); goBack(); });

  // ── ADVANCE ───────────────────────────────────────────────────────────────
  function advance(nextId) {
    if (!nextId) return;
    const nodeMap = (window.STORY && Object.keys(window.STORY).length > 0)
      ? window.STORY
      : TEST_NODES;
    const next = nodeMap[nextId];
    if (next) showNode(next);
  }

  // ── BACK ──────────────────────────────────────────────────────────────────
  function goBack() {
    if (history.length === 0) return;
    delete el._reactionNext;
    stopTypewriter();
    const prevId = history.pop();
    const nodeMap = (window.STORY && Object.keys(window.STORY).length > 0)
      ? window.STORY
      : TEST_NODES;
    const prev = nodeMap[prevId];
    if (prev) {
      _skipHistory = true;
      showNode(prev);
    }
    updateBackBtn();
  }

  function updateBackBtn() {
    const btn = document.getElementById('back-btn');
    if (btn) btn.disabled = history.length === 0;
  }

  // ── CHART CONTROL ─────────────────────────────────────────────────────────
  function openChart(chartId, onComplete) {
    el.portJiho.classList.remove('is-active', 'is-inactive');
    el.portJiho.classList.add('chart-mode');
    el.portEmeka.classList.remove('is-active', 'is-inactive');
    el.portEmeka.classList.add('chart-mode');
    el.chartArea.classList.add('is-visible');
    el.chartArea.setAttribute('aria-hidden', 'false');

    if (window.Charts && typeof window.Charts[chartId] === 'function') {
      window.Charts[chartId](el.chartCanvas, el.chartTitle, onComplete || null);
    }
  }

  function closeChart() {
    el.chartArea.style.opacity = '0';
    setTimeout(() => {
      el.chartArea.classList.remove('is-visible');
      el.chartArea.setAttribute('aria-hidden', 'true');
      el.chartArea.style.opacity = '';
      el.chartFrameExtra.style.display = 'none';
      clearBox(el.chartCanvas);
      clearBox(el.chartCanvasExtra);
    }, 150);
  }

  // ── HELPERS ───────────────────────────────────────────────────────────────
  function buildDialogueP(container) {
    clearBox(container);
    const p = document.createElement('p');
    p.className = 'text-dialogue';
    container.appendChild(p);
    return p;
  }

  function clearBox(boxEl) { if (boxEl) boxEl.innerHTML = ''; }

  function hideIndicators() {
    el.contJiho.classList.remove('is-visible');
    el.contEmeka.classList.remove('is-visible');
  }

  function showIndicator(ind) { if (ind) ind.classList.add('is-visible'); }

  function setSprite(char, expr) {
    const map   = SPRITES[char];
    const src   = (map && map[expr]) || null;
    const img   = char === 'jiho' ? el.jihoImg   : el.emekaImg;
    const thumb = char === 'jiho' ? el.jihoThumb : el.emekaThumb;
    if (img) {
      if (src) { img.src = src; img.style.display = ''; }
    }
    if (thumb) {
      if (src) { thumb.src = src; thumb.style.display = ''; }
    }
  }

  function setChapterLabel(chapterId) {
    const label = CHAPTER_LABELS[chapterId] || chapterId;
    if (el.chapterLabel) el.chapterLabel.textContent = label;
  }

  function markChapterDiamond(chapterId) {
    const map = { ch1:1, ch2:2, ch3:3 };
    const n = map[chapterId];
    if (!n) return;
    const d = document.getElementById('top-diamond-' + n);
    if (d) d.classList.add('is-complete');
  }

  // ── TEST NODES ─────────────────────────────────────────────────────────────
  const TEST_NODES = {
    'test-1': {
      id:         'test-1',
      speaker:    'jiho',
      expression: 'neutral',
      text:       "We grew up in countries with the same GDP per person in 1952. Within a single lifetime — our lifetime — Korea became eleven times richer than Nigeria.",
      next:       'test-2',
    },
    'test-2': {
      id:         'test-2',
      speaker:    'emeka',
      expression: 'amused',
      text:       "He's not wrong about the numbers. He's just… selective about which numbers he shows you.",
      next:       'test-3',
    },
    'test-3': {
      id:         'test-3',
      speaker:    'narrator',
      text:       "Davos, Switzerland. January 25th, 2007. Nearly midnight.",
      next:       'test-4',
    },
    'test-4': {
      id:      'test-4',
      speaker: 'choice',
      prompt:  'What do you make of this?',
      choices: [
        { text: "They're basically the same dot. Same GDP, same starting point.", next: 'test-1' },
        { text: "Nigeria had more people AND was richer. Nigeria should have won.", next: 'test-1' },
        { text: "Both of you are near the bottom. Europe was already ahead.", next: 'test-1' },
        { text: "Tell me more — what happened next?", next: 'test-1', isD: true },
      ],
    },
  };

  // ── PUBLIC API ─────────────────────────────────────────────────────────────
  return {
    start() {
      const nodeMap  = (window.STORY && Object.keys(window.STORY).length > 0)
        ? window.STORY
        : TEST_NODES;
      const firstKey = Object.keys(nodeMap)[0];
      showNode(nodeMap[firstKey]);
    },
    showNode,
    advance,
    openChart,
    closeChart,
    getEl: () => el,
  };

})();

document.addEventListener('DOMContentLoaded', () => Engine.start());
