/// `/careers` — recruitment page (bilingual JA/EN, client-side toggle).
///
/// Self-contained: scoped `<style>` + inline toggle script live in the content
/// string so the shared layout/CSS is untouched. Currently served `noindex`
/// (draft) via `html_page_noindex` in lib.rs.
///
/// Structure follows the reader's decision order (persona feedback 2026-06-05):
///   hero → roles/products → THE BAR → ways-in (one section) → floor (jiu-jitsu)
///   → how-we-work → comp → apply.
///
/// Comp specifics are intentionally "未確定 / TBD" — no invented numbers; we
/// promise to state them in the first 1-on-1. Jargon (ATSUME, 焚き火, bug bounty)
/// is glossed inline on first use.
pub fn render() -> String {
    r#"<style>
#careers .en{display:none}
#careers.en-mode .ja{display:none}
#careers.en-mode .en{display:revert}
#careers .lang-toggle{display:flex;gap:0;justify-content:flex-end;margin-bottom:18px}
#careers .lang-toggle button{background:transparent;border:1px solid var(--dim);color:var(--dim);font-family:inherit;font-size:13px;padding:5px 14px;cursor:pointer}
#careers .lang-toggle button:first-child{border-radius:6px 0 0 6px}
#careers .lang-toggle button:last-child{border-radius:0 6px 6px 0;border-left:none}
#careers .lang-toggle button.active{color:var(--green);border-color:var(--green)}
#careers .draft-flag{border:1px dashed var(--amber);color:var(--amber);border-radius:8px;padding:10px 16px;font-size:13px;margin-bottom:24px;line-height:1.7}
#careers .lede{font-size:clamp(20px,3.4vw,28px);font-weight:700;line-height:1.5;color:var(--bright);margin:18px 0 0}
#careers .bar-card{border:1px solid var(--green);border-radius:12px;padding:28px;margin:24px 0;background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(34,197,94,0.04) 100%)}
#careers .bar-card .big{font-size:clamp(22px,4vw,34px);font-weight:700;line-height:1.4;color:var(--bright);margin:0 0 12px}
#careers .grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:18px;margin:24px 0}
#careers .grid3 .terminal-box{margin:0}
#careers .grid3 h3{color:var(--green);font-size:17px}
#careers .roles{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
#careers .roles span{border:1px solid var(--cyan);color:var(--cyan);border-radius:6px;padding:4px 12px;font-size:14px}
#careers .prod{color:var(--dim);line-height:1.9;font-size:14px;padding-left:18px;margin:8px 0 0}
#careers .flow{list-style:none;padding:0;margin:18px 0;counter-reset:step}
#careers .flow li{position:relative;padding:14px 0 14px 48px;border-bottom:1px solid var(--dim);counter-increment:step;color:var(--fg);line-height:1.7}
#careers .flow li:before{content:counter(step);position:absolute;left:0;top:12px;width:32px;height:32px;border:1px solid var(--green);color:var(--green);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700}
#careers .flow li:last-child{border-bottom:none}
#careers .cta-row{display:flex;flex-wrap:wrap;gap:12px;margin-top:18px}
#careers a.green{color:var(--green)}
#careers .note{color:var(--amber);font-size:14px;line-height:1.8}
</style>
<section class="section">
  <div id="careers" class="container">

    <div class="lang-toggle">
      <button data-set-lang="ja" class="active">JA</button>
      <button data-set-lang="en">EN</button>
    </div>

    <div class="draft-flag">
      <span class="ja">&#9888; これは下書きです（検索エンジン非公開・noindex）。文言・基準・公開可否は確認後に確定します。</span>
      <span class="en">&#9888; Draft page (noindex, not yet public). Copy, criteria, and go-live are pending review.</span>
    </div>

    <div class="page-header">
      <h1 class="page-title prompt">$ careers --join</h1>
      <p class="page-subtitle">
        <span class="ja">世界中で使われるものを、仲間と。</span>
        <span class="en">Build things used across the world &mdash; together.</span>
      </p>
      <p class="lede">
        <span class="ja">他の誰にも負けない「1 つ」を持って来てください。</span>
        <span class="en">Bring one thing nobody beats you at.</span>
      </p>
    </div>

    <h2 class="prompt" style="margin-top:40px"><span class="ja">$ 募集職種</span><span class="en">$ open-roles</span></h2>
    <div class="terminal-box">
      <div class="roles">
        <span><span class="ja">プロダクトエンジニア</span><span class="en">Product engineer</span> (Rust / TypeScript&middot;React / Swift)</span>
        <span><span class="ja">セキュリティエンジニア</span><span class="en">Security engineer</span></span>
        <span>AI / LLM <span class="ja">エンジニア</span><span class="en">engineer</span></span>
        <span><span class="ja">専門家（士業など）</span><span class="en">Licensed specialists</span></span>
      </div>
      <p style="color:var(--fg);line-height:1.9">
        <span class="ja">やること: <strong>AI を相棒に、1 人で機能をまるごと</strong>作って世界中のユーザーに届ける。少人数なので、企画から実装・運用まで自分の手で回します。私たちのプロダクト:</span>
        <span class="en">What you'll do: <strong>own whole features end to end, with AI as your teammate</strong>, and ship them to users worldwide. We're a small team &mdash; you drive from idea to deploy. Our products:</span>
      </p>
      <ul class="prod">
        <li><strong>JiuFlow</strong> &mdash; <span class="ja">世界中の柔術家が使う練習記録＋技ライブラリ SaaS</span><span class="en">training-log &amp; technique-library SaaS for jiu-jitsu, used worldwide</span></li>
        <li><strong>MU</strong> &mdash; <span class="ja">AI が毎時1着デザインする自律アパレルブランド</span><span class="en">an autonomous apparel brand where AI designs a new piece every hour</span></li>
        <li><strong>bim.house</strong> &mdash; <span class="ja">言葉から建築図面を生成（建築基準法をその場で判定）</span><span class="en">generate building designs from words, code-checked on the spot</span></li>
        <li><span class="ja">ほか</span><span class="en">plus</span> <strong>商標まる</strong>(<span class="ja">AI商標出願</span><span class="en">AI trademark filing</span>) / <strong>StayFlow</strong>(<span class="ja">民泊運営</span><span class="en">rental ops</span>) / <strong>Koe</strong>(<span class="ja">声クローン</span><span class="en">voice clone</span>) / <strong>IKI</strong>(<span class="ja">安否確認</span><span class="en">safety check-in</span>) ...</li>
      </ul>
      <p class="note" style="margin-bottom:0">
        <span class="ja">&#9888; 働く場所・雇用形態（業務委託 / 正社員）は柔軟。要相談。</span>
        <span class="en">&#9888; Location and engagement type (contract / full-time) are flexible &mdash; let's talk.</span>
      </p>
    </div>

    <div class="bar-card">
      <p class="big">
        <span class="ja">採用基準は、たった 1 つ。</span>
        <span class="en">The bar is just one thing.</span>
      </p>
      <p style="color:var(--fg);line-height:1.9;margin:0">
        <span class="ja">全部そこそこ、より、<strong>突き抜けた 1 つ</strong>。コード・デザイン・文章・営業・数学… 何でもいい。その道で日本一・世界一を本気で狙えるなら、それが基準です。下の「入口」のどれか 1 つで来てください。</span>
        <span class="en">A single spike beats being average at everything. Code, design, writing, sales, math &mdash; anything you could seriously aim to be #1 at. Come in through any one of the doors below.</span>
      </p>
    </div>

    <h2 class="prompt" style="margin-top:40px"><span class="ja">$ ls 入口/</span><span class="en">$ ls ways-in/</span></h2>
    <div class="grid3">
      <div class="terminal-box">
        <h3>&#128187; <span class="ja">スキルで突き抜ける</span><span class="en">A spike skill</span></h3>
        <p style="color:var(--fg);line-height:1.8">
          <span class="ja">作ったもの・実績で「これは負けない」を見せられる。職種そのもの（コード/デザイン/文章…）で世界トップを狙える人。</span>
          <span class="en">Show, through what you've built, the one thing you don't lose at &mdash; in code, design, writing, anything.</span>
        </p>
      </div>
      <div class="terminal-box">
        <h3>&#127891; <span class="ja">専門資格（士業）</span><span class="en">A licensed profession</span></h3>
        <p style="color:var(--fg);line-height:1.8">
          <span class="ja">独占業務＝その人にしかできない仕事。弁理士&rarr;商標まる、一級建築士&rarr;bim.house、宅建士&rarr;StayFlow、税理士&rarr;サクッ など。<strong>他の士業・医師も歓迎。</strong></span>
          <span class="en">Licensed work only that person may do. Patent attorney&rarr;Shohyo-Maru, architect&rarr;bim.house, real-estate agent&rarr;StayFlow, tax accountant&rarr;Sakutto, etc. <strong>Other licensed pros &amp; doctors welcome.</strong></span>
        </p>
      </div>
      <div class="terminal-box">
        <h3>&#128272; <span class="ja">セキュリティ</span><span class="en">Security</span></h3>
        <p style="color:var(--fg);line-height:1.8">
          <span class="ja">腕は実プロダクトで証明。脆弱性を見つけて責任を持って報告する（＝<strong>バグバウンティ</strong>。壊さず、見つけて知らせる）。良い報告が、そのまま応募になる。</span>
          <span class="en">Prove it on real products. Responsibly find a vulnerability and report it with repro steps (a <strong>bug bounty</strong> &mdash; don't break it, find it and tell us). A good report is your application.</span>
        </p>
        <a class="green" href="mailto:info@enablerdao.com?subject=security%3A%20bug%20bounty%20report"><span class="ja">脆弱性を報告する &rarr;</span><span class="en">Report a vulnerability &rarr;</span></a>
        <p class="note" style="margin:8px 0 0;font-size:13px"><span class="ja">報奨金は重大度に応じて要相談（未確定・盛りません）。</span><span class="en">Bounty scales with severity &mdash; let's talk (not yet fixed, no inflated promises).</span></p>
      </div>
      <div class="terminal-box">
        <h3>&#128664; <span class="ja">現場に行ける人</span><span class="en">You can get there &amp; move it</span></h3>
        <p style="color:var(--fg);line-height:1.8">
          <span class="ja">車・船・飛行機の操縦。現場に行ける、モノを運べる、世界を移動できる &mdash; それも「その人にしかできない 1 つ」。</span>
          <span class="en">Drive a car, a boat, fly a plane. Reaching the site, moving things, traveling the world is an only-you edge too.</span>
        </p>
      </div>
      <div class="terminal-box">
        <h3>&#129354; <span class="ja">柔術でトップ</span><span class="en">Top-level jiu-jitsu</span></h3>
        <p style="color:var(--fg);line-height:1.8">
          <span class="ja">日本・世界の上位で戦える。本気です &mdash; 私たちのプロダクトは柔術の現場から生まれました。<strong>パラ柔術</strong>も（手も足も関係ない、強いやつは強い）。</span>
          <span class="en">Competing at the top in Japan or the world. We mean it &mdash; our products grew from the mat. <strong>Para jiu-jitsu</strong> too (with hands or without, the strong are strong).</span>
        </p>
        <a class="green" href="https://takezo.jiuflow.com" target="_blank" rel="noopener">takezo.jiuflow.com &#8599;</a>
      </div>
    </div>

    <div class="terminal-box" style="border-left:3px solid var(--amber)">
      <h3>&#129354; <span class="ja">どれもまだ無いなら</span><span class="en">None of those yet?</span></h3>
      <p style="color:var(--fg);line-height:1.9">
        <span class="ja">とりあえず柔術で <strong>青帯以上</strong>になってこい。話はそれからだ。最低ラインは、<a class="green" href="https://ukemi.jiuflow.com" target="_blank" rel="noopener">ukemi.jiuflow.com</a>（受け身を採点するアプリ）で<strong>青帯クラスの受け身</strong>を出すこと &mdash; いちばん低い、誰でも挑めるハードル。受け身は、すべての土台。<a class="green" href="https://jiuflow.com" target="_blank" rel="noopener">JiuFlow</a> で記録して、近くの<strong>道場</strong>で組む。続けられる・逃げないの証明が、立派な 1 つになる。</span>
        <span class="en">Then go earn at least a <strong>blue belt</strong> &mdash; we'll talk after that. The floor: post a <strong>blue-belt-level breakfall</strong> on <a class="green" href="https://ukemi.jiuflow.com" target="_blank" rel="noopener">ukemi.jiuflow.com</a> (an app that scores your ukemi) &mdash; the lowest bar, open to anyone. Ukemi is the foundation of everything. Track training on <a class="green" href="https://jiuflow.com" target="_blank" rel="noopener">JiuFlow</a> and roll at a <strong>dojo</strong> near you. Proving you stick with it becomes a fine "one thing."</span>
      </p>
    </div>

    <h2 class="prompt" style="margin-top:40px"><span class="ja">$ ls 働き方/</span><span class="en">$ ls how-we-work/</span></h2>
    <div class="grid3">
      <div class="terminal-box">
        <h3>&#128293; <span class="ja">報告は焚き火に</span><span class="en">Work out loud</span></h3>
        <p style="color:var(--fg);line-height:1.8">
          <span class="ja">日報・進捗・詰まりは、埋もれるチャットでなく <strong>ATSUME（takibi.wtf・Enablerの仲間が集まる公開コミュニティ）</strong> に投稿する。これを「焚き火に薪をくべる」と呼ぶ。人も AI も同じログを読む。透明 by default。</span>
          <span class="en">Reports, progress, and blockers go to <strong>ATSUME (takibi.wtf, our open community)</strong> rather than a chat that buries them &mdash; we call posting there "adding wood to the fire." Humans and AI read the same log. Transparent by default.</span>
        </p>
      </div>
      <div class="terminal-box">
        <h3>&#129777; <span class="ja">焚き火 1on1</span><span class="en">Campfire 1-on-1</span></h3>
        <p style="color:var(--fg);line-height:1.8">
          <span class="ja">査定面談ではなく、火を囲んで話す 1on1。詰まり・前提・トレードオフを先に出す。支え合いと相互リスペクトが土台。</span>
          <span class="en">Not a performance review &mdash; a 1-on-1 around the fire. Surface blockers, assumptions, and trade-offs early. Built on mutual support and respect.</span>
        </p>
      </div>
      <div class="terminal-box">
        <h3>&#127942; <span class="ja">試合に出す</span><span class="en">Put it in the ring</span></h3>
        <p style="color:var(--fg);line-height:1.8">
          <span class="ja">プロダクトも自分も、試合に出す。柔術の試合、コンペ、ローンチ &mdash; 締め切りのある真剣勝負で伸びる。負けも公開して、次へ。</span>
          <span class="en">Put both your product and yourself in the ring. Tournaments, competitions, launches &mdash; you grow under real deadlines. We publish the losses too, then move on.</span>
        </p>
      </div>
    </div>

    <div class="terminal-box">
      <h3>&#128178; <span class="ja">報酬と開示 &mdash; 稼ぐほど、開く</span><span class="en">Comp &amp; transparency &mdash; the more you earn, the more you open</span></h3>
      <p style="color:var(--fg);line-height:1.9">
        <span class="ja">報酬が上がるほど、その人の数字・意思決定・成果はチームに開示されます。透明性は地位の特権でなく、責任。MU の <a class="green" href="https://wearmu.com/transparency" target="_blank" rel="noopener">/transparency</a> のように、数字は隠さない文化です。</span>
        <span class="en">As pay rises, that person's numbers, decisions, and outcomes are disclosed to the team. Transparency is a responsibility of rank, not a privilege. Like MU's <a class="green" href="https://wearmu.com/transparency" target="_blank" rel="noopener">/transparency</a>, we don't hide the numbers.</span>
      </p>
      <p class="note" style="margin-bottom:0">
        <span class="ja">&#9888; 具体的な金額レンジ・等級は未確定（要相談）。盛りません &mdash; <strong>初回の焚き火 1on1 で必ず提示します。</strong></span>
        <span class="en">&#9888; Exact ranges and levels aren't fixed yet (let's talk). No inflated promises &mdash; <strong>we'll state them in your first 1-on-1.</strong></span>
      </p>
    </div>

    <h2 class="prompt" style="margin-top:40px"><span class="ja">$ ./apply</span><span class="en">$ ./apply</span></h2>
    <p style="color:var(--fg);line-height:1.9">
      <span class="ja">応募フォームはありません。難しく考えないで &mdash; <strong>まず <a class="green" href="mailto:info@enablerdao.com?subject=careers">info@enablerdao.com</a> に「&#9711;&#9711;が得意です」と一言メールでOK。</strong>そこから先はこの流れ:</span>
      <span class="en">There's no apply form. Keep it simple &mdash; <strong>just email <a class="green" href="mailto:info@enablerdao.com?subject=careers">info@enablerdao.com</a> with one line: "I'm good at &#9711;&#9711;."</strong> From there:</span>
    </p>
    <ol class="flow">
      <li>
        <span class="ja"><strong>メール、または takibi.wtf に登録</strong>（無料・誰でも入れる）。</span>
        <span class="en"><strong>Email us, or sign up at takibi.wtf</strong> (free, open to anyone).</span>
      </li>
      <li>
        <span class="ja"><strong>「自分の負けない 1 つ」を見せる</strong> &mdash; 作ったもの・実績・試合結果・資格。履歴書より、それ。</span>
        <span class="en"><strong>Show your one thing</strong> &mdash; what you built, your record, match results, licenses. That, over a r&eacute;sum&eacute;.</span>
      </li>
      <li>
        <span class="ja"><strong>焚き火 1on1（オンライン）</strong> &mdash; お互いの前提をすり合わせ、報酬もここで提示。</span>
        <span class="en"><strong>Campfire 1-on-1 (online)</strong> &mdash; we align on assumptions, and share comp here.</span>
      </li>
      <li>
        <span class="ja"><strong>トライアル</strong> &mdash; 締め切りのある実戦で、一緒に一本つくる。</span>
        <span class="en"><strong>Trial</strong> &mdash; build something real, with a deadline, together.</span>
      </li>
    </ol>

    <div class="cta-row">
      <a href="mailto:info@enablerdao.com?subject=careers" class="btn btn-primary">
        <span class="ja">一言メールを送る &rarr;</span><span class="en">Send a one-line email &rarr;</span>
      </a>
      <a href="https://takibi.wtf" target="_blank" rel="noopener" class="btn btn-secondary">
        <span class="ja">takibi.wtf を見る</span><span class="en">See takibi.wtf</span>
      </a>
    </div>

    <p style="color:var(--dim);font-size:13px;margin-top:28px">
      <span class="ja">株式会社イネブラ / EnablerDAO &middot; info@enablerdao.com</span>
      <span class="en">Enabler Inc. / EnablerDAO &middot; info@enablerdao.com</span>
    </p>

  </div>
</section>
<script>
(function(){
  var root = document.getElementById('careers');
  if(!root) return;
  function set(lang){
    if(lang === 'en'){ root.classList.add('en-mode'); } else { root.classList.remove('en-mode'); }
    var btns = root.querySelectorAll('[data-set-lang]');
    for(var i=0;i<btns.length;i++){
      btns[i].classList.toggle('active', btns[i].getAttribute('data-set-lang') === lang);
    }
    try { localStorage.setItem('careers_lang', lang); } catch(e){}
  }
  root.querySelectorAll('[data-set-lang]').forEach(function(b){
    b.addEventListener('click', function(){ set(b.getAttribute('data-set-lang')); });
  });
  var saved = 'ja';
  try { if(localStorage.getItem('careers_lang') === 'en') saved = 'en'; } catch(e){}
  set(saved);
})();
</script>"#
        .to_string()
}
