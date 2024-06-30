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
  
  let amount = parseInt(req.nextUrl.searchParams.get('amount') ?? '') ?? undefined;
  //console.log(amount);
  if (!amount) amount = state?.amount ?? 1;
  //console.log(amount);
  
  let chain = parseInt(req.nextUrl.searchParams.get('chain') ?? '') ?? undefined;
  //console.log(chain);
  if (!chain) chain = state?.chain ?? 1;
  //console.log(chain);  
  
  let payment = parseInt(req.nextUrl.searchParams.get('payment') ?? '') ?? undefined;
  //console.log(payment);
  if (!payment) payment = state?.payment ?? undefined;  
  //console.log(payment);
  if (!payment) payment = action?.buttonIndex === 1 
      ? 0 : action?.buttonIndex === 2 
        ? 1 : action?.buttonIndex === 3 
          ? 2 : 0;
  //console.log(payment);
  
  const targetApprove = `${URL}/api/frame/tx-approve`;
  const targetDistribute = `${URL}/api/frame/tx-distribute`;
  
  return new NextResponse(getFrameHtmlResponse({
    buttons: payment === 0 ? [
      {
        action: 'tx',
        label: 'Mint',
        target: targetDistribute,
        postUrl: `${URL}/api/tx-success`
      }    
    ] : [
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
    postUrl: `${URL}/api/frame/distribute?amount=${amount}&chain=${chain}&payment=${payment}`,
    state: {
      amount: typeof amount === 'string' ? (parseInt(amount) ?? '1') : amount ?? 1,
      chain: typeof chain === 'string' ? (parseInt(chain) ?? '0') : chain ?? 0,
      payment: typeof payment === 'string' ? (parseInt(payment) ?? '0') : payment ?? 0      
    }
  }));  
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
