// Local public preview + publication artifact generation, or production smoke check.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..');
const live=process.argv[2];
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.png':'image/png','.mp3':'audio/mpeg','.pdf':'application/pdf','.svg':'image/svg+xml'};
(async()=>{
 let server;
 if(!live){server=http.createServer((req,res)=>{const p=new URL(req.url,'http://localhost').pathname;const relative=p==='/products'?'static/products.html':p==='/press'?'static/press.html':p.slice(1);const file=path.resolve(root,relative);if(!file.startsWith(root+'/static/')||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);});await new Promise(r=>server.listen(0,'127.0.0.1',r));}
 const origin=live||`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-proxy-server']});
 const errors=[];
 try{
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(origin+'/products');assert.equal(response.status(),200);
  if(live)assert.equal(await response.text(),fs.readFileSync(path.join(root,'static/products.html'),'utf8'));
  assert.equal(await page.locator('.featured-card').count(),6);assert.equal(await page.locator('.catalog-item').count(),61);
  assert.equal(await page.locator('meta[name="robots"][content="noindex"]').count(),0);
  assert.equal(await page.locator('#zamna-hawaii time').getAttribute('datetime'),'2026-11-13');
  assert.equal(await page.locator('.catalog-proof').count(),0);
  assert.ok(!/file:\/\/|\/Users\/|tier-records|evidence\/|ローカルプレビュー|配信前/.test(await page.content()));
  await page.locator('img').evaluateAll(es=>{es.forEach(e=>e.loading='eager');return Promise.all(es.map(e=>e.decode()));});
  for(const width of [1440,768,390,320]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.ok(await page.locator('.festival-grid>div,.feature-copy').evaluateAll(es=>es.every(e=>e.scrollWidth<=e.clientWidth)));}
  await page.locator('.event-teaser').click();assert.equal(await page.evaluate(()=>location.hash),'#zamna-hawaii');
  await page.locator('#catalog-search').fill('ＺＡＭＮＡ');assert.equal(await page.locator('.catalog-item:visible').count(),1);assert.ok(await page.locator('#product-soluna').isVisible());
  await page.locator('#catalog-reset').click();
  await page.locator('#product-banto .catalog-action').click();assert.ok(await page.locator('#availability-banto').evaluate(e=>e.open));
  for(const [tier,count] of [['signature',6],['next',17],['lab',20],['connections',18]]){await page.locator('#catalog-tier').selectOption(tier);assert.equal(await page.locator('.catalog-item:visible').count(),count);}
  await page.locator('#catalog-reset').click();
  await page.locator('#hook').evaluate(e=>e.play());await page.waitForFunction(()=>document.querySelector('#hook').currentTime>.1);
  await page.locator('#reply').evaluate(e=>e.play());await page.waitForFunction(()=>document.querySelector('#reply').currentTime>.1);assert.ok(await page.locator('#hook').evaluate(e=>e.paused));await page.locator('#reply').evaluate(e=>e.pause());
  if(!live){
   await page.locator('.item-limit').evaluateAll(es=>es.forEach(e=>e.open=true));
   await page.emulateMedia({media:'print'});await page.pdf({path:path.join(root,'static/portfolio/portfolio.pdf'),format:'A4',printBackground:true,margin:{top:'12mm',bottom:'12mm',left:'12mm',right:'12mm'}});
   await page.emulateMedia({media:'screen'});
   const share=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
   await share.setContent('<html lang="ja"><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:#f6f4ed;color:#192620;font-family:system-ui;padding:64px}b{font-size:28px}h1{font-size:84px;letter-spacing:-5px;line-height:1.2;margin:46px 0 30px}em{font-style:normal;background:#d7fd74}p{font-size:22px}.date{font-size:18px;margin-top:36px;border-top:1px solid #bbc5b8;padding-top:24px}</style><b>enabler.</b><h1>AIの次の画面は、<br><em>現実だ。</em></h1><p>仕事・声・創作・学び・滞在。やりたいことから、次の一歩へ。</p><div class="date">ZAMNA HAWAII　2026.11.13</div></html>');
   await share.screenshot({path:path.join(root,'static/portfolio/share.png')});await share.close();
  }
  for(const route of ['/products','/press']){
   await page.goto(origin+route);
   const refs=await page.locator('[href],[src]').evaluateAll(es=>es.flatMap(e=>['href','src'].map(a=>e.getAttribute(a)).filter(Boolean)));
   for(const ref of new Set(refs)){
    if(ref.startsWith('#')){assert.equal(await page.locator(ref).count(),1,ref);continue;}
    assert.ok(/^(https?:|mailto:|\/)/.test(ref),'unexpected local link '+ref);
    if(ref.startsWith('/')){const r=await page.request.get(origin+ref);assert.equal(r.status(),200,ref);}
   }
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({origin,products:6,catalog:61,festival:'2026-11-13',viewports:[1440,768,390,320],images:14,audio:'passed',links:'passed',pdf:'passed',local_records_removed:true,production_html_matches:!!live,errors,visual_review:'unverified'},null,2));
 }finally{await browser.close();if(server)await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
