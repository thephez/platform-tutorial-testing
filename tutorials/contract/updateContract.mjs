/* import { EvoSDK, IdentitySigner } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect();

const identityId = 'your identity id here';
const privateKeyWif = 'your private key in WIF format here';
const identityPublicKeyId = 1; */

import { IdentitySigner } from '@dashevo/evo-sdk';

async function updateContract(
  sdk,
  identityId,
  privateKeyWif,
  identityPublicKeyId,
  contractId,
  newDocumentSchemas,
) {
  // Fetch the identity and get the signing key by ID
  const identity = await sdk.identities.fetch(identityId);
  const identityKey = identity.getPublicKeyById(identityPublicKeyId);

  // Create the signer with the private key
  const signer = new IdentitySigner();
  signer.addKeyFromWif(privateKeyWif);

  // Fetch the existing contract
  const existingContract = await sdk.contracts.fetch(contractId);

  // Increment the contract version
  existingContract.version = (existingContract.version || 1) + 1;

  // Merge new schemas with existing schemas
  const existingSchemas = existingContract.getSchemas() || {};
  const mergedSchemas = { ...existingSchemas, ...newDocumentSchemas };
  existingContract.setSchemas(mergedSchemas, undefined, false, undefined);

  // Update the contract on the platform
  await sdk.contracts.update({
    dataContract: existingContract,
    identityKey,
    signer,
  });

  return existingContract;
}

/* const newDocumentSchemas = {
  extendedNote: {
    type: 'object',
    properties: {
      message: { type: 'string', position: 0 },
      author: { type: 'string', position: 1 },
    },
    additionalProperties: false,
  },
};

updateContract(
  sdk,
  identityId,
  privateKeyWif,
  identityPublicKeyId,
  'your contract id here',
  newDocumentSchemas,
)
  .then((d) => console.log('Contract updated:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { updateContract };
