import { useEthers } from "@usedapp/core";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import GET_TRANSFERS from "../graphql/subgraph";

export function FetchData() {

    const [userBal, setUserBal] = useState()
  
    const { loading, error: subgraphQueryError, data } = useQuery(GET_TRANSFERS);
    const { account } = useEthers();
  
    useEffect(() => {
        
        if (subgraphQueryError) {
            console.error("Error while querying subgraph:", subgraphQueryError.message);
            return;
        }
          
        if (!loading && data && data.users) {
            console.log("✅ data from subgraph: ", data);
            for (var i = 0; i < data.users.length; i++) {
                if (account === data.users[i].id ) {
                    setUserBal(data.users[i].tokens.length)
                    console.log("userBal: ", userBal);
                }
            }
        }
    }, [loading, subgraphQueryError, data, account, setUserBal, userBal])
  
    return (
      // <>1</>
      <p>1</p>
    )
  }