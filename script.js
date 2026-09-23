// ---------- Render site data (projects, skills, learning, certificates) ----------
  // This reads the JSON in <script id="site-data"> and fills in the sections
  // that admin.html's export leaves as empty containers.
  function escapeHtml(str){
    return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function renderSiteData(){
    const dataEl = document.getElementById('site-data');
    if(!dataEl) return;
    let data;
    try { data = JSON.parse(dataEl.textContent); }
    catch(e){ console.error('Could not parse site-data JSON:', e); return; }

    const skillsWrap = document.getElementById('skillsWrap');
    if(skillsWrap && Array.isArray(data.skills)){
      skillsWrap.innerHTML = data.skills.map((group) => `
        <div class="skill-group">
          <h4>${escapeHtml(group.group)}</h4>
          <div class="chip-row">
            ${(group.chips || []).map((chip) => `<span class="chip">${escapeHtml(chip)}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }

    const projectList = document.getElementById('projectList');
    if(projectList && Array.isArray(data.projects)){
      projectList.innerHTML = data.projects.map((p) => `
        <div class="project-card">
          <div>
            <div class="project-top">
              <h3>${escapeHtml(p.title)}</h3>
              <span class="project-cat">${escapeHtml(p.category)}</span>
            </div>
            <p class="desc">${escapeHtml(p.description)}</p>
            ${p.meta ? `<div class="project-meta">${escapeHtml(p.meta)}</div>` : ''}
            <div class="tag-row">
              ${(p.tags || []).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
            </div>
          </div>
          <div class="project-links">
            ${p.demoUrl ? `<a href="${escapeHtml(p.demoUrl)}" target="_blank" rel="noopener">Live demo ↗</a>` : ''}
            ${p.githubUrl ? `<a href="${escapeHtml(p.githubUrl)}" target="_blank" rel="noopener">Code ↗</a>` : ''}
          </div>
        </div>
      `).join('');
    }

    const trainList = document.getElementById('trainList');
    if(trainList && Array.isArray(data.learning)){
      trainList.innerHTML = data.learning.map((item) => `
        <div class="train-item">
          <div class="when">${escapeHtml(item.when)}</div>
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </div>
        </div>
      `).join('');
    }

    const certGroups = document.getElementById('certGroups');
    if(certGroups && Array.isArray(data.certificateGroups)){
      certGroups.innerHTML = data.certificateGroups.map((group) => `
        <div class="cert-group">
          <div class="cert-group-title">${escapeHtml(group.groupTitle)}</div>
          <div class="cert-grid">
            ${(group.items || []).map((item) => `
              <div class="cert-card">
                <div class="cert-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>
                </div>
                <h4>${escapeHtml(item.title)}</h4>
                <p class="cert-meta">${escapeHtml(item.meta)}</p>
                ${item.href ? `<a class="cert-link" href="${escapeHtml(item.href)}" target="_blank" rel="noopener">View certificate ↗</a>` : ''}
              </div>
            `).join('') || '<div class="cert-card cert-card-placeholder"><p class="cert-meta">More on the way.</p></div>'}
          </div>
        </div>
      `).join('');
    }
  }

  renderSiteData();

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