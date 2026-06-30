const STORAGE_KEY = "theme";

export function setupThemeToggle() {
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  setTheme(savedTheme || systemTheme);

  document.getElementById("themeToggle")?.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
}

export function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
}
