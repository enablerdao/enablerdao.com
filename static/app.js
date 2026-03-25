// EnablerDAO app.js — Client-side interactions

document.addEventListener('DOMContentLoaded', () => {
  // Scroll reveal animation
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Mobile menu toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('show');
    });
  }

  // More dropdown
  const moreBtn = document.getElementById('more-btn');
  const moreMenu = document.getElementById('more-menu');
  if (moreBtn && moreMenu) {
    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      moreMenu.classList.toggle('show');
    });
    document.addEventListener('click', () => {
      moreMenu.classList.remove('show');
    });
  }

  // DAO tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const el = document.getElementById('tab-' + tab);
      if (el) el.classList.add('active');
    });
  });

  // Ideas page
  const ideaForm = document.getElementById('idea-form');
  const ideasList = document.getElementById('ideas-list');
  const ideaStatus = document.getElementById('idea-status');
  const ideasCount = document.getElementById('ideas-count');

  if (ideasList) {
    loadIdeas();
  }

  if (ideaForm) {
    ideaForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        title: document.getElementById('idea-title').value,
        category: document.getElementById('idea-category').value,
        detail: document.getElementById('idea-detail').value,
        nickname: document.getElementById('idea-nickname').value || '匿名',
        email: document.getElementById('idea-email').value,
      };
      try {
        const res = await fetch('/api/ideas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          ideaStatus.textContent = '投稿しました！';
          ideaForm.reset();
          loadIdeas();
        } else {
          ideaStatus.textContent = 'エラーが発生しました。';
        }
      } catch {
        ideaStatus.textContent = 'ネットワークエラー。';
      }
    });
  }

  async function loadIdeas() {
    try {
      const res = await fetch('/api/ideas');
      const ideas = await res.json();
      if (ideasCount) ideasCount.textContent = ideas.length + ' アイデア';
      if (!ideasList) return;
      if (ideas.length === 0) {
        ideasList.innerHTML = '<p class="loading-text">まだアイデアがありません。最初の投稿者になりましょう！</p>';
        return;
      }
      ideasList.innerHTML = ideas.map(i => `
        <div class="idea-card" data-category="${i.category}">
          <div class="idea-card-header">
            <span class="idea-card-title">${esc(i.title)}</span>
            <span class="idea-card-category">${i.category}</span>
          </div>
          ${i.detail ? `<p class="idea-card-detail">${esc(i.detail)}</p>` : ''}
          <div class="idea-card-footer">
            <span class="idea-card-meta">${esc(i.nickname)} · ${timeAgo(i.created_at)}</span>
            <button class="like-btn" onclick="likeIdea(${i.id}, this)">♡ ${i.likes}</button>
          </div>
        </div>
      `).join('');
    } catch {
      if (ideasList) ideasList.innerHTML = '<p class="loading-text">読み込みに失敗しました。</p>';
    }
  }

  // Filter ideas
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.idea-card').forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
      });
    });
  });

  // QA page
  const qaForm = document.getElementById('qa-form');
  const qaList = document.getElementById('qa-list');
  const qaStatus = document.getElementById('qa-status');

  if (qaList) {
    loadQa();
  }

  if (qaForm) {
    qaForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        question: document.getElementById('qa-question').value,
        asker: document.getElementById('qa-asker').value || '匿名',
      };
      try {
        const res = await fetch('/api/qa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          qaStatus.textContent = '質問を投稿しました！';
          qaForm.reset();
          loadQa();
        } else {
          qaStatus.textContent = 'エラーが発生しました。';
        }
      } catch {
        qaStatus.textContent = 'ネットワークエラー。';
      }
    });
  }

  async function loadQa() {
    try {
      const res = await fetch('/api/qa');
      const items = await res.json();
      if (!qaList) return;
      if (items.length === 0) {
        qaList.innerHTML = '<p class="loading-text">まだ質問がありません。最初の質問をしてみましょう！</p>';
        return;
      }
      qaList.innerHTML = items.map(q => `
        <div class="qa-card">
          <p class="qa-question">${esc(q.question)}</p>
          ${q.answer ? `<p class="qa-answer">${esc(q.answer)}</p>` : '<p class="qa-answer" style="color:#666">回答待ち...</p>'}
          <p class="qa-meta">${esc(q.asker)} · ${timeAgo(q.created_at)}</p>
        </div>
      `).join('');
    } catch {
      if (qaList) qaList.innerHTML = '<p class="loading-text">読み込みに失敗しました。</p>';
    }
  }

  // Newsletter
  const nlForm = document.getElementById('newsletter-form');
  const nlStatus = document.getElementById('newsletter-status');

  if (nlForm) {
    nlForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = nlForm.querySelector('input[name="email"]').value;
      try {
        const res = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (res.ok) {
          nlStatus.textContent = '登録しました！ウェルカムメールをお送りします。';
          nlForm.reset();
        } else {
          nlStatus.textContent = '登録に失敗しました。';
        }
      } catch {
        nlStatus.textContent = 'ネットワークエラー。';
      }
    });
  }
});

// Global like function
window.likeIdea = async function(id, btn) {
  try {
    const res = await fetch(`/api/ideas/${id}/like`, { method: 'POST' });
    if (res.ok) {
      const count = parseInt(btn.textContent.replace(/\D/g, '')) + 1;
      btn.textContent = `♡ ${count}`;
      btn.style.color = '#44ff88';
      btn.style.borderColor = '#44ff88';
    }
  } catch {}
};

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff}秒前`;
  if (diff < 3600) return `${Math.floor(diff / 60)}分前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}日前`;
  return dateStr;
}
