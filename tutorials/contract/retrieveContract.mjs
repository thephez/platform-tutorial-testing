/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk } = await setupDashClient(); */

async function retrieveContract(sdk, contractId) {
  return sdk.contracts.fetch(contractId);
}

/* retrieveContract(sdk, 'your contract id here')
  .then((d) => console.log('Contract retrieved:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { retrieveContract };
