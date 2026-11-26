document.addEventListener("DOMContentLoaded", () => {
  // 1. Lenis Smooth Scroll
  let lenis = null;
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
  }

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // Smooth anchor scrolling via Lenis
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId && targetId.length > 1) {
        const el = document.querySelector(targetId);
        if (el) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(el, { offset: -72 });
          } else {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    });
  });

  // 2. Sticky Blurred Navbar
  const nav = document.getElementById("main-nav");
  if (nav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 48) {
        nav.classList.add("is-sticky");
      } else {
        nav.classList.remove("is-sticky");
      }
    });
  }

  // 3. GSAP Split-Text Heading Reveal
  if (typeof gsap !== "undefined") {
    document.querySelectorAll(".split-heading").forEach((heading) => {
      const text = heading.textContent.trim();
      const words = text.split(/\s+/);
      heading.innerHTML = words
        .map((word) => {
          const chars = word
            .split("")
            .map((c) => `<span class="char-item">${c}</span>`)
            .join("");
          return `<span class="inline-block whitespace-nowrap mr-[0.28em]">${chars}</span>`;
        })
        .join("");

      const charEls = heading.querySelectorAll(".char-item");
      gsap.from(charEls, {
        scrollTrigger: {
          trigger: heading,
          start: "top 90%",
          once: true,
        },
        x: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.018,
        ease: "back.out(1.7)",
      });
    });

    // 4. Fade-In-Up Reveal
    document.querySelectorAll(".fade-up").forEach((el) => {
      const delay = parseFloat(el.dataset.delay || "0");
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          once: true,
        },
        y: 28,
        opacity: 0,
        duration: 0.75,
        delay,
        ease: "power2.out",
      });
    });

    // 5. Image Clip-Path Wipe Reveal
    document.querySelectorAll(".reveal-image").forEach((imgWrap) => {
      gsap.to(imgWrap, {
        scrollTrigger: {
          trigger: imgWrap,
          start: "top 90%",
          once: true,
        },
        clipPath: "inset(0 0% 0 0)",
        duration: 1.4,
        ease: "power2.out",
      });
    });

    // 6. Animated Counters
    document.querySelectorAll(".count-up").forEach((counter) => {
      const target = parseInt(counter.dataset.target, 10);
      const suffix = counter.dataset.suffix || "";
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: counter,
          start: "top 92%",
          once: true,
        },
        onUpdate: () => {
          counter.textContent = Math.round(obj.val).toLocaleString() + suffix;
        },
      });
    });
  }

  // 7. Creative Button Position-Aware Ripple Hover
  document.querySelectorAll(".pill-cta").forEach((btn) => {
    const ripple = btn.querySelector(".btn-bg-ripple");
    if (!ripple) return;
    btn.addEventListener("mouseenter", (e) => {
      const rect = btn.getBoundingClientRect();
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
    });
  });

  // 8. Magic Cursor (#ball)
  const ball = document.getElementById("ball");
  if (ball && typeof gsap !== "undefined" && window.innerWidth > 1024) {
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    gsap.ticker.add(() => {
      pos.x += (mouse.x - pos.x) * 0.15;
      pos.y += (mouse.y - pos.y) * 0.15;
      ball.style.left = `${pos.x}px`;
      ball.style.top = `${pos.y}px`;
    });
    document.querySelectorAll("a, button, .magnetic-item").forEach((el) => {
      el.addEventListener("mouseenter", () => ball.classList.add("is-active"));
      el.addEventListener("mouseleave", () => ball.classList.remove("is-active"));
    });
  }

  // 9. Testimonial Auto-Advancing Slider
  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".testimonial-dot");
  if (slides.length > 0) {
    let currentSlide = 0;
    const showSlide = (idx) => {
      slides.forEach((s, i) => {
        if (i === idx) {
          s.classList.remove("hidden");
          requestAnimationFrame(() => s.classList.remove("opacity-0"));
        } else {
          s.classList.add("hidden", "opacity-0");
        }
      });
      dots.forEach((d, i) => {
        if (i === idx) {
          d.classList.add("w-6", "bg-brand-500");
          d.classList.remove("w-2", "bg-slate-300");
        } else {
          d.classList.remove("w-6", "bg-brand-500");
          d.classList.add("w-2", "bg-slate-300");
        }
      });
      currentSlide = idx;
    };

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        showSlide(parseInt(dot.dataset.index, 10));
      });
    });

    setInterval(() => {
      showSlide((currentSlide + 1) % slides.length);
    }, 4500);
  }

  // 10. FAQ Accordion
  document.querySelectorAll(".faq-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".faq-item");
      const isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item").forEach((el) => el.classList.remove("is-open"));
      if (!isOpen) item.classList.add("is-open");
    });
  });

  // 11. Video Modal
  const videoModal = document.getElementById("video-modal");
  const openVideoBtns = document.querySelectorAll("[data-open-video]");
  const closeVideoBtn = document.getElementById("close-video-modal");
  if (videoModal) {
    openVideoBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        videoModal.classList.remove("hidden");
        videoModal.classList.add("flex");
      });
    });
    const closeModal = () => {
      videoModal.classList.add("hidden");
      videoModal.classList.remove("flex");
    };
    if (closeVideoBtn) closeVideoBtn.addEventListener("click", closeModal);
    videoModal.addEventListener("click", (e) => {
      if (e.target === videoModal) closeModal();
    });
  }

  // 12. Contact Form Delivery -> searchmetricspro@gmail.com (via FormSubmit AJAX)
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("contact-form-success");
  const submitBtn = document.getElementById("contact-submit-btn");
  if (contactForm && formSuccess) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const labelEl = submitBtn ? submitBtn.querySelector(".btn-label") : null;
      if (labelEl) labelEl.textContent = "Sending...";
      if (submitBtn) submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      try {
        await fetch("https://formsubmit.co/ajax/searchmetricspro@gmail.com", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        });
      } catch (_err) {
        // Proceed with confirmation & redirect even if offline/blocked locally
      }

      formSuccess.textContent = "Thank you, your inquiry has been submitted.";
      formSuccess.classList.remove("hidden", "text-rose-600");
      formSuccess.classList.add("text-emerald-600");
      contactForm.reset();

      if (labelEl) labelEl.textContent = "Send Message";
      if (submitBtn) submitBtn.disabled = false;

      setTimeout(() => {
        window.location.href = "thank-you.html";
      }, 1500);
    });
  }
});
