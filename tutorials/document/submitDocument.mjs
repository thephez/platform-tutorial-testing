/* import { EvoSDK, IdentitySigner, Document } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect();

const identityId = 'your identity id here';
const privateKeyWif = 'your private key in WIF format here';
const identityPublicKeyId = 1; */

import { IdentitySigner, Document } from '@dashevo/evo-sdk';

async function submitDocument(
  sdk,
  identityId,
  privateKeyWif,
  identityPublicKeyId,
  dataContractId,
  documentTypeName,
  documentData,
) {
  // Fetch the identity and get the signing key by ID
  const identity = await sdk.identities.fetch(identityId);
  const identityKey = identity.getPublicKeyById(identityPublicKeyId);

  // Create the signer with the private key
  const signer = new IdentitySigner();
  signer.addKeyFromWif(privateKeyWif);

  // Create a new document (revision 1, ID auto-generated)
  const document = new Document(
    documentData,
    documentTypeName,
    BigInt(1),
    dataContractId,
    identityId,
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
  identityId,
  privateKeyWif,
  identityPublicKeyId,
  'your contract id here',
  'note',
  { message: 'Tutorial Test @ ' + new Date().toUTCString() },
)
  .then((d) => console.log('Document submitted:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { submitDocument };
