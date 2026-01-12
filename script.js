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

textarea.addEventListener('input', () => {
  counter.textContent = `${textarea.value.length} / 280`;
});

// ===============================
// UI elements
// ===============================
const connectBtn = document.getElementById('connectWallet');
const sendBtn = document.getElementById('sendWhisper');
const addressInput = document.getElementById('recipient');

// ===============================
// Helpers
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
  toast.style.background = '#00d1ff';
  toast.style.color = '#001b2e';
  toast.style.padding = '12px 18px';
  toast.style.borderRadius = '12px';
  toast.style.fontWeight = '600';
  toast.style.zIndex = '9999';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// ===============================
// Onchain config
// ===============================
const CONTRACT_ADDRESS = "0x41B61b714a5006FD5c3B03ad8570d33B9135176d";
const WHISPER_FEE = "0.0001";
const BASE_CHAIN_ID = 8453n;

const ABI = [
  {
    "inputs":[{"internalType":"address","name":"recipient","type":"address"}],
    "name":"sendWhisper",
    "outputs":[],
    "stateMutability":"payable",
    "type":"function"
  }
];

let provider;
let signer;
let contract;

// ===============================
// Connect wallet (CLARO Y EXPLÍCITO)
// ===============================
connectBtn.onclick = async () => {
  if (!window.ethereum) {
    showToast("Instala MetaMask");
    return;
  }

  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();

  const network = await provider.getNetwork();
  if (network.chainId !== BASE_CHAIN_ID) {
    showToast("Cambia tu red a Base");
    return;
  }

  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  showToast("Wallet conectada ✅");
};

// ===============================
// Send whisper
// ===============================
sendBtn.onclick = async () => {
  if (!contract) {
    showToast("Conecta tu wallet primero");
    return;
  }

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

  try {
    const tx = await contract.sendWhisper(addr, {
      value: ethers.parseEther(WHISPER_FEE)
    });
    await tx.wait();
    showToast("Susurro enviado ✅");
  } catch (e) {
    showToast("Transacción cancelada");
  }
};
