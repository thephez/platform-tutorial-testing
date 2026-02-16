// Retrieve token balances for one or more identities
const tokenId = 'Bu2749WKcP5HFNm8v3k5kshRKDSVyfsJMqoWnXmK4q7h';
const identityIds = [
  '7XcruVSsGQVSgTcmPewaE4tXLutnW1F6PXxwMbo8GYQC',
  'GgZekwh38XcWQTyWWWvmw6CEYFnLU7yiZFPWZEjqKHit',
];

const balances = await sdk.tokens.balances(identityIds, tokenId);

console.log('Token balances:');
for (const [id, balance] of balances) {
  console.log('  Identity:', id.toString(), '- Balance:', Number(balance));
}
