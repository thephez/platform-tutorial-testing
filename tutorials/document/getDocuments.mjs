/* import { EvoSDK } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect(); */

async function getDocuments(sdk, dataContractId, documentTypeName, limit = 2) {
  return sdk.documents.query({
    dataContractId,
    documentTypeName,
    limit,
  });
}

/* getDocuments(sdk, 'your contract id here', 'note', 2)
  .then((d) => {
    for (const [id, doc] of d) {
      console.log('Document retrieved:\n', id.toString(), doc);
    }
  })
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { getDocuments };
