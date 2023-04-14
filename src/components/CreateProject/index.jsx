import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
} from "wagmi";
import { HackathonAttestationAddress } from "../../constants/addresses";
import HackathonAttestationABI from "../../constants/HackathonAttestation.json";
import styled from "styled-components";
import { H2, Body16, Body16Bold } from "../OPStyledTypography";
import { TextInput } from "../OPStyledTextInput";
import { AttestForm, FormRow, FormLabel } from "../StyledFormComponents";
import { PrimaryButton } from "../OPStyledButton";
import Tooltip from "../Tooltip";
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

const SubSection = styled(Body16Bold)`
  margin: 0;
`;

const Button = styled.button`
  padding: 8px;
  margin: 4px;
  border: none;
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  background-color: #4b5563;
  color: #fff;

  &:hover {
    background-color: #374151;
  }
`;

const Link = styled.a`
  color: #f01a37;
`;

const FeedbackMessage = styled.span`
  padding: 0px 36px;
`;

const CreateProject = () => {
  const [projectId, setprojectId] = useState("");
  const [hashedKey, setHashedKey] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectURL, setProjectURL] = useState("");
  const [projectTarget, setProjectTarget] = useState("");

  const { chain } = useNetwork();
  const [etherscanBaseLink, setEtherscanBaseLink] = useState("");
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: HackathonAttestationAddress,
    abi: HackathonAttestationABI.abi,
    functionName: "createProject",
    args: [hashedKey, projectName, projectURL, projectTarget],
    enabled:
      Boolean(projectId) &&
      Boolean(projectName) &&
      Boolean(projectURL) &&
      Boolean(projectTarget),
  });
  const { data, error, isError, write } = useContractWrite(config);

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

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <>
      <H2>After the hackathon</H2>
      <SubSection>
        Are you Project Owner? Please register your projects as donation
        targets.
      </SubSection>

      <H2>Lets Create Project😀</H2>
      <AttestForm
        onSubmit={(e) => {
          e.preventDefault();
          write?.();
        }}
      >
        <FormRow>
          <FormLabel>
            Project ID&nbsp;
            <Tooltip>
              <ul>
                <li>
                  This is the management ID. Please share it later with sponsors
                  and potential donors on Twitter or other platforms.
                </li>
              </ul>
            </Tooltip>
          </FormLabel>
          <TextInput
            type="text"
            onChange={(e) => {
              const projectId = e.target.value;
              if (projectId.length > 31) {
                setprojectId(projectId);
                const bytesLikeKey = ethers.utils.toUtf8Bytes(projectId);
                const keccak256HashedKey = ethers.utils.keccak256(bytesLikeKey);
                setHashedKey(keccak256HashedKey);
              } else {
                const hashedKey = ethers.utils.formatBytes32String(
                  projectId === "" ? "0x" : projectId
                );
                setprojectId(projectId);
                setHashedKey(hashedKey);
              }
            }}
            placeholder="Ex. Phil's Project"
            value={projectId}
            // valid={isKeyValid}
          />
        </FormRow>
        <FormRow>
          <FormLabel>
            Project Name&nbsp;
            <Tooltip>
              <ul>
                <li>
                  Please use the project name that was used during the
                  hackathon.
                </li>
              </ul>
            </Tooltip>
          </FormLabel>

          <TextInput
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Ex. Phil's Project"
          />
        </FormRow>
        <FormRow>
          <FormLabel>
            ProjectURL&nbsp;
            <Tooltip>
              <ul>
                <li>
                  Please use the URL of the ETH Global pdoduct introduction
                  page.
                </li>
              </ul>
            </Tooltip>
          </FormLabel>
          <TextInput
            value={projectURL}
            onChange={(e) => setProjectURL(e.target.value)}
            placeholder="Ex. https://ethglobal.com/showcase/phi-land-2f6hf"
          />
        </FormRow>
        <FormRow>
          <FormLabel>
            Project Target&nbsp;
            <Tooltip>
              <ul>
                <li>
                  Please declare the milestones and their respective achievement
                  dates.
                </li>
              </ul>
            </Tooltip>
          </FormLabel>
          <TextInput
            type="text"
            value={projectTarget}
            onChange={(e) => setProjectTarget(e.target.value)}
            placeholder="Ex. Make 1M user untill 2024/12/31"
          />
        </FormRow>
        <FormButton>
          <PrimaryButton
            disabled={
              !write || isLoading
              // ||  !(isAboutValid && isKeyValid && isValValid)
            }
          >
            {isLoading ? "Making Project" : "Make Project"}
          </PrimaryButton>
        </FormButton>
        {isSuccess && (
          <FeedbackMessage>
            Successfully made attestation:&nbsp; You should share your project
            ID to sponser and donator
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={`${etherscanBaseLink}${data?.hash}`}
            >
              etherscan transaction
            </Link>
          </FeedbackMessage>
        )}
        {(isPrepareError || isError) && (
          <FeedbackMessage>
            Error: {(prepareError || error)?.message}
          </FeedbackMessage>
        )}
      </AttestForm>
    </>
  );
};

export default CreateProject;
