import { useEthers } from "@usedapp/core";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import GET_TRANSFERS from "../graphql/subgraph";
import { ethers } from "ethers"

export function FetchData() {

    const [userBal , setUserBal] = useState<number[]>()
  
    const { loading, error: subgraphQueryError, data } = useQuery(GET_TRANSFERS);
    const { account } = useEthers();
    
    useEffect(() => {

        if (account) {
            
            let usersAddresses : number[] = [];
            
            if (subgraphQueryError) {
                console.error("Error while querying subgraph:", subgraphQueryError.message);
                return;
            }
            
            if (!loading && data && data.users) {
                console.log("✅ data from subgraph: ", data);
                
                for (var i = 0; i < data.users.length; i++) {

                    if (ethers.utils.getAddress(account as any) === ethers.utils.getAddress(data.users[i].id) ) {
                        usersAddresses.push(data.users[i].tokens.length)
                        // console.log("data.users[i].tokens.length: ", data.users[i].tokens.length);
                    }
                }
                // console.log(usersAddresses)
                setUserBal(usersAddresses)
            }
        }
    }, [loading, subgraphQueryError, data, account])

    console.log("✅ user balance: ", userBal?.[0] )
  
    return (
        <>[subgraph] You own {userBal?.[0]} of these.</>
    )
}