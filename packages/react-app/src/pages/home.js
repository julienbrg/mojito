import { useEffect, useState } from "react";
import { Body, Container, Header } from "../components";
import { Mint } from '../components/mint'
import { Button } from '@chakra-ui/react'
import { Contract } from '@ethersproject/contracts'
import { useEthers, useCall, shortenAddress, useLookupAddress} from '@usedapp/core'
import { addresses, abis } from "@my-app/contracts";
import { Loader } from "../components";
import loader from "../assets/reggae-loader.svg";

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

  const { value: isRegisteredRaw } =

  useCall({
  contract: new Contract(addresses.silo, abis.silo),
  method: "isAddressExist",
  args: (account === null || account === undefined) ? ["0x0000000000000000000000000000000000000000"] : [account],
  }) ?? {};
  
    if (isRegisteredRaw) {
      var isRegistered = isRegisteredRaw[0]
    }

  return (
    <Container>
      <Header>
        <WalletButton />
      </Header>
      <Body>

        {isRegistered === undefined && <Loader src={loader}/>}
        {isRegistered === true && <p>You are registered! ✨</p>}
        {isRegistered === false && <p>You are NOT registered.</p>}

        <Mint />

      </Body>
    </Container>
  );
}