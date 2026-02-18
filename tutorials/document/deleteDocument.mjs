/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk, keyManager } = await setupDashClient(); */

async function deleteDocument(
  sdk,
  keyManager,
  dataContractId,
  documentTypeName,
  documentId,
) {
  const { identity, identityKey, signer } = await keyManager.getAuth();

  // Delete the document from the platform
  await sdk.documents.delete({
    document: {
      id: documentId,
      ownerId: identity.id,
      dataContractId,
      documentTypeName,
    },
    identityKey,
    signer,
  });
}

/* deleteDocument(
  sdk,
  keyManager,
  'your contract id here',
  'note',
  'document id to delete here',
)
  .then(() => console.log('Document deleted'))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { deleteDocument };
