// ============================================================
//  The Bells Private School — main.js
//  Hamburger nav, scroll reveal, form handler
// ============================================================

(function () {
  "use strict";

  /* ----------------------------------------------------------
     HAMBURGER NAV
  ---------------------------------------------------------- */
  function initNav() {
    var nav = document.getElementById("main-nav");
    if (!nav) return;
    var navLinks = nav.querySelector(".nav-links");
    var hamburger = nav.querySelector(".nav-hamburger");
    var overlay = document.getElementById("nav-overlay");
    if (!navLinks || !hamburger) return;

    function openNav() {
      navLinks.classList.add("open");
      hamburger.classList.add("open");
      hamburger.setAttribute("aria-expanded", "true");
      hamburger.setAttribute("aria-label", "Close menu");
      document.body.classList.add("nav-open");
      if (overlay) overlay.classList.add("visible");
    }

    function closeNav() {
      navLinks.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Open menu");
      document.body.classList.remove("nav-open");
      if (overlay) overlay.classList.remove("visible");
    }

    hamburger.addEventListener("click", function () {
      navLinks.classList.contains("open") ? closeNav() : openNav();
    });

    if (overlay) overlay.addEventListener("click", closeNav);

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 768) closeNav();
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) closeNav();
    });
  }

  /* ----------------------------------------------------------
     ACTIVE NAV LINK
  ---------------------------------------------------------- */
  function setActiveNav() {
    var current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a[data-page]").forEach(function (a) {
      a.classList.toggle("active", a.dataset.page === current);
    });
  }

  /* ----------------------------------------------------------
     GALLERY CATEGORY FILTER
  ---------------------------------------------------------- */
  function initGalleryFilter() {
    var buttons = document.querySelectorAll(".cat-btn");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
      });
    });
  }

  /* ----------------------------------------------------------
     CONTACT FORM
  ---------------------------------------------------------- */
  window.handleFormSubmit = function () {
    var successEl = document.getElementById("form-success");
    if (successEl) {
      successEl.style.display = "block";
      successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  /* ----------------------------------------------------------
     SCROLL REVEAL
  ---------------------------------------------------------- */
  function initScrollReveal() {
    if (!("IntersectionObserver" in window)) return;
    var targets = document.querySelectorAll(
      ".why-item, .service-item, .pillar, .step-block, .programme-block, .value-cell, .about-right-block, .info-block, .req-col",
    );
    targets.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    });
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var siblings = Array.from(entry.target.parentElement.children);
          var delay = Math.min(siblings.indexOf(entry.target) * 70, 350);
          setTimeout(function () {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, delay);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 },
    );
    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     NAV SHADOW ON SCROLL
  ---------------------------------------------------------- */
  function initNavShadow() {
    var nav = document.getElementById("main-nav");
    if (!nav) return;
    window.addEventListener(
      "scroll",
      function () {
        nav.style.boxShadow =
          window.scrollY > 10 ? "0 2px 16px rgba(0,0,0,0.25)" : "none";
      },
      { passive: true },
    );
  }

  /* ----------------------------------------------------------
     INIT
  ---------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    setActiveNav();
    initGalleryFilter();
    initScrollReveal();
    initNavShadow();
  });
})();

// ============================================================
//  HERO SLIDESHOW
// ============================================================
function initHeroSlideshow() {
  var slides = document.querySelectorAll(".hero-slide");
  var dots = document.querySelectorAll(".slide-dot");
  var prevBtn = document.querySelector(".slide-prev");
  var nextBtn = document.querySelector(".slide-next");

  if (!slides.length) return;

  var current = 0;
  var total = slides.length;
  var timer = null;
  var INTERVAL = 5000; // 5 seconds per slide

  function goTo(index) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (index + total) % total;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
  }

  function next() {
    goTo(current + 1);
  }
  function prev() {
    goTo(current - 1);
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  }

  function resetAuto() {
    startAuto(); // restart timer on manual interaction
  }

  // Arrow buttons
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      next();
      resetAuto();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      prev();
      resetAuto();
    });
  }

  // Dot buttons
  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      goTo(i);
      resetAuto();
    });
  });

  // Pause on hover (desktop)
  var slideshow = document.querySelector(".hero-slideshow");
  if (slideshow) {
    slideshow.addEventListener("mouseenter", function () {
      clearInterval(timer);
    });
    slideshow.addEventListener("mouseleave", startAuto);
  }

  // Touch swipe support
  var touchStartX = 0;
  if (slideshow) {
    slideshow.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    slideshow.addEventListener(
      "touchend",
      function (e) {
        var diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 40) {
          diff > 0 ? next() : prev();
          resetAuto();
        }
      },
      { passive: true },
    );
  }

  // Keyboard navigation (left/right arrows)
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
      next();
      resetAuto();
    }
    if (e.key === "ArrowLeft") {
      prev();
      resetAuto();
    }
  });

  // Start
  startAuto();
}

document.addEventListener("DOMContentLoaded", function () {
  initHeroSlideshow();
});
