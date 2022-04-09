import {Link, useParams } from "react-router-dom";
import { Image } from "../components";
import { shortenAddress, useEthers, useLookupAddress } from "@usedapp/core";
import { useEffect, useState } from "react";
import { Body, Container, Header } from "../components";
// import { FetchData } from '../components/fetch'
import myImage from "../assets/lode-runner.png";
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

  export function Nft() {

  const {address, id } = useParams()

  const name = "Lode Runner #1"

  // const txHash = state.transaction?.hash
  // console.log("state: ", state.transaction )
  // const etherscanUrl = "https://rinkeby.etherscan.io/tx/" + txHash
  // const id = Number(supply) - 1
  // const openseaUrl = "https://testnets.opensea.io/assets/0x61681514ea040d19dc4279301adc10bf654d886a/"+ id

  return (
    <Container>
      <Header>
        <WalletButton />
      </Header>
      <Body>

        <h3>{name}</h3>
        
        <Image src={myImage} />
        <br />
        <p>NFT address: {address}</p>
        <p>NFT ID: {id}</p>
        {/* <FetchData /> */}

        {/* {state.status === "Success" && <><Link href={openseaUrl}>{openseaUrl}</Link>
        <Link href={etherscanUrl}>{etherscanUrl} </Link></>} */}

        {/* {bal === null || bal === undefined ? <p></p> : <p>You own <strong>{bal.toString()}</strong> of these.</p> }

        {state.status === "Success" && <><Link href={openseaUrl}>{openseaUrl}</Link>
        <Link href={etherscanUrl}>{etherscanUrl} </Link></>} */}
        
        <nav>
          <Link to="/">Home</Link>
        </nav>
      </Body>
    </Container>
  );
}

  