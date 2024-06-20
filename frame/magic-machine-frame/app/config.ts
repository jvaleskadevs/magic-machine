import { Abi, Address } from 'viem';
import { mintAbi } from './abis/mintAbi';

const LOCALHOST = 'http://localhost:3000';
const DOMAIN_URL = 'https://magic-machine-five.vercel.app';
export const URL: string = process.env.NODE_ENV === 'development' ? LOCALHOST : DOMAIN_URL;


type ContractData = {
  abi: Abi,
  address: Address
}

// base Sepolia contracts
export const MINT: ContractData = {
  abi: mintAbi,
  address: '0xA8970362E763a4c7d3B3b58180471a37eD207209'
}
