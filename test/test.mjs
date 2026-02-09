import { expect } from 'chai';
import dotenv from 'dotenv';
import {
  createClient,
  checkNetworkConnection,
  dapiClientMethods,
  retrieveIdentity,
  retrieveNameByName,
  retrieveNameByRecord,
  retrieveNameBySearch,
  retrieveContract,
  getDocuments,
} from '../tutorials/index.mjs';

dotenv.config();
const network = process.env.NETWORK || 'testnet';

const identityId = 'GgZekwh38XcWQTyWWWvmw6CEYFnLU7yiZFPWZEjqKHit';
const identityName = 'Tutorial-Test-000000';
const dpnsContractId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec';

let sdk;

describe(`EVO SDK Tutorial Tests (${new Date().toLocaleTimeString()})`, function suite() {
  this.timeout(40000);

  before(async function () {
    sdk = await createClient(network);
  });

  describe('Network connection', function () {
    it('checkNetworkConnection - should return system status', async function () {
      const result = await checkNetworkConnection(sdk);
      expect(result).to.not.be.undefined;
    });

    it('dapiClientMethods - should return status and epoch', async function () {
      const result = await dapiClientMethods(sdk);
      expect(result.status).to.not.be.undefined;
      expect(result.currentEpoch).to.not.be.undefined;
    });
  });

  describe('Identity tutorials', function () {
    it(`retrieveIdentity - should fetch identity (${identityId})`, async function () {
      const result = await retrieveIdentity(sdk, identityId);
      expect(result).to.not.be.undefined;
    });
  });

  describe('Name tutorials', function () {
    it(`retrieveNameByName - should resolve name (${identityName})`, async function () {
      const result = await retrieveNameByName(sdk, identityName);
      expect(result).to.not.be.undefined;
    });

    it(`retrieveNameByRecord - should return names for identity (${identityId})`, async function () {
      const result = await retrieveNameByRecord(sdk, identityId);
      expect(result).to.be.an('array');
      expect(result.length).to.be.greaterThan(0);
    });

    it('retrieveNameBySearch - should return documents matching prefix', async function () {
      const result = await retrieveNameBySearch(sdk, 'Tutorial-Test-');
      expect(result).to.be.instanceOf(Map);
      expect(result.size).to.be.greaterThan(0);
    });
  });

  describe('Contract tutorials', function () {
    it(`retrieveContract - should fetch DPNS contract (${dpnsContractId})`, async function () {
      const result = await retrieveContract(sdk, dpnsContractId);
      expect(result).to.not.be.undefined;
    });
  });

  describe('Document tutorials', function () {
    it('getDocuments - should query DPNS domain documents', async function () {
      const result = await getDocuments(sdk, dpnsContractId, 'domain', 2);
      expect(result).to.be.instanceOf(Map);
      expect(result.size).to.be.greaterThan(0);
    });
  });
});
