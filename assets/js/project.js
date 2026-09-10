/* Alvandcode — generic project page: renders any repo live from GitHub */
(function(){
  "use strict";
  var USER = "Alvandcode";
  var EMOJI = {"Python":"🐍","Kotlin":"🕵️","Dart":"🎯","Java":"☕","JavaScript":"⚡",
    "TypeScript":"💠","HTML":"🌐","Dockerfile":"🐳","Shell":"⌨️","CSS":"🎨","C":"⚙️","Go":"🐹"};
  function esc(s){
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }
  function tr(k){ return (window.__t ? window.__t(k) : "") || ""; }
  function $(id){ return document.getElementById(id); }

  function showError(){
    $("gen-wrap").innerHTML = '<div class="shot"><div class="shot-body"><p style="color:var(--mut)" data-i18n="gen.notfound"></p>'
      + '<div style="margin-top:16px"><a class="btn btn-g" href="../index.html#projects" data-i18n="common.back"></a></div></div></div>';
    if (window.applyLang) applyLang(document.documentElement.getAttribute("data-lang") || "fa");
  }

  function renderMD(md){
    var box = $("gen-readme");
    try {
      if (window.marked && window.DOMPurify){
        box.innerHTML = DOMPurify.sanitize(marked.parse(md));
        return;
      }
    } catch(e){}
    box.innerHTML = "<pre>" + esc(md).slice(0, 20000) + "</pre>";
  }

  function load(){
    if (!$("gen-wrap")) return;
    var m = /[?&]repo=([^&]+)/.exec(location.search || "");
    var repo = m ? decodeURIComponent(m[1]).trim() : "";
    if (!/^[A-Za-z0-9_.-]+$/.test(repo)){ showError(); return; }
    document.title = repo + " | Alvandcode";
    fetch("https://api.github.com/repos/" + USER + "/" + repo).then(function(res){
      if (!res.ok) throw 0;
      return res.json();
    }).then(function(r){
      $("gen-icon").textContent = EMOJI[r.language] || "📦";
      $("gen-title").textContent = r.name;
      $("gen-desc").textContent = r.description || "—";
      $("gen-desc").setAttribute("dir", "auto");
      $("gen-stars").textContent = "★ " + r.stargazers_count;
      $("gen-lang").textContent = r.language || "—";
      var d = new Date(r.pushed_at);
      $("gen-date").textContent = isNaN(d) ? "—" : d.toISOString().slice(0, 10);
      var gh = "https://github.com/" + USER + "/" + repo;
      $("gen-open").href = gh;
      $("gen-clone").innerHTML = "git clone " + esc(gh + ".git");
      $("gen-wrap").style.display = "";
      $("gen-loading").style.display = "none";
      var btn = $("gen-copy");
      if (btn) btn.addEventListener("click", function(){
        if (navigator.clipboard) navigator.clipboard.writeText("git clone " + gh + ".git").then(function(){
          btn.textContent = tr("common.copied") || "✓";
          setTimeout(function(){ btn.textContent = tr("common.copy") || ""; }, 1400);
        });
      });
      var branches = ["main", "master"];
      (function next(i){
        if (i >= branches.length){
          $("gen-readme").innerHTML = "<p style='color:var(--mut)'>—</p>";
          return;
        }
        fetch("https://raw.githubusercontent.com/" + USER + "/" + repo + "/" + branches[i] + "/README.md").then(function(res){
          if (!res.ok) throw 0;
          return res.text();
        }).then(renderMD).catch(function(){ next(i + 1); });
      })(0);
    }).catch(showError);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", load);
  else load();
})();
