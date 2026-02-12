/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk, keyManager } = await setupDashClient(); */

import { Document } from '@dashevo/evo-sdk';

async function submitDocument(
  sdk,
  keyManager,
  dataContractId,
  documentTypeName,
  documentData,
) {
  const { identity, identityKey, signer } = await keyManager.getAuth();

  // Create a new document (revision 1, ID auto-generated)
  const document = new Document(
    documentData,
    documentTypeName,
    BigInt(1),
    dataContractId,
    identity.id,
    undefined,
  );

  // Submit the document to the platform
  await sdk.documents.create({
    document,
    identityKey,
    signer,
  });

  return document;
}

/* submitDocument(
  sdk,
  keyManager,
  'your contract id here',
  'note',
  { message: 'Tutorial Test @ ' + new Date().toUTCString() },
)
  .then((d) => console.log('Document submitted:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { submitDocument };
