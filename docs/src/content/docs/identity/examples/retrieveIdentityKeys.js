// Retrieve all public keys associated with an identity
const identityId = 'GgZekwh38XcWQTyWWWvmw6CEYFnLU7yiZFPWZEjqKHit';

const keys = await sdk.identities.getKeys({
  identityId,
  request: { type: 'all' },
});

console.log('Identity keys:', keys);

// Iterate over the returned keys
for (const key of keys) {
  console.log('Key ID:', key.id);
  console.log('Key purpose:', key.purpose);
  console.log('Key security level:', key.securityLevel);
}
