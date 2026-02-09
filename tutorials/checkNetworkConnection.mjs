export async function checkNetworkConnection(sdk) {
  const status = await sdk.system.status();
  return status;
}
