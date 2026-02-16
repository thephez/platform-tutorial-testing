/* import { setupDashClient } from '../sdkClient.mjs';
import { AddressKeyManager } from '../AddressKeyManager.mjs';

const { sdk } = await setupDashClient();
const addressKeyManager = await AddressKeyManager.create({
  sdk, mnemonic: process.env.PLATFORM_MNEMONIC, network: 'testnet',
}); */

import { createRequire } from 'node:module';
import { CoreScript, PoolingWasm } from '@dashevo/evo-sdk';

const require = createRequire(import.meta.url);
// eslint-disable-next-line import/no-extraneous-dependencies -- bs58 is a transitive dep of evo-sdk
const bs58 = require('bs58');

/**
 * Withdraw credits from a platform address to a Dash Core (L1) address.
 *
 * Creates a withdrawal transaction that moves credits from Platform (L2)
 * back to the Dash blockchain (L1).
 *
 * @param {object} sdk - Connected EvoSDK instance
 * @param {object} addressKeyManager - AddressKeyManager instance
 * @param {string} coreAddress - Dash Core (L1) destination address
 * @param {number|bigint} amount - Amount of credits to withdraw
 * @param {number} [coreFeePerByte=1] - Core chain fee per byte
 * @returns {Promise<Map<PlatformAddress, PlatformAddressInfo>>}
 */
async function addressWithdraw(
  sdk,
  addressKeyManager,
  coreAddress,
  amount,
  coreFeePerByte = 1,
) {
  const signer = addressKeyManager.getSigner();
  // Decode base58check address: [version(1) | hash160(20) | checksum(4)]
  const decoded = bs58.decode(coreAddress);
  const coreAddressHash = decoded.slice(1, 21);
  const outputScript = CoreScript.newP2PKH(coreAddressHash);

  return sdk.addresses.withdraw({
    inputs: [
      {
        address: addressKeyManager.primaryAddress.bech32m,
        amount: BigInt(amount),
      },
    ],
    coreFeePerByte,
    pooling: PoolingWasm.Never,
    outputScript,
    signer,
  });
}

/* addressWithdraw(sdk, addressKeyManager, 'yNPbcFfabtNmmxKdGwhHomdYfVs6gikbPf', 190000)
  .then((d) => console.log('Withdrawal result:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { addressWithdraw };
