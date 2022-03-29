// import { useQuery } from "@apollo/client";
import { Contract } from "@ethersproject/contracts";
import { shortenAddress, useCall, useEthers, useLookupAddress } from "@usedapp/core";
import React, { useEffect, useState } from "react";
import { Body, Button, Container, Header, Image, Link } from "./components";
import { addresses, abis } from "@my-app/contracts";
// import GET_TRANSFERS from "./graphql/subgraph";
import logo from "./lode-runner.png";
import { Mint } from './components/mint'
// import { OwnerOf } from './components/ownerOf'

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

function App() {
  
  const { account } = useEthers();
  
  const { value: bal } =
    useCall({
      contract: new Contract(addresses.erc721, abis.erc721),
      method: "balanceOf",
      args: [account],
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

  return (
    <Container>
      <Header>
        <WalletButton />
      </Header>
      <Body>

        <p>Hello Web3! 🎉</p>
        <Image src={logo} />< br />
        <Mint />
        {bal && <p>You own <strong>{bal.toString()}</strong> of these.</p>}
        <Link href="https://github.com/julienbrg/mojito">Github</Link>

      </Body>
    </Container>
  );
}

export default App;
