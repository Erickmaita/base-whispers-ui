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
// Config
// ===============================
const CONTRACT_ADDRESS = "0x41B61b714a5006FD5c3B03ad8570d33B9135176d";
const WHISPER_FEE = "0.0001";
const BASE_CHAIN_ID = "0x2105";

const ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }],
    "name": "sendWhisper",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

// ===============================
// Elements
// ===============================
const connectBtn = document.getElementById('connectWallet');
const sendBtn = document.getElementById('sendWhisper');
const recipientInput = document.getElementById('recipient');

let signer;
let userAddress;

// ===============================
// Wallet connect (SAFE)
// ===============================
async function connectWallet() {
  if (!window.ethereum) {
    alert("Instala MetaMask para continuar");
    return;
  }

  const currentChain = await ethereum.request({ method: "eth_chainId" });

  if (currentChain !== BASE_CHAIN_ID) {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BASE_CHAIN_ID }]
      });
    } catch (e) {
      alert("Debes cambiar a Base para usar esta app");
      return;
    }
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  userAddress = await signer.getAddress();

  connectBtn.textContent = `Wallet: ${userAddress.slice(0,6)}…${userAddress.slice(-4)}`;
  connectBtn.classList.add('connected');
  connectBtn.disabled = true;
}

// ===============================
// Send whisper (SAFE)
// ===============================
async function sendWhisper() {
  if (!signer) {
    alert("Conecta tu wallet primero");
    return;
  }

  const recipient = recipientInput.value.trim();
  const message = textarea.value.trim();

  if (!ethers.isAddress(recipient)) {
    alert("Dirección inválida");
    return;
  }

  if (message.length === 0) {
    alert("El mensaje está vacío");
    return;
  }

  const ok = confirm(
    `Enviar susurro\n\nFee: ${WHISPER_FEE} ETH\nDestino: ${recipient.slice(0,6)}…${recipient.slice(-4)}`
  );

  if (!ok) return;

  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const tx = await contract.sendWhisper(recipient, {
      value: ethers.parseEther(WHISPER_FEE)
    });
    await tx.wait();
    alert("Susurro enviado ✅");
    textarea.value = "";
    counter.textContent = "0 / 280";
  } catch (e) {
    alert("Transacción cancelada o fallida");
  }
}

// ===============================
// Events
// ===============================
connectBtn.addEventListener('click', connectWallet);
sendBtn.addEventListener('click', sendWhisper);
