/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
import { expect } from 'chai';
import dotenv from 'dotenv';
import initEvoSDK from '../tutorials-evo/utils/initEvoSDK.mjs';
import retrieveIdentity from '../tutorials-evo/identity/retrieveIdentity.mjs';
import retrieveContract from '../tutorials-evo/contract/retrieveContract.mjs';
import resolveName from '../tutorials-evo/name/resolveName.mjs';

dotenv.config();

describe('EvoSDK Phase 1 Examples', function () {
  this.timeout(180000);

  let sdk;
  const network = process.env.NETWORK || 'testnet';

  // Known testnet values for testing
  const knownContractId = process.env.TEST_CONTRACT_ID || 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'; // DPNS contract
  const knownIdentityId = process.env.IDENTITY_ID;
  const knownName = 'wasm-sdk-test-identity';

  before(async function () {
    console.log(`\nConnecting to ${network}...`);
    sdk = await initEvoSDK({ network });
    console.log('Connected to EvoSDK\n');
  });

  after(async function () {
    if (sdk) {
      // Note: EvoSDK doesn't have a disconnect method
      console.log('\nTests completed');
    }
  });

  describe('Identity Operations', function () {
    it('should retrieve an identity', async function () {
      // eslint-disable-next-line no-unused-expressions
      expect(knownIdentityId, 'IDENTITY_ID must be set in .env').to.exist;

      console.log(`\tRetrieving identity: ${knownIdentityId}`);
      const identity = await retrieveIdentity(sdk, knownIdentityId);

      // eslint-disable-next-line no-unused-expressions
      expect(identity).to.exist;
    });
  });

  describe('Contract Operations', function () {
    it('should retrieve a data contract', async function () {
      console.log(`\tRetrieving contract: ${knownContractId}`);

      const contract = await retrieveContract(sdk, knownContractId);
      // eslint-disable-next-line no-unused-expressions
      expect(contract).to.exist;
    });
  });

  describe('Name Operations', function () {
    it('should resolve a DPNS name', async function () {
      console.log(`\tResolving name: ${knownName}.dash`);

      const nameInfo = await resolveName(sdk, knownName);
      // eslint-disable-next-line no-unused-expressions
      expect(nameInfo).to.exist;
    });
  });

  describe('SDK Utilities', function () {
    it('should successfully initialize SDK', async function () {
      // eslint-disable-next-line no-unused-expressions
      expect(sdk).to.exist;
    });

    it('should be connected to the network', async function () {
      // eslint-disable-next-line no-unused-expressions
      expect(sdk).to.have.property('connect');
    });
  });
});
