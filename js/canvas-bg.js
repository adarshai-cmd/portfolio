/* ==========================================================================
   ATMOSPHERIC CLOUD GLASS BACKGROUND
   Living, organic sky / mist / light drifting behind frosted glass
   Subtle tones: Misty white, soft cloud blue, delicate lavender
   ========================================================================== */

(function () {
  const canvas = document.getElementById('atmospheric-canvas') || document.getElementById('neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let animationFrameId = null;

  // Check reduced motion preference
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = motionQuery.matches;

  motionQuery.addEventListener('change', (e) => {
    prefersReducedMotion = e.matches;
    if (prefersReducedMotion) {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      drawStaticMist();
    } else {
      lastTime = performance.now();
      animate(lastTime);
    }
  });

  // Soft atmospheric cloud palette
  // Light, calm, airy: sky blue, misty white, faint dawn lavender
  const CLOUD_PALETTES = [
    {
      // Soft Azure Mist
      r: 219, g: 234, b: 254,
      baseAlpha: 0.55,
      radiusScale: 0.52
    },
    {
      // Pure Misty Pearl White
      r: 255, g: 255, b: 255,
      baseAlpha: 0.65,
      radiusScale: 0.58
    },
    {
      // Delicate Light Lavender
      r: 237, g: 233, b: 254,
      baseAlpha: 0.45,
      radiusScale: 0.48
    },
    {
      // Soft Sky Cloud
      r: 224, g: 242, b: 254,
      baseAlpha: 0.50,
      radiusScale: 0.55
    },
    {
      // Luminous Cloud Light
      r: 248, g: 250, b: 252,
      baseAlpha: 0.60,
      radiusScale: 0.62
    },
    {
      // Whisper Heather
      r: 243, g: 232, b: 255,
      baseAlpha: 0.40,
      radiusScale: 0.44
    }
  ];

  class CloudMass {
    constructor(config, index) {
      this.r = config.r;
      this.g = config.g;
      this.b = config.b;
      this.baseAlpha = config.baseAlpha;
      this.radiusScale = config.radiusScale;
      this.index = index;

      // Organic drift parameters with distinct sinusoidal frequencies
      this.phaseX = Math.random() * Math.PI * 2;
      this.phaseY = Math.random() * Math.PI * 2;
      this.phaseRadius = Math.random() * Math.PI * 2;
      this.phaseAlpha = Math.random() * Math.PI * 2;

      // Slow, calm frequency periods (40 to 90 seconds)
      this.speedX = 0.00015 + Math.random() * 0.00012;
      this.speedY = 0.00012 + Math.random() * 0.00010;
      this.speedRadius = 0.00018 + Math.random() * 0.00014;
      this.speedAlpha = 0.00020 + Math.random() * 0.00015;

      // Base anchor position spread across the screen
      const anchors = [
        { x: 0.20, y: 0.25 },
        { x: 0.80, y: 0.20 },
        { x: 0.50, y: 0.50 },
        { x: 0.15, y: 0.75 },
        { x: 0.85, y: 0.80 },
        { x: 0.45, y: 0.85 }
      ];
      const anchor = anchors[index % anchors.length];
      this.anchorX = anchor.x;
      this.anchorY = anchor.y;

      // Smooth mouse displacement
      this.targetMouseOffsetX = 0;
      this.targetMouseOffsetY = 0;
      this.mouseOffsetX = 0;
      this.mouseOffsetY = 0;
    }

    update(time, mouse) {
      // Harmonic gentle wandering around anchor point
      const wanderRadiusX = width * 0.18;
      const wanderRadiusY = height * 0.16;

      this.currentX = this.anchorX * width + Math.sin(time * this.speedX + this.phaseX) * wanderRadiusX;
      this.currentY = this.anchorY * height + Math.cos(time * this.speedY + this.phaseY) * wanderRadiusY;

      // Natural gentle breathing of cloud volume
      const baseRadius = Math.max(width, height) * this.radiusScale;
      const breathing = Math.sin(time * this.speedRadius + this.phaseRadius) * (baseRadius * 0.12);
      this.currentRadius = Math.max(120, baseRadius + breathing);

      // Subtle opacity shift
      const alphaPulse = Math.sin(time * this.speedAlpha + this.phaseAlpha) * 0.10;
      this.currentAlpha = Math.max(0.15, Math.min(0.85, this.baseAlpha + alphaPulse));

      // Subtle, gentle drift reaction to mouse (not snappy, very soft inertia)
      if (mouse.active && mouse.x !== null) {
        const dx = (mouse.x - width / 2) / (width / 2);
        const dy = (mouse.y - height / 2) / (height / 2);
        const factor = (this.index % 2 === 0 ? 1 : -0.7) * 25;
        this.targetMouseOffsetX = dx * factor;
        this.targetMouseOffsetY = dy * factor;
      } else {
        this.targetMouseOffsetX = 0;
        this.targetMouseOffsetY = 0;
      }

      this.mouseOffsetX += (this.targetMouseOffsetX - this.mouseOffsetX) * 0.02;
      this.mouseOffsetY += (this.targetMouseOffsetY - this.mouseOffsetY) * 0.02;

      this.finalX = this.currentX + this.mouseOffsetX;
      this.finalY = this.currentY + this.mouseOffsetY;
    }

    draw() {
      const gradient = ctx.createRadialGradient(
        this.finalX,
        this.finalY,
        0,
        this.finalX,
        this.finalY,
        this.currentRadius
      );

      const rgb = `${this.r}, ${this.g}, ${this.b}`;
      gradient.addColorStop(0, `rgba(${rgb}, ${this.currentAlpha})`);
      gradient.addColorStop(0.35, `rgba(${rgb}, ${this.currentAlpha * 0.65})`);
      gradient.addColorStop(0.70, `rgba(${rgb}, ${this.currentAlpha * 0.25})`);
      gradient.addColorStop(1, `rgba(${rgb}, 0)`);

      ctx.save();
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.finalX, this.finalY, this.currentRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let clouds = [];
  const mouse = { x: null, y: null, active: false };

  function initClouds() {
    clouds = CLOUD_PALETTES.map((palette, i) => new CloudMass(palette, i));
  }

  function resize() {
    // Keep internal canvas resolution optimal for performance while sharp
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    if (prefersReducedMotion) {
      drawStaticMist();
    }
  }

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  function drawStaticMist() {
    // Serene static cloud composition for prefers-reduced-motion
    ctx.clearRect(0, 0, width, height);

    // Warm misty ambient base
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    clouds.forEach((cloud) => {
      cloud.update(12000, { active: false, x: null, y: null });
      cloud.draw();
    });
  }

  let lastTime = performance.now();

  function animate(currentTime) {
    if (prefersReducedMotion) {
      drawStaticMist();
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Render each living cloud mass
    for (let i = 0; i < clouds.length; i++) {
      clouds[i].update(currentTime, mouse);
      clouds[i].draw();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  // Initialize
  initClouds();
  resize();

  if (prefersReducedMotion) {
    drawStaticMist();
  } else {
    lastTime = performance.now();
    animate(lastTime);
  }
})();
