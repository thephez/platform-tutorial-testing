/* import { wallet, PlatformAddressSigner, PrivateKey } from '@dashevo/evo-sdk'; */

import { wallet, PlatformAddressSigner, PrivateKey } from '@dashevo/evo-sdk';

/**
 * Generate a new BIP39 mnemonic and derive the first platform address.
 *
 * @param {string} [network='testnet'] - 'testnet' or 'mainnet'
 * @returns {{ mnemonic: string, address: string }}
 */
async function getNewWalletInfo(network = 'testnet') {
  const mnemonic = await wallet.generateMnemonic();
  const coin = network === 'testnet' ? 1 : 5;

  const keyInfo = await wallet.deriveKeyFromSeedWithPath({
    mnemonic,
    path: `m/44'/${coin}'/0'/0/0`,
    network,
  });

  const privateKey = PrivateKey.fromWIF(keyInfo.toObject().privateKeyWif);
  const signer = new PlatformAddressSigner();
  const platformAddress = signer.addKey(privateKey);

  return {
    mnemonic,
    address: platformAddress.toBech32m(network),
  };
}

/* getNewWalletInfo()
  .then((r) => console.log('Mnemonic:', r.mnemonic, '\nAddress:', r.address))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { getNewWalletInfo };
