/* import { setupDashClient } from '../sdkClient.mjs';
import { AddressKeyManager } from '../AddressKeyManager.mjs';

const { sdk } = await setupDashClient();
const addressKeyManager = await AddressKeyManager.create({
  sdk, mnemonic: process.env.PLATFORM_MNEMONIC, network: 'testnet',
}); */

import { CoreScript, PoolingWasm } from '@dashevo/evo-sdk';

/**
 * Withdraw credits from a platform address to a Dash Core (L1) address.
 *
 * Creates a withdrawal transaction that moves credits from Platform (L2)
 * back to the Dash blockchain (L1). The withdrawal may be pooled with
 * others depending on the pooling strategy.
 *
 * @param {object} sdk - Connected EvoSDK instance
 * @param {object} addressKeyManager - AddressKeyManager instance
 * @param {Uint8Array} coreAddressHash - 20-byte hash160 of the L1 destination address
 * @param {number|bigint} amount - Amount of credits to withdraw
 * @param {number} [coreFeePerByte=1] - Core chain fee per byte
 * @returns {Promise<Map<PlatformAddress, PlatformAddressInfo>>}
 */
async function addressWithdraw(
  sdk,
  addressKeyManager,
  coreAddressHash,
  amount,
  coreFeePerByte = 1,
) {
  const signer = addressKeyManager.getSigner();
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

/* addressWithdraw(sdk, addressKeyManager, coreAddressHash, 190000)
  .then((d) => console.log('Withdrawal result:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { addressWithdraw };
