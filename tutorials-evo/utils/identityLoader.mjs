import fs from 'fs';
import path from 'path';

/**
 * Load identity credentials from environment variables or file
 * @param {Object} options - Options for loading identity
 * @param {string} options.identityId - Identity ID from environment or direct input
 * @param {string} options.privateKey - Private key in WIF format from environment or direct input
 * @param {string} options.identityFile - Path to JSON file containing identity credentials
 * @returns {Object} Identity credentials { identityId, privateKey }
 */
function loadIdentity(options = {}) {
  const {
    identityId = process.env.EVO_IDENTITY_ID,
    privateKey = process.env.EVO_PRIVATE_KEY,
    identityFile = process.env.EVO_IDENTITY_FILE,
  } = options;

  // Load from file if specified
  if (identityFile) {
    const filePath = path.resolve(identityFile);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return {
        identityId: data.identityId || data.id,
        privateKey: data.privateKey,
      };
    }
    throw new Error(`Identity file not found: ${filePath}`);
  }

  // Load from environment variables or direct input
  if (!identityId || !privateKey) {
    throw new Error(
      'Identity credentials not found. Set EVO_IDENTITY_ID and EVO_PRIVATE_KEY environment variables, or provide identityFile path.',
    );
  }

  return {
    identityId,
    privateKey,
  };
}

export default loadIdentity;
