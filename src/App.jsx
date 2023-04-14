import React, { useState } from "react";
import styled from "styled-components";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import Content from "./components/Content";
import Header from "./components/Header";

const AppWrapper = styled.div`
  background-color: #f1f4f9;
`;

const ContentWrapper = styled.div`
  height: calc(100vh - 72px);
`;
/* adding gnosis network */
const GnosisChain = {
  id: 100,
  name: "Gnosis Chain",
  network: "Gnosis",
  nativeCurrency: {
    decimals: 18,
    name: "xDai",
    symbol: "xDai",
  },
  rpcUrls: {
    default: "https://rpc.ankr.com/gnosis",
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://gnosisscan.io/" },
  },
  iconUrls: ["https://images.prismic.io/koinly-marketing/16d1deb7-e71f-48a5-9ee7-83eb0f7038e4_Gnosis+Chain+Logo.png"],
  testnet: false,
}

const { chains, provider, webSocketProvider } = configureChains(
  // [chain.optimism, chain.optimismGoerli],
  [GnosisChain,chain.optimism],
  [
    jsonRpcProvider({ rpc: () => ({ http: "https://rpc.ankr.com/gnosis" }) }),  //<<<< New RPC Provider
    publicProvider(),
    // No need to alchemy
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Hackathon Attestation Treasury",
  chains,
});

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export default function App() {
  const [activeContent, setActiveContent] = useState(2);

  return (
    <AppWrapper>
      <WagmiConfig client={client}>
        <RainbowKitProvider chains={chains}>
          <Header
            activeContent={activeContent}
            setActiveContent={setActiveContent}
          />
          <ContentWrapper>
            <Content
              activeContent={activeContent}
              setActiveContent={setActiveContent}
            />
          </ContentWrapper>
        </RainbowKitProvider>
      </WagmiConfig>
    </AppWrapper>
  );
}
