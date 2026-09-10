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

  // cursor glow follows mouse (desktop)
  var glow=document.getElementById('glow');
  if(glow&&matchMedia('(pointer:fine)').matches){
    var gx=innerWidth/2,gy=200,tx=gx,ty=gy;
    addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;});
    (function loop(){gx+=(tx-gx)*.08;gy+=(ty-gy)*.08;glow.style.left=gx+'px';glow.style.top=gy+'px';requestAnimationFrame(loop);})();
  }

  // copy buttons
  document.querySelectorAll('.cp').forEach(function(b){b.addEventListener('click',function(){
    var code=b.parentElement;var t=code.innerText.replace('کپی','').trim();
    if(navigator.clipboard){navigator.clipboard.writeText(t).then(function(){b.textContent='✓ شد!';setTimeout(function(){b.textContent='کپی';},1400);});}
  });});

  // typing effect
  var ty=document.getElementById('typing');
  if(ty){
    var words=['ابزارهای امنیتی','راه‌حل‌های شبکه','پردازش تصویر و OCR','اپ‌های اندروید','سرویس‌های بک‌اند'];
    var wi=0,ci=0,del=false;
    (function type(){
      var w=words[wi];
      ty.textContent=w.slice(0,ci);
      if(!del){ci++;if(ci>w.length){del=true;return setTimeout(type,1600);}}
      else{ci--;if(ci===0){del=false;wi=(wi+1)%words.length;}}
      setTimeout(type,del?34:70);
    })();
  }

  // active nav
  var secs=document.querySelectorAll('section[id]');
  var navAs=document.querySelectorAll('.links a');
  var io4=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){
    navAs.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id);});
  }});},{rootMargin:'-40% 0px -55% 0px'});
  secs.forEach(function(s){io4.observe(s);});
})();
