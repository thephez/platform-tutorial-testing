import { EvoSDK } from '@dashevo/evo-sdk';
import { IdentityKeyManager } from './IdentityKeyManager.mjs';

export async function createClient(network = 'testnet') {
  const factories = {
    testnet: () => EvoSDK.testnetTrusted(),
    mainnet: () => EvoSDK.mainnetTrusted(),
    local: () => EvoSDK.localTrusted(),
  };

  const factory = factories[network];
  if (!factory) {
    throw new Error(
      `Unknown network "${network}". Use: ${Object.keys(factories).join(', ')}`,
    );
  }

  const sdk = factory();
  await sdk.connect();
  return sdk;
}

export async function setupDashClient() {
  const network = process.env.NETWORK || 'testnet';
  const mnemonic = process.env.PLATFORM_MNEMONIC;

  const sdk = await createClient(network);

  let keyManager;
  if (mnemonic) {
    keyManager = await IdentityKeyManager.create({ sdk, mnemonic, network });
  }

  return { sdk, keyManager };
}
