async function loadPosts(){
  const container = document.querySelector('[data-post-grid]');
  if(!container) return;
  try {
    const res = await fetch('posts.json',{cache:'no-store'});
    if(!res.ok) throw new Error('posts.json fetch failed');
    const posts = await res.json();
    const frag = document.createDocumentFragment();
    posts.sort((a,b)=> new Date(b.date)-new Date(a.date));
    posts.forEach(p=>{
      const art = document.createElement('article');
      art.className='post-card reveal';
      art.innerHTML = `
        <div class="post-meta">${new Date(p.date).getFullYear()} · ${p.category}</div>
        <h3>${p.title}</h3>
        <p class="m-0">${p.summary}</p>
        <div class="tag-badges">${(p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        <a href="${p.url}" class="read-more">READ</a>`;
      frag.appendChild(art);
    });
    container.innerHTML='';
    container.appendChild(frag);
    // trigger observer for new elements
    if(window.IntersectionObserver){
      document.querySelectorAll('.reveal').forEach(el=>{
        if(!el.classList.contains('visible')) window.observer && window.observer.observe(el);
      });
    }
  } catch(e){
    container.innerHTML = '<p class="text-muted">加载文章失败，请稍后重试。</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadPosts);
