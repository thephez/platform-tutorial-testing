// Retrieve the credit balance of an identity
const identityId = 'GgZekwh38XcWQTyWWWvmw6CEYFnLU7yiZFPWZEjqKHit';

const balance = await sdk.identities.balance(identityId);

console.log('Identity balance (credits):', Number(balance));

// Convert credits to Dash (1 Dash = 100,000,000,000 credits)
const dashBalance = Number(balance) / 1e11;
console.log('Identity balance (Dash):', dashBalance);
