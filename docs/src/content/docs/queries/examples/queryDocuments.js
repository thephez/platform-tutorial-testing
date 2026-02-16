// Query DPNS domain documents using various operators
// This example demonstrates the document query API with the DPNS contract.
const dpnsContractId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec';

// --- Example 1: Exact match (==) ---
// Find a specific DPNS name by its normalized label
const nameToFind = 'Tutorial-Test-000000';
const normalizedLabel = await sdk.dpns.convertToHomographSafe(nameToFind);

const exactMatch = await sdk.documents.query({
  dataContractId: dpnsContractId,
  documentTypeName: 'domain',
  where: [
    ['normalizedParentDomainName', '==', 'dash'],
    ['normalizedLabel', '==', normalizedLabel],
  ],
});

console.log('--- Exact match ---');
for (const [id, doc] of exactMatch) {
  console.log('  Label:', doc.toJSON().label);
  console.log('  Owner:', doc.ownerId.toString());
}

// --- Example 2: Starts with ---
// Search for names beginning with a prefix
const prefix = 'tutorial-test-';
const normalizedPrefix = await sdk.dpns.convertToHomographSafe(prefix);

const startsWithResults = await sdk.documents.query({
  dataContractId: dpnsContractId,
  documentTypeName: 'domain',
  where: [
    ['normalizedParentDomainName', '==', 'dash'],
    ['normalizedLabel', 'startsWith', normalizedPrefix],
  ],
  orderBy: [['normalizedLabel', 'asc']],
  limit: 5,
});

console.log('--- Starts with ---');
for (const [id, doc] of startsWithResults) {
  console.log('  Label:', doc.toJSON().label);
}

// --- Example 3: Comparison operators (>, <, >=, <=) ---
// Query domains by identity record using comparison
const identityId = 'GgZekwh38XcWQTyWWWvmw6CEYFnLU7yiZFPWZEjqKHit';

const greaterThan = await sdk.documents.query({
  dataContractId: dpnsContractId,
  documentTypeName: 'domain',
  limit: 3,
  where: [['records.identity', '>', identityId]],
  orderBy: [['records.identity', 'asc']],
});

console.log('--- Greater than identity ---');
for (const [id, doc] of greaterThan) {
  console.log('  Label:', doc.toJSON().label);
  console.log('  Owner:', doc.ownerId.toString());
}

// --- Example 4: IN operator ---
// Fetch multiple names at once
const namesToFind = ['Tutorial-Test-000000', 'Tutorial-Test-000000-backup'];
const normalizedNames = await Promise.all(
  namesToFind.map((n) => sdk.dpns.convertToHomographSafe(n)),
);

const inResults = await sdk.documents.query({
  dataContractId: dpnsContractId,
  documentTypeName: 'domain',
  limit: 5,
  where: [
    ['normalizedParentDomainName', '==', 'dash'],
    ['normalizedLabel', 'in', normalizedNames],
  ],
  orderBy: [['normalizedLabel', 'asc']],
});

console.log('--- IN operator ---');
for (const [id, doc] of inResults) {
  console.log('  Label:', doc.toJSON().label);
}
