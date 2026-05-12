// js/charts.js — static image charts (from Figures folder)

window.Charts = (() => {

  const F = 'assets/figures/';

  let _activeCanvas  = null;
  let _activeTitleEl = null;
  let _selectedOptions = {};

  const chartArea = document.getElementById('chart-area');

  function setTwoPanelLayout(enabled) {
    if (!chartArea) return;
    chartArea.classList.toggle('two-panel', enabled);
  }

  function showImg(container, src, titleEl, title) {
    setTwoPanelLayout(false);
    const extraFrame = document.getElementById('chart-frame-extra');
    if (extraFrame) extraFrame.style.display = 'none';
    container.innerHTML = '';
    container.style.height = '420px';
    if (titleEl) titleEl.textContent = title || '';

    const img = document.createElement('img');
    img.src = src;
    img.alt = title || '';
    img.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;';
    container.appendChild(img);
  }

  function showImgPair(container, src1, src2, titleEl, title) {
    container.innerHTML = '';
    container.style.height = '420px';
    if (titleEl) titleEl.textContent = title || '';

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;gap:8px;width:100%;height:100%;';

    [src1, src2].forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.style.cssText = 'flex:1;min-width:0;height:100%;object-fit:contain;';
      wrap.appendChild(img);
    });
    container.appendChild(wrap);
  }

  // ── CHART 1 ─────────────────────────────────────────────────────────────────

  function CHART1(container, titleEl) {
    _activeCanvas   = container;
    _activeTitleEl  = titleEl;
    _selectedOptions = {};
    showImg(container, F + 'ch1_main.png', titleEl, 'GDP per Capita, South Korea vs Nigeria, 1952–2007');
  }

  function CHART1_A() {
    if (!_activeCanvas) return;
    showImg(_activeCanvas, F + 'ch1_optionA.png', _activeTitleEl, 'GDP per Capita — The Moment of Divergence');
  }

  function CHART1_B() {
    if (!_activeCanvas) return;
    showImg(_activeCanvas, F + 'ch1_optionB.png', _activeTitleEl, 'GDP per Capita — Growth Rate & Volatility Gap');
  }

  // ── CHART 2 ─────────────────────────────────────────────────────────────────

  function CHART2(container, titleEl) {
    _activeCanvas   = container;
    _activeTitleEl  = titleEl;
    _selectedOptions = {};
    showImg(container, F + 'ch2_main.png', titleEl, 'Export Composition, South Korea vs Nigeria, 1962–2007');
  }

  function CHART2_A() {
    if (!_activeCanvas) return;
    showImg(_activeCanvas, F + 'ch2_optionA.png', _activeTitleEl, 'Export Composition — Decade by Decade');
  }

  function CHART2_B() {
    if (!_activeCanvas) return;
    showImg(_activeCanvas, F + 'ch2_optionB.png', _activeTitleEl, 'Geopolitical Context: US Aid & Key Events');
  }

  function CHART2_C() {
    if (!_activeCanvas) return;
    showImg(_activeCanvas, F + 'ch2_optionC.png', _activeTitleEl, 'Export Basket Comparison, 2007');
  }

  // ── CHART 3 ─────────────────────────────────────────────────────────────────

  function CHART3(container, titleEl) {
    _activeCanvas   = container;
    _activeTitleEl  = titleEl;
    _selectedOptions = {};
    setTwoPanelLayout(false);
    showImg(container, F + 'ch3_main.png', titleEl, 'Demographic Transition: Fertility vs Life Expectancy, 1952–2007');
  }

  function CHART3_A() {
    if (!_activeCanvas) return;
    showImg(_activeCanvas, F + 'ch3_optionA.png', _activeTitleEl, 'The Gender Engine');
  }

  function CHART3_B() {
    if (!_activeCanvas) return;
    showImg(_activeCanvas, F + 'ch3_optionB.png', _activeTitleEl, 'Secondary School Enrollment, ~1990');
  }

  function CHART3_C() {
    if (!_activeCanvas) return;

    setTwoPanelLayout(false);
    const extraFrame = document.getElementById('chart-frame-extra');
    if (extraFrame) extraFrame.style.display = 'none';

    _activeCanvas.innerHTML = '';
    _activeCanvas.style.height = '260px';
    if (_activeTitleEl) _activeTitleEl.textContent = '';

    const card = document.createElement('div');
    card.className = 'chart-animation-card chart-animation-clickable';
    card.textContent = 'Click here to watch the Asia & Africa GDP animations';
    card.addEventListener('click', function (e) {
      e.stopPropagation();
      _ch3C_loadAndExpand();
    });
    _activeCanvas.appendChild(card);
  }

  function _ch3C_loadAndExpand() {
    setTwoPanelLayout(true);

    _activeCanvas.innerHTML = '';
    _activeCanvas.style.height = '420px';
    if (_activeTitleEl) _activeTitleEl.textContent = 'GDP per Capita — Africa (Animated)';

    const iframeAfrica = document.createElement('iframe');
    iframeAfrica.src = F + 'ch3_map_gdp_africa_animated.html';
    iframeAfrica.style.cssText = 'width:100%;height:100%;border:none;display:block;';
    iframeAfrica.title = 'GDP per Capita Africa Animated';
    _activeCanvas.appendChild(iframeAfrica);

    const extraFrame = document.getElementById('chart-frame-extra');
    const extraCanvas = document.getElementById('chart-canvas-extra');
    const extraTitle  = document.getElementById('chart-title-extra');
    if (extraFrame && extraCanvas) {
      extraFrame.style.display = '';
      extraCanvas.innerHTML = '';
      extraCanvas.style.height = '420px';
      if (extraTitle) extraTitle.textContent = 'GDP per Capita — Asia (Animated)';
      const iframeAsia = document.createElement('iframe');
      iframeAsia.src = F + 'ch3_map_gdp_asia_animated.html';
      iframeAsia.style.cssText = 'width:100%;height:100%;border:none;display:block;';
      iframeAsia.title = 'GDP per Capita Asia Animated';
      extraCanvas.appendChild(iframeAsia);
    }

    const expandBtn = document.getElementById('chart-expand-btn');
    const area = document.getElementById('chart-area');
    if (expandBtn && area && !area.classList.contains('is-expanded')) {
      expandBtn.click();
    }
  }

  function createAnimationCard(text) {
    const card = document.createElement('div');
    card.className = 'chart-animation-card chart-animation-clickable';
    card.textContent = text;
    card.addEventListener('click', function (e) {
      e.stopPropagation();
      const expandBtn = document.getElementById('chart-expand-btn');
      if (expandBtn) expandBtn.click();
    });
    return card;
  }

  // ── UPDATE DISPATCHER ───────────────────────────────────────────────────────

  function update(optionId) {
    if (_selectedOptions[optionId]) return;
    _selectedOptions[optionId] = true;

    const dispatch = {
      'CHART1-A': CHART1_A, 'CHART1-B': CHART1_B,
      'CHART2-A': CHART2_A, 'CHART2-B': CHART2_B, 'CHART2-C': CHART2_C,
      'CHART3-A': CHART3_A, 'CHART3-B': CHART3_B, 'CHART3-C': CHART3_C,
    };

    const fn = dispatch[optionId];
    if (fn) fn();
  }

  return { CHART1, CHART2, CHART3, update };

})();
