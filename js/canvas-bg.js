/* ==========================================================================
   NEURAL NETWORK CANVAS BACKGROUND & FLOATING MATH SYMBOLS
   Interactive Particle System for AI Aesthetics
   ========================================================================== */

(function () {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mathSymbols = [];
  let mouse = { x: null, y: null, radius: 150 };

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
    initMathSymbols();
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * (prefersReducedMotion ? 0.2 : 0.8);
      this.vy = (Math.random() - 0.5) * (prefersReducedMotion ? 0.2 : 0.8);
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? 'rgba(99, 102, 241, ' : 'rgba(6, 182, 212, ';
      this.baseAlpha = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.baseAlpha + ')';
      ctx.fill();
    }
  }

  // Floating Math Symbols
  const symbolList = ['σ(x)', '∇L', 'E[X]', 'Wᵀx + b', '∂L/∂w', 'f(x)', '∫p(x)dx', 'y = wx + b', 'argmax', 'Softmax'];
  
  class MathSymbol {
    constructor() {
      this.text = symbolList[Math.floor(Math.random() * symbolList.length)];
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vy = -(Math.random() * 0.3 + 0.1);
      this.alpha = Math.random() * 0.25 + 0.08;
      this.fontSize = Math.floor(Math.random() * 6) + 12;
    }

    update() {
      this.y += this.vy;
      if (this.y < -30) {
        this.y = height + 30;
        this.x = Math.random() * width;
      }
    }

    draw() {
      ctx.font = `${this.fontSize}px "JetBrains Mono", monospace`;
      ctx.fillStyle = `rgba(99, 102, 241, ${this.alpha})`;
      ctx.fillText(this.text, this.x, this.y);
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 14000), 80);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function initMathSymbols() {
    mathSymbols = [];
    const count = Math.min(Math.floor((width * height) / 45000), 18);
    for (let i = 0; i < count; i++) {
      mathSymbols.push(new MathSymbol());
    }
  }

  function connectParticles() {
    const maxDist = 130;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw Math symbols
    mathSymbols.forEach((s) => {
      s.update();
      s.draw();
    });

    // Draw particles and neural connections
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    connectParticles();

    requestAnimationFrame(animate);
  }

  resize();
  animate();
})();
