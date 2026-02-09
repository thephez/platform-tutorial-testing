import { expect } from 'chai';
import dotenv from 'dotenv';
import { createClient } from '../tutorials/sdkClient.mjs';
import * as testQueries from '../queries/testQueries.mjs';

dotenv.config();
const network = process.env.NETWORK || 'testnet';

const documentId = 'E8m6NCCnpschx4WRfk1uLMHqttqMJKPwYt8fWaVSJPrL';
const identityId = 'GgZekwh38XcWQTyWWWvmw6CEYFnLU7yiZFPWZEjqKHit';
const identityName = ['Tutorial-Test-000000', 'Tutorial-Test-000000-backup'];
const startsWithString = 'Tutorial-Test-';

let sdk;

// Helper to convert Map result to array of documents
function docsFromMap(map) {
  return [...map.values()].filter((d) => d !== undefined);
}

describe(`EVO SDK Query Tests (${new Date().toLocaleTimeString()})`, function suite() {
  this.timeout(40000);

  before(async function () {
    sdk = await createClient(network);
  });

  describe('Basic where queries', function () {
    it(`== - should return requested name - (${identityName[0]})`, async function () {
      const result = docsFromMap(
        await testQueries.whereEqual(sdk, identityName[0]),
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.not.be.undefined;
    });
  });

  describe('Query modifiers', function () {
    it(`startAt - should return documents starting at document id - (${documentId})`, async function () {
      const result = docsFromMap(await testQueries.startAt(sdk, documentId, 1));

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.not.be.undefined;
    });

    it(`startAtComplex (asc) - should return name(s) starting at document id - (${documentId})`, async function () {
      const result = docsFromMap(
        await testQueries.startAtComplex(
          sdk,
          documentId,
          startsWithString,
          'asc',
          1,
        ),
      );

      expect(result).to.have.lengthOf.at.most(1);
      expect(result[0]).to.not.be.undefined;
    });

    it(`startAtComplex (desc) - should return name(s) starting at document id - (${documentId})`, async function () {
      const result = docsFromMap(
        await testQueries.startAtComplex(
          sdk,
          documentId,
          startsWithString,
          'desc',
          1,
        ),
      );

      expect(result).to.have.lengthOf.at.most(1);
      expect(result[0]).to.not.be.undefined;
    });

    it(`startAfter - should return documents starting after document id - (${documentId})`, async function () {
      const result = docsFromMap(await testQueries.startAfter(sdk, documentId));

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.not.be.undefined;
    });
  });

  describe('Where - comparison operators', function () {
    it(`< id (desc) - should return document before id - (${identityId})`, async function () {
      const result = docsFromMap(
        await testQueries.whereLessThanId(sdk, identityId, 'desc'),
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.not.be.undefined;
    });

    it(`< id (asc) - should return document before id - (${identityId})`, async function () {
      const result = docsFromMap(
        await testQueries.whereLessThanId(sdk, identityId, 'asc'),
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.not.be.undefined;
    });

    it(`<= id (desc) - should return documents up to id - (${identityId})`, async function () {
      const result = docsFromMap(
        await testQueries.whereLessThanEqualToId(sdk, identityId, 'desc'),
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.not.be.undefined;
    });

    it(`<= id (asc) - should return documents up to id - (${identityId})`, async function () {
      const result = docsFromMap(
        await testQueries.whereLessThanEqualToId(sdk, identityId, 'asc'),
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.not.be.undefined;
    });

    it(`> id (desc) - should return document after id - (${identityId})`, async function () {
      const result = docsFromMap(
        await testQueries.whereGreaterThanId(sdk, identityId, 'desc'),
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.not.be.undefined;
    });

    it(`> id (asc) - should return document after id - (${identityId})`, async function () {
      const result = docsFromMap(
        await testQueries.whereGreaterThanId(sdk, identityId, 'asc'),
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.not.be.undefined;
    });

    it(`>= (desc) - should return documents from id - (${identityId})`, async function () {
      const result = docsFromMap(
        await testQueries.whereGreaterThanEqualToId(sdk, identityId, 'desc'),
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.not.be.undefined;
    });

    it(`>= (asc) - should return documents from id - (${identityId})`, async function () {
      const result = docsFromMap(
        await testQueries.whereGreaterThanEqualToId(sdk, identityId, 'asc', 2),
      );

      expect(result).to.have.lengthOf(2);
    });

    it(`in (asc) - should return all existing names from list - (${identityName})`, async function () {
      const result = docsFromMap(
        await testQueries.whereIn(sdk, identityName, 'asc', 5),
      );

      expect(result).to.have.lengthOf(identityName.length);
    });

    it(`in (desc) - should return all existing names from list - (${identityName})`, async function () {
      const result = docsFromMap(
        await testQueries.whereIn(sdk, identityName, 'desc', 5),
      );

      expect(result).to.have.lengthOf(identityName.length);
    });

    it('in (asc) - should return all existing names from list (some do not)', async function () {
      const someUnknownNames = [...identityName, 'somerandom_name'];
      const result = docsFromMap(
        await testQueries.whereIn(sdk, someUnknownNames, 'asc', 5),
      );

      expect(result).to.have.lengthOf(identityName.length);
    });

    it('in (desc) - should return all existing names from list (some do not)', async function () {
      const someUnknownNames = [...identityName, 'somerandom_name'];
      const result = docsFromMap(
        await testQueries.whereIn(sdk, someUnknownNames, 'desc', 5),
      );

      expect(result).to.have.lengthOf(identityName.length);
    });
  });

  describe('Where - evaluation operators', function () {
    it(`startsWith (asc) - should return name starting with string - (${startsWithString})`, async function () {
      const result = docsFromMap(
        await testQueries.whereStartsWith(sdk, startsWithString, 'asc'),
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.not.be.undefined;
    });

    it(`startsWith (desc) - should return name starting with string - (${startsWithString})`, async function () {
      const result = docsFromMap(
        await testQueries.whereStartsWith(sdk, startsWithString, 'desc'),
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.not.be.undefined;
    });
  });
});
