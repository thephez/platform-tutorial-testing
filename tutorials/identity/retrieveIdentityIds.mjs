/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk } = await setupDashClient(); */

import { PrivateKey, wallet } from '@dashevo/evo-sdk';

/**
 * Retrieve all identity IDs associated with a mnemonic by iterating
 * DIP-9 identity indices until no identity is found on-chain.
 *
 * For each index, derives the master key (key 0) and looks up the
 * identity by its public key hash. Stops at the first gap.
 *
 * @param {object} sdk - Connected EvoSDK instance
 * @param {string} mnemonic - BIP39 mnemonic
 * @param {string} [network='testnet'] - 'testnet' or 'mainnet'
 * @returns {Promise<string[]>} Array of identity ID strings
 */
async function retrieveIdentityIds(sdk, mnemonic, network = 'testnet') {
  const coin = network === 'testnet' ? 1 : 5;
  const identityIds = [];

  for (let identityIndex = 0; ; identityIndex++) {
    const masterKey = await wallet.deriveKeyFromSeedWithPath({
      mnemonic,
      path: `m/9'/${coin}'/5'/0'/0'/${identityIndex}'/0'`,
      network,
    });
    const privateKey = PrivateKey.fromWIF(masterKey.toObject().privateKeyWif);
    const pubKeyHash = privateKey.getPublicKeyHash();
    const identity = await sdk.identities.byPublicKeyHash(pubKeyHash);
    if (!identity) break;
    identityIds.push(identity.id.toString());
  }

  return identityIds;
}

/* retrieveIdentityIds(sdk, mnemonic)
  .then((ids) => console.log('Mnemonic identity IDs:\n', ids))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { retrieveIdentityIds };
