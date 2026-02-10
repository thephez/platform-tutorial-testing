import { expect } from 'chai';
import dotenv from 'dotenv';
import {
  createClient,
  checkNetworkConnection,
  getSystemInfo,
  retrieveIdentity,
  retrieveNameByName,
  retrieveNameByRecord,
  retrieveNameBySearch,
  retrieveContract,
  getDocuments,
} from '../tutorials/index.mjs';
import { DPNS_CONTRACT_ID as dpnsContractId } from '../tutorials/constants.mjs';

dotenv.config();
const network = process.env.NETWORK || 'testnet';

const identityId = 'GgZekwh38XcWQTyWWWvmw6CEYFnLU7yiZFPWZEjqKHit';
const identityName = 'Tutorial-Test-000000';

let sdk;

describe(`EVO SDK Tutorial Tests (${new Date().toLocaleTimeString()})`, function suite() {
  this.timeout(40000);

  before(async function () {
    sdk = await createClient(network);
  });

  describe('Network connection', function () {
    it('checkNetworkConnection - should return system status', async function () {
      const result = await checkNetworkConnection(sdk);
      expect(result).to.be.an('object');
      expect(result.toJSON).to.be.a('function');
      const json = result.toJSON();
      expect(json).to.have.nested.property('version.software.dapi');
      expect(json).to.have.nested.property('chain.latestBlockHeight');
      expect(json).to.have.nested.property('network.chainId').that.includes('dash');
    });

    it('getSystemInfo - should return status and epoch', async function () {
      const result = await getSystemInfo(sdk);
      expect(result).to.have.property('status').that.is.an('object');
      expect(result).to.have.property('currentEpoch').that.is.an('object');
      const statusJson = result.status.toJSON();
      expect(statusJson).to.have.nested.property('version.software.dapi');
      const epochJson = result.currentEpoch.toJSON();
      expect(epochJson).to.have.nested.property('V0.index').that.is.a('number');
      expect(epochJson).to.have.nested.property('V0.protocol_version').that.is.a('number');
    });
  });

  describe('Identity tutorials', function () {
    it(`retrieveIdentity - should fetch identity (${identityId})`, async function () {
      const result = await retrieveIdentity(sdk, identityId);
      expect(result).to.be.an('object');
      expect(result.toJSON).to.be.a('function');
      const json = result.toJSON();
      expect(json).to.have.property('id', identityId);
      expect(json).to.have.property('balance').that.is.a('number');
      expect(json).to.have.property('publicKeys').that.is.an('array').with.length.greaterThan(0);
    });
  });

  describe('Name tutorials', function () {
    it(`retrieveNameByName - should resolve name (${identityName})`, async function () {
      const result = await retrieveNameByName(sdk, identityName);
      expect(result).to.be.a('string');
      expect(result).to.equal(identityId);
    });

    it(`retrieveNameByRecord - should return names for identity (${identityId})`, async function () {
      const result = await retrieveNameByRecord(sdk, identityId);
      expect(result).to.be.an('array').with.length.greaterThan(0);
      expect(result[0]).to.be.a('string').that.includes('.dash');
    });

    it('retrieveNameBySearch - should return documents matching prefix', async function () {
      const result = await retrieveNameBySearch(sdk, 'Tutorial-Test-');
      expect(result).to.be.instanceOf(Map);
      expect(result.size).to.be.greaterThan(0);
      const [firstId, firstDoc] = result.entries().next().value;
      expect(firstId.toString()).to.be.a('string').with.length.greaterThan(0);
      expect(firstDoc).to.be.an('object');
      const docJson = firstDoc.toJSON();
      expect(docJson).to.have.property('label').that.is.a('string');
      expect(docJson).to.have.property('normalizedLabel').that.is.a('string');
    });
  });

  describe('Contract tutorials', function () {
    it(`retrieveContract - should fetch DPNS contract (${dpnsContractId})`, async function () {
      const result = await retrieveContract(sdk, dpnsContractId);
      expect(result).to.be.an('object');
      expect(result.toJSON).to.be.a('function');
      const json = result.toJSON();
      expect(json).to.have.property('id', dpnsContractId);
      expect(json).to.have.property('config');
      expect(json).to.have.property('documentSchemas');
      expect(json).to.have.property('version').that.is.a('number');
    });
  });

  describe('Document tutorials', function () {
    it('getDocuments - should query DPNS domain documents', async function () {
      const result = await getDocuments(sdk, dpnsContractId, 'domain', 2);
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
});
