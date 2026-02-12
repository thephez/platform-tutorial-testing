/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk } = await setupDashClient(); */

async function retrieveContractHistory(sdk, contractId) {
  return sdk.contracts.getHistory({ dataContractId: contractId });
}

/* retrieveContractHistory(sdk, contractId)
  .then((d) => console.log('Contract history:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { retrieveContractHistory };
