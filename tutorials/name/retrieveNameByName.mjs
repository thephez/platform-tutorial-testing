export async function retrieveNameByName(sdk, name) {
  // Resolve a full name (e.g., myname.dash) to its identity ID
  return sdk.dpns.resolveName(`${name}.dash`);
}
