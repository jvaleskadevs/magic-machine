import { getFrameHtmlResponse, FrameTransactionResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import {
  init,
  validateFramesMessage,
  ValidateFramesMessageInput
} from '@airstack/frames';
import { Address, encodeFunctionData, toHex } from 'viem';
import { baseSepolia } from 'viem/chains';
import { MACHINE, MULTIPRICE, MULTIAMOUNT, PRICE, URL } from '../../config';
import { Errors } from '../../errors';

init(process.env.AIRSTACK_API_KEY ?? '');

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: ValidateFramesMessageInput = await req.json();
  const { isValid, message } = await validateFramesMessage(body);
  if (!isValid) return new NextResponse(Errors.NoValidMessage);

  const action = message?.data?.frameActionBody || undefined;
 
  if (action?.buttonIndex === 1) {
    const data = encodeFunctionData({
      abi: MACHINE.abi,
      functionName: 'distributeRandomItem'
    });
    
    const txData: FrameTransactionResponse = {
      chainId: `eip155:${baseSepolia.id}`,
      method: 'eth_sendTransaction',
      params: {
        abi: MACHINE.abi,
        data,
        to: MACHINE.address,
        value: PRICE
      }
    };
        
    return NextResponse.json(txData);    
  } else if (action?.buttonIndex === 2) {
    const data = encodeFunctionData({
      abi: MACHINE.abi,
      functionName: 'distributeRandomItems',
      args: [MULTIAMOUNT]
    });
    
    const txData: FrameTransactionResponse = {
      chainId: `eip155:${baseSepolia.id}`,
      method: 'eth_sendTransaction',
      params: {
        abi: MACHINE.abi,
        data,
        to: MACHINE.address,
        value: MULTIPRICE
      }
    };
        
    return NextResponse.json(txData);    
  }
 
  const targetUrl = `${URL}/api/frame`;
  return new NextResponse(getFrameHtmlResponse({
    buttons: [
      {
        action: 'tx',
        label: 'Random Mint',
        target: targetUrl,
        postUrl: `${URL}/api/tx-success`
      },
      {
        action: 'tx',
        label: 'Random Mint x3',
        target: targetUrl,
        postUrl: `${URL}/api/tx-success`
      }
    ],
    image: {
      src: `${URL}/intro.jpeg`,
      aspectRatio: '1:1'
    },
    postUrl: targetUrl
  }));
  
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
