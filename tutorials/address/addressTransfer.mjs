/* import { setupDashClient } from '../sdkClient.mjs';
import { AddressKeyManager } from '../AddressKeyManager.mjs';

const { sdk } = await setupDashClient();
const addressKeyManager = await AddressKeyManager.create({
  sdk, mnemonic: process.env.PLATFORM_MNEMONIC, network: 'testnet',
}); */

/**
 * Transfer credits between platform addresses.
 *
 * Sends credits from one platform address to another. The sender's
 * private key must be loaded in the AddressKeyManager.
 *
 * @param {object} sdk - Connected EvoSDK instance
 * @param {object} addressKeyManager - AddressKeyManager instance (provides address signer)
 * @param {string} recipientAddress - Destination platform address (bech32m string)
 * @param {number|bigint} amount - Amount of credits to transfer
 * @returns {Promise<Map<PlatformAddress, PlatformAddressInfo>>}
 */
async function addressTransfer(
  sdk,
  addressKeyManager,
  recipientAddress,
  amount,
) {
  const signer = addressKeyManager.getSigner();
  return sdk.addresses.transfer({
    inputs: [
      {
        address: addressKeyManager.primaryAddress.bech32m,
        amount: BigInt(amount),
      },
    ],
    outputs: [{ address: recipientAddress, amount: BigInt(amount) }],
    signer,
  });
}

/* addressTransfer(sdk, addressKeyManager, 'tevo1...', 100000)
  .then((d) => console.log('Transfer result:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { addressTransfer };
