import { expect } from 'chai';
import dotenv from 'dotenv';
import { Document } from '@dashevo/evo-sdk';
import { createClient } from '../tutorials/sdkClient.mjs';
import * as testQueries from '../queries/testQueries.mjs';
import {
  IDENTITY_ID,
  IDENTITY_NAME,
  IDENTITY_NAME_BACKUP,
  DOCUMENT_ID,
} from '../tutorials/constants.mjs';

dotenv.config();
const network = process.env.NETWORK || 'testnet';

const identityName = [IDENTITY_NAME, IDENTITY_NAME_BACKUP];
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
      expect(result[0]).to.be.an.instanceOf(Document);
    });
  });

  describe('Query modifiers', function () {
    // Skip: bare startAt query fails proof verification (dashpay/platform#3078)
    it.skip(`startAt - should return documents starting at document id - (${DOCUMENT_ID})`, async function () {
      const result = docsFromMap(await testQueries.startAt(sdk, DOCUMENT_ID, 1));

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.an.instanceOf(Document);
    });

    it(`startAtComplex (asc) - should return name(s) starting at document id - (${DOCUMENT_ID})`, async function () {
      const result = docsFromMap(
        await testQueries.startAtComplex(
          sdk,
          DOCUMENT_ID,
          startsWithString,
          'asc',
          1,
        ),
      );

      expect(result).to.have.lengthOf.at.most(1);
      expect(result[0]).to.be.an.instanceOf(Document);
    });

    it(`startAtComplex (desc) - should return name(s) starting at document id - (${DOCUMENT_ID})`, async function () {
      const result = docsFromMap(
        await testQueries.startAtComplex(
          sdk,
          DOCUMENT_ID,
          startsWithString,
          'desc',
          1,
        ),
      );

      expect(result).to.have.lengthOf.at.most(1);
      expect(result[0]).to.be.an.instanceOf(Document);
    });

    it(`startAfter - should return documents starting after document id - (${DOCUMENT_ID})`, async function () {
      const result = docsFromMap(await testQueries.startAfter(sdk, DOCUMENT_ID));

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.an.instanceOf(Document);
    });
  });

  describe('Where - comparison operators', function () {
    it(`< id (desc) - should return document before id - (${IDENTITY_ID})`, async function () {
      const result = docsFromMap(
        await testQueries.whereLessThanId(sdk, IDENTITY_ID, 'desc'),
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.an.instanceOf(Document);
    });

    it(`< id (asc) - should return document before id - (${IDENTITY_ID})`, async function () {
      const result = docsFromMap(
        await testQueries.whereLessThanId(sdk, IDENTITY_ID, 'asc'),
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.an.instanceOf(Document);
    });

    it(`<= id (desc) - should return documents up to id - (${IDENTITY_ID})`, async function () {
      const result = docsFromMap(
        await testQueries.whereLessThanEqualToId(sdk, IDENTITY_ID, 'desc'),
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.an.instanceOf(Document);
    });

    it(`<= id (asc) - should return documents up to id - (${IDENTITY_ID})`, async function () {
      const result = docsFromMap(
        await testQueries.whereLessThanEqualToId(sdk, IDENTITY_ID, 'asc'),
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.an.instanceOf(Document);
    });

    it(`> id (desc) - should return document after id - (${IDENTITY_ID})`, async function () {
      const result = docsFromMap(
        await testQueries.whereGreaterThanId(sdk, IDENTITY_ID, 'desc'),
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.an.instanceOf(Document);
    });

    it(`> id (asc) - should return document after id - (${IDENTITY_ID})`, async function () {
      const result = docsFromMap(
        await testQueries.whereGreaterThanId(sdk, IDENTITY_ID, 'asc'),
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.an.instanceOf(Document);
    });

    it(`>= (desc) - should return documents from id - (${IDENTITY_ID})`, async function () {
      const result = docsFromMap(
        await testQueries.whereGreaterThanEqualToId(sdk, IDENTITY_ID, 'desc'),
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.an.instanceOf(Document);
    });

    it(`>= (asc) - should return documents from id - (${IDENTITY_ID})`, async function () {
      const result = docsFromMap(
        await testQueries.whereGreaterThanEqualToId(sdk, IDENTITY_ID, 'asc', 2),
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
      expect(result[0]).to.be.an.instanceOf(Document);
    });

    it(`startsWith (desc) - should return name starting with string - (${startsWithString})`, async function () {
      const result = docsFromMap(
        await testQueries.whereStartsWith(sdk, startsWithString, 'desc'),
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.be.an.instanceOf(Document);
    });
  });
});
