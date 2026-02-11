/* import { EvoSDK } from '@dashevo/evo-sdk';

const sdk = EvoSDK.testnetTrusted();
await sdk.connect();

const tokenId = 'your token id here';
const identityIds = ['identity id 1', 'identity id 2']; */

async function getTokenBalances(sdk, tokenId, identityIds) {
  return sdk.tokens.balances(identityIds, tokenId);
}

/* getTokenBalances(sdk, tokenId, identityIds)
  .then((d) => console.log('Token balances:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { getTokenBalances };
