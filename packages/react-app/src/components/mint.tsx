import { Link, Loader, Image } from "./";
import { formatEther } from '@ethersproject/units'
import React, { useEffect } from 'react'
import { utils, BigNumber } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useContractFunction, useEthers, useCall, useEtherBalance} from '@usedapp/core'
import { Erc721 } from '../../gen/types'
import { addresses, abis } from "@my-app/contracts";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
import loader from "../assets/reggae-loader.svg";
import myImage from "../assets/lode-runner.png";
import { FaEthereum } from 'react-icons/fa';
import {Button, useToast } from '@chakra-ui/react'

const nftInterface = new utils.Interface(abis.erc721)
const nftContract = new Contract(addresses.erc721, nftInterface) as Erc721

export const Mint = () => {

    // const ens = useLookupAddress();
    const { account, chainId } = useEthers();
    const toast = useToast()
    const userBalance = useEtherBalance(account, { chainId })

    const { state, send } = useContractFunction(nftContract, 'safeMint')
    const onTx = async () => {

        if (account === null || account === undefined) {

            toast({
                position: "bottom-left",
                title: "Disconnected 😿",
                description: "It seems like you're not connected. Please click on the Connect Wallet' button.",
                status: "warning",
                duration: 5000,
                isClosable: true,
              })

            return (
                <></>
            )
        }

        if (chainId !== 4) {

            toast({
                position: "bottom-left",
                title: "Wrong network 🌈",
                description: "Please switch your network to Rinkeby ",
                status: "warning",
                duration: 2000,
                isClosable: true,
              })

            return (
                <></>
            )
        }

        const formatter = new Intl.NumberFormat('en-us', {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
          })

        const formatBalance = (balance: BigNumber | undefined) =>
        formatter.format(parseFloat(formatEther(balance ?? BigNumber.from('0'))))

        if (formatBalance(userBalance) as any < 0.001) {
            
            toast({
                position: "bottom-left",
                title: "Insufficient funds 💰",
                description: "You need a handful of Rinkeby ETH to mint your NFT.",
                status: "error",
                duration: 3000,
                isClosable: true,
              })

            return (
                <></>
            )
        }

        function getAccessToken() {
            console.log("✅ getAccessToken")            
            return process.env.REACT_APP_WEB3STORAGE_TOKEN;
        }
        
        function makeStorageClient() {
            console.log("✅ makeStorageClient");
            return new Web3Storage({ token: getAccessToken() });
        }
        
        function makeFileObjects() {
            console.log("✅ makeFileObjects");
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
            console.log("✅ storeFiles");
            const client = makeStorageClient();
            const cid = await client.put(files);
            console.log('✅ stored files with CID: ', cid, "🎉");
            return cid;
        }
        
        console.log("👋 Hello! ");
        makeStorageClient();
        const uri = await storeFiles(makeFileObjects()) + "/lode-runner.json";
        console.log("✅ uri: ", uri );

        console.log("✅ nft contract address: ", nftContract.address)

        await send(
            // TODO: check the type of an address
            account as any,
            uri
        )
    }

    useEffect(() => {
        if (state.transaction?.hash) {
            if (state.status === "Success") {
                console.log("✅ tx hash: ", state.transaction?.hash)
                toast({
                position: "top-left",
                title: "Success 🎉",
                description: "You just minted an NFT! Here's your tx hash my friend: " + state.transaction?.hash + ". Thank you for using Mojito app.",
                status: "success",
                duration: 8000,
                isClosable: true,
              })
            }
        }
      }, [state.transaction?.hash, toast, state.status]);

    const txHash = state.transaction?.hash
    const etherscanUrl = "https://rinkeby.etherscan.io/tx/" + txHash

    const { value: bal } =
    useCall({
    contract: new Contract(addresses.erc721, abis.erc721),
    method: "balanceOf",
    args: (account === null || account === undefined) ? ["0x157555B75fE690351b9199384e3C473cCFb6EFab"] : [account],
    }) ?? {};
    
    const { value: supply } =
    useCall({
    contract: new Contract(addresses.erc721, abis.erc721),
    method: "totalSupply",
    args: [] 
    }) ?? {};

    const id = Number(supply) - 1
    const openseaUrl = "https://testnets.opensea.io/assets/0x61681514ea040d19dc4279301adc10bf654d886a/"+ id

    return (

        <>
        <h3>Mojito App v1</h3>

        <Image src={myImage} />

        {/* {!!!account || ens ? <p>Please connect your wallet.</p> : <p></p>} */}
        {bal === null || bal === undefined ? <p></p> : <p>You own <strong>{bal.toString()}</strong> of these.</p> }
        
        {state.status === "Mining" || state.status === "PendingSignature" ? 
        <Loader src={loader}/> : 
        
        <Button 
            onClick={onTx}
            leftIcon={<FaEthereum />}
            colorScheme='purple'
            margin= '4'
            size='md'
            variant='outline'
            >Mint
        </Button>}

        {state.status === "Success" && <><Link href={openseaUrl}>{openseaUrl}</Link>
        <Link href={etherscanUrl}>{etherscanUrl} </Link></>}

        </>
    )
}
