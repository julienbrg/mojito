import { Button } from "./";
import React from 'react'
import { utils } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useContractFunction, useEthers} from '@usedapp/core'
import { Erc721 } from '../../gen/types'
import { addresses, abis } from "@my-app/contracts";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';

const nftInterface = new utils.Interface(abis.erc721)
const nftContract = new Contract(addresses.erc721, nftInterface) as Erc721

export const Mint = () => {

    const { account } = useEthers();

    const { state, send } = useContractFunction(nftContract, 'safeMint')
    const onTx = async () => {

    // TODO: Fix .env
    function getAccessToken() {
        console.log("getAccessToken ✅")
        console.log("process.env.REACT_APP_WEB3STORAGE_TOKEN = ", process.env.REACT_APP_WEB3STORAGE_TOKEN, "😿")
            
        // return process.env.REACT_APP_WEB3STORAGE_TOKEN;
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEVFYkNDMTBGMDE2MUM1YzU4YzE5MmM3RjgxZmIzRjVGNDhmZDAwQkYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDgyOTU2NDA5NzcsIm5hbWUiOiJTcGVhcm1pbnQifQ.duFDn6u1LA7dYPFLZDI6cEvbfFEoS272PvdC4nT6U6g";
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
            "value": "Spearmint"
            },
            {
            "trait_type": "License type",
            "value": "Private use" // add the license type here e.g. "Public use for all purposes + Right to adapt + Right to add a logo + Merchandising rights"
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
        account as any,
        uri
    )
    }

    return (
        <div>
        <Button onClick={onTx}>
        Mint
        </Button> 
        <small>Status: <strong>{state.status}</strong></small>
        </div>
    );
}