/* import { EvoSDK } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect(); */

async function retrieveNameByName(sdk, name) {
  // Resolve a full name (e.g., myname.dash) to its identity ID
  // NOTE: Use lowercase characters only
  return sdk.dpns.resolveName(`${name}.dash`);
}

/* retrieveNameByName(sdk, 'your-name-here')
  .then((d) => console.log('Name retrieved:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { retrieveNameByName };
