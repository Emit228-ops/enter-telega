// Minimal Premium Background
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'neonCanvas';
  canvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -3; pointer-events: none;';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let uiElements = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateUIElements();
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('scroll', updateUIElements);

  let gyroX = 0, gyroY = 0;

  // Track UI elements
  function updateUIElements() {
    const elements = document.querySelectorAll('.card, .action-card, .feature-item, .balance-display, .virtual-card, .empty-state-card, .feature-card');
    uiElements = Array.from(elements).map(el => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        visible: rect.bottom > 0 && rect.top < canvas.height
      };
    }).filter(el => el.visible);
  }

  setTimeout(updateUIElements, 100);
  setInterval(updateUIElements, 3000);

  // Subtle gradient orbs
  const orbs = [
    { x: 0.2, y: 0.25, radiusX: 300, radiusY: 200, color: 'rgba(59, 130, 246, 0.04)', speed: 0.0003 },
    { x: 0.8, y: 0.7, radiusX: 250, radiusY: 180, color: 'rgba(139, 92, 246, 0.03)', speed: 0.0004 }
  ];

  function drawAmbientGradients(time) {
    orbs.forEach((orb, index) => {
      const offsetX = Math.sin(time * orb.speed + index) * 50 + gyroX * 5;
      const offsetY = Math.cos(time * orb.speed + index) * 30 + gyroY * 3;
      const x = canvas.width * orb.x + offsetX;
      const y = canvas.height * orb.y + offsetY;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, orb.radiusX);
      gradient.addColorStop(0, orb.color);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.fillRect(x - orb.radiusX, y - orb.radiusY, orb.radiusX * 2, orb.radiusY * 2);
    });
  }

  // Subtle glow under UI cards
  function drawCardGlow() {
    uiElements.forEach((el, index) => {
      const time = Date.now() * 0.001;
      const pulse = Math.sin(time + index * 0.5) * 0.15 + 0.85;

      const gradient = ctx.createRadialGradient(
        el.x, el.y + el.height * 0.3, 0,
        el.x, el.y + el.height * 0.3, el.width * 0.5
      );
      gradient.addColorStop(0, `rgba(59, 130, 246, ${0.06 * pulse})`);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(el.x, el.y + el.height * 0.3, el.width * 0.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Minimal floating particles
  const particles = [];
  for (let i = 0; i < 8; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: 1.5 + Math.random() * 1
    });
  }

  function drawParticles() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.beginPath();
      ctx.arc(p.x + gyroX, p.y + gyroY, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Subtle top-to-bottom gradient
  function drawBaseGradient() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(10, 14, 26, 0)');
    gradient.addColorStop(0.5, 'rgba(11, 20, 38, 0.3)');
    gradient.addColorStop(1, 'rgba(13, 24, 50, 0.5)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const time = Date.now();

    drawBaseGradient();
    drawAmbientGradients(time);
    drawCardGlow();
    drawParticles();

    requestAnimationFrame(animate);
  }
  animate();

  // Gyroscope
  if (window.DeviceOrientationEvent) {
    let lastUpdate = Date.now();
    window.addEventListener('deviceorientation', function(event) {
      const now = Date.now();
      if (now - lastUpdate < 50) return;
      lastUpdate = now;

      gyroX = (event.gamma || 0) * 0.3;
      gyroY = (event.beta || 0) * 0.2;
    });
  }
})();
