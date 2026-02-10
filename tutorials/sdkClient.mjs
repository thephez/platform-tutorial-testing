import { EvoSDK } from '@dashevo/evo-sdk';

export async function createClient(network = 'testnet') {
  const factories = {
    testnet: () => EvoSDK.testnetTrusted(),
    mainnet: () => EvoSDK.mainnetTrusted(),
    local: () => EvoSDK.localTrusted(),
  };

  const factory = factories[network];
  if (!factory) {
    throw new Error(`Unknown network "${network}". Use: ${Object.keys(factories).join(', ')}`);
  }

  const sdk = factory();
  await sdk.connect();
  return sdk;
}
