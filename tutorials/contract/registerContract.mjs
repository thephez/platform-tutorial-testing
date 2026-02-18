/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk, keyManager } = await setupDashClient(); */

import { DataContract } from '@dashevo/evo-sdk';

async function registerContract(
  sdk,
  keyManager,
  documentSchemas,
  definitions,
  tokens,
) {
  const { identity, identityKey, signer } = await keyManager.getAuth();

  // Get the next identity nonce for contract creation
  const identityNonce = await sdk.identities.nonce(identity.id.toString());
  const nextNonce = (identityNonce || 0n) + 1n;

  // Create the data contract
  const dataContract = new DataContract({
    ownerId: identity.id,
    identityNonce: nextNonce,
    schemas: documentSchemas,
    ...(definitions && { definitions }),
    ...(tokens && { tokens }),
    fullValidation: false,
  });

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
  keyManager,
  documentSchemas,
)
  .then((d) => console.log('Contract registered:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { registerContract };
