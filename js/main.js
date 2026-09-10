/* ==========================================================================
   ADARSH PANDEY — MAIN INTERACTIVITY & UTILITIES
   Navbar scroll spy, mobile drawer, modal popup, clipboard & smooth reveals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- Navbar Scroll Effect & Active Section Spy ---
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateNavbar() {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Active Section Highlight
    let current = '';
    const scrollPos = window.scrollY + 160;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // --- Mobile Navigation Drawer Toggle ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('open');
      const isOpen = mobileMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close button
    const mobileClose = document.getElementById('mobile-close');
    if (mobileClose) {
      mobileClose.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && e.target !== mobileToggle) {
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Copy Email to Clipboard ---
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  copyEmailBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'adarshpandey4810@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span style="color: #059669; font-weight: 600;">Email Copied to Clipboard!</span>
        `;
        setTimeout(() => {
          btn.innerHTML = originalHTML;
        }, 3000);
      }).catch(() => {
        // Fallback
        window.location.href = `mailto:${email}`;
      });
    });
  });

  // --- Project Modal Data & Handlers ---
  const projectData = {
    'banaras-darshan': {
      title: 'Banaras Darshan',
      focus: 'Web Development • AI • Cultural Technology',
      desc: 'A comprehensive digital platform designed to help users explore the cultural, spiritual, and historical heritage of Varanasi with integrated interactive mapping and AI chatbot guidance.',
      features: [
        'Comprehensive Temple directory with detailed historical background',
        'Ghats information, religious significance, and ritual timings',
        'High-resolution visual heritage gallery and architectural insights',
        'Interactive Maps API integration for precise navigation and routes',
        'AI chatbot for tourist query assistance, history explanations, and itinerary recommendations',
        'Multi-language support for international and domestic visitors',
        'User authentication system with saved bookmarks and favorites',
        'Dynamic database integration for real-time content updates'
      ],
      tech: ['Web Development', 'AI Chatbot', 'Maps API', 'Relational Database', 'Authentication']
    },
    'ngo-connector': {
      title: 'AI-Based NGO & Restaurant Connector',
      focus: 'AI • Social Impact • Data Matching',
      desc: 'A social-impact system concept designed to minimize food waste by intelligently connecting restaurants with nearby NGOs for timely surplus food redistribution.',
      features: [
        'Intelligent proximity and route matching algorithm between restaurants and NGOs',
        'Real-time surplus food availability reporting and batch quantity estimation',
        'Proximity optimization minimizing food transit and spoilage windows',
        'Dedicated dashboard for NGOs to claim, track, and dispatch food pickups',
        'Impact analytics tracking food waste reduction, kilograms diverted, and meals served',
        'Safety verification checklist and compliance logging for food standards'
      ],
      tech: ['Python', 'Matching System', 'Data Science', 'Routing Algorithms', 'Social Impact']
    },
    'stock-analytics': {
      title: 'Stock Market Predictive Analytics',
      focus: 'Data Science • Machine Learning',
      desc: 'A comprehensive data science and machine learning exploration analyzing financial time-series data, performing statistical feature engineering, and evaluating regression model predictions.',
      features: [
        'Automated financial data ingestion, cleaning, and time-series restructuring',
        'Exploratory Data Analysis (EDA) with interactive trend and volatility visualization',
        'Technical feature engineering (Moving Averages SMA/EMA, RSI, MACD, Bollinger Bands)',
        'Supervised Machine Learning regression and trend classification models',
        'Rigorous cross-validation, hyperparameter tuning, and error metric benchmarks',
        'Backtesting framework assessing historical simulated performance against baseline trends'
      ],
      tech: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Matplotlib', 'Predictive Modeling']
    },
    'banking-system': {
      title: 'Banking Management System',
      focus: 'Python • OOP • Data Persistence',
      desc: 'A robust object-oriented Python application implementing fundamental banking operations, customer account management, security controls, and JSON-based file persistence.',
      features: [
        'Customer account creation, profile verification, and unique account ID generation',
        'Core banking operations: Secure Deposit, Withdrawal, and Inter-account Fund Transfer',
        'Comprehensive transaction ledger with timestamped activity logging and digital receipts',
        'Robust file handling and schema validation with structured JSON data storage',
        'Security features: PIN authentication and balance non-negative overdraft guards',
        'Clean modular object-oriented architecture separating domain logic and storage'
      ],
      tech: ['Python', 'Object-Oriented Architecture', 'JSON Persistence', 'File I/O', 'Security Logic']
    }
  };

  const modalOverlay = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalFocus = document.getElementById('modal-focus');
  const modalDesc = document.getElementById('modal-desc');
  const modalFeatures = document.getElementById('modal-features');
  const modalTech = document.getElementById('modal-tech');
  const modalClose = document.getElementById('modal-close');

  function openModal(projId) {
    const data = projectData[projId];
    if (!data || !modalOverlay) return;

    modalTitle.textContent = data.title;
    modalFocus.textContent = data.focus;
    modalDesc.textContent = data.desc;

    modalFeatures.innerHTML = data.features.map(f => `
      <li>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${f}</span>
      </li>
    `).join('');

    modalTech.innerHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-project]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = trigger.getAttribute('data-project');
      openModal(projId);
    });
  });

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // --- Fade-in Scroll Reveal Animations (respects reduced-motion) ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll(
      '.glass-card, .section-header, .timeline-item, .info-card, .philosophy-box, .focus-card'
    );

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      observer.observe(el);
    });
  }

  // --- Hero 3D Circular Avatar Interactive Tilt ---
  const heroWrapper = document.getElementById('hero-3d-wrapper');
  const heroStage = document.getElementById('hero-3d-stage');

  if (heroWrapper && heroStage && !prefersReducedMotion) {
    let mouseX = 0;
    let mouseY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let isHovering = false;

    heroWrapper.addEventListener('mouseenter', () => {
      isHovering = true;
      heroStage.style.animationPlayState = 'paused';
    });

    heroWrapper.addEventListener('mousemove', (e) => {
      const rect = heroWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max tilt +/- 14 degrees
      mouseX = ((x - centerX) / centerX) * 14;
      mouseY = -((y - centerY) / centerY) * 14;
    });

    heroWrapper.addEventListener('mouseleave', () => {
      isHovering = false;
      heroStage.style.animationPlayState = 'running';
      heroStage.style.transform = '';
    });

    function render3dTilt() {
      if (isHovering) {
        currentTiltX += (mouseY - currentTiltX) * 0.12;
        currentTiltY += (mouseX - currentTiltY) * 0.12;
        heroStage.style.transform = `perspective(1000px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
      }
      requestAnimationFrame(render3dTilt);
    }
    render3dTilt();
  }
});
