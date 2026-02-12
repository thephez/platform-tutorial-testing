/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk } = await setupDashClient(); */

async function retrieveIdentityKeys(sdk, identityId) {
  return sdk.identities.getKeys({
    identityId,
    request: { type: 'all' },
  });
}

/* retrieveIdentityKeys(sdk, identityId)
  .then((d) => console.log('Identity keys:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { retrieveIdentityKeys };
