import "./index.css";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom";

import { DAppProvider, Rinkeby } from '@usedapp/core'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'

const INFURA_PROJECT_ID = "85c7342e76ff4abdba62b31c07c53499";
const config = {
  readOnlyChainId: Rinkeby.chainId,
  readOnlyUrls: {
    [Rinkeby.chainId]: "https://rinkeby.infura.io/v3/" + INFURA_PROJECT_ID,
  },
}

// You should replace this url with your own and put it into a .env file
// See all subgraphs: https://thegraph.com/explorer/

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.thegraph.com/subgraphs/name/paulrberg/create-eth-app",
});

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <DAppProvider config={config}>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </DAppProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
