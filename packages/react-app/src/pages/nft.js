import { useParams } from "react-router-dom";
import { Description, Media, Details } from "../components";
import { Body, Container, Header } from "../components";
// import { FetchData } from '../components/fetch'
import myImage from "../assets/lode-runner.png";
import { Button } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";


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

  console.log("contract address: ", address)

  console.log("id: ",id)

  const name = "Lode Runner #1"
  const author = "Julien"
  const description = "I'm a Lode Runner player since the age of six. With this amazing unique screenshot, I wanted to express the harsh of the struggle against the ever-growing threat of machines taking over our lives, a super important issue that mankind is facing today. My character is stuck. Let's just reboot everything."

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

        <h2><strong>{name}</strong></h2>
        <p><i>by</i> <strong><small>{author}</small></strong></p>
        
        <Media src={myImage} />

        <Description>
        <small>{description}</small>
        <br />
        <p><small>id: {id}</small></p>
        </Description>
        
        <Details>
        
        
        </Details>
        {/* <FetchData /> */}

        {/* {state.status === "Success" && <><Link href={openseaUrl}>{openseaUrl}</Link>
        <Link href={etherscanUrl}>{etherscanUrl} </Link></>} */}

        {/* {bal === null || bal === undefined ? <p></p> : <p>You own <strong>{bal.toString()}</strong> of these.</p> }

        {state.status === "Success" && <><Link href={openseaUrl}>{openseaUrl}</Link>
        <Link href={etherscanUrl}>{etherscanUrl} </Link></>} */}
        
      </Body>
    </Container>
  );
}

  