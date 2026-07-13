  // Mobile menu toggle
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  function closeMenu(){
    mobileMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }
  function openMenu(){
    mobileMenu.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
  }
  navToggle.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });
  mobileMenu.querySelectorAll('[data-menu-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      if(!link.hasAttribute('download')) closeMenu();
    });
  });
  window.addEventListener('resize', () => { if(window.innerWidth > 920) closeMenu(); });

  // Active nav link on scroll
  const navLinkEls = document.querySelectorAll('[data-nav-link]');
  const trackedSections = ['about','work','skills','learning','certificates','contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.dataset.navLink === entry.target.id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  trackedSections.forEach(sec => spy.observe(sec));

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  reveals.forEach(el => io.observe(el));

  // Contact form -> mailto
  const contactForm = document.getElementById('contactForm');
  const cfStatus = document.getElementById('cf-status');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const company = document.getElementById('cf-company').value.trim();
    const role = document.getElementById('cf-role').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    if(!name || !email || !message){
      cfStatus.textContent = 'Please fill in your name, email, and a message.';
      cfStatus.classList.add('error');
      return;
    }

    cfStatus.classList.remove('error');
    const subject = `Portfolio inquiry from ${name}${role ? ' — ' + role : ''}`;
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : null,
      role ? `Role: ${role}` : null,
      '',
      message
    ].filter(Boolean).join('\n');

    const mailtoUrl = `mailto:safakaware02@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines)}`;
    window.location.href = mailtoUrl;
    cfStatus.textContent = 'Opening your email client...';
  });

