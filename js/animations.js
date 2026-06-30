export function setupScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        entry.target.querySelectorAll(".skill-fill").forEach((bar) => {
          bar.classList.add("animate");
          bar.style.width = `${bar.dataset.level}%`;
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  document.querySelectorAll(".reveal, .skill-category").forEach((element) => observer.observe(element));
}

export function setupScrollProgress() {
  const progress = document.getElementById("scrollProgress");

  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const width = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = `${width}%`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

export function setupActiveNavigation() {
  const sections = [...document.querySelectorAll("main section[id]")];
  const links = [...document.querySelectorAll(".nav-link")];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach((section) => observer.observe(section));
}

export function setupTypingAnimation(getWords) {
  const element = document.getElementById("typingText");
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let timer;

  const type = () => {
    const words = getWords();
    if (!element || !words.length) return;

    const word = words[wordIndex % words.length];
    element.textContent = word.slice(0, charIndex);

    if (!deleting && charIndex < word.length) {
      charIndex += 1;
      timer = window.setTimeout(type, 70);
      return;
    }

    if (!deleting) {
      deleting = true;
      timer = window.setTimeout(type, 1300);
      return;
    }

    if (charIndex > 0) {
      charIndex -= 1;
      timer = window.setTimeout(type, 35);
      return;
    }

    deleting = false;
    wordIndex += 1;
    timer = window.setTimeout(type, 250);
  };

  window.addEventListener("language:changed", () => {
    window.clearTimeout(timer);
    wordIndex = 0;
    charIndex = 0;
    deleting = false;
    type();
  });

  type();
}

export function setupParticles() {
  const canvas = document.getElementById("particleCanvas");
  const context = canvas?.getContext("2d");
  if (!canvas || !context || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let particles = [];
  let frameId;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: Math.min(54, Math.floor(rect.width / 16)) }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      radius: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.22,
      speedY: (Math.random() - 0.5) * 0.22
    }));
  };

  const draw = () => {
    const rect = canvas.getBoundingClientRect();
    context.clearRect(0, 0, rect.width, rect.height);
    context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--primary");

    particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > rect.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > rect.height) particle.speedY *= -1;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });

    frameId = requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize);
  window.addEventListener("beforeunload", () => cancelAnimationFrame(frameId));
}
