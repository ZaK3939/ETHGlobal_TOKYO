import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import styled from "styled-components";
import { useContractRead } from "wagmi";
import {
  AttestationStationAddress,
  HackathonAttestationAddress,
} from "../../constants/addresses";
import AttestationStationABI from "../../constants/abi.json";
import { H2, Body16, Body16Bold } from "../OPStyledTypography";
import { AttestForm, FormRow, FormLabel } from "../StyledFormComponents";
import { TextInput } from "../OPStyledTextInput";
import Tooltip from "../Tooltip";

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
const SubSection = styled(Body16Bold)`
  margin: 0;
`;

const ReadAttestation = () => {
  const [creator, setCreator] = useState(HackathonAttestationAddress);
  const [about, setAbout] = useState("");
  const [key, setKey] = useState("");
  const [bytes32Key, setBytes32Key] = useState("");

  const [isCreatorValid, setIsCreatorValid] = useState(false);
  const [isAboutValid, setIsAboutValid] = useState(false);
  const [isKeyValid, setIsKeyValid] = useState(false);

  const { data, error, isError } = useContractRead({
    address: AttestationStationAddress,
    abi: AttestationStationABI,
    functionName: "attestations",
    args: [creator, about, bytes32Key],
    enabled: Boolean(creator) && Boolean(about) && Boolean(bytes32Key),
  });

  useEffect(() => {
    setIsCreatorValid(ethers.utils.isAddress(creator));
    setIsAboutValid(ethers.utils.isAddress(about));
    setIsKeyValid(key !== "");
    if (isError) {
      console.error(error);
      console.error(error.value);
      console.error(error.code);
    }
  }, [creator, about, key, isError, error]);

  return (
    <>
      <H2>Read Attestation </H2>
      <AttestForm>
        <SubSection>You can check atttestation who is project owner</SubSection>
        <FormRow>
          <FormLabel>
            Creator&apos;s address
            <Tooltip>
              <ul>
                <li>The Creator&apos;s address describes msg.sender.</li>
                <li>There is no need for changes in general.</li>
              </ul>
            </Tooltip>
          </FormLabel>
          <TextInput
            type="text"
            placeholder="Who created this attestation?"
            onChange={(e) => setCreator(e.target.value)}
            value={creator}
            valid={isCreatorValid}
          />
        </FormRow>

        <FormRow>
          <FormLabel>
            Ethereum address&nbsp;
            <Tooltip>
              <ul>
                <li>The key describes what the attestation is about.</li>
                <li>
                  Please provide the value entered in the address field for
                  attestation. This is basically your address.
                </li>
              </ul>
            </Tooltip>
          </FormLabel>
          <TextInput
            type="text"
            placeholder="Who's this attestation about? (Ex sponser 0x0000000)"
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
        {data ? (
          <>
            <SubSection>
              You can check atttestation how much donation to project
            </SubSection>
            <FormRow>
              <FormLabel>
                Value&nbsp;
                <Tooltip>
                  <ul>
                    <li>
                      This is the total amount of donations collected so far.
                    </li>
                  </ul>
                </Tooltip>
              </FormLabel>
              <Textarea readOnly value={data} />
            </FormRow>

            <FormRow>
              <FormLabel>project Owner(:Donation Receiver)</FormLabel>
              <Textarea
                readOnly
                value={data ? ethers.utils.toUtf8String(data) : ""}
              />
            </FormRow>
          </>
        ) : (
          <></>
        )}
        {isError && (
            <FormLabel>Error: {error?.message}</FormLabel>
        )}
      </AttestForm>
    </>
  );
};

export default ReadAttestation;
