import { Abi, Address, parseEther } from 'viem';
import { machineAbi } from './abis/mintAbi';
import { erc20Abi } from './abis/erc20Abi';

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
  address: '0x2ACDEe0636B57961f007ac74EfFCb76ad60A33D4'//'0xe9c39E6A0e083A4cF823b19d6304EB2B4A273B75'
}

export const DEGEN: ContractData = {
  abi: erc20Abi,
  address: '0x012e2725400D3480D9Bc6E71cB36e07CE094ef62' // 0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed
}

export const TN100X: ContractData = {
  abi: erc20Abi,
  address: '0x012e2725400D3480D9Bc6E71cB36e07CE094ef62' // 0x5B5dee44552546ECEA05EDeA01DCD7Be7aa6144A
}

export const PRICE = parseEther('0.000777').toString();
export const DEGEN_PRICE = parseEther('420');
export const TN100X_PRICE = parseEther('420');
export const MULTIAMOUNT = BigInt(3);
export const MULTIPRICE = (parseEther('0.000777') * MULTIAMOUNT).toString();

