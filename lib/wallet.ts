import "server-only";
import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http } from "viem";
import { polygon } from "viem/chains";

export function getViemWalletClient() {
  const privateKey = process.env.POLYGON_PRIVATE_KEY!;
  const account = privateKeyToAccount(`0x${privateKey}` as `0x${string}`);
  return createWalletClient({
    account,
    chain: polygon,
    transport: http(),
  });
}
