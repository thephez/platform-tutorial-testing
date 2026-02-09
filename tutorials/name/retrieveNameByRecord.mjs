export async function retrieveNameByRecord(sdk, identityId) {
  // Retrieve usernames registered to an identity
  return sdk.dpns.usernames({ identityId });
}
