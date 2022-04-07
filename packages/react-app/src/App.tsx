import { shortenAddress, useEthers, useLookupAddress } from "@usedapp/core";
import { useEffect, useState } from "react";
import { Body, Container, Header } from "./components";
import { Mint } from './components/mint'
import { Button } from '@chakra-ui/react'
import { useQuery } from "@apollo/client";
import GET_TRANSFERS from "./graphql/subgraph";

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

function FetchData() {

  const [userBal, setUserBal] = useState()

  const { loading, error: subgraphQueryError, data } = useQuery(GET_TRANSFERS);
  const { account } = useEthers();
  console.log( "account1: ", account );

  useEffect(() => {

    if (subgraphQueryError) {
      console.error("Error while querying subgraph:", subgraphQueryError.message);
      return;
    }
    
    if (!loading && data && data.users) {
      for (var i = 0; i < data.users.length; i++) {
        
        console.log( "account: ", account );
        console.log( "data.users[i].id: ", data.users[i].id );
        
          // if (account === data.users[i].id ) {
          if (account === "0x8CCbFaAe6BC02a73BBe8d6d8017cC8313E4C90A7" ) {

            setUserBal(data.users[i].tokens.length)
            console.log( userBal, "AND", data.users[i].tokens.length );

          } else {
            console.log( "nope" );
        }
      }
      console.log("✅ fetched data from subgraph")  
    }
  }, [loading, subgraphQueryError, data, account, setUserBal, userBal])

  return (
    // <>1</>
    <p>{userBal}</p>
  )
}

function App() {

  return (
    <Container>
      <Header>
        <WalletButton />
      </Header>
      <Body>
        <Mint />
        <FetchData />
      </Body>
    </Container>
  );
}

export default App;
