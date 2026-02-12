/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk } = await setupDashClient(); */

async function retrieveIdentityBalance(sdk, identityId) {
  return sdk.identities.balance(identityId);
}

/* retrieveIdentityBalance(sdk, identityId)
  .then((d) => console.log('Identity balance (credits):\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { retrieveIdentityBalance };
