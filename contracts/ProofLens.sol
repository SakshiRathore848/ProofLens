// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProofLens {
    // Structure to store proof details
    struct Proof {
        address submitter;
        uint256 timestamp;
        string description;
    }

    // Mapping of proof hash to proof details
    mapping(bytes32 => Proof) private proofs;

    // Event emitted when a new proof is added
    event ProofAdded(bytes32 indexed proofHash, address indexed submitter, uint256 timestamp, string description);

    // Function to submit a new proof
    function submitProof(bytes32 proofHash, string memory description) external {
        require(proofHash != bytes32(0), "Invalid proof hash");
        require(proofs[proofHash].timestamp == 0, "Proof already exists");

        proofs[proofHash] = Proof({
            submitter: msg.sender,
            timestamp: block.timestamp,
            description: description
        });

        emit ProofAdded(proofHash, msg.sender, block.timestamp, description);
    }

    // Function to verify if a proof exists
    function verifyProof(bytes32 proofHash) external view returns (bool exists, address submitter, uint256 timestamp, string memory description) {
        Proof memory proof = proofs[proofHash];
        if (proof.timestamp != 0) {
            return (true, proof.submitter, proof.timestamp, proof.description);
        } else {
            return (false, address(0), 0, "");
        }
    }
}
