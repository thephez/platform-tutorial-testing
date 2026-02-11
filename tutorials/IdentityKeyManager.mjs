/* import { EvoSDK } from '@dashevo/evo-sdk';
import { IdentityKeyManager } from './IdentityKeyManager.mjs';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect();

const keyManager = await IdentityKeyManager.create({
  sdk,
  identityId: 'your identity id here',
  mnemonic: 'your twelve word mnemonic here',
  network: 'testnet',
  identityIndex: 0,
}); */

import { IdentitySigner, wallet } from '@dashevo/evo-sdk';

/**
 * Manages identity keys and signing for write operations.
 *
 * Mirrors the old js-dash-sdk pattern where `setupDashClient()` hid all
 * wallet/signing config. Construct once, then call getAuth(), getTransfer(),
 * or getMaster() to get a ready-to-use { identity, identityKey, signer }.
 *
 * Keys are derived from a BIP39 mnemonic using standard DIP-9 paths
 * (compatible with dash-evo-tool / Dash wallets):
 *   Key 0 = MASTER (identity updates)
 *   Key 1 = CRITICAL auth (contracts, documents, names)
 *   Key 2 = HIGH auth (documents, names)
 *   Key 3 = TRANSFER (credit transfers/withdrawals)
 *   Key 4 = ENCRYPTION HIGH (encrypted messaging/data)
 */
class IdentityKeyManager {
  constructor(sdk, identityId, keys) {
    this.sdk = sdk;
    this.id = identityId;
    this.keys = keys; // { master, auth, authHigh, transfer, encryption }
  }

  get identityId() {
    return this.id;
  }

  /**
   * Create an IdentityKeyManager from a BIP39 mnemonic.
   * Derives all standard identity keys using DIP-9 paths.
   */
  static async create({
    sdk,
    identityId,
    mnemonic,
    network = 'testnet',
    identityIndex = 0,
  }) {
    const coin = network === 'testnet' ? 1 : 5;
    const derive = (keyIndex) => wallet.deriveKeyFromSeedWithPath({
      mnemonic,
      path: `m/9'/${coin}'/5'/0'/${identityIndex}'/${keyIndex}'`,
      network,
    });

    const [masterKey, authKey, authHighKey, transferKey, encryptionKey] =
      await Promise.all([
        derive(0), // MASTER
        derive(1), // CRITICAL auth
        derive(2), // HIGH auth
        derive(3), // TRANSFER
        derive(4), // ENCRYPTION HIGH
      ]);

    return new IdentityKeyManager(sdk, identityId, {
      master: { keyId: 0, privateKeyWif: masterKey.toObject().privateKeyWif },
      auth: { keyId: 1, privateKeyWif: authKey.toObject().privateKeyWif },
      authHigh: { keyId: 2, privateKeyWif: authHighKey.toObject().privateKeyWif },
      transfer: { keyId: 3, privateKeyWif: transferKey.toObject().privateKeyWif },
      encryption: { keyId: 4, privateKeyWif: encryptionKey.toObject().privateKeyWif },
    });
  }

  /**
   * Fetch identity and build { identity, identityKey, signer } for a given key.
   * @param {string} keyName - One of: master, auth, authHigh, transfer, encryption
   * @returns {{ identity, identityKey, signer }}
   */
  async getSigner(keyName) {
    const key = this.keys[keyName];
    const identity = await this.sdk.identities.fetch(this.id);
    const identityKey = identity.getPublicKeyById(key.keyId);
    const signer = new IdentitySigner();
    signer.addKeyFromWif(key.privateKeyWif);
    return { identity, identityKey, signer };
  }

  /** CRITICAL auth — contracts, documents, names. */
  async getAuth() { return this.getSigner('auth'); }

  /** HIGH auth — documents, names (alternative). */
  async getAuthHigh() { return this.getSigner('authHigh'); }

  /** TRANSFER — credit transfers, withdrawals. */
  async getTransfer() { return this.getSigner('transfer'); }

  /** ENCRYPTION HIGH — encrypted messaging/data. */
  async getEncryption() { return this.getSigner('encryption'); }

  /**
   * MASTER — identity updates (add/disable keys).
   * @param {string[]} [additionalKeyWifs] - WIFs for new keys being added
   */
  async getMaster(additionalKeyWifs) {
    const result = await this.getSigner('master');
    if (additionalKeyWifs) {
      additionalKeyWifs.forEach((wif) => result.signer.addKeyFromWif(wif));
    }
    return result;
  }
}

/* // Usage with a tutorial:
const { identity, identityKey, signer } = await keyManager.getAuth();
// Pass to any write tutorial that needs auth signing */

export { IdentityKeyManager };
