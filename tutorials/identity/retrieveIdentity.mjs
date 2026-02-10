/* import { EvoSDK } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect(); */

async function retrieveIdentity(sdk, identityId) {
  return sdk.identities.fetch(identityId);
}

/* retrieveIdentity(sdk, 'your identity id here')
  .then((d) => console.log('Identity retrieved:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { retrieveIdentity };
