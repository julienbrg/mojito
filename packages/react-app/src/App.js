// import { useQuery } from "@apollo/client";
import { Contract } from "@ethersproject/contracts";
import { shortenAddress, useCall, useEthers, useLookupAddress } from "@usedapp/core";
import React, { useEffect, useState } from "react";

import { Body, Button, Container, Header, Image, Link } from "./components";
import logo from "./mojito.jpg";

import { addresses, abis } from "@my-app/contracts";
// import GET_TRANSFERS from "./graphql/subgraph";

function WalletButton() {
  const [rendered, setRendered] = useState("");

  const ens = useLookupAddress();
  const { account, activateBrowserWallet, deactivate, error } = useEthers();

  useEffect(() => {
    if (ens) {
      setRendered(ens);
    } else if (account) {
      setRendered(shortenAddress(account));
    } else {
      setRendered("");
    }
  }, [account, ens, setRendered]);

  useEffect(() => {
    if (error) {
      console.error("Error while connecting wallet:", error.message);
    }
  }, [error]);

  return (
    <Button
      onClick={() => {
        if (!account) {
          activateBrowserWallet();
        } else {
          deactivate();
        }
      }}
    >
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </Button>
  );
}

// TODO: check if user is connected to Rinkeby

function App() {

  // console.log(addresses.erc721)

  const { value: bal } =
  useCall({
      contract: new Contract(addresses.erc721, abis.erc721),
      method: "balanceOf",
      args: ["0xbFBaa5a59e3b6c06afF9c975092B8705f804Fa1c"],
  }) ?? {};

  // const { loading, error: subgraphQueryError, data } = useQuery(GET_TRANSFERS);

  // useEffect(() => {
  //   if (subgraphQueryError) {
  //     console.error("Error while querying subgraph:", subgraphQueryError.message);
  //     return;
  //   }
  //   if (!loading && data && data.transfers) {
  //     console.log({ transfers: data.transfers });
  //   }
  // }, [loading, subgraphQueryError, data]);

  // TODO: add a loader

  return (
    <Container>
      <Header>
        <WalletButton />
      </Header>
      <Body>
        <Image src={logo} alt="cocktail" />< br />
        <Button >
          <strong>Cheers!</strong>
        </Button>< br />
        
        {bal && <p><strong>{bal.toString()}</strong></p>}
        
        <p>Hello Web3! 🎉</p>< br/>
        <Link href="https://strat.cc">Strat</Link>
      </Body>
    </Container>
  );
}

export default App;
