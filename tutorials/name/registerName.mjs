/* import { EvoSDK, IdentitySigner } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect();

const identityId = 'your identity id here';
const privateKeyWif = 'your private key in WIF format here';
const identityPublicKeyId = 1; */

import { IdentitySigner } from '@dashevo/evo-sdk';

async function registerName(
  sdk,
  identityId,
  privateKeyWif,
  identityPublicKeyId,
  label,
) {
  // Fetch the identity and get the signing key by ID
  const identity = await sdk.identities.fetch(identityId);
  const identityKey = identity.getPublicKeyById(identityPublicKeyId);

  // Create the signer with the private key
  const signer = new IdentitySigner();
  signer.addKeyFromWif(privateKeyWif);

  // Register a DPNS name for the identity.
  // The label is the name without the '.dash' suffix (e.g., 'alice').
  return sdk.dpns.registerName({
    label,
    identity,
    identityKey,
    signer,
  });
}

/* registerName(sdk, identityId, privateKeyWif, identityPublicKeyId, 'your-name-here')
  .then((d) => console.log('Name registered:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { registerName };
