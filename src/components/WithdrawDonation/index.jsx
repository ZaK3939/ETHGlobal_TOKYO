import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { HackathonAttestationAddress } from "../../constants/addresses";
import HackathonAttestationABI from "../../constants/HackathonAttestation.json";
import styled from "styled-components";
import { H2, Body16, Body16Bold } from "../OPStyledTypography";
import { AttestForm, FormRow, FormLabel } from "../StyledFormComponents";
import { TextInput } from "../OPStyledTextInput";
import {
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
} from "wagmi";
import { PrimaryButton } from "../OPStyledButton";
import Tooltip from "../Tooltip";

const SubSection = styled(Body16Bold)`
  margin: 0;
`;

const SubsubSection = styled.div`
  margin: 0;
`;
const Link = styled.a`
  color: #f01a37;
`;

const FeedbackMessage = styled.span`
  padding: 0px 36px;
`;
const Textarea = styled.textarea`
  align-items: center;
  border: 1px solid #cbd5e0;
  border-radius: 12px;
  box-sizing: border-box;
  font-size: 14px;
  margin: 8px 0;
  outline-style: none;
  padding: 9px 12px;
  width: 456px;
  resize: none;
`;

const FormButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 28px 0px 0px;
  width: 672px;
`;
const Label = styled.label`
  font-weight: bold;
  margin-bottom: 4px;
`;
const WithdrawDonation = () => {
  const { chain } = useNetwork();
  const [etherscanBaseLink, setEtherscanBaseLink] = useState("");
  const [key, setKey] = useState("");
  const [bytes32Key, setBytes32Key] = useState("");
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [projectStatus, setProjectStatus] = useState("");
  const [votingStatus, setVotingStatus] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [alldonationAmount, setallDonationAmount] = useState("");
  const [canWithdraw, setCanWithdraw] = useState(false);

  const { data: projectStatusResult } = useContractRead({
    address: HackathonAttestationAddress,
    abi: HackathonAttestationABI.abi,
    functionName: "checkProjectStatus",
    args: [bytes32Key],
    enabled: Boolean(bytes32Key),
  });
  const { data: votingStatusResult } = useContractRead({
    address: HackathonAttestationAddress,
    abi: HackathonAttestationABI.abi,
    functionName: "checkVotingStatus",
    args: [bytes32Key],
    enabled: Boolean(bytes32Key),
  });

  const { data: alldonationAmountResult } = useContractRead({
    address: HackathonAttestationAddress,
    abi: HackathonAttestationABI.abi,
    functionName: "getAllDonationAmount",
    args: [bytes32Key],
    enabled: Boolean(bytes32Key) && Boolean(projectStatusResult === 4),
  });

  const { data: donationAmountResult } = useContractRead({
    address: HackathonAttestationAddress,
    abi: HackathonAttestationABI.abi,
    functionName: "getDonationAmount",
    args: [bytes32Key],
    enabled: Boolean(bytes32Key) && Boolean(projectStatusResult === 4),
  });

  useEffect(() => {
    console.log(bytes32Key);
    console.log("check status");
    console.log(projectStatusResult, votingStatusResult);
    setProjectStatus(projectStatusResult);
    setVotingStatus(votingStatusResult);
    if (projectStatusResult === 4 && (votingStatusResult === 1 || 2)) {
      console.log("can withdraw");
      setCanWithdraw(true);
    }
  }, [bytes32Key]);

  useEffect(() => {
    console.log("check d amount");
    console.log(donationAmountResult);
    if (
      donationAmountResult &&
      ethers.utils.formatUnits(donationAmountResult) > 0
    ) {
      console.log("update d");
      console.log(ethers.utils.formatEther(donationAmountResult));
      setDonationAmount(ethers.utils.formatEther(donationAmountResult));
      setallDonationAmount("");
    }
  }, [canWithdraw, donationAmountResult]);

  useEffect(() => {
    console.log("check da amount");
    console.log(alldonationAmountResult);
    if (
      alldonationAmountResult &&
      ethers.utils.formatEther(alldonationAmountResult)
    ) {
      console.log("update da");
      console.log(ethers.utils.formatEther(alldonationAmountResult));
      setDonationAmount("");
      setallDonationAmount(ethers.utils.formatEther(alldonationAmountResult));
    }
  }, [canWithdraw, alldonationAmountResult]);
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: HackathonAttestationAddress,
    abi: HackathonAttestationABI.abi,
    functionName: "withdrawDonationByOwner",
    args: [bytes32Key],
    enabled:
      Boolean(bytes32Key) &&
      Boolean(alldonationAmount) &&
      Boolean(votingStatusResult === 1),
  });
  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const {
    config: config2,
    error: prepareError2,
    isError: isPrepareError2,
  } = usePrepareContractWrite({
    address: HackathonAttestationAddress,
    abi: HackathonAttestationABI.abi,
    functionName: "withdrawDonation",
    args: [bytes32Key],
    enabled:
      Boolean(bytes32Key) &&
      Boolean(donationAmount) &&
      Boolean(votingStatusResult === 2),
  });

  const {
    data: data2,
    error: error2,
    isError: isError2,
    write: write2,
  } = useContractWrite(config2);

  const { isLoading: isLoading2, isSuccess: isSuccess2 } =
    useWaitForTransaction({
      hash: data2?.hash,
    });

  useEffect(() => {
    try {
      // if (chain.name === "Optimism") {
      //   setEtherscanBaseLink("https://optimistic.etherscan.io/tx/");
      // }
      // if (chain.name === "Optimism Goerli") {
      //   setEtherscanBaseLink("https://goerli-optimism.etherscan.io/tx/");
      // }
      if (chain.name === "Gnosis Chain") {
        setEtherscanBaseLink("https://gnosisscan.io/tx/");
      }
    } catch (e) {
      console.error(e);
    }
  }, [chain]);

  return (
    <>
      <H2>Vote on Snapshot</H2>

      <Link
        target="_blank"
        rel="noopener noreferrer"
        href="https://snapshot.org/#/zak3939.eth/proposal/0xe9e1e35f5a45fc35e16fac8618d909ccf739ae7f910972047ca0db2c3043464e"
      >
        Snapshot
      </Link>
      <SubSection>
        - For: project owner can receive all of the donation funds.
        <br />- Against: donors withdraw their donation.
      </SubSection>
      <H2>Withdraw Donation</H2>
      <SubSection>You can withdraw from here</SubSection>
      <AttestForm
        onSubmit={(e) => {
          console.log("button clicked");
          console.log(projectStatusResult, votingStatusResult);
          e.preventDefault();
          if (projectStatusResult === 4) {
            if (votingStatusResult === 1) {
              console.log(write);
              write && write();
            } else if (votingStatusResult === 2) {
              console.log(write2);
              write2 && write2();
            }
          }
        }}
      >
        <FormRow>
          <FormLabel>
            Project ID&nbsp;
            <Tooltip>
              <ul>
                <li>Please obtain the ID from the product owner </li>
              </ul>
            </Tooltip>
          </FormLabel>
          <TextInput
            type="text"
            placeholder="Project ID (Ex. Phil's Project)"
            onChange={(e) => {
              const key = e.target.value;
              if (key.length > 31) {
                setKey(key);
                setBytes32Key(key);
              } else {
                setKey(key);
                setBytes32Key(ethers.utils.formatBytes32String(key));
              }
            }}
            value={key}
            valid={isKeyValid}
          />
        </FormRow>
        {canWithdraw ? (
          <>
            {votingStatusResult === 1 ? (
              <>
                <SubSection>
                  Congrats. you Got Donation from potential user😄
                </SubSection>
                <FormRow>
                  <FormLabel>
                    alldonationAmount&nbsp;
                    <Tooltip>
                      <ul>
                        <li>
                          Congrats. This is the total amount of donations
                          available for withdrawal.
                        </li>
                      </ul>
                    </Tooltip>
                  </FormLabel>
                  <Textarea readOnly value={alldonationAmount} />
                </FormRow>
                <FormButton>
                  <PrimaryButton disabled={!write || isLoading}>
                    {isLoading ? "Making withdraw" : "Make withdraw"}
                  </PrimaryButton>
                </FormButton>
                {isSuccess && (
                  <FeedbackMessage>
                    Successfully made withdraw:&nbsp;
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`${etherscanBaseLink}${data?.hash}`}
                    >
                      etherscan transaction
                    </Link>
                  </FeedbackMessage>
                )}
              </>
            ) : (
              <>
                <FormRow>
                  <FormLabel>
                    donationAmount&nbsp;
                    <Tooltip>
                      <ul>
                        <li>
                          Oh your donated project is faild. Your donation is
                          available for withdrawal.
                        </li>
                      </ul>
                    </Tooltip>
                  </FormLabel>
                  <Textarea readOnly value={donationAmountResult} />
                </FormRow>
                <FormButton>
                  <PrimaryButton disabled={!write2 || isLoading2}>
                    {isLoading2 ? "Making withdraw" : "Make withdraw"}
                  </PrimaryButton>
                </FormButton>
                {isSuccess2 && (
                  <FeedbackMessage>
                    Successfully made withdraw:&nbsp;
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`${etherscanBaseLink}${data2?.hash}`}
                    >
                      etherscan transaction
                    </Link>
                  </FeedbackMessage>
                )}
                {(isPrepareError2 || isError2) && (
                  <FeedbackMessage>
                    Error: {(prepareError2 || error2)?.message}
                  </FeedbackMessage>
                )}
              </>
            )}
          </>
        ) : (
          <></>
        )}
      </AttestForm>
    </>
  );
};

export default WithdrawDonation;
