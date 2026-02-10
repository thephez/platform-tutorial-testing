/* import { EvoSDK } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect(); */

async function retrieveNameByRecord(sdk, identityId) {
  // Retrieve usernames registered to an identity
  return sdk.dpns.usernames({ identityId });
}

/* retrieveNameByRecord(sdk, 'your identity id here')
  .then((d) => console.log('Name(s) retrieved:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { retrieveNameByRecord };
