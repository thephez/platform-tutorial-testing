export async function retrieveContract(sdk, contractId) {
  return sdk.contracts.fetch(contractId);
}
