/* ====================================
   SLIDING WINDOW MASTERY — App Logic
   Interactive Visualizations Engine
   ==================================== */

// ======================== UTILITIES ========================
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function copyCode(btn) {
  const code = btn.closest('.code-block').querySelector('code').textContent;
  navigator.clipboard.writeText(code);
  btn.textContent = '✅ Copied!';
  setTimeout(() => btn.textContent = '📋 Copy', 1500);
}

// ======================== INIT ========================
document.addEventListener('DOMContentLoaded', () => {
  hljs.highlightAll();
  initScrollAnimations();
  initNavbar();
  vizP1.init();
  vizP2.init();
  vizP3.init();
  vizP4.init();
  vizP5.init();
  vizP6.init();
  vizP7.init();
  vizP8.init();
});

// ======================== NAVBAR ========================
function initNavbar() {
  const nav = $('#navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
  // Smooth scroll for nav links
  $$('.nav-links a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ======================== SCROLL ANIMATIONS ========================
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  $$('.fade-in').forEach(el => observer.observe(el));
}

// ======================== HELPER: Build array cells ========================
function renderArray(containerId, arr, windowLeft, windowRight, options = {}) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  arr.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.className = 'array-cell';
    if (i >= windowLeft && i <= windowRight) cell.classList.add('in-window');
    if (options.entering === i) cell.classList.add('entering');
    if (options.leaving === i) cell.classList.add('leaving');
    if (options.highlight && options.highlight.includes(i)) cell.classList.add('highlight');
    const idx = document.createElement('span');
    idx.className = 'cell-index';
    idx.textContent = i;
    cell.appendChild(idx);
    cell.appendChild(document.createTextNode(val));
    container.appendChild(cell);
  });
}

function renderState(containerId, items) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'state-item';
    el.innerHTML = `<div class="state-label">${item.label}</div><div class="state-value ${item.cls || ''}">${item.value}</div>`;
    container.appendChild(el);
  });
}

function appendLog(logId, msg, cls = '') {
  const log = document.getElementById(logId);
  log.innerHTML += `<span class="${cls}">${msg}</span>\n`;
  log.scrollTop = log.scrollHeight;
}

function clearLog(logId) {
  document.getElementById(logId).innerHTML = '';
}

// ======================== ANIMATION HELPER ========================
class StepAnimation {
  constructor(stepFn, playBtnId) {
    this.stepFn = stepFn;
    this.playBtnId = playBtnId;
    this.playing = false;
    this.timer = null;
  }
  step() { this.stepFn(); }
  play() {
    if (this.playing) { this.pause(); return; }
    this.playing = true;
    const btn = document.getElementById(this.playBtnId);
    btn.textContent = '⏸ Pause';
    btn.classList.add('playing');
    this.timer = setInterval(() => {
      if (!this.stepFn()) { this.pause(); }
    }, 800);
  }
  pause() {
    this.playing = false;
    clearInterval(this.timer);
    const btn = document.getElementById(this.playBtnId);
    btn.textContent = '▶ Play';
    btn.classList.remove('playing');
  }
}

/* ================================================================
   PATTERN 1: Fixed Sum (Max Sum Subarray of size K)
   ================================================================ */
const vizP1 = {
  arr: [2, 1, 5, 1, 3, 2, 8, 4, 3],
  k: 3, pos: 0, windowSum: 0, maxSum: -Infinity, bestL: 0, bestR: 0, done: false, anim: null,

  init() {
    this.reset();
    this.anim = new StepAnimation(() => this.step(), 'p1-play');
  },
  reset() {
    if (this.anim) this.anim.pause();
    this.k = parseInt($('#p1-k').value) || 3;
    this.pos = 0; this.windowSum = 0; this.maxSum = -Infinity;
    this.bestL = 0; this.bestR = 0; this.done = false;
    renderArray('p1-array', this.arr, -1, -1);
    renderState('p1-state', [
      { label: 'Window Sum', value: '—' },
      { label: 'Max Sum', value: '—' },
      { label: 'Step', value: '0' },
    ]);
    clearLog('p1-log');
    appendLog('p1-log', '🚀 Ready! Click Step or Play to begin.', 'log-step');
  },
  step() {
    if (this.done) return false;
    const k = this.k, arr = this.arr, n = arr.length;
    if (this.pos < k) {
      // Priming phase
      this.windowSum += arr[this.pos];
      const entering = this.pos;
      renderArray('p1-array', arr, 0, this.pos, { entering });
      appendLog('p1-log', `[Prime] Add arr[${this.pos}]=${arr[this.pos]} → sum=${this.windowSum}`, 'log-action');
      this.pos++;
      if (this.pos === k) {
        this.maxSum = this.windowSum;
        this.bestR = k - 1;
        appendLog('p1-log', `✅ Initial window sum = ${this.windowSum}`, 'log-step');
      }
      renderState('p1-state', [
        { label: 'Window Sum', value: this.windowSum },
        { label: 'Max Sum', value: this.maxSum === -Infinity ? '—' : this.maxSum, cls: 'best' },
        { label: 'Step', value: this.pos },
      ]);
      return true;
    }
    if (this.pos < n) {
      const leaving = this.pos - k;
      const entering = this.pos;
      this.windowSum += arr[this.pos] - arr[this.pos - k];
      appendLog('p1-log', `Slide: +arr[${this.pos}]=${arr[this.pos]}, −arr[${this.pos-k}]=${arr[this.pos-k]} → sum=${this.windowSum}`, 'log-action');
      if (this.windowSum > this.maxSum) {
        this.maxSum = this.windowSum;
        this.bestL = this.pos - k + 1;
        this.bestR = this.pos;
        appendLog('p1-log', `🏆 New max! sum=${this.maxSum} at [${this.bestL}..${this.bestR}]`, 'log-step');
      }
      renderArray('p1-array', arr, this.pos - k + 1, this.pos, { entering, leaving });
      renderState('p1-state', [
        { label: 'Window Sum', value: this.windowSum },
        { label: 'Max Sum', value: this.maxSum, cls: 'best' },
        { label: 'Step', value: this.pos },
      ]);
      this.pos++;
      return true;
    }
    this.done = true;
    appendLog('p1-log', `🎉 Done! Max sum = ${this.maxSum} at indices [${this.bestL}..${this.bestR}]`, 'log-step');
    // Highlight best window
    renderArray('p1-array', arr, this.bestL, this.bestR);
    return false;
  },
  play() { this.anim.play(); },
};

/* ================================================================
   PATTERN 2: Anagram / Permutation Detection
   ================================================================ */
const vizP2 = {
  str: '', pat: '', pos: 0, sCount: null, pCount: null, matches: 0, results: [], done: false, anim: null,

  init() { this.reset(); this.anim = new StepAnimation(() => this.step(), 'p2-play'); },
  reset() {
    if (this.anim) this.anim.pause();
    this.str = ($('#p2-str').value || 'cbaebabacd').toLowerCase();
    this.pat = ($('#p2-pat').value || 'abc').toLowerCase();
    this.pos = 0; this.results = []; this.done = false;
    this.pCount = new Array(26).fill(0);
    this.sCount = new Array(26).fill(0);
    for (const c of this.pat) this.pCount[c.charCodeAt(0) - 97]++;
    this.matches = 0;
    for (let i = 0; i < 26; i++) if (this.pCount[i] === 0) this.matches++;

    renderArray('p2-array', this.str.split(''), -1, -1);
    this.renderFreq();
    renderState('p2-state', [
      { label: 'Matches', value: `${this.matches}/26` },
      { label: 'Found At', value: '—' },
    ]);
    clearLog('p2-log');
    appendLog('p2-log', `🚀 Find anagrams of "${this.pat}" in "${this.str}"`, 'log-step');
  },
  renderFreq() {
    const container = document.getElementById('p2-freq');
    container.innerHTML = '';
    // Show only chars that appear in pattern or current window
    const relevant = new Set();
    for (let i = 0; i < 26; i++) if (this.pCount[i] > 0 || this.sCount[i] > 0) relevant.add(i);
    relevant.forEach(i => {
      const el = document.createElement('div');
      el.className = 'freq-item' + (this.sCount[i] === this.pCount[i] ? ' matched' : '');
      el.innerHTML = `<span class="freq-key">${String.fromCharCode(97 + i)}</span><span class="freq-val">${this.sCount[i]}/${this.pCount[i]}</span>`;
      container.appendChild(el);
    });
  },
  step() {
    if (this.done) return false;
    const s = this.str, p = this.pat, n = s.length, pk = p.length;
    if (this.pos >= n) { this.done = true; appendLog('p2-log', `🎉 Done! Found ${this.results.length} anagram(s) at: [${this.results.join(', ')}]`, 'log-step'); return false; }

    const i = this.pos;
    // Add right char
    let idx = s.charCodeAt(i) - 97;
    this.sCount[idx]++;
    if (this.sCount[idx] === this.pCount[idx]) this.matches++;
    else if (this.sCount[idx] === this.pCount[idx] + 1) this.matches--;

    // Remove left char
    if (i >= pk) {
      idx = s.charCodeAt(i - pk) - 97;
      this.sCount[idx]--;
      if (this.sCount[idx] === this.pCount[idx]) this.matches++;
      else if (this.sCount[idx] === this.pCount[idx] - 1) this.matches--;
    }

    const wl = Math.max(0, i - pk + 1);
    const wr = i;
    const opts = {};
    if (i >= pk) opts.leaving = i - pk;
    opts.entering = i;
    if (this.matches === 26) opts.highlight = Array.from({length: pk}, (_, j) => wl + j);

    if (this.matches === 26) {
      this.results.push(wl);
      appendLog('p2-log', `✅ Anagram found at index ${wl}! "${s.slice(wl, wr+1)}"`, 'log-step');
    } else {
      appendLog('p2-log', `Step ${i}: window [${wl}..${wr}], matches=${this.matches}/26`, 'log-action');
    }

    renderArray('p2-array', s.split(''), wl, wr, opts);
    this.renderFreq();
    renderState('p2-state', [
      { label: 'Matches', value: `${this.matches}/26`, cls: this.matches === 26 ? 'best' : '' },
      { label: 'Found At', value: this.results.length ? this.results.join(', ') : '—', cls: this.results.length ? 'best' : '' },
    ]);
    this.pos++;
    return true;
  },
  play() { this.anim.play(); },
};

/* ================================================================
   PATTERN 3: Longest with K Distinct
   ================================================================ */
const vizP3 = {
  str: '', k: 2, left: 0, right: -1, freq: {}, maxLen: 0, bestL: 0, bestR: -1, done: false, anim: null,

  init() { this.reset(); this.anim = new StepAnimation(() => this.step(), 'p3-play'); },
  reset() {
    if (this.anim) this.anim.pause();
    this.str = ($('#p3-str').value || 'eceba').toLowerCase();
    this.k = parseInt($('#p3-k').value) || 2;
    this.left = 0; this.right = -1; this.freq = {}; this.maxLen = 0; this.bestL = 0; this.bestR = -1; this.done = false;
    renderArray('p3-array', this.str.split(''), -1, -1);
    this.renderFreq();
    renderState('p3-state', [
      { label: 'Distinct', value: '0' },
      { label: 'Window Len', value: '0' },
      { label: 'Max Len', value: '0' },
    ]);
    clearLog('p3-log');
    appendLog('p3-log', `🚀 Find longest substring with ≤${this.k} distinct chars in "${this.str}"`, 'log-step');
  },
  renderFreq() {
    const container = document.getElementById('p3-freq');
    container.innerHTML = '';
    Object.entries(this.freq).forEach(([k, v]) => {
      const el = document.createElement('div');
      el.className = 'freq-item';
      el.innerHTML = `<span class="freq-key">${k}</span><span class="freq-val">${v}</span>`;
      container.appendChild(el);
    });
    if (!Object.keys(this.freq).length) container.innerHTML = '<span style="color:var(--text-muted);font-size:0.8rem;">Empty</span>';
  },
  step() {
    if (this.done) return false;
    const s = this.str;
    this.right++;
    if (this.right >= s.length) {
      this.done = true;
      appendLog('p3-log', `🎉 Done! Max length = ${this.maxLen} → "${s.slice(this.bestL, this.bestR + 1)}"`, 'log-step');
      renderArray('p3-array', s.split(''), this.bestL, this.bestR);
      return false;
    }
    // Expand
    const c = s[this.right];
    this.freq[c] = (this.freq[c] || 0) + 1;
    appendLog('p3-log', `Expand: add '${c}' → freq={${Object.entries(this.freq).map(([k,v])=>k+':'+v).join(',')}}`, 'log-action');

    // Contract while violated
    while (Object.keys(this.freq).length > this.k) {
      const lc = s[this.left];
      this.freq[lc]--;
      if (this.freq[lc] === 0) delete this.freq[lc];
      appendLog('p3-log', `⚠️ Contract: remove '${lc}', left → ${this.left + 1}`, 'log-warn');
      this.left++;
    }

    const len = this.right - this.left + 1;
    if (len > this.maxLen) {
      this.maxLen = len;
      this.bestL = this.left;
      this.bestR = this.right;
      appendLog('p3-log', `🏆 New max! len=${this.maxLen} → "${s.slice(this.bestL, this.bestR+1)}"`, 'log-step');
    }

    renderArray('p3-array', s.split(''), this.left, this.right, { entering: this.right });
    this.renderFreq();
    renderState('p3-state', [
      { label: 'Distinct', value: Object.keys(this.freq).length, cls: Object.keys(this.freq).length > this.k ? 'danger' : '' },
      { label: 'Window Len', value: len },
      { label: 'Max Len', value: this.maxLen, cls: 'best' },
    ]);
    return true;
  },
  play() { this.anim.play(); },
};

/* ================================================================
   PATTERN 4: Shortest Subarray with Target Sum
   ================================================================ */
const vizP4 = {
  arr: [2, 3, 1, 2, 4, 3],
  target: 7, left: 0, right: -1, sum: 0, minLen: Infinity, bestL: -1, bestR: -1, done: false, anim: null,

  init() { this.reset(); this.anim = new StepAnimation(() => this.step(), 'p4-play'); },
  reset() {
    if (this.anim) this.anim.pause();
    this.target = parseInt($('#p4-target').value) || 7;
    this.left = 0; this.right = -1; this.sum = 0; this.minLen = Infinity; this.bestL = -1; this.bestR = -1; this.done = false;
    renderArray('p4-array', this.arr, -1, -1);
    renderState('p4-state', [
      { label: 'Sum', value: '0' },
      { label: 'Target', value: this.target },
      { label: 'Min Length', value: '∞' },
    ]);
    clearLog('p4-log');
    appendLog('p4-log', `🚀 Find shortest subarray with sum ≥ ${this.target}`, 'log-step');
  },
  step() {
    if (this.done) return false;
    const arr = this.arr, n = arr.length;
    this.right++;
    if (this.right >= n) {
      this.done = true;
      const res = this.minLen === Infinity ? 'No valid subarray' : `Min length = ${this.minLen}`;
      appendLog('p4-log', `🎉 Done! ${res}`, 'log-step');
      if (this.bestL >= 0) renderArray('p4-array', arr, this.bestL, this.bestR);
      return false;
    }
    this.sum += arr[this.right];
    appendLog('p4-log', `Expand: +arr[${this.right}]=${arr[this.right]} → sum=${this.sum}`, 'log-action');

    // Contract while valid — update INSIDE
    while (this.sum >= this.target) {
      const len = this.right - this.left + 1;
      if (len < this.minLen) {
        this.minLen = len;
        this.bestL = this.left;
        this.bestR = this.right;
        appendLog('p4-log', `🏆 Valid! len=${len}, better min! [${this.left}..${this.right}]`, 'log-step');
      }
      this.sum -= arr[this.left];
      appendLog('p4-log', `Contract: −arr[${this.left}]=${arr[this.left]}, left → ${this.left + 1}`, 'log-warn');
      this.left++;
    }

    renderArray('p4-array', arr, this.left, this.right, { entering: this.right });
    renderState('p4-state', [
      { label: 'Sum', value: this.sum, cls: this.sum >= this.target ? 'best' : '' },
      { label: 'Target', value: this.target },
      { label: 'Min Length', value: this.minLen === Infinity ? '∞' : this.minLen, cls: this.minLen < Infinity ? 'best' : '' },
    ]);
    return true;
  },
  play() { this.anim.play(); },
};

/* ================================================================
   PATTERN 5: Monotonic Deque — Sliding Window Maximum
   ================================================================ */
const vizP5 = {
  arr: [1, 3, -1, -3, 5, 3, 6, 7],
  k: 3, pos: -1, dq: [], results: [], done: false, anim: null,

  init() { this.reset(); this.anim = new StepAnimation(() => this.step(), 'p5-play'); },
  reset() {
    if (this.anim) this.anim.pause();
    this.k = parseInt($('#p5-k').value) || 3;
    this.pos = -1; this.dq = []; this.results = []; this.done = false;
    renderArray('p5-array', this.arr, -1, -1);
    this.renderDeque();
    renderState('p5-state', [
      { label: 'Current Max', value: '—' },
      { label: 'Results', value: '[ ]' },
    ]);
    clearLog('p5-log');
    appendLog('p5-log', `🚀 Sliding Window Maximum, k=${this.k}`, 'log-step');
  },
  renderDeque() {
    const container = document.getElementById('p5-deque');
    container.innerHTML = '<span class="deque-label">Deque:</span>';
    this.dq.forEach((idx, i) => {
      const el = document.createElement('div');
      el.className = 'deque-item' + (i === 0 ? ' front' : '');
      el.innerHTML = `<span title="idx=${idx}">${this.arr[idx]}</span>`;
      container.appendChild(el);
    });
    if (!this.dq.length) container.innerHTML += '<span style="color:var(--text-muted);font-size:0.8rem;margin-left:8px;">empty</span>';
  },
  step() {
    if (this.done) return false;
    this.pos++;
    const arr = this.arr, k = this.k, n = arr.length;
    if (this.pos >= n) {
      this.done = true;
      appendLog('p5-log', `🎉 Done! Results: [${this.results.join(', ')}]`, 'log-step');
      return false;
    }
    const i = this.pos;
    // 1. Remove front if outside window
    if (this.dq.length && this.dq[0] <= i - k) {
      const removed = this.dq.shift();
      appendLog('p5-log', `🗑️ Pop front idx=${removed} (outside window)`, 'log-warn');
    }
    // 2. Maintain monotonicity
    while (this.dq.length && arr[this.dq[this.dq.length-1]] <= arr[i]) {
      const removed = this.dq.pop();
      appendLog('p5-log', `↩️ Pop back idx=${removed}, val=${arr[removed]} ≤ ${arr[i]}`, 'log-action');
    }
    this.dq.push(i);

    const wl = Math.max(0, i - k + 1);
    const wr = i;
    let maxNow = '—';
    if (i >= k - 1) {
      maxNow = arr[this.dq[0]];
      this.results.push(maxNow);
      appendLog('p5-log', `✅ Window [${wl}..${wr}], max = ${maxNow} (front of deque)`, 'log-step');
    } else {
      appendLog('p5-log', `Building window: added ${arr[i]} at idx=${i}`, 'log-action');
    }

    const highlight = this.dq.length ? [this.dq[0]] : [];
    renderArray('p5-array', arr, wl, wr, { entering: i, highlight });
    this.renderDeque();
    renderState('p5-state', [
      { label: 'Current Max', value: maxNow, cls: maxNow !== '—' ? 'best' : '' },
      { label: 'Results', value: `[${this.results.join(', ')}]` },
    ]);
    return true;
  },
  play() { this.anim.play(); },
};

/* ================================================================
   PATTERN 6: Two-Heap Sliding Window Median
   ================================================================ */
const vizP6 = {
  arr: [1, 3, -1, -3, 5, 3, 6, 7],
  k: 3, pos: -1, lo: [], hi: [], results: [], done: false, anim: null,

  init() { this.reset(); this.anim = new StepAnimation(() => this.step(), 'p6-play'); },
  reset() {
    if (this.anim) this.anim.pause();
    this.k = 3; this.pos = -1; this.lo = []; this.hi = []; this.results = []; this.done = false;
    renderArray('p6-array', this.arr, -1, -1);
    this.renderHeaps();
    renderState('p6-state', [
      { label: 'Median', value: '—' },
      { label: 'Results', value: '[ ]' },
    ]);
    clearLog('p6-log');
    appendLog('p6-log', `🚀 Sliding Window Median, k=${this.k}`, 'log-step');
  },
  renderHeaps() {
    const maxH = document.getElementById('p6-maxheap');
    const minH = document.getElementById('p6-minheap');
    maxH.innerHTML = '<span class="deque-label" style="color:var(--accent-orange)">Max-Heap (lo):</span>';
    minH.innerHTML = '<span class="deque-label" style="color:var(--accent-cyan)">Min-Heap (hi):</span>';
    const sorted_lo = [...this.lo].sort((a,b) => b-a);
    sorted_lo.forEach(v => {
      const el = document.createElement('div');
      el.className = 'deque-item';
      el.style.cssText = 'border-color:rgba(249,115,22,0.4);color:var(--accent-orange);background:rgba(249,115,22,0.12)';
      el.textContent = v;
      maxH.appendChild(el);
    });
    const sorted_hi = [...this.hi].sort((a,b) => a-b);
    sorted_hi.forEach(v => {
      const el = document.createElement('div');
      el.className = 'deque-item';
      el.style.cssText = 'border-color:rgba(34,211,238,0.4);color:var(--accent-cyan);background:rgba(34,211,238,0.12)';
      el.textContent = v;
      minH.appendChild(el);
    });
    if (!sorted_lo.length) maxH.innerHTML += '<span style="color:var(--text-muted);font-size:0.8rem;margin-left:8px;">empty</span>';
    if (!sorted_hi.length) minH.innerHTML += '<span style="color:var(--text-muted);font-size:0.8rem;margin-left:8px;">empty</span>';
  },
  rebalance() {
    while (this.lo.length > this.hi.length + 1) {
      this.lo.sort((a,b) => b-a);
      this.hi.push(this.lo.shift());
    }
    while (this.hi.length > this.lo.length) {
      this.hi.sort((a,b) => a-b);
      this.lo.push(this.hi.shift());
    }
  },
  getMedian() {
    this.lo.sort((a,b) => b-a);
    this.hi.sort((a,b) => a-b);
    if (this.k % 2 === 1) return this.lo[0];
    return (this.lo[0] + this.hi[0]) / 2;
  },
  step() {
    if (this.done) return false;
    this.pos++;
    const arr = this.arr, k = this.k, n = arr.length;
    if (this.pos >= n) {
      this.done = true;
      appendLog('p6-log', `🎉 Done! Medians: [${this.results.join(', ')}]`, 'log-step');
      return false;
    }
    const i = this.pos;
    // Insert
    this.lo.sort((a,b) => b-a);
    if (!this.lo.length || arr[i] <= this.lo[0]) {
      this.lo.push(arr[i]);
      appendLog('p6-log', `Insert ${arr[i]} into Max-Heap (lo)`, 'log-action');
    } else {
      this.hi.push(arr[i]);
      appendLog('p6-log', `Insert ${arr[i]} into Min-Heap (hi)`, 'log-action');
    }
    this.rebalance();

    const wl = Math.max(0, i - k + 1);
    let median = '—';
    if (i >= k - 1) {
      median = this.getMedian();
      this.results.push(median);
      appendLog('p6-log', `✅ Window [${wl}..${i}], median = ${median}`, 'log-step');
      // Remove outgoing
      const out = arr[i - k + 1];
      let li = this.lo.indexOf(out);
      if (li !== -1) { this.lo.splice(li, 1); appendLog('p6-log', `🗑️ Remove ${out} from lo`, 'log-warn'); }
      else {
        let hi_i = this.hi.indexOf(out);
        if (hi_i !== -1) { this.hi.splice(hi_i, 1); appendLog('p6-log', `🗑️ Remove ${out} from hi`, 'log-warn'); }
      }
      this.rebalance();
    }

    renderArray('p6-array', arr, wl, i, { entering: i });
    this.renderHeaps();
    renderState('p6-state', [
      { label: 'Median', value: median, cls: median !== '—' ? 'best' : '' },
      { label: 'Results', value: `[${this.results.join(', ')}]` },
    ]);
    return true;
  },
  play() { this.anim.play(); },
};

/* ================================================================
   PATTERN 7: Exactly K Transform
   ================================================================ */
const vizP7 = {
  arr: [1, 1, 2, 1, 1],
  k: 2, phase: 'atMostK', left: 0, right: -1, count: 0, result: 0, resultKm1: -1, done: false, anim: null,

  init() { this.reset(); this.anim = new StepAnimation(() => this.step(), 'p7-play'); },
  reset() {
    if (this.anim) this.anim.pause();
    this.k = parseInt($('#p7-k').value) || 2;
    this.phase = 'atMostK'; this.left = 0; this.right = -1; this.count = 0; this.result = 0; this.resultKm1 = -1; this.done = false;
    renderArray('p7-array', this.arr, -1, -1);
    renderState('p7-state', [
      { label: 'Phase', value: `atMost(${this.k})` },
      { label: 'Odd Count', value: '0' },
      { label: 'Subarrays', value: '0' },
    ]);
    clearLog('p7-log');
    appendLog('p7-log', `🚀 Count subarrays with exactly ${this.k} odd numbers`, 'log-step');
    appendLog('p7-log', `Phase 1: Computing atMost(${this.k})...`, 'log-step');
  },
  step() {
    if (this.done) return false;
    const arr = this.arr, n = arr.length;

    this.right++;
    if (this.right >= n) {
      if (this.phase === 'atMostK') {
        // Store result and start atMost(K-1)
        const r1 = this.result;
        appendLog('p7-log', `✅ atMost(${this.k}) = ${r1}`, 'log-step');
        this.phase = 'atMostKm1';
        this.left = 0; this.right = -1; this.count = 0; this.result = 0;
        appendLog('p7-log', `Phase 2: Computing atMost(${this.k - 1})...`, 'log-step');
        this.resultKm1 = r1;
        renderState('p7-state', [
          { label: 'Phase', value: `atMost(${this.k-1})` },
          { label: 'Odd Count', value: '0' },
          { label: `atMost(${this.k})`, value: r1, cls: 'best' },
        ]);
        return true;
      } else {
        const exactK = this.resultKm1 - this.result;
        appendLog('p7-log', `✅ atMost(${this.k-1}) = ${this.result}`, 'log-step');
        appendLog('p7-log', `🎉 exactly(${this.k}) = ${this.resultKm1} − ${this.result} = ${exactK}`, 'log-step');
        renderState('p7-state', [
          { label: `atMost(${this.k})`, value: this.resultKm1, cls: 'best' },
          { label: `atMost(${this.k-1})`, value: this.result },
          { label: `Exactly ${this.k}`, value: exactK, cls: 'best' },
        ]);
        this.done = true;
        return false;
      }
    }

    const targetK = this.phase === 'atMostK' ? this.k : this.k - 1;
    if (arr[this.right] % 2 === 1) this.count++;

    while (this.count > targetK) {
      if (arr[this.left] % 2 === 1) this.count--;
      this.left++;
    }

    const added = this.right - this.left + 1;
    this.result += added;
    appendLog('p7-log', `Window [${this.left}..${this.right}], odds=${this.count}, +${added} subarrays, total=${this.result}`, 'log-action');

    renderArray('p7-array', arr, this.left, this.right, { entering: this.right });
    const stateItems = [
      { label: 'Phase', value: this.phase === 'atMostK' ? `atMost(${this.k})` : `atMost(${this.k-1})` },
      { label: 'Odd Count', value: this.count },
      { label: 'Subarrays', value: this.result },
    ];
    if (this.resultKm1 >= 0) stateItems.push({ label: `atMost(${this.k})`, value: this.resultKm1, cls: 'best' });
    renderState('p7-state', stateItems);
    return true;
  },
  play() { this.anim.play(); },
};

/* ================================================================
   PATTERN 8: Prefix Sum + Monotonic Deque
   ================================================================ */
const vizP8 = {
  arr: [2, -1, 2, 3, -2, 4],
  target: 5, prefix: [], pos: -1, dq: [], minLen: Infinity, bestL: -1, bestR: -1, done: false, anim: null,

  init() { this.reset(); this.anim = new StepAnimation(() => this.step(), 'p8-play'); },
  reset() {
    if (this.anim) this.anim.pause();
    this.target = parseInt($('#p8-target').value) || 5;
    this.prefix = [0];
    for (let i = 0; i < this.arr.length; i++) this.prefix.push(this.prefix[i] + this.arr[i]);
    this.pos = -1; this.dq = []; this.minLen = Infinity; this.bestL = -1; this.bestR = -1; this.done = false;

    renderArray('p8-array', this.arr, -1, -1);
    renderArray('p8-prefix', this.prefix, -1, -1);
    this.renderDeque();
    renderState('p8-state', [
      { label: 'Min Length', value: '∞' },
      { label: 'Target K', value: this.target },
    ]);
    clearLog('p8-log');
    appendLog('p8-log', `🚀 Shortest subarray with sum ≥ ${this.target} (with negatives!)`, 'log-step');
    appendLog('p8-log', `Prefix sums: [${this.prefix.join(', ')}]`, 'log-action');
  },
  renderDeque() {
    const container = document.getElementById('p8-deque');
    container.innerHTML = '<span class="deque-label">Deque (indices):</span>';
    this.dq.forEach((idx, i) => {
      const el = document.createElement('div');
      el.className = 'deque-item' + (i === 0 ? ' front' : '');
      el.innerHTML = `<span title="P[${idx}]=${this.prefix[idx]}">${idx}</span>`;
      container.appendChild(el);
    });
    if (!this.dq.length) container.innerHTML += '<span style="color:var(--text-muted);font-size:0.8rem;margin-left:8px;">empty</span>';
  },
  step() {
    if (this.done) return false;
    this.pos++;
    const P = this.prefix, K = this.target, n = P.length;
    if (this.pos >= n) {
      this.done = true;
      const res = this.minLen === Infinity ? 'No valid subarray' : `Min length = ${this.minLen}`;
      appendLog('p8-log', `🎉 Done! ${res}`, 'log-step');
      if (this.bestL >= 0) renderArray('p8-array', this.arr, this.bestL, this.bestR);
      return false;
    }
    const j = this.pos;
    // Pop front: valid subarray found
    while (this.dq.length && P[j] - P[this.dq[0]] >= K) {
      const i = this.dq.shift();
      const len = j - i;
      if (len < this.minLen) {
        this.minLen = len;
        this.bestL = i;
        this.bestR = j - 1;
        appendLog('p8-log', `🏆 Valid! P[${j}]-P[${i}] = ${P[j]-P[i]} ≥ ${K}, len=${len}`, 'log-step');
      }
    }
    // Pop back: j is a better start
    while (this.dq.length && P[j] <= P[this.dq[this.dq.length-1]]) {
      const removed = this.dq.pop();
      appendLog('p8-log', `↩️ Pop back: P[${j}]=${P[j]} ≤ P[${removed}]=${P[removed]}`, 'log-action');
    }
    this.dq.push(j);
    appendLog('p8-log', `Push idx=${j}, P[${j}]=${P[j]}, deque=[${this.dq.join(',')}]`, 'log-action');

    const highlightArr = this.bestL >= 0 ? Array.from({length: this.bestR - this.bestL + 1}, (_, i) => this.bestL + i) : [];
    renderArray('p8-array', this.arr, -1, -1, { highlight: highlightArr, entering: j > 0 ? j - 1 : undefined });
    renderArray('p8-prefix', P, -1, -1, { highlight: [j] });
    this.renderDeque();
    renderState('p8-state', [
      { label: 'Min Length', value: this.minLen === Infinity ? '∞' : this.minLen, cls: this.minLen < Infinity ? 'best' : '' },
      { label: 'Target K', value: K },
      { label: 'Current j', value: j },
    ]);
    return true;
  },
  play() { this.anim.play(); },
};
