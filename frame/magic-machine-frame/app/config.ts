import { Abi, Address, parseEther } from 'viem';
import { machineAbi } from './abis/mintAbi';

const LOCALHOST = 'http://localhost:3000';
const DOMAIN_URL = 'https://magic-machine-five.vercel.app';
export const URL: string = process.env.NODE_ENV === 'development' ? LOCALHOST : DOMAIN_URL;


type ContractData = {
  abi: Abi,
  address: Address
}

// base Sepolia contracts
export const MACHINE: ContractData = {
  abi: machineAbi,
  address: '0xEFC1d83C9c83433ada878207f4E7690189D17c8C'
}

export const PRICE = parseEther('0.000777').toString();
export const MULTIPRICE = (parseEther('0.000777') * BigInt(3)).toString();
