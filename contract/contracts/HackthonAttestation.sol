// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/AccessControl.sol";
import { IAttestationStation } from "./utils/IAttestationStation.sol";

// interface IAttestationStation {
//     function attest(AttestationStation.AttestationData[] memory _attestations) external;
// }

contract HackathonAttestation is AccessControl {
    IAttestationStation public attestationStation;
    address payable public receiver;

    bytes32 public constant ETH_GLOBAL_ROLE = keccak256("ETH_GLOBAL_ROLE");
    bytes32 public constant PROJECT_MANAGER_ROLE = keccak256("PROJECT_MANAGER_ROLE");

    enum ProjectStatus {UnCreated,Open, Eligible,  Vote, Close}
    enum VotingStatus {NotStarted,For, Against }

    struct Project {
        address owner;
        string projectName;
        string projectURL;
        string projectTarget;
        ProjectStatus projectStatus;
        VotingStatus votingStatus;
        uint256 lastStatusUpdateTime;
    }

    struct AttestationData {
        address about;
        bytes32 key;
        bytes val;
    }

    mapping(bytes32 => Project) public projects;
    mapping(address => mapping(bytes32 => uint256)) public donations;
    mapping(bytes32 => uint256) public donationForProject;
    mapping(bytes32 => address) public donationReciever;

    // Initialize the contract with an attestation station address and a receiver address
    constructor(address _attestationStationAddress, address payable _receiverAddress) {
        attestationStation = IAttestationStation(_attestationStationAddress);
        receiver = _receiverAddress;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ETH_GLOBAL_ROLE, msg.sender);
        _setupRole(PROJECT_MANAGER_ROLE, msg.sender);
    }

    // Attest the eligibility of a project
    function attestEligibleProject(AttestationData memory _attestation) public onlyRole(ETH_GLOBAL_ROLE) {
        require(msg.sender == _attestation.about, "attestation_about is not msg.sender");
        IAttestationStation.AttestationData[] memory attestations = new IAttestationStation.AttestationData[](1);
        attestations[0] = IAttestationStation.AttestationData(_attestation.about, _attestation.key, _attestation.val);
        attestationStation.attest(attestations);
        projects[_attestation.key].projectStatus = ProjectStatus.Eligible;
    }

    // Donate to a project with attestation
    function donateWithAttest(AttestationData memory _attestation) public payable {
        require(projects[_attestation.key].projectStatus == ProjectStatus.Eligible, "Project is not Eligible");
        uint256 val = abi.decode(_attestation.val, (uint256));
        require(msg.value == val, "Donation amount does not match attestation value");
        IAttestationStation.AttestationData[] memory attestations = new IAttestationStation.AttestationData[](1);
        attestations[0] = IAttestationStation.AttestationData(_attestation.about, _attestation.key, _attestation.val);
        attestationStation.attest(attestations);
        
        if (msg.value > 0) {
            receiver.transfer(msg.value);
            donations[msg.sender][_attestation.key] = msg.value;
            donationForProject[_attestation.key] += msg.value;
        }
    } 

    // this is gnosis safe address
    // Set the receiver address for donations
    function setReceiver(address payable _receiverAddress) external onlyRole(ETH_GLOBAL_ROLE) {
        require(_receiverAddress != address(0), "Invalid receiver address");
        receiver = _receiverAddress;
    }
    // This is executed by project manager after hackathon
    // Create a new project
    function createProject(bytes32 _projectId, string memory _projectName, string memory _projectURL, string memory _projectTarget) external onlyRole(PROJECT_MANAGER_ROLE) {
        // TODO 
        // fix eligibility adderss(this) -> eth global sender)
        // fix msg.sender -> project manager
        // bytes memory eligible = attestationStation.attestations(address(this), msg.sender, _projectId);
        require(projects[_projectId].projectStatus == ProjectStatus.UnCreated, "Project already exists");
        projects[_projectId] = Project(msg.sender,_projectName, _projectURL, _projectTarget, ProjectStatus.Open, VotingStatus.NotStarted, block.timestamp);
        donationReciever[_projectId] = msg.sender;
        projects[_projectId].projectStatus = ProjectStatus.Open;
    }

    // Check the status of a project
    function checkProjectStatus(bytes32 _projectId) external view returns (ProjectStatus) {
        return projects[_projectId].projectStatus;
    }

    // Update the status of a project
    function updateProjectStatus(bytes32 _projectId, ProjectStatus _projectStatus) external onlyRole(PROJECT_MANAGER_ROLE) {
        // require(projects[_projectId].projectStatus != ProjectStatus.UnCreated, "Project does not exist");
        require(projects[_projectId].projectStatus != ProjectStatus.Close, "Project is closed");
        projects[_projectId].projectStatus = _projectStatus;
        projects[_projectId].lastStatusUpdateTime = block.timestamp;
    }

    // Check the voting status of a project
    function checkVotingStatus(bytes32 _projectId) external view returns (VotingStatus) {
        return projects[_projectId].votingStatus;
    }
    
    // Update the voting status of a project
    function updateVotingStatus(bytes32 _projectId, VotingStatus _votingStatus) external onlyRole(PROJECT_MANAGER_ROLE){
        require(projects[_projectId].projectStatus == ProjectStatus.Vote, "Project is not in voting status");
        require(projects[_projectId].votingStatus != _votingStatus, "Voting status is already set to the same value");
        projects[_projectId].votingStatus = _votingStatus;
    }

    // Get the donation amount for a specific project
    function getDonationAmount(bytes32 _projectId) external view returns (uint256) {
        return donations[msg.sender][_projectId];
    }

    // Get the total donation amount for a specific project
    function getAllDonationAmount(bytes32 _projectId) external view returns (uint256) {
        return donationForProject[_projectId];
    }

    // Withdraw donation from a closed project with voting status against (executed by donor)
    function withdrawDonation(bytes32 _projectId) external {
        require(projects[_projectId].projectStatus == ProjectStatus.Close, "Project does not closed");
        require(projects[_projectId].votingStatus == VotingStatus.Against, "Project voting status is not against");
        uint256 depositAmount = donations[msg.sender][_projectId];
        require(depositAmount > 0, "No deposit found for the specified project");
        donations[msg.sender][_projectId] = 0;
        payable(msg.sender).transfer(depositAmount);
    }
    
    /// Withdraw donation from a closed project with voting status for, by project owner
    function withdrawDonationByOwner(bytes32 _projectId) external {
        require(projects[_projectId].projectStatus == ProjectStatus.Close, "Project does not closed");
        require(projects[_projectId].votingStatus == VotingStatus.For, "Project voting status is not for");
        uint256 donationAmount = donationForProject[_projectId];
        require(donationAmount > 0, "No donation found for the specified project");
        donationForProject[_projectId] = 0;
        address projectowner = donationReciever[_projectId];
        payable(projectowner).transfer(donationAmount);
    }

    event Received(address, uint);
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}   