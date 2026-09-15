// Import only approved customer-facing assets; never copy the source kit wholesale.
// PLAYWRIGHT_MODULE=/path/to/playwright node scripts/import-portfolio.cjs /path/to/kit
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const source = path.resolve(process.argv[2]);
const output = path.join(root, 'static', 'portfolio');
const assets = ['portfolio-polish.css', 'media/hook.mp3', 'media/ai-reply.mp3',
  ...['teai','sente','koe','mu','bim','news','jiuflow','stayflow'].map(id=>`media/portfolio-${id}.png`)];
const base = '/static/portfolio/';
(async()=>{
  fs.mkdirSync(output, {recursive:true});
  for (const asset of assets) {
    fs.mkdirSync(path.dirname(path.join(output, asset)), {recursive:true});
    fs.copyFileSync(path.join(source, asset), path.join(output, asset));
  }
  const browser = await chromium.launch({channel:'chrome',headless:true});
  try {
    const page = await browser.newPage();
    await page.goto('file://' + path.join(source, 'portfolio.html'));
    await page.evaluate(({base, assets})=>{
      document.querySelector('meta[name="robots"]').remove();
      const metadata = [
        ['name','description','声、仕事、創作、学び、滞在。イネブラの6製品と関連プロジェクト、2026年11月13日のZAMNA HAWAIIをご紹介。'],
        ['property','og:title','AIの次の画面は、現実だ。｜enabler.'],
        ['property','og:description','やってみたい、から選ぶ。イネブラのプロダクトと、ハワイで出会う音楽の体験。'],
        ['property','og:url','https://enablerdao.com/products'],
        ['property','og:type','website'],
        ['name','twitter:card','summary_large_image'],
        ['property','og:image','https://enablerdao.com/static/portfolio/share.png'],
      ];
      for(const [key,name,content] of metadata){const m=document.createElement('meta');m.setAttribute(key,name);m.content=content;document.head.append(m);}
      const canonical=document.createElement('link');canonical.rel='canonical';canonical.href='https://enablerdao.com/products';document.head.append(canonical);
      const icon=document.createElement('link');icon.rel='icon';icon.href='/static/favicon.svg';document.head.append(icon);
      document.querySelector('.footer-bottom span:nth-child(2)').textContent='2026.09';
      document.querySelectorAll('.catalog-item').forEach(item=>{
        const details=item.querySelector('.item-limit');details.id='availability-'+item.id.slice(8);
        item.querySelectorAll('.catalog-links').forEach(e=>e.remove());
        const action=item.querySelector('.catalog-action');
        if(!/^https:/.test(action.getAttribute('href'))){action.href='#'+details.id;action.removeAttribute('target');action.textContent='提供状況を見る →';}
      });
      const scope=document.querySelector('.all-catalog > details');
      scope.innerHTML='<summary>掲載範囲について</summary><p>公開製品に加え、派生サービス・共同活動・開発中のアプリ・研究構想・関連サイトを含みます。61項目すべてが独立した提供中の製品という意味ではありません。各項目の提供状況をご確認ください。</p>';
      document.querySelectorAll('[href],[src]').forEach(el=>{
        for(const attr of ['href','src']){
          const value=el.getAttribute(attr);if(!value)continue;
          if(assets.includes(value))el.setAttribute(attr,base+value);
          else if(value==='PORTFOLIO-RELEASE.pdf')el.setAttribute(attr,base+'portfolio.pdf');
          else if(value==='press-preview.html')el.setAttribute(attr,'/press');
        }
      });
    },{base,assets});
    fs.writeFileSync(path.join(root,'static/products.html'),await page.content());
    const press=`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>メディア向け資料｜株式会社イネブラ</title><meta name="description" content="イネブラの製品紹介・画面・音声素材と取材窓口。"><link rel="canonical" href="https://enablerdao.com/press"><link rel="stylesheet" href="${base}portfolio-polish.css"><link rel="icon" href="/static/favicon.svg"></head><body class="press-document"><main><a href="/products">← 製品一覧へ</a><h1>思いを、動くものに。</h1><p>株式会社イネブラは、仕事・声・創作・学び・滞在の領域で製品と取り組みを展開しています。</p><h2>取材テーマ</h2><ul><li>teai・先手：AIとの会話を、開発や仕事の成果物へ。</li><li>KOE・MU：声や服のアイデアを、言葉から形に。</li><li>JiuFlow・StayFlow：学びや滞在を通じた、人と人のつながり。</li></ul><h2>ZAMNA HAWAII / 2026.11.13</h2><p>Zamna公式はSoluna Productionとの協働によるハワイ開催を案内しています。</p><p><a href="https://solun.art/zamna">SOLUNAのフェス案内</a> · <a href="https://zamnafestival.com/events/zamna-hawaii">Zamna公式</a></p><h2>紹介資料と素材</h2><div class="material-links"><a href="${base}portfolio.pdf">製品紹介 PDF</a><a href="/products#products">公開画面一覧</a><a href="${base}media/hook.mp3">KOE合成音声：冒頭</a><a href="${base}media/ai-reply.mp3">teaiのお礼文 × KOE</a></div><p>音声は濱田優貴の登録済み公開サンプル声による合成です。画面は2026年9月15日に取得。料金・提供条件は各サービスの公式案内をご確認ください。</p><h2>取材・素材利用のご相談</h2><p>取材テーマ、希望日時、利用したい素材を添えてご連絡ください。</p><p><a href="mailto:yuki@enablerdao.com">yuki@enablerdao.com</a> · <a href="https://twitter.com/yukihamada">X / @yukihamada</a></p><p>株式会社イネブラ</p></main></body></html>`;
    fs.writeFileSync(path.join(root,'static/press.html'),press);
    console.log('Imported public HTML and',assets.length,'allowlisted assets');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
