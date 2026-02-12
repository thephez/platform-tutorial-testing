/* import { setupDashClient } from './sdkClient.mjs';

const { sdk } = await setupDashClient(); */

import { wallet, PlatformAddressSigner, PrivateKey } from '@dashevo/evo-sdk';

/**
 * Manages platform address keys and signing for address operations.
 *
 * Parallel to IdentityKeyManager but for platform address operations.
 * Derives BIP44 keys from a mnemonic and provides ready-to-use
 * PlatformAddressSigner instances.
 *
 * Platform addresses are bech32m-encoded L2 addresses (tdash1... on testnet)
 * that hold credits directly, independent of identities.
 */
class AddressKeyManager {
  constructor(sdk, addresses, network) {
    this.sdk = sdk;
    this.addresses = addresses; // [{ address, bech32m, privateKeyWif, path }]
    this.network = network;
  }

  /** The first derived address (index 0). */
  get primaryAddress() {
    return this.addresses[0];
  }

  /**
   * Create an AddressKeyManager from a BIP39 mnemonic.
   * Derives platform address keys using BIP44 paths.
   *
   * @param {object} opts
   * @param {object} opts.sdk - Connected EvoSDK instance
   * @param {string} opts.mnemonic - BIP39 mnemonic
   * @param {string} [opts.network='testnet'] - 'testnet' or 'mainnet'
   * @param {number} [opts.count=1] - Number of addresses to derive
   */
  static async create({ sdk, mnemonic, network = 'testnet', count = 1 }) {
    const coin = network === 'testnet' ? 1 : 5;
    const addresses = [];

    for (let i = 0; i < count; i++) {
      const path = `m/44'/${coin}'/0'/0/${i}`;
      const keyInfo = await wallet.deriveKeyFromSeedWithPath({
        mnemonic,
        path,
        network,
      });
      const obj = keyInfo.toObject();
      const privateKey = PrivateKey.fromWIF(obj.privateKeyWif);
      const signer = new PlatformAddressSigner();
      const platformAddress = signer.addKey(privateKey);

      addresses.push({
        address: platformAddress,
        bech32m: platformAddress.toBech32m(network),
        privateKeyWif: obj.privateKeyWif,
        path,
      });
    }

    return new AddressKeyManager(sdk, addresses, network);
  }

  /**
   * Create a PlatformAddressSigner with the primary key loaded.
   * @returns {PlatformAddressSigner}
   */
  getSigner() {
    const signer = new PlatformAddressSigner();
    const privateKey = PrivateKey.fromWIF(this.primaryAddress.privateKeyWif);
    signer.addKey(privateKey);
    return signer;
  }

  /**
   * Create a PlatformAddressSigner with all derived keys loaded.
   * @returns {PlatformAddressSigner}
   */
  getFullSigner() {
    const signer = new PlatformAddressSigner();
    for (const addr of this.addresses) {
      const privateKey = PrivateKey.fromWIF(addr.privateKeyWif);
      signer.addKey(privateKey);
    }
    return signer;
  }

  /**
   * Fetch current balance and nonce for the primary address.
   * @returns {Promise<PlatformAddressInfo|undefined>}
   */
  async getInfo() {
    return this.sdk.addresses.get(this.primaryAddress.bech32m);
  }

  /**
   * Fetch current balance and nonce for an address by index.
   * @param {number} index - Address index
   * @returns {Promise<PlatformAddressInfo|undefined>}
   */
  async getInfoAt(index) {
    return this.sdk.addresses.get(this.addresses[index].bech32m);
  }
}

/* // Usage:
const addressKeyManager = await AddressKeyManager.create({
  sdk, mnemonic: process.env.PLATFORM_MNEMONIC, network: 'testnet', count: 2,
});
const signer = addressKeyManager.getSigner();
const info = await addressKeyManager.getInfo(); */

export { AddressKeyManager };
