(() => {
  'use strict';
  const nav = document.querySelector('#cxo-intro-nav');
  const profile = document.querySelector('#cxo-profile');
  const toggle = document.querySelector('.profile-toggle');
  const topButton = document.querySelector('#go-up');
  const toc = document.querySelector('.toc-wrapper');
  const intro = document.querySelector('#cxo-intro');
  const post = document.querySelector('#post');
  const progress = document.querySelector('.read-progress');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  toggle.addEventListener('click', () => {
    const closed = profile.classList.toggle('profile-close');
    toggle.setAttribute('aria-expanded', String(!closed));
    toggle.setAttribute('aria-label', closed ? '展开个人资料' : '收起个人资料');
  });
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'instant' : 'smooth' }));
  document.querySelectorAll('.intro-nav-drop a').forEach(link => link.addEventListener('click', () => {
    document.querySelector('.intro-nav-menu').open = false;
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') document.querySelector('.intro-nav-menu').open = false;
  });

  let pending = false;
  function updateScroll() {
    pending = false;
    const scrolled = window.scrollY > 20;
    nav.classList.toggle('nav-style-two', scrolled);
    nav.querySelectorAll('a, summary').forEach(link => link.classList.toggle('main-color', scrolled));
    topButton.classList.toggle('close', !scrolled);
    if (toc) {
      const fixed = window.scrollY > intro.offsetHeight;
      toc.style.position = fixed ? 'fixed' : 'absolute';
      toc.style.top = fixed ? '0' : intro.offsetHeight + 'px';
    }
    if (post) {
      const start = post.getBoundingClientRect().top + window.scrollY;
      const distance = Math.max(1, post.offsetHeight - innerHeight);
      progress.style.width = Math.max(0, Math.min(100, (window.scrollY - start) / distance * 100)) + '%';
      let active = '';
      post.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').forEach(heading => {
        if (heading.getBoundingClientRect().top < 100) active = '#' + heading.id;
      });
      document.querySelectorAll('.toc-link').forEach(link => link.classList.toggle('active', decodeURI(link.hash) === active));
    }
  }
  function queueScroll() {
    if (!pending) { pending = true; requestAnimationFrame(updateScroll); }
  }
  addEventListener('scroll', queueScroll, { passive: true });
  addEventListener('resize', queueScroll);
  updateScroll();

  const images = document.querySelectorAll('.article-entry img, .recent-post-content img');
  if (images.length) {
    const dialog = document.createElement('dialog');
    dialog.className = 'image-viewer';
    dialog.setAttribute('aria-label', '查看图片');
    const close = document.createElement('button');
    close.type = 'button'; close.textContent = '关闭 ×';
    const image = document.createElement('img');
    const caption = document.createElement('p');
    dialog.append(close, image, caption); document.body.append(dialog);
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    images.forEach(original => {
      if (original.closest('a')) return;
      const link = document.createElement('a');
      link.href = original.src;
      link.setAttribute('aria-label', '查看图片：' + original.alt);
      original.replaceWith(link); link.append(original);
      link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault(); image.src = original.src; image.alt = original.alt;
        caption.textContent = original.alt; dialog.showModal();
      });
    });
  }
})();
