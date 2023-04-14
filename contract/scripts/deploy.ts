const { ethers } = require("hardhat");

const deploy = async () => {

  const AttestationStation = await ethers.getContractFactory(
    "AttestationStation"
  );
  const attestationStation = await AttestationStation.deploy(
  );
  // const AttestationStationAddress =
  //   "0xEE36eaaD94d1Cc1d0eccaDb55C38bFfB6Be06C77";
  const ReceiverAddress = "0x38f98F687A2E97C2B38b5282fbBFB7501c15B351";

  // Deploy the contract
  const HackthonAttestation = await ethers.getContractFactory(
    "HackathonAttestation"
  );
  const hackthonAttestation = await HackthonAttestation.deploy(
    attestationStation.address,
    ReceiverAddress
  );
  console.log(
    `AttestationStation deployed to address: ${attestationStation.address}`
  );
  console.log(
    `HackathonAttestation deployed to address: ${hackthonAttestation.address}`
  );
};

deploy();
