/* import { EvoSDK } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect();

const tokenId = 'your token id here'; */

async function getTokenInfo(sdk, tokenId) {
  const totalSupply = await sdk.tokens.totalSupply(tokenId);
  const statuses = await sdk.tokens.statuses([tokenId]);
  const status = statuses.values().next().value;
  return { totalSupply, status };
}

/* getTokenInfo(sdk, tokenId)
  .then((d) => console.log('Token info:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { getTokenInfo };
