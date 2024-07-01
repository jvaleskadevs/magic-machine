import { getFrameHtmlResponse, FrameTransactionResponse, FrameTransactionEthSendParams } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import {
  init,
  validateFramesMessage,
  ValidateFramesMessageInput
} from '@airstack/frames';
import { Address, encodeFunctionData, toHex } from 'viem';
import { base, zora } from 'viem/chains';
import { fromBytes } from 'viem';
import { MACHINE, MACHINE_ZORA, MULTIPRICE, MULTIAMOUNT, PRICE, DEGEN_PRICE, TN100X_PRICE, URL } from '../../../config';
import { Errors } from '../../../errors';

init(process.env.AIRSTACK_API_KEY ?? '');

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: ValidateFramesMessageInput = await req.json();
  const { isValid, message } = await validateFramesMessage(body);
  if (!isValid) return new NextResponse(Errors.NoValidMessage);

  const action = message?.data?.frameActionBody || undefined;
  
  // deserialize state
  const stateStr: any = fromBytes((action?.state ?? []) as Uint8Array, 'string');

  let state: any;
  if (stateStr) {
    try {
      state = JSON.parse(decodeURIComponent(stateStr.replace(/\+/g,  " ")));
    } catch (err) {
      console.log(err);
    }
  }
  console.log(state);
 
  let functionName = ''; 
  let price = '0';
  let args;
  let gas = '169420';
  switch (state?.payment) {
    case 0:
      if (state?.amount === 1) {
        functionName = 'distributeRandomItem';
        price = PRICE;
      } else if (state?.amount === 3) {
        functionName = 'distributeRandomItems';
        price = MULTIPRICE;     
        args = [MULTIAMOUNT]; 
        gas = '469420';
      }
      break;
    case 1:
      if (state?.amount === 1) {
        functionName = 'distributeRandomItemDegen';
      } else if (state?.amount === 3) {
        functionName = 'distributeRandomItemsDegen';
        args = [MULTIAMOUNT];  
        gas = '469420'; 
      }
      break;
    case 2:
      if (state?.amount === 1) {
        functionName = 'distributeRandomItemTN100x';
      } else if (state?.amount === 3) {
        functionName = 'distributeRandomItemsTN100x';
        args = [MULTIAMOUNT];   
        gas = '469420';
      }
      break;
    default:
      if (state?.amount === 1) {
        functionName = 'distributeRandomItem';
        price = PRICE;
      } else if (state?.amount === 3) {
        functionName = 'distributeRandomItems';
        price = MULTIPRICE;   
        args = [MULTIAMOUNT];
        gas = '469420';
      }
      break;    
  }
  console.log(functionName);
  console.log(price);
  console.log(args);
  
  if (functionName != 'distributeRandomItem') {
    return new NextResponse(Errors.NoValidMessage); 
  }
 
  const data = encodeFunctionData({
    abi: MACHINE.abi,
    functionName: functionName,
    args: args ? [args] : undefined
  });
  
  const txData: FrameTransactionResponse & { attribution: boolean } = {
    chainId: `eip155:${state?.chain === 1 ? zora.id : base.id}`,
    method: 'eth_sendTransaction',
    attribution: false,
    params: {
      abi: MACHINE.abi,
      data,
      to: state?.chain === 1 ? MACHINE_ZORA : MACHINE.address,
      value: price,
      gas
    } as FrameTransactionEthSendParams & { gas: string }
  };
      
  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
