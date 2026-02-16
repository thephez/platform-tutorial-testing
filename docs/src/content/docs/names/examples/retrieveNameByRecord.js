// Retrieve usernames registered to an identity
const identityId = 'GgZekwh38XcWQTyWWWvmw6CEYFnLU7yiZFPWZEjqKHit';

const names = await sdk.dpns.usernames({ identityId });

console.log('Names registered to identity:', names);

if (names && names.length > 0) {
  for (const name of names) {
    console.log('Username:', name);
  }
} else {
  console.log('No names found for this identity');
}
