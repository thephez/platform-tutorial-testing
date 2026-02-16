// Search for DPNS names matching a prefix
// NOTE: Use lowercase characters for the search prefix
const namePrefix = 'tutorial-test-';
const dpnsContractId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec';

const normalizedPrefix = await sdk.dpns.convertToHomographSafe(namePrefix);

const results = await sdk.documents.query({
  dataContractId: dpnsContractId,
  documentTypeName: 'domain',
  where: [
    ['normalizedParentDomainName', '==', 'dash'],
    ['normalizedLabel', 'startsWith', normalizedPrefix],
  ],
  orderBy: [['normalizedLabel', 'asc']],
});

console.log('Search results:');
for (const [id, doc] of results) {
  console.log('  Document ID:', id.toString());
  console.log('  Label:', doc.toJSON().label);
  console.log('  Owner:', doc.ownerId.toString());
}
