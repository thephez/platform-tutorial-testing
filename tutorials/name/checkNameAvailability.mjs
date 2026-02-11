/* import { EvoSDK } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect();

const label = 'your-name-here'; */

async function checkNameAvailability(sdk, label) {
  return sdk.dpns.isNameAvailable(label);
}

/* checkNameAvailability(sdk, label)
  .then((d) => console.log('Name available:', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { checkNameAvailability };
