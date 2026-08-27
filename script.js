// =========================================================
// Danveer & Harman Preet — Wedding Invitation logic
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- SCREEN NAVIGATION ---------- */
  const screens = Array.from(document.querySelectorAll('.screen'));
  const dotsWrap = document.getElementById('dots');
  let current = 0;

  screens.forEach((s, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(index){
    if(index < 0 || index >= screens.length) return;
    screens[current].classList.remove('active');
    screens[current].classList.add('prev');
    current = index;
    screens[current].classList.remove('prev');
    screens[current].classList.add('active');
    dots.forEach((d,i) => d.classList.toggle('active', i === current));
  }

  function next(){ goTo(current + 1); }

  // wire up every element with data-next
  document.querySelectorAll('[data-next]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      next();
    });
  });

  // basic swipe support (mobile)
  let touchStartX = 0;
  document.getElementById('deck').addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive:true});
  document.getElementById('deck').addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if(Math.abs(dx) > 60){
      if(dx < 0) goTo(current + 1);
      else goTo(current - 1);
    }
  }, {passive:true});

  /* ---------- DOORS SCREEN ---------- */
  const doorsScreen = document.querySelector('.doors');
  const doorWrap = document.getElementById('doorWrap');
  let doorsOpened = false;
  doorsScreen.addEventListener('click', () => {
    if(!doorsOpened){
      doorWrap.classList.add('open');
      doorsOpened = true;
      setTimeout(next, 900);
    }
  });

  /* ---------- SCRATCH CARD ---------- */
  const canvas = document.getElementById('scratchCanvas');
  const ctx = canvas.getContext('2d');
  const scratchHint = document.getElementById('scratchHint');
  const scratchNextBtn = document.getElementById('scratchNextBtn');

  function paintScratchLayer(){
    const w = canvas.width, h = canvas.height;
    const grad = ctx.createLinearGradient(0,0,w,h);
    grad.addColorStop(0, '#f2d98a');
    grad.addColorStop(1, '#b8860b');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle = 'rgba(255,255,255,.25)';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH HERE', w/2, h/2);
  }
  paintScratchLayer();

  let isScratching = false;
  let scratchedPct = 0;

  function getPos(e){
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const point = e.touches ? e.touches[0] : e;
    return { x: (point.clientX - rect.left) * scaleX, y: (point.clientY - rect.top) * scaleY };
  }

  function scratchAt(x,y){
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  function checkProgress(){
    const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let cleared = 0;
    for(let i = 3; i < data.length; i += 4 * 20){ // sample every 20th pixel for speed
      if(data[i] === 0) cleared++;
    }
    scratchedPct = cleared / (data.length / (4*20));
    if(scratchedPct > 0.55 && scratchNextBtn.style.opacity !== '1'){
      scratchNextBtn.style.transition = 'opacity .6s';
      scratchNextBtn.style.opacity = '1';
      scratchNextBtn.style.pointerEvents = 'auto';
      scratchHint.textContent = 'tap the arrow to continue';
      // auto-clear the rest for a satisfying reveal
      ctx.clearRect(0,0,canvas.width,canvas.height);
    }
  }

  function startScratch(e){ isScratching = true; scratchMove(e); }
  function endScratch(){ isScratching = false; checkProgress(); }
  function scratchMove(e){
    if(!isScratching) return;
    e.preventDefault();
    const {x,y} = getPos(e);
    scratchAt(x,y);
    checkProgress();
  }

  canvas.addEventListener('mousedown', startScratch);
  canvas.addEventListener('mousemove', scratchMove);
  window.addEventListener('mouseup', endScratch);
  canvas.addEventListener('touchstart', startScratch, {passive:false});
  canvas.addEventListener('touchmove', scratchMove, {passive:false});
  canvas.addEventListener('touchend', endScratch);

  /* ---------- COUNTDOWN ---------- */
  const target = new Date('2026-10-23T06:30:00+05:30').getTime();
  function tickCountdown(){
    const now = Date.now();
    let diff = Math.max(0, target - now);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const set = (id,val) => { const el = document.getElementById(id); if(el) el.textContent = String(val).padStart(2,'0'); };
    set('cd-days', d); set('cd-hours', h); set('cd-mins', m); set('cd-secs', s);
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ---------- RESTART ---------- */
  const restartBtn = document.getElementById('restartBtn');
  if(restartBtn){
    restartBtn.addEventListener('click', () => goTo(0));
  }

  /* ---------- MUSIC TOGGLE ---------- */
  // Add your own track: create an <audio id="bgm" src="images/song.mp3" loop></audio> in index.html
  let audioEl = document.getElementById('bgm');
  let playing = false;
  document.querySelectorAll('.music-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if(!audioEl){
        console.warn('No audio element found. Add <audio id="bgm" src="your-song.mp3" loop></audio> to index.html to enable music.');
        document.querySelectorAll('.music-btn').forEach(b => b.classList.toggle('muted'));
        return;
      }
      if(playing){ audioEl.pause(); } else { audioEl.play().catch(()=>{}); }
      playing = !playing;
      document.querySelectorAll('.music-btn').forEach(b => b.classList.toggle('muted', !playing));
    });
  });

  /* ---------- FALLING PETALS (whole page, every screen) ---------- */
  const petalLayer = document.getElementById('petals');
  const petalGlyphs = ['❀','✿','❁','⚘'];
  const petalCount = window.innerWidth < 500 ? 18 : 28;

  for(let i = 0; i < petalCount; i++){
    const p = document.createElement('span');
    p.className = 'petal';
    p.textContent = petalGlyphs[Math.floor(Math.random()*petalGlyphs.length)];
    const left = Math.random() * 100;
    const fallDuration = 8 + Math.random() * 10;
    const swayDuration = 3 + Math.random() * 3;
    const delay = Math.random() * -20;
    const size = 12 + Math.random() * 14;
    p.style.left = left + 'vw';
    p.style.fontSize = size + 'px';
    p.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
    p.style.animationDelay = `${delay}s, ${delay}s`;
    p.style.color = Math.random() > 0.5 ? '#f2a6b5' : '#d4af37';
    petalLayer.appendChild(p);
  }

});
