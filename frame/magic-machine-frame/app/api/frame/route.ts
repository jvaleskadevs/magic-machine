import { getFrameHtmlResponse, FrameTransactionResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import {
  init,
  validateFramesMessage,
  ValidateFramesMessageInput,
  ValidateFramesMessageOutput,
} from '@airstack/frames';
import { Address, encodeFunctionData, parseEther, toHex } from 'viem';
import { baseSepolia } from 'viem/chains';
import { MINT, URL } from '../../config';
import { Errors } from '../../errors';

init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY ?? '');

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: ValidateFramesMessageInput = await req.json();
  const { isValid, message } = await validateFramesMessage(body);
  
  if (!isValid) return new NextResponse(Errors.NoValidMessage);

  //const fid: number | undefined = message?.data?.fid || undefined;
  const action = message?.data?.frameActionBody || undefined;
  
  //console.log(toHex(action?.castId?.hash ?? ''));
  
  //const text = action?.inputText?.[0] || '';
 
  if (action?.buttonIndex === 1) {   
    // build transaction data   
    const data = encodeFunctionData({
      abi: MINT.abi,
      functionName: 'distributeRandomItem'
    });
    
    const txData: FrameTransactionResponse = {
      chainId: `eip155:${baseSepolia.id}`,
      method: 'eth_sendTransaction',
      params: {
        abi: MINT.abi,
        data,
        to: MINT.address,
        value: parseEther('0.000777').toString()
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
        postUrl: `${URL}/api/frame/tx-success?nft=${MINT.address}`
      }
    ],
    image: {
      src: `${URL}/wave_0.png`,
      aspectRatio: '1:1'
    },
    postUrl: targetUrl
  }));
  
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
