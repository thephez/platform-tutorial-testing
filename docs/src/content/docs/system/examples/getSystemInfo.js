// Retrieve combined system information: status and current epoch
const status = await sdk.system.status();
const currentEpoch = await sdk.epoch.current();

console.log('System status:', status);
console.log('Current epoch:', currentEpoch);
