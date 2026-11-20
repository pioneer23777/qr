(function () {
  "use strict";

  function copyText(text) {
    return new Promise(function (resolve) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { resolve(true); }).catch(function () {
          resolve(fallbackCopy(text));
        });
        return;
      }
      resolve(fallbackCopy(text));
    });
  }

  function fallbackCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:0;left:-9999px;opacity:0;";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, text.length);
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return !!ok;
    } catch (e) {
      return false;
    }
  }

  var toastTimer;
  function toast(msg) {
    var el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("is-show"); }, 1800);
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy]");
    if (!btn) return;
    var url = btn.getAttribute("data-copy");
    copyText(url).then(function (ok) {
      if (!ok) { toast("복사에 실패했습니다"); return; }
      var prev = btn.textContent;
      btn.classList.add("is-done");
      btn.textContent = "복사됨 ✓";
      toast("링크가 복사되었습니다");
      setTimeout(function () {
        btn.classList.remove("is-done");
        btn.textContent = prev;
      }, 1600);
    });
  });
})();
