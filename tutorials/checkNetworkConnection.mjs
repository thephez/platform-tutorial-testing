/* import { setupDashClient } from './sdkClient.mjs';

const { sdk } = await setupDashClient(); */

async function checkNetworkConnection(sdk) {
  return sdk.system.status();
}

/* checkNetworkConnection(sdk)
  .then((d) => console.log('System status:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { checkNetworkConnection };
