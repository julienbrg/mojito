import "./index.css";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { DAppProvider, Rinkeby } from '@usedapp/core'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'
import { NftProvider } from "use-nft"
import { getDefaultProvider } from "ethers"


const config = {
  readOnlyChainId: Rinkeby.chainId,
  readOnlyUrls: {
    [Rinkeby.chainId]: "https://rinkeby.infura.io/v3/" + process.env.REACT_APP_INFURA_PROJECT_ID,
  },
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/3211/nft-subgraph/v0.0.3",
});

// TODO: replace with DAppProvider (useDapp)
const ethersConfig = {
  provider: getDefaultProvider(config.readOnlyUrls[Rinkeby.chainId]),
}

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <DAppProvider config={config}>
        <ApolloProvider client={client}>
          <BrowserRouter>
            <NftProvider fetcher={["ethers", ethersConfig]}>
              <App />
            </NftProvider>
          </BrowserRouter>
        </ApolloProvider>
      </DAppProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
