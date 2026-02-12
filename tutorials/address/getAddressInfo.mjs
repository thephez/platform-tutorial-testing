/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk } = await setupDashClient(); */

/**
 * Fetch information about a single platform address.
 *
 * Returns the address balance (in credits) and current nonce,
 * or undefined if the address has never been funded.
 *
 * @param {object} sdk - Connected EvoSDK instance
 * @param {string|PlatformAddress|Uint8Array} address - Platform address (bech32m string, PlatformAddress, or bytes)
 * @returns {Promise<PlatformAddressInfo|undefined>}
 */
async function getAddressInfo(sdk, address) {
  return sdk.addresses.get(address);
}

/* getAddressInfo(sdk, 'tevo1...')
  .then((d) => console.log('Address info:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { getAddressInfo };
