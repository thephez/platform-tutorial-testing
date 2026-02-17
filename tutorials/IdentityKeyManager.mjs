/* import { setupDashClient } from './sdkClient.mjs';

const { sdk, keyManager } = await setupDashClient(); */

import {
  IdentityPublicKeyInCreation,
  IdentitySigner,
  PrivateKey,
  wallet,
} from '@dashevo/evo-sdk';

/** Key specs for the 5 standard identity keys (DIP-9). */
const KEY_SPECS = [
  { keyId: 0, purpose: 'AUTHENTICATION', securityLevel: 'master' },
  { keyId: 1, purpose: 'AUTHENTICATION', securityLevel: 'high' },
  { keyId: 2, purpose: 'AUTHENTICATION', securityLevel: 'critical' },
  { keyId: 3, purpose: 'TRANSFER', securityLevel: 'critical' },
  { keyId: 4, purpose: 'ENCRYPTION', securityLevel: 'medium' },
];

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
 *   Key 1 = HIGH auth (documents, names)
 *   Key 2 = CRITICAL auth (contracts, documents, names)
 *   Key 3 = TRANSFER (credit transfers/withdrawals)
 *   Key 4 = ENCRYPTION MEDIUM (encrypted messaging/data)
 */
class IdentityKeyManager {
  constructor(sdk, identityId, keys, identityIndex) {
    this.sdk = sdk;
    this.id = identityId;
    this.keys = keys; // { master, auth, authHigh, transfer, encryption }
    this.identityIndex = identityIndex ?? 0;
  }

  get identityId() {
    return this.id;
  }

  /**
   * Create an IdentityKeyManager from a BIP39 mnemonic.
   * Derives all standard identity keys using DIP-9 paths.
   *
   * @param {object} opts
   * @param {object} opts.sdk - Connected EvoSDK instance
   * @param {string} [opts.identityId] - Identity ID. If omitted, auto-resolved
   *   from the mnemonic by looking up the master key's public key hash on-chain.
   * @param {string} opts.mnemonic - BIP39 mnemonic
   * @param {string} [opts.network='testnet'] - 'testnet' or 'mainnet'
   * @param {number} [opts.identityIndex=0] - Which identity derived from this mnemonic
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
      path: `m/9'/${coin}'/5'/0'/0'/${identityIndex}'/${keyIndex}'`,
      network,
    });

    const [masterKey, authHighKey, authKey, transferKey, encryptionKey] =
      await Promise.all([
        derive(0), // MASTER
        derive(1), // HIGH auth
        derive(2), // CRITICAL auth
        derive(3), // TRANSFER
        derive(4), // ENCRYPTION MEDIUM
      ]);

    let resolvedId = identityId;
    if (!resolvedId) {
      const privateKey = PrivateKey.fromWIF(masterKey.toObject().privateKeyWif);
      const pubKeyHash = privateKey.getPublicKeyHash();
      const identity = await sdk.identities.byPublicKeyHash(pubKeyHash);
      if (!identity) {
        throw new Error(
          'No identity found for the given mnemonic (key 0 public key hash)',
        );
      }
      resolvedId = identity.id.toString();
    }

    return new IdentityKeyManager(sdk, resolvedId, {
      master: { keyId: 0, privateKeyWif: masterKey.toObject().privateKeyWif },
      authHigh: {
        keyId: 1,
        privateKeyWif: authHighKey.toObject().privateKeyWif,
      },
      auth: { keyId: 2, privateKeyWif: authKey.toObject().privateKeyWif },
      transfer: {
        keyId: 3,
        privateKeyWif: transferKey.toObject().privateKeyWif,
      },
      encryption: {
        keyId: 4,
        privateKeyWif: encryptionKey.toObject().privateKeyWif,
      },
    }, identityIndex);
  }

  /**
   * Find the first unused DIP-9 identity index for a mnemonic.
   * Scans indices starting at 0 until no on-chain identity is found.
   *
   * @param {object} sdk - Connected EvoSDK instance
   * @param {string} mnemonic - BIP39 mnemonic
   * @param {string} [network='testnet'] - 'testnet' or 'mainnet'
   * @returns {Promise<number>} The first unused identity index
   */
  // eslint-disable-next-line no-await-in-loop
  static async findNextIndex(sdk, mnemonic, network = 'testnet') {
    const coin = network === 'testnet' ? 1 : 5;
    for (let i = 0; ; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const key = await wallet.deriveKeyFromSeedWithPath({
        mnemonic,
        path: `m/9'/${coin}'/5'/0'/0'/${i}'/0'`,
        network,
      });
      const privateKey = PrivateKey.fromWIF(key.toObject().privateKeyWif);
      // eslint-disable-next-line no-await-in-loop
      const existing = await sdk.identities.byPublicKeyHash(
        privateKey.getPublicKeyHash(),
      );
      if (!existing) return i;
    }
  }

  /**
   * Create an IdentityKeyManager for a new (not yet registered) identity.
   * Derives keys and stores public key data needed for identity creation.
   * If identityIndex is omitted, auto-selects the next unused index.
   *
   * @param {object} opts
   * @param {object} opts.sdk - Connected EvoSDK instance
   * @param {string} opts.mnemonic - BIP39 mnemonic
   * @param {string} [opts.network='testnet'] - 'testnet' or 'mainnet'
   * @param {number} [opts.identityIndex] - Identity index (auto-scanned if omitted)
   * @returns {Promise<IdentityKeyManager>}
   */
  static async createForNewIdentity({
    sdk,
    mnemonic,
    network = 'testnet',
    identityIndex,
  }) {
    const idx = identityIndex
      ?? (await IdentityKeyManager.findNextIndex(sdk, mnemonic, network));
    const coin = network === 'testnet' ? 1 : 5;
    const derive = (keyIndex) => wallet.deriveKeyFromSeedWithPath({
      mnemonic,
      path: `m/9'/${coin}'/5'/0'/0'/${idx}'/${keyIndex}'`,
      network,
    });

    const derivedKeys = await Promise.all(
      KEY_SPECS.map((spec) => derive(spec.keyId)),
    );

    const keys = {
      master: {
        keyId: 0,
        privateKeyWif: derivedKeys[0].toObject().privateKeyWif,
        publicKey: derivedKeys[0].toObject().publicKey,
      },
      authHigh: {
        keyId: 1,
        privateKeyWif: derivedKeys[1].toObject().privateKeyWif,
        publicKey: derivedKeys[1].toObject().publicKey,
      },
      auth: {
        keyId: 2,
        privateKeyWif: derivedKeys[2].toObject().privateKeyWif,
        publicKey: derivedKeys[2].toObject().publicKey,
      },
      transfer: {
        keyId: 3,
        privateKeyWif: derivedKeys[3].toObject().privateKeyWif,
        publicKey: derivedKeys[3].toObject().publicKey,
      },
      encryption: {
        keyId: 4,
        privateKeyWif: derivedKeys[4].toObject().privateKeyWif,
        publicKey: derivedKeys[4].toObject().publicKey,
      },
    };

    return new IdentityKeyManager(sdk, null, keys, idx);
  }

  /**
   * Build IdentityPublicKeyInCreation objects for all 5 standard keys.
   * Only works when public key data is available (via createForNewIdentity).
   *
   * @returns {IdentityPublicKeyInCreation[]}
   */
  getKeysInCreation() {
    return KEY_SPECS.map((spec) => {
      const key = Object.values(this.keys).find((k) => k.keyId === spec.keyId);
      if (!key?.publicKey) {
        throw new Error(
          `Public key data not available for key ${spec.keyId}. Use createForNewIdentity().`,
        );
      }
      const pubKeyData = Uint8Array.from(Buffer.from(key.publicKey, 'hex'));
      return new IdentityPublicKeyInCreation(
        spec.keyId,
        spec.purpose,
        spec.securityLevel,
        'ECDSA_SECP256K1',
        false,
        pubKeyData,
        [],
      );
    });
  }

  /**
   * Build an IdentitySigner loaded with all 5 key WIFs.
   * Useful for identity creation where all keys must sign.
   *
   * @returns {IdentitySigner}
   */
  getFullSigner() {
    const signer = new IdentitySigner();
    Object.values(this.keys).forEach((key) => {
      signer.addKeyFromWif(key.privateKeyWif);
    });
    return signer;
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

  /** CRITICAL auth (key 2) — contracts, documents, names. */
  async getAuth() {
    return this.getSigner('auth');
  }

  /** HIGH auth (key 1) — documents, names. */
  async getAuthHigh() {
    return this.getSigner('authHigh');
  }

  /** TRANSFER — credit transfers, withdrawals. */
  async getTransfer() {
    return this.getSigner('transfer');
  }

  /** ENCRYPTION MEDIUM — encrypted messaging/data. */
  async getEncryption() {
    return this.getSigner('encryption');
  }

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
