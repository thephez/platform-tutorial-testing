/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk } = await setupDashClient(); */

async function getCurrentEpoch(sdk) {
  return sdk.epoch.current();
}

/* getCurrentEpoch(sdk)
  .then((d) => console.log('Current epoch:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { getCurrentEpoch };
