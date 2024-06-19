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
  address: '0x585077dEa6FBcDEbAA0D405756B7D3645b00e977'
}
