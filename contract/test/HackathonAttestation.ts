import { ethers } from "hardhat";
import { expect } from "chai";
import { BigNumber } from "@ethersproject/bignumber";
// import { HackathonAttestation } from "../typechain";
// import { AttestationStation } from "../utils/AttestationStation";

describe("HackathonAttestation", function () {
  let attestation: any;
  let attestationStation: any;
  let admin0: string;
  let admin: string;
  let receiver: string;
  let productOwner: string;
  let donator: string;
  let projectId: string;
  let projectName: string;
  let projectURL: string;
  let projectTarget: string;

  beforeEach(async () => {
    attestationStation = await ethers
      .getContractFactory("AttestationStation")
      .then((factory) => factory.deploy());
    admin0 = await ethers.provider.getSigner(0).getAddress();
    admin = await ethers.provider.getSigner(1).getAddress();
    receiver = await ethers.provider.getSigner(2).getAddress();
    productOwner = await ethers.provider.getSigner(3).getAddress();
    donator = await ethers.provider.getSigner(4).getAddress();

    attestation = await ethers
      .getContractFactory("HackathonAttestation")
      .then((factory) => factory.deploy(attestationStation.address, receiver));
    projectId = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes("Test Project")
    );
    projectName = "Test Project";
    projectURL = "http://test-project.com";
    projectTarget = "Test project target";
  });

  it("should create a new project", async function () {
    await attestation.createProject(
      projectId,
      projectName,
      projectURL,
      projectTarget
    );

    const project = await attestation.projects(projectId);
    expect(project.projectStatus).to.equal(1); // ProjectStatus.Open
    expect(project.projectName).to.equal(projectName);
    expect(project.projectURL).to.equal(projectURL);
    expect(project.projectTarget).to.equal(projectTarget);
  });

  it("should write EligibleProject to the AttestationStation", async function () {
    await attestation.createProject(
      projectId,
      projectName,
      projectURL,
      projectTarget
    );
    // const val = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(productOwner));
    const val = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(productOwner));
    let attest = {
      about: admin0,
      key: projectId,
      val,
    };
    console.log(attest);
    await attestation.attestEligibleProject(attest);

    //Creator address (who attested this) // Subject address (who is being attested about) //　Key
    const project = await attestationStation.attestations(
      attestation.address,
      admin0,
      projectId
    );
    expect(project).to.equal(val);
    const projectdata = await attestation.projects(projectId);
    expect(projectdata.projectStatus).to.equal(2); // ProjectStatus.Eligible
  });

  it("should accept a donation and attestation to the AttestationStation", async function () {
    await attestation.createProject(
      projectId,
      projectName,
      projectURL,
      projectTarget
    );
    const val = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(productOwner));
    let attest = {
      about: admin0,
      key: projectId,
      val,
    };
    //address _about, bytes32 _key, bytes memory _val
    await attestation.attestEligibleProject(attest);

    const beferoReceiverBalance = await ethers.provider.getBalance(receiver);
    const donationAmount = ethers.utils.parseEther("1");
    attest = {
      about: donator,
      key: projectId,
      val: ethers.utils.defaultAbiCoder.encode(["uint256"], [donationAmount]),
    };
    console.log(attest);
    await attestation.donateWithAttest(attest, {
      value: donationAmount,
    });

    const balance = await attestation.getDonationAmount(projectId);
    expect(balance).to.equal(donationAmount);

    const donationBalance = await attestation.donationForProject(projectId);
    expect(donationBalance).to.equal(donationAmount);

    const receiverBalance = await ethers.provider.getBalance(receiver);
    console.log(receiverBalance);
    expect(receiverBalance).to.equal(beferoReceiverBalance.add(donationAmount));
  });

  it("should allow a donor to withdraw their donation", async function () {
    await attestation.createProject(
      projectId,
      projectName,
      projectURL,
      projectTarget
    );
    const val = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(productOwner));

    let attest = {
      about: admin0,
      key: projectId,
      val: val,
    };
    //address _about, bytes32 _key, bytes memory _val
    await attestation.attestEligibleProject(attest);

    const donationAmount = ethers.utils.parseEther("1");
    attest = {
      about: admin0,
      key: projectId,
      val: ethers.utils.defaultAbiCoder.encode(["uint256"], [donationAmount]),
    };
    await attestation.donateWithAttest(attest, {
      value: donationAmount,
    });
    await attestation.updateProjectStatus(projectId, 3); // ProjectStatus.Vote
    await attestation.updateVotingStatus(projectId, 2); // VotingStatus.Against

    // Wait for the transaction to be mined
    await ethers.provider.getSigner(2).sendTransaction({
      to: attestation.address,
      value: donationAmount,
    });
    console.log("transer finished");
    await attestation.updateProjectStatus(projectId, 4); // ProjectStatus.Close
    const balanceBeforeWithdrawal = await ethers.provider.getBalance(
      await ethers.provider.getSigner(0).getAddress()
    );

    const donationBalance = await attestation.getDonationAmount(projectId);
    expect(donationBalance).to.equal(donationAmount);

    const balanceBeforeAttestation = await ethers.provider.getBalance(
      await attestation.address
    );
    const tx2 = await attestation.withdrawDonation(projectId);
    const receipt = await tx2.wait();
    const balanceAfterAttestation = await ethers.provider.getBalance(
      await attestation.address
    );
    console.log(balanceBeforeAttestation, balanceAfterAttestation);
    expect(balanceAfterAttestation).to.equal(0);

    const gasUsed = receipt.gasUsed;
    const balanceAfterWithdrawal = await ethers.provider.getBalance(
      await ethers.provider.getSigner(0).getAddress()
    );

    console.log(
      donationBalance,
      balanceBeforeWithdrawal,
      gasUsed,
      balanceAfterWithdrawal
    );
    // expect(
    //   balanceAfterWithdrawal.sub(balanceBeforeWithdrawal).add(gasUsed)
    // ).to.equal(donationAmount);
  });

  it("should allow the owner to withdraw the donation if the project is voted for", async function () {
    await attestation.createProject(
      projectId,
      projectName,
      projectURL,
      projectTarget
    );
    const val = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(productOwner));
    let attest = {
      about: admin0,
      key: projectId,
      val: val,
    };
    //address _about, bytes32 _key, bytes memory _val
    await attestation.attestEligibleProject(attest);

    const donationAmount = ethers.utils.parseEther("1");
    attest = {
      about: admin0,
      key: projectId,
      val: ethers.utils.defaultAbiCoder.encode(["uint256"], [donationAmount]),
    };
    await attestation.donateWithAttest(
      attest,

      {
        value: donationAmount,
      }
    );
    await attestation.updateProjectStatus(projectId, 3); // ProjectStatus.Vote
    await attestation.updateVotingStatus(projectId, 1); // VotingStatus.For

    // Wait for the transaction to be mined
    await ethers.provider.getSigner(2).sendTransaction({
      to: attestation.address,
      value: donationAmount,
    });
    console.log("transer finished");
    await attestation.updateProjectStatus(projectId, 4); // ProjectStatus.Close
    const balanceBeforeWithdrawal = await ethers.provider.getBalance(
      await ethers.provider.getSigner(0).getAddress()
    );

    const donationBalance = await attestation.getDonationAmount(projectId);
    expect(donationBalance).to.equal(donationAmount);

    const balanceBeforeAttestation = await ethers.provider.getBalance(
      await attestation.address
    );
    const tx2 = await attestation.withdrawDonationByOwner(projectId);
    const receipt = await tx2.wait();
    const balanceAfterAttestation = await ethers.provider.getBalance(
      await attestation.address
    );
    console.log(balanceBeforeAttestation, balanceAfterAttestation);
    expect(balanceAfterAttestation).to.equal(0);

    const gasUsed = receipt.gasUsed;
    const balanceAfterWithdrawal = await ethers.provider.getBalance(
      await ethers.provider.getSigner(0).getAddress()
    );

    console.log(
      donationBalance,
      balanceBeforeWithdrawal,
      gasUsed,
      balanceAfterWithdrawal
    );
  });
});
