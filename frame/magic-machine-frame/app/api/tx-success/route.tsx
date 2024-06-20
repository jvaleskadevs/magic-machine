import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { trim } from 'viem';
import { getTxDetails } from '../../lib/tx';
import { MINT, URL } from '../../config';

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
  const txReceipt = hash !== '0x' ? await getTxDetails(hash) : undefined;
  
  const logs = txReceipt?.logs ?? [];
  let nft:`0x${string}` = '0x';
  let tokenId: `0x${string}` = '0x';
  for (let i = 0; i < logs.length; i++) {
    if (logs[i].address === MINT.address.toLowerCase()) {
      const events = logs[i]?.topics ?? [];
      nft = (events?.[1] ?? '0x') as `0x${string}`;
      tokenId = (events?.[2] ?? '0x') as `0x${string}`;
/*
      for (let e = 0; e < events.length; e++) {
        console.log(events[e]);
        
      }
*/
    } 
  }
  
  //if (!nft) {}
  
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          action: 'link',
          label: 'View artwork',
          target: `https://testnets.opensea.io/assets/base-sepolia/${trim(nft)}/${trim(tokenId)}`
        },
        {
          action: 'link',
          label: 'View in Explorer',
          target: `https://sepolia.basescan.org/tx/${body?.untrustedData?.transactionId || ''}`
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
