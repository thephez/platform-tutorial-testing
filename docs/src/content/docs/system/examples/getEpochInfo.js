// Retrieve epoch information for a range of epochs
// startEpoch: the first epoch to return info for
// limit: maximum number of epochs to return
const startEpoch = 0;
const limit = 5;

const epochInfo = await sdk.epoch.epochsInfo({ startEpoch, limit });

console.log('Epoch info:', epochInfo);
