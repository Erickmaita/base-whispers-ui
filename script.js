// Tabs
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(btn=>{
  btn.addEventListener('click',()=>{
    tabs.forEach(b=>b.classList.remove('active'));
    contents.forEach(c=>c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// Counter
const textarea = document.getElementById('message');
const counter = document.getElementById('counter');
if (textarea && counter) {
  textarea.addEventListener('input',()=>{
    counter.textContent = `${textarea.value.length} / 280`;
  });
}

// DEMO SAFE MODE
const sendBtn = document.querySelector('.send-btn');
const addressInput = document.querySelector('input[type="text"]');

function isValidAddress(addr){
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

function showToast(msg){
  let toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = 'linear-gradient(135deg,#00d1ff,#0a5cff)';
  toast.style.color = '#001b2e';
  toast.style.padding = '12px 18px';
  toast.style.borderRadius = '12px';
  toast.style.fontWeight = '600';
  toast.style.boxShadow = '0 10px 30px rgba(0,0,0,.35)';
  toast.style.zIndex = '9999';
  document.body.appendChild(toast);
  setTimeout(()=>toast.remove(), 2400);
}

sendBtn.addEventListener('click',()=>{
  const addr = addressInput.value.trim();
  const msg = textarea.value.trim();

  if(!isValidAddress(addr)){
    showToast('Dirección inválida (demo)');
    return;
  }
  if(msg.length === 0){
    showToast('El mensaje está vacío (demo)');
    return;
  }

  showToast('Susurro preparado (demo)');
});
