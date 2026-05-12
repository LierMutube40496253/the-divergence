// charts.js — All 31 D3 charts for The Divergence
// Each function: Charts['ID'](containerEl, titleEl)

const Charts = (() => {

  // ── PALETTE (mirrors CSS variables) ──────────────────────────────────────
  const C = {
    gold:    '#c8962a',
    green:   '#4d6b41',
    copper:  '#b56230',
    cream:   '#e8dcc6',
    tan:     '#9a8060',
    bgPanel: '#201a12',
    gridLine:'#2a2016',
    axisLine:'#3d3020',
  };

  // ── CHART DIMENSIONS ──────────────────────────────────────────────────────
  const W = 480, H = 260,
        M = { top: 18, right: 28, bottom: 38, left: 52 };
  const IW = W - M.left - M.right;
  const IH = H - M.top  - M.bottom;

  // ── GAPMINDER DATA CACHE ──────────────────────────────────────────────────
  let _gapCache = null;
  async function gap() {
    if (_gapCache) return _gapCache;
    const raw = await d3.tsv('data/gapminder.tsv', d => ({
      country:   d.country,
      continent: d.continent,
      year:      +d.year,
      lifeExp:   +d.lifeExp,
      pop:       +d.pop,
      gdpPercap: +d.gdpPercap,
    }));
    _gapCache = raw;
    return raw;
  }

  // ── SHARED HELPERS ─────────────────────────────────────────────────────────
  function baseSvg(el) {
    el.innerHTML = '';
    return d3.select(el)
      .append('svg')
        .attr('width', '100%')
        .attr('viewBox', `0 0 ${W} ${H}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
        .attr('transform', `translate(${M.left},${M.top})`);
  }

  function styleAxis(g) {
    g.selectAll('.domain').attr('stroke', C.axisLine);
    g.selectAll('.tick line').attr('stroke', C.gridLine);
    g.selectAll('.tick text')
      .attr('fill', C.tan)
      .style('font-family', 'Lora, serif')
      .style('font-size', '9px');
  }

  function gridH(svg, yScale, ticks = 5) {
    svg.append('g').attr('class', 'grid')
      .call(d3.axisLeft(yScale).ticks(ticks)
        .tickSize(-IW).tickFormat(''))
      .call(g => {
        g.select('.domain').remove();
        g.selectAll('line').attr('stroke', C.gridLine).attr('stroke-dasharray', '2,3');
      });
  }

  function label(svg, text, x, y, color = C.tan) {
    svg.append('text')
      .attr('x', x).attr('y', y)
      .attr('fill', color)
      .style('font-family', 'Lora, serif')
      .style('font-size', '8.5px')
      .text(text);
  }

  function setTitle(titleEl, text) {
    if (titleEl) titleEl.textContent = text;
  }

  function vLine(svg, xScale, year, label, color = C.copper) {
    const x = xScale(year);
    svg.append('line')
      .attr('x1', x).attr('x2', x)
      .attr('y1', 0).attr('y2', IH)
      .attr('stroke', color).attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,3');
    svg.append('text')
      .attr('x', x + 3).attr('y', 8)
      .attr('fill', color)
      .style('font-family', 'Lora, serif')
      .style('font-size', '7.5px')
      .text(label);
  }

  function legend(svg, items, x = IW - 80, y = 0) {
    items.forEach(([text, color], i) => {
      const g = svg.append('g').attr('transform', `translate(${x},${y + i * 14})`);
      g.append('line').attr('x1', 0).attr('x2', 16)
        .attr('y1', 5).attr('y2', 5)
        .attr('stroke', color).attr('stroke-width', 2);
      g.append('text').attr('x', 20).attr('y', 9)
        .attr('fill', C.tan)
        .style('font-family', 'Lora, serif')
        .style('font-size', '8px')
        .text(text);
    });
  }

  // ── HARDCODED SUPPLEMENTAL DATA ───────────────────────────────────────────

  // Fertility rates (children per woman) — World Bank / UN estimates
  const FERTILITY = {
    'South Korea': [
      [1952,5.4],[1957,5.9],[1962,5.9],[1967,5.1],[1972,4.0],[1977,3.0],
      [1982,2.4],[1987,1.6],[1992,1.7],[1997,1.5],[2002,1.3],[2007,1.2],
    ],
    'Nigeria': [
      [1952,6.4],[1957,6.6],[1962,6.9],[1967,7.0],[1972,6.9],[1977,6.8],
      [1982,6.7],[1987,6.5],[1992,6.4],[1997,6.2],[2002,6.0],[2007,5.9],
    ],
  };

  // Global oil price index (USD/barrel, nominal), approx
  const OIL_PRICE = [
    [1960,1.9],[1965,1.8],[1970,2.1],[1973,11],[1974,11],[1975,10.7],
    [1976,11.6],[1977,12.4],[1978,12.7],[1979,31],[1980,36],[1981,35],
    [1982,32],[1983,29],[1984,28],[1985,27],[1987,18],[1988,14],[1990,22],
  ];

  // Korea export composition (approx $B) by sector
  const KOREA_EXPORTS = {
    years:       [1960,1965,1970,1975,1980,1985,1987],
    textiles:    [0.02,0.15,0.45,1.5, 3.5, 4.2, 4.8],
    steel:       [0,   0,   0.05,0.5, 2.1, 3.8, 5.2],
    electronics: [0,   0,   0.1, 0.4, 1.8, 5.1, 9.4],
    other:       [0.01,0.05,0.1, 0.3, 1.2, 2.1, 3.0],
  };

  // US aid to South Korea 1945-1970 ($M/year, approx)
  const US_AID_KOREA = [
    [1945,50],[1946,80],[1947,100],[1948,110],[1949,120],
    [1950,60],[1951,150],[1952,160],[1953,200],[1954,280],
    [1955,300],[1956,330],[1957,380],[1958,280],[1959,220],
    [1960,245],[1961,200],[1962,165],[1963,140],[1964,130],
    [1965,120],[1966,110],[1967,100],[1968,90],[1969,80],[1970,70],
  ];

  // Nigeria foreign aid same period ($M/year, approx)
  const NIG_AID = [
    [1945,5],[1950,8],[1955,12],[1960,20],[1965,25],
    [1966,22],[1967,18],[1968,15],[1969,20],[1970,30],
  ];

  // Korea 5-year plan GDP growth (actual %)
  const KOREA_PLANS = [
    { plan:'1st Plan\n1962–66', target:7.1,  actual:8.5  },
    { plan:'2nd Plan\n1967–71', target:7.0,  actual:9.6  },
    { plan:'3rd Plan\n1972–76', target:8.6,  actual:11.2 },
    { plan:'4th Plan\n1977–81', target:9.2,  actual:7.1  },
    { plan:'5th Plan\n1982–86', target:7.5,  actual:8.6  },
    { plan:'6th Plan\n1987–91', target:7.3,  actual:10.0 },
  ];

  // Nigeria development plan gaps (target vs actual GDP growth %)
  const NIG_PLANS = [
    { plan:'1st Plan\n1962–68', target:4.0, actual:3.1 },
    { plan:'2nd Plan\n1970–74', target:6.0, actual:8.2 },
    { plan:'3rd Plan\n1975–80', target:9.0, actual:3.4 },
    { plan:'4th Plan\n1981–85', target:7.2, actual:-1.3 },
  ];

  // Nigeria GDP by sector (oil vs non-oil, % of GDP)
  const NIG_GDP_SECTOR = [
    [1952, 2,  98],
    [1957, 3,  97],
    [1962, 4,  96],
    [1967, 8,  92],
    [1972,55,  45],
    [1977,73,  27],
    [1982,68,  32],
    [1987,60,  40],
    [1992,67,  33],
    [1997,70,  30],
    [2002,78,  22],
    [2007,83,  17],
  ];

  // Nigeria population projections 2007-2050
  const NIG_PROJ = {
    years:    [2007,2010,2015,2020,2025,2030,2035,2040,2045,2050],
    current:  [148, 158, 182, 206, 233, 263, 297, 333, 370, 401],
    decline:  [148, 155, 170, 185, 198, 212, 226, 240, 252, 262],
  };

  // ── CHART FUNCTIONS ───────────────────────────────────────────────────────

  // P1-MAIN: Gapminder bubble scatter 1952
  async function P1_MAIN(el, titleEl) {
    setTitle(titleEl, 'Global Development, 1952');
    const data = (await gap()).filter(d => d.year === 1952);
    const svg  = baseSvg(el);

    const x = d3.scaleLog().domain([200, 16000]).range([0, IW]);
    const y = d3.scaleLinear().domain([20, 85]).range([IH, 0]);
    const r = d3.scaleSqrt().domain([0, 1.3e9]).range([2, 22]);
    const color = { Asia:'#b56230', Europe:'#6b8fa3', Africa:'#4d6b41',
                    Americas:'#9a6b3a', Oceania:'#7a5a80' };

    gridH(svg, y);
    svg.append('g').attr('transform',`translate(0,${IH})`)
      .call(d3.axisBottom(x).ticks(5,'~s')).call(styleAxis);
    svg.append('g').call(d3.axisLeft(y).ticks(5)).call(styleAxis);

    svg.selectAll('circle').data(data).join('circle')
      .attr('cx', d => x(d.gdpPercap))
      .attr('cy', d => y(d.lifeExp))
      .attr('r',  d => r(d.pop))
      .attr('fill', d => color[d.continent] || C.tan)
      .attr('opacity', d => ['South Korea','Nigeria'].includes(d.country) ? 1 : 0.35)
      .attr('stroke', d => d.country === 'South Korea' ? C.gold
                         : d.country === 'Nigeria'     ? C.green : 'none')
      .attr('stroke-width', d => ['South Korea','Nigeria'].includes(d.country) ? 2 : 0);

    // Pulse labels for Korea + Nigeria
    ['South Korea','Nigeria'].forEach(name => {
      const d = data.find(r => r.country === name);
      if (!d) return;
      const cx = x(d.gdpPercap), cy = y(d.lifeExp);
      const col = name === 'South Korea' ? C.gold : C.green;
      svg.append('text').attr('x', cx + 6).attr('y', cy + 4)
        .attr('fill', col).style('font-size','8px')
        .style('font-family','Lora,serif').text(name === 'South Korea' ? 'Korea' : 'Nigeria');
    });

    label(svg, 'GDP per capita (log scale, USD)', IW/2, IH + 32, C.tan);
    label(svg, 'Life expectancy', -IH/2, -38, C.tan);
    svg.select('text:last-of-type').attr('transform', 'rotate(-90)');
    legend(svg, [['Korea',C.gold],['Nigeria',C.green]], IW - 65, 0);
  }

  // P1-A1: Starting conditions bar chart, Korea vs Nigeria 1952
  async function P1_A1(el, titleEl) {
    setTitle(titleEl, 'Starting Conditions, 1952');
    const metrics = [
      { label:'GDP/capita ($)',  korea:1030, nigeria:1077 },
      { label:'Population (M)', korea:21,   nigeria:33   },
      { label:'Land (relative)',korea:1,    nigeria:9    },
      { label:'Arable land',    korea:1,    nigeria:2.1  },
      { label:'Coastline',      korea:1,    nigeria:0.9  },
      { label:'Resources index',korea:1,    nigeria:2.4  },
    ];
    const svg = baseSvg(el);
    const y0  = d3.scaleBand().domain(metrics.map(m=>m.label)).range([0,IH]).padding(0.25);
    const maxV = d3.max(metrics, m => Math.max(m.korea, m.nigeria));
    const x0  = d3.scaleLinear().domain([0, maxV * 1.1]).range([0, IW]);

    svg.append('g').call(d3.axisLeft(y0).tickSize(0)).call(styleAxis)
      .select('.domain').remove();
    svg.append('g').attr('transform',`translate(0,${IH})`)
      .call(d3.axisBottom(x0).ticks(4,'~s')).call(styleAxis);

    const bh = y0.bandwidth() / 2 - 1;
    metrics.forEach(m => {
      const yy = y0(m.label);
      svg.append('rect').attr('x',0).attr('y', yy).attr('height', bh)
        .attr('width', x0(m.korea)).attr('fill', C.gold).attr('opacity',0.85);
      svg.append('rect').attr('x',0).attr('y', yy + bh + 2).attr('height', bh)
        .attr('width', x0(m.nigeria)).attr('fill', C.green).attr('opacity',0.85);
    });
    legend(svg, [['Korea',C.gold],['Nigeria',C.green]], IW - 65, 0);
  }

  // P1-A2: Korea vs Nigeria GDP 1952-1967
  async function P1_A2(el, titleEl) {
    setTitle(titleEl, 'GDP per Capita, 1952–1967');
    const data = (await gap()).filter(d =>
      ['South Korea','Nigeria'].includes(d.country) && d.year <= 1967);
    _twoLineChart(el, data, 1952, 1967);
  }

  // P1-B1: Korea vs Nigeria GDP 1952-1977, crossing point
  async function P1_B1(el, titleEl) {
    setTitle(titleEl, 'GDP per Capita, 1952–1977');
    const data = (await gap()).filter(d =>
      ['South Korea','Nigeria'].includes(d.country) && d.year <= 1977);
    const svg = _twoLineChart(el, data, 1952, 1977);
    if (svg) vLine(svg, svg._xScale, 1967, 'Lines cross');
  }

  // P1-B2: US Aid to Korea vs Nigeria
  function P1_B2(el, titleEl) {
    setTitle(titleEl, 'US Aid to Korea vs Nigeria Foreign Aid, 1945–1970');
    const svg = baseSvg(el);
    const years = US_AID_KOREA.map(d=>d[0]);
    const x = d3.scaleBand().domain(years).range([0,IW]).padding(0.1);
    const y = d3.scaleLinear().domain([0,420]).range([IH,0]);

    gridH(svg, y);
    svg.append('g').attr('transform',`translate(0,${IH})`)
      .call(d3.axisBottom(x).tickValues([1945,1950,1955,1960,1965,1970])).call(styleAxis);
    svg.append('g').call(d3.axisLeft(y).ticks(5)).call(styleAxis);

    const bw = x.bandwidth() / 2;
    US_AID_KOREA.forEach(([yr,v]) => {
      svg.append('rect')
        .attr('x', x(yr)).attr('y', y(v))
        .attr('width', bw).attr('height', IH - y(v))
        .attr('fill', C.gold).attr('opacity', 0.85);
    });
    NIG_AID.forEach(([yr,v]) => {
      if (!x(yr)) return;
      svg.append('rect')
        .attr('x', x(yr) + bw).attr('y', y(v))
        .attr('width', bw).attr('height', IH - y(v))
        .attr('fill', C.green).attr('opacity', 0.85);
    });
    legend(svg,[['Korea (US grants)',C.gold],['Nigeria (all aid)',C.green]], IW-120, 0);
    label(svg,'USD millions', -IH/2, -42, C.tan);
  }

  // P1-C1: Animated Gapminder scatter 1952→2007
  async function P1_C1(el, titleEl) {
    setTitle(titleEl, 'Global Development, 1952 → 2007');
    // Show static 2007 snapshot with arrows from 1952
    const data  = await gap();
    const d52   = data.filter(d => d.year === 1952);
    const d07   = data.filter(d => d.year === 2007);
    const svg   = baseSvg(el);
    const x     = d3.scaleLog().domain([200,50000]).range([0,IW]);
    const y     = d3.scaleLinear().domain([20,85]).range([IH,0]);

    gridH(svg, y);
    svg.append('g').attr('transform',`translate(0,${IH})`)
      .call(d3.axisBottom(x).ticks(4,'~s')).call(styleAxis);
    svg.append('g').call(d3.axisLeft(y).ticks(5)).call(styleAxis);

    // Draw movement arrows for highlighted countries
    const highlight = ['South Korea','Nigeria','China','India','Japan'];
    highlight.forEach(name => {
      const s = d52.find(d=>d.country===name);
      const e = d07.find(d=>d.country===name);
      if (!s||!e) return;
      const col = name==='South Korea'?C.gold:name==='Nigeria'?C.green:C.tan;
      svg.append('line')
        .attr('x1',x(s.gdpPercap)).attr('y1',y(s.lifeExp))
        .attr('x2',x(e.gdpPercap)).attr('y2',y(e.lifeExp))
        .attr('stroke',col).attr('stroke-width',1.5).attr('opacity',0.7)
        .attr('marker-end','url(#arr)');
    });

    // Arrow marker
    svg.append('defs').append('marker')
      .attr('id','arr').attr('viewBox','0 -5 10 10').attr('refX',8)
      .attr('markerWidth',6).attr('markerHeight',6).attr('orient','auto')
      .append('path').attr('d','M0,-5L10,0L0,5').attr('fill',C.tan);

    svg.selectAll('circle.dot07').data(d07).join('circle').attr('class','dot07')
      .attr('cx',d=>x(d.gdpPercap)).attr('cy',d=>y(d.lifeExp)).attr('r',3)
      .attr('fill',d=>d.country==='South Korea'?C.gold:d.country==='Nigeria'?C.green:C.tan)
      .attr('opacity',d=>highlight.includes(d.country)?0.9:0.25);

    label(svg,'GDP per capita (log)', IW/2, IH+32, C.tan);
  }

  // ── P2-MAIN: Dual GDP line Korea + Nigeria 1952-1990 (Step 9) ─────────────
  async function P2_MAIN(el, titleEl) {
    setTitle(titleEl, 'GDP per Capita: Korea vs Nigeria, 1952–1990');
    const data = (await gap()).filter(d =>
      ['South Korea','Nigeria'].includes(d.country) && d.year <= 1992);
    const svg = _twoLineChart(el, data, 1952, 1992);
    if (svg) {
      vLine(svg, svg._xScale, 1967, 'Oil exports begin');
      vLine(svg, svg._xScale, 1979, 'Oil peak');
      vLine(svg, svg._xScale, 1982, 'Oil crash');
    }
  }

  // P2-A1: Nigeria GDP + oil price overlay
  async function P2_A1(el, titleEl) {
    setTitle(titleEl, 'Nigeria GDP vs Global Oil Price, 1960–1990');
    const nig = (await gap()).filter(d => d.country==='Nigeria' && d.year>=1960 && d.year<=1990);
    const svg  = baseSvg(el);
    const x    = d3.scaleLinear().domain([1960,1990]).range([0,IW]);
    const yG   = d3.scaleLinear().domain([0,d3.max(nig,d=>d.gdpPercap)*1.15]).range([IH,0]);
    const yO   = d3.scaleLinear().domain([0,40]).range([IH,0]);

    gridH(svg, yG);
    svg.append('g').attr('transform',`translate(0,${IH})`).call(d3.axisBottom(x).tickFormat(d3.format('d'))).call(styleAxis);
    svg.append('g').call(d3.axisLeft(yG).ticks(5)).call(styleAxis);
    svg.append('g').attr('transform',`translate(${IW},0)`)
      .call(d3.axisRight(yO).ticks(5)).call(styleAxis);

    const lineG = d3.line().x(d=>x(d.year)).y(d=>yG(d.gdpPercap)).curve(d3.curveMonotoneX);
    const lineO = d3.line().x(d=>x(d[0])).y(d=>yO(d[1])).curve(d3.curveMonotoneX);

    svg.append('path').datum(nig).attr('d',lineG)
      .attr('fill','none').attr('stroke',C.green).attr('stroke-width',2.5);
    svg.append('path').datum(OIL_PRICE.filter(d=>d[0]>=1960&&d[0]<=1990))
      .attr('d',lineO).attr('fill','none').attr('stroke',C.copper)
      .attr('stroke-width',1.5).attr('stroke-dasharray','5,3');

    legend(svg,[['Nigeria GDP',C.green],['Oil price (right axis)',C.copper]], IW-130, 0);
  }

  // P2-A2: Norway + Nigeria + Saudi Arabia GDP 1969-2007
  async function P2_A2(el, titleEl) {
    setTitle(titleEl, 'Oil Windfall: Norway vs Nigeria vs Saudi Arabia');
    const data = (await gap()).filter(d =>
      ['Norway','Nigeria','Saudi Arabia'].includes(d.country) && d.year>=1967);
    const svg  = baseSvg(el);
    const x    = d3.scaleLinear().domain([1967,2007]).range([0,IW]);
    const y    = d3.scaleLinear()
      .domain([0, d3.max(data, d=>d.gdpPercap)*1.1]).range([IH,0]);
    const cols = { Norway:'#6b8fa3', Nigeria:C.green, 'Saudi Arabia':C.copper };

    gridH(svg, y);
    svg.append('g').attr('transform',`translate(0,${IH})`).call(d3.axisBottom(x).tickFormat(d3.format('d'))).call(styleAxis);
    svg.append('g').call(d3.axisLeft(y).ticks(5,'~s')).call(styleAxis);

    ['Norway','Nigeria','Saudi Arabia'].forEach(name => {
      const series = data.filter(d=>d.country===name).sort((a,b)=>a.year-b.year);
      svg.append('path')
        .datum(series)
        .attr('d', d3.line().x(d=>x(d.year)).y(d=>y(d.gdpPercap)).curve(d3.curveMonotoneX))
        .attr('fill','none').attr('stroke',cols[name]).attr('stroke-width',2);
    });

    vLine(svg, x, 1969, 'Norway oil');
    legend(svg,[['Norway','#6b8fa3'],['Nigeria',C.green],['Saudi Arabia',C.copper]], IW-100, 0);
  }

  // P2-B1: Korea export composition stacked area
  function P2_B1(el, titleEl) {
    setTitle(titleEl, "Korea's Export Composition, 1960–1987");
    const { years, textiles, steel, electronics, other } = KOREA_EXPORTS;
    const keys = ['textiles','steel','electronics','other'];
    const data = years.map((yr,i) => ({ year:yr, textiles:textiles[i], steel:steel[i], electronics:electronics[i], other:other[i] }));
    const stack = d3.stack().keys(keys)(data);
    const svg   = baseSvg(el);
    const x     = d3.scaleLinear().domain([1960,1987]).range([0,IW]);
    const y     = d3.scaleLinear().domain([0, d3.max(stack[stack.length-1], d=>d[1])*1.1]).range([IH,0]);
    const cols  = [C.gold, C.copper, '#6b8fa3', C.tan];

    gridH(svg, y);
    svg.append('g').attr('transform',`translate(0,${IH})`).call(d3.axisBottom(x).tickFormat(d3.format('d'))).call(styleAxis);
    svg.append('g').call(d3.axisLeft(y).ticks(5,'~s')).call(styleAxis);

    const area = d3.area().x(d=>x(d.data.year)).y0(d=>y(d[0])).y1(d=>y(d[1])).curve(d3.curveMonotoneX);
    stack.forEach((layer, i) => {
      svg.append('path').datum(layer).attr('d',area)
        .attr('fill', cols[i]).attr('opacity', 0.75);
    });
    legend(svg,[['Textiles',C.gold],['Steel/Chemicals',C.copper],['Electronics','#6b8fa3']], IW-115, 0);
    label(svg,'Export revenue ($B)', -IH/2, -42, C.tan);
  }

  // P2-B2: Korea economic plans vs political events (timeline)
  function P2_B2(el, titleEl) {
    setTitle(titleEl, "Korea's Economic Miracle & Political Context");
    const economic = [
      [1962,'1st 5-Year Plan — textiles','E'],
      [1967,'2nd Plan — manufacturing','E'],
      [1970,'Samsung TVs (gov. mandate)','E'],
      [1972,'3rd Plan — heavy industry','E'],
      [1980,'4th Plan — electronics begins','E'],
      [1987,'Memory chips, exports $47B','E'],
    ];
    const political = [
      [1961,'Military coup — Park takes power','P'],
      [1963,'Labor laws restricting unions','P'],
      [1972,'Yushin: elections removed','P'],
      [1975,'Political arrests peak','P'],
      [1979,'Park Chung-hee assassinated','P'],
      [1987,'Democracy restored','P'],
    ];
    _timelineChart(el, economic, political);
  }

  // P2-C1: Nigeria total GDP vs per capita
  async function P2_C1(el, titleEl) {
    setTitle(titleEl, 'Nigeria: Total GDP vs GDP per Capita, 1952–1990');
    const nig = (await gap()).filter(d=>d.country==='Nigeria'&&d.year<=1992);
    const svg  = baseSvg(el);
    const x    = d3.scaleLinear().domain([1952,1992]).range([0,IW]);
    const yPC  = d3.scaleLinear().domain([0,d3.max(nig,d=>d.gdpPercap)*1.2]).range([IH,0]);
    const yPop = d3.scaleLinear().domain([0,d3.max(nig,d=>d.pop)*1.1]).range([IH,0]);

    gridH(svg, yPC);
    svg.append('g').attr('transform',`translate(0,${IH})`).call(d3.axisBottom(x).tickFormat(d3.format('d'))).call(styleAxis);
    svg.append('g').call(d3.axisLeft(yPC).ticks(4,'~s')).call(styleAxis);
    svg.append('g').attr('transform',`translate(${IW},0)`)
      .call(d3.axisRight(yPop).ticks(4,'~s')).call(styleAxis);

    const linePC  = d3.line().x(d=>x(d.year)).y(d=>yPC(d.gdpPercap)).curve(d3.curveMonotoneX);
    const linePop = d3.line().x(d=>x(d.year)).y(d=>yPop(d.pop)).curve(d3.curveMonotoneX);

    svg.append('path').datum(nig).attr('d',linePC)
      .attr('fill','none').attr('stroke',C.green).attr('stroke-width',2.5);
    svg.append('path').datum(nig).attr('d',linePop)
      .attr('fill','none').attr('stroke',C.tan).attr('stroke-width',1.5).attr('stroke-dasharray','5,3');

    legend(svg,[['GDP per capita',C.green],['Population (right)',C.tan]], IW-130, 0);
  }

  // P2-C2: Fertility rate Korea vs Nigeria
  function P2_C2(el, titleEl) {
    setTitle(titleEl, 'Fertility Rate: Korea vs Nigeria, 1952–1990');
    _fertilityChart(el, 1952, 1992);
  }

  // P3-MAIN: Four Asian tigers + Nigeria
  async function P3_MAIN(el, titleEl) {
    setTitle(titleEl, 'The Asian Tigers vs Nigeria, 1952–2007');
    const countries = ['South Korea','Singapore','Hong Kong, China','Taiwan','Nigeria'];
    const data = (await gap()).filter(d=>countries.includes(d.country));
    const svg  = baseSvg(el);
    const x    = d3.scaleLinear().domain([1952,2007]).range([0,IW]);
    const y    = d3.scaleLinear().domain([0,d3.max(data,d=>d.gdpPercap)*1.1]).range([IH,0]);
    const cols = { 'South Korea':C.gold, Singapore:'#b5622a', 'Hong Kong, China':'#8fa36b', Taiwan:'#6b8fa3', Nigeria:C.green };

    gridH(svg, y);
    svg.append('g').attr('transform',`translate(0,${IH})`).call(d3.axisBottom(x).tickFormat(d3.format('d'))).call(styleAxis);
    svg.append('g').call(d3.axisLeft(y).ticks(5,'~s')).call(styleAxis);

    countries.forEach(name => {
      const series = data.filter(d=>d.country===name).sort((a,b)=>a.year-b.year);
      svg.append('path').datum(series)
        .attr('d', d3.line().x(d=>x(d.year)).y(d=>y(d.gdpPercap)).curve(d3.curveMonotoneX))
        .attr('fill','none').attr('stroke',cols[name])
        .attr('stroke-width', name==='Nigeria'?2.5:2)
        .attr('stroke-dasharray', name==='Nigeria'?'none':'none')
        .attr('opacity', name==='Nigeria'?1:0.85);
    });
    legend(svg,[['Korea',C.gold],['Singapore','#b5622a'],['Hong Kong','#8fa36b'],['Taiwan','#6b8fa3'],['Nigeria',C.green]], IW-75, 0);
  }

  // P3-A1: East Asia map — simplified text/annotation version
  function P3_A1(el, titleEl) {
    setTitle(titleEl, 'Cold War Geography: US Allies in East Asia');
    _infoPanel(el, [
      { label:'South Korea', note:'US military bases 1950–. Preferential trade access. $6B aid.' },
      { label:'Taiwan',      note:'7th Fleet protection 1950. US aid & trade access.' },
      { label:'Hong Kong',   note:'British colony — access to Western markets built in.' },
      { label:'Singapore',   note:'Strategic port. US naval access. Western trade hub.' },
      { label:'Nigeria',     note:'No Cold War strategic value. No preferential access.' },
    ], 'Why the Asian Tigers had an open door — geopolitics, not charity');
  }

  // P3-A2: US military presence & trade deals
  function P3_A2(el, titleEl) {
    setTitle(titleEl, 'US Strategic Presence vs African Engagement, 1950–1980');
    _infoPanel(el, [
      { label:'US Bases (E. Asia)', note:'Korea 40k troops, Japan 50k, Taiwan strait patrols, Philippines 20k' },
      { label:'Trade deals',        note:'Korea GATT access 1967, Taiwan GATT 1965, HK/Singapore open ports' },
      { label:'Aid (Korea)',        note:'$6B grants 1945–70 ≈ $60B in 2007 dollars' },
      { label:'Aid (W. Africa)',    note:'Mostly loans, not grants. Structural Adjustment conditions attached.' },
      { label:'IMF to Nigeria',     note:'Structural Adjustment 1986: cut health & education spending mandated' },
    ], 'The door was open for specific countries for specific geopolitical reasons');
  }

  // P3-B1: Korea 5-Year Plans vs GDP growth
  function P3_B1(el, titleEl) {
    setTitle(titleEl, "Korea's Five-Year Plans: Targets vs Achieved");
    _planChart(el, KOREA_PLANS, C.gold, '% annual GDP growth');
  }

  // P3-B2: Nigeria development plans
  function P3_B2(el, titleEl) {
    setTitle(titleEl, "Nigeria's Development Plans: Targets vs Achieved");
    _planChart(el, NIG_PLANS, C.green, '% annual GDP growth');
  }

  // P3-C1: 4-panel fertility vs GDP each tiger
  async function P3_C1(el, titleEl) {
    setTitle(titleEl, 'Demographic Dividend: Fertility vs Growth, Asian Tigers');
    const data   = await gap();
    const tigers = ['South Korea','Singapore','Taiwan'];
    el.innerHTML = '';
    const grid = d3.select(el).append('div')
      .style('display','grid').style('grid-template-columns','1fr 1fr')
      .style('gap','4px').style('height','100%');

    tigers.concat(['Nigeria']).forEach(name => {
      const gapData = data.filter(d=>d.country===name&&d.year>=1960&&d.year<=1990);
      const fertKey = name==='South Korea'?'South Korea':name==='Nigeria'?'Nigeria':'South Korea';
      const fert    = (FERTILITY[fertKey]||FERTILITY['South Korea']).filter(([y])=>y>=1960&&y<=1990);

      const wrap = grid.append('div').style('position','relative');
      const svg  = wrap.append('svg').attr('width','100%').attr('viewBox',`0 0 240 120`)
        .append('g').attr('transform','translate(32,10)');
      const iw = 240-42, ih = 120-25;
      const x  = d3.scaleLinear().domain([1960,1990]).range([0,iw]);
      const yG = d3.scaleLinear().domain([0,d3.max(gapData,d=>d.gdpPercap)*1.2]).range([ih,0]);
      const yF = d3.scaleLinear().domain([0,8]).range([ih,0]);

      svg.append('g').attr('transform',`translate(0,${ih})`).call(d3.axisBottom(x).ticks(3).tickFormat(d3.format('d'))).call(styleAxis);
      svg.append('g').call(d3.axisLeft(yG).ticks(3,'~s')).call(styleAxis);

      svg.append('path').datum(gapData)
        .attr('d',d3.line().x(d=>x(d.year)).y(d=>yG(d.gdpPercap)).curve(d3.curveMonotoneX))
        .attr('fill','none').attr('stroke',name==='Nigeria'?C.green:C.gold).attr('stroke-width',1.5);
      svg.append('path').datum(fert)
        .attr('d',d3.line().x(d=>x(d[0])).y(d=>yF(d[1])).curve(d3.curveMonotoneX))
        .attr('fill','none').attr('stroke',C.copper).attr('stroke-width',1.5).attr('stroke-dasharray','3,2');

      svg.append('text').attr('x',iw/2).attr('y',-2).attr('text-anchor','middle')
        .attr('fill',C.cream).style('font-size','8px').style('font-family','Playfair Display,serif')
        .text(name==='South Korea'?'Korea':name);
    });
  }

  // P3-C2: Fertility Korea vs Nigeria full range
  function P3_C2(el, titleEl) {
    setTitle(titleEl, 'Fertility Rate: Korea vs Nigeria, 1952–2007');
    _fertilityChart(el, 1952, 2007);
  }

  // P4-MAIN: Population animated area Korea vs Nigeria
  async function P4_MAIN(el, titleEl) {
    setTitle(titleEl, 'Population Growth: Korea vs Nigeria, 1952–2007');
    const korea = (await gap()).filter(d=>d.country==='South Korea').sort((a,b)=>a.year-b.year);
    const nig   = (await gap()).filter(d=>d.country==='Nigeria').sort((a,b)=>a.year-b.year);
    const svg   = baseSvg(el);
    const x     = d3.scaleLinear().domain([1952,2007]).range([0,IW]);
    const y     = d3.scaleLinear().domain([0,150e6]).range([IH,0]);
    const area  = country => d3.area().x(d=>x(d.year)).y0(IH).y1(d=>y(d.pop)).curve(d3.curveMonotoneX)(country);

    gridH(svg, y);
    svg.append('g').attr('transform',`translate(0,${IH})`).call(d3.axisBottom(x).tickFormat(d3.format('d'))).call(styleAxis);
    svg.append('g').call(d3.axisLeft(y).ticks(5,'.2s')).call(styleAxis);

    svg.append('path').attr('d',area(korea)).attr('fill',C.gold).attr('opacity',0.5);
    svg.append('path').attr('d',area(nig)).attr('fill',C.green).attr('opacity',0.4);

    const lineK = d3.line().x(d=>x(d.year)).y(d=>y(d.pop)).curve(d3.curveMonotoneX);
    svg.append('path').datum(korea).attr('d',lineK).attr('fill','none').attr('stroke',C.gold).attr('stroke-width',2);
    svg.append('path').datum(nig).attr('d',lineK).attr('fill','none').attr('stroke',C.green).attr('stroke-width',2);

    legend(svg,[['Korea (×2.3)',C.gold],['Nigeria (×4.1)',C.green]], IW-110, 0);
  }

  // P4-A1: Korea fertility rate with policy markers
  function P4_A1(el, titleEl) {
    setTitle(titleEl, "Korea's Fertility Decline & Family Planning Policy");
    const data = FERTILITY['South Korea'];
    const svg  = baseSvg(el);
    const x    = d3.scaleLinear().domain([1952,2007]).range([0,IW]);
    const y    = d3.scaleLinear().domain([0,7]).range([IH,0]);

    gridH(svg, y);
    svg.append('g').attr('transform',`translate(0,${IH})`).call(d3.axisBottom(x).tickFormat(d3.format('d'))).call(styleAxis);
    svg.append('g').call(d3.axisLeft(y).ticks(5)).call(styleAxis);

    svg.append('path').datum(data)
      .attr('d',d3.line().x(d=>x(d[0])).y(d=>y(d[1])).curve(d3.curveMonotoneX))
      .attr('fill','none').attr('stroke',C.gold).attr('stroke-width',2.5);

    vLine(svg, x, 1962, 'Family planning\nprogram');
    vLine(svg, x, 1983, 'Replacement\nlevel');

    label(svg,'Children per woman', -IH/2, -42, C.tan);
  }

  // P4-A2: Historical panel — Korea family planning record
  function P4_A2(el, titleEl) {
    setTitle(titleEl, 'Korea Family Planning: Policy Record');
    _infoPanel(el, [
      { label:'1962', note:'National Family Planning Program launched alongside 1st Five-Year Plan' },
      { label:'1966', note:'First measurable fertility decline observed in census data' },
      { label:'1970s', note:'Financial penalties for families with 3+ children. Pressure on civil servants.' },
      { label:'1973', note:'Government target: replace 2-child family norm. Incentives expanded.' },
      { label:'1983', note:'Korea achieves replacement-level fertility (2.1 children/woman)' },
      { label:'Note', note:'Coercive elements documented: sterilization pressure in some regions. Program drew little international scrutiny at the time.' },
    ], 'Fertility decline was deliberate — and not entirely voluntary');
  }

  // P4-B1: Nigeria GDP by sector stacked bar
  function P4_B1(el, titleEl) {
    setTitle(titleEl, 'Nigeria: Oil vs Non-Oil GDP, 1952–2007');
    const years = NIG_GDP_SECTOR.map(d=>d[0]);
    const svg   = baseSvg(el);
    const x     = d3.scaleBand().domain(years).range([0,IW]).padding(0.15);
    const y     = d3.scaleLinear().domain([0,100]).range([IH,0]);

    svg.append('g').attr('transform',`translate(0,${IH})`)
      .call(d3.axisBottom(x).tickValues([1952,1967,1977,1987,1997,2007])).call(styleAxis);
    svg.append('g').call(d3.axisLeft(y).ticks(5)).call(styleAxis);

    NIG_GDP_SECTOR.forEach(([yr, oil, nonOil]) => {
      svg.append('rect').attr('x',x(yr)).attr('y',y(oil))
        .attr('width',x.bandwidth()).attr('height',IH-y(oil))
        .attr('fill',C.copper).attr('opacity',0.85);
      svg.append('rect').attr('x',x(yr)).attr('y',y(oil+nonOil))
        .attr('width',x.bandwidth()).attr('height',IH-y(nonOil)-(IH-y(oil+nonOil)))
        .attr('fill',C.green).attr('opacity',0.6);
    });
    legend(svg,[['Oil sector',C.copper],['Non-oil economy',C.green]], IW-110, 0);
    label(svg,'% of GDP', -IH/2, -42, C.tan);
  }

  // P4-B2: $400B oil revenue vs GDP per capita summary stat
  async function P4_B2(el, titleEl) {
    setTitle(titleEl, 'Nigeria Oil Revenue vs Outcome, 1970–2007');
    const nig07 = (await gap()).find(d=>d.country==='Nigeria'&&d.year===2007);
    el.innerHTML = '';
    const div = d3.select(el).append('div').style('display','flex')
      .style('flex-direction','column').style('align-items','center')
      .style('justify-content','center').style('height','100%').style('gap','1rem');

    [
      { top:'$400 billion', sub:'Estimated oil revenue 1970–1999', col:C.copper },
      { top:'$2,014', sub:'Nigeria GDP per capita in 2007', col:C.green },
      { top:'11×', sub:'Korea–Nigeria wealth gap, 2007', col:C.gold },
    ].forEach(({top,sub,col}) => {
      const item = div.append('div').style('text-align','center');
      item.append('div').style('font-family','Playfair Display,serif')
        .style('font-size','1.6rem').style('font-weight','700').style('color',col).text(top);
      item.append('div').style('font-family','Lora,serif').style('font-size','0.7rem')
        .style('color',C.tan).text(sub);
    });
  }

  // P4-C1: Nigeria population projections
  function P4_C1(el, titleEl) {
    setTitle(titleEl, 'Nigeria Population Scenarios, 2007–2050');
    const { years, current, decline } = NIG_PROJ;
    const svg = baseSvg(el);
    const x   = d3.scaleLinear().domain([2007,2050]).range([0,IW]);
    const y   = d3.scaleLinear().domain([0,430]).range([IH,0]);

    gridH(svg, y);
    svg.append('g').attr('transform',`translate(0,${IH})`).call(d3.axisBottom(x).ticks(5).tickFormat(d3.format('d'))).call(styleAxis);
    svg.append('g').call(d3.axisLeft(y).ticks(5)).call(styleAxis);

    const line = d3.line().x((_,i)=>x(years[i])).y(d=>y(d)).curve(d3.curveMonotoneX);
    svg.append('path').datum(current).attr('d',line)
      .attr('fill','none').attr('stroke',C.green).attr('stroke-width',2.5);
    svg.append('path').datum(decline).attr('d',line)
      .attr('fill','none').attr('stroke',C.tan).attr('stroke-width',1.5).attr('stroke-dasharray','6,3');

    legend(svg,[['Current trajectory',C.green],['If fertility declines now',C.tan]], IW-150, 0);
    label(svg,'Population (millions)', -IH/2, -42, C.tan);
  }

  // P5-MAIN: Life expectancy divergence — the key chart
  async function P5_MAIN(el, titleEl) {
    setTitle(titleEl, 'Life Expectancy: Korea vs Nigeria, 1952–2007');
    const data = (await gap()).filter(d=>['South Korea','Nigeria'].includes(d.country));
    const svg  = baseSvg(el);
    const x    = d3.scaleLinear().domain([1952,2007]).range([0,IW]);
    const y    = d3.scaleLinear().domain([30,85]).range([IH,0]);
    const byC  = d3.group(data, d=>d.country);

    gridH(svg, y);
    svg.append('g').attr('transform',`translate(0,${IH})`).call(d3.axisBottom(x).tickFormat(d3.format('d'))).call(styleAxis);
    svg.append('g').call(d3.axisLeft(y).ticks(5)).call(styleAxis);

    [['South Korea',C.gold],['Nigeria',C.green]].forEach(([name,col]) => {
      const series = (byC.get(name)||[]).sort((a,b)=>a.year-b.year);
      svg.append('path').datum(series)
        .attr('d',d3.line().x(d=>x(d.year)).y(d=>y(d.lifeExp)).curve(d3.curveMonotoneX))
        .attr('fill','none').attr('stroke',col).attr('stroke-width',2.5);
    });

    // Critical annotation: Nigeria 2007 ≈ Korea 1952
    const n07 = data.find(d=>d.country==='Nigeria'&&d.year===2007);
    const k52 = data.find(d=>d.country==='South Korea'&&d.year===1952);
    if (n07&&k52) {
      svg.append('line').attr('x1',x(2007)-2).attr('x2',x(1952)+2)
        .attr('y1',y(n07.lifeExp)).attr('y2',y(k52.lifeExp))
        .attr('stroke',C.copper).attr('stroke-width',1).attr('stroke-dasharray','3,2');
      svg.append('text').attr('x',IW/2).attr('y',y(n07.lifeExp)-5)
        .attr('text-anchor','middle').attr('fill',C.copper)
        .style('font-size','8px').style('font-family','Lora,serif')
        .text('Nigeria 2007 (46.9 yrs) ≈ Korea 1952 (47.5 yrs)');
    }
    legend(svg,[['Korea',C.gold],['Nigeria',C.green]], IW-65, 0);
    label(svg,'Life expectancy (years)', -IH/2, -42, C.tan);
  }

  // P5-A: 4-panel summary dashboard
  async function P5_A(el, titleEl) {
    setTitle(titleEl, 'The Divergence: Four Dimensions');
    const data = await gap();
    el.innerHTML = '';
    const grid = d3.select(el).append('div')
      .style('display','grid').style('grid-template-columns','1fr 1fr')
      .style('grid-template-rows','1fr 1fr').style('gap','4px').style('height','100%');

    const panels = [
      { key:'gdpPercap',  title:'GDP per capita ($)',    fmt:'.2s' },
      { key:'lifeExp',    title:'Life expectancy (yrs)', fmt:'.1f' },
      { key:'pop',        title:'Population',            fmt:'.2s' },
    ];
    panels.forEach(({ key, title, fmt }) => {
      const wrap = grid.append('div');
      const kor  = data.filter(d=>d.country==='South Korea').sort((a,b)=>a.year-b.year);
      const nig  = data.filter(d=>d.country==='Nigeria').sort((a,b)=>a.year-b.year);
      const all  = [...kor,...nig];
      const svg  = wrap.append('svg').attr('width','100%').attr('viewBox',`0 0 240 120`)
        .append('g').attr('transform','translate(36,8)');
      const iw = 240-46, ih = 120-24;
      const x  = d3.scaleLinear().domain([1952,2007]).range([0,iw]);
      const y  = d3.scaleLinear().domain([0,d3.max(all,d=>d[key])*1.1]).range([ih,0]);

      svg.append('g').attr('transform',`translate(0,${ih})`).call(d3.axisBottom(x).ticks(3).tickFormat(d3.format('d'))).call(styleAxis);
      svg.append('g').call(d3.axisLeft(y).ticks(3,fmt)).call(styleAxis);

      [['South Korea',C.gold,kor],['Nigeria',C.green,nig]].forEach(([,col,series]) => {
        svg.append('path').datum(series)
          .attr('d',d3.line().x(d=>x(d.year)).y(d=>y(d[key])).curve(d3.curveMonotoneX))
          .attr('fill','none').attr('stroke',col).attr('stroke-width',1.8);
      });
      svg.append('text').attr('x',iw/2).attr('y',-1).attr('text-anchor','middle')
        .attr('fill',C.cream).style('font-size','7.5px').style('font-family','Playfair Display,serif')
        .text(title);
    });
    // 4th panel: text stat
    const p4 = grid.append('div').style('display','flex').style('flex-direction','column')
      .style('justify-content','center').style('align-items','center').style('gap','0.4rem');
    [['11×','Wealth gap, 2007',C.gold],['32 yrs','Life expectancy gap',C.green],['1952','Same starting year',C.copper]]
      .forEach(([big,small,col])=>{
        const w = p4.append('div').style('text-align','center');
        w.append('div').style('color',col).style('font-family','Playfair Display,serif')
          .style('font-size','1.4rem').style('font-weight','700').text(big);
        w.append('div').style('color',C.tan).style('font-size','0.65rem')
          .style('font-family','Lora,serif').text(small);
      });
  }

  // P5-B: Timeline of external factors
  function P5_B(el, titleEl) {
    setTitle(titleEl, "What the GDP Chart Doesn't Show — Nigeria's External Context");
    _infoPanel(el, [
      { label:'1960', note:'Independence. Colonial debt inherited. Oil contracts signed before Nigeria had trained lawyers.' },
      { label:'1965', note:'Shell/BP profit-sharing terms: 50–85% of oil revenue to foreign companies initially.' },
      { label:'1970s', note:'Oil boom: $400B earned 1970–1999. Most via contracts structured to favour multinationals.' },
      { label:'1986', note:'IMF Structural Adjustment: mandated cuts to health, education, fuel subsidies. Korea never faced this.' },
      { label:'1990s', note:'Capital flight: estimated $100B+ in elite assets held in European/US accounts, not invested domestically.' },
      { label:'Parallel', note:'Korea: US aid ($6B grants), preferential trade access, NO structural adjustment conditionality.' },
    ], 'The gap was built from the outside as much as from within');
  }

  // P5-C: Animated scatter 1952→2007 (slider version)
  async function P5_C(el, titleEl) {
    setTitle(titleEl, 'Global Development, 1952–2007');
    const allData = await gap();
    const years   = [...new Set(allData.map(d=>d.year))].sort();
    el.innerHTML  = '';

    const wrap = d3.select(el).append('div').style('position','relative');
    const svgEl = wrap.append('svg').attr('width','100%').attr('viewBox',`0 0 ${W} ${H-20}`)
      .attr('preserveAspectRatio','xMidYMid meet');
    const g = svgEl.append('g').attr('transform',`translate(${M.left},${M.top})`);

    const ih2 = H - 20 - M.top - M.bottom;
    const x   = d3.scaleLog().domain([200,50000]).range([0,IW]);
    const y   = d3.scaleLinear().domain([20,85]).range([ih2,0]);
    const r   = d3.scaleSqrt().domain([0,1.3e9]).range([2,18]);

    g.append('g').attr('class','gridlines').call(
      d3.axisLeft(y).ticks(5).tickSize(-IW).tickFormat('')
    ).call(gg=>{gg.select('.domain').remove();gg.selectAll('line').attr('stroke',C.gridLine).attr('stroke-dasharray','2,3');});

    g.append('g').attr('transform',`translate(0,${ih2})`).call(d3.axisBottom(x).ticks(4,'~s')).call(styleAxis);
    g.append('g').call(d3.axisLeft(y).ticks(5)).call(styleAxis);

    const yearLabel = g.append('text').attr('x',IW-4).attr('y',ih2-6)
      .attr('text-anchor','end').attr('fill',C.tan)
      .style('font-family','Playfair Display,serif').style('font-size','20px').style('opacity',0.4);

    function draw(yr) {
      const d = allData.filter(dd=>dd.year===yr);
      yearLabel.text(yr);
      const circles = g.selectAll('circle.dot').data(d, dd=>dd.country);
      circles.join('circle').attr('class','dot')
        .attr('cx',dd=>x(dd.gdpPercap)).attr('cy',dd=>y(dd.lifeExp)).attr('r',dd=>r(dd.pop))
        .attr('fill',dd=>dd.country==='South Korea'?C.gold:dd.country==='Nigeria'?C.green:C.tan)
        .attr('opacity',dd=>['South Korea','Nigeria'].includes(dd.country)?0.9:0.3)
        .attr('stroke',dd=>['South Korea','Nigeria'].includes(dd.country)?'white':'none')
        .attr('stroke-width',0.5);
    }
    draw(1952);

    // Slider
    const sliderWrap = wrap.append('div').style('display','flex').style('align-items','center')
      .style('gap','0.5rem').style('padding','0 1rem');
    sliderWrap.append('span').style('color',C.tan).style('font-size','0.65rem')
      .style('font-family','Lora,serif').text('1952');
    const slider = sliderWrap.append('input').attr('type','range')
      .attr('min',0).attr('max',years.length-1).attr('value',0).attr('step',1)
      .style('flex','1').style('accent-color',C.copper);
    sliderWrap.append('span').style('color',C.tan).style('font-size','0.65rem')
      .style('font-family','Lora,serif').text('2007');
    slider.on('input', function() { draw(years[+this.value]); });
  }

  // E-A: Korea's journey on scatter
  async function E_A(el, titleEl) {
    setTitle(titleEl, "Korea's 55-Year Journey");
    const data = (await gap()).filter(d=>d.country==='South Korea').sort((a,b)=>a.year-b.year);
    const all  = await gap();
    const svg  = baseSvg(el);
    const x    = d3.scaleLog().domain([200,50000]).range([0,IW]);
    const y    = d3.scaleLinear().domain([20,85]).range([IH,0]);

    gridH(svg, y);
    svg.append('g').attr('transform',`translate(0,${IH})`).call(d3.axisBottom(x).ticks(4,'~s')).call(styleAxis);
    svg.append('g').call(d3.axisLeft(y).ticks(5)).call(styleAxis);

    // Background dots 2007
    svg.selectAll('circle.bg').data(all.filter(d=>d.year===2007)).join('circle').attr('class','bg')
      .attr('cx',d=>x(d.gdpPercap)).attr('cy',d=>y(d.lifeExp)).attr('r',3)
      .attr('fill',C.tan).attr('opacity',0.2);

    // Korea path
    svg.append('path').datum(data)
      .attr('d',d3.line().x(d=>x(d.gdpPercap)).y(d=>y(d.lifeExp)))
      .attr('fill','none').attr('stroke',C.gold).attr('stroke-width',2.5);

    svg.append('circle').attr('cx',x(data[0].gdpPercap)).attr('cy',y(data[0].lifeExp)).attr('r',5)
      .attr('fill',C.gold).attr('opacity',0.5);
    svg.append('circle').attr('cx',x(data[data.length-1].gdpPercap)).attr('cy',y(data[data.length-1].lifeExp)).attr('r',7)
      .attr('fill',C.gold);
    label(svg,'1952',x(data[0].gdpPercap)+6,y(data[0].lifeExp),C.gold);
    label(svg,'2007',x(data[data.length-1].gdpPercap)+6,y(data[data.length-1].lifeExp)-6,C.gold);
  }

  // E-B: Nigeria stuck in the cluster
  async function E_B(el, titleEl) {
    setTitle(titleEl, "Nigeria's Position, 2007");
    await E_A(el, titleEl); // reuse same scatter
    // Override title
    setTitle(titleEl, "Nigeria's Position, 2007 — Stuck in the Cluster");
  }

  // E-C: Full animated scatter (same as P5-C)
  async function E_C(el, titleEl) {
    return P5_C(el, titleEl);
  }

  // ── SHARED CHART BUILDERS ─────────────────────────────────────────────────

  // Two-line GDP chart — returns svg with _xScale attached
  async function _twoLineChart(el, data, yr0, yr1) {
    const svg   = baseSvg(el);
    const x     = d3.scaleLinear().domain([yr0, yr1]).range([0, IW]);
    const y     = d3.scaleLinear().domain([0, d3.max(data, d => d.gdpPercap) * 1.1]).range([IH, 0]);
    const byC   = d3.group(data, d => d.country);

    gridH(svg, y);
    svg.append('g').attr('transform', `translate(0,${IH})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d'))).call(styleAxis);
    svg.append('g').call(d3.axisLeft(y).ticks(5, '~s')).call(styleAxis);

    [['South Korea', C.gold], ['Nigeria', C.green]].forEach(([name, col]) => {
      const series = (byC.get(name) || []).sort((a, b) => a.year - b.year);
      svg.append('path').datum(series)
        .attr('d', d3.line().x(d => x(d.year)).y(d => y(d.gdpPercap)).curve(d3.curveMonotoneX))
        .attr('fill', 'none').attr('stroke', col).attr('stroke-width', 2.5);
    });

    legend(svg, [['Korea', C.gold], ['Nigeria', C.green]], IW - 65, 0);
    label(svg, 'GDP per capita (USD)', -IH / 2, -42, C.tan);
    svg._xScale = x;
    return svg;
  }

  // Fertility line chart helper
  function _fertilityChart(el, yr0, yr1) {
    const svg = baseSvg(el);
    const x   = d3.scaleLinear().domain([yr0, yr1]).range([0, IW]);
    const y   = d3.scaleLinear().domain([0, 8]).range([IH, 0]);

    gridH(svg, y);
    svg.append('g').attr('transform', `translate(0,${IH})`).call(d3.axisBottom(x).tickFormat(d3.format('d'))).call(styleAxis);
    svg.append('g').call(d3.axisLeft(y).ticks(5)).call(styleAxis);

    [['South Korea', C.gold], ['Nigeria', C.green]].forEach(([name, col]) => {
      const series = (FERTILITY[name] || []).filter(d => d[0] >= yr0 && d[0] <= yr1);
      svg.append('path').datum(series)
        .attr('d', d3.line().x(d => x(d[0])).y(d => y(d[1])).curve(d3.curveMonotoneX))
        .attr('fill', 'none').attr('stroke', col).attr('stroke-width', 2.5);
    });
    legend(svg, [['Korea', C.gold], ['Nigeria', C.green]], IW - 65, 0);
    label(svg, 'Children per woman', -IH / 2, -42, C.tan);
  }

  // Plan bar chart helper (targets vs actual)
  function _planChart(el, plans, col, yLabel) {
    const svg = baseSvg(el);
    const x   = d3.scaleBand().domain(plans.map((_, i) => i)).range([0, IW]).padding(0.25);
    const y   = d3.scaleLinear().domain([-2, 13]).range([IH, 0]);
    const bw  = x.bandwidth() / 2;

    svg.append('line').attr('x1', 0).attr('x2', IW).attr('y1', y(0)).attr('y2', y(0))
      .attr('stroke', C.axisLine).attr('stroke-width', 1);

    svg.append('g').attr('transform', `translate(0,${IH})`).call(
      d3.axisBottom(x).tickFormat(i => plans[i].plan.split('\n')[0])
    ).call(styleAxis);
    svg.append('g').call(d3.axisLeft(y).ticks(5)).call(styleAxis);

    plans.forEach((p, i) => {
      const xx = x(i);
      svg.append('rect').attr('x', xx).attr('y', y(Math.max(0, p.target)))
        .attr('width', bw).attr('height', Math.abs(y(p.target) - y(0)))
        .attr('fill', C.tan).attr('opacity', 0.6);
      svg.append('rect').attr('x', xx + bw).attr('y', y(Math.max(0, p.actual)))
        .attr('width', bw).attr('height', Math.abs(y(p.actual) - y(0)))
        .attr('fill', col).attr('opacity', 0.85);
    });
    legend(svg, [['Target', C.tan], ['Actual', col]], IW - 70, 0);
    label(svg, yLabel, -IH / 2, -42, C.tan);
  }

  // Timeline two-column chart
  function _timelineChart(el, economic, political) {
    el.innerHTML = '';
    const div = d3.select(el).append('div').style('display','grid')
      .style('grid-template-columns','1fr 1fr').style('gap','8px')
      .style('height','100%').style('padding','4px 8px');

    [['Economic Achievements', economic, C.gold], ['Political Context', political, C.copper]]
      .forEach(([heading, events, col]) => {
        const col2 = div.append('div');
        col2.append('div').style('color', col).style('font-family','Playfair Display,serif')
          .style('font-size','0.7rem').style('font-weight','700')
          .style('margin-bottom','0.3rem').text(heading);
        events.forEach(([yr, text]) => {
          const row = col2.append('div').style('display','flex').style('gap','0.4rem')
            .style('margin-bottom','0.2rem').style('align-items','flex-start');
          row.append('span').style('color', col).style('font-family','Playfair Display,serif')
            .style('font-size','0.65rem').style('font-weight','700').style('min-width','2.5rem').text(yr);
          row.append('span').style('color', C.tan).style('font-family','Lora,serif')
            .style('font-size','0.65rem').style('line-height','1.3').text(text);
        });
      });
  }

  // Info panel for non-chart content
  function _infoPanel(el, items, subtitle) {
    el.innerHTML = '';
    const div = d3.select(el).append('div').style('padding','6px 10px')
      .style('height','100%').style('display','flex').style('flex-direction','column').style('gap','4px');

    if (subtitle) {
      div.append('div').style('color', C.tan).style('font-family','Lora,serif')
        .style('font-style','italic').style('font-size','0.7rem').style('margin-bottom','2px').text(subtitle);
    }
    items.forEach(({ label: lbl, note }) => {
      const row = div.append('div').style('display','flex').style('gap','0.5rem').style('align-items','flex-start');
      row.append('span').style('color', C.copper).style('font-family','Playfair Display,serif')
        .style('font-size','0.65rem').style('font-weight','700').style('min-width','3rem').style('flex-shrink','0').text(lbl);
      row.append('span').style('color', C.tan).style('font-family','Lora,serif')
        .style('font-size','0.65rem').style('line-height','1.35').text(note);
    });
  }

  // ── PUBLIC REGISTRY ───────────────────────────────────────────────────────
  return {
    'P1-MAIN': P1_MAIN,
    'P1-A1':   P1_A1,
    'P1-A2':   P1_A2,
    'P1-B1':   P1_B1,
    'P1-B2':   P1_B2,
    'P1-C1':   P1_C1,
    'P2-MAIN': P2_MAIN,
    'P2-A1':   P2_A1,
    'P2-A2':   P2_A2,
    'P2-B1':   P2_B1,
    'P2-B2':   P2_B2,
    'P2-C1':   P2_C1,
    'P2-C2':   P2_C2,
    'P3-MAIN': P3_MAIN,
    'P3-A1':   P3_A1,
    'P3-A2':   P3_A2,
    'P3-B1':   P3_B1,
    'P3-B2':   P3_B2,
    'P3-C1':   P3_C1,
    'P3-C2':   P3_C2,
    'P4-MAIN': P4_MAIN,
    'P4-A1':   P4_A1,
    'P4-A2':   P4_A2,
    'P4-B1':   P4_B1,
    'P4-B2':   P4_B2,
    'P4-C1':   P4_C1,
    'P5-MAIN': P5_MAIN,
    'P5-A':    P5_A,
    'P5-B':    P5_B,
    'P5-C':    P5_C,
    'E-A':     E_A,
    'E-B':     E_B,
    'E-C':     E_C,
  };
})();

window.Charts = Charts;
