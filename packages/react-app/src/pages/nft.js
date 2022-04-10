import { useParams } from "react-router-dom";
import { Description, Media, Loader } from "../components";
import { Body, Container, Header } from "../components";
// import { FetchData } from '../components/fetch'
import myImage from "../assets/lode-runner.png";
import { Button, Tooltip } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from 'react'
import { useEthers, useCall} from '@usedapp/core'
import { Contract } from '@ethersproject/contracts'
import { addresses, abis } from "@my-app/contracts";
import loader from "../assets/reggae-loader.svg";

function WalletButton() {

  let navigate = useNavigate();

  return (
    
    <Button
    
      onClick={() => {
        navigate(`/`);
      }}
      colorScheme='purple'
      margin= '4'
      size='sm'
      variant='outline'
      >
      Back home
    </Button>
   
  );
  }

  export function Nft() {

  const {address, id } = useParams()

  const { account } = useEthers();

  const { value: name } =
  useCall({
  contract: new Contract(addresses.erc721, abis.erc721),
  method: "name",
  args: [],
  }) ?? {};

  const { value: tokenURI } =
  useCall({
  contract: new Contract(addresses.erc721, abis.erc721),
  method: "tokenURI",
  args: [id],
  }) ?? {};

  const { value: bal } =
  useCall({
  contract: new Contract(addresses.erc721, abis.erc721),
  method: "balanceOf",
  args: (account === null || account === undefined) ? ["0x157555B75fE690351b9199384e3C473cCFb6EFab"] : [account],
  }) ?? {};

  console.log("contract address: ", address)
  console.log("id: ",id)

  // const name = "Lode Runner #1"
  const author = "Julien"
  const description = "I'm a Lode Runner player since the age of six. With this amazing unique screenshot, I wanted to express the harsh of the struggle against the ever-growing threat of machines taking over our lives, a super important issue that mankind is facing today. My character is stuck. Let's just reboot everything."

  return (
    <Container>
      <Header>
        <WalletButton />
      </Header>
      <Body>

        {bal === null || bal === undefined  ? 

        <Loader src={loader}/> : <>

        <h2><strong>{name}</strong></h2>

        <p><i>by</i> <strong><small>{author}</small></strong></p>
        
        <Media src={myImage} />

        <Description>
        <small>{description}</small>
        <br />
        <p><small>id: {id}</small></p>
        <p><small>
        <Tooltip hasArrow label='No good, bro 😿' bg='red.600'>
          < strong style={{ color: 'red' }}>No license detected </strong>
        </Tooltip>

        | Etherscan | OpenSea | Metadata</small></p>

        <br />
        <p>You own <strong>{bal.toString()}</strong> of these.</p>

        <p style={{ color: '#8c1c84' }}><small>{tokenURI}</small></p>

        </Description></>}        
        
      </Body>
    </Container>
  );
}

  