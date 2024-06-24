import { getFrameHtmlResponse, FrameTransactionResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import {
  init,
  validateFramesMessage,
  ValidateFramesMessageInput
} from '@airstack/frames';
import { Address, encodeFunctionData, toHex } from 'viem';
import { baseSepolia } from 'viem/chains';
import { fromBytes } from 'viem';
import { MACHINE, MULTIPRICE, MULTIAMOUNT, PRICE, DEGEN, TN100X, DEGEN_PRICE, TN100X_PRICE, URL } from '../../../config';
import { Errors } from '../../../errors';

init(process.env.AIRSTACK_API_KEY ?? '');

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: ValidateFramesMessageInput = await req.json();
  const { isValid, message } = await validateFramesMessage(body);
  if (!isValid) return new NextResponse(Errors.NoValidMessage);

  const action = message?.data?.frameActionBody || undefined;
  
  // deserialize state
  const stateStr: any = fromBytes((action?.state ?? []) as Uint8Array, 'string');
  //?? '{"data":"empty"}';
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
  let to: `0x${string}` = '0x';
  let amount = '0';
  switch (state?.payment ?? 0) {
    case 0:
      break;
    case 1:
      to = DEGEN.address;
      if (state?.amount === 1) {
        amount = DEGEN_PRICE.toString();
      } else if (state?.amount === 3) {
        amount = (DEGEN_PRICE * MULTIAMOUNT).toString();     
      }
      break;
    case 2:
      to = TN100X.address;
      if (state?.amount === 1) {
        amount = TN100X_PRICE.toString();
      } else if (state?.amount === 3) {
        amount = (TN100X_PRICE * MULTIAMOUNT).toString();       
      }
      break;
    default:
      break;    
  }
 
  const data = encodeFunctionData({
    abi: DEGEN.abi,
    functionName: 'approve',
    args: [MACHINE.address, amount]
  });
  
  const txData: FrameTransactionResponse = {
    chainId: `eip155:${baseSepolia.id}`,
    method: 'eth_sendTransaction',
    params: {
      abi: DEGEN.abi,
      data,
      to: to,
      value: '0'
    }
  };
      
  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';