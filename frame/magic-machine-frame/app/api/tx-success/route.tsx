import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { getTxDetails } from '../../lib/tx';
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
  
  const hash: `0x${string}` = `${body?.untrustedData?.transactionId || '0x'}` as `0x${string}`;
  console.log(hash);
  const txReceipt = hash !== '0x' ? await getTxDetails(hash) : undefined;
  
  //const contract = req.nextUrl.searchParams.get('nft') ?? '';
  
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          action: 'link',
          label: 'View artwork',
          target: `https://opensea.io/assets/base/`
        },
        {
          action: 'link',
          label: 'View in Explorer',
          target: `https://sepolia.basescan.org/${body?.untrustedData?.transactionId || ''}`
        },
      ],
      image: {
        src: `${URL}/success.jpeg`,
        aspectRatio: '1:1'
      },
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
