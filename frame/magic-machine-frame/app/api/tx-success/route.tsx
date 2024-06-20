import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  /*
  const { isValid } = await getFrameMessage(body);

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }
  */
  console.log(body);
  
  const contract = req.nextUrl.searchParams.get('nft') ?? '';
  
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          action: 'link',
          label: 'View artwork',
          target: `https://opensea.io/assets/base/${contract}`
        },
        {
          action: 'link',
          label: 'View in Explorer',
          target: `https://basescan.org/${body?.untrustedData?.transactionId || ''}`
        },
      ],
      image: {
        src: `${URL}/success.jpeg`,
      },
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
