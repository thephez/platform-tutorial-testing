/* import { setupDashClient } from '../sdkClient.mjs';
import { AddressKeyManager } from '../AddressKeyManager.mjs';

const { sdk } = await setupDashClient();
const addressKeyManager = await AddressKeyManager.create({
  sdk, mnemonic: process.env.PLATFORM_MNEMONIC, network: 'testnet',
}); */

import { randomBytes } from 'node:crypto';
import { Identity, Identifier } from '@dashevo/evo-sdk';
import { IdentityKeyManager } from '../IdentityKeyManager.mjs';

/**
 * Create a new identity funded from platform addresses.
 *
 * Uses IdentityKeyManager to find the next unused DIP-9 identity index,
 * derive 5 standard keys, and build the identity shell. Then creates it
 * on-chain funded from a platform address.
 *
 * @param {object} sdk - Connected EvoSDK instance
 * @param {object} addressKeyManager - AddressKeyManager instance (provides address signer + funding)
 * @param {string} mnemonic - BIP39 mnemonic for DIP-9 key derivation
 * @param {string} [network='testnet'] - 'testnet' or 'mainnet'
 * @param {number|bigint} amount - Amount of credits to fund the new identity
 * @returns {Promise<{ identity: Identity, addressInfos: Map, identityIndex: number }>}
 */
async function createIdentityFromAddresses(
  sdk,
  addressKeyManager,
  mnemonic,
  network = 'testnet',
  amount,
) {
  // Derive keys at the next unused identity index
  const keyManager = await IdentityKeyManager.createForNewIdentity({
    sdk, mnemonic, network,
  });
  console.log(`\t[createIdentity] Using identity index: ${keyManager.identityIndex}`);

  // Build identity shell with public keys
  const identity = new Identity(new Identifier(randomBytes(32)));
  keyManager.getKeysInCreation().forEach((key) => {
    identity.addPublicKey(key.toIdentityPublicKey());
  });

  // Create the identity on-chain
  // NOTE: blocked by SDK nonce off-by-one bug for v3.0.1:
  // https://github.com/dashpay/platform/issues/3083
  console.log(
    `\t[createIdentity]   input address: ${addressKeyManager.primaryAddress.bech32m}`,
  );
  const result = await sdk.addresses.createIdentity({
    identity,
    inputs: [
      {
        address: addressKeyManager.primaryAddress.bech32m,
        amount: BigInt(amount),
      },
    ],
    identitySigner: keyManager.getFullSigner(),
    addressSigner: addressKeyManager.getSigner(),
  });

  return {
    identity: result.identity,
    addressInfos: result.addressInfos,
    identityIndex: keyManager.identityIndex,
  };
}

/* createIdentityFromAddresses(sdk, addressKeyManager, process.env.PLATFORM_MNEMONIC, 'testnet', 5000000)
  .then((d) => console.log('Identity created:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { createIdentityFromAddresses };
