import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import {
  init,
  validateFramesMessage,
  ValidateFramesMessageInput
} from '@airstack/frames';
import { fromBytes } from 'viem';
import { URL } from '../../../config';
import { Errors } from '../../../errors';

init(process.env.AIRSTACK_API_KEY ?? '');

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: ValidateFramesMessageInput = await req.json();
  const { isValid, message } = await validateFramesMessage(body);
  if (!isValid) return new NextResponse(Errors.NoValidMessage);

  const action = message?.data?.frameActionBody || undefined;
  
  const payment = action?.buttonIndex === 1 
    ? 0 : action?.buttonIndex === 2 
      ? 1 : action?.buttonIndex === 3 
        ? 2 : 0;
        
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
  
  const targetApprove = `${URL}/api/frame/tx-approve`;
  const targetDistribute = `${URL}/api/frame/tx-distribute`;
  
  return new NextResponse(getFrameHtmlResponse({
    buttons: [
      {
        action: 'tx',
        label: 'Approve',
        target: targetApprove
      },
      {
        action: 'tx',
        label: 'Mint',
        target: targetDistribute,
        postUrl: `${URL}/api/tx-success`
      }
    ],
    image: {
      src: `${URL}/intro.jpeg`,
      aspectRatio: '1:1'
    },
    postUrl: `${URL}/api/frame/distribute`,
    state: {
      amount: state?.amount ?? 1,
      payment
    }
  }));  
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
