import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ethers } from "ethers";
import {
  useSigner,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
} from "wagmi";

import { HackathonAttestationAddress } from "../../constants/addresses";
import HackathonAttestationABI from "../../constants/HackathonAttestation.json";
import { H2, Body16, Body16Bold } from "../OPStyledTypography";
import { AttestForm, FormRow, FormLabel } from "../StyledFormComponents";
import Tooltip from "../Tooltip";
import { TextInput } from "../OPStyledTextInput";
import { PrimaryButton } from "../OPStyledButton";
import { Select } from "../OPStyledSelect";
import * as PushAPI from "@pushprotocol/restapi";

async function sendNotification(val) {
  const { data: signer } = useSigner();

  try {
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer,
      type: 3, // target
      identityType: 2, // direct payload
      notification: {
        title: "[SDK-TEST] notification TITLE:",
        body: "[sdk-test] notification BODY",
      },
      payload: {
        title: "[sdk-test] payload title",
        body: "sample msg body",
        cta: "",
        img: "",
      },
      recipients: `eip155:42:${val}`, // recipient address
      channel: "eip155:42:0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce", // your channel address
      env: "staging",
    });

    console.log("Notification sent successfully:", apiResponse);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

const AttestationTypeSelect = styled(Select)`
  color: ${(props) => (props.value === "default" ? "#8496AE" : "inherit")};
`;

const SubSection = styled(Body16Bold)`
  margin: 0;
`;
const FormButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 28px 0px 0px;
  width: 672px;
`;

const HashedKey = styled.textarea`
  align-items: center;
  border: 1px solid #cbd5e0;
  border-radius: 12px;
  box-sizing: border-box;
  font-size: 14px;
  margin: 8px 0;
  outline-style: none;
  padding: 9px 12px;
  height: 48px;
  width: 456px;
  resize: none;
`;

const Link = styled.a`
  color: #f01a37;
`;

const FeedbackMessage = styled.span`
  padding: 0px 36px;
`;

const NewAttestation = () => {
  const { signer } = useSigner();
  const { chain } = useNetwork();
  const [etherscanBaseLink, setEtherscanBaseLink] = useState("");
  const [attestationType, setAttestationType] = useState("eligible");

  const [about, setAbout] = useState("");
  const [key, setKey] = useState("");
  const [hashedKey, setHashedKey] = useState("");
  const [val, setVal] = useState("");
  const [attestation, setAttestation] = useState({
    about,
    key,
    val,
  });

  const [isAboutValid, setIsAboutValid] = useState(false);
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [isValValid, setIsValValid] = useState(false);

  const [about2, setAbout2] = useState("");
  const [key2, setKey2] = useState("");
  const [hashedKey2, setHashedKey2] = useState("");
  const [val2, setVal2] = useState("");
  const [callval2, setcallVal2] = useState("");
  const [attestation2, setAttestation2] = useState({
    about,
    key,
    val,
  });

  const [isAboutValid2, setIsAboutValid2] = useState(false);
  const [isKeyValid2, setIsKeyValid2] = useState(false);
  const [isValValid2, setIsValValid2] = useState(false);
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: HackathonAttestationAddress,
    abi: HackathonAttestationABI.abi,
    functionName: "attestEligibleProject",
    args: [attestation],
    enabled: Boolean(about) && Boolean(key) && Boolean(val),
  });
  const { data, error, isError, write } = useContractWrite(config);

  const {
    config: config2,
    error: prepareError2,
    isError: isPrepareError2,
  } = usePrepareContractWrite({
    address: HackathonAttestationAddress,
    abi: HackathonAttestationABI.abi,
    functionName: "donateWithAttest",
    args: [
      attestation2,
      {
        value: callval2,
      },
    ],
    enabled: Boolean(about2) && Boolean(key2) && Boolean(val2),
  });

  const {
    data: data2,
    error: error2,
    isError: isError2,
    write: write2,
  } = useContractWrite(config2);

  useEffect(() => {
    try {
      // if (chain.name === "Optimism") {
      //   setEtherscanBaseLink("https://optimistic.etherscan.io/tx/");
      // }
      // if (chain.name === "Optimism Goerli") {
      //   setEtherscanBaseLink("https://goerli-optimism.etherscan.io/tx/");
      // }
      if (chain.name === "Gnosis") {
        setEtherscanBaseLink("https://gnosisscan.io//tx/");
      }
    } catch (e) {
      console.error(e);
    }
  }, [chain]);

  useEffect(() => {
    try {
      let attest;
      if (key.length > 31) {
        attest = {
          about,
          key: hashedKey,
          val: ethers.utils.toUtf8Bytes(val === "" ? "0x" : val),
        };
      } else {
        attest = {
          about,
          key: ethers.utils.formatBytes32String(key === "" ? "0x" : key),
          val: ethers.utils.toUtf8Bytes(val === "" ? "0x" : val),
        };
      }
      console.log(attest);
      setAttestation(attest);
    } catch (e) {
      console.error(e);
    }
    setIsAboutValid(ethers.utils.isAddress(about));
    // todo: make this more robust
    setIsKeyValid(key !== "");
    setIsValValid(val !== "");
  }, [about, key, val]);

  useEffect(() => {
    try {
      let attest2;
      let donationAmount;
      if (key2.length > 31) {
        donationAmount = ethers.utils.parseEther(val2 === "" ? "0" : val2);
        attestation2 = {
          about: about2,
          key: hashedKey2,
          val: ethers.utils.defaultAbiCoder.encode(
            ["uint256"],
            [donationAmount]
          ),
        };
      } else {
        donationAmount = ethers.utils.parseEther(val2 === "" ? "0" : val2);
        attest2 = {
          about: about2,
          key: ethers.utils.formatBytes32String(key2 === "" ? "0x" : key2),
          val: ethers.utils.defaultAbiCoder.encode(
            ["uint256"],
            [donationAmount]
          ),
        };
      }
      console.log(attest2);
      setcallVal2(donationAmount);
      setAttestation2(attest2);
    } catch (e) {
      console.error(e);
    }
    setIsAboutValid2(ethers.utils.isAddress(about2));
    // todo: make this more robust
    setIsKeyValid2(key2 !== "");
    setIsValValid2(val2 !== "");
  }, [about2, key2, val2]);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const { isLoading: isLoading2, isSuccess: isSuccess2 } =
    useWaitForTransaction({
      hash: data2?.hash,
    });

  return (
    <>
      <H2>New attestation</H2>
      <SubSection>Please make your donation from here.</SubSection>
      <SubSection>
        1. Are you Sponser? => Eligible attestation&nbsp; 2. Are you Donator?
        =>Donation attestation
      </SubSection>

      <AttestForm
        onSubmit={(e) => {
          e.preventDefault();
          if (attestationType === "eligible") {
            console.log(write);
            write && write();
            sendNotification(val);
          } else {
            console.log(write2);
            write2 && write2();
          }
        }}
      >
        <FormRow>
          <FormLabel>
            Attestation type
            <Tooltip>
              <ul>
                <li>Attestation type</li>
                <li>
                  1. Are you Sponser? Please make your attestation here. (you
                  need to know ProjectID)
                </li>
                <li>
                  2. Are you Donator? Please make your donation from here. (you
                  need to wait sponser attest)
                </li>
              </ul>
            </Tooltip>
          </FormLabel>
          <AttestationTypeSelect
            value={attestationType}
            onChange={(e) => setAttestationType(e.target.value)}
          >
            <option value="default" hidden>
              Select attestation type
            </option>
            <option value="eligible">Eligible attestation</option>
            <option value="donation">Donation attestation</option>
            <option value="soon" disabled>
              More schemas coming soon
            </option>
          </AttestationTypeSelect>
        </FormRow>
        {attestationType === "eligible" ? (
          <>
            <FormRow>
              <FormLabel>
                Ethereum address
                <Tooltip>
                  <ul>
                    <li>
                      The address describes what the attestation is about.
                      Please use your address usually.
                    </li>
                  </ul>
                </Tooltip>
              </FormLabel>
              <TextInput
                type="text"
                placeholder="Who are you? (ex: 0x123...)"
                onChange={(e) => setAbout(e.target.value)}
                value={about}
                valid={isAboutValid}
              />
            </FormRow>

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
                onChange={(e) => {
                  const key = e.target.value;
                  if (key.length > 31) {
                    setKey(key);
                    const bytesLikeKey = ethers.utils.toUtf8Bytes(key);
                    const keccak256HashedKey =
                      ethers.utils.keccak256(bytesLikeKey);
                    setHashedKey(keccak256HashedKey);
                  } else {
                    setKey(key);
                    setHashedKey("");
                  }
                }}
                placeholder="Ex. Phil's Project (:=Project ID)"
                value={key}
                valid={isKeyValid}
              />
            </FormRow>

            {key.length > 31 ? (
              <FormRow>
                <FormLabel>
                  Hashed key&nbsp;
                  <Tooltip>
                    <ul>
                      <li>
                        The key in the smart contract is limited to 32 bytes.
                      </li>
                      <li>
                        When a key is 32 characters or longer, it is hashed with
                        keccack256 to fit in the 32 bytes, and this is the
                        result.
                      </li>
                      <li>
                        This will be the key recorded and used for the
                        AttestationStation.
                      </li>
                    </ul>
                  </Tooltip>
                </FormLabel>
                <HashedKey type="text" readOnly value={hashedKey} />
              </FormRow>
            ) : (
              <span></span>
            )}
            <FormRow>
              <FormLabel>
                Product owner Address&nbsp;
                <Tooltip>
                  <ul>
                    <li>The value that is associated with the key.</li>
                  </ul>
                </Tooltip>
              </FormLabel>
              <TextInput
                type="text"
                placeholder="Who's project? (ex: 0x123...)"
                onChange={(e) => setVal(e.target.value)}
                value={val}
                valid={isValValid}
              />
            </FormRow>
            <FormButton>
              <PrimaryButton
                disabled={
                  !write ||
                  isLoading ||
                  !(isAboutValid && isKeyValid && isValValid)
                }
              >
                {isLoading ? "Making attestion" : "Make attestation"}
              </PrimaryButton>
            </FormButton>
            {isSuccess && (
              <FeedbackMessage>
                Successfully made attestation:&nbsp;
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
            <SubSection>
              Anyone make a donation with an attestation.
              <p />
            </SubSection>
            <FormRow>
              <FormLabel>
                Ethereum address&nbsp;
                <Tooltip>
                  <li>
                    The address describes what the attestation is about. Please
                    use your address usually.
                  </li>
                </Tooltip>
              </FormLabel>
              <TextInput
                type="text"
                placeholder="Who's donator? (ex: your address 0x123...)"
                onChange={(e) => setAbout2(e.target.value)}
                value={about2}
                valid={isAboutValid2}
              />
            </FormRow>

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
                onChange={(e) => {
                  const key2 = e.target.value;
                  if (key2.length > 31) {
                    setKey2(key2);
                    const bytesLikeKey2 = ethers.utils.toUtf8Bytes(key2);
                    const keccak256HashedKey2 =
                      ethers.utils.keccak256(bytesLikeKey2);
                    setHashedKey2(keccak256HashedKey2);
                  } else {
                    setKey2(key2);
                    setHashedKey2("");
                  }
                }}
                placeholder="Ex. Phil's Project (:=Project ID)"
                value={key2}
                valid={isKeyValid2}
              />
            </FormRow>

            {key.length > 31 ? (
              <FormRow>
                <FormLabel>
                  Hashed key&nbsp;
                  <Tooltip>
                    <ul>
                      <li>
                        The key in the smart contract is limited to 32 bytes.
                      </li>
                      <li>
                        When a key is 32 characters or longer, it is hashed with
                        keccack256 to fit in the 32 bytes, and this is the
                        result.
                      </li>
                      <li>
                        This will be the key recorded and used for the
                        AttestationStation.
                      </li>
                    </ul>
                  </Tooltip>
                </FormLabel>
                <HashedKey type="text" readOnly value={hashedKey2} />
              </FormRow>
            ) : (
              <span></span>
            )}
            <FormRow>
              <FormLabel>
                Donation value&nbsp;
                <Tooltip>
                  <ul>
                    <li>Please enter the desired donation amount in ETH.</li>
                  </ul>
                </Tooltip>
              </FormLabel>
              <TextInput
                type="text"
                placeholder="Ex. 1 (:=1 DAI)"
                onChange={(e) => setVal2(e.target.value)}
                value={val2}
                valid={isValValid2}
              />
            </FormRow>
            <FormButton>
              <PrimaryButton
                disabled={
                  !write2 ||
                  isLoading2 ||
                  !(isAboutValid2 && isKeyValid2 && isValValid2)
                }
              >
                {isLoading2 ? "Making donation" : "Make donation"}
              </PrimaryButton>
            </FormButton>
            {isSuccess2 && (
              <FeedbackMessage>
                Successfully made attestation:&nbsp;
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${etherscanBaseLink}${data2?.hash}`}
                >
                  etherscan transaction
                </Link>
              </FeedbackMessage>
            )}
          </>
        )}
        {(isPrepareError || isError || isPrepareError2 || isError2) && (
          <FeedbackMessage>
            Error: {(prepareError || error || prepareError2 || error2)?.message}
          </FeedbackMessage>
        )}
      </AttestForm>
    </>
  );
};

export default NewAttestation;
