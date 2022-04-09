import {Link } from "react-router-dom";
import { shortenAddress, useEthers, useLookupAddress } from "@usedapp/core";
import { useEffect, useState } from "react";
import { Body, Container, Header } from "../components";
import { FetchData } from '../components/fetch'
import { Button } from '@chakra-ui/react'

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

export function NotFound() {
    return (
      <Container>
        <Header>
          <WalletButton />
        </Header>
        <Body>
          <FetchData />
            <p>There's nothing here.</p>
            <nav>
            <Link to="/">Take me home</Link>
            </nav>
        </Body>
      </Container>
    );
  }

  