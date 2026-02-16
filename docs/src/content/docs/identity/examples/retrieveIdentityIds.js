// Retrieve all identity IDs associated with a mnemonic
// by iterating DIP-9 identity indices until no identity is found.
//
// NOTE: Requires a mnemonic. Replace the placeholder below with
// a real BIP39 mnemonic phrase to use this example.

const { PrivateKey, wallet } = dash;

const mnemonic = 'your twelve word mnemonic phrase goes here replace with real words';
const network = 'testnet';
const coin = network === 'testnet' ? 1 : 5;
const identityIds = [];

for (let identityIndex = 0; ; identityIndex++) {
  const masterKey = await wallet.deriveKeyFromSeedWithPath({
    mnemonic,
    path: `m/9'/${coin}'/5'/0'/0'/${identityIndex}'/0'`,
    network,
  });
  const privateKey = PrivateKey.fromWIF(masterKey.toObject().privateKeyWif);
  const pubKeyHash = privateKey.getPublicKeyHash();
  const identity = await sdk.identities.byPublicKeyHash(pubKeyHash);
  if (!identity) break;
  identityIds.push(identity.id.toString());
}

console.log('Mnemonic identity IDs:', identityIds);
console.log('Total identities found:', identityIds.length);
