/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk } = await setupDashClient(); */

async function retrieveNameByRecord(sdk, identityId) {
  // Retrieve usernames registered to an identity
  return sdk.dpns.usernames({ identityId });
}

/* retrieveNameByRecord(sdk, 'your identity id here')
  .then((d) => console.log('Name(s) retrieved:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { retrieveNameByRecord };
