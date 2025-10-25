const { expect } = require("chai");

describe("ProofLens", function () {
  let ProofLens, proofLens, owner, validator1, validator2;  

  beforeEach(async function () {
    [owner, validator1, validator2] = await ethers.getSigners();
    ProofLens = await ethers.getContractFactory("ProofLens");
    proofLens = await ProofLens.deploy();
    await proofLens.deployed();
  });

  it("should submit a proof", async function () {
    await proofLens.connect(owner).submitProof("hash123");
    const proof = await proofLens.proofs(1);
    expect(proof.dataHash).to.equal("hash123");
    expect(proof.device).to.equal(owner.address);
  });

  it("should allow voting on proof", async function () {
    await proofLens.connect(owner).submitProof("hash123");

    await proofLens.connect(validator1).voteOnProof(1, true);
    await proofLens.connect(validator2).voteOnProof(1, false);

    const proof = await proofLens.proofs(1);
    expect(proof.approvals).to.equal(1);
    expect(proof.rejections).to.equal(1);
  });

  it("should finalize proof with majority approval", async function () {
    await proofLens.connect(owner).submitProof("hash123");

    await proofLens.connect(validator1).voteOnProof(1, true);
    await proofLens.connect(validator2).voteOnProof(1, true);

    await proofLens.finalizeProof(1);
    const proof = await proofLens.proofs(1);
    expect(proof.finalized).to.equal(true);
  });
});
