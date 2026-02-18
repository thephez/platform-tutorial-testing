/* import { setupDashClient } from '../sdkClient.mjs';

const { sdk, keyManager } = await setupDashClient(); */

async function updateIdentity(
  sdk,
  keyManager,
  addPublicKeys,
  disablePublicKeys,
  additionalKeyWifs,
) {
  // getMaster() fetches the identity, gets the master key (key 0),
  // creates a signer, and adds any additional WIFs for new keys
  const { identity, signer } = await keyManager.getMaster(additionalKeyWifs);

  // Update the identity on the platform.
  // addPublicKeys: array of public key objects to add
  // disablePublicKeys: array of public key IDs (numbers) to disable
  await sdk.identities.update({
    identity,
    addPublicKeys: addPublicKeys || undefined,
    disablePublicKeys: disablePublicKeys || undefined,
    signer,
  });

  return identity;
}

/* updateIdentity(
  sdk,
  keyManager,
  undefined,          // no keys to add
  [1],                // disable public key ID 1
)
  .then((d) => console.log('Identity updated:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e)); */

export { updateIdentity };
