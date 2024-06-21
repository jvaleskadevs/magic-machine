import { http, createPublicClient, TransactionReceipt } from 'viem';
import { baseSepolia } from 'viem/chains';

const client = createPublicClient({
  chain: baseSepolia,
  transport: http()
});

export const getTxDetails = async (hash: `0x${string}`): Promise<TransactionReceipt | undefined> => {
  const transactionReceipt = await client.waitForTransactionReceipt({ hash });
  return transactionReceipt || undefined;
}
