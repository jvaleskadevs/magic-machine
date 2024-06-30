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

  const targetUrl = `${URL}/api/frame/chain`;
  return new NextResponse(getFrameHtmlResponse({
    buttons: [
      {
        //action: 'tx',
        label: 'Find art',
        target: targetUrl,
        //postUrl: `${URL}/api/tx-success`
      },
      {
        //action: 'tx',
        label: 'Find art x3',
        target: targetUrl,
        //postUrl: `${URL}/api/tx-success`
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
