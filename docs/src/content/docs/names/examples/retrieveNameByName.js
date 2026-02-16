// Resolve a DPNS name to its associated identity
// Pass the full domain name (label + '.dash')
const name = 'Tutorial-Test-000000';

const result = await sdk.dpns.resolveName(`${name}.dash`);

console.log('Name retrieved:', result);

if (result) {
  console.log('Label:', result.toJSON().label);
  console.log('Owner ID:', result.ownerId.toString());
}
