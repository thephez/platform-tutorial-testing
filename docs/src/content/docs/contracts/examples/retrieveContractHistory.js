// Retrieve the version history of a data contract
const contractId = 'BJV33YPMDfbA2Cxq3hWuTPQjUQCXEXGyq8bzz1YC9C44';

const history = await sdk.contracts.getHistory({
  dataContractId: contractId,
});

console.log('Contract history:', history);

// Iterate over historical versions
for (const [version, contract] of history) {
  console.log('Version:', version);
  console.log('Contract ID:', contract.id.toString());
}
