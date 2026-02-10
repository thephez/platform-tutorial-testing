/* import { EvoSDK, IdentitySigner } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect();

const identityId = 'your identity id here';
const privateKeyWif = 'your private key in WIF format here'; */

import { IdentitySigner } from '@dashevo/evo-sdk';

async function withdrawCredits(
  sdk,
  identityId,
  privateKeyWif,
  amount,
  toAddress,
  coreFeePerByte,
) {
  // Fetch the identity
  const identity = await sdk.identities.fetch(identityId);

  // Create the signer with the private key
  const signer = new IdentitySigner();
  signer.addKeyFromWif(privateKeyWif);

  // Withdraw credits from the identity to a Dash address
  return sdk.identities.creditWithdrawal({
    identity,
    amount: BigInt(amount),
    toAddress: toAddress || undefined,
    coreFeePerByte: coreFeePerByte || undefined,
    signer,
  });
}

/* withdrawCredits(
  sdk,
  identityId,
  privateKeyWif,
  1000000,
  'yNPbcFfabtNmmxKdGwhHomdYfVs6gikbPf',
)
  .then((d) => console.log('Credits withdrawn:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { withdrawCredits };
