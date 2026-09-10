/* Alvandcode — auto project cards from GitHub API */
(function(){
  "use strict";
  var USER = "Alvandcode";
  var CURATED = ["android-security-scanner","dns-benchmark-pro","ocr-stt-tool",
    "image-metadata-cleaner","receiptvision-core","stegasuite",
    "gamenet-manager","gamenet-windows-pro","qand-app","alvandcode.github.io"];
  var LANG_STYLE = {
    "Python": ["🐍","#22c55e","#06b6d4"], "Kotlin": ["🕵️","#a855f7","#ec4899"],
    "Dart": ["🎯","#06b6d4","#3b82f6"], "Java": ["☕","#f59e0b","#ef4444"],
    "JavaScript": ["⚡","#eab308","#f97316"], "TypeScript": ["💠","#3b82f6","#22d3ee"],
    "HTML": ["🌐","#f43f5e","#fb923c"], "Dockerfile": ["🐳","#3b82f6","#06b6d4"],
    "Shell": ["⌨️","#a3a3a3","#6366f1"], "CSS": ["🎨","#8b5cf6","#ec4899"],
    "C": ["⚙️","#94a3b8","#475569"], "Go": ["🐹","#22d3ee","#3b82f6"]
  };
  var DEF = ["📦","#6366f1","#22d3ee"];
  var CACHE_KEY = "alvand-repos-v1", TTL = 6 * 3600 * 1000, MAX = 6;

  function esc(s){
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }
  function tr(k){ return (window.__t ? window.__t(k) : "") || ""; }

  function bindTilt(card){
    var fine = window.matchMedia && matchMedia("(pointer:fine)").matches;
    if (fine){
      var r = card.getBoundingClientRect();
      card.addEventListener("mousemove", function(ev){
        var x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
        card.style.transform = "perspective(900px) rotateY(" + (x*10) + "deg) rotateX(" + (-y*10) + "deg) translateY(-6px)";
      });
      card.addEventListener("mouseleave", function(){ card.style.transform = ""; });
    } else {
      card.addEventListener("touchstart", function(e){
        if (!e.touches[0]) return;
        var t = e.touches[0], b = card.getBoundingClientRect();
        var x = Math.max(-.5, Math.min(.5, (t.clientX - b.left) / b.width - .5));
        var y = Math.max(-.5, Math.min(.5, (t.clientY - b.top) / b.height - .5));
        card.style.transform = "perspective(900px) rotateY(" + (x*14) + "deg) rotateX(" + (-y*14) + "deg)";
      }, {passive:true});
      card.addEventListener("touchend", function(){ card.style.transform = ""; });
      card.addEventListener("touchcancel", function(){ card.style.transform = ""; });
    }
  }

  function cardHTML(r){
    var st = LANG_STYLE[r.language] || DEF;
    return '<a class="pcard reveal in" data-tilt style="--accent:' + st[1] + ';--accent2:' + st[2] + '"'
      + ' href="projects/project.html?repo=' + encodeURIComponent(r.name) + '">'
      + '<div class="pcard-top"><span class="p-lang">' + esc(r.language || "—") + '</span>'
      + '<span class="p-stars">★ ' + r.stargazers_count + '</span>'
      + '<span class="p-emoji">' + st[0] + '</span></div>'
      + '<div class="p-body"><h3><span dir="auto">' + esc(r.name) + '</span></h3>'
      + '<p dir="auto">' + esc(r.description || "—") + '</p>'
      + '<div class="p-foot"><span class="open">' + esc(tr("common.open")) + '</span>'
      + '<span class="gh">GitHub ↗</span></div></div></a>';
  }

  function render(list){
    var grid = document.getElementById("auto-grid");
    var fresh = document.getElementById("fresh");
    if (!grid) return;
    var fresh2 = list.filter(function(r){
      return !r.fork && CURATED.indexOf((r.name || "").toLowerCase()) < 0;
    }).sort(function(a, b){
      return new Date(b.pushed_at) - new Date(a.pushed_at);
    }).slice(0, MAX);
    if (!fresh2.length){ if (fresh) fresh.style.display = "none"; return; }
    grid.innerHTML = fresh2.map(cardHTML).join("");
    grid.querySelectorAll("[data-tilt]").forEach(bindTilt);
  }

  function fail(){
    var grid = document.getElementById("auto-grid");
    if (grid) grid.innerHTML = '<div class="pcard"><div class="p-body"><p style="color:var(--mut)" data-i18n="auto.fail"></p></div></div>';
    if (window.applyLang) applyLang(document.documentElement.getAttribute("data-lang") || "fa");
  }

  function load(){
    if (!document.getElementById("auto-grid")) return;
    try {
      var c = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      if (c && (Date.now() - c.ts) < TTL && c.data){ render(c.data); return; }
    } catch(e){}
    fetch("https://api.github.com/users/" + USER + "/repos?per_page=100&sort=pushed")
      .then(function(res){ if (!res.ok) throw 0; return res.json(); })
      .then(function(data){
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ts: Date.now(), data: data})); } catch(e){}
        render(data);
      })
      .catch(fail);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", load);
  else load();
})();
