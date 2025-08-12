async function loadPosts(retry=0){
  const container = document.querySelector('[data-post-grid]');
  if(!container) return;
  const MAX_RETRY = 3;
  const backoff = ms => new Promise(r=>setTimeout(r, ms));
  const VERSION = '20250812-1';
  // Fallback when opened via file:// where fetch will be blocked by CORS
  if(location.protocol === 'file:') {
    console.warn('[Blog] Detected file:// protocol, using embedded fallback posts (run a local server to enable dynamic fetch).');
    const fallbackPosts = [
      {"date":"2025-02-13","category":"游戏","title":"游戏相关：那些好玩的瞬间","summary":"碎片时间里的体验与机制观察。","tags":["Game"],"url":"game/index.html"},
      {"date":"2025-02-12","category":"随笔","title":"我的技术栈（其实没有）","summary":"堆栈是一种动态分布，不是身份标签。","tags":["Reflection"],"url":"#"},
      {"date":"2025-02-11","category":"前端","title":"前端开发技巧：AI 辅助下的最小工作流","summary":"把注意力留给信息架构与交互，重复劳动交给工具链。","tags":["Frontend","AI"],"url":"#"},
      {"date":"2025-02-10","category":"学习","title":"如何学习编程（也许不学也行?）","summary":"一堆犯错与踩坑后的随感：节奏、动机、反馈闭环，还有放弃恐惧。","tags":["Learning","Mindset"],"url":"#"}
    ];
    renderPosts(container, fallbackPosts);
    return;
  }
  try {
  console.log('[Blog] Fetching posts.json (attempt', retry+1, ')');
  const res = await fetch(`posts.json?v=${VERSION}`,{cache:'no-store'});
    if(!res.ok) throw new Error('posts.json fetch failed: '+res.status);
    const text = await res.text();
    let posts;
    try { posts = JSON.parse(text); } catch(parseErr){
      throw new Error('JSON parse error: '+parseErr.message+' raw='+text.slice(0,120));
    }
    if(!Array.isArray(posts)) throw new Error('posts.json root is not array');
  renderPosts(container, posts);
    console.log('[Blog] Posts loaded:', posts.length);
  } catch(e){
    console.error('[Blog] loadPosts error:', e);
    if(retry < MAX_RETRY){
      const delay = (2**retry)*400;
      container.innerHTML = `<p class="text-muted">加载失败，重试中 (${retry+1}/${MAX_RETRY}) ...</p>`;
      await backoff(delay);
      return loadPosts(retry+1);
    }
    container.innerHTML = '<p class="text-muted">加载文章失败，请稍后刷新。</p>';
  }
}

document.addEventListener('DOMContentLoaded', ()=>loadPosts());

function renderPosts(container, posts){
  const frag = document.createDocumentFragment();
  posts.sort((a,b)=> new Date(b.date)-new Date(a.date));
  posts.forEach(p=>{
    const art = document.createElement('article');
    art.className='post-card reveal';
    const safeTitle = p.title || 'Untitled';
    const safeSummary = p.summary || '';
    const url = normalizeUrl(p.url);
    art.innerHTML = `
      <div class="post-meta">${(p.date? new Date(p.date).getFullYear(): '—')} · ${p.category||''}</div>
      <h3>${safeTitle}</h3>
      <p class="m-0">${safeSummary}</p>
      <div class="tag-badges">${(p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <a href="${url}" class="read-more">READ</a>`;
    frag.appendChild(art);
  });
  container.innerHTML='';
  container.appendChild(frag);
  if(window.IntersectionObserver){
    document.querySelectorAll('.reveal').forEach(el=>{
      if(!el.classList.contains('visible')) window.observer && window.observer.observe(el);
    });
  }
}

function normalizeUrl(u){
  if(!u) return '#';
  // absolute (protocol) or protocol-relative
  if(/^https?:\/\//i.test(u)) return u;
  // already root-relative
  if(u.startsWith('/')) return u.replace(/\/+/g,'/');
  // strip leading ./
  u = u.replace(/^\.\//,'');
  // collapse any starting ../ segments -> just drop to root blog
  while(u.startsWith('../')) u = u.slice(3);
  // remove leading repeating blog/ to avoid /blog/blog/
  u = u.replace(/^blog\//i,'');
  
  // For GitHub Pages, use relative paths from current location
  if(u === '#') return '#';
  
  // If it's a game page, use relative path
  if(u.includes('game/') || u.startsWith('game')) {
    return u.startsWith('game/') ? u : `game/${u}`;
  }
  
  // For other internal blog links, use relative paths
  return u;
}

// Delegate click to sanitize any stale duplicated path links
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a.read-more');
  if(!a) return;
  let fixed = a.getAttribute('href') || '#';
  fixed = fixed.replace(/\/blog\/blog\//g,'/blog/');
  // ensure root-relative for internal blog pages
  if(!/^https?:/i.test(fixed) && !fixed.startsWith('/')) {
    if(fixed.startsWith('game/')) fixed = '/blog/' + fixed;
  }
  if(fixed !== a.getAttribute('href')) a.setAttribute('href', fixed);
});
