
const music = document.getElementById('musicBtn');
const audio = new Audio('assets/wedding-ambient.wav');
audio.loop = true;
audio.volume = 0.32;

const loader = document.getElementById('loader');
window.addEventListener('load', () => setTimeout(() => loader.classList.add('hidden'), 450));

function scrollToId(id){
  document.getElementById(id)?.scrollIntoView({behavior:'smooth', block:'start'});
}

function startMusic(){
  audio.play().then(()=>{
    music.classList.add('playing');
    music.textContent='Ⅱ';
  }).catch(()=>{});
}
music.addEventListener('click',()=>{
  if(audio.paused){startMusic()}else{audio.pause();music.classList.remove('playing');music.textContent='♫'}
});

const doors = document.getElementById('doors');
const openBtn = document.getElementById('openBtn');
openBtn.addEventListener('click',()=>{
  startMusic();
  doors.classList.add('opening');
  setTimeout(()=>scrollToId('doors'), 80);
  setTimeout(()=>scrollToId('couple'), 1900);
});

document.getElementById('calendarBtnTop').addEventListener('click',()=>addCalendar('both'));

// Falling petals
const petalLayer=document.querySelector('.petals');
function createPetal(){
  const p=document.createElement('span');
  p.className='petal';
  p.style.left=(Math.random()*100)+'%';
  p.style.width=(7+Math.random()*9)+'px';
  p.style.height=(10+Math.random()*12)+'px';
  p.style.animationDuration=(7+Math.random()*8)+'s';
  p.style.setProperty('--drift', `${-80+Math.random()*160}px`);
  p.style.setProperty('--rot', `${240+Math.random()*520}deg`);
  p.style.animationDelay=(Math.random()*-12)+'s';
  p.style.opacity=(.4+Math.random()*.5).toFixed(2);
  petalLayer.appendChild(p);
  setTimeout(()=>p.remove(),16000);
}
for(let i=0;i<24;i++) createPetal();
setInterval(createPetal,550);

// Countdown
const target = new Date('2026-10-23T18:30:00+05:30').getTime();
function tick(){
  let diff=Math.max(0,target-Date.now());
  const s=Math.floor(diff/1000);
  const d=Math.floor(s/86400);
  const h=Math.floor((s%86400)/3600);
  const m=Math.floor((s%3600)/60);
  const sec=s%60;
  document.getElementById('days').textContent=String(d).padStart(3,'0');
  document.getElementById('hours').textContent=String(h).padStart(2,'0');
  document.getElementById('minutes').textContent=String(m).padStart(2,'0');
  document.getElementById('seconds').textContent=String(sec).padStart(2,'0');
}
tick(); setInterval(tick,1000);

// Calendar helpers
function icsDate(date){
  return new Date(date).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
}
function makeICS(events){
  const body=events.map(e=>[
    'BEGIN:VEVENT',
    `UID:${Date.now()}-${Math.random().toString(36).slice(2)}@danveer-harman`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(e.start)}`,
    `DTEND:${icsDate(e.end)}`,
    `SUMMARY:${e.title}`,
    `LOCATION:${e.location}`,
    `DESCRIPTION:${e.description}`,
    'END:VEVENT'
  ].join('\r\n')).join('\r\n');
  return `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Danveer & Harman Preet//Wedding Invitation//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n${body}\r\nEND:VCALENDAR`;
}
function downloadICS(events){
  const blob=new Blob([makeICS(events)],{type:'text/calendar;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='Danveer-Harman-Wedding-Events.ics';
  document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}
const events={
  shagun:{
    title:'Shagun & Roka Ceremony — Danveer & Harman Preet',
    start:'2026-10-23T18:30:00+05:30', end:'2026-10-23T21:00:00+05:30',
    location:'Regenta Central, A-275, East Mohan Nagar, Grand Trunk Road, Amritsar, Punjab 143001',
    description:'Shagun & Roka Ceremony. With love and blessings.'
  },
  anand:{
    title:'Anand Karaj — Danveer & Harman Preet',
    start:'2026-10-25T11:00:00+05:30', end:'2026-10-25T14:00:00+05:30',
    location:'Sandoz Amritsar, 12 Lawrence Road, Dayanand Nagar, Amritsar, Punjab 143001',
    description:'Anand Karaj. With love and blessings.'
  }
};
function addCalendar(which){
  if(which==='both'){
    downloadICS([events.shagun,events.anand]);
    return;
  }
  downloadICS([events[which]]);
}

// Scratch heart
const canvas=document.getElementById('scratchCanvas');
const ctx=canvas.getContext('2d');
function heartPath(c){
  c.beginPath();
  c.moveTo(115,188);
  c.bezierCurveTo(100,170,18,125,18,65);
  c.bezierCurveTo(18,18,76,9,115,49);
  c.bezierCurveTo(154,9,212,18,212,65);
  c.bezierCurveTo(212,125,130,170,115,188);
  c.closePath();
}
function paintScratch(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save();
  heartPath(ctx);
  ctx.clip();
  const g=ctx.createLinearGradient(0,0,230,205);
  g.addColorStop(0,'#7a1233');g.addColorStop(1,'#5c0a26');
  ctx.fillStyle=g;ctx.fillRect(0,0,230,205);
  ctx.fillStyle='rgba(246,207,177,.24)';
  for(let i=0;i<18;i++){
    ctx.beginPath();ctx.arc(Math.random()*230,Math.random()*205,1.5,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}
paintScratch();
let scratching=false, lastPoint=null, cleared=0;
function pos(ev){
  const r=canvas.getBoundingClientRect();
  const p=ev.touches?ev.touches[0]:ev;
  return {x:(p.clientX-r.left)*canvas.width/r.width,y:(p.clientY-r.top)*canvas.height/r.height};
}
function scratchAt(p){
  ctx.save();
  ctx.globalCompositeOperation='destination-out';
  ctx.beginPath();ctx.arc(p.x,p.y,22,0,Math.PI*2);ctx.fill();
  if(lastPoint){
    ctx.beginPath();ctx.moveTo(lastPoint.x,lastPoint.y);ctx.lineTo(p.x,p.y);ctx.lineWidth=42;ctx.lineCap='round';ctx.stroke();
  }
  ctx.restore();
  lastPoint=p; cleared++;
  if(cleared>34){canvas.style.opacity='.15'}
}
['pointerdown','pointermove'].forEach(type=>canvas.addEventListener(type,e=>{
  if(type==='pointerdown'){scratching=true;lastPoint=null}
  if(scratching){scratchAt(pos(e));e.preventDefault()}
}));
['pointerup','pointercancel','pointerleave'].forEach(type=>canvas.addEventListener(type,()=>{
  scratching=false;lastPoint=null;
}));
canvas.addEventListener('touchstart',e=>e.preventDefault(),{passive:false});
canvas.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});

// Intersection observer: animate door if user scrolls naturally
const io=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting && entry.target.id==='doors' && !entry.target.classList.contains('opening')){
      // Keep the transition available for manual open button; don't auto-open.
    }
  })
},{threshold:.45});
io.observe(doors);
