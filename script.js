// ===============================
// Tabs
// ===============================
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ===============================
// Counter
// ===============================
const textarea = document.getElementById('message');
const counter = document.getElementById('counter');

if (textarea && counter) {
  textarea.addEventListener('input', () => {
    counter.textContent = `${textarea.value.length} / 280`;
  });
}

// ===============================
// UI Elements
// ===============================
const sendBtn = document.querySelector('.send-btn');
const addressInput = document.querySelector('input[type="text"]');

// ===============================
// Helpers (UI only, no privacy risk)
// ===============================
function isValidAddress(addr) {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

function showToast(msg) {
  const toast = document.createElement('div');
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
  setTimeout(() => toast.remove(), 2400);
}

// ===============================
// Base Whispers – Onchain config
// ===============================
const CONTRACT_ADDRESS = "0x41B61b714a5006FD5c3B03ad8570d33B9135176d";

const ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "recipient", "type": "address" }
    ],
    "name": "sendWhisper",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

const WHISPER_FEE = "0.0001";
const BASE_CHAIN_ID = "0x2105"; // Base mainnet

// ===============================
// Wallet / Onchain logic
// ===============================
async function getSignerSafe() {
  if (!window.ethereum) {
    showToast("Instala MetaMask");
    throw new Error("No wallet");
  }

  const chainId = await ethereum.request({ method: "eth_chainId" });
  if (chainId !== BASE_CHAIN_ID) {
    showToast("Conecta tu wallet a Base");
    throw new Error("Wrong network");
  }

  await ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(window.ethereum);
  return await provider.getSigner();
}

async function sendWhisperOnchain(recipient) {
  try {
    const signer = await getSignerSafe();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const tx = await contract.sendWhisper(recipient, {
      value: ethers.parseEther(WHISPER_FEE)
    });

    await tx.wait();
    showToast("Susurro enviado ✅");
  } catch (e) {
    showToast("Transacción cancelada o fallida");
  }
}

// ===============================
// Button handler (FINAL)
// ===============================
sendBtn.addEventListener('click', async () => {
  const addr = addressInput.value.trim();
  const msg = textarea.value.trim();

  if (!isValidAddress(addr)) {
    showToast("Dirección inválida");
    return;
  }

  if (msg.length === 0) {
    showToast("El mensaje está vacío");
    return;
  }

  showToast("Enviando susurro…");
  await sendWhisperOnchain(addr);
});
