/* import { EvoSDK } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect(); */

async function getEpochInfo(sdk, startEpoch, limit) {
  return sdk.epoch.epochsInfo({ startEpoch, limit });
}

/* getEpochInfo(sdk, 0, 5)
  .then((d) => console.log('Epoch info:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { getEpochInfo };
