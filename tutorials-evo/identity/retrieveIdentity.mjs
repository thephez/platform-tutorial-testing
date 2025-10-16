// import { initEvoSDK } from '../utils/initEvoSDK.mjs';

/**
 * Retrieve an identity from Dash Platform
 * @param {EvoSDK} sdk - Connected EvoSDK instance
 * @param {string} identityId - The identity ID to retrieve
 * @returns {Promise<Object>} The identity
 */
async function retrieveIdentity(sdk, identityId) {
  return sdk.identities.fetch(identityId);
}

export default retrieveIdentity;

// Example usage (uncomment to run directly):
/*
const sdk = await initEvoSDK();
const identityId = 'your_identity_id_here';

retrieveIdentity(sdk, identityId)
  .then((identity) => console.log('Identity retrieved:\n', identity))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => sdk.disconnect());
*/
