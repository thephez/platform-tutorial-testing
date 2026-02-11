/* import { EvoSDK } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect();

const identityId = 'your identity id here'; */

async function retrieveIdentityBalance(sdk, identityId) {
  return sdk.identities.balance(identityId);
}

/* retrieveIdentityBalance(sdk, identityId)
  .then((d) => console.log('Identity balance (credits):\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { retrieveIdentityBalance };
