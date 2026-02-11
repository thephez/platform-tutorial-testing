/* import { EvoSDK } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect();

const contractId = 'your contract id here'; */

async function retrieveContractHistory(sdk, contractId) {
  return sdk.contracts.getHistory({ dataContractId: contractId });
}

/* retrieveContractHistory(sdk, contractId)
  .then((d) => console.log('Contract history:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { retrieveContractHistory };
