/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk } = await setupDashClient(); */

async function getTokenBalances(sdk, tokenId, identityIds) {
  return sdk.tokens.balances(identityIds, tokenId);
}

/* getTokenBalances(sdk, tokenId, identityIds)
  .then((d) => console.log('Token balances:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { getTokenBalances };
