/* Alvandcode — interactions */
(function(){
  "use strict";
  var header=document.getElementById('siteHeader');
  function onScroll(){ if(header) header.classList.toggle('scrolled',window.scrollY>30); }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // mobile menu
  var burger=document.getElementById('burger'), mmenu=document.getElementById('mmenu');
  if(burger&&mmenu){ burger.addEventListener('click',function(){
    mmenu.style.display = (mmenu.style.display==='flex')?'none':'flex';
  }); mmenu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mmenu.style.display='none';});}); }

  // reveal on scroll
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  // skill bars
  var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){
    e.target.querySelectorAll('.bar i').forEach(function(b){b.style.width=b.dataset.w+'%';}); io2.unobserve(e.target);}});},{threshold:.3});
  document.querySelectorAll('.skills').forEach(function(el){io2.observe(el);});

  // counters
  var io3=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){
    var el=e.target,end=parseFloat(el.dataset.count),suf=el.dataset.suffix||'',t0=null;
    function tick(t){if(!t0)t0=t;var p=Math.min((t-t0)/1400,1);var v=Math.floor(end*(1-Math.pow(1-p,3)));el.textContent=v+suf;if(p<1)requestAnimationFrame(tick);else el.textContent=end+suf;}
    requestAnimationFrame(tick);io3.unobserve(el);}});},{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(function(el){io3.observe(el);});

  // 3D tilt
  function tilt(card,max){
    var r=card.getBoundingClientRect();
    card.addEventListener('mousemove',function(ev){
      var x=(ev.clientX-r.left)/r.width-.5, y=(ev.clientY-r.top)/r.height-.5;
      card.style.transform='perspective(900px) rotateY('+(x*(max||12))+'deg) rotateX('+(-y*(max||12))+'deg) translateY(-6px)';
    });
    card.addEventListener('mouseleave',function(){card.style.transform='';});
  }
  if(matchMedia('(pointer:fine)').matches){document.querySelectorAll('[data-tilt]').forEach(function(c){tilt(c,10);});}

  // touch tilt + reveal flourish for mobile (no hover there)
  if(matchMedia('(pointer:coarse)').matches){
    document.querySelectorAll('[data-tilt]').forEach(function(card){
      function setTilt(t){
        var r=card.getBoundingClientRect();
        var x=(t.clientX-r.left)/r.width-.5, y=(t.clientY-r.top)/r.height-.5;
        x=Math.max(-.5,Math.min(.5,x)); y=Math.max(-.5,Math.min(.5,y));
        card.style.transform='perspective(900px) rotateY('+(x*14)+'deg) rotateX('+(-y*14)+'deg) scale(1.02)';
      }
      function clearTilt(){card.style.transform='';}
      card.addEventListener('touchstart',function(e){if(e.touches[0])setTilt(e.touches[0]);},{passive:true});
      card.addEventListener('touchmove',function(e){if(e.touches[0])setTilt(e.touches[0]);},{passive:true});
      card.addEventListener('touchend',clearTilt);
      card.addEventListener('touchcancel',clearTilt);
    });
    // one-time 3D swing when a card scrolls into view
    var ioT=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){
      var el=e.target;ioT.unobserve(el);
      try{
        el.animate([
          {transform:'perspective(900px) rotateY(-14deg)'},
          {transform:'perspective(900px) rotateY(10deg)'},
          {transform:'perspective(900px) rotateY(0deg)'}
        ],{duration:700,easing:'ease-out'});
      }catch(err){}
    }});},{threshold:.4});
    document.querySelectorAll('[data-tilt]').forEach(function(c){ioT.observe(c);});
  }

  // cursor glow follows mouse (desktop)
  var glow=document.getElementById('glow');
  if(glow&&matchMedia('(pointer:fine)').matches){
    var gx=innerWidth/2,gy=200,tx=gx,ty=gy;
    addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;});
    (function loop(){gx+=(tx-gx)*.08;gy+=(ty-gy)*.08;glow.style.left=gx+'px';glow.style.top=gy+'px';requestAnimationFrame(loop);})();
  }

  // copy buttons (language-aware)
  function tr(k){ return (window.__t ? window.__t(k) : "") || ""; }
  document.querySelectorAll('.cp').forEach(function(b){b.addEventListener('click',function(){
    var code=b.parentElement,clone=code.cloneNode(true),btn=clone.querySelector('.cp');
    if(btn) btn.remove();
    var txt=(clone.innerText||clone.textContent||"").trim();
    if(navigator.clipboard){navigator.clipboard.writeText(txt).then(function(){
      b.textContent=tr('common.copied')||'✓';setTimeout(function(){b.textContent=tr('common.copy')||'';},1400);});}
  });});
  window.addEventListener('langchange',function(){
    document.querySelectorAll('.cp').forEach(function(b){b.textContent=tr('common.copy');});
  });

  // typing effect (per-language words)
  var ty=document.getElementById('typing');
  if(ty){
    var wi=0,ci=0,del=false,runId=0;
    function words(){ return (window.TYPING_WORDS && window.TYPING_WORDS.length ? window.TYPING_WORDS : ["..."]); }
    function type(myRun){
      if(myRun!==runId) return;
      var ws=words(),w=ws[wi%ws.length]||"";
      ty.textContent=w.slice(0,ci);
      if(!del){ci++;if(ci>w.length){del=true;return void setTimeout(function(){type(myRun);},1600);}}
      else{ci--;if(ci===0){del=false;wi=(wi+1)%ws.length;}}
      setTimeout(function(){type(myRun);},del?34:70);
    }
    type(runId);
    window.addEventListener('langchange',function(){ runId++;wi=0;ci=0;del=false;type(runId); });
  }

  // active nav
  var secs=document.querySelectorAll('section[id]');
  var navAs=document.querySelectorAll('.links a');
  var io4=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){
    navAs.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id);});
  }});},{rootMargin:'-40% 0px -55% 0px'});
  secs.forEach(function(s){io4.observe(s);});
})();
