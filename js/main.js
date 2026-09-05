/* ==========================================================================
   ADARSH PANDEY - MAIN INTERACTIVITY & UTILITIES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- Navbar Scroll Effect ---
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Active Section Highlight
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // --- Mobile Drawer Toggle ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  // --- Copy Email to Clipboard ---
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  copyEmailBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'adarshpandey4810@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Email Copied!
        `;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 3000);
      });
    });
  });

  // --- Project Modal Data & Handlers ---
  const projectData = {
    'banaras-darshan': {
      title: 'Banaras Darshan',
      focus: 'Web Development + AI + Cultural Technology',
      desc: 'A digital platform designed to help users explore the cultural, spiritual and historical heritage of Varanasi with integrated AI capabilities.',
      features: [
        'Comprehensive Temple information & historical background',
        'Ghats information & cultural significance',
        'High-resolution visual heritage gallery',
        'Interactive Maps integration for navigation',
        'AI chatbot for tourist query assistance & recommendations',
        'Multi-language support for international visitors',
        'User authentication system & bookmarking',
        'Database integration for dynamic content management'
      ],
      tech: ['Web Development', 'AI Chatbot', 'Maps API', 'Database', 'Authentication']
    },
    'ngo-connector': {
      title: 'AI-Based NGO & Restaurant Connector',
      focus: 'AI + Social Impact + Data-driven Matching',
      desc: 'A social-impact concept designed to reduce food waste by intelligently connecting restaurants with nearby NGOs that can distribute surplus food.',
      features: [
        'Intelligent matching algorithm between restaurants and NGOs',
        'Real-time surplus food availability reporting',
        'Proximity & route optimization for quick pick-up',
        'Dashboard for NGOs to claim & track food dispatches',
        'Impact analytics tracking food waste reduction & meals saved',
        'Verification system for food quality and safety compliance'
      ],
      tech: ['Python', 'Matching System', 'Data Science', 'Routing Algorithm', 'Social Impact']
    },
    'stock-analytics': {
      title: 'Stock Market Predictive Analytics',
      focus: 'Data Science + Machine Learning',
      desc: 'A comprehensive data science and machine learning project exploring predictive analytics and trend evaluation on stock market financial data.',
      features: [
        'Automated financial data ingestion & preprocessing',
        'Exploratory Data Analysis (EDA) with interactive visualization',
        'Feature engineering (Technical Indicators: SMA, EMA, RSI, MACD)',
        'Supervised Machine Learning regression & classification models',
        'Rigorous cross-validation & model evaluation metrics',
        'Backtesting framework for predictive hypothesis testing'
      ],
      tech: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Matplotlib', 'Predictive Modeling']
    },
    'banking-system': {
      title: 'Banking Management System',
      focus: 'Python + Programming + Problem Solving',
      desc: 'A robust programming project implementing fundamental banking operations, customer management, security controls, and JSON-based file persistence.',
      features: [
        'Customer account creation, profile management & verification',
        'Account operations: Deposit, Withdrawal, and Fund Transfer',
        'Transaction history log with timestamped receipts',
        'File handling with structured JSON data storage',
        'Security features: PIN validation and balance safeguards',
        'Modular object-oriented Python architecture'
      ],
      tech: ['Python', 'Object-Oriented Programming', 'JSON Data Handling', 'File I/O']
    }
  };

  const modalOverlay = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalFocus = document.getElementById('modal-focus');
  const modalDesc = document.getElementById('modal-desc');
  const modalFeatures = document.getElementById('modal-features');
  const modalTech = document.getElementById('modal-tech');
  const modalClose = document.getElementById('modal-close');

  document.querySelectorAll('[data-project]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = trigger.getAttribute('data-project');
      const data = projectData[projId];
      if (!data || !modalOverlay) return;

      modalTitle.textContent = data.title;
      modalFocus.textContent = data.focus;
      modalDesc.textContent = data.desc;

      modalFeatures.innerHTML = data.features.map(f => `
        <li>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ${f}
        </li>
      `).join('');

      modalTech.innerHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

      modalOverlay.classList.add('active');
    });
  });

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // --- Fade-in Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.glass-card, .section-header, .timeline-item, .info-card, .philosophy-box');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
});
