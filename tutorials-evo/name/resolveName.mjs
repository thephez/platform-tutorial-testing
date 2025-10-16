// import { initEvoSDK } from '../utils/initEvoSDK.mjs';

/**
 * Resolve a DPNS name to retrieve name information
 * @param {EvoSDK} sdk - Connected EvoSDK instance
 * @param {string} name - The name to resolve (without .dash suffix)
 * @returns {Promise<Object>} The name information
 */
async function resolveName(sdk, name) {
  // Retrieve by full name (e.g., myname.dash)
  // NOTE: Use lowercase characters only
  return sdk.dpns.resolveName(`${name}.dash`);
}

export default resolveName;

// Example usage (uncomment to run directly):
/*
const sdk = await initEvoSDK();
const name = 'alice';

resolveName(sdk, name)
  .then((nameInfo) => console.log('Name retrieved:\n', nameInfo))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => sdk.disconnect());
*/
