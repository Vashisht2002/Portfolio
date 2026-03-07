
  // Nav scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Hamburger menu
  function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
  }
  function closeMenu() {
    document.getElementById('navLinks').classList.remove('open');
  }

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => observer.observe(el));

  // Stagger children in grids
  document.querySelectorAll('.skills-grid .skill-item, .portfolio-grid .project-card, .about-stats .stat-item')
    .forEach((el, i) => {
      el.style.transitionDelay = `${i * 60}ms`;
      el.classList.add('reveal');
      observer.observe(el);
    });
