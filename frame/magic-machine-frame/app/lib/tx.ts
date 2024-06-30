import { http, createPublicClient, TransactionReceipt } from 'viem';
import { base, zora } from 'viem/chains';


export const getTxDetails = async ({ hash, chainid }: { hash: `0x${string}`, chainid: number }): Promise<TransactionReceipt | undefined> => {
  const client = createPublicClient({
    chain: chainid === 7777777 ? zora : base,
    transport: http()
  });
  const transactionReceipt = await client.waitForTransactionReceipt({ hash });
  return transactionReceipt || undefined;
}
