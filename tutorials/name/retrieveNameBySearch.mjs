const DPNS_CONTRACT_ID = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec';

export async function retrieveNameBySearch(sdk, namePrefix) {
  const normalizedPrefix = await sdk.dpns.convertToHomographSafe(namePrefix);
  return sdk.documents.query({
    dataContractId: DPNS_CONTRACT_ID,
    documentTypeName: 'domain',
    where: [
      ['normalizedParentDomainName', '==', 'dash'],
      ['normalizedLabel', 'startsWith', normalizedPrefix],
    ],
    orderBy: [['normalizedLabel', 'asc']],
  });
}
