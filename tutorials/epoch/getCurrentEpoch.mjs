/* import { EvoSDK } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect(); */

async function getCurrentEpoch(sdk) {
  return sdk.epoch.current();
}

/* getCurrentEpoch(sdk)
  .then((d) => console.log('Current epoch:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { getCurrentEpoch };
