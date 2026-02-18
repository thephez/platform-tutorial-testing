/* import { wallet, PlatformAddressSigner, PrivateKey } from '@dashevo/evo-sdk'; */

import { wallet, PlatformAddressSigner, PrivateKey } from '@dashevo/evo-sdk';

// Standard DIP-9 key metadata for identity index 0
const KEY_META = [
  {
    id: 0,
    name: 'Master',
    purpose: 'AUTHENTICATION',
    securityLevel: 'MASTER',
  },
  {
    id: 1,
    name: 'High Auth',
    purpose: 'AUTHENTICATION',
    securityLevel: 'HIGH',
  },
  {
    id: 2,
    name: 'Critical Auth',
    purpose: 'AUTHENTICATION',
    securityLevel: 'CRITICAL',
  },
  {
    id: 3,
    name: 'Transfer',
    purpose: 'TRANSFER',
    securityLevel: 'CRITICAL',
  },
  {
    id: 4,
    name: 'Encryption',
    purpose: 'ENCRYPTION',
    securityLevel: 'MEDIUM',
  },
];

/**
 * Generate a new BIP39 mnemonic phrase, derive the first platform address
 * (bech32m) for receiving funds, and derive identity keys for identity 0.
 *
 * @param {string} [network='testnet'] - Network to derive address for
 * @returns {{ mnemonic: string, address: string, identityKeys: Array }}
 *   Mnemonic, platform address, and identity keys
 */
async function generateMnemonic(network = 'testnet') {
  const mnemonic = await wallet.generateMnemonic();
  const coin = network === 'testnet' ? 1 : 5;

  // Derive the first BIP44 key to get a platform address
  const keyInfo = await wallet.deriveKeyFromSeedWithPath({
    mnemonic,
    path: `m/44'/${coin}'/0'/0/0`,
    network,
  });

  // Derive the platform address (bech32m) from the private key
  const privateKey = PrivateKey.fromWIF(keyInfo.toObject().privateKeyWif);
  const signer = new PlatformAddressSigner();
  const platformAddress = signer.addKey(privateKey);

  // Derive identity keys for identity 0 using DIP-9 paths
  const identityIndex = 0;

  const identityKeys = await Promise.all(
    KEY_META.map(async (meta) => {
      const path = `m/9'/${coin}'/5'/0'/0'/${identityIndex}'/${meta.id}'`;
      const derived = await wallet.deriveKeyFromSeedWithPath({
        mnemonic,
        path,
        network,
      });
      const obj = derived.toObject();
      return {
        id: meta.id,
        name: meta.name,
        keyType: 'ECDSA_SECP256K1',
        purpose: meta.purpose,
        securityLevel: meta.securityLevel,
        privateKeyWif: obj.privateKeyWif,
        privateKeyHex: obj.privateKeyHex,
        publicKeyHex: obj.publicKey,
        derivationPath: path,
      };
    }),
  );

  return {
    mnemonic,
    address: platformAddress.toBech32m(network),
    identityKeys,
  };
}

generateMnemonic()
  .then((result) => {
    console.log('Mnemonic:', result.mnemonic);
    console.log('Platform address:', result.address);
    console.log('\nIdentity keys (identity 0):');
    console.log(JSON.stringify(result.identityKeys, null, 2));
  })
  .catch((e) => console.error('Something went wrong:\n', e));

export { generateMnemonic };
