const onReady = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
};

onReady(() => {
  const revealItems = document.querySelectorAll(".fade-up");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  const slider = document.querySelector("[data-slider]");
  if (slider) {
    const slides = [...slider.querySelectorAll(".slide")];
    const dotsHost = slider.querySelector("[data-dots]");
    let current = 0;
    const render = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === current));
      [...dotsHost.children].forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === current);
        dot.setAttribute("aria-current", dotIndex === current ? "true" : "false");
      });
    };
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Показати фото ${index + 1}`);
      dot.addEventListener("click", () => render(index));
      dotsHost.append(dot);
    });
    slider.querySelector("[data-prev]").addEventListener("click", () => render(current - 1));
    slider.querySelector("[data-next]").addEventListener("click", () => render(current + 1));
    render(0);
  }

  const countdown = document.querySelector("[data-countdown]");
  if (countdown) {
    const hours = countdown.querySelector("[data-hours]");
    const minutes = countdown.querySelector("[data-minutes]");
    const seconds = countdown.querySelector("[data-seconds]");
    const endOfDay = () => {
      const date = new Date();
      date.setHours(23, 59, 59, 999);
      return date;
    };
    let deadline = endOfDay();
    const tick = () => {
      if (deadline - new Date() <= 0) deadline = endOfDay();
      const remaining = Math.max(0, deadline - new Date());
      hours.textContent = String(Math.floor(remaining / 3600000)).padStart(2, "0");
      minutes.textContent = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, "0");
      seconds.textContent = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
    };
    tick();
    setInterval(tick, 1000);
  }

  const form = document.querySelector("[data-form]");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = form.elements.name;
      const phone = form.elements.phone;
      const validName = name.value.trim().length >= 2;
      const validPhone = phone.value.replace(/\D/g, "").length >= 10;
      name.setAttribute("aria-invalid", String(!validName));
      phone.setAttribute("aria-invalid", String(!validPhone));
      if (!validName) return name.focus();
      if (!validPhone) return phone.focus();
      form.querySelector(".form-success").hidden = false;
      form.reset();
    });
  }
});
