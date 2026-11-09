(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const year = document.querySelector('#current-year');
  if (year) year.textContent = new Date().getFullYear();

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const previewContent = {
    career: {
      category: 'CAREER STUDIO', kicker: 'A BETTER NEXT MOVE STARTS HERE', heading: 'A clearer path<br>to your next role.',
      subtitle: 'Bring your experience into focus and find opportunities that fit.', featureTitle: 'Your story, made stronger',
      featureText: 'Turn the work you’ve done into a profile that gets noticed.', progress: '1 of 3 complete', fill: '37%', action: 'Shape my profile'
    },
    creator: {
      category: 'CREATOR STUDIO', kicker: 'GIVE YOUR NEXT IDEA ROOM', heading: 'From first thought<br>to fresh story.',
      subtitle: 'Collect research, find a useful angle, and shape a draft in your own voice.', featureTitle: 'A workflow that flows',
      featureText: 'Turn your sparks into an organized creative process.', progress: '2 of 4 steps explored', fill: '52%', action: 'Shape an idea'
    },
    business: {
      category: 'BUSINESS STUDIO', kicker: 'MAKE THE REPEATABLE REPEAT', heading: 'Clear the busywork<br>from your day.',
      subtitle: 'Bring the small, repeatable tasks into a calmer workflow.', featureTitle: 'Your process, in focus',
      featureText: 'Map a workflow and see where time can be returned.', progress: '1 of 3 workflows mapped', fill: '34%', action: 'Map a workflow'
    },
    interview: {
      category: 'INTERVIEW STUDIO', kicker: 'PRACTICE WITH PURPOSE', heading: 'Show up ready<br>to be yourself.',
      subtitle: 'Build confidence with focused practice and thoughtful reflection.', featureTitle: 'Practice that meets you there',
      featureText: 'Work through prompts shaped around your next opportunity.', progress: '1 of 3 practice rounds', fill: '33%', action: 'Start a practice'
    },
    productivity: {
      category: 'FOCUS STUDIO', kicker: 'MAKE SPACE FOR WHAT MATTERS', heading: 'More clarity<br>in the everyday.',
      subtitle: 'Use focused, lightweight tools to make room for the work that matters.', featureTitle: 'A little less friction',
      featureText: 'Bring your next tasks into one clear place.', progress: '1 of 3 steps planned', fill: '36%', action: 'Plan my day'
    }
  };

  const previewTabs = [...document.querySelectorAll('[data-preview]')];
  const updatePreview = (key) => {
    const content = previewContent[key];
    if (!content) return;
    previewTabs.forEach((tab) => {
      const selected = tab.dataset.preview === key;
      tab.classList.toggle('is-selected', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    const values = {
      '#demo-category': content.category,
      '#demo-kicker': content.kicker,
      '#demo-heading': content.heading,
      '#demo-subtitle': content.subtitle,
      '#demo-feature-title': content.featureTitle,
      '#demo-feature-text': content.featureText,
      '#demo-progress-label': content.progress,
      '#demo-action': content.action
    };
    Object.entries(values).forEach(([selector, value]) => {
      const element = document.querySelector(selector);
      if (!element) return;
      if (selector === '#demo-heading') element.innerHTML = value;
      else if (selector === '#demo-action') element.firstChild.textContent = `${value} `;
      else element.textContent = value;
    });
    const fill = document.querySelector('#demo-progress-fill');
    if (fill) fill.style.width = content.fill;
    const demo = document.querySelector('.demo-content');
    demo?.classList.remove('demo-updated');
    requestAnimationFrame(() => demo?.classList.add('demo-updated'));
  };
  previewTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => updatePreview(tab.dataset.preview));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? previewTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + previewTabs.length) % previewTabs.length;
      previewTabs[nextIndex].focus();
      updatePreview(previewTabs[nextIndex].dataset.preview);
    });
  });
  document.querySelectorAll('[data-demo-select]').forEach((link) => {
    link.addEventListener('click', () => updatePreview(link.dataset.demoSelect));
  });
  document.querySelector('#demo-action')?.addEventListener('click', (event) => {
    const button = event.currentTarget;
    button.innerHTML = 'Preview concept only <span aria-hidden="true">✦</span>';
    button.setAttribute('aria-label', 'This is an illustrative product preview, not a live product');
    window.setTimeout(() => {
      button.innerHTML = `${previewContent[document.querySelector('.preview-tab.is-selected')?.dataset.preview || 'career'].action} <span aria-hidden="true">→</span>`;
      button.removeAttribute('aria-label');
    }, 2400);
  });

  const scene = document.querySelector('.hero-art');
  if (scene && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion) {
    scene.addEventListener('pointermove', (event) => {
      const bounds = scene.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      scene.style.setProperty('--py', `${x * 5}deg`);
      scene.style.setProperty('--px', `${-y * 4}deg`);
    });
    scene.addEventListener('pointerleave', () => {
      scene.style.setProperty('--py', '0deg');
      scene.style.setProperty('--px', '0deg');
    });
  }

  const canvas = document.querySelector('#starfield');
  const context = canvas?.getContext('2d', { alpha: true });
  if (canvas && context) {
    let width = 0;
    let height = 0;
    let stars = [];
    let frame = 0;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.7);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(105, Math.max(45, Math.round(width * height / 10500)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.1 + .25,
        alpha: Math.random() * .55 + .16,
        phase: Math.random() * Math.PI * 2,
        drift: Math.random() * .13 + .025
      }));
    };
    const draw = () => {
      frame += 1;
      context.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        const pulse = reducedMotion ? 1 : .68 + Math.sin(frame * .012 + star.phase) * .26;
        const x = star.x + (reducedMotion ? 0 : Math.sin(frame * .002 + star.phase) * 3);
        context.beginPath();
        context.arc(x, star.y, star.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(198, 215, 255, ${star.alpha * pulse})`;
        context.fill();
      });
      if (!reducedMotion) window.requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener('resize', resize, { passive: true });
  }
})();
