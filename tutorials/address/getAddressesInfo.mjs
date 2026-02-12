/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk } = await setupDashClient(); */

/**
 * Fetch information about multiple platform addresses in a single call.
 *
 * Returns a Map of PlatformAddress to PlatformAddressInfo (or undefined
 * for addresses that have never been funded).
 *
 * @param {object} sdk - Connected EvoSDK instance
 * @param {Array<string|PlatformAddress|Uint8Array>} addresses - Array of platform addresses
 * @returns {Promise<Map<PlatformAddress, PlatformAddressInfo|undefined>>}
 */
async function getAddressesInfo(sdk, addresses) {
  return sdk.addresses.getMany(addresses);
}

/* getAddressesInfo(sdk, ['tevo1...', 'tevo1...'])
  .then((d) => console.log('Addresses info:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { getAddressesInfo };
