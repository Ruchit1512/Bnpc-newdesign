/**
 * ==============================================================
 * BNPC BHOPAL — GSAP SCROLLTRIGGER MOTION CONTROLLER (2026)
 * Traditional Vanilla JavaScript + GSAP 3.12+
 * ==============================================================
 */

(function () {
  "use strict";

  // Check if GSAP and ScrollTrigger are loaded
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP or ScrollTrigger not loaded. Skipping motion animations.");
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /**
   * 1. HERO VIDEO & CONTENT SCROLL ANIMATION
   */
  function initHeroAnimation() {
    const heroSection = document.querySelector(".hero");
    if (!heroSection) return;

    const heroVideo = heroSection.querySelector(".hero-video");
    if (!heroVideo) return;

    const heroTextCol = heroSection.querySelector(".hero-text-col");
    const heroOverlay = heroSection.querySelector(".hero-overlay");
    const clinicalCard = heroSection.querySelector(".hero-clinical-card");
    const floatingCards = heroSection.querySelectorAll(".hero-floating-card");

    if (prefersReducedMotion) return;

    // Timeline for Hero Scrub
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Content lifts, fades and scales subtly
    if (heroTextCol) {
      heroTl.to(
        heroTextCol,
        {
          y: -70,
          opacity: 0.15,
          scale: 0.96,
          ease: "none",
        },
        0
      );
    }

    // Video scales subtly from 1 to 1.08
    if (heroVideo) {
      heroTl.to(
        heroVideo,
        {
          scale: 1.08,
          ease: "none",
        },
        0
      );
    }

    // Overlay slightly intensifies
    if (heroOverlay) {
      heroTl.to(
        heroOverlay,
        {
          opacity: 0.95,
          ease: "none",
        },
        0
      );
    }

    // Smooth depth scrub on clinical centerpiece card
    if (clinicalCard) {
      const depth = parseFloat(clinicalCard.getAttribute("data-depth")) || 0.15;
      heroTl.to(
        clinicalCard,
        {
          y: -90 * depth,
          opacity: 0.15,
          scale: 0.98,
          ease: "none",
        },
        0
      );
    }

    // Fallback/Legacy support for layered 3D depth cards
    if (floatingCards.length > 0) {
      floatingCards.forEach((card, index) => {
        const depth = parseFloat(card.getAttribute("data-depth")) || (index + 1) * 0.1;
        heroTl.to(
          card,
          {
            y: -120 * depth,
            opacity: 0.1,
            ease: "none",
          },
          0
        );
      });
    }
  }

  /**
   * 2. PINNED STORYTELLING SECTION (#bnpc-story)
   * Four stages: 01, 02, 03, 04 with image and text swaps on scrub
   */
  function initPinnedStorySection() {
    const storySection = document.querySelector("#bnpc-story");
    if (!storySection) return;

    if (prefersReducedMotion) return;

    const images = storySection.querySelectorAll(".story-image-item");
    const texts = storySection.querySelectorAll(".story-step-content");
    const trackerSteps = storySection.querySelectorAll(".story-tracker-step");
    const progressFill = storySection.querySelector(".story-progress-fill");

    if (!images.length || !texts.length) return;

    // Responsive setup: Pin ONLY on desktop (min-width: 992px)
    ScrollTrigger.matchMedia({
      "(min-width: 992px)": function () {
        const totalSteps = Math.min(images.length, texts.length);

        function setStep(stepIndex) {
          images.forEach((img, idx) => {
            img.classList.toggle("active", idx === stepIndex);
          });
          texts.forEach((txt, idx) => {
            txt.classList.toggle("active", idx === stepIndex);
          });
          trackerSteps.forEach((stp, idx) => {
            stp.classList.toggle("active", idx === stepIndex);
          });
          if (progressFill) {
            const pct = ((stepIndex + 1) / totalSteps) * 100;
            progressFill.style.width = pct + "%";
          }
        }

        // Initialize at Step 0
        setStep(0);

        // Pin timeline
        const storyTl = gsap.timeline({
          scrollTrigger: {
            trigger: storySection,
            start: "top top",
            end: "+=2600",
            pin: true,
            scrub: 0.5,
            onUpdate: (self) => {
              const progress = self.progress;
              let activeIndex = Math.min(
                Math.floor(progress * totalSteps),
                totalSteps - 1
              );
              setStep(activeIndex);
            },
          },
        });

        // Click on tracker step to preview
        trackerSteps.forEach((stp, idx) => {
          stp.addEventListener("click", () => {
            setStep(idx);
          });
        });

        return () => {
          // Cleanup when screen resizes below 992px
          storyTl.kill();
        };
      },
      "(max-width: 991.98px)": function () {
        // Mobile fallback: ensure all text steps are visible as a natural reading cards sequence
        texts.forEach((txt) => {
          txt.classList.add("active");
          txt.style.position = "relative";
          txt.style.opacity = "1";
          txt.style.visibility = "visible";
        });
        if (images.length > 0) {
          images[0].classList.add("active");
        }
      },
    });
  }

  /**
   * 3. IMAGE REVEAL ANIMATIONS (Clip-Path & Scale)
   */
  function initImageReveal() {
    if (prefersReducedMotion) return;

    const revealImages = document.querySelectorAll(".bnpc-reveal-image img, .about-main-img-box img");

    revealImages.forEach((img) => {
      // Set initial state
      gsap.set(img, {
        clipPath: "inset(0% 100% 0% 0%)",
        scale: 1.08,
      });

      // Animate into view
      gsap.to(img, {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: img,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });
  }

  /**
   * 4. TEXT REVEAL ANIMATIONS
   */
  function initTextReveal() {
    if (prefersReducedMotion) return;

    const headings = document.querySelectorAll(
      ".section-header-wrap h2, .about-text-content h2, .section-tagline, .bnpc-doctors-title"
    );

    headings.forEach((heading) => {
      gsap.fromTo(
        heading,
        {
          opacity: 0,
          y: 28,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }

  /**
   * 5. SUBTLE 3D DEPTH & PARALLAX
   */
  function initParallax() {
    if (prefersReducedMotion) return;

    // About section floating badges
    const floatCounter = document.querySelector(".about-facility-counter");
    const floatBadge = document.querySelector(".about-badge-float");

    if (floatCounter) {
      gsap.to(floatCounter, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: "#about",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    if (floatBadge) {
      gsap.to(floatBadge, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: "#about",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // Subtle 3D card tilt on mouse move over floating hero cards
    const heroWrap = document.querySelector(".hero-depth-card-wrap");
    if (heroWrap && window.innerWidth >= 992) {
      heroWrap.addEventListener("mousemove", (e) => {
        const rect = heroWrap.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(".hero-floating-card", {
          rotateY: x * 8,
          rotateX: -y * 8,
          duration: 0.5,
          ease: "power1.out",
          stagger: 0.04,
        });
      });

      heroWrap.addEventListener("mouseleave", () => {
        gsap.to(".hero-floating-card", {
          rotateY: 0,
          rotateX: 0,
          duration: 0.7,
          ease: "power2.out",
        });
      });
    }
  }

  /**
   * 6. DOCTOR TABS MOTION REFINEMENTS
   */
  function initDoctorTabsMotion() {
    const doctorTabButtons = document.querySelectorAll("#bnpcDoctorTabs button");
    doctorTabButtons.forEach((btn) => {
      btn.addEventListener("shown.bs.tab", (e) => {
        const targetId = e.target.getAttribute("data-bs-target");
        const targetPane = document.querySelector(targetId);
        if (targetPane) {
          gsap.fromTo(
            targetPane,
            { opacity: 0, y: 15, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out" }
          );
        }
      });
    });
  }

  /**
   * 7. FOOTER REVEAL
   */
  function initFooterReveal() {
    if (prefersReducedMotion) return;

    const footer = document.querySelector("#footer");
    if (!footer) return;

    gsap.fromTo(
      footer.querySelector(".footer-main"),
      { opacity: 0.6, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footer,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      }
    );
  }

  /**
   * INITIALIZE ON DOM CONTENT LOADED
   */
  document.addEventListener("DOMContentLoaded", () => {
    initHeroAnimation();
    initPinnedStorySection();
    initImageReveal();
    initTextReveal();
    initParallax();
    initDoctorTabsMotion();
    initFooterReveal();

    // Refresh triggers once all window resources (images, fonts) finish loading
    window.addEventListener("load", () => {
      ScrollTrigger.refresh();
    });
  });
})();
