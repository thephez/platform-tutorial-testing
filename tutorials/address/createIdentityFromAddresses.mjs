/* import { setupDashClient } from '../sdkClient.mjs';
import { AddressKeyManager } from '../AddressKeyManager.mjs';

const { sdk } = await setupDashClient();
const addressKeyManager = await AddressKeyManager.create({
  sdk, mnemonic: process.env.PLATFORM_MNEMONIC, network: 'testnet',
}); */

import { randomBytes } from 'node:crypto';
import {
  Identity,
  Identifier,
  IdentityPublicKeyInCreation,
  IdentitySigner,
  PrivateKey,
  wallet,
} from '@dashevo/evo-sdk';

/**
 * Create a new identity funded from platform addresses.
 *
 * Derives identity keys deterministically from the mnemonic using DIP-9
 * paths, finds the first unused identity index, builds the identity with
 * 5 standard keys, and creates it on-chain funded from a platform address.
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
  const coin = network === 'testnet' ? 1 : 5;
  const derivePath = (identityIndex, keyIndex) =>
    `m/9'/${coin}'/5'/0'/0'/${identityIndex}'/${keyIndex}'`;

  // Find the first unused identity index
  let identityIndex = 0;
  for (; ; identityIndex++) {
    const masterKey = await wallet.deriveKeyFromSeedWithPath({
      mnemonic,
      path: derivePath(identityIndex, 0),
      network,
    });
    const privateKey = PrivateKey.fromWIF(masterKey.toObject().privateKeyWif);
    const pubKeyHash = privateKey.getPublicKeyHash();
    const existing = await sdk.identities.byPublicKeyHash(pubKeyHash);
    if (!existing) break;
  }
  console.log(`\t[createIdentity] Using identity index: ${identityIndex}`);

  // Derive 5 standard identity keys at the found index
  const keySpecs = [
    { keyId: 0, purpose: 'AUTHENTICATION', securityLevel: 'master' },
    { keyId: 1, purpose: 'AUTHENTICATION', securityLevel: 'high' },
    { keyId: 2, purpose: 'AUTHENTICATION', securityLevel: 'critical' },
    { keyId: 3, purpose: 'TRANSFER', securityLevel: 'critical' },
    { keyId: 4, purpose: 'ENCRYPTION', securityLevel: 'medium' },
  ];

  const derivedKeys = await Promise.all(
    keySpecs.map((spec) =>
      wallet.deriveKeyFromSeedWithPath({
        mnemonic,
        path: derivePath(identityIndex, spec.keyId),
        network,
      }),
    ),
  );

  // Build IdentityPublicKeyInCreation for each key
  const keysInCreation = keySpecs.map((spec, i) => {
    const keyObj = derivedKeys[i].toObject();
    const pubKeyData = Uint8Array.from(Buffer.from(keyObj.publicKey, 'hex'));
    return new IdentityPublicKeyInCreation(
      spec.keyId,
      spec.purpose,
      spec.securityLevel,
      'ECDSA_SECP256K1',
      false, // readOnly
      pubKeyData,
      [], // signature
    );
  });

  // Build the identity shell with public keys
  const identity = new Identity(new Identifier(randomBytes(32)));
  keysInCreation.forEach((key) => {
    const ipk = key.toIdentityPublicKey();
    identity.addPublicKey(ipk);
  });

  // Create signers
  const identitySigner = new IdentitySigner();
  derivedKeys.forEach((dk) => {
    identitySigner.addKeyFromWif(dk.toObject().privateKeyWif);
  });
  const addressSigner = addressKeyManager.getSigner();

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
    identitySigner,
    addressSigner,
  });

  return {
    identity: result.identity,
    addressInfos: result.addressInfos,
    identityIndex,
  };
}

/* createIdentityFromAddresses(sdk, addressKeyManager, process.env.PLATFORM_MNEMONIC, 'testnet', 5000000)
  .then((d) => console.log('Identity created:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { createIdentityFromAddresses };
