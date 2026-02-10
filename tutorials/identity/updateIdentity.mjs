/* import { EvoSDK, IdentitySigner } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect();

const identityId = 'your identity id here';
const privateKeyWif = 'your private key in WIF format here'; */

import { IdentitySigner } from '@dashevo/evo-sdk';

async function updateIdentity(
  sdk,
  identityId,
  privateKeyWif,
  addPublicKeys,
  disablePublicKeys,
  additionalKeyWifs,
) {
  // Fetch the identity
  const identity = await sdk.identities.fetch(identityId);

  // Create the signer with the master key
  const signer = new IdentitySigner();
  signer.addKeyFromWif(privateKeyWif);

  // When adding new keys, each key must prove ownership by signing
  // with its own private key — add those WIFs to the signer too
  if (additionalKeyWifs) {
    additionalKeyWifs.forEach((wif) => signer.addKeyFromWif(wif));
  }

  // Update the identity on the platform.
  // addPublicKeys: array of public key objects to add
  // disablePublicKeys: array of public key IDs (numbers) to disable
  await sdk.identities.update({
    identity,
    addPublicKeys: addPublicKeys || undefined,
    disablePublicKeys: disablePublicKeys || undefined,
    signer,
  });

  return identity;
}

/* updateIdentity(
  sdk,
  identityId,
  privateKeyWif,
  undefined,          // no keys to add
  [1],                // disable public key ID 1
  undefined,          // no additional key WIFs needed for disable
)
  .then((d) => console.log('Identity updated:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { updateIdentity };
