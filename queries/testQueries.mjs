import { DPNS_CONTRACT_ID } from '../tutorials/constants.mjs';

export async function startAt(sdk, startAtId, limit = 1) {
  return sdk.documents.query({
    dataContractId: DPNS_CONTRACT_ID,
    documentTypeName: 'domain',
    limit,
    startAt: startAtId,
  });
}

export async function startAtComplex(
  sdk,
  startAtId,
  startsWithString,
  orderByDirection = 'asc',
  limit = 1,
) {
  return sdk.documents.query({
    dataContractId: DPNS_CONTRACT_ID,
    documentTypeName: 'domain',
    limit,
    startAt: startAtId,
    where: [
      ['normalizedParentDomainName', '==', 'dash'],
      [
        'normalizedLabel',
        'startsWith',
        await sdk.dpns.convertToHomographSafe(startsWithString),
      ],
    ],
    orderBy: [['normalizedLabel', orderByDirection]],
  });
}

export async function startAfter(sdk, startAfterId, limit = 1) {
  return sdk.documents.query({
    dataContractId: DPNS_CONTRACT_ID,
    documentTypeName: 'domain',
    limit,
    startAfter: startAfterId,
  });
}

export async function whereEqual(sdk, dpnsName) {
  const normalizedLabel = await sdk.dpns.convertToHomographSafe(dpnsName);
  return sdk.documents.query({
    dataContractId: DPNS_CONTRACT_ID,
    documentTypeName: 'domain',
    where: [
      ['normalizedParentDomainName', '==', 'dash'],
      ['normalizedLabel', '==', normalizedLabel],
    ],
  });
}

export async function whereLessThanId(
  sdk,
  id,
  orderByDirection = 'asc',
  limit = 1,
) {
  return sdk.documents.query({
    dataContractId: DPNS_CONTRACT_ID,
    documentTypeName: 'domain',
    limit,
    where: [['records.identity', '<', id]],
    orderBy: [['records.identity', orderByDirection]],
  });
}

export async function whereLessThanEqualToId(
  sdk,
  id,
  orderByDirection = 'asc',
  limit = 1,
) {
  return sdk.documents.query({
    dataContractId: DPNS_CONTRACT_ID,
    documentTypeName: 'domain',
    limit,
    where: [['records.identity', '<=', id]],
    orderBy: [['records.identity', orderByDirection]],
  });
}

export async function whereGreaterThanId(
  sdk,
  id,
  orderByDirection = 'asc',
  limit = 1,
) {
  return sdk.documents.query({
    dataContractId: DPNS_CONTRACT_ID,
    documentTypeName: 'domain',
    limit,
    where: [['records.identity', '>', id]],
    orderBy: [['records.identity', orderByDirection]],
  });
}

export async function whereGreaterThanEqualToId(
  sdk,
  id,
  orderByDirection = 'asc',
  limit = 1,
) {
  return sdk.documents.query({
    dataContractId: DPNS_CONTRACT_ID,
    documentTypeName: 'domain',
    limit,
    where: [['records.identity', '>=', id]],
    orderBy: [['records.identity', orderByDirection]],
  });
}

export async function whereIn(
  sdk,
  dpnsNames,
  orderByDirection = 'asc',
  limit = 1,
) {
  return sdk.documents.query({
    dataContractId: DPNS_CONTRACT_ID,
    documentTypeName: 'domain',
    limit,
    where: [
      ['normalizedParentDomainName', '==', 'dash'],
      [
        'normalizedLabel',
        'in',
        await Promise.all(
          dpnsNames.map((name) => sdk.dpns.convertToHomographSafe(name)),
        ),
      ],
    ],
    orderBy: [['normalizedLabel', orderByDirection]],
  });
}

export async function whereStartsWith(
  sdk,
  startsWithName,
  orderByDirection = 'asc',
  limit = 1,
) {
  return sdk.documents.query({
    dataContractId: DPNS_CONTRACT_ID,
    documentTypeName: 'domain',
    limit,
    where: [
      ['normalizedParentDomainName', '==', 'dash'],
      [
        'normalizedLabel',
        'startsWith',
        await sdk.dpns.convertToHomographSafe(startsWithName),
      ],
    ],
    orderBy: [['normalizedLabel', orderByDirection]],
  });
}
