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
  
  const amount = req.nextUrl.searchParams.get('amount') ?? state?.amount ?? 1;
  const payment = req.nextUrl.searchParams.get('payment') ?? state?.payment ?? 
    action?.buttonIndex === 1 
      ? 0 : action?.buttonIndex === 2 
        ? 1 : action?.buttonIndex === 3 
          ? 2 : 0;        
  
  console.log(amount);
  console.log(payment);
  
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
      src: `${URL}/approvemint.jpeg`,
      aspectRatio: '1:1'
    },
    postUrl: `${URL}/api/frame/distribute?amount=${amount}&payment=${payment}`,
    state: {
      amount: typeof amount === 'string' ? (parseInt(amount) ?? '1') : amount ?? 1,
      payment: typeof payment === 'string' ? (parseInt(payment) ?? '0') : payment ?? 0,
    }
  }));  
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
