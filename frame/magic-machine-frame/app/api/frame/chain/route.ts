import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import {
  init,
  validateFramesMessage,
  ValidateFramesMessageInput
} from '@airstack/frames';
import { URL } from '../../../config';
import { Errors } from '../../../errors';

init(process.env.AIRSTACK_API_KEY ?? '');

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: ValidateFramesMessageInput = await req.json();
  const { isValid, message } = await validateFramesMessage(body);
  if (!isValid) return new NextResponse(Errors.NoValidMessage);

  const action = message?.data?.frameActionBody || undefined;
  const amount = action?.buttonIndex === 1 ? 1 : action?.buttonIndex === 2 ? 3 : 0;
  const targetUrl = `${URL}/api/frame/payment`;
  
  return new NextResponse(getFrameHtmlResponse({
    buttons: [
      {
        label: 'Base',
        target: targetUrl
      },
      {
        label: 'Zora',
        target: targetUrl
      }
    ],
    image: {
      src: `${URL}/chain.jpeg`,
      aspectRatio: '1:1'
    },
    postUrl: targetUrl,
    state: {
      amount
    }
  }));
  
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
