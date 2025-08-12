// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Intersection Observer for reveal animations
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.18 });
// expose for dynamic modules
window.observer = observer;

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Theme toggle
const themeToggleBtn = document.getElementById('themeToggle');
if (themeToggleBtn) {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') document.body.classList.add('light');
    updateThemeIcon();
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light');
        localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
        updateThemeIcon();
    });
}

function updateThemeIcon() {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (!icon) return;
    if (document.body.classList.contains('light')) {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
}

// Optional: reduce motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('visible');
    });
}

// Particle background (lightweight custom implementation)
(function initParticles(){
    const canvas = document.getElementById('particles-canvas');
    if(!canvas) return; const ctx = canvas.getContext('2d');
    let w,h,rafId; const density = 70; const particles=[]; const maxConnDist=140; const mouse = {x:-9999,y:-9999};
    function resize(){ w=canvas.width=canvas.offsetWidth; h=canvas.height=canvas.offsetHeight; }
    window.addEventListener('resize',()=>{ resize(); }); resize();
    function makeParticle(){ return { x:Math.random()*w, y:Math.random()*h, vx:(Math.random()-.5)*0.4, vy:(Math.random()-.5)*0.4, r:Math.random()*2 + .6 }; }
    for(let i=0;i<density;i++) particles.push(makeParticle());
    canvas.addEventListener('mousemove', e=>{ const rect=canvas.getBoundingClientRect(); mouse.x=e.clientX-rect.left; mouse.y=e.clientY-rect.top; });
    canvas.addEventListener('mouseleave', ()=>{ mouse.x=-9999; mouse.y=-9999; });
    function step(){ ctx.clearRect(0,0,w,h); const themeLight=document.body.classList.contains('light');
        for(const p of particles){
            // attraction
            const dx = mouse.x - p.x; const dy = mouse.y - p.y; const dist = Math.hypot(dx,dy);
            if(dist < 140){ const force = (140 - dist)/140 * 0.15; p.vx += force * dx/dist; p.vy += force * dy/dist; }
            p.x+=p.vx; p.y+=p.vy; p.vx*=0.985; p.vy*=0.985; if(p.x<0||p.x>w) p.vx*=-1; if(p.y<0||p.y>h) p.vy*=-1; ctx.beginPath(); ctx.fillStyle= themeLight? 'rgba(37,99,235,.55)':'rgba(148,163,184,.55)'; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); }
        // connect lines
        for(let i=0;i<particles.length;i++){ for(let j=i+1;j<particles.length;j++){ const a=particles[i],b=particles[j]; const dx=a.x-b.x, dy=a.y-b.y; const dist=Math.hypot(dx,dy); if(dist<maxConnDist){ const alpha=1 - dist/maxConnDist; ctx.strokeStyle= themeLight? `rgba(59,130,246,${alpha*0.35})`:`rgba(96,165,250,${alpha*0.25})`; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); } } }
        rafId=requestAnimationFrame(step);
    }
    step();
    // Theme re-draw on toggle (lines adapt color automatically next frame)
})();

// PWA: register service worker
if('serviceWorker' in navigator){
    window.addEventListener('load', ()=>{
        navigator.serviceWorker.register('/sw.js').catch(()=>{});
    });
}
