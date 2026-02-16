// Retrieve information about a token (total supply and status)
const tokenId = 'Bu2749WKcP5HFNm8v3k5kshRKDSVyfsJMqoWnXmK4q7h';

const totalSupply = await sdk.tokens.totalSupply(tokenId);
const statuses = await sdk.tokens.statuses([tokenId]);
const status = statuses.values().next().value;

console.log('Token total supply:', Number(totalSupply));
console.log('Token status:', status);
