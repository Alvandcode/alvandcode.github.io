/* Alvandcode — language + theme engine */
(function(){
  "use strict";
  var LANGS = [
    ["fa", "فارسی", "🇮🇷"], ["hi", "हिन्दी", "🇮🇳"], ["es", "Español", "🇪🇸"],
    ["fr", "Français", "🇫🇷"], ["ar", "العربية", "🇸🇦"], ["pt", "Português", "🇵🇹"],
    ["ru", "Русский", "🇷🇺"], ["ur", "اردو", "🇵🇰"], ["id", "Bahasa Indonesia", "🇮🇩"],
    ["de", "Deutsch", "🇩🇪"], ["ja", "日本語", "🇯🇵"], ["it", "Italiano", "🇮🇹"],
    ["tr", "Türkçe", "🇹🇷"], ["ko", "한국어", "🇰🇷"], ["vi", "Tiếng Việt", "🇻🇳"]
  ];
  function dict(lang){ return (window.I18N && window.I18N[lang]) || {}; }
  function t(path, lang){
    lang = lang || document.documentElement.getAttribute("data-lang") || "fa";
    var parts = path.split("."), node = dict(lang), i;
    for (i = 0; i < parts.length; i++){ if (node == null) break; node = node[parts[i]]; }
    if (node == null){ node = dict("fa"); for (i = 0; i < parts.length; i++){ if (node == null) break; node = node[parts[i]]; } }
    return (typeof node === "string") ? node : "";
  }
  window.__t = t;
  function typingWords(lang){ var d = dict(lang || currentLang()); return (d.home && d.home.typing) || (dict("fa").home || {}).typing || []; }

  function currentLang(){
    try { return localStorage.getItem("alvand-lang") || "fa"; } catch(e){ return "fa"; }
  }
  function applyLang(lang){
    if (!window.I18N || !window.I18N[lang]) lang = "fa";
    var d = dict(lang), dir = d.dir || "ltr";
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("data-lang", lang);
    try { localStorage.setItem("alvand-lang", lang); } catch(e){}
    document.querySelectorAll("[data-i18n]").forEach(function(el){
      var v = t(el.getAttribute("data-i18n"), lang);
      if (v) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function(el){
      var v = t(el.getAttribute("data-i18n-html"), lang);
      if (v) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function(el){
      el.getAttribute("data-i18n-attr").split(";").forEach(function(pair){
        var kv = pair.split(":"), v = t(kv[1], lang);
        if (kv.length === 2 && v) el.setAttribute(kv[0], v);
      });
    });
    document.querySelectorAll(".lang-sel").forEach(function(s){ s.value = lang; });
    window.TYPING_WORDS = typingWords(lang);
    window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }
  window.applyLang = applyLang;

  /* build language dropdowns */
  document.querySelectorAll(".lang-sel").forEach(function(sel){
    LANGS.forEach(function(L){
      var o = document.createElement("option");
      o.value = L[0]; o.textContent = L[2] + " " + L[1];
      sel.appendChild(o);
    });
    sel.addEventListener("change", function(){ applyLang(sel.value); });
  });

  /* ===== theme (dark / light) with sunrise-sunset veil ===== */
  function currentTheme(){
    try { return localStorage.getItem("alvand-theme") || "dark"; } catch(e){ return "dark"; }
  }
  function paintThemeBtn(){
    var dark = document.documentElement.getAttribute("data-theme") !== "light";
    document.querySelectorAll(".theme-btn").forEach(function(b){ b.textContent = dark ? "☀️" : "🌙"; });
  }
  function setTheme(mode){
    document.documentElement.setAttribute("data-theme", mode);
    try { localStorage.setItem("alvand-theme", mode); } catch(e){}
    paintThemeBtn();
  }
  window.setTheme = setTheme;

  var veil = document.getElementById("veil"), busy = false;
  function toggleTheme(){
    if (busy || !veil) { if (!busy) setTheme(currentTheme() === "light" ? "dark" : "light"); return; }
    busy = true;
    var toLight = currentTheme() !== "light";
    veil.setAttribute("data-mode", toLight ? "rise" : "set");
    document.documentElement.classList.add("theming");
    /* restart sun animation */
    var sun = veil.querySelector(".veil-sun");
    if (sun){ var c = sun.cloneNode(true); sun.parentNode.replaceChild(c, sun); }
    veil.classList.add("show");
    setTimeout(function(){ setTheme(toLight ? "light" : "dark"); }, 650);
    setTimeout(function(){
      veil.classList.remove("show");
      document.documentElement.classList.remove("theming");
      busy = false;
    }, 1550);
  }
  document.querySelectorAll(".theme-btn").forEach(function(b){
    b.addEventListener("click", toggleTheme);
  });

  /* init */
  setTheme(currentTheme());
  applyLang(currentLang());
})();
