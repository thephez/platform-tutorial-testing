export async function dapiClientMethods(sdk) {
  const status = await sdk.system.status();
  const currentEpoch = await sdk.epoch.current();
  return { status, currentEpoch };
}
