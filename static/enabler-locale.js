// Explicit ja/en selection; Japanese remains the default.
(() => {
  const url=new URL(location.href), requested=url.searchParams.get('lang');
  let saved;try{saved=localStorage.getItem('enabler_lang')}catch(_){/* URL works without storage. */}
  const lang=['ja','en'].includes(requested)?requested:saved==='en'?'en':'ja';
  try{localStorage.setItem('enabler_lang',lang)}catch(_){/* URL works without storage. */}
  document.documentElement.lang=lang;
  const D={
    'Enabler — テクノロジーで、人生をもっと自由に':'Enabler — Technology for a freer life',
    'コンテンツへスキップ':'Skip to content', '熱海のヴィラ':'Villa in Atami', 'テクノロジーで、':'Technology for', '人生をもっと自由に。':'a freer life.',
    '9プロダクト稼働中 — App Storeで公開・実運用中':'Nine products in operation — App Store releases and live services',
    'スマートホーム、音声入力、レシートAI、バケーションレンタル。':'Smart homes, voice input, receipt AI and vacation rentals.',
    'ローカルファースト × オープンソース志向の実プロダクト群を、株式会社イネブラが開発・運営。':'Enabler Inc. builds and operates local-first products with an open-source approach.',
    'プロダクトを見る':'Explore products', '会社情報 →':'About the company →', 'ENAI Token (研究中・未発売)':'ENAI Token (research stage; not released)', 'ENAI トークン構想。':'The ENAI token concept.',
    'Solana 上のユーティリティトークン構想を研究中。法令対応の確認後にリリースを判断します。':'We are researching a utility token on Solana. A release decision will follow a review of applicable legal requirements.',
    '※ 現在 ENAI は販売・流通しておらず、保有による割引・特典の提供は行っていません。':'ENAI is not currently sold or circulated. Holding it provides no discounts or benefits.',
    '総供給量':'Total supply', 'ブロックチェーン':'Blockchain', '対応プロダクト':'Related products', 'Raydium で確認':'View on Raydium', 'Solscan で確認 →':'View on Solscan →', '対応予定プロダクト':'Planned product connections',
    'スマートホーム':'Smart home', 'パシャ':'Pasha', 'レシート AI':'Receipt AI', '音声認識':'Speech recognition', 'P2P 推論':'P2P inference', '柔術技術 DB':'Jiu-jitsu technique database', '宿泊管理':'Property management', 'AI チャット':'AI chat',
    '※ ENAI トークンは現在':'The ENAI token is currently', '販売・流通していません':'not sold or circulated', '。本マップに記載のアンロック・割引・特典は':'The unlocks, discounts and benefits described in this concept are', '提供していません':'not available', '。各プロダクトは通常の Stripe 月額課金で利用できます。':'Products use their regular Stripe subscription plans.',
    'トークン発行については日本の関連法令（資金決済法・金融商品取引法・景品表示法）に基づく事前確認後に判断します。':'Any token issuance will be considered after reviewing applicable Japanese payment, financial-instrument and advertising laws.',
    '※ ENAI はユーティリティトークンです。投資商品ではなく、価値の保証はありません。利用マップは実装予定を含みます。Mint: 8CeusiVAeibuBGv5xcf7kt7JQZzqwTS5pD7u2CfyoWnL':'ENAI is a utility-token concept, not an investment product or a guarantee of value. The map includes planned features. Mint: 8CeusiVAeibuBGv5xcf7kt7JQZzqwTS5pD7u2CfyoWnL',
    '効率化。自動化。自律。':'Efficiency. Automation. Autonomy.', 'AIで作り、AIでテストし、AIで磨く。':'Build, test and refine with AI.', 'みんなで作る。みんなで使う。':'Built together. Used together.',
    'Airbnb/Beds24連携。ゲストの鍵を自動管理。':'Airbnb / Beds24 integration for automated guest-key management.', 'SwitchBot · Sesame · Hue · E2E暗号化シェア':'SwitchBot · Sesame · Hue · End-to-end encrypted sharing',
    'SwitchBot / Sesame / Philips Hue / Nuki / Nature Remo対応':'Supports SwitchBot, Sesame, Philips Hue, Nuki and Nature Remo', 'Beds24実データ44件の予約同期確認済み · 7物件対応 · 20テスト全通過':'44 Beds24 reservations verified in sync · Seven properties · 20 tests passed',
    'レシートを撮るだけ。AIが自動で仕分け。':'Photograph a receipt. AI categorizes it.', '電子帳簿保存法対応 · インボイス制度対応 · 確定申告連携':'Japanese electronic-record and invoice support · Tax-filing integration', '電子帳簿保存法全8要件対応 · 40+チェーン店自動認識':'Supports eight Japanese electronic-record requirements · Recognizes 40+ retail chains', 'パシャ app':'Pasha app',
    '声で、すべてを動かす。':'Move things forward with your voice.', '音声入力 · ローカルWhisper / Local dictation':'Voice input · Local Whisper dictation', '話した言葉をテキストに。Mac・Windowsの音声入力アプリと、ブラウザで声を登録する入口をご案内します。':'Turn spoken words into text. Download dictation apps for Mac and Windows, or register your voice in a browser.', 'Mac版 / PKG':'Mac / PKG', 'Windows版 / EXE':'Windows / EXE', 'iPhoneで声を登録 / Web':'Register your voice on iPhone / Web',
    'Mac v2.11.0 / Windows v2.10.0。iPhoneのリンクはブラウザの声登録画面です（iOSアプリのダウンロードではありません）。':'Mac v2.11.0 / Windows v2.10.0. The iPhone link is web voice registration, not an iOS app download.', '音声AIデバイスも開発中':'Voice-AI hardware is also in development',
    'ローカルLLM。あなたのiPhoneで動くAI。':'A local LLM. AI running on your iPhone.', 'App Storeで配布中。':'Available on the App Store.', '新しいマルチエージェント型に進化中。':'Evolving toward a multi-agent architecture.', 'もうすぐ、もっと速く、もっと賢く。':'Working toward faster, smarter assistance.', 'P2P分散推論 · プライバシーフィルター · オンデバイスAI':'P2P distributed inference · Privacy filter · On-device AI',
    '俺が作る、君が使う':'I build it. You use it.', 'ホノルルのビーチハウス':'Beach house in Honolulu', '群衆が楽器になる夜。':'A night when the crowd becomes the instrument.', 'Koeデバイス × SOLUNAプロトコル × あなたのスマホ。':'Koe devices × SOLUNA protocol × your phone.', 'チケット先行販売中 →':'Advance tickets →',
    'Enabler の事業領域':'Where Enabler works', 'テクノロジーが届く、すべての領域へ。':'Wherever technology can make a difference.', '暮らし':'Living', 'スマートホーム管理':'Smart-home management', 'お金':'Finance', '経費・請求・確定申告':'Expenses, invoices and tax filing', 'パシャ →':'Pasha →', '自律型エージェント':'Autonomous agents', '健康・運動':'Health and movement', '安全で強い柔術':'Safer, stronger jiu-jitsu', '音楽・建築':'Music and architecture', '空間と音の融合':'Bringing space and sound together', '宿泊・不動産':'Stays and property', 'バケーションレンタル管理':'Vacation-rental management',
    '全プロダクト一覧':'Explore all products', '音声入力':'Voice input', '音と光の同期':'Synchronized sound and light', '柔術テクニック':'Jiu-jitsu techniques', '分散AI':'Distributed AI', '事業管理':'Business management', 'バケーションレンタル':'Vacation rentals',
    '使う人が、所有する。':'Owned by the people who use it.', '使う人が、決める。':'Shaped by the people who use it.', '使う人が、利益を得る。':'Value returned to the people who use it.', 'オープンソース':'Open source', 'ローカルファースト':'Local first', 'ユーザー所有':'User ownership', 'ローカルAIは無料。サーバーAIは超高速。':'Free local AI. Fast server-side AI.', '将来的には、使う人に利益が還元される仕組みを目指しています。':'We aim to build a system that returns value to its users.',
    '弟子屈の風景':'Landscape in Teshikaga', 'ENAI を持って、Enabler を解禁する。':'The ENAI and Enabler concept', 'ENAI を購入 (Raydium)':'ENAI on Raydium', 'パシャを試す':'Try Pasha', 'ポン':'Pon', 'メールで最新情報を受け取る':'Get updates by email', 'メールアドレス / Email':'Email address', '参加する':'Subscribe', 'チャリン':'Charin', 'サクッ':'Sakutsu',
  };
  if(lang==='en') {
    const translate=s=>{const k=s.replace(/\s+/g,' ').trim();return D[k]?s.replace(s.trim(),D[k]):s};
    const walker=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT);const nodes=[];
    while(walker.nextNode())if(!walker.currentNode.parentElement.closest('script,style'))nodes.push(walker.currentNode);
    nodes.forEach(n=>{n.data=translate(n.data)});
    document.querySelectorAll('[alt],[aria-label],[placeholder]').forEach(e=>{for(const a of ['alt','aria-label','placeholder'])if(e.hasAttribute(a))e.setAttribute(a,translate(e.getAttribute(a)))});
    const desc='Official products and downloads from Enabler Inc.: voice input, smart homes, receipt AI, electronic signatures and property management.';
    document.querySelectorAll('meta[name=description],meta[property="og:description"],meta[name="twitter:description"]').forEach(e=>e.content=desc);
    document.querySelectorAll('meta[property="og:title"],meta[name="twitter:title"]').forEach(e=>e.content=document.title);
    document.querySelector('meta[property="og:locale"]').content='en_US';
  }
  document.querySelector('link[rel=canonical]').href='https://enablerdao.com/?lang='+lang;
  const nav=document.createElement('nav');nav.className='language-switch';nav.setAttribute('aria-label','Language / 言語');
  for(const [code,label] of [['ja','日本語'],['en','English']]){const a=document.createElement('a'),u=new URL(location.href);u.searchParams.set('lang',code);a.href=u.href;a.hreflang=code;a.textContent=label;if(code===lang)a.setAttribute('aria-current','true');nav.append(a)}
  document.body.prepend(nav);
  for(const code of ['ja','en']){const l=document.createElement('link');l.rel='alternate';l.hreflang=code;l.href='https://enablerdao.com/?lang='+code;document.head.append(l)}
  const email=document.getElementById('waitlist-email');
  email.addEventListener('invalid',()=>{if(lang==='en')email.setCustomValidity(email.validity.valueMissing?'Enter your email address.':'Enter a valid email address.')});
  email.addEventListener('input',()=>email.setCustomValidity(''));
  document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||a.closest('.language-switch'))return;const u=new URL(a.href,location.href);if(u.protocol.startsWith('http')&&(u.origin===location.origin||u.hostname==='enablerhq.com')){u.searchParams.set('lang',lang);a.href=u.href}},true);
})();
