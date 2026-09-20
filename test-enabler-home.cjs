const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const script=fs.readFileSync('static/enabler-home.js','utf8');
for(const lang of ['ja','en'])for(const scenario of ['success','http-error','application-error','network-error'])test(`newsletter ${lang} ${scenario}`,async()=>{
 let submit;
 const button={textContent:'参加する',disabled:false};
 const email={value:'test@example.invalid'};
 const msg={textContent:'',style:{}};
 const form={addEventListener:(event,fn)=>{assert.equal(event,'submit');submit=fn;}};
 const context={IntersectionObserver:class{observe(){}},document:{documentElement:{lang},querySelectorAll:()=>[],getElementById:id=>({'waitlist-form':form,'waitlist-email':email,'waitlist-msg':msg}[id])},fetch:async()=>{
  if(scenario==='network-error')throw new Error('offline');
  return {ok:scenario!=='http-error',json:async()=>({success:scenario==='success'||scenario==='http-error',message:'日本語のバックエンド応答'})};
 }};
 vm.runInNewContext(script,context);
 await submit({preventDefault(){},target:{querySelector:()=>button}});
  if(scenario==='success'){assert.equal(button.textContent,'✓');assert.equal(email.value,'');if(lang==='en')assert.match(msg.textContent,/Thank you/);}
 else{assert.equal(button.disabled,false);assert.equal(email.value,'test@example.invalid');assert.match(msg.textContent,lang==='en'?/could not subscribe/:/通信エラー/);assert.notEqual(button.textContent,'✓');}
});
