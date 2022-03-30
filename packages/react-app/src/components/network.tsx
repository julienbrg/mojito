import { useEthers} from '@usedapp/core'
import React from "react";

export const Network = (yo) => {

    const { chainId } = useEthers();
    
    return (

        <p>
            {chainId === 4 ? 
            <small>Rinkeby ✅</small> : 
            <small>Please switch to Rinkeby 🌈</small>
            }
        </p>
    );
}