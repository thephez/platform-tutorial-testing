export async function getDocuments(
  sdk,
  dataContractId,
  documentTypeName,
  limit = 2,
) {
  return sdk.documents.query({
    dataContractId,
    documentTypeName,
    limit,
  });
}
