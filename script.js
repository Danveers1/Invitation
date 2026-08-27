const petals=document.getElementById("petals");
function makePetal(){
  const p=document.createElement("i"); p.className="petal";
  p.style.left=Math.random()*100+"vw";
  p.style.setProperty("--x",(Math.random()*240-120)+"px");
  p.style.animationDuration=(5+Math.random()*7)+"s";
  p.style.opacity=.35+Math.random()*.65;
  p.style.transform=`rotate(${Math.random()*360}deg)`;
  petals.appendChild(p);
  setTimeout(()=>p.remove(),13000);
}
setInterval(makePetal,240);
for(let i=0;i<28;i++)setTimeout(makePetal,i*80);

const opening=document.getElementById("opening");
document.getElementById("openBtn").onclick=()=>{
  opening.classList.add("opened");
  setTimeout(()=>{
    opening.classList.add("hidden");
    document.getElementById("scratchStage").classList.remove("hidden");
    setupScratch();
  },1900);
};

function setupScratch(){
 const c=document.getElementById("scratchCanvas"), box=c.parentElement;
 const r=box.getBoundingClientRect(), d=Math.min(devicePixelRatio||1,2);
 c.width=r.width*d;c.height=r.height*d;c.style.width=r.width+"px";c.style.height=r.height+"px";
 const x=c.getContext("2d");x.scale(d,d);
 const g=x.createLinearGradient(0,0,r.width,r.height);g.addColorStop(0,"#9a1c3b");g.addColorStop(.45,"#f0bd68");g.addColorStop(1,"#7b1730");
 x.fillStyle=g;x.fillRect(0,0,r.width,r.height);
 x.fillStyle="#fff0d8";x.font="italic 25px Georgia";x.textAlign="center";x.fillText("SCRATCH TO REVEAL",r.width/2,r.height/2);
 let down=false,last=null;
 const pos=e=>{const q=c.getBoundingClientRect();return{x:e.clientX-q.left,y:e.clientY-q.top}};
 const scratch=e=>{if(!down)return;const q=pos(e);x.globalCompositeOperation="destination-out";x.lineWidth=45;x.lineCap="round";x.beginPath();if(last)x.moveTo(last.x,last.y);else x.moveTo(q.x,q.y);x.lineTo(q.x,q.y);x.stroke();last=q;};
 c.onpointerdown=e=>{down=true;last=pos(e);c.setPointerCapture(e.pointerId);scratch(e)};
 c.onpointermove=scratch;c.onpointerup=()=>{down=false;last=null;check()};
 function check(){const a=x.getImageData(0,0,c.width/d,c.height/d).data;let z=0;for(let i=3;i<a.length;i+=4)if(a[i]<50)z++;if(z/(a.length/4)>.42){c.style.opacity=0;document.getElementById("enterBtn").classList.remove("hidden")}}
}
document.getElementById("enterBtn").onclick=()=>{
 document.getElementById("scratchStage").classList.add("hidden");
 document.getElementById("site").classList.remove("hidden");
 window.scrollTo(0,0);
};

document.querySelectorAll("[data-scroll]").forEach(b=>b.onclick=()=>document.querySelector(b.dataset.scroll).scrollIntoView({behavior:"smooth"}));

const target=new Date("2026-10-25T11:00:00+05:30");
function tick(){
 let n=Math.max(0,target-Date.now());
 let s=Math.floor(n/1000),d=Math.floor(s/86400);s%=86400;
 let h=Math.floor(s/3600);s%=3600;let m=Math.floor(s/60);s%=60;
 days.textContent=String(d).padStart(2,"0");hours.textContent=String(h).padStart(2,"0");
 minutes.textContent=String(m).padStart(2,"0");seconds.textContent=String(s).padStart(2,"0");
}
tick();setInterval(tick,1000);
