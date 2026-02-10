/* import { EvoSDK, IdentitySigner, DataContract } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect();

const identityId = 'your identity id here';
const privateKeyWif = 'your private key in WIF format here';
const identityPublicKeyId = 1; */

import { IdentitySigner, DataContract } from '@dashevo/evo-sdk';

async function registerContract(
  sdk,
  identityId,
  privateKeyWif,
  identityPublicKeyId,
  documentSchemas,
) {
  // Fetch the identity and get the signing key by ID
  const identity = await sdk.identities.fetch(identityId);
  const identityKey = identity.getPublicKeyById(identityPublicKeyId);

  // Create the signer with the private key
  const signer = new IdentitySigner();
  signer.addKeyFromWif(privateKeyWif);

  // Get the next identity nonce for contract creation
  const identityNonce = await sdk.identities.nonce(identityId);
  const nextNonce = (identityNonce || 0n) + 1n;

  // Create the data contract
  const dataContract = new DataContract(
    identityId,
    nextNonce,
    documentSchemas,
    undefined, // definitions
    undefined, // tokens
    false, // full_validation
    undefined, // platform_version
  );

  // Publish the contract to the platform
  const publishedContract = await sdk.contracts.publish({
    dataContract,
    identityKey,
    signer,
  });

  return publishedContract;
}

/* const documentSchemas = {
  note: {
    type: 'object',
    properties: {
      message: { type: 'string', position: 0 },
    },
    additionalProperties: false,
  },
};

registerContract(
  sdk,
  identityId,
  privateKeyWif,
  identityPublicKeyId,
  documentSchemas,
)
  .then((d) => console.log('Contract registered:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { registerContract };
