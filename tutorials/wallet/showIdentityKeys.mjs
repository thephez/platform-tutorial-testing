import 'dotenv/config';
import { wallet } from '@dashevo/evo-sdk';

const KEY_META = [
  {
    id: 0,
    name: 'Master',
    purpose: 'AUTHENTICATION',
    securityLevel: 'MASTER',
  },
  {
    id: 1,
    name: 'High Auth',
    purpose: 'AUTHENTICATION',
    securityLevel: 'HIGH',
  },
  {
    id: 2,
    name: 'Critical Auth',
    purpose: 'AUTHENTICATION',
    securityLevel: 'CRITICAL',
  },
  {
    id: 3,
    name: 'Transfer',
    purpose: 'TRANSFER',
    securityLevel: 'CRITICAL',
  },
  {
    id: 4,
    name: 'Encryption',
    purpose: 'ENCRYPTION',
    securityLevel: 'MEDIUM',
  },
];

const mnemonic = process.env.PLATFORM_MNEMONIC;
const network = process.env.NETWORK || 'testnet';

if (!mnemonic) {
  console.error('PLATFORM_MNEMONIC not set in .env');
  process.exit(1);
}

const coin = network === 'testnet' ? 1 : 5;
const identityIndex = 0;

const identityKeys = await Promise.all(
  KEY_META.map(async (meta) => {
    const path = `m/9'/${coin}'/5'/0'/0'/${identityIndex}'/${meta.id}'`;
    const derived = await wallet.deriveKeyFromSeedWithPath({
      mnemonic,
      path,
      network,
    });
    const obj = derived.toObject();
    return {
      id: meta.id,
      name: meta.name,
      keyType: 'ECDSA_SECP256K1',
      purpose: meta.purpose,
      securityLevel: meta.securityLevel,
      privateKeyWif: obj.privateKeyWif,
      privateKeyHex: obj.privateKeyHex,
      publicKeyHex: obj.publicKey,
      derivationPath: path,
    };
  }),
);

console.log(`Mnemonic: ${mnemonic}`);
console.log(`Network: ${network}`);
console.log(`\nIdentity keys (identity ${identityIndex}):`);
console.log(JSON.stringify(identityKeys, null, 2));
