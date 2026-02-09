export async function retrieveIdentity(sdk, identityId) {
  return sdk.identities.fetch(identityId);
}
