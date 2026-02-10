/* import { EvoSDK } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect(); */

import { DPNS_CONTRACT_ID } from '../constants.mjs';

async function retrieveNameBySearch(sdk, namePrefix) {
  // Search for DPNS names matching a prefix
  // NOTE: Use lowercase characters only
  const normalizedPrefix = await sdk.dpns.convertToHomographSafe(namePrefix);
  return sdk.documents.query({
    dataContractId: DPNS_CONTRACT_ID,
    documentTypeName: 'domain',
    where: [
      ['normalizedParentDomainName', '==', 'dash'],
      ['normalizedLabel', 'startsWith', normalizedPrefix],
    ],
    orderBy: [['normalizedLabel', 'asc']],
  });
}

/* retrieveNameBySearch(sdk, 'user')
  .then((d) => {
    for (const [id, doc] of d) {
      console.log('Name retrieved:\n', id.toString(), doc);
    }
  })
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { retrieveNameBySearch };
