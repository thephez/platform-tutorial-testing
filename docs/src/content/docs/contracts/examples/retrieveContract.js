// Retrieve a data contract by its ID
// Using the DPNS contract as an example
const contractId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec';

const contract = await sdk.contracts.fetch(contractId);

console.log('Contract retrieved:', contract);
console.log('Contract ID:', contract.id.toString());
console.log('Owner ID:', contract.ownerId.toString());
console.log('Version:', Number(contract.version));
