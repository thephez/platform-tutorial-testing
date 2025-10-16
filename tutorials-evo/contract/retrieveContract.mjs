// import { initEvoSDK } from '../utils/initEvoSDK.mjs';

/**
 * Retrieve a data contract from Dash Platform
 * @param {EvoSDK} sdk - Connected EvoSDK instance
 * @param {string} contractId - The contract ID to retrieve
 * @returns {Promise<Object>} The data contract
 */
async function retrieveContract(sdk, contractId) {
  return sdk.contracts.fetch(contractId);
}

export default retrieveContract;

// Example usage (uncomment to run directly):
/*
const sdk = await initEvoSDK();
const contractId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec';

retrieveContract(sdk, contractId)
  .then((contract) => console.dir(contract, { depth: 5 }))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => sdk.disconnect());
*/
