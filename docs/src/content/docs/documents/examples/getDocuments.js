// Query documents from a data contract
// Using the DPNS contract to fetch domain documents
const dpnsContractId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec';

const results = await sdk.documents.query({
  dataContractId: dpnsContractId,
  documentTypeName: 'domain',
  limit: 5,
});

console.log('Documents retrieved:');
for (const [id, doc] of results) {
  console.log('  Document ID:', id.toString());
  console.log('  Data:', doc.toJSON());
}
