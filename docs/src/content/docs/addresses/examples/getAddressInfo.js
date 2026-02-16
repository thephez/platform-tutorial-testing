// Fetch information about a single platform address
// Returns the address balance (in credits) and current nonce,
// or undefined if the address has never been funded.
//
// NOTE: Replace the placeholder address with a real bech32m platform address.
const address = 'tevo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';

const info = await sdk.addresses.get(address);

if (info) {
  console.log('Address info:', info);
  console.log('Balance (credits):', Number(info.balance));
  console.log('Nonce:', Number(info.nonce));
} else {
  console.log('Address has never been funded');
}
