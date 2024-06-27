import { FrameRequest, getFrameMessage, getFrameHtmlResponse, FrameButtonMetadata } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { trim, hexToBigInt } from 'viem';
import { getTxDetails } from '../../lib/tx';
import { MACHINE, URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  /*
  const { isValid } = await getFrameMessage(body);

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }
  */
  
  const hash: `0x${string}` = 
    `${body?.untrustedData?.transactionId || '0x'}` as `0x${string}`;
  const txReceipt = hash !== '0x' ? await getTxDetails(hash) : undefined;
  const logs = txReceipt?.logs ?? [];
  
  let nft:`0x${string}` = '0x';
  let tokenId: string = '0';
  for (let i = 0; i < logs.length; i++) {
    if (logs[i].address === MACHINE.address.toLowerCase()) {
      const events = logs[i]?.topics ?? [];
      nft = trim(events?.[1] ?? '0x') as `0x${string}`;
      tokenId = hexToBigInt(events?.[2] ?? '0x').toString() as `0x${string}`;
    } 
  }
  
  console.log(nft);
  console.log(tokenId);
  
  const isSuccess = nft && nft !== '0x';
  
  const buttons = isSuccess ? [
    {
      action: 'link',
      label: 'View artwork',
      target: `https://testnets.opensea.io/assets/base-sepolia/${nft}/${tokenId}`
    },
    {
      action: 'link',
      label: 'View in Explorer',
      target: `https://sepolia.basescan.org/tx/${body?.untrustedData?.transactionId || ''}`,
    },
    {
      label: 'Find more art',
      target: `${URL}/api/frame`
    }
  ] as [FrameButtonMetadata, ...FrameButtonMetadata[]] : [
    {
      label: 'Try again',
      target: `${URL}/api/frame`
    } 
  ] as [FrameButtonMetadata, ...FrameButtonMetadata[]];
  
  return new NextResponse(
    getFrameHtmlResponse({
      buttons,
      image: {
        src: `${URL}/${isSuccess ? 'success' : 'fail'}.png`,
        aspectRatio: '1:1'
      },
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
