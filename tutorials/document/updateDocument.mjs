/* import { EvoSDK, IdentitySigner, Document } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect();

const identityId = 'your identity id here';
const privateKeyWif = 'your private key in WIF format here';
const identityPublicKeyId = 1; */

import { IdentitySigner, Document } from '@dashevo/evo-sdk';

async function updateDocument(
  sdk,
  identityId,
  privateKeyWif,
  identityPublicKeyId,
  dataContractId,
  documentTypeName,
  documentId,
  newRevision,
  documentData,
) {
  // Fetch the identity and get the signing key by ID
  const identity = await sdk.identities.fetch(identityId);
  const identityKey = identity.getPublicKeyById(identityPublicKeyId);

  // Create the signer with the private key
  const signer = new IdentitySigner();
  signer.addKeyFromWif(privateKeyWif);

  // Create the replacement document with incremented revision
  const document = new Document(
    documentData,
    documentTypeName,
    BigInt(newRevision),
    dataContractId,
    identityId,
    documentId,
  );

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
  identityId,
  privateKeyWif,
  identityPublicKeyId,
  'your contract id here',
  'note',
  'existing document id here',
  2,
  { message: 'Updated Tutorial Test @ ' + new Date().toUTCString() },
)
  .then((d) => console.log('Document updated:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { updateDocument };
