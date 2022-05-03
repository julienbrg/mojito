import { useEffect, useState } from "react";
import { Body, Container, Header } from "../components";
import { Mint } from '../components/mint'
// import { FetchData } from '../components/fetch'
import { Image } from "../components";
import { Button } from '@chakra-ui/react'
import { Contract } from '@ethersproject/contracts'
import myImage from "../assets/lode-runner.png";
import { useEthers, useCall, shortenAddress, useLookupAddress} from '@usedapp/core'
import { addresses, abis } from "@my-app/contracts";

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
      colorScheme='purple'
      margin= '4'
      size='sm'
      variant='outline'
      >
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </Button>
  );
}

export function Home() {

    const { account } = useEthers();

    const { value: bal } =
    useCall({
    contract: new Contract(addresses.erc721, abis.erc721),
    method: "dai",
    args: [],
    }) ?? {};

    //regarder si on est enregistré avec la fonction

    return (
      <Container>
        <Header>
          <WalletButton />
        </Header>
        <Body>
          


          {bal === null || bal === undefined ? <p>You are not registered.</p> : <p>You are registered.</p> }

          <Mint />
          {/* <FetchData /> */}
        </Body>
      </Container>
    );
  }