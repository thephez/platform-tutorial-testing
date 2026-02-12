/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk } = await setupDashClient(); */

async function checkNameAvailability(sdk, label) {
  return sdk.dpns.isNameAvailable(label);
}

/* checkNameAvailability(sdk, label)
  .then((d) => console.log('Name available:', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { checkNameAvailability };
