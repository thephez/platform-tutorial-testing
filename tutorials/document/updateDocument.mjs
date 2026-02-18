/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk, keyManager } = await setupDashClient(); */

import { Document } from '@dashevo/evo-sdk';

async function updateDocument(
  sdk,
  keyManager,
  dataContractId,
  documentTypeName,
  documentId,
  newRevision,
  documentData,
) {
  const { identity, identityKey, signer } = await keyManager.getAuth();

  // Create the replacement document with incremented revision
  const document = new Document({
    properties: documentData,
    documentTypeName,
    dataContractId,
    ownerId: identity.id,
    revision: BigInt(newRevision),
    id: documentId,
  });

  // Submit the replacement to the platform
  await sdk.documents.replace({
    document,
    identityKey,
    signer,
  });

  return document;
}

/* updateDocument(
  sdk,
  keyManager,
  'your contract id here',
  'note',
  'existing document id here',
  2,
  { message: 'Updated Tutorial Test @ ' + new Date().toUTCString() },
)
  .then((d) => console.log('Document updated:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { updateDocument };
