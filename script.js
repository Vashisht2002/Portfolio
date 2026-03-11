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
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Stagger children in grids
  document.querySelectorAll('.skills-grid .skill-item, .about-stats .stat-item')
    .forEach((el, i) => {
      el.style.transitionDelay = `${i * 60}ms`;
      el.classList.add('reveal');
      observer.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', initReveal);

// ── CAROUSEL — Duplicate items for seamless infinite loop ──
(function () {
  const track = document.getElementById('portTrack');
  if (!track) return;
  const origItems = Array.from(track.children);
  origItems.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
})();

// ── LIGHTBOX ──
(function () {
  // Create lightbox DOM
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-content">
      <button class="lb-close" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
      <img class="lb-img" src="" alt="" />
      <div class="lb-caption">
        <span class="lb-tag"></span>
        <p class="lb-title"></p>
      </div>
    </div>
  `;
  document.body.appendChild(lb);

  const lbEl      = document.getElementById('lightbox');
  const lbImg     = lbEl.querySelector('.lb-img');
  const lbTag     = lbEl.querySelector('.lb-tag');
  const lbTitle   = lbEl.querySelector('.lb-title');
  const lbClose   = lbEl.querySelector('.lb-close');
  const lbBackdrop = lbEl.querySelector('.lb-backdrop');

  function openLightbox(src, alt, tag, title) {
    lbImg.src = src;
    lbImg.alt = alt;
    lbTag.textContent = tag || '';
    lbTitle.textContent = title || '';
    lbEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lbEl.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 350);
  }

  // Delegate clicks on port-img-wrap images (works for clones too)
  document.addEventListener('click', e => {
    const wrap = e.target.closest('.port-img-wrap');
    if (!wrap) return;
    // Don't open if user is on an aria-hidden clone that might be mid-animation
    const item = wrap.closest('.port-item');
    if (item && item.getAttribute('aria-hidden') === 'true') return;
    const img   = wrap.querySelector('img');
    const overlay = wrap.querySelector('.port-overlay');
    const tag   = overlay ? overlay.querySelector('.port-tag')?.textContent : '';
    const title = overlay ? overlay.querySelector('.port-name')?.textContent.replace(/\n/g, ' ') : '';
    if (img) openLightbox(img.src, img.alt, tag, title);
  });

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
})();

// ── PORTFOLIO FILTER ──
const filterBtns = document.querySelectorAll('.port-filter');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    const track = document.getElementById('portTrack');
    if (!track) return;
    // Show/hide original items; clones mirror visibility
    const allItems = Array.from(track.querySelectorAll('.port-item'));
    allItems.forEach(item => {
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
