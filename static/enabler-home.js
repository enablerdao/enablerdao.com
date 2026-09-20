const o=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('v');o.unobserve(e.target)}})},{threshold:.15});document.querySelectorAll('.f').forEach(el=>o.observe(el));

document.getElementById('waitlist-form').addEventListener('submit',async e=>{
  e.preventDefault();
  const email=document.getElementById('waitlist-email').value;
  const msg=document.getElementById('waitlist-msg');
  const btn=e.target.querySelector('button');
  const en=document.documentElement?.lang==='en';
  btn.textContent=en?'Sending…':'送信中...';btn.disabled=true;
  try{
    const r=await fetch('https://kacha-server.fly.dev/api/v1/waitlist',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email})
    });
    const d=await r.json();
    if(!r.ok || !d.success)throw new Error('Subscription was not accepted');
    msg.textContent=en?'Thank you. You are on the list.':'ご登録ありがとうございます。';msg.style.color='#E8A838';
    document.getElementById('waitlist-email').value='';
    btn.textContent='✓';
  }catch{
    msg.textContent=en?'We could not subscribe you. Please try again.':'通信エラー。もう一度お試しください。';msg.style.color='#FF6B6B';
    btn.textContent=en?'Subscribe':'参加する';btn.disabled=false;
  }
});
