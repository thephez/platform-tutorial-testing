// Check the network connection by fetching the system status
const status = await sdk.system.status();

console.log('System status:', status);
