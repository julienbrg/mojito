import { Button } from "./";
import React from 'react'
import { utils } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useContractFunction, useEthers} from '@usedapp/core'
import { Erc721 } from '../../gen/types'
import { addresses, abis } from "@my-app/contracts";

const nftInterface = new utils.Interface(abis.erc721)
const nftContract = new Contract(addresses.erc721, nftInterface) as Erc721

export const Mint = () => {

    const { account } = useEthers();

    const { state, send } = useContractFunction(nftContract, 'safeMint')
    const onTx = async () => {
        await send(
            account as any,
            "https://ipfs.io/ipfs/bafybeib3shisi64rroc2oedae2ehtzmtua2l4yhatiexihs6cogllnwqvm/lode-runner.json"
        )
    }

    console.log(state)

    return (
        <Button onClick={onTx}>
        Mint
        </Button>
    );
}