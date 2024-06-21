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
  address: '0x1b9d13c9acA71363cC0E336D01d9749B831995F3'
}

export const PRICE = parseEther('0.000777').toString();
