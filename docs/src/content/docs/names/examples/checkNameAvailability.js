// Check if a DPNS name is available for registration
const label = 'alice';

const isAvailable = await sdk.dpns.isNameAvailable(label);

console.log(`Name "${label}" is available:`, isAvailable);
