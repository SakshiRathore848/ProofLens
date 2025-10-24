// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.20;

/**
 * @title ProofLens: A Lightweight Consensus Mechanism for IoT Devices
 * @notice This contract simulates a lightweight consensus system where IoT devices 
 *         can submit proofs, and validators approve/reject them to reach consensus.
 */
contract ProofLens {
    struct Proof {
        address device;
        string dataHash;
        uint256 approvals;
        uint256 rejections;
        bool finalized;
    }

    mapping(uint256 => Proof) public proofs;
    uint256 public proofCount;

    event ProofSubmitted(uint256 indexed proofId, address indexed device, string dataHash);
    event ProofVoted(uint256 indexed proofId, address indexed validator, bool approved);
    event ProofFinalized(uint256 indexed proofId, bool approved);

    /**
     * @notice Submit a new IoT proof
     * @param _dataHash Hash of the IoT data
     */
    function submitProof(string memory _dataHash) external {
        proofCount++;
        proofs[proofCount] = Proof(msg.sender, _dataHash, 0, 0, false);
        emit ProofSubmitted(proofCount, msg.sender, _dataHash);
    }

    /**
     * @notice Validators vote on a submitted proof
     * @param _proofId ID of the proof
     * @param _approve True = approve, False = reject
     */
    function voteOnProof(uint256 _proofId, bool _approve) external {
        Proof storage proof = proofs[_proofId];
        require(!proof.finalized, "Proof already finalized");

        if (_approve) {
            proof.approvals++;
        } else {
            proof.rejections++;
        }

        emit ProofVoted(_proofId, msg.sender, _approve);
    }

    /**
     * @notice Finalize the proof consensus (simple majority)
     * @param _proofId ID of the proof
     */
    function finalizeProof(uint256 _proofId) external {
        Proof storage proof = proofs[_proofId];
        require(!proof.finalized, "Already finalized");

        proof.finalized = true;
        bool approved = proof.approvals > proof.rejections;

        emit ProofFinalized(_proofId, approved);
    }
}
