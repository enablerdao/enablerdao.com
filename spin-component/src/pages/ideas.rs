use crate::layout::NEWSLETTER_CTA_HTML;

pub fn render() -> String {
    format!(
        r#"<section class="section">
  <div class="container">
    <div class="page-header">
      <h1 class="page-title prompt">$ ideas --list</h1>
      <p class="hero-desc">あなたのアイデアが、次のプロダクトになる</p>
      <div class="quick-stats">
        <span class="stat-badge" id="ideas-count">- アイデア</span>
        <span class="stat-badge">EBR付与あり</span>
        <span class="stat-badge">技術知識不要</span>
      </div>
    </div>

    <div class="terminal-box idea-form-box">
      <h3 class="form-title">$ ideas new</h3>
      <form id="idea-form" class="idea-form">
        <div class="form-group">
          <label for="idea-title">タイトル (50文字以内)</label>
          <input type="text" id="idea-title" name="title" maxlength="50" required placeholder="こんなサービスがあったら...">
        </div>
        <div class="form-group">
          <label for="idea-category">カテゴリ</label>
          <select id="idea-category" name="category">
            <option value="daily">日常・便利</option>
            <option value="business">ビジネス</option>
            <option value="entertainment">エンタメ</option>
            <option value="education">教育</option>
            <option value="other">その他</option>
          </select>
        </div>
        <div class="form-group">
          <label for="idea-detail">詳細</label>
          <textarea id="idea-detail" name="detail" rows="4" placeholder="どんな課題を解決するか、どう使うかなど..."></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="idea-nickname">ニックネーム</label>
            <input type="text" id="idea-nickname" name="nickname" placeholder="匿名">
          </div>
          <div class="form-group">
            <label for="idea-email">メール (任意)</label>
            <input type="email" id="idea-email" name="email" placeholder="通知を受け取る">
          </div>
        </div>
        <button type="submit" class="btn btn-primary">投稿する</button>
      </form>
      <p class="form-status" id="idea-status"></p>
    </div>

    <div class="ideas-controls">
      <div class="ideas-filters">
        <button class="filter-btn active" data-filter="all">すべて</button>
        <button class="filter-btn" data-filter="daily">日常</button>
        <button class="filter-btn" data-filter="business">ビジネス</button>
        <button class="filter-btn" data-filter="entertainment">エンタメ</button>
        <button class="filter-btn" data-filter="education">教育</button>
      </div>
      <div class="ideas-sort">
        <select id="ideas-sort">
          <option value="newest">新しい順</option>
          <option value="likes">いいね順</option>
        </select>
      </div>
    </div>

    <div class="ideas-list" id="ideas-list">
      <p class="loading-text">読み込み中...</p>
    </div>

    <div class="faq-section">
      <h3 class="section-title prompt">$ cat FAQ.md</h3>
      <div class="faq-list">
        <div class="faq-item">
          <h4>投稿したアイデアはどうなりますか？</h4>
          <p>コミュニティで議論され、有望なアイデアは実際のプロダクトとして開発されます。</p>
        </div>
        <div class="faq-item">
          <h4>貢献は認定されますか？</h4>
          <p>採用されたアイデアの投稿者にはEBRガバナンストークンが付与され、DAOの意思決定に参加できるようになります。</p>
        </div>
        <div class="faq-item">
          <h4>技術知識は必要ですか？</h4>
          <p>いいえ。「こんなのがあったらいいな」というアイデアだけでOKです。</p>
        </div>
        <div class="faq-item">
          <h4>同じアイデアが既にあったら？</h4>
          <p>いいねで応援してください。人気のあるアイデアは優先的に検討されます。</p>
        </div>
      </div>
    </div>

    {newsletter}
  </div>
</section>"#,
        newsletter = NEWSLETTER_CTA_HTML,
    )
}
