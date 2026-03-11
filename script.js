// ── NAV SCROLL EFFECT ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── HAMBURGER MENU ──
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}
function closeMenu() {
  document.getElementById('navLinks').classList.remove('open');
}

// ── SCROLL REVEAL ──
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
document.querySelectorAll('.skills-grid .skill-item, .about-stats .stat-item')
  .forEach((el, i) => {
    el.style.transitionDelay = `${i * 60}ms`;
    el.classList.add('reveal');
    observer.observe(el);
  });

// ── PORTFOLIO FILTER ──
const filterBtns = document.querySelectorAll('.port-filter');
const portItems  = document.querySelectorAll('.port-item[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    portItems.forEach(item => {
      if (cat === 'all' || item.dataset.category === cat) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ── MAGAZINE FLIPBOOK ──
(function () {
  const book    = document.getElementById('magBook');
  if (!book) return;

  const pages    = Array.from(book.querySelectorAll('.mag-page'));
  const prevBtn  = document.getElementById('magPrev');
  const nextBtn  = document.getElementById('magNext');
  const counter  = document.getElementById('magCounter');
  const progress = document.getElementById('magProgress');
  const total    = pages.length;
  let current    = 0;

  // Build progress dots
  pages.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'mag-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    progress.appendChild(dot);
  });

  function getDots() {
    return Array.from(progress.querySelectorAll('.mag-dot'));
  }

  function stackPages() {
    pages.forEach((p, i) => {
      if (i < current) {
        p.style.zIndex = i;
      } else if (i === current) {
        p.style.zIndex = total + 1;
      } else {
        p.style.zIndex = total - i + current;
      }
    });
  }

  function updateUI() {
    if (current === 0) counter.textContent = 'Cover';
    else if (current === total - 1) counter.textContent = 'Back Cover';
    else counter.textContent = `Page ${current} of ${total - 1}`;

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;

    getDots().forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function goTo(index) {
    if (index < 0 || index >= total) return;
    if (index > current) {
      for (let i = current; i < index; i++) pages[i].classList.add('flipped');
    } else {
      for (let i = index; i < current; i++) pages[i].classList.remove('flipped');
    }
    current = index;
    stackPages();
    updateUI();
  }

  function goNext() { goTo(current + 1); }
  function goPrev() { goTo(current - 1); }

  nextBtn.addEventListener('click', goNext);
  prevBtn.addEventListener('click', goPrev);

  // Click book to advance
  book.addEventListener('click', () => goNext());

  // Swipe / drag
  let dragStartX = null;
  book.addEventListener('pointerdown', e => { dragStartX = e.clientX; });
  book.addEventListener('pointerup', e => {
    if (dragStartX === null) return;
    const dx = e.clientX - dragStartX;
    if (Math.abs(dx) > 40) dx < 0 ? goNext() : goPrev();
    dragStartX = null;
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft')  goPrev();
  });

  // Init
  stackPages();
  updateUI();
})();
