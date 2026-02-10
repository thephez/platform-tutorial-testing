/* import { EvoSDK, IdentitySigner } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect();

const identityId = 'your identity id here';
const privateKeyWif = 'your private key in WIF format here'; */

import { IdentitySigner } from '@dashevo/evo-sdk';

async function transferCredits(
  sdk,
  identityId,
  privateKeyWif,
  recipientId,
  amount,
) {
  // Fetch the sender identity
  const identity = await sdk.identities.fetch(identityId);

  // Create the signer with the private key
  const signer = new IdentitySigner();
  signer.addKeyFromWif(privateKeyWif);

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
  identityId,
  privateKeyWif,
  'recipient identity id here',
  1000000,
)
  .then((d) => console.log('Credits transferred:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { transferCredits };
