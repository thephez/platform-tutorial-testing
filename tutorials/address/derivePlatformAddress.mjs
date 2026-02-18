/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk } = await setupDashClient(); */

import { wallet, PlatformAddressSigner, PrivateKey } from '@dashevo/evo-sdk';

/**
 * Derive a platform address (bech32m) from a BIP39 mnemonic.
 *
 * Uses BIP44 derivation path (m/44'/{coin}'/0'/0/{index}) to derive
 * a private key, then creates a P2PKH platform address from it.
 *
 * @param {string} mnemonic - BIP39 mnemonic phrase
 * @param {string} [network='testnet'] - 'testnet' or 'mainnet'
 * @param {number} [index=0] - Address index in the BIP44 path
 * @returns {{ address: string, privateKeyWif: string, publicKey: string, path: string }}
 */
async function derivePlatformAddress(mnemonic, network = 'testnet', index = 0) {
  const coin = network === 'testnet' ? 1 : 5;
  const path = `m/44'/${coin}'/0'/0/${index}`;

  const keyInfo = await wallet.deriveKeyFromSeedWithPath({
    mnemonic,
    path,
    network,
  });
  const obj = keyInfo.toObject();

  // Derive the platform address (bech32m) from the private key
  const privateKey = PrivateKey.fromWIF(obj.privateKeyWif);
  const signer = new PlatformAddressSigner();
  const platformAddress = signer.addKey(privateKey);

  return {
    address: platformAddress.toBech32m(network),
    privateKeyWif: obj.privateKeyWif,
    publicKey: obj.publicKey,
    path,
  };
}

/* derivePlatformAddress('your twelve word mnemonic phrase here ...')
  .then((d) => console.log('Platform address:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { derivePlatformAddress };
