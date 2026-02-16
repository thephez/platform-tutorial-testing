/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk, keyManager } = await setupDashClient(); */

/**
 * Transfer credits from an identity to a platform address.
 *
 * This is the primary way to fund a platform address from an existing
 * identity. Uses the identity's transfer key (IdentitySigner) to
 * authorize the spend.
 *
 * @param {object} sdk - Connected EvoSDK instance
 * @param {object} keyManager - IdentityKeyManager instance (provides transfer signer)
 * @param {string} recipientAddress - Destination platform address (bech32m string)
 * @param {number|bigint} amount - Amount of credits to transfer
 * @returns {Promise<{ newBalance: bigint, addressInfos: Map }>}
 */
async function transferFromIdentity(sdk, keyManager, recipientAddress, amount) {
  const { identity, signer } = await keyManager.getTransfer();

  return sdk.addresses.transferFromIdentity({
    identity,
    outputs: [{ address: recipientAddress, amount: BigInt(amount) }],
    signer,
  });
}

/* transferFromIdentity(sdk, keyManager, 'tevo1...', 1000000)
  .then((d) => console.log('Transfer result:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { transferFromIdentity };
