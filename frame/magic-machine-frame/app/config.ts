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
  address: '0xe9c39E6A0e083A4cF823b19d6304EB2B4A273B75'
}

export const PRICE = parseEther('0.000777').toString();
export const MULTIAMOUNT = BigInt(3);
export const MULTIPRICE = (parseEther('0.000777') * MULTIAMOUNT).toString();

