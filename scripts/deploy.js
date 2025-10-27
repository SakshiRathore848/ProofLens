async function main() {
  const ProofLens = await ethers.getContractFactory("ProofLens");
  const proofLens = await ProofLens.deploy();

  await proofLens.deployed();
  console.log("ProofLens deployed to:", proofLens.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => { 
    console.error(error);
    process.exit(1);
  });
