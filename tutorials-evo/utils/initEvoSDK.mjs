import { EvoSDK } from '@dashevo/evo-sdk';

/**
 * Initialize EvoSDK client
 * @param {Object} options - Configuration options
 * @param {string} options.network - Network type ('testnet' or 'mainnet')
 * @param {boolean} options.trusted - Use trusted mode (default: true)
 * @returns {Promise<EvoSDK>} Connected SDK instance
 */
async function initEvoSDK(options = {}) {
  const { network = 'testnet', trusted = true } = options;

  let sdk;

  if (network === 'testnet' && trusted) {
    // Use convenience method for testnet trusted connection
    sdk = EvoSDK.testnetTrusted();
  } else {
    // Use custom configuration
    sdk = new EvoSDK({
      network,
      trusted,
      proofs: true,
    });
  }

  // Connect to the network
  await sdk.connect();

  return sdk;
}

export default initEvoSDK;
