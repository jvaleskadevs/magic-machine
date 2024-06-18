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
  address: '0x1b8B03327D0a2b2e222BCE579664311617f013d7'
}
