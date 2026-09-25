// Paints the last applied appearance (version, mode, colors, heading font) before the app loads.
// Loaded from index.html as a file (not inline) so the admin's Content-Security-Policy can stay script-src 'self'.
// Written by applyAppearance in src/lib/themes.ts; the app re-applies it once the profile arrives.
try {
  var saved = JSON.parse(localStorage.getItem("appearance") || "null");
  if (saved) {
    var root = document.documentElement;
    root.classList.remove(saved.mode === "light" ? "dark" : "light");
    root.classList.add(saved.mode === "light" ? "light" : "dark");
    root.dataset.themePreset = saved.preset;
    for (var name in saved.vars) root.style.setProperty("--" + name, saved.vars[name]);
    if (saved.fontStack) root.style.setProperty("--font-display", saved.fontStack);
    if (saved.fontUrl) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = saved.fontUrl;
      link.setAttribute("data-theme-font", "");
      document.head.appendChild(link);
    }
  }
} catch (e) {}
