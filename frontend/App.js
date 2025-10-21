// Connect to Ethereum provider 
let contract;
let signer;
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const contractABI = [
  "function submitProof(string memory _dataHash) external",
  "function voteOnProof(uint256 _proofId, bool _approve) external", 
  "function finalizeProof(uint256 _proofId) external",
];

async function init() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    setStatus("Connected to MetaMask!");
  } else {
    setStatus("Please install MetaMask!");
  }
}

async function submitProof() {
  const dataHash = document.getElementById("dataHash").value;
  try {
    const tx = await contract.submitProof(dataHash);
    await tx.wait();
    setStatus("Proof submitted!");
  } catch (err) {
    setStatus("Error: " + err.message);
  }
}

async function voteProof(approve) {
  const proofId = document.getElementById("proofIdVote").value;
  try {
    const tx = await contract.voteOnProof(proofId, approve);
    await tx.wait();
    setStatus("Vote submitted!");
  } catch (err) {
    setStatus("Error: " + err.message);
  }
}

async function finalizeProof() {
  const proofId = document.getElementById("proofIdFinalize").value;
  try {
    const tx = await contract.finalizeProof(proofId);
    await tx.wait();
    setStatus("Proof finalized!");
  } catch (err) {
    setStatus("Error: " + err.message);
  }
}

function setStatus(message) {
  document.getElementById("status").innerText = message;
} 

init();
