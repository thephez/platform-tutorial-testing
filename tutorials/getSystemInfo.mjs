/* import { EvoSDK } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect(); */

async function getSystemInfo(sdk) {
  const status = await sdk.system.status();
  const currentEpoch = await sdk.epoch.current();
  return { status, currentEpoch };
}

/* getSystemInfo(sdk)
  .then((d) => {
    console.log('System status:\n', d.status);
    console.log('Current epoch:\n', d.currentEpoch);
  })
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { getSystemInfo };
