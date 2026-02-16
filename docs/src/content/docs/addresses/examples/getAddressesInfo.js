// Fetch information about multiple platform addresses in a single call
// Returns a Map of address to info (or undefined for unfunded addresses).
//
// NOTE: Replace the placeholder addresses with real bech32m platform addresses.
const addresses = [
  'tevo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
  'tevo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
];

const results = await sdk.addresses.getMany(addresses);

console.log('Address information:');
for (const [addr, info] of results) {
  if (info) {
    console.log('  Address:', addr.toString());
    console.log('  Balance (credits):', Number(info.balance));
    console.log('  Nonce:', Number(info.nonce));
  } else {
    console.log('  Address:', addr.toString(), '- Never funded');
  }
}
