const body = document.body;
const themeToggle = document.querySelector(".theme-toggle");
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const reveals = document.querySelectorAll(".reveal");
const filterChips = document.querySelectorAll(".filter-chip");
const certItems = document.querySelectorAll(".cert-item");
const contactForm = document.querySelector("#contact-form");
const toastStack = document.querySelector("#toast-stack");
const projectTiles = document.querySelectorAll(".project-tile");

const savedTheme = localStorage.getItem("portfolio-theme");
const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "dark" || (!savedTheme && preferredDark)) {
  body.classList.add("dark-theme");
}

themeToggle?.addEventListener("click", () => {
  body.classList.toggle("dark-theme");
  localStorage.setItem(
    "portfolio-theme",
    body.classList.contains("dark-theme") ? "dark" : "light"
  );
});

menuToggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

reveals.forEach((item) => revealObserver.observe(item));

projectTiles.forEach((tile) => {
  const toggleFlip = () => {
    const isFlipped = tile.classList.toggle("is-flipped");
    tile.setAttribute("aria-expanded", String(isFlipped));
  };

  tile.addEventListener("click", (event) => {
    if (event.target.closest(".project-button")) {
      return;
    }

    toggleFlip();
  });

  tile.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    toggleFlip();
  });
});

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const selected = chip.dataset.filter;

    filterChips.forEach((button) => button.classList.remove("is-active"));
    chip.classList.add("is-active");

    const visibleItems = [];

    certItems.forEach((item) => {
      const categories = item.dataset.category?.split(" ") ?? [];
      const shouldShow = selected === "all" || categories.includes(selected);
      item.hidden = !shouldShow;

      if (shouldShow) {
        visibleItems.push(item);
      }
    });

    visibleItems.forEach((item, index) => {
      item.animate(
        [
          {
            opacity: 0,
            transform: "translateY(18px) scale(0.985)"
          },
          {
            opacity: 1,
            transform: "translateY(0) scale(1)"
          }
        ],
        {
          duration: 360,
          delay: index * 55,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both"
        }
      );
    });
  });
});

function showToast(type, title, message) {
  if (!toastStack) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="fa-solid ${type === "success" ? "fa-check" : "fa-exclamation"}"></i>
    </div>
    <div>
      <strong>${title}</strong>
      <p>${message}</p>
    </div>
  `;

  toastStack.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add("is-leaving");
    window.setTimeout(() => toast.remove(), 220);
  }, 3200);
}

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (window.location.protocol === "file:") {
    showToast(
      "error",
      "Local file detected",
      "Open this page through Live Server or a hosted website. FormSubmit often will not work reliably from a local file."
    );
    return;
  }

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    showToast("error", "Incomplete form", "Please fill in your name, email, subject, and message before sending.");
    return;
  }

  const emailInput = contactForm.querySelector('input[name="email"]');
  const replyToInput = contactForm.querySelector('input[name="_replyto"]');
  const urlInput = contactForm.querySelector('input[name="_url"]');

  if (replyToInput && emailInput) {
    replyToInput.value = emailInput.value;
  }

  if (urlInput) {
    urlInput.value = window.location.href;
  }

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton?.textContent;

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
  }

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    contactForm.reset();
    showToast("success", "Message sent", "Thanks for reaching out. Your message has been sent successfully.");
  } catch (error) {
    showToast("error", "Message not sent", "Something went wrong while sending your message. Please try again in a moment.");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText ?? "Send Message";
    }
  }
});
