/* import { EvoSDK } from '@dashevo/evo-sdk';
import { IdentityKeyManager } from '../IdentityKeyManager.mjs';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect();

const keyManager = await IdentityKeyManager.create({
  sdk,
  mnemonic: 'your twelve word mnemonic here',
}); */

async function registerName(
  sdk,
  keyManager,
  label,
) {
  const { identity, identityKey, signer } = await keyManager.getAuth();

  // Register a DPNS name for the identity.
  // The label is the name without the '.dash' suffix (e.g., 'alice').
  return sdk.dpns.registerName({
    label,
    identity,
    identityKey,
    signer,
  });
}

/* registerName(sdk, keyManager, 'your-name-here')
  .then((d) => console.log('Name registered:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { registerName };
