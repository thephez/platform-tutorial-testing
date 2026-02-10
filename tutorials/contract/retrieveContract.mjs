/* import { EvoSDK } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect(); */

async function retrieveContract(sdk, contractId) {
  return sdk.contracts.fetch(contractId);
}

/* retrieveContract(sdk, 'your contract id here')
  .then((d) => console.log('Contract retrieved:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { retrieveContract };
