import { expect } from 'chai';
import dotenv from 'dotenv';
import { Identity, IdentitySigner } from '@dashevo/evo-sdk';
import {
  IdentityKeyManager,
  createClient,
  deriveKeysFromMnemonic,
} from '../tutorials/index.mjs';
import { IDENTITY_ID } from '../tutorials/constants.mjs';

dotenv.config();
const network = process.env.NETWORK || 'testnet';

const TEST_MNEMONIC = 'abandon abandon abandon abandon abandon abandon '
  + 'abandon abandon abandon abandon abandon about';

describe('IdentityKeyManager', function suite() {
  this.timeout(30000);

  let sdk;

  before(async function () {
    sdk = await createClient(network);
  });

  describe('create()', function () {
    it('should derive deterministic keys from mnemonic', async function () {
      const km = await IdentityKeyManager.create({
        sdk,
        identityId: IDENTITY_ID,
        mnemonic: TEST_MNEMONIC,
        network: 'testnet',
        identityIndex: 0,
      });

      expect(km.identityId).to.equal(IDENTITY_ID);
      expect(km.keys.master).to.have.property('keyId', 0);
      expect(km.keys.master).to.have.property('privateKeyWif').that.is.a('string');
      expect(km.keys.auth).to.have.property('keyId', 1);
      expect(km.keys.auth).to.have.property('privateKeyWif').that.is.a('string');
      expect(km.keys.authHigh).to.have.property('keyId', 2);
      expect(km.keys.authHigh).to.have.property('privateKeyWif').that.is.a('string');
      expect(km.keys.transfer).to.have.property('keyId', 3);
      expect(km.keys.transfer).to.have.property('privateKeyWif').that.is.a('string');
      expect(km.keys.encryption).to.have.property('keyId', 4);
      expect(km.keys.encryption).to.have.property('privateKeyWif').that.is.a('string');
    });

    it('should produce same keys as deriveKeysFromMnemonic', async function () {
      const km = await IdentityKeyManager.create({
        sdk,
        identityId: IDENTITY_ID,
        mnemonic: TEST_MNEMONIC,
        network: 'testnet',
        identityIndex: 0,
      });
      const rawKeys = await deriveKeysFromMnemonic(TEST_MNEMONIC, 'testnet', 0, 5);

      expect(km.keys.master.privateKeyWif).to.equal(rawKeys[0].privateKeyWif);
      expect(km.keys.auth.privateKeyWif).to.equal(rawKeys[1].privateKeyWif);
      expect(km.keys.authHigh.privateKeyWif).to.equal(rawKeys[2].privateKeyWif);
      expect(km.keys.transfer.privateKeyWif).to.equal(rawKeys[3].privateKeyWif);
      expect(km.keys.encryption.privateKeyWif).to.equal(rawKeys[4].privateKeyWif);
    });

    it('should auto-resolve identityId from mnemonic when not provided', async function () {
      if (!process.env.PLATFORM_MNEMONIC) {
        this.skip('PLATFORM_MNEMONIC not set');
      }
      const km = await IdentityKeyManager.create({
        sdk,
        mnemonic: process.env.PLATFORM_MNEMONIC,
        network,
      });
      expect(km.identityId).to.be.a('string').with.length.greaterThan(0);
      this.test.title += ` (${km.identityId})`;

      const { identity, identityKey, signer } = await km.getAuth();
      expect(identity).to.be.an.instanceOf(Identity);
      expect(identityKey).to.be.an('object');
      expect(signer).to.be.an.instanceOf(IdentitySigner);
    });

    it('should match explicit identityId when auto-resolved', async function () {
      if (!process.env.PLATFORM_MNEMONIC) {
        this.skip('PLATFORM_MNEMONIC not set');
      }
      const auto = await IdentityKeyManager.create({
        sdk,
        mnemonic: process.env.PLATFORM_MNEMONIC,
        network,
      });
      const explicit = await IdentityKeyManager.create({
        sdk,
        identityId: auto.identityId,
        mnemonic: process.env.PLATFORM_MNEMONIC,
        network,
      });
      expect(auto.identityId).to.equal(explicit.identityId);
      expect(auto.keys.master.privateKeyWif).to.equal(explicit.keys.master.privateKeyWif);
      expect(auto.keys.auth.privateKeyWif).to.equal(explicit.keys.auth.privateKeyWif);
    });

    it('should be deterministic (same inputs = same keys)', async function () {
      const km1 = await IdentityKeyManager.create({
        sdk,
        identityId: IDENTITY_ID,
        mnemonic: TEST_MNEMONIC,
      });
      const km2 = await IdentityKeyManager.create({
        sdk,
        identityId: IDENTITY_ID,
        mnemonic: TEST_MNEMONIC,
      });

      expect(km1.keys.auth.privateKeyWif).to.equal(km2.keys.auth.privateKeyWif);
      expect(km1.keys.master.privateKeyWif).to.equal(km2.keys.master.privateKeyWif);
      expect(km1.keys.authHigh.privateKeyWif).to.equal(km2.keys.authHigh.privateKeyWif);
      expect(km1.keys.transfer.privateKeyWif).to.equal(km2.keys.transfer.privateKeyWif);
      expect(km1.keys.encryption.privateKeyWif).to.equal(km2.keys.encryption.privateKeyWif);
    });
  });

  describe('getAuth()', function () {
    it('should return identity, identityKey, and signer', async function () {
      const km = await IdentityKeyManager.create({
        sdk,
        identityId: IDENTITY_ID,
        mnemonic: TEST_MNEMONIC,
      });
      const result = await km.getAuth();

      expect(result).to.have.property('identity').that.is.an.instanceOf(Identity);
      expect(result).to.have.property('identityKey').that.is.an('object');
      expect(result).to.have.property('signer').that.is.an.instanceOf(IdentitySigner);
    });
  });

  describe('getAuthHigh()', function () {
    it('should return identity, identityKey, and signer', async function () {
      const km = await IdentityKeyManager.create({
        sdk,
        identityId: IDENTITY_ID,
        mnemonic: TEST_MNEMONIC,
      });
      const result = await km.getAuthHigh();

      expect(result).to.have.property('identity').that.is.an.instanceOf(Identity);
      expect(result).to.have.property('identityKey').that.is.an('object');
      expect(result).to.have.property('signer').that.is.an.instanceOf(IdentitySigner);
    });
  });

  describe('getTransfer()', function () {
    it('should return identity, identityKey, and signer', async function () {
      const km = await IdentityKeyManager.create({
        sdk,
        identityId: IDENTITY_ID,
        mnemonic: TEST_MNEMONIC,
      });
      const result = await km.getTransfer();

      expect(result).to.have.property('identity').that.is.an.instanceOf(Identity);
      expect(result).to.have.property('identityKey').that.is.an('object');
      expect(result).to.have.property('signer').that.is.an.instanceOf(IdentitySigner);
    });
  });

  describe('getEncryption()', function () {
    it('should return identity, identityKey, and signer', async function () {
      const km = await IdentityKeyManager.create({
        sdk,
        identityId: IDENTITY_ID,
        mnemonic: TEST_MNEMONIC,
      });
      const result = await km.getEncryption();

      expect(result).to.have.property('identity').that.is.an.instanceOf(Identity);
      expect(result).to.have.property('identityKey').that.is.an('object');
      expect(result).to.have.property('signer').that.is.an.instanceOf(IdentitySigner);
    });
  });

  describe('getMaster()', function () {
    it('should return identity, identityKey, and signer', async function () {
      const km = await IdentityKeyManager.create({
        sdk,
        identityId: IDENTITY_ID,
        mnemonic: TEST_MNEMONIC,
      });
      const result = await km.getMaster();

      expect(result).to.have.property('identity').that.is.an.instanceOf(Identity);
      expect(result).to.have.property('identityKey').that.is.an('object');
      expect(result).to.have.property('signer').that.is.an.instanceOf(IdentitySigner);
    });
  });
});
