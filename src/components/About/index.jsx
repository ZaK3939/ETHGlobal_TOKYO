import React from "react";

import styled from "styled-components";

import { H2, Body16, Body16Bold } from "../OPStyledTypography";

const AboutContainer = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  text-align: left;
  width: 672px;
`;

const SubSection = styled(Body16Bold)`
  margin: 0;
`;

const SubsubSection = styled.div`
  margin: 0;
`;

const Link = styled.a`
  color: #f01a37;
`;
const Bold = styled.span`
  font-weight: bold;
`;
// Good products are often born at hackathons, but few continue to be developed thereafter.
// Therefore, we propose a system for ETHglobal participants where each individual sets their own milestones after submission, continues development, and receives further grants and donations from sponsors and hackathon viewers upon achieving them.
// This creates clear goals and incentives, and is expected to promote continuous development.
// To build this system, we utilize Optimism Attestation/Safe Wallet/UMA oSnap/Push Protocol/Snapshot/Graph,
// and their respective application areas will be described later on.
const AboutHackathonAttestations = () => {
  return (
    <AboutContainer>
      <H2>Support the continuous development after the hackathon.</H2>
      <SubSection>What&apos;s the HackathonAttestation?</SubSection>
      <Body16>
        The HackathonAttestation is an <Bold>attestation smart contract </Bold>
        deployed on Optimism. It enables anyone to make a seamless donation
        ecosystem which would yield considerable advantages after hackathon. 😀
      </Body16>
      <SubSection>What&apos;s the Motivation?</SubSection>
      <Body16>
        {" "}
        <Bold>It's very tough! 😢 Challenges in Hackathon-based project. </Bold>
        <SubsubSection>1. Struggle with insufficient funds. </SubsubSection>
        <SubsubSection>
          2. Face difficulties in monitoring and evaluating the progress of
          projects.
        </SubsubSection>
        <SubsubSection>
          3. Uncertainty about user adoption and engagement.
        </SubsubSection>
      </Body16>
      <SubSection>
        Our product offers advantage for all parties involved
      </SubSection>
      <Body16>
        Win-win situation for everyone involved in the hackathon-project’s
        development
      </Body16>
      <SubsubSection>
        - Sponsors effectively support by attestation and monitor projects.
      </SubsubSection>{" "}
      - Project owners receive the donation if they reach specific milestones
      <SubsubSection>
        - Donors can confidently contribute and can be refunded if the project
        does not meet expectations.
      </SubsubSection>
      <p />
      <SubSection>Learn more</SubSection>
      <Body16>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://community.optimism.io/docs/governance/attestation-station/#"
        >
          Official Optimism Documentation
        </Link>
        <div />
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/ZaK3939/ETHGlobal_TOKYO"
        >
         Hackathon Github repository
        </Link>
        <div />
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://docs.uma.xyz/developers/osnap/osnap-quick-start"
        >
          oSnap
        </Link>
      </Body16>
    </AboutContainer>
  );
};

export default AboutHackathonAttestations;
