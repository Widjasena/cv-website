import { setupThemeToggle } from "./theme-toggle.js";
import { loadLanguage, setupLanguageSwitcher, t } from "./language.js";
import {
  setupActiveNavigation,
  setupParticles,
  setupScrollProgress,
  setupScrollReveal,
  setupTypingAnimation
} from "./animations.js";

let projects = [];
let currentFilter = "all";
let testimonialIndex = 0;

document.addEventListener("DOMContentLoaded", async () => {
  setupThemeToggle();
  setupLanguageSwitcher();
  setupMobileMenu();
  setupSmoothClose();
  setupScrollProgress();
  setupActiveNavigation();
  setupParticles();

  await loadLanguage(localStorage.getItem("language") || "id");
  projects = await fetchProjects();

  renderDataDrivenSections();
  renderProjectFilters();
  renderProjects();
  setupProjectModal();
  setupContactForm();
  setupTestimonials();
  setupTypingAnimation(() => t("hero.typing", []));
  setupScrollReveal();
});

window.addEventListener("language:changed", () => {
  renderDataDrivenSections();
  renderProjectFilters();
  renderProjects();
  renderTestimonial();
});

async function fetchProjects() {
  const response = await fetch("data/projects.json");
  if (!response.ok) throw new Error("Unable to load projects");
  return response.json();
}

function renderDataDrivenSections() {
  renderSocialLinks("heroSocials");
  renderSocialLinks("footerSocials");
  renderQuickInfo();
  renderSkills();
  renderTimeline();
  renderContactList();
}

function renderSocialLinks(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.innerHTML = t("socials", []).map((item) => `
    <a class="social-link" href="${item.url}" target="_blank" rel="noreferrer" aria-label="${item.label}">
      ${item.icon}
    </a>
  `).join("");
}

function renderQuickInfo() {
  const target = document.getElementById("quickInfo");
  target.innerHTML = t("about.info", []).map((item) => `
    <article class="info-item">
      <small>${item.label}</small>
      <strong>${item.value}</strong>
    </article>
  `).join("");
}

function renderSkills() {
  const target = document.getElementById("skillsGrid");
  target.innerHTML = t("skills.categories", []).map((category) => `
    <article class="skill-category reveal">
      <h3>${category.title}</h3>
      ${category.items.map((skill) => `
        <div class="skill-item">
          <div class="skill-row">
            <span>${skill.name}</span>
            <span>${skill.level}%</span>
          </div>
          <div class="skill-track">
            <div class="skill-fill" data-level="${skill.level}"></div>
          </div>
        </div>
      `).join("")}
    </article>
  `).join("");
}

function renderTimeline() {
  const target = document.getElementById("timeline");
  target.innerHTML = t("experience.items", []).map((item) => `
    <article class="timeline-item reveal">
      <span class="timeline-date">${item.period}</span>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </article>
  `).join("");
}

function renderContactList() {
  const target = document.getElementById("contactList");
  target.innerHTML = t("contact.items", []).map((item) => `
    <a class="contact-item" href="${item.href}">
      <span aria-hidden="true">${item.icon}</span>
      <span>${item.text}</span>
    </a>
  `).join("");
}

function renderProjectFilters() {
  const filters = t("projects.filters", []);
  const target = document.getElementById("projectFilters");

  target.innerHTML = filters.map((filter) => `
    <button class="filter-btn ${filter.value === currentFilter ? "active" : ""}" type="button" data-filter="${filter.value}" role="tab" aria-selected="${filter.value === currentFilter}">
      ${filter.label}
    </button>
  `).join("");

  target.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;
      renderProjectFilters();
      renderProjects();
    });
  });
}

function renderProjects() {
  const target = document.getElementById("projectGrid");
  const visibleProjects = currentFilter === "all"
    ? projects
    : projects.filter((project) => project.category === currentFilter);

  target.innerHTML = visibleProjects.map((project) => `
    <article class="project-card reveal" tabindex="0" role="button" data-project-id="${project.id}">
      <img src="${project.image}" alt="${project.title}" loading="lazy" width="640" height="400">
      <div class="project-card-body">
        <span class="project-category">${categoryLabel(project.category)}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="tech-list">${project.tech.map((tech) => `<span>${tech}</span>`).join("")}</div>
      </div>
    </article>
  `).join("");

  target.querySelectorAll(".project-card").forEach((card) => {
    const open = () => openProjectModal(card.dataset.projectId);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });
}

function setupProjectModal() {
  document.querySelectorAll("[data-modal-close]").forEach((element) => {
    element.addEventListener("click", closeProjectModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeProjectModal();
  });
}

function openProjectModal(projectId) {
  const project = projects.find((item) => item.id === projectId);
  if (!project) return;

  document.getElementById("modalImage").src = project.image;
  document.getElementById("modalImage").alt = project.title;
  document.getElementById("modalCategory").textContent = categoryLabel(project.category);
  document.getElementById("modalTitle").textContent = project.title;
  document.getElementById("modalDescription").textContent = project.longDescription || project.description;
  document.getElementById("modalTech").innerHTML = project.tech.map((tech) => `<span>${tech}</span>`).join("");
  document.getElementById("modalLive").href = project.live;
  document.getElementById("modalGithub").href = project.github;
  document.getElementById("projectModal").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeProjectModal() {
  const modal = document.getElementById("projectModal");
  if (modal.hidden) return;
  modal.hidden = true;
  document.body.style.overflow = "";
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());
    const errors = validateForm(values);

    form.querySelectorAll(".field-error").forEach((field) => {
      field.textContent = errors[field.dataset.errorFor] || "";
    });

    if (Object.keys(errors).length > 0) return;

    console.log("Contact form submission", values);
    form.reset();
    showToast(t("contact.form.success"));
  });
}

function validateForm(values) {
  const errors = {};
  if (!values.name?.trim()) errors.name = t("contact.form.errors.name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email || "")) errors.email = t("contact.form.errors.email");
  if (!values.message?.trim() || values.message.trim().length < 10) errors.message = t("contact.form.errors.message");
  return errors;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function setupTestimonials() {
  document.getElementById("prevTestimonial").addEventListener("click", () => {
    const items = t("testimonials.items", []);
    testimonialIndex = (testimonialIndex - 1 + items.length) % items.length;
    renderTestimonial();
  });

  document.getElementById("nextTestimonial").addEventListener("click", () => {
    const items = t("testimonials.items", []);
    testimonialIndex = (testimonialIndex + 1) % items.length;
    renderTestimonial();
  });

  renderTestimonial();
}

function renderTestimonial() {
  const items = t("testimonials.items", []);
  const target = document.getElementById("testimonialCard");
  if (!items.length || !target) return;

  const item = items[testimonialIndex % items.length];
  target.innerHTML = `
    <blockquote>${item.quote}</blockquote>
    <p><strong>${item.name}</strong> · ${item.role}</p>
  `;
}

function setupMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("navMenu");

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });
}

function setupSmoothClose() {
  document.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", () => {
      document.getElementById("navMenu")?.classList.remove("open");
      document.getElementById("menuToggle")?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

function categoryLabel(category) {
  return t(`projects.categoryLabels.${category}`, category);
}
