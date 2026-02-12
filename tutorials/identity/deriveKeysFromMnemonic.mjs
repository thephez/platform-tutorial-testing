/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk } = await setupDashClient(); */

import { wallet } from '@dashevo/evo-sdk';

/**
 * Derive identity authentication keys from a BIP39 mnemonic using standard
 * DIP-9 derivation paths (compatible with dash-evo-tool / Dash wallets).
 *
 * Path structure:
 *   m/9'/{coin}'/5'/0'/{identityIndex}'/{keyIndex}'
 *
 * Where:
 *   9'  = DIP-9 feature purpose
 *   coin = 5 (mainnet) or 1 (testnet)
 *   5'  = identity feature
 *   0'  = authentication subfeature (ECDSA)
 *   identityIndex' = which identity (0, 1, 2, ...)
 *   keyIndex' = which key within the identity (0, 1, 2, ...)
 */
async function deriveKeysFromMnemonic(
  mnemonic,
  network = 'testnet',
  identityIndex = 0,
  keyCount = 5,
) {
  const coin = network === 'testnet' ? 1 : 5;
  const keys = [];

  for (let keyIndex = 0; keyIndex < keyCount; keyIndex++) {
    const path = `m/9'/${coin}'/5'/0'/0'/${identityIndex}'/${keyIndex}'`;
    const keyInfo = await wallet.deriveKeyFromSeedWithPath({
      mnemonic,
      path,
      network,
    });
    keys.push({ keyIndex, path, ...keyInfo.toObject() });
  }

  return keys;
}

/* deriveKeysFromMnemonic(mnemonic, network, identityIndex)
  .then((keys) => {
    console.log('Derived identity authentication keys:\n');
    for (const key of keys) {
      console.log(`  Key ${key.keyIndex}: ${key.path}`);
      console.log(`    WIF:        ${key.privateKeyWif}`);
      console.log(`    Public Key: ${key.publicKey}`);
      console.log(`    Address:    ${key.address}`);
      console.log();
    }
  })
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { deriveKeysFromMnemonic };
