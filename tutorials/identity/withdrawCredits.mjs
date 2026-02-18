/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk, keyManager } = await setupDashClient(); */

async function withdrawCredits(
  sdk,
  keyManager,
  amount,
  toAddress,
  coreFeePerByte,
) {
  const { identity, signer } = await keyManager.getTransfer();

  // Withdraw credits from the identity to a Dash address
  return sdk.identities.creditWithdrawal({
    identity,
    amount: BigInt(amount),
    toAddress: toAddress || undefined,
    coreFeePerByte: coreFeePerByte || undefined,
    signer,
  });
}

/* withdrawCredits(
  sdk,
  keyManager,
  1000000,
  'yNPbcFfabtNmmxKdGwhHomdYfVs6gikbPf',
)
  .then((d) => console.log('Credits withdrawn:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { withdrawCredits };
