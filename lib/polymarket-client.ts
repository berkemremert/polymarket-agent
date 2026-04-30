import "server-only";
import { ClobClient, Chain, SignatureType } from "@polymarket/clob-client";
import { getViemWalletClient } from "./wallet";

let client: ClobClient | null = null;
let credsInitialized = false;

export async function getPolymarketClient(): Promise<ClobClient> {
  if (client && credsInitialized) return client;

  const walletClient = getViemWalletClient();

  client = new ClobClient(
    "https://clob.polymarket.com",
    Chain.POLYGON,
    walletClient,
    undefined,
    SignatureType.EOA
  );

  if (!credsInitialized) {
    const creds = await client.createOrDeriveApiKey();
    client = new ClobClient(
      "https://clob.polymarket.com",
      Chain.POLYGON,
      walletClient,
      creds,
      SignatureType.EOA
    );
    credsInitialized = true;
  }

  return client;
}
