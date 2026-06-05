/// `/careers` — recruitment page (bilingual JA/EN, client-side toggle).
///
/// Self-contained: scoped `<style>` + inline toggle script live in the content
/// string so the shared layout/CSS is untouched. Currently served `noindex`
/// (draft) via `html_page_noindex` in lib.rs.
///
/// Culture pillars reflected here:
///   - 業務報告は MCP（焚き火に薪をくべる）/ work out loud via MCP
///   - 焚き火 1on1 / campfire 1-on-1
///   - 「他に負けない 1 つ」 or 柔術トップ / one unbeatable thing, or top-level jiu-jitsu
///   - 試合を含むチャレンジ / challenge culture incl. competitions
///   - 所得に応じた開示 / transparency proportional to income
///
/// Comp specifics are intentionally left "未確定 / TBD" — no invented numbers.
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
#careers .bar-card{border:1px solid var(--green);border-radius:12px;padding:28px;margin:24px 0;background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(34,197,94,0.04) 100%)}
#careers .bar-card .big{font-size:clamp(22px,4vw,34px);font-weight:700;line-height:1.4;color:var(--bright);margin:0 0 14px}
#careers .or-split{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:center;margin-top:18px}
#careers .or-split .opt{border:1px solid var(--dim);border-radius:10px;padding:18px}
#careers .or-split .opt h4{margin:0 0 8px;color:var(--cyan)}
#careers .or-split .or{color:var(--amber);font-weight:700;font-size:18px;text-align:center}
#careers .grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px;margin:24px 0}
#careers .grid3 .terminal-box{margin:0}
#careers .grid3 h3{color:var(--green)}
#careers .tag{display:inline-block;font-size:11px;letter-spacing:.05em;color:var(--bg);background:var(--green);border-radius:5px;padding:2px 8px;margin-bottom:10px;font-weight:700}
#careers .flow{list-style:none;padding:0;margin:18px 0;counter-reset:step}
#careers .flow li{position:relative;padding:14px 0 14px 48px;border-bottom:1px solid var(--dim);counter-increment:step}
#careers .flow li:before{content:counter(step);position:absolute;left:0;top:12px;width:32px;height:32px;border:1px solid var(--green);color:var(--green);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700}
#careers .flow li:last-child{border-bottom:none}
#careers .cta-row{display:flex;flex-wrap:wrap;gap:12px;margin-top:18px}
#careers a.green{color:var(--green)}
@media(max-width:560px){#careers .or-split{grid-template-columns:1fr}#careers .or-split .or{padding:6px 0}}
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
    </div>

    <div class="terminal-box">
      <h3><span class="ja">なぜ、ここで</span><span class="en">Why here</span></h3>
      <p style="color:var(--fg);line-height:1.9">
        <span class="ja">イネブラ（EnablerDAO）は、少人数で世界に届くプロダクトを作るチームです。AI を相棒に、一人ひとりが「東京の 100 人」ではなく「世界の 100 万人」に向き合う。JiuFlow も MU も bim.house も、その姿勢から生まれました。</span>
        <span class="en">Enabler (EnablerDAO) is a small team shipping products meant for the whole world. With AI as a teammate, each person aims at "a million people worldwide," not "a hundred people in Tokyo." JiuFlow, MU, and bim.house were all born from that stance.</span>
      </p>
    </div>

    <div class="bar-card">
      <div class="tag">THE BAR</div>
      <p class="big">
        <span class="ja">他の誰にも負けない「何か」を、1 つ。</span>
        <span class="en">One thing nobody beats you at.</span>
      </p>
      <p style="color:var(--fg);line-height:1.9;margin:0">
        <span class="ja">全部そこそこ、より、突き抜けた 1 つ。コードでも、デザインでも、文章でも、営業でも、数学でも、何でもいい。その道で日本一・世界一を本気で狙えるなら、それが採用基準です。</span>
        <span class="en">A single spike beats being average at everything. Code, design, writing, sales, math &mdash; anything. If you can seriously aim to be #1 in Japan or the world at it, that's the bar.</span>
      </p>
      <div class="or-split">
        <div class="opt">
          <h4><span class="ja">スキルで突き抜ける</span><span class="en">A spike skill</span></h4>
          <p style="color:var(--dim);line-height:1.8;margin:0;font-size:14px">
            <span class="ja">作ったもの・実績で「これは負けない」を見せられる。</span>
            <span class="en">Show, with what you've built, the one thing you don't lose at.</span>
          </p>
        </div>
        <div class="or"><span class="ja">または</span><span class="en">OR</span></div>
        <div class="opt">
          <h4><span class="ja">柔術でトップ &#129354;</span><span class="en">Top-level jiu-jitsu &#129354;</span></h4>
          <p style="color:var(--dim);line-height:1.8;margin:0;font-size:14px">
            <span class="ja">日本／世界の上位で戦える。本気です &mdash; 私たちのプロダクトは柔術の現場から生まれました。</span>
            <span class="en">Competing at the top in Japan/the world. We mean it &mdash; our products grew out of the jiu-jitsu mat.</span>
          </p>
        </div>
      </div>
    </div>

    <div class="terminal-box">
      <h3>&#127891; <span class="ja">歓迎 &mdash; 「その人にしかできない」資格</span><span class="en">Welcome &mdash; licensed edges only you can do</span></h3>
      <p style="color:var(--fg);line-height:1.9">
        <span class="ja">士業や専門資格は、独占業務 = <strong>その人にしかできない仕事</strong>。それ自体が立派な「負けない 1 つ」です。私たちのプロダクトは、こういう力で動いています:</span>
        <span class="en">Licensed professions carry monopoly work &mdash; <strong>things only that person may do</strong>. That's a fine "one thing" on its own. Our products run on exactly these:</span>
      </p>
      <ul style="color:var(--fg);line-height:2;padding-left:20px">
        <li><strong><span class="ja">弁理士</span><span class="en">Patent attorney</span></strong> &mdash; <span class="ja">商標まる（商標出願・ワンクリック受任）</span><span class="en">Shohyo-Maru (trademark filing &amp; intake)</span></li>
        <li><strong><span class="ja">弁護士</span><span class="en">Lawyer</span></strong> &mdash; <span class="ja">電子契約（ポン）・商標の受任</span><span class="en">contracts (Pon), trademark cases</span></li>
        <li><strong><span class="ja">一級建築士</span><span class="en">Architect (1st class)</span></strong> &mdash; <span class="ja">bim.house（建築確認・図面署名）</span><span class="en">bim.house (code check, signed drawings)</span></li>
        <li><strong><span class="ja">宅建士</span><span class="en">Real-estate transaction specialist</span></strong> &mdash; <span class="ja">StayFlow・不動産まわり</span><span class="en">StayFlow &amp; real estate</span></li>
        <li><strong><span class="ja">行政書士</span><span class="en">Administrative scrivener</span></strong> &mdash; <span class="ja">許認可・民泊申請・会社設立</span><span class="en">permits, minpaku filings, incorporation</span></li>
        <li><strong><span class="ja">社労士（労務士）</span><span class="en">Labor &amp; social-security attorney</span></strong> &mdash; <span class="ja">労務・人事・社会保険</span><span class="en">HR, labor, social insurance</span></li>
        <li><strong><span class="ja">税理士</span><span class="en">Tax accountant</span></strong> &mdash; <span class="ja">サクッ（確定申告）・チャリン（請求）</span><span class="en">Sakuh (tax filing), Charin (invoicing)</span></li>
        <li><strong><span class="ja">司法書士</span><span class="en">Judicial scrivener</span></strong> &mdash; <span class="ja">登記・会社設立</span><span class="en">registration, incorporation</span></li>
        <li><strong><span class="ja">不動産鑑定士</span><span class="en">Real-estate appraiser</span></strong> &mdash; <span class="ja">bim.house EARTH IQ（敷地評価）</span><span class="en">bim.house EARTH IQ (site valuation)</span></li>
        <li><strong><span class="ja">医師</span><span class="en">Doctor (MD)</span></strong> &mdash; <span class="ja">ヘルスケア・IKI（安否確認）</span><span class="en">healthcare, IKI (safety check-in)</span></li>
      </ul>
      <p style="color:var(--dim);font-size:14px;line-height:1.8;margin-bottom:0">
        <span class="ja">&#9888; これは「必須」でなく「歓迎」。資格が無くても、突き抜けたスキルか柔術でOK。&mdash; 他の士業・専門職も歓迎です。</span>
        <span class="en">&#9888; Welcome, not required. No license? A spike skill or jiu-jitsu works too. &mdash; Other licensed professions are welcome as well.</span>
      </p>
    </div>

    <div class="terminal-box" style="border-left:3px solid var(--amber)">
      <h3>&#129354; <span class="ja">まだ「負けない 1 つ」が無いなら</span><span class="en">No &quot;one thing&quot; yet?</span></h3>
      <p style="color:var(--fg);line-height:1.9">
        <span class="ja">とりあえず、柔術で <strong>青帯以上</strong>になってこい。話はそれからだ。稽古は <a class="green" href="https://jiuflow.com" target="_blank" rel="noopener">JiuFlow</a> で記録して、近くの<strong>道場</strong>で組む。青帯は「続けられる」「逃げない」の証明 &mdash; それ自体が、立派な 1 つになる。</span>
        <span class="en">Then go earn at least a <strong>blue belt</strong> in jiu-jitsu first &mdash; we'll talk after that. Track your training on <a class="green" href="https://jiuflow.com" target="_blank" rel="noopener">JiuFlow</a> and roll at a <strong>dojo</strong> near you. A blue belt proves you stick with it and don't run &mdash; that itself becomes a fine &quot;one thing.&quot;</span>
      </p>
      <p style="color:var(--fg);line-height:1.9">
        <span class="ja">それに柔術には <strong>パラ</strong>（パラ柔術）もある。手があっても無くても、足があっても無くても &mdash; 強いやつは強い。誰でも畳に上がれる。&rarr; <a class="green" href="https://takezo.jiuflow.com" target="_blank" rel="noopener">takezo.jiuflow.com</a></span>
        <span class="en">And jiu-jitsu has <strong>para</strong> too. With hands or without, with legs or without &mdash; the strong are strong. Anyone can step on the mat. &rarr; <a class="green" href="https://takezo.jiuflow.com" target="_blank" rel="noopener">takezo.jiuflow.com</a></span>
      </p>
      <p style="color:var(--fg);line-height:1.9">
        <span class="ja">帯がまだでもいい。<strong>最低でも</strong> <a class="green" href="https://ukemi.jiuflow.com" target="_blank" rel="noopener">ukemi.jiuflow.com</a> で <strong>青帯クラスの身体性</strong>を出してこい。受け身は、すべての土台だ。&rarr; ここがいちばん低いハードル。</span>
        <span class="en">No belt yet is fine. <strong>At minimum</strong>, post <strong>blue-belt-level body control</strong> on <a class="green" href="https://ukemi.jiuflow.com" target="_blank" rel="noopener">ukemi.jiuflow.com</a>. Ukemi (breakfalls) is the foundation of everything. &rarr; This is the lowest bar.</span>
      </p>
      <div class="cta-row" style="margin-top:8px">
        <a href="https://jiuflow.com" target="_blank" rel="noopener" class="btn btn-secondary">
          <span class="ja">JiuFlow で稽古を始める &rarr;</span><span class="en">Start training with JiuFlow &rarr;</span>
        </a>
        <a href="https://takezo.jiuflow.com" target="_blank" rel="noopener" class="btn btn-secondary">
          <span class="ja">パラ柔術を見る</span><span class="en">See para jiu-jitsu</span>
        </a>
        <a href="https://ukemi.jiuflow.com" target="_blank" rel="noopener" class="btn btn-secondary">
          <span class="ja">受け身を採点する</span><span class="en">Score your ukemi</span>
        </a>
      </div>
    </div>

    <h2 class="prompt" style="margin-top:48px"><span class="ja">$ ls 働き方/</span><span class="en">$ ls how-we-work/</span></h2>
    <div class="grid3">
      <div class="terminal-box">
        <h3>&#128293; <span class="ja">業務報告は焚き火に</span><span class="en">Work out loud</span></h3>
        <p style="color:var(--fg);line-height:1.8">
          <span class="ja">日報・進捗・詰まりは、埋もれるチャットでなく <strong>MCP（atsm_log）で焚き火に薪をくべる</strong>。人も AI も同じログを読む。透明 by default。</span>
          <span class="en">Reports, progress, blockers go not into a chat that buries them but onto the campfire via <strong>MCP (atsm_log)</strong>. Humans and AI read the same log. Transparent by default.</span>
        </p>
        <a class="green" href="https://atsm.wtf" target="_blank" rel="noopener">atsm.wtf &#8599;</a>
      </div>
      <div class="terminal-box">
        <h3>&#129777; <span class="ja">焚き火 1on1</span><span class="en">Campfire 1-on-1</span></h3>
        <p style="color:var(--fg);line-height:1.8">
          <span class="ja">査定面談ではなく、火を囲んで話す 1on1。詰まり・前提・トレードオフを先に出す。支え合い・相互リスペクトが土台。</span>
          <span class="en">Not a performance review &mdash; a 1-on-1 around the fire. Surface blockers, assumptions, and trade-offs early. Built on mutual support and respect.</span>
        </p>
      </div>
      <div class="terminal-box">
        <h3>&#127942; <span class="ja">チャレンジ（試合あり）</span><span class="en">Challenge culture</span></h3>
        <p style="color:var(--fg);line-height:1.8">
          <span class="ja">プロダクトも自分も、試合に出す。柔術の試合、コンペ、ローンチ &mdash; 締め切りのある真剣勝負で人は伸びる。負けも公開して、次へ。</span>
          <span class="en">Put both your product and yourself in the ring. Tournaments, competitions, launches &mdash; people grow under real deadlines. We publish the losses too, then move on.</span>
        </p>
      </div>
    </div>

    <div class="terminal-box">
      <h3>&#128178; <span class="ja">報酬と開示 &mdash; 所得に応じて開く</span><span class="en">Comp &amp; transparency &mdash; open in proportion to income</span></h3>
      <p style="color:var(--fg);line-height:1.9">
        <span class="ja">原則は <strong>「稼ぐほど、開く」</strong>。報酬が上がるほど、その人の数字・意思決定・成果はチームに開示されます。透明性は地位の特権ではなく、責任。MU の <a class="green" href="https://wearmu.com/transparency" target="_blank" rel="noopener">/transparency</a> のように、数字は隠さない文化です。</span>
        <span class="en">The principle is <strong>"the more you earn, the more you open."</strong> As compensation rises, that person's numbers, decisions, and outcomes are disclosed to the team. Transparency is a responsibility of rank, not a privilege. Like MU's <a class="green" href="https://wearmu.com/transparency" target="_blank" rel="noopener">/transparency</a>, we don't hide the numbers.</span>
      </p>
      <p style="color:var(--amber);line-height:1.8;font-size:14px;margin-bottom:0">
        <span class="ja">&#9888; 具体的な金額レンジ・等級・開示範囲は未確定（要相談）。盛りません &mdash; 決まり次第ここに明記します。</span>
        <span class="en">&#9888; Exact salary ranges, levels, and disclosure scope are TBD (let's discuss). No fluff &mdash; we'll state them here once decided.</span>
      </p>
    </div>

    <h2 class="prompt" style="margin-top:48px"><span class="ja">$ ./apply</span><span class="en">$ ./apply</span></h2>
    <p style="color:var(--fg);line-height:1.9">
      <span class="ja">応募フォームはありません。<strong>焚き火に集まりに来てください。</strong>ATSUME（atsm.wtf）に入って薪をくべる &mdash; それが応募です。</span>
      <span class="en">There's no apply form. <strong>Just come gather at the campfire.</strong> Join ATSUME (atsm.wtf) and add a log &mdash; that's your application.</span>
    </p>
    <ol class="flow">
      <li style="color:var(--fg)">
        <span class="ja"><strong>焚き火に参加</strong> &mdash; atsm.wtf のコミュニティに入って、薪をくべてみる。</span>
        <span class="en"><strong>Join the campfire</strong> &mdash; come into the atsm.wtf community and add a log.</span>
      </li>
      <li style="color:var(--fg)">
        <span class="ja"><strong>「負けない 1 つ」を見せる</strong> &mdash; 履歴書より、作ったもの・実績・試合結果。</span>
        <span class="en"><strong>Show your one thing</strong> &mdash; what you built, your record, your match results &mdash; over a r&eacute;sum&eacute;.</span>
      </li>
      <li style="color:var(--fg)">
        <span class="ja"><strong>焚き火 1on1</strong> &mdash; 火を囲んで、お互いの前提をすり合わせる。</span>
        <span class="en"><strong>Campfire 1-on-1</strong> &mdash; around the fire, we align on each other's assumptions.</span>
      </li>
      <li style="color:var(--fg)">
        <span class="ja"><strong>トライアル（試合）</strong> &mdash; 締め切りのある実戦で、一緒に一本作る。</span>
        <span class="en"><strong>Trial (a real match)</strong> &mdash; build something real, with a deadline, together.</span>
      </li>
    </ol>

    <div class="cta-row">
      <a href="https://atsm.wtf" target="_blank" rel="noopener" class="btn btn-primary">
        <span class="ja">焚き火に集まる &rarr;</span><span class="en">Come gather at the campfire &rarr;</span>
      </a>
      <a href="mailto:info@enablerdao.com?subject=careers%3A%20%E7%A7%81%E3%81%AE%E8%B2%A0%E3%81%91%E3%81%AA%E3%81%84%E4%B8%80%E3%81%A4" class="btn btn-secondary">
        <span class="ja">メールでもOK</span><span class="en">Email works too</span>
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
      btns[i].addEventListener('click', onClick);
    }
    try { localStorage.setItem('careers_lang', lang); } catch(e){}
  }
  function onClick(e){ set(e.currentTarget.getAttribute('data-set-lang')); }
  var saved = 'ja';
  try { if(localStorage.getItem('careers_lang') === 'en') saved = 'en'; } catch(e){}
  set(saved);
})();
</script>"#
        .to_string()
}
