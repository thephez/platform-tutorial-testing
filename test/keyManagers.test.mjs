import { expect } from 'chai';
import dotenv from 'dotenv';
import {
  Identity,
  IdentityPublicKeyInCreation,
  IdentitySigner,
  PlatformAddressSigner,
  PrivateKey,
} from '@dashevo/evo-sdk';
import {
  IdentityKeyManager,
  AddressKeyManager,
  createClient,
  deriveKeysFromMnemonic,
} from '../tutorials/index.mjs';
import { IDENTITY_ID } from '../tutorials/constants.mjs';

dotenv.config();
const network = process.env.NETWORK || 'testnet';

const TEST_MNEMONIC =
  'abandon abandon abandon abandon abandon abandon ' +
  'abandon abandon abandon abandon abandon about';

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
      expect(km.keys.master)
        .to.have.property('privateKeyWif')
        .that.is.a('string');
      expect(km.keys.authHigh).to.have.property('keyId', 1);
      expect(km.keys.authHigh)
        .to.have.property('privateKeyWif')
        .that.is.a('string');
      expect(km.keys.auth).to.have.property('keyId', 2);
      expect(km.keys.auth)
        .to.have.property('privateKeyWif')
        .that.is.a('string');
      expect(km.keys.transfer).to.have.property('keyId', 3);
      expect(km.keys.transfer)
        .to.have.property('privateKeyWif')
        .that.is.a('string');
      expect(km.keys.encryption).to.have.property('keyId', 4);
      expect(km.keys.encryption)
        .to.have.property('privateKeyWif')
        .that.is.a('string');
    });

    it('should produce same keys as deriveKeysFromMnemonic', async function () {
      const km = await IdentityKeyManager.create({
        sdk,
        identityId: IDENTITY_ID,
        mnemonic: TEST_MNEMONIC,
        network: 'testnet',
        identityIndex: 0,
      });
      const rawKeys = await deriveKeysFromMnemonic(
        TEST_MNEMONIC,
        'testnet',
        0,
        5,
      );

      expect(km.keys.master.privateKeyWif).to.equal(rawKeys[0].privateKeyWif);
      expect(km.keys.authHigh.privateKeyWif).to.equal(rawKeys[1].privateKeyWif);
      expect(km.keys.auth.privateKeyWif).to.equal(rawKeys[2].privateKeyWif);
      expect(km.keys.transfer.privateKeyWif).to.equal(rawKeys[3].privateKeyWif);
      expect(km.keys.encryption.privateKeyWif).to.equal(
        rawKeys[4].privateKeyWif,
      );
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
      expect(auto.keys.master.privateKeyWif).to.equal(
        explicit.keys.master.privateKeyWif,
      );
      expect(auto.keys.auth.privateKeyWif).to.equal(
        explicit.keys.auth.privateKeyWif,
      );
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
      expect(km1.keys.master.privateKeyWif).to.equal(
        km2.keys.master.privateKeyWif,
      );
      expect(km1.keys.authHigh.privateKeyWif).to.equal(
        km2.keys.authHigh.privateKeyWif,
      );
      expect(km1.keys.transfer.privateKeyWif).to.equal(
        km2.keys.transfer.privateKeyWif,
      );
      expect(km1.keys.encryption.privateKeyWif).to.equal(
        km2.keys.encryption.privateKeyWif,
      );
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

      expect(result)
        .to.have.property('identity')
        .that.is.an.instanceOf(Identity);
      expect(result).to.have.property('identityKey').that.is.an('object');
      expect(result)
        .to.have.property('signer')
        .that.is.an.instanceOf(IdentitySigner);
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

      expect(result)
        .to.have.property('identity')
        .that.is.an.instanceOf(Identity);
      expect(result).to.have.property('identityKey').that.is.an('object');
      expect(result)
        .to.have.property('signer')
        .that.is.an.instanceOf(IdentitySigner);
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

      expect(result)
        .to.have.property('identity')
        .that.is.an.instanceOf(Identity);
      expect(result).to.have.property('identityKey').that.is.an('object');
      expect(result)
        .to.have.property('signer')
        .that.is.an.instanceOf(IdentitySigner);
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

      expect(result)
        .to.have.property('identity')
        .that.is.an.instanceOf(Identity);
      expect(result).to.have.property('identityKey').that.is.an('object');
      expect(result)
        .to.have.property('signer')
        .that.is.an.instanceOf(IdentitySigner);
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

      expect(result)
        .to.have.property('identity')
        .that.is.an.instanceOf(Identity);
      expect(result).to.have.property('identityKey').that.is.an('object');
      expect(result)
        .to.have.property('signer')
        .that.is.an.instanceOf(IdentitySigner);
    });
  });

  describe('identityIndex', function () {
    it('should store the provided identityIndex', async function () {
      const km = await IdentityKeyManager.create({
        sdk,
        identityId: IDENTITY_ID,
        mnemonic: TEST_MNEMONIC,
        identityIndex: 3,
      });
      expect(km.identityIndex).to.equal(3);
    });

    it('should default identityIndex to 0', async function () {
      const km = await IdentityKeyManager.create({
        sdk,
        identityId: IDENTITY_ID,
        mnemonic: TEST_MNEMONIC,
      });
      expect(km.identityIndex).to.equal(0);
    });
  });

  describe('getFullSigner()', function () {
    it('should return an IdentitySigner with all keys', async function () {
      const km = await IdentityKeyManager.create({
        sdk,
        identityId: IDENTITY_ID,
        mnemonic: TEST_MNEMONIC,
      });
      const signer = km.getFullSigner();
      expect(signer).to.be.an.instanceOf(IdentitySigner);
    });
  });

  describe('getKeysInCreation()', function () {
    it('should throw when public keys are not available', async function () {
      const km = await IdentityKeyManager.create({
        sdk,
        identityId: IDENTITY_ID,
        mnemonic: TEST_MNEMONIC,
      });
      expect(() => km.getKeysInCreation()).to.throw(
        'Public key data not available',
      );
    });

    it('should return 5 IdentityPublicKeyInCreation when public keys present', async function () {
      // Construct a manager with publicKey fields (as createForNewIdentity does)
      const base = await IdentityKeyManager.create({
        sdk,
        identityId: IDENTITY_ID,
        mnemonic: TEST_MNEMONIC,
      });
      const withPub = (entry) => {
        const pk = PrivateKey.fromWIF(entry.privateKeyWif);
        const publicKey = Buffer.from(pk.getPublicKey().toBytes()).toString(
          'hex',
        );
        return { ...entry, publicKey };
      };
      const km = new IdentityKeyManager(
        sdk,
        null,
        {
          master: withPub(base.keys.master),
          authHigh: withPub(base.keys.authHigh),
          auth: withPub(base.keys.auth),
          transfer: withPub(base.keys.transfer),
          encryption: withPub(base.keys.encryption),
        },
        0,
      );

      const keys = km.getKeysInCreation();
      expect(keys).to.be.an('array').with.length(5);
      keys.forEach((k) => {
        expect(k).to.be.an.instanceOf(IdentityPublicKeyInCreation);
      });
    });
  });

  describe('getSigner() guard', function () {
    it('should throw when identity ID is not set', async function () {
      const km = new IdentityKeyManager(sdk, null, {
        auth: { keyId: 2, privateKeyWif: 'placeholder' },
      }, 0);
      try {
        await km.getAuth();
        expect.fail('should have thrown');
      } catch (err) {
        expect(err.message).to.include('Identity ID is not set');
      }
    });
  });
});

describe('AddressKeyManager', function suite() {
  this.timeout(30000);

  let sdk;
  let akm;

  before(async function () {
    sdk = await createClient(network);
    akm = await AddressKeyManager.create({
      sdk,
      mnemonic: TEST_MNEMONIC,
      network: 'testnet',
      count: 2,
    });
  });

  describe('create()', function () {
    it('should derive addresses from mnemonic', function () {
      expect(akm.addresses).to.have.length(2);
      akm.addresses.forEach((addr) => {
        expect(addr).to.have.property('address');
        expect(addr).to.have.property('bech32m').that.is.a('string');
        expect(addr.bech32m).to.match(/^tdash1/);
        expect(addr).to.have.property('privateKeyWif').that.is.a('string');
        expect(addr).to.have.property('path').that.is.a('string');
      });
    });

    it('should be deterministic (same inputs = same addresses)', async function () {
      const akm2 = await AddressKeyManager.create({
        sdk,
        mnemonic: TEST_MNEMONIC,
        network: 'testnet',
        count: 2,
      });
      expect(akm.addresses[0].bech32m).to.equal(akm2.addresses[0].bech32m);
      expect(akm.addresses[1].bech32m).to.equal(akm2.addresses[1].bech32m);
    });

    it('should default to count=1', async function () {
      const single = await AddressKeyManager.create({
        sdk,
        mnemonic: TEST_MNEMONIC,
        network: 'testnet',
      });
      expect(single.addresses).to.have.length(1);
    });
  });

  describe('primaryAddress', function () {
    it('should return the first derived address', function () {
      expect(akm.primaryAddress).to.equal(akm.addresses[0]);
      expect(akm.primaryAddress).to.have.property('bech32m').that.is.a('string');
    });
  });

  describe('getSigner()', function () {
    it('should return a PlatformAddressSigner', function () {
      const signer = akm.getSigner();
      expect(signer).to.be.an.instanceOf(PlatformAddressSigner);
    });
  });

  describe('getFullSigner()', function () {
    it('should return a PlatformAddressSigner with all keys', function () {
      const signer = akm.getFullSigner();
      expect(signer).to.be.an.instanceOf(PlatformAddressSigner);
    });
  });

  describe('getInfo()', function () {
    it('should fetch primary address info', async function () {
      if (!process.env.PLATFORM_MNEMONIC) {
        this.skip('PLATFORM_MNEMONIC not set (address may not be funded)');
      }
      const funded = await AddressKeyManager.create({
        sdk,
        mnemonic: process.env.PLATFORM_MNEMONIC,
        network,
      });
      const info = await funded.getInfo();
      // Address may or may not be funded — just verify no crash
      // If funded, info is an object; if not, undefined
      if (info) {
        expect(info).to.be.an('object');
      }
    });
  });

  describe('getInfoAt()', function () {
    it('should throw for out-of-range index', async function () {
      const empty = new AddressKeyManager(null, [], 'testnet');
      try {
        await empty.getInfoAt(0);
        expect.fail('should have thrown');
      } catch (err) {
        expect(err.message).to.include('No derived address at index 0');
      }
    });
  });
});
