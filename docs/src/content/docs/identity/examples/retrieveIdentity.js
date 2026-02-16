// Retrieve an identity by its ID
const identityId = 'GgZekwh38XcWQTyWWWvmw6CEYFnLU7yiZFPWZEjqKHit';

const identity = await sdk.identities.fetch(identityId);

console.log('Identity retrieved:', identity);
console.log('Identity ID:', identity.id.toString());
console.log('Balance (credits):', Number(identity.balance));
console.log('Revision:', Number(identity.revision));
