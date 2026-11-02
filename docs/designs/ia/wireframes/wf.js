// Wireframe helpers: theme toggle (persisted) and simple tab switching. No framework.
(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem("wf-theme");
  if (saved) { root.classList.remove("dark", "light"); root.classList.add(saved); root.dataset.theme = saved; }

  document.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-theme-toggle]");
    if (toggle) {
      const next = root.classList.contains("dark") ? "light" : "dark";
      root.classList.remove("dark", "light"); root.classList.add(next); root.dataset.theme = next;
      localStorage.setItem("wf-theme", next);
      return;
    }
    const tab = event.target.closest("[role=tab][data-panel]");
    if (!tab) return;
    const list = tab.closest("[role=tablist]");
    list.querySelectorAll("[role=tab]").forEach((t) => {
      const on = t === tab;
      t.dataset.selected = String(on);
      t.setAttribute("aria-selected", String(on));
      const ind = t.querySelector(".tabs__indicator");
      if (ind) ind.hidden = !on;
      const panel = document.getElementById(t.dataset.panel);
      if (panel) panel.hidden = !on;
    });
  });
})();
