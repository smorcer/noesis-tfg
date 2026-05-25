// Particles for cover & closing
function buildParticles() {
  document.querySelectorAll('[data-particles]').forEach(host => {
    if (host.dataset.built) return;
    host.dataset.built = '1';
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.setProperty('--dur', (8 + Math.random() * 8) + 's');
      p.style.setProperty('--del', (-Math.random() * 16) + 's');
      host.appendChild(p);
    }
  });
}
buildParticles();

// Dashboard view switching
document.querySelectorAll('.db-nav-item[data-view]').forEach(btn => {
  btn.addEventListener('click', () => {
    const slide = btn.closest('.dashboard');
    if (!slide) return;
    const view = btn.dataset.view;
    slide.querySelectorAll('.db-nav-item').forEach(n => n.classList.remove('db-nav-item--on'));
    btn.classList.add('db-nav-item--on');
    slide.querySelectorAll('.db-view').forEach(v => v.classList.remove('db-view--on'));
    const target = slide.querySelector(`.db-view[data-view="${view}"]`);
    if (target) target.classList.add('db-view--on');
  });
});

// Re-init particles on slide change
const stage = document.querySelector('deck-stage');
if (stage) {
  stage.addEventListener('slidechange', () => buildParticles());
}
