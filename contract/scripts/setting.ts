import hre, { ethers } from "hardhat";

// const transferAmount = ethers.utils.parseEther("0.1");
// await admin[0].sendTransaction({
//   to: productOwner,
//   value: transferAmount,
// });
// const transferAmount = ethers.utils.parseEther("0.1");
// await admin[0].sendTransaction({
//   to: donator,
//   value: transferAmount,
// });

async function setting() {
  // Replace these addresses with the deployed contract addresses
  const HackathonAttestationAddress =
    "0xdb715D333D57b35756C823ac4f9979049E4eD542";

  // Get the contract instances
  const HackathonAttestation = await ethers.getContractAt(
    "HackathonAttestation",
    HackathonAttestationAddress
  );
  const transferAmount = ethers.utils.parseEther("0.1");
  const admin = await ethers.getSigners();
  // 1. Create a new project
  // const projectId = ethers.utils.keccak256(
  //   ethers.utils.toUtf8Bytes("Test Project")
  // );
  const projectId = ethers.utils.formatBytes32String("Test Project");
  console.log(projectId);
  const projectName = "Test Project";
  const projectURL = "http://test-project.com";
  const projectTarget = "Test project target";

  // await HackathonAttestation.connect(admin[0]).createProject(
  //   projectId,
  //   projectName,
  //   projectURL,
  //   projectTarget
  // );
  // console.log("Project created");
  // // Attest eligible project
  // const productOwner = "0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0";
  // const donator = "0x34Cd20407949cCe21E494E8E3334dB85e0D130a9";
  // const val = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(productOwner));
  // const attest = {
  //   about: admin[0].address,
  //   key: projectId,
  //   val: val,
  // };
  // console.log(attest);
  // await HackathonAttestation.connect(admin[0]).attestEligibleProject(attest);
  // console.log("Eligible project attested");

  // 2. Donate with attestation
  // const donator = await accounts[2].getAddress();
  // const donationAmount = ethers.utils.parseEther("0.001");
  // const attestForDonation = {
  //   about: donator,
  //   key: projectId,
  //   val: ethers.utils.defaultAbiCoder.encode(["uint256"], [donationAmount]),
  // };

  // console.log(
  //   "Account before balance:",
  //   (await donator.getBalance()).toString()
  // );
  // await HackathonAttestation.connect(donator).donateWithAttest(
  //   attestForDonation,
  //   {
  //     value: donationAmount,
  //   }
  // );
  // console.log(
  //   "Account after balance:",
  //   (await donator.getBalance()).toString()
  // );
  // console.log("Donation with attestation completed");

  // 3. Update project status
  // await HackathonAttestation.connect(admin[0]).updateProjectStatus(
  //   projectId,
  //   3
  // );
  // ProjectStatus.Vote
  await HackathonAttestation.connect(admin[0]).updateVotingStatus(projectId, 1); // VotingStatus.For
  console.log("Project vote status updated");
  // ProjectStatus.Vote
  // await HackathonAttestation.connect(admin[0]).updateVotingStatus(projectId, 2); // VotingStatus.Against
  // console.log("Project vote status updated");
  // await admin[0].sendTransaction({
  //   to: HackathonAttestationAddress,
  //   value: transferAmount,
  // });
  // await HackathonAttestation.connect(admin[0]).updateProjectStatus(
  //   projectId,
  //   4
  // );
  // // ProjectStatus.Finished
  // console.log("Project status withdraw ready");

  const balance = await HackathonAttestation.connect(
    admin[0]
  ).getDonationAmount(projectId);
  console.log(balance);
}

setting()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
