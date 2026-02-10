/* import { EvoSDK } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect(); */

async function retrieveNameByName(sdk, name) {
  // Resolve a DPNS name to its identity ID
  // Pass the label only (e.g., 'alice'), not the full domain.
  // '.dash' is appended automatically below.
  return sdk.dpns.resolveName(`${name}.dash`);
}

/* retrieveNameByName(sdk, 'your-name-here')
  .then((d) => console.log('Name retrieved:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { retrieveNameByName };
