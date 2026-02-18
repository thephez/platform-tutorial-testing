/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk, keyManager } = await setupDashClient(); */

async function updateContract(sdk, keyManager, contractId, newDocumentSchemas) {
  const { identityKey, signer } = await keyManager.getAuth();

  // Fetch the existing contract
  const existingContract = await sdk.contracts.fetch(contractId);

  // Increment the contract version
  existingContract.version = (existingContract.version || 1) + 1;

  // Merge new schemas with existing schemas
  const existingSchemas = existingContract.schemas || {};
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
  keyManager,
  'your contract id here',
  newDocumentSchemas,
)
  .then((d) => console.log('Contract updated:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { updateContract };
