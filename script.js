document.addEventListener('DOMContentLoaded',()=>{
  const opening=document.getElementById('weddingOpening');
  const openBtn=document.getElementById('openInvitation');
  const scratchScreen=document.getElementById('scratchScreen');
  const canvas=document.getElementById('scratchCanvas');
  const continueBtn=document.getElementById('continueInvitation');
  const petalsLayer=document.getElementById('petalsLayer');

  /* ================= GLOBAL PETALS ================= */
  function petalBurst(count=70){
    if(!petalsLayer)return;
    for(let i=0;i<count;i++){
      const p=document.createElement('span');
      p.className='petal';
      p.style.left=(Math.random()*100)+'vw';
      p.style.setProperty('--drift',((Math.random()*320)-160)+'px');
      p.style.animationDuration=(7+Math.random()*8)+'s';
      p.style.animationDelay=(-Math.random()*8)+'s';
      const s=7+Math.random()*10;
      p.style.width=s+'px';p.style.height=(s*1.5)+'px';
      petalsLayer.appendChild(p);
      setTimeout(()=>p.remove(),17000);
    }
  }
  petalBurst(80);
  setInterval(()=>petalBurst(18),2600);

  /* ================= OPENING ================= */
  if(openBtn&&opening){
    openBtn.addEventListener('click',()=>{
      opening.classList.add('is-open');
      petalBurst(55);
      setTimeout(()=>{
        opening.classList.add('show-scratch');
        setTimeout(initScratch,250);
      },1500);
    },{once:true});
  }

  /* ================= SCRATCH CARD ================= */
  let scratchReady=false;
  function initScratch(){
    if(scratchReady||!canvas)return;
    scratchReady=true;
    const box=canvas.parentElement.getBoundingClientRect();
    const w=Math.max(1,Math.floor(box.width)),h=Math.max(1,Math.floor(box.height));
    const dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';
    const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.setTransform(dpr,0,0,dpr,0,0);
    const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#9a6a27');g.addColorStop(.28,'#f2d18a');g.addColorStop(.5,'#bd8534');g.addColorStop(.75,'#f3d48e');g.addColorStop(1,'#9b6725');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    for(let i=0;i<900;i++){ctx.fillStyle=Math.random()>.5?'rgba(255,255,255,.17)':'rgba(76,35,7,.12)';ctx.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*2,1+Math.random()*2)}
    ctx.textAlign='center';ctx.fillStyle='#5b0d1c';ctx.font='600 18px Poppins,sans-serif';ctx.fillText('RUB TO REVEAL',w/2,h/2);

    let drawing=false,lx=0,ly=0,lastCheck=0;
    const pos=e=>{const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
    const erase=(x,y)=>{ctx.globalCompositeOperation='destination-out';ctx.lineWidth=Math.max(45,w*.16);ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(x,y);ctx.stroke();ctx.beginPath();ctx.arc(x,y,ctx.lineWidth/2,0,Math.PI*2);ctx.fill();lx=x;ly=y;const now=Date.now();if(now-lastCheck>220){lastCheck=now;check()}};
    canvas.addEventListener('pointerdown',e=>{e.preventDefault();drawing=true;canvas.setPointerCapture(e.pointerId);const p=pos(e);lx=p.x;ly=p.y;erase(lx,ly)});
    canvas.addEventListener('pointermove',e=>{if(!drawing)return;e.preventDefault();const p=pos(e);erase(p.x,p.y)});
    canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);
    function stop(e){drawing=false;try{canvas.releasePointerCapture(e.pointerId)}catch(_){}check()}
    function check(){if(canvas.dataset.revealed==='true')return;const s=70,t=document.createElement('canvas');t.width=s;t.height=s;const tc=t.getContext('2d');tc.drawImage(canvas,0,0,s,s);const d=tc.getImageData(0,0,s,s).data;let clear=0;for(let i=3;i<d.length;i+=4)if(d[i]<80)clear++;if(clear/(s*s)>.40)reveal()}
    function reveal(){if(canvas.dataset.revealed==='true')return;canvas.dataset.revealed='true';canvas.style.transition='opacity .8s';canvas.style.opacity='0';canvas.style.pointerEvents='none';if(continueBtn){setTimeout(()=>continueBtn.classList.add('visible'),450)}petalBurst(45)}
  }

  if(continueBtn&&opening){continueBtn.addEventListener('click',()=>{opening.classList.add('opening-complete');setTimeout(()=>{opening.remove();window.scrollTo({top:0,behavior:'smooth'})},950)})}

  /* ================= MOBILE MENU ================= */
  const burger=document.getElementById('navBurger'),nav=document.getElementById('navLinks');
  if(burger&&nav){burger.addEventListener('click',()=>{const open=nav.classList.toggle('open');burger.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}

  /* ================= EVENT TABS ================= */
  document.querySelectorAll('.event-tab').forEach(tab=>tab.addEventListener('click',()=>{
    const id=tab.dataset.tab;
    document.querySelectorAll('.event-tab').forEach(t=>{const active=t===tab;t.classList.toggle('active',active);t.setAttribute('aria-selected',String(active))});
    document.querySelectorAll('.event-panel').forEach(panel=>{const active=panel.id==='panel-'+id;panel.classList.toggle('active',active);panel.hidden=!active});
  }));

  /* ================= COUNTDOWN ================= */
  const countdown=document.getElementById('countdownGrid');
  if(countdown){
    const target=new Date(countdown.dataset.target).getTime();
    const update=()=>{let d=Math.max(0,target-Date.now());const day=86400000,hour=3600000,min=60000,sec=1000;const vals=[Math.floor(d/day),Math.floor(d%day/hour),Math.floor(d%hour/min),Math.floor(d%min/sec)];['cdDays','cdHours','cdMinutes','cdSeconds'].forEach((id,i)=>document.getElementById(id).textContent=String(vals[i]).padStart(2,'0'))};update();setInterval(update,1000);
  }

  /* ================= CALENDAR ================= */
  document.querySelectorAll('[data-ics]').forEach(btn=>btn.addEventListener('click',()=>{
    const isShagun=btn.dataset.ics==='shagun';
    const e=isShagun?{title:'Danveer & Harman Preet — Shagun & Ring Ceremony',start:'20261023T183000',end:'20261023T213000',loc:'Regenta Central Amritsar'}:{title:'Danveer & Harman Preet — Anand Karaj',start:'20261025T110000',end:'20261025T140000',loc:'Sandoz Amritsar'};
    const ics=`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Danveer & Harman Preet//Wedding//EN\nBEGIN:VEVENT\nUID:${Date.now()}@danveer-harmanpreet\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}\nDTSTART:${e.start}\nDTEND:${e.end}\nSUMMARY:${e.title}\nLOCATION:${e.loc}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob=new Blob([ics],{type:'text/calendar;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=(isShagun?'Shagun-Ring-Ceremony':'Anand-Karaj')+'.ics';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  }));
});
