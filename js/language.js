const DATA_PATHS = {
  id: "data/id.json",
  en: "data/en.json"
};

let translations = {};
let currentLanguage = localStorage.getItem("language") || "id";

export function getCurrentLanguage() {
  return currentLanguage;
}

export function t(path, fallback = "") {
  return path.split(".").reduce((value, key) => value?.[key], translations) ?? fallback;
}

export async function loadLanguage(language = currentLanguage) {
  const response = await fetch(DATA_PATHS[language]);
  if (!response.ok) {
    throw new Error(`Unable to load language: ${language}`);
  }

  translations = await response.json();
  currentLanguage = language;
  localStorage.setItem("language", language);
  document.documentElement.lang = language;
  applyTranslations();
  updateLanguageButtons();
  window.dispatchEvent(new CustomEvent("language:changed", { detail: { language } }));
  return translations;
}

export function applyTranslations(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  root.querySelectorAll("[data-placeholder-key]").forEach((element) => {
    element.placeholder = t(element.dataset.placeholderKey);
  });

  root.querySelectorAll("[data-aria-label-key]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.ariaLabelKey));
  });

  root.querySelectorAll("[data-alt-key]").forEach((element) => {
    element.alt = t(element.dataset.altKey);
  });

  document.title = t("meta.title", document.title);
  setMeta("description", t("meta.description"));
  setMeta("keywords", t("meta.keywords"));
  setMetaProperty("og:title", t("meta.ogTitle"));
  setMetaProperty("og:description", t("meta.ogDescription"));
}

export function setupLanguageSwitcher() {
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => loadLanguage(button.dataset.lang));
  });
}

function updateLanguageButtons() {
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === currentLanguage);
  });
}

function setMeta(name, content) {
  const element = document.querySelector(`meta[name="${name}"]`);
  if (element && content) element.setAttribute("content", content);
}

function setMetaProperty(property, content) {
  const element = document.querySelector(`meta[property="${property}"]`);
  if (element && content) element.setAttribute("content", content);
}
