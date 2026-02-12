/* import { EvoSDK } from '@dashevo/evo-sdk';
import { IdentityKeyManager } from '../IdentityKeyManager.mjs';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect();

const keyManager = await IdentityKeyManager.create({
  sdk,
  mnemonic: 'your twelve word mnemonic here',
}); */

async function transferCredits(sdk, keyManager, recipientId, amount) {
  const { identity, signer } = await keyManager.getTransfer();

  // Transfer credits to the recipient identity
  return sdk.identities.creditTransfer({
    identity,
    recipientId,
    amount: BigInt(amount),
    signer,
  });
}

/* transferCredits(
  sdk,
  keyManager,
  'recipient identity id here',
  1000000,
)
  .then((d) => console.log('Credits transferred:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { transferCredits };
