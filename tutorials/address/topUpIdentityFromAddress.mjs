/* import { setupDashClient } from '../sdkClient.mjs';
import { AddressKeyManager } from '../AddressKeyManager.mjs';

const { sdk } = await setupDashClient();
const addressKeyManager = await AddressKeyManager.create({
  sdk, mnemonic: process.env.PLATFORM_MNEMONIC, network: 'testnet',
}); */

/**
 * Top up an identity's balance from a funded platform address.
 *
 * Transfers credits from a platform address to an identity. The address's
 * private key must be loaded in the AddressKeyManager. The identity object
 * must be fetched first (not just the ID).
 *
 * @param {object} sdk - Connected EvoSDK instance
 * @param {object} addressKeyManager - AddressKeyManager instance (provides address signer)
 * @param {object} identity - Identity object (fetched via sdk.identities.fetch())
 * @param {number|bigint} amount - Amount of credits to transfer
 * @returns {Promise<{ newBalance: bigint, addressInfos: Map }>}
 */
async function topUpIdentityFromAddress(
  sdk,
  addressKeyManager,
  identity,
  amount,
) {
  const signer = addressKeyManager.getSigner();

  return sdk.addresses.topUpIdentity({
    identity,
    inputs: [{ address: addressKeyManager.primaryAddress.bech32m, amount: BigInt(amount) }],
    signer,
  });
}

/* topUpIdentityFromAddress(sdk, addressKeyManager, identity, 100000)
  .then((d) => console.log('Top-up result:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { topUpIdentityFromAddress };
