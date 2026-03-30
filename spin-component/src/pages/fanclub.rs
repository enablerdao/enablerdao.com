/// Fan club page: login, promo code, and members-only content.

pub fn render() -> String {
    r#"<section class="section" style="max-width:720px;margin:0 auto;">
  <h1 style="font-size:1.8rem;margin-bottom:0.5rem;">Enabler Fan Club</h1>
  <p style="color:#888;margin-bottom:1rem;">月額980円で全プロダクトのProプランが使い放題。</p>
  <div style="background:#111;border:1px solid #333;border-radius:12px;padding:20px;margin-bottom:2rem;">
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
      <span style="background:#1a1a2e;padding:4px 10px;border-radius:6px;font-size:13px;">&#x1F4F8; パシャ Pro</span>
      <span style="background:#1a1a2e;padding:4px 10px;border-radius:6px;font-size:13px;">&#x1F4DD; ポン</span>
      <span style="background:#1a1a2e;padding:4px 10px;border-radius:6px;font-size:13px;">&#x1F511; KAGI</span>
      <span style="background:#1a1a2e;padding:4px 10px;border-radius:6px;font-size:13px;">&#x1F399; Koe</span>
      <span style="background:#1a1a2e;padding:4px 10px;border-radius:6px;font-size:13px;">&#x1F94B; JiuFlow</span>
      <span style="background:#1a1a2e;padding:4px 10px;border-radius:6px;font-size:13px;">&#x1F916; Elio</span>
      <span style="background:#1a1a2e;padding:4px 10px;border-radius:6px;font-size:13px;">&#x1F3B5; Soluna</span>
    </div>
    <p style="color:#888;font-size:12px;">&#x2726; 新プロダクト先行アクセス &#x2726; 限定コミュニティ &#x2726; 開発の裏側</p>
  </div>

  <div id="fanclub-app">
    <!-- Login form -->
    <div id="fc-email-form">
      <div style="background:#111;border:1px solid #333;border-radius:12px;padding:24px;">
        <h2 style="font-size:1.1rem;margin-bottom:1rem;">メールアドレスでログイン</h2>
        <div style="display:flex;gap:8px;">
          <input type="email" id="fc-email" placeholder="you@example.com"
            style="flex:1;padding:10px 14px;background:#0a0a0a;border:1px solid #444;border-radius:8px;color:#e8e8e8;font-size:15px;">
          <button onclick="fcLogin()" id="fc-btn"
            style="padding:10px 20px;background:#44ff88;color:#0a0a0a;border:none;border-radius:8px;font-weight:bold;cursor:pointer;white-space:nowrap;">
            ログイン
          </button>
        </div>
        <p id="fc-error" style="color:#ff4444;font-size:13px;margin-top:8px;display:none;"></p>
        <p style="color:#666;font-size:12px;margin-top:12px;">初めての方は自動的に登録されます。</p>
      </div>
    </div>

    <!-- Check email -->
    <div id="fc-check-email" style="display:none;">
      <div style="background:#111;border:1px solid #333;border-radius:12px;padding:24px;text-align:center;">
        <div style="font-size:2rem;margin-bottom:12px;">&#x1F4E7;</div>
        <h2 style="font-size:1.1rem;margin-bottom:0.5rem;">メールを確認してください</h2>
        <p style="color:#888;font-size:14px;">ログインリンクを送信しました。<br>メール内のリンクをクリックしてください。</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:16px;">
          <a href="https://mail.google.com/mail/" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:#1a1a2e;border:1px solid #333;border-radius:8px;color:#fff;text-decoration:none;font-size:13px;">&#x1F4E8; Gmail を開く</a>
          <a href="https://outlook.live.com/mail/" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:#1a1a2e;border:1px solid #333;border-radius:8px;color:#fff;text-decoration:none;font-size:13px;">&#x1F4EC; Outlook を開く</a>
          <a href="https://mail.yahoo.co.jp/" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:#1a1a2e;border:1px solid #333;border-radius:8px;color:#fff;text-decoration:none;font-size:13px;">&#x1F4EA; Yahoo!メール を開く</a>
        </div>
      </div>
    </div>

    <!-- Members area (shown after verify) -->
    <div id="fc-members" style="display:none;">

      <!-- Promo code card -->
      <div style="background:#111;border:1px solid #44ff88;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
        <h2 style="font-size:1rem;margin-bottom:0.5rem;">&#x1F389; あなたの招待コード</h2>
        <div id="fc-code-value"
          style="background:#0a0a0a;border:2px dashed #44ff88;border-radius:8px;padding:16px;margin:12px 0;font-family:monospace;font-size:1.3rem;letter-spacing:2px;color:#44ff88;cursor:pointer;"
          onclick="fcCopy()">
        </div>
        <p style="color:#888;font-size:12px;">タップしてコピー &#x2192; パシャアプリの設定 &#x2192; ファンクラブで入力</p>
        <p id="fc-copied" style="color:#44ff88;font-size:13px;display:none;">コピーしました！</p>
      </div>

      <!-- Members-only content -->
      <div style="margin-bottom:24px;">
        <h2 style="font-size:1.2rem;margin-bottom:16px;color:#44ff88;">&#x1F512; メンバー限定コンテンツ</h2>
      </div>

      <!-- Now Building -->
      <div style="background:#111;border:1px solid #333;border-radius:12px;padding:20px;margin-bottom:16px;">
        <h3 style="font-size:0.95rem;margin-bottom:12px;">&#x1F6A7; 今つくっているもの</h3>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="background:#0a0a0a;border-radius:8px;padding:14px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <span style="font-weight:bold;font-size:14px;">&#x1F94B; FLOW &#x2014; 柔術アニメ</span>
              <span style="font-size:11px;color:#44ff88;background:#0d2818;padding:2px 8px;border-radius:4px;">NEW</span>
            </div>
            <p style="color:#888;font-size:12px;margin-bottom:8px;">AIが格闘技の勝敗を99.8%予測する2030年。主人公・流が「AIに読めないスタイル」で世界を目指す。5シーズン60話。オープンソース。</p>
            <div style="display:flex;gap:8px;">
              <a href="https://flow-anime.com" target="_blank" style="font-size:11px;color:#58a6ff;text-decoration:none;">&#x1F310; サイト</a>
              <a href="https://github.com/yukihamada/flow-anime" target="_blank" style="font-size:11px;color:#58a6ff;text-decoration:none;">&#x1F4BB; GitHub</a>
            </div>
          </div>
          <div style="background:#0a0a0a;border-radius:8px;padding:14px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <span style="font-weight:bold;font-size:14px;">&#x1F916; ローカルAI (clm)</span>
              <span style="font-size:11px;color:#58a6ff;background:#0d1825;padding:2px 8px;border-radius:4px;">開発中</span>
            </div>
            <p style="color:#888;font-size:12px;margin-bottom:8px;">Mac M5 (128GB) でClaude Codeをローカルモデルで動かす。bash setup.sh一発。Ollamaの2倍速。</p>
            <div style="display:flex;gap:8px;">
              <a href="https://yukihamada.jp/mv/local-ai.html" target="_blank" style="font-size:11px;color:#58a6ff;text-decoration:none;">&#x25B6; MV</a>
              <a href="https://github.com/yukihamada/local-claude" target="_blank" style="font-size:11px;color:#58a6ff;text-decoration:none;">&#x1F4BB; GitHub</a>
            </div>
          </div>
          <div style="background:#0a0a0a;border-radius:8px;padding:14px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <span style="font-weight:bold;font-size:14px;">&#x1F3B5; Koe Device</span>
              <span style="font-size:11px;color:#e3b341;background:#1a1708;padding:2px 8px;border-radius:4px;">ハードウェア</span>
            </div>
            <p style="color:#888;font-size:12px;margin-bottom:8px;">ESP32-S3 + Raspberry Pi。群衆を楽器にするデバイス。1台は記憶、100台はオーケストラ。</p>
            <a href="https://koe.live" target="_blank" style="font-size:11px;color:#58a6ff;text-decoration:none;">&#x1F310; koe.live</a>
          </div>
        </div>
      </div>

      <!-- How I Build -->
      <div style="background:#111;border:1px solid #333;border-radius:12px;padding:20px;margin-bottom:16px;">
        <h3 style="font-size:0.95rem;margin-bottom:12px;">&#x1F528; 開発スタイル</h3>
        <div style="display:flex;flex-direction:column;gap:10px;color:#ccc;font-size:13px;line-height:1.7;">
          <div style="background:#0a0a0a;border-radius:8px;padding:14px;">
            <div style="font-weight:bold;margin-bottom:4px;">&#x1F9F0; 技術スタック</div>
            <p style="color:#888;">Rust + Axum + SQLite。フロントはSwiftUI (iOS) か Spin/WASM (Web)。インフラはFly.io東京リージョン。全プロダクト共通アーキテクチャ。</p>
          </div>
          <div style="background:#0a0a0a;border-radius:8px;padding:14px;">
            <div style="font-weight:bold;margin-bottom:4px;">&#x1F916; AIチーム</div>
            <p style="color:#888;">翔太(CTO)、美咲(CMO)、健太(COO)、凛(CHRO)の4人のAIエージェントが24時間稼働。コードレビュー、コンテンツ作成、監視、ユーザー対応を自律的にこなす。</p>
          </div>
          <div style="background:#0a0a0a;border-radius:8px;padding:14px;">
            <div style="font-weight:bold;margin-bottom:4px;">&#x26A1; 開発サイクル</div>
            <p style="color:#888;">Claude Code (Opus) で実装 &#x2192; GitHub PR &#x2192; Fly.ioにデプロイ &#x2192; TestFlight/App Store審査。1日で機能追加からリリースまで回す。</p>
          </div>
        </div>
      </div>

      <!-- App Store Status -->
      <div style="background:#111;border:1px solid #333;border-radius:12px;padding:20px;margin-bottom:16px;">
        <h3 style="font-size:0.95rem;margin-bottom:12px;">&#x1F4F1; App Store 審査状況</h3>
        <div style="display:flex;flex-direction:column;gap:6px;font-size:13px;">
          <div style="display:flex;justify-content:space-between;padding:8px 12px;background:#0a0a0a;border-radius:6px;">
            <span>&#x1F4F8; パシャ</span><span style="color:#e3b341;">&#x23F3; 審査待ち</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 12px;background:#0a0a0a;border-radius:6px;">
            <span>&#x1F511; KAGI</span><span style="color:#e3b341;">&#x23F3; 審査待ち</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 12px;background:#0a0a0a;border-radius:6px;">
            <span>&#x1F399; Koe (iOS)</span><span style="color:#44ff88;">&#x2705; 配信中 v2.9.0</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 12px;background:#0a0a0a;border-radius:6px;">
            <span>&#x1F916; Elio</span><span style="color:#44ff88;">&#x2705; 配信中 v1.2.35</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 12px;background:#0a0a0a;border-radius:6px;">
            <span>&#x1F3B5; Soluna</span><span style="color:#44ff88;">&#x2705; 配信中 v1.2</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 12px;background:#0a0a0a;border-radius:6px;">
            <span>&#x1F4DD; ポン</span><span style="color:#ff4444;">&#x274C; リジェクト対応中</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 12px;background:#0a0a0a;border-radius:6px;">
            <span>&#x1F94B; JiuFlow</span><span style="color:#ff4444;">&#x274C; リジェクト対応中</span>
          </div>
        </div>
      </div>

      <!-- Latest MV -->
      <div style="background:#111;border:1px solid #333;border-radius:12px;padding:20px;margin-bottom:16px;">
        <h3 style="font-size:0.95rem;margin-bottom:12px;">&#x1F3AC; 最新MV</h3>
        <a href="https://yukihamada.jp/mv/local-ai.html" target="_blank" style="display:block;background:#0a0a0a;border:1px solid #58a6ff;border-radius:8px;padding:16px;text-align:center;text-decoration:none;color:#fff;margin-bottom:8px;">
          <div style="font-size:1.5rem;margin-bottom:4px;">&#x25B6;</div>
          <div style="font-weight:bold;color:#58a6ff;">LOCAL AI &#x2014; The Revolution</div>
          <div style="font-size:11px;color:#888;">bash setup.sh 一発でAIがセットアップされる世界</div>
        </a>
        <a href="https://yukihamada.jp/mv/" target="_blank" style="font-size:12px;color:#888;text-decoration:none;">&#x2192; 全MV一覧</a>
      </div>

      <!-- Dev blog -->
      <div style="background:#111;border:1px solid #333;border-radius:12px;padding:20px;margin-bottom:16px;">
        <h3 style="font-size:0.95rem;margin-bottom:12px;">&#x1F4DD; 開発日誌</h3>
        <a href="https://yukihamada.jp/blog/2026-03-29-devlog" target="_blank" style="display:block;background:#0a0a0a;border-radius:8px;padding:14px;text-decoration:none;color:#fff;margin-bottom:8px;">
          <div style="font-weight:bold;font-size:13px;margin-bottom:4px;">3/29 &#x2014; 審査待ちの間に柔術アニメを作り始めた</div>
          <div style="color:#888;font-size:11px;">ファンクラブ構築、AIチーム始動、サイト修正、FLOWアニメ制作開始</div>
        </a>
        <a href="https://yukihamada.jp/blog" target="_blank" style="font-size:12px;color:#888;text-decoration:none;">&#x2192; 全記事一覧</a>
      </div>

      <!-- Logout -->
      <div style="text-align:center;margin-top:24px;">
        <button onclick="fcLogout()" style="background:none;border:1px solid #333;border-radius:8px;padding:8px 20px;color:#666;cursor:pointer;font-size:12px;">ログアウト</button>
      </div>

    </div>
  </div>
</section>

<script>
async function fcLogin() {
  const email = document.getElementById('fc-email').value.trim();
  if (!email) return;
  const btn = document.getElementById('fc-btn');
  const err = document.getElementById('fc-error');
  btn.disabled = true;
  btn.textContent = '送信中...';
  err.style.display = 'none';
  try {
    const res = await fetch('/api/fanclub/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email})
    });
    const data = await res.json();
    if (data.ok) {
      document.getElementById('fc-email-form').style.display = 'none';
      document.getElementById('fc-check-email').style.display = 'block';
    } else {
      err.textContent = data.error || 'エラーが発生しました';
      err.style.display = 'block';
    }
  } catch(e) {
    err.textContent = 'ネットワークエラー';
    err.style.display = 'block';
  }
  btn.disabled = false;
  btn.textContent = 'ログイン';
}

function fcCopy() {
  const code = document.getElementById('fc-code-value').textContent;
  navigator.clipboard.writeText(code);
  document.getElementById('fc-copied').style.display = 'block';
  setTimeout(() => document.getElementById('fc-copied').style.display = 'none', 2000);
}

function fcShowMembers(code) {
  document.getElementById('fc-email-form').style.display = 'none';
  document.getElementById('fc-check-email').style.display = 'none';
  document.getElementById('fc-members').style.display = 'block';
  document.getElementById('fc-code-value').textContent = code;
  // Save session
  localStorage.setItem('fc_code', code);
}

function fcLogout() {
  localStorage.removeItem('fc_code');
  localStorage.removeItem('fc_token');
  document.getElementById('fc-members').style.display = 'none';
  document.getElementById('fc-email-form').style.display = 'block';
}

// Check for verify token in URL
(function() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if (token) {
    fetch('/api/fanclub/verify?token=' + encodeURIComponent(token))
      .then(r => r.json())
      .then(data => {
        if (data.ok && data.promo_code) {
          localStorage.setItem('fc_token', token);
          fcShowMembers(data.promo_code);
          // Clean URL
          history.replaceState(null, '', '/fanclub');
        }
      });
    return;
  }
  // Check for saved session
  const savedCode = localStorage.getItem('fc_code');
  if (savedCode) {
    fcShowMembers(savedCode);
  }
})();
</script>"#.to_string()
}
