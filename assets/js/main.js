

(function() {
  "use strict";

  /**
   * Remove .html extension from browser address bar
   */
  if (window.location.pathname.endsWith('.html')) {
    let cleanPath = window.location.pathname.replace(/\.html$/, '');
    if (cleanPath === '/index' || cleanPath.endsWith('/index')) {
      cleanPath = cleanPath.replace(/\/index$/, '') || '/';
    }
    window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
  }

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      if (swiperElement.swiper) return;
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    initSwiper();
  } else {
    window.addEventListener("load", initSwiper);
    document.addEventListener("DOMContentLoaded", initSwiper);
  }

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

})();

const modal = document.getElementById("galleryModal");
if (modal) {
  const modalImg = document.getElementById("galleryModalImg");
  const closeBtn = document.querySelector(".gallery-close");
  const images = document.querySelectorAll(".gallery-item img");
  let currentIndex = 0;

  function showImage(index){
      currentIndex = index;
      if (modalImg) modalImg.src = images[currentIndex].src;
  }

  images.forEach((img,index)=>{
      img.addEventListener("click",()=>{
          modal.classList.add("active");
          showImage(index);
      });
  });

  const nextBtn = document.querySelector(".next");
  if (nextBtn) {
    nextBtn.onclick = ()=>{
        currentIndex++;
        if(currentIndex >= images.length){
            currentIndex = 0;
        }
        showImage(currentIndex);
    };
  }

  const prevBtn = document.querySelector(".prev");
  if (prevBtn) {
    prevBtn.onclick = ()=>{
        currentIndex--;
        if(currentIndex < 0){
            currentIndex = images.length-1;
        }
        showImage(currentIndex);
    };
  }

  if (closeBtn) {
    closeBtn.onclick=()=>{
        modal.classList.remove("active");
    };
  }

  modal.onclick=(e)=>{
      if(e.target===modal){
          modal.classList.remove("active");
      }
  };

  document.addEventListener("keydown",(e)=>{
      if(!modal.classList.contains("active")) return;
      if(e.key==="ArrowRight" && nextBtn){
          nextBtn.click();
      }
      if(e.key==="ArrowLeft" && prevBtn){
          prevBtn.click();
      }
      if(e.key==="Escape"){
          modal.classList.remove("active");
      }
  });
}

/**
 * BNPC Doctor Tabs Switcher
 */
document.addEventListener("DOMContentLoaded", () => {
  const docTabButtons = document.querySelectorAll(".bnpc-doctor-tab-btn");
  if (docTabButtons.length > 0) {
    docTabButtons.forEach(btn => {
      btn.addEventListener("click", function() {
        const targetSelector = this.getAttribute("data-bs-target");
        if (!targetSelector) return;

        docTabButtons.forEach(b => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });

        this.classList.add("active");
        this.setAttribute("aria-selected", "true");

        const tabContent = document.getElementById("bnpcDoctorTabContent");
        if (tabContent) {
          const allPanes = tabContent.querySelectorAll(".tab-pane");
          allPanes.forEach(pane => {
            pane.classList.remove("show", "active");
          });
          const targetPane = tabContent.querySelector(targetSelector);
          if (targetPane) {
            targetPane.classList.add("show", "active");
          }
        }
      });
    });
  }
});

/**
 * BNPC Facilities Showcase Interactive Switcher
 */
document.addEventListener("DOMContentLoaded", () => {
  const facilityCards = document.querySelectorAll(".bnpc-facility-strip-card[data-facility-index]");
  if (!facilityCards.length) return;

  const facilitiesData = [
    {
      index: "01",
      total: "06",
      category: "IN-HOUSE TESTING",
      badgeName: "Digital EEG Lab",
      title: "Digital EEG & Brain Diagnostics",
      desc: "Brain wave testing to help check for seizures, brain activity, and neurological conditions in a comfortable clinical setting.",
      points: [
        "Digital EEG testing",
        "Brain activity assessment",
        "Patient-friendly testing"
      ],
      img: "./assets/img/bg/eeg-lab.webp",
      link: "services.html"
    },
    {
      index: "02",
      total: "06",
      category: "ADVANCED THERAPY",
      badgeName: "rTMS Therapy Room",
      title: "rTMS Therapy Room",
      desc: "Non-invasive brain stimulation treatment for depression and OCD when standard medications need additional support.",
      points: [
        "Non-invasive brain stimulation",
        "Evidence-based therapy",
        "Comfortable outpatient sessions"
      ],
      img: "./assets/img/bg/rtms.webp",
      link: "services.html"
    },
    {
      index: "03",
      total: "06",
      category: "SLEEP DIAGNOSTICS",
      badgeName: "Sleep Study Lab (PSG)",
      title: "Sleep Study Lab (PSG)",
      desc: "Polysomnography tests to evaluate sleep patterns, nighttime breathing difficulties, and chronic sleeplessness.",
      points: [
        "Overnight sleep evaluation",
        "Sleep apnea & insomnia checks",
        "Quiet, dedicated test room"
      ],
      img: "./assets/img/bg/sleep-lab.webp",
      link: "services.html"
    },
    {
      index: "04",
      total: "06",
      category: "NEUROLOGICAL THERAPY",
      badgeName: "Biofeedback Suite",
      title: "Biofeedback Suite",
      desc: "Guided relaxation techniques that help patients learn physiological body control, manage tension, and relieve anxiety.",
      points: [
        "Mind-body relaxation therapy",
        "Stress & headache relief",
        "Non-medicinal guided practice"
      ],
      img: "./assets/img/bg/biofeedback.jpg",
      link: "services.html"
    },
    {
      index: "05",
      total: "06",
      category: "CLINICAL PSYCHOLOGY",
      badgeName: "Psychological Testing Room",
      title: "Psychological Testing Room",
      desc: "A dedicated, private space for comprehensive psychometric evaluations, cognitive assessments, and counseling.",
      points: [
        "Memory & IQ testing",
        "Personality assessments",
        "Confidential consultation"
      ],
      img: "./assets/img/bg/testing-room.webp",
      link: "services.html"
    },
    {
      index: "06",
      total: "06",
      category: "LABORATORY SERVICES",
      badgeName: "Lab & Drug Screening",
      title: "Lab & Drug Screening",
      desc: "Routine clinical and diagnostic pathology screening to ensure safe, well-monitored medical treatment for all patients.",
      points: [
        "Routine health screening",
        "Confidential testing protocols",
        "Safety monitoring during care"
      ],
      img: "./assets/img/health/facilities-6.webp",
      link: "services.html"
    }
  ];

  let currentActiveIndex = 0;

  function switchFacility(idx) {
    if (idx === currentActiveIndex) return;
    const data = facilitiesData[idx];
    if (!data) return;

    currentActiveIndex = idx;

    facilityCards.forEach(c => {
      if (parseInt(c.getAttribute("data-facility-index"), 10) === idx) {
        c.classList.add("is-active");
      } else {
        c.classList.remove("is-active");
      }
    });

    const heroImg = document.getElementById("bnpcHeroImg");
    const badgeNum = document.getElementById("bnpcFacBadgeNum");
    const badgeName = document.getElementById("bnpcFacBadgeName");
    const catEl = document.getElementById("bnpcFacCategory");
    const curEl = document.getElementById("bnpcFacCurrent");
    const progressFill = document.getElementById("bnpcFacProgressFill");
    const titleEl = document.getElementById("bnpcFacTitle");
    const descEl = document.getElementById("bnpcFacDesc");
    const pointsEl = document.getElementById("bnpcFacPoints");
    const btnEl = document.getElementById("bnpcFacBtn");
    const infoBox = document.getElementById("bnpcHeroInfoBox");

    if (heroImg) heroImg.style.opacity = "0.2";
    if (infoBox) infoBox.style.opacity = "0.2";

    setTimeout(() => {
      if (heroImg) {
        heroImg.src = data.img;
        heroImg.alt = data.title;
        heroImg.style.opacity = "1";
      }
      if (badgeNum) badgeNum.textContent = `${data.index} / ${data.total}`;
      if (badgeName) badgeName.textContent = data.badgeName;
      if (catEl) catEl.textContent = data.category;
      if (curEl) curEl.textContent = data.index;
      if (progressFill) progressFill.style.width = `${((idx + 1) / 6) * 100}%`;
      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.desc;

      if (pointsEl) {
        pointsEl.innerHTML = data.points
          .map(pt => `<div class="bnpc-facility-feature-item"><i class="bi bi-check2"></i> <span>${pt}</span></div>`)
          .join("");
      }

      if (btnEl) {
        btnEl.href = data.link;
      }

      if (infoBox) infoBox.style.opacity = "1";
    }, 180);
  }

  facilityCards.forEach(card => {
    card.addEventListener("click", () => {
      const idx = parseInt(card.getAttribute("data-facility-index"), 10);
      switchFacility(idx);
    });
  });
});

/**
 * BNPC Conditions We Treat Interactive Explorer
 */
document.addEventListener("DOMContentLoaded", () => {
  const condRows = document.querySelectorAll(".bnpc-cond-row[data-cond-index]");
  const condExplorer = document.getElementById("bnpcConditionExplorer");
  if (!condRows.length || !condExplorer) return;

  const conditionsData = [
    {
      index: "01",
      total: "08",
      name: "Common Psychiatric Conditions",
      desc: "Comprehensive evaluation and individualized treatment for persistent mood, anxiety, and psychotic conditions.",
      conditions: [
        "Depression",
        "Anxiety Disorders",
        "Bipolar Disorder",
        "Schizophrenia and Related Psychotic Disorders",
        "Obsessive-Compulsive Disorder (OCD)"
      ],
      img: "./assets/img/bg/ocd.png",
      link: "services.html"
    },
    {
      index: "02",
      total: "08",
      name: "Child and Adolescent Mental Health",
      desc: "Specialised psychiatric assessment and compassionate care for children and teenagers experiencing developmental or behavioural concerns.",
      conditions: [
        "Attention-Deficit/Hyperactivity Disorder (ADHD)",
        "Autism Spectrum Disorder",
        "Learning Disabilities",
        "Behavioural and Emotional Difficulties"
      ],
      img: "./assets/img/bg/child.png",
      link: "services.html"
    },
    {
      index: "03",
      total: "08",
      name: "Addiction and Substance Use",
      desc: "Medically supervised detoxification, craving management, relapse prevention, and structured residential rehabilitation in our 50+ bed hospital.",
      conditions: [
        "Alcohol Dependence",
        "Tobacco and Smoking Dependence",
        "Drug Addiction and Substance Use Disorders",
        "Cocaine-Related Substance Use",
        "LSD and Other Substance-Related Concerns"
      ],
      img: "./assets/img/bg/addiction.png",
      link: "services.html"
    },
    {
      index: "04",
      total: "08",
      name: "Older Adult Mental Health",
      desc: "Gentle assessments and medical care to protect cognitive health, memory, and senior emotional and behavioural wellbeing.",
      conditions: [
        "Dementia",
        "Delirium",
        "Memory-Related Concerns",
        "Age-Related Emotional and Behavioural Difficulties"
      ],
      img: "./assets/img/bg/age.png",
      link: "services.html"
    },
    {
      index: "05",
      total: "08",
      name: "Women's Mental Health",
      desc: "Confidential, respectful psychiatric care for emotional well-being before, during, and after pregnancy and throughout life transitions.",
      conditions: [
        "Mental Health Concerns During and After Pregnancy",
        "Postpartum Depression",
        "Postpartum Psychosis"
      ],
      img: "./assets/img/bg/women.png",
      link: "services.html"
    },
    {
      index: "06",
      total: "08",
      name: "Specialised Mental Health Support",
      desc: "Respectful, non-judgmental support for gender-related distress, LGBTQIA+ emotional wellbeing, complex psychiatric conditions, and crisis assessment.",
      conditions: [
        "Gender Dysphoria and Gender-Related Distress",
        "Mental Health Support for LGBTQIA+ Individuals",
        "Severe and Persistent Psychiatric Conditions",
        "Suicide Risk Assessment and Prevention Support"
      ],
      img: "./assets/img/bg/mental.png",
      link: "services.html"
    },
    {
      index: "07",
      total: "08",
      name: "Sleep Diagnostics & Disorders",
      desc: "In-house polysomnography (overnight sleep study) testing and psychiatric evaluation for chronic insomnia and sleep-wake cycle disturbances.",
      conditions: [
        "Chronic Insomnia",
        "Daytime Sleepiness & Sleep Apnea",
        "Polysomnography (Sleep Study)",
        "Circadian Sleep-Wake Cycle Disruptions"
      ],
      img: "./assets/img/bg/sleep.png",
      link: "services.html"
    },
    {
      index: "08",
      total: "08",
      name: "Stress & Mind-Body Health",
      desc: "Targeted clinical care and biofeedback relaxation to relieve tension headaches, migraines, and physical symptoms linked to psychological stress.",
      conditions: [
        "Stress Headaches & Migraine",
        "Psychosomatic Tension Symptoms",
        "Workplace Burnout & Fatigue",
        "Biofeedback Neuro-Regulation"
      ],
      img: "./assets/img/bg/stress.png",
      link: "services.html"
    }
  ];

  let activeCondIndex = 0;
  let autoRotateTimer = null;
  let isHovered = false;

  function setCondition(idx) {
    if (idx === activeCondIndex && condRows[idx].classList.contains("is-active")) return;
    const data = conditionsData[idx];
    if (!data) return;

    activeCondIndex = idx;

    condRows.forEach((r, i) => {
      if (i === idx) {
        r.classList.add("is-active");
      } else {
        r.classList.remove("is-active");
      }
    });

    const heroImg = document.getElementById("bnpcCondHeroImg");
    const counterBadge = document.getElementById("bnpcCondCounter");
    const titleEl = document.getElementById("bnpcCondActiveTitle");
    const descEl = document.getElementById("bnpcCondActiveDesc");
    const chipsList = document.getElementById("bnpcCondChipsList");
    const visualBody = document.getElementById("bnpcCondVisualBody");
    const ctaBtn = document.getElementById("bnpcCondCtaBtn");

    if (heroImg) heroImg.style.opacity = "0.2";
    if (visualBody) visualBody.style.opacity = "0.2";

    setTimeout(() => {
      if (heroImg) {
        heroImg.src = data.img;
        heroImg.alt = data.name + " BNPC Bhopal";
        heroImg.style.opacity = "1";
      }
      if (counterBadge) counterBadge.textContent = `${data.index} / ${data.total}`;
      if (titleEl) titleEl.textContent = data.name;
      if (descEl) descEl.textContent = data.desc;

      if (chipsList) {
        chipsList.innerHTML = data.conditions
          .map(c => `<span class="bnpc-cond-chip">${c}</span>`)
          .join("");
      }

      if (ctaBtn) ctaBtn.href = data.link;
      if (visualBody) visualBody.style.opacity = "1";
    }, 160);
  }

  condRows.forEach((row, i) => {
    row.addEventListener("mouseenter", () => {
      setCondition(i);
    });
    row.addEventListener("click", () => {
      setCondition(i);
    });
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setCondition(i);
      }
    });
  });

  function startAutoRotate() {
    stopAutoRotate();
    autoRotateTimer = setInterval(() => {
      if (!isHovered) {
        const nextIdx = (activeCondIndex + 1) % conditionsData.length;
        setCondition(nextIdx);
      }
    }, 5500);
  }

  function stopAutoRotate() {
    if (autoRotateTimer) {
      clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
  }

  condExplorer.addEventListener("mouseenter", () => {
    isHovered = true;
  });

  startAutoRotate();
});

/**
 * BNPC Services Page: 12 Conditions Interactive Explorer
 */
document.addEventListener("DOMContentLoaded", () => {
  const explorerWrap = document.getElementById("servicesConditionExplorer");
  if (!explorerWrap) return;

  const btnItems = explorerWrap.querySelectorAll(".bnpc-cond-btn-item[data-cond-index]");
  const catTag = document.getElementById("servCondCatTag");
  const counterEl = document.getElementById("servCondCounter");
  const titleEl = document.getElementById("servCondTitle");
  const descEl = document.getElementById("servCondDesc");
  const chipsEl = document.getElementById("servCondChips");
  const detailPanel = document.getElementById("servCondDetailPanel");

  const servicesConditionsData = [
    {
      num: "01",
      category: "Mood & Anxiety",
      title: "Common Mental Health Disorders",
      desc: "Compassionate evaluation and evidence-based clinical therapy for persistent sadness, racing thoughts, panic, and debilitating everyday anxiety.",
      chips: ["Depression", "Anxiety Disorders", "Panic Attacks", "Phobias", "OCD (Obsessive Thoughts)", "Excessive Worry & Fear"]
    },
    {
      num: "02",
      category: "Severe Psychiatric",
      title: "Psychotic Disorders",
      desc: "Structured inpatient and outpatient psychiatric stabilization, antipsychotic medication management, and ongoing rehabilitation for severe conditions.",
      chips: ["Schizophrenia", "Mania", "Delusional Disorders", "Acute Psychosis", "Severe Behavioral Disturbances"]
    },
    {
      num: "03",
      category: "Substance & Habit",
      title: "Addiction & Substance Use",
      desc: "Safe medical detoxification, pharmaceutical implants, nicotine replacement, and structured psychological recovery in our 50+ bed center.",
      chips: ["Alcohol Addiction", "Tobacco Dependence", "Drug Addiction", "Internet & Mobile Addiction", "Gambling Addiction"]
    },
    {
      num: "04",
      category: "Sleep Medicine",
      title: "Sleep Disorders",
      desc: "In-house Polysomnography (Sleep Lab) diagnostics and medical management to identify and treat chronic sleep cycle disruption.",
      chips: ["Insomnia", "Excessive Sleepiness", "Narcolepsy", "Sleep Walking", "Nightmares & Parasomnias"]
    },
    {
      num: "05",
      category: "Mind-Body Health",
      title: "Psychosomatic Disorders",
      desc: "Specialized neuropsychiatric treatment for physical ailments, gastrointestinal distress, and cardiovascular symptoms triggered by emotional tension.",
      chips: ["Stress Related Headaches", "High Blood Pressure Stress", "Skin Disorders (Neurodermatitis)", "Anxiety Related Breathing Problems", "Stress Related Digestive Issues"]
    },
    {
      num: "06",
      category: "Pediatric Psychiatry",
      title: "Child & Adolescent Mental Health",
      desc: "Child-friendly psychological evaluations, IQ testing, autism diagnostic screening, and behavioral counseling for growing children and teenagers.",
      chips: ["ADHD (Hyperactivity & Attention)", "Autism Spectrum Disorder", "Learning Disabilities (Dyslexia)", "Behavioral Problems", "Developmental Delays"]
    },
    {
      num: "07",
      category: "Pain & Neurological",
      title: "Chronic Headache & Physical Pain",
      desc: "Integrated biofeedback, rTMS neuromodulation, and clinical headache management for chronic tension and unremitting neurogenic pain.",
      chips: ["Migraine", "Tension Headache", "Chronic Pain Conditions", "Stress Related Physical Symptoms"]
    },
    {
      num: "08",
      category: "Geriatric & Memory",
      title: "Memory & Cognitive Disorders",
      desc: "Gentle memory clinic evaluations, cognitive decline screening, and comprehensive supportive care for seniors and their family caregivers.",
      chips: ["Memory Problems", "Dementia Care", "Cognitive Decline", "Age Related Mental Health Issues"]
    },
    {
      num: "09",
      category: "Specialized Care",
      title: "Women's Mental Health",
      desc: "Confidential, respectful consultations addressing hormonal fluctuations, perinatal mood changes, and gender-specific mental health concerns.",
      chips: ["Premenstrual Mood Changes (PMDD)", "Anxiety & Depression", "Pregnancy Related Concerns", "Postpartum Mental Health", "Eating Disorders"]
    },
    {
      num: "10",
      category: "Intimacy & Couple",
      title: "Sexual & Relationship Concerns",
      desc: "Professional psychosexual counseling, confidential couple therapy, and medical assessment for relationship and sexual health concerns.",
      chips: ["Erectile Dysfunction Counseling", "Premature Ejaculation Counseling", "Marital Issues", "Relationship Counseling", "Sexual Counseling"]
    },
    {
      num: "11",
      category: "Behavior & Impulse",
      title: "Personality & Behavioral Disorders",
      desc: "Specialized psychotherapy and behavioral intervention protocols to cultivate emotional regulation, impulse stability, and healthy relationships.",
      chips: ["Aggressive Behavior", "Conduct Problems", "Impulse Control Issues", "Personality Disorders", "Antisocial Behaviors"]
    },
    {
      num: "12",
      category: "Urgent Support",
      title: "Trauma & Crisis Care",
      desc: "Prompt clinical assessment, trauma-informed counseling, and immediate psychiatric stabilization for individuals facing emotional crises.",
      chips: ["Emotional Trauma (PTSD)", "Adjustment Disorders", "Stress Related Disorders", "Suicidal Thoughts Assessment", "Self-Harm Risk Management"]
    }
  ];

  function showConditionCategory(index) {
    const data = servicesConditionsData[index];
    if (!data) return;

    btnItems.forEach((btn, i) => {
      if (i === index) {
        btn.classList.add("is-active");
      } else {
        btn.classList.remove("is-active");
      }
    });

    if (detailPanel) detailPanel.style.opacity = "0.2";

    setTimeout(() => {
      if (catTag) catTag.textContent = data.category;
      if (counterEl) counterEl.textContent = `${data.num} / 12`;
      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.desc;

      if (chipsEl) {
        chipsEl.innerHTML = data.chips
          .map(chip => `<span class="bnpc-cond-detail-chip"><i class="bi bi-check-circle-fill"></i> ${chip}</span>`)
          .join("");
      }

      if (detailPanel) detailPanel.style.opacity = "1";
    }, 150);
  }

  btnItems.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      showConditionCategory(idx);
    });
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showConditionCategory(idx);
      }
    });
  });
});

/**
 * BNPC Universal FAQ Accordion Handler
 */
document.addEventListener("DOMContentLoaded", () => {
  const faqRows = document.querySelectorAll(".bnpc-faq-row-item");
  if (!faqRows.length) return;

  faqRows.forEach(row => {
    const btn = row.querySelector(".bnpc-faq-question-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isOpen = row.classList.contains("is-open");

      // Close siblings in the same container
      const parent = row.closest("#faqAccordionList") || row.parentElement;
      if (parent) {
        parent.querySelectorAll(".bnpc-faq-row-item").forEach(r => {
          if (r !== row) {
            r.classList.remove("is-open");
            const b = r.querySelector(".bnpc-faq-question-btn");
            if (b) b.setAttribute("aria-expanded", "false");
          }
        });
      }

      if (isOpen) {
        row.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      } else {
        row.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
});
