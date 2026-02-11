import { createRequire } from 'node:module';
import { expect } from 'chai';
import dotenv from 'dotenv';
import {
  DataContract,
  Document,
  Identity,
  IdentityCreditTransferResult,
  IdentityPublicKeyInCreation,
  RegisterDpnsNameResult,
  wallet,
} from '@dashevo/evo-sdk';
import {
  createClient,
  checkNetworkConnection,
  getSystemInfo,
  retrieveIdentity,
  updateIdentity,
  transferCredits,
  withdrawCredits,
  deriveKeysFromMnemonic,
  retrieveNameByName,
  retrieveNameByRecord,
  retrieveNameBySearch,
  registerName,
  retrieveContract,
  registerContract,
  updateContract,
  getDocuments,
  submitDocument,
  updateDocument,
  deleteDocument,
  retrieveIdentityBalance,
  retrieveIdentityKeys,
  checkNameAvailability,
  retrieveContractHistory,
  getEpochInfo,
  getCurrentEpoch,
  getTokenInfo,
  getTokenBalances,
} from '../tutorials/index.mjs';
import {
  DPNS_CONTRACT_ID,
  IDENTITY_ID,
  IDENTITY_NAME,
  CORE_WITHDRAWAL_ADDRESS,
  HISTORY_CONTRACT_ID,
  TOKEN_ID,
  TOKEN_HOLDER_ID,
} from '../tutorials/constants.mjs';

const require = createRequire(import.meta.url);
const contractMinimal = require('../tutorials/contract/contracts/contractMinimal.json');
const contractWithIndex = require('../tutorials/contract/contracts/contractWithIndex.json');
const contractWithTimestamps = require('../tutorials/contract/contracts/contractWithTimestamps.json');
const contractWithBinaryData = require('../tutorials/contract/contracts/contractWithBinaryData.json');
const contractNft = require('../tutorials/contract/contracts/contractNft.json');
const contractWithRef = require('../tutorials/contract/contracts/contractWithRef.json');

dotenv.config();
const network = process.env.NETWORK || 'testnet';

let sdk;

describe(`EVO SDK Tutorial Tests (${new Date().toLocaleTimeString()})`, function suite() {
  this.timeout(40000);

  before(async function () {
    sdk = await createClient(network);
  });

  describe('Network connection and System info', function () {
    it('checkNetworkConnection - should return system status', async function () {
      const result = await checkNetworkConnection(sdk);
      expect(result).to.be.an('object');
      expect(result.toJSON).to.be.a('function');
      const json = result.toJSON();
      expect(json).to.have.nested.property('version.software.dapi');
      expect(json).to.have.nested.property('chain.latestBlockHeight');
      expect(json)
        .to.have.nested.property('network.chainId')
        .that.includes('dash');
    });

    it('getSystemInfo - should return status and epoch', async function () {
      const result = await getSystemInfo(sdk);
      expect(result).to.have.property('status').that.is.an('object');
      expect(result).to.have.property('currentEpoch').that.is.an('object');
      const statusJson = result.status.toJSON();
      expect(statusJson).to.have.nested.property('version.software.dapi');
      const epochJson = result.currentEpoch.toJSON();
      expect(epochJson).to.have.nested.property('V0.index').that.is.a('number');
      expect(epochJson)
        .to.have.nested.property('V0.protocol_version')
        .that.is.a('number');
    });

    it('getCurrentEpoch - should return current epoch info', async function () {
      const result = await getCurrentEpoch(sdk);
      expect(result).to.be.an('object');
      const json = result.toJSON();
      expect(json).to.have.nested.property('V0.index').that.is.a('number');
      expect(json)
        .to.have.nested.property('V0.protocol_version')
        .that.is.a('number');
    });

    it('getEpochInfo - should return epoch info for a range', async function () {
      const current = await getCurrentEpoch(sdk);
      const currentIndex = current.toJSON().V0.index;
      const result = await getEpochInfo(sdk, Math.max(0, currentIndex - 2), 3);
      expect(result).to.be.instanceOf(Map);
      expect(result.size).to.be.greaterThan(0);
    });
  });

  describe('Identity tutorials', function () {
    it(`retrieveIdentity - should fetch identity (${IDENTITY_ID})`, async function () {
      const result = await retrieveIdentity(sdk, IDENTITY_ID);
      expect(result).to.be.an.instanceOf(Identity);
      expect(result.toJSON).to.be.a('function');
      const json = result.toJSON();
      expect(json).to.have.property('id', IDENTITY_ID);
      expect(json).to.have.property('balance').that.is.a('number');
      expect(json)
        .to.have.property('publicKeys')
        .that.is.an('array')
        .with.length.greaterThan(0);
    });

    it(`retrieveIdentityBalance - should fetch identity balance (${IDENTITY_ID})`, async function () {
      const result = await retrieveIdentityBalance(sdk, IDENTITY_ID);
      expect(typeof result).to.equal('bigint');
      expect(result > 0n).to.be.true;
      this.test.title += ` | balance: ${result}`;
    });

    it(`retrieveIdentityKeys - should fetch identity keys (${IDENTITY_ID})`, async function () {
      const result = await retrieveIdentityKeys(sdk, IDENTITY_ID);
      expect(result).to.be.an('array').with.length.greaterThan(0);
      result.forEach((key) => {
        expect(key.toJSON).to.be.a('function');
        const json = key.toJSON();
        expect(json).to.have.property('id').that.is.a('number');
        expect(json).to.have.property('purpose');
        expect(json).to.have.property('securityLevel');
        expect(json).to.have.property('type');
      });
    });
  });

  describe('Mnemonic key derivation', function () {
    const testMnemonic =
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

    it('deriveKeysFromMnemonic - should derive deterministic keys from mnemonic', async function () {
      const keys = await deriveKeysFromMnemonic(testMnemonic, 'testnet', 0, 3);
      expect(keys).to.be.an('array').with.lengthOf(3);

      keys.forEach((key) => {
        expect(key).to.have.property('keyIndex').that.is.a('number');
        expect(key).to.have.property('path').that.is.a('string');
        expect(key).to.have.property('privateKeyWif').that.is.a('string');
        expect(key).to.have.property('publicKey').that.is.a('string');
        expect(key).to.have.property('address').that.is.a('string');
        expect(key).to.have.property('network', 'testnet');
      });

      // Verify DIP-9 path structure
      expect(keys[0].path).to.equal("m/9'/1'/5'/0'/0'/0'");
      expect(keys[1].path).to.equal("m/9'/1'/5'/0'/0'/1'");
      expect(keys[2].path).to.equal("m/9'/1'/5'/0'/0'/2'");

      // Keys should be unique
      const wifs = keys.map((k) => k.privateKeyWif);
      expect(new Set(wifs).size).to.equal(3);
    });

    it('deriveKeysFromMnemonic - should be deterministic (same mnemonic = same keys)', async function () {
      const keys1 = await deriveKeysFromMnemonic(testMnemonic, 'testnet', 0, 1);
      const keys2 = await deriveKeysFromMnemonic(testMnemonic, 'testnet', 0, 1);
      expect(keys1[0].privateKeyWif).to.equal(keys2[0].privateKeyWif);
      expect(keys1[0].publicKey).to.equal(keys2[0].publicKey);
    });

    it('deriveKeysFromMnemonic - different identity indices should produce different keys', async function () {
      const keys0 = await deriveKeysFromMnemonic(testMnemonic, 'testnet', 0, 1);
      const keys1 = await deriveKeysFromMnemonic(testMnemonic, 'testnet', 1, 1);
      expect(keys0[0].privateKeyWif).to.not.equal(keys1[0].privateKeyWif);
      expect(keys1[0].path).to.equal("m/9'/1'/5'/0'/1'/0'");
    });
  });

  describe('Name tutorials', function () {
    it(`retrieveNameByName - should resolve name (${IDENTITY_NAME})`, async function () {
      const result = await retrieveNameByName(sdk, IDENTITY_NAME);
      expect(result).to.be.a('string');
      expect(result).to.equal(IDENTITY_ID);
    });

    it(`retrieveNameByRecord - should return names for identity (${IDENTITY_ID})`, async function () {
      const result = await retrieveNameByRecord(sdk, IDENTITY_ID);
      expect(result).to.be.an('array').with.length.greaterThan(0);
      expect(result[0]).to.be.a('string').that.includes('.dash');
    });

    it('retrieveNameBySearch - should return documents matching prefix', async function () {
      const result = await retrieveNameBySearch(sdk, 'Tutorial-Test-');
      expect(result).to.be.instanceOf(Map);
      expect(result.size).to.be.greaterThan(0);
      const [firstId, firstDoc] = result.entries().next().value;
      expect(firstId.toString()).to.be.a('string').with.length.greaterThan(0);
      expect(firstDoc).to.be.an.instanceOf(Document);
      const docJson = firstDoc.toJSON();
      expect(docJson).to.have.property('label').that.is.a('string');
      expect(docJson).to.have.property('normalizedLabel').that.is.a('string');
    });

    it(`checkNameAvailability - should return false for a taken name (${IDENTITY_NAME})`, async function () {
      const result = await checkNameAvailability(sdk, IDENTITY_NAME);
      expect(result).to.be.false;
    });

    it('checkNameAvailability - should return true for an available name', async function () {
      const result = await checkNameAvailability(
        sdk,
        `nonexistent-name-${Date.now()}`,
      );
      expect(result).to.be.true;
    });
  });

  describe('Contract tutorials', function () {
    it(`retrieveContract - should fetch DPNS contract (${DPNS_CONTRACT_ID})`, async function () {
      const result = await retrieveContract(sdk, DPNS_CONTRACT_ID);
      expect(result).to.be.an.instanceOf(DataContract);
      expect(result.toJSON).to.be.a('function');
      const json = result.toJSON();
      expect(json).to.have.property('id', DPNS_CONTRACT_ID);
      expect(json).to.have.property('config');
      expect(json).to.have.property('documentSchemas');
      expect(json).to.have.property('version').that.is.a('number');
    });

    it(`retrieveContractHistory - should fetch contract history (${HISTORY_CONTRACT_ID})`, async function () {
      if (!HISTORY_CONTRACT_ID) {
        this.skip('HISTORY_CONTRACT_ID not configured');
        return;
      }
      const result = await retrieveContractHistory(sdk, HISTORY_CONTRACT_ID);
      expect(result).to.be.instanceOf(Map);
      expect(result.size).to.be.greaterThan(0);
      const [timestamp, contract] = result.entries().next().value;
      expect(typeof timestamp).to.equal('bigint');
      expect(timestamp > 0n).to.be.true;
      expect(contract).to.be.an.instanceOf(DataContract);
      const json = contract.toJSON();
      expect(json).to.have.property('id', HISTORY_CONTRACT_ID);
      expect(json).to.have.property('version').that.is.a('number');
      expect(json).to.have.property('documentSchemas').that.is.an('object');
      this.test.title += ` | ${result.size} version(s)`;
    });
  });

  describe('Document tutorials', function () {
    it('getDocuments - should query DPNS domain documents', async function () {
      const result = await getDocuments(sdk, DPNS_CONTRACT_ID, 'domain', 2);
      expect(result).to.be.instanceOf(Map);
      expect(result.size).to.equal(2);
      const [firstId, firstDoc] = result.entries().next().value;
      expect(firstId.toString()).to.be.a('string').with.length.greaterThan(0);
      const docJson = firstDoc.toJSON();
      expect(docJson).to.have.property('$id').that.is.a('string');
      expect(docJson).to.have.property('$ownerId').that.is.a('string');
      expect(docJson).to.have.property('label').that.is.a('string');
    });
  });

  describe('Token tutorials', function () {
    it('getTokenInfo - should return token supply and status', async function () {
      if (!TOKEN_ID) {
        this.skip('TOKEN_ID not configured');
        return;
      }
      const result = await getTokenInfo(sdk, TOKEN_ID);
      expect(result).to.have.property('totalSupply');
      expect(result).to.have.property('status');
    });

    it('getTokenBalances - should return token balances', async function () {
      if (!TOKEN_ID) {
        this.skip('TOKEN_ID not configured');
        return;
      }
      const result = await getTokenBalances(sdk, TOKEN_ID, [TOKEN_HOLDER_ID]);
      expect(result).to.be.instanceOf(Map);
      expect(result.size).to.be.greaterThan(0);
      const [[id, balance]] = result;
      expect(id.toString()).to.equal(TOKEN_HOLDER_ID);
      expect(typeof balance).to.equal('bigint');
      this.test.title += ` | ${id}: ${balance}`;
    });
  });
});

// Write tutorial tests — require IDENTITY_ID, PRIVATE_KEY_WIF env vars
const writeIdentityId = process.env.IDENTITY_ID;
const writePrivateKeyWif = process.env.PRIVATE_KEY_WIF;
const writeKeyId = Number(process.env.IDENTITY_PUBLIC_KEY_ID || 1);
const transferKeyWif = process.env.TRANSFER_KEY_WIF;
const masterKeyWif = process.env.MASTER_KEY_WIF;
const hasWriteCredentials = writeIdentityId && writePrivateKeyWif;

(hasWriteCredentials ? describe : describe.skip)(
  `EVO SDK Write Tutorial Tests (${new Date().toLocaleTimeString()})`,
  function suite() {
    this.timeout(80000);

    let writeSdk;
    let contractId;

    before(async function () {
      writeSdk = await createClient(network);
    });

    describe('Contract write tutorials', function () {
      it('registerContract - should publish a new contract', async function () {
        const contract = await registerContract(
          writeSdk,
          writeIdentityId,
          writePrivateKeyWif,
          writeKeyId,
          contractMinimal,
        );
        expect(contract).to.be.an.instanceOf(DataContract);

        contractId = contract.id?.toString() || contract.getId?.().toString();
        this.test.title += ` (${contractId})`;
        expect(contractId).to.be.a('string').with.length.greaterThan(0);
        expect(contract.version).to.equal(1);
        expect(contract.ownerId.toString()).to.equal(writeIdentityId);

        // Config and schemas are only available via toJSON
        const json = contract.toJSON();
        expect(json).to.have.property('config').that.is.an('object');
        expect(json.config).to.have.property('readonly', false);
        expect(json.config).to.have.property(
          'documentsMutableContractDefault',
          true,
        );
        expect(json).to.have.property('documentSchemas').that.is.an('object');
        expect(json.documentSchemas).to.have.property('note');
      });

      it('updateContract - should update an existing contract', async function () {
        expect(contractId, 'registerContract must succeed first').to.be.a(
          'string',
        );
        const newSchemas = {
          extendedNote: {
            type: 'object',
            properties: {
              message: { type: 'string', position: 0 },
              author: { type: 'string', position: 1 },
            },
            additionalProperties: false,
          },
        };
        const updated = await updateContract(
          writeSdk,
          writeIdentityId,
          writePrivateKeyWif,
          writeKeyId,
          contractId,
          newSchemas,
        );
        expect(updated).to.be.an.instanceOf(DataContract);
        expect(updated.id.toString()).to.equal(contractId);
        expect(updated.version).to.be.greaterThan(1);
        this.test.title += ` (${contractId} v${updated.version})`;
        expect(updated.ownerId.toString()).to.equal(writeIdentityId);

        // Merged schemas are only accessible via toJSON
        const json = updated.toJSON();
        expect(json).to.have.property('documentSchemas').that.is.an('object');
        expect(json.documentSchemas).to.have.property('note');
        expect(json.documentSchemas).to.have.property('extendedNote');
        expect(json.documentSchemas.extendedNote)
          .to.have.property('properties')
          .that.has.property('author');
      });
    });

    describe('Additional contract schema tests', function () {
      it('should register a contract with indices', async function () {
        const contract = await registerContract(
          writeSdk,
          writeIdentityId,
          writePrivateKeyWif,
          writeKeyId,
          contractWithIndex,
        );
        expect(contract).to.be.an.instanceOf(DataContract);
        const json = contract.toJSON();
        expect(json.documentSchemas.note).to.have.property('indices');
        this.test.title += ` (${contract.id})`;
      });

      it('should register a contract with timestamps', async function () {
        const contract = await registerContract(
          writeSdk,
          writeIdentityId,
          writePrivateKeyWif,
          writeKeyId,
          contractWithTimestamps,
        );
        expect(contract).to.be.an.instanceOf(DataContract);
        const json = contract.toJSON();
        expect(json.documentSchemas.note.required).to.include('$createdAt');
        expect(json.documentSchemas.note.required).to.include('$updatedAt');
        this.test.title += ` (${contract.id})`;
      });

      it('should register a contract with binary data', async function () {
        const contract = await registerContract(
          writeSdk,
          writeIdentityId,
          writePrivateKeyWif,
          writeKeyId,
          contractWithBinaryData,
        );
        expect(contract).to.be.an.instanceOf(DataContract);
        const json = contract.toJSON();
        expect(json.documentSchemas.block.properties.hash).to.have.property(
          'byteArray',
        );
        this.test.title += ` (${contract.id})`;
      });

      it('should register an NFT contract', async function () {
        const contract = await registerContract(
          writeSdk,
          writeIdentityId,
          writePrivateKeyWif,
          writeKeyId,
          contractNft,
        );
        expect(contract).to.be.an.instanceOf(DataContract);
        const json = contract.toJSON();
        expect(json.documentSchemas).to.have.property('card');
        this.test.title += ` (${contract.id})`;
      });

    describe('Document write tutorials', function () {
      let createdDocumentId;

      it('submitDocument - should create a document', async function () {
        expect(contractId, 'registerContract must succeed first').to.be.a(
          'string',
        );
        const doc = await submitDocument(
          writeSdk,
          writeIdentityId,
          writePrivateKeyWif,
          writeKeyId,
          contractId,
          'note',
          { message: `Test @ ${new Date().toUTCString()}` },
        );
        expect(doc).to.be.an.instanceOf(Document);

        createdDocumentId = doc.id?.toString() || doc.getId?.().toString();
        this.test.title += ` (${createdDocumentId})`;
        expect(createdDocumentId).to.be.a('string').with.length.greaterThan(0);
        expect(doc.revision).to.equal(1n);
        expect(doc.documentTypeName).to.equal('note');
        expect(doc.ownerId.toString()).to.equal(writeIdentityId);
        expect(doc.dataContractId.toString()).to.equal(contractId);

        // User data is accessible via toJSON
        const json = doc.toJSON();
        expect(json)
          .to.have.property('message')
          .that.is.a('string')
          .and.includes('Test @');
      });

      it('updateDocument - should replace a document', async function () {
        expect(createdDocumentId, 'submitDocument must succeed first').to.be.a(
          'string',
        );
        const doc = await updateDocument(
          writeSdk,
          writeIdentityId,
          writePrivateKeyWif,
          writeKeyId,
          contractId,
          'note',
          createdDocumentId,
          2,
          { message: `Updated @ ${new Date().toUTCString()}` },
        );
        expect(doc).to.be.an.instanceOf(Document);

        expect(doc.id.toString()).to.equal(createdDocumentId);
        expect(doc.revision > 1n).to.be.true;
        this.test.title += ` (${createdDocumentId} v${Number(doc.revision)})`;
        expect(doc.documentTypeName).to.equal('note');
        expect(doc.ownerId.toString()).to.equal(writeIdentityId);
        expect(doc.dataContractId.toString()).to.equal(contractId);

        const json = doc.toJSON();
        expect(json)
          .to.have.property('message')
          .that.is.a('string')
          .and.includes('Updated @');
      });

      it('deleteDocument - should delete a document', async function () {
        expect(createdDocumentId, 'submitDocument must succeed first').to.be.a(
          'string',
        );
        const result = await deleteDocument(
          writeSdk,
          writeIdentityId,
          writePrivateKeyWif,
          writeKeyId,
          contractId,
          'note',
          createdDocumentId,
        );
        // deleteDocument returns undefined (void) on success
        expect(result).to.be.undefined;
        this.test.title += ` (${createdDocumentId})`;
      });
    });

    describe('Name tutorials', function () {
      it('registerName - should register a DPNS name', async function () {
        const label = `tut0r1a1-test-${Date.now()}`;
        const result = await registerName(
          writeSdk,
          writeIdentityId,
          writePrivateKeyWif,
          writeKeyId,
          label,
        );
        expect(result).to.be.an.instanceOf(RegisterDpnsNameResult);
        expect(result.fullDomainName).to.equal(`${label}.dash`);
        expect(result.preorderDocumentId.toString())
          .to.be.a('string')
          .with.length.greaterThan(0);
        expect(result.domainDocumentId.toString())
          .to.be.a('string')
          .with.length.greaterThan(0);
      });
    });

    describe('Identity write tutorials', function () {
      let newKeyId;

      it(`transferCredits - should transfer credits to another identity (${IDENTITY_ID})`, async function () {
        if (!transferKeyWif) {
          this.skip('TRANSFER_KEY_WIF not set');
          return;
        }
        // Transfer a small amount to a known testnet identity
        const recipientId = IDENTITY_ID;
        const result = await transferCredits(
          writeSdk,
          writeIdentityId,
          transferKeyWif,
          recipientId,
          100000,
        );
        expect(result).to.be.an.instanceOf(IdentityCreditTransferResult);
        expect(typeof result.senderBalance).to.equal('bigint');
        expect(result.senderBalance > 0n).to.be.true;
        expect(typeof result.recipientBalance).to.equal('bigint');
        expect(result.recipientBalance > 0n).to.be.true;
      });

      it(`withdrawCredits - should withdraw credits to a Dash address (${CORE_WITHDRAWAL_ADDRESS})`, async function () {
        if (!transferKeyWif) {
          this.skip('TRANSFER_KEY_WIF not set');
          return;
        }
        // Withdraw minimal amount to testnet wallet address
        // Platform minimum is 190,000 credits
        const withdrawAmount = 200000;

        const remainingBalance = await withdrawCredits(
          writeSdk,
          writeIdentityId,
          transferKeyWif,
          withdrawAmount,
          CORE_WITHDRAWAL_ADDRESS,
        );

        // SDK returns remaining balance as bigint
        expect(typeof remainingBalance).to.equal('bigint');
        expect(remainingBalance >= 0n).to.be.true;
      });

      it('updateIdentity - should add a new key to an identity', async function () {
        if (!masterKeyWif) {
          this.skip('MASTER_KEY_WIF not set');
          return;
        }
        this.timeout(120000);

        // Generate a unique keypair for the new identity key
        const keyPair = await wallet.generateKeyPair('testnet');
        console.log('\tNew key WIF:', keyPair.privateKeyWif);
        const pubKeyData = Uint8Array.from(
          Buffer.from(keyPair.publicKey, 'hex'),
        );

        // Fetch identity to determine next available key ID
        const identity = await writeSdk.identities.fetch(writeIdentityId);
        const existingKeys = identity.toJSON().publicKeys;
        const maxKeyId = existingKeys.reduce(
          (max, k) => Math.max(max, k.id),
          0,
        );
        newKeyId = maxKeyId + 1;

        // Add a new HIGH-level AUTHENTICATION key
        const newKey = new IdentityPublicKeyInCreation(
          newKeyId, // id
          0, // purpose: AUTHENTICATION
          2, // securityLevel: HIGH
          0, // keyType: ECDSA_SECP256K1
          false, // readOnly
          pubKeyData, // data: compressed public key (33 bytes)
          null, // signature
          null, // contractBounds
        );

        const result = await updateIdentity(
          writeSdk,
          writeIdentityId,
          masterKeyWif,
          [newKey],
          undefined,
          [keyPair.privateKeyWif],
        );

        expect(result).to.be.an.instanceOf(Identity);
        const resultJson = result.toJSON();
        expect(resultJson).to.have.property('id', writeIdentityId);
        expect(resultJson).to.have.property('balance').that.is.a('number');
        expect(resultJson).to.have.property('publicKeys').that.is.an('array');

        // Re-fetch and verify key was added
        const afterAdd = await writeSdk.identities.fetch(writeIdentityId);
        const afterAddJson = afterAdd.toJSON();
        const addedKey = afterAddJson.publicKeys.find((k) => k.id === newKeyId);
        expect(addedKey, `key ${newKeyId} should exist after add`).to.be.an(
          'object',
        );
        expect(addedKey.purpose).to.equal(0); // AUTHENTICATION
        expect(addedKey.securityLevel).to.equal(2); // HIGH
        expect(addedKey.type).to.equal(0); // ECDSA_SECP256K1
        expect(addedKey.disabledAt).to.be.null;
        this.test.title += ` (key ${newKeyId})`;
      });

      it('updateIdentity - should disable a key on an identity', async function () {
        expect(newKeyId, 'add-key test must succeed first').to.be.a('number');
        if (!masterKeyWif) {
          this.skip('MASTER_KEY_WIF not set');
          return;
        }
        this.timeout(120000);

        await updateIdentity(
          writeSdk,
          writeIdentityId,
          masterKeyWif,
          undefined,
          [newKeyId],
        );

        // Re-fetch and verify key was disabled
        const afterDisable = await writeSdk.identities.fetch(writeIdentityId);
        const afterDisableJson = afterDisable.toJSON();
        const disabledKey = afterDisableJson.publicKeys.find(
          (k) => k.id === newKeyId,
        );
        expect(disabledKey, `key ${newKeyId} should still exist`).to.be.an(
          'object',
        );
        expect(disabledKey.disabledAt).to.be.a('number').that.is.greaterThan(0);
        this.test.title += ` (key ${newKeyId})`;
      });
    });
  },
);
