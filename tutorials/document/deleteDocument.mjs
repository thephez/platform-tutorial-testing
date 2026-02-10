/* import { EvoSDK, IdentitySigner } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect();

const identityId = 'your identity id here';
const privateKeyWif = 'your private key in WIF format here';
const identityPublicKeyId = 1; */

import { IdentitySigner } from '@dashevo/evo-sdk';

async function deleteDocument(
  sdk,
  identityId,
  privateKeyWif,
  identityPublicKeyId,
  dataContractId,
  documentTypeName,
  documentId,
) {
  // Fetch the identity and get the signing key by ID
  const identity = await sdk.identities.fetch(identityId);
  const identityKey = identity.getPublicKeyById(identityPublicKeyId);

  // Create the signer with the private key
  const signer = new IdentitySigner();
  signer.addKeyFromWif(privateKeyWif);

  // Delete the document from the platform
  await sdk.documents.delete({
    document: {
      id: documentId,
      ownerId: identityId,
      dataContractId,
      documentTypeName,
    },
    identityKey,
    signer,
  });
}

/* deleteDocument(
  sdk,
  identityId,
  privateKeyWif,
  identityPublicKeyId,
  'your contract id here',
  'note',
  'document id to delete here',
)
  .then(() => console.log('Document deleted'))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { deleteDocument };
