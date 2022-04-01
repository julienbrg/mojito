import React, { useState, useEffect } from "react";
import { useEthers, useLookupAddress } from "@usedapp/core";

export const Network = () => {

    const [networkMsg, setNetworkMsg] = useState("")

    const ens = useLookupAddress();
    const { chainId, account } = useEthers();

    useEffect(() => {
        if (chainId === 4) {
            setNetworkMsg("Rinkeby ✅");
        } else {
            setNetworkMsg("Please switch to Rinkeby 🌈");
        }
    },[chainId, setNetworkMsg]);
    
    return (
        <p>
            {!!!account || ens ? "" : networkMsg} 
        </p>
    );
}