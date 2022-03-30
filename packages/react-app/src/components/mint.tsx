import { Button, Link, Loader, Image } from "./";
import React from 'react'
import { utils } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useContractFunction, useEthers, useCall} from '@usedapp/core'
import { Erc721 } from '../../gen/types'
import { addresses, abis } from "@my-app/contracts";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
import loader from "../assets/reggae-loader.svg";
import myImage from "../assets/lode-runner.png";

const nftInterface = new utils.Interface(abis.erc721)
const nftContract = new Contract(addresses.erc721, nftInterface) as Erc721

export const Mint = () => {

    const { account } = useEthers();

    const { state, send } = useContractFunction(nftContract, 'safeMint')
    const onTx = async () => {

    function getAccessToken() {
        console.log("getAccessToken ✅")            
        return process.env.REACT_APP_WEB3STORAGE_TOKEN;
    }
      
    function makeStorageClient() {
        console.log("makeStorageClient ✅ ");
        return new Web3Storage({ token: getAccessToken() });
    }
    
    function makeFileObjects() {
        console.log("makeFileObjects ✅ ");
        const obj = {
        "name": "Lode Runner #1",
        "author": "Julien",
        "description": "I'm a Lode Runner player since the age of six. With this amazing unique screenshot, I wanted to express the harsh of the struggle against the ever-growing threat of machines taking over our lives, a super important issue that mankind is facing today. My character is stuck. Let's just reboot everything.",
        "size": "708 by 762 pixels",
        "media_format": "jpg",
        "image": "https://bafkreifmcnnbun3avt2pigr2m2e46pqtftlilcz7a3cn2zhgzvppttgpm4.ipfs.dweb.link",
        "license": "无", // add the license here
        "attributes": [
            {
            "trait_type": "Minted on",
            "value": "Mojito"
            },
            {
            "trait_type": "License type",
            "value": "无" // add the license type here e.g. "Public use for all purposes + Right to adapt + Right to add a logo + Merchandising rights"
            },
            {
            "trait_type": "Resale rights",
            "value": "8"
            },
            {
            "trait_type": "View licence",
            "value": "无" // add the license here
            }
        ]
        };
        const blob = new Blob([JSON.stringify(obj)], {type : 'application/json'});
    
        const files = [
        new File(['contents-of-file-1'], 'plain-utf8.txt'),
        new File([blob], 'lode-runner.json')
        ];
        return files;
    }
    
    async function storeFiles(files) {
        console.log("storeFiles ✅ ");
        const client = makeStorageClient();
        const cid = await client.put(files);
        console.log('stored files with CID ✅: ', cid, "🎉");
        return cid;
    }
    
    console.log("Hello! 👋 ");
    makeStorageClient();
    const uri = await storeFiles(makeFileObjects()) + "/lode-runner.json";
    console.log("uri: ", uri );

    await send(
        // TODO: check the type of an address
        account as any,
        uri
    )}

    const { value: bal } =

    useCall({
    contract: new Contract(addresses.erc721, abis.erc721),
    method: "balanceOf",
    args: (account === null ||  account === undefined) ? ["0xbFBaa5a59e3b6c06afF9c975092B8705f804Fa1c"] : [account],
    }) ?? {};

    const { value: supply } =

    useCall({
    contract: new Contract(addresses.erc721, abis.erc721),
    method: "totalSupply",
    args: [] 
    }) ?? {};

    const id =+ supply 
    const url = "https://testnets.opensea.io/assets/0x61681514ea040d19dc4279301adc10bf654d886a/"+ id
    
    // TODO: handle sig denied by user
    // TODO: handle insufficient funds error
    // TODO: invite to switch network if not on Rinkeby
    // TODO: form and display Etherscan tx url: https://rinkeby.etherscan.io/tx/0x8820a90ba9e587d2c4f81348124e399b09d20c8fa6ecf2234a42ee42f612ad98 

    return (

        <>
        <h3>Mojito App v1</h3>
        <Image src={myImage} />
        {bal && <p>You own <strong>{bal.toString()}</strong> of these.</p>}
        {state.status === "Mining" || state.status === "PendingSignature" ? 
        <Loader src={loader}/> : 
        
        <Button onClick={onTx}>Mint</Button>}<br />
        {state.status === "Success" && <Link href={url}>{url}</Link>}
        
        </>
    );
}