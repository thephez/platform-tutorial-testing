// Derive a platform address (bech32m) from a BIP39 mnemonic
// Uses BIP44 derivation path: m/44'/{coin}'/0'/0/{index}
//
// NOTE: Replace the placeholder mnemonic with a real BIP39 phrase.

const { wallet, PlatformAddressSigner, PrivateKey } = dash;

const mnemonic = 'your twelve word mnemonic phrase goes here replace with real words';
const network = 'testnet';
const index = 0;

const coin = network === 'testnet' ? 1 : 5;
const path = `m/44'/${coin}'/0'/0/${index}`;

const keyInfo = await wallet.deriveKeyFromSeedWithPath({
  mnemonic,
  path,
  network,
});
const obj = keyInfo.toObject();

// Derive the platform address (bech32m) from the private key
const privateKey = PrivateKey.fromWIF(obj.privateKeyWif);
const signer = new PlatformAddressSigner();
const platformAddress = signer.addKey(privateKey);

console.log('Derivation path:', path);
console.log('Platform address:', platformAddress.toBech32m(network));
console.log('Public key:', obj.publicKey);
