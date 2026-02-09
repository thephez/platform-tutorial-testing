import { EvoSDK } from '@dashevo/evo-sdk';

export async function createClient(network = 'testnet') {
  let sdk;
  if (network === 'mainnet') {
    sdk = EvoSDK.mainnetTrusted();
  } else {
    sdk = EvoSDK.testnetTrusted();
  }
  await sdk.connect();
  return sdk;
}
